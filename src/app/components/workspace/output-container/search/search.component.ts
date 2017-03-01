import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormArray } from '@angular/forms';
import { Map } from 'immutable';
import { MessageReader } from '../../../../../messageReader/messageReader';
import { IMessage, IConditionGroup, IAppState, ISearchConditions, ICondition } from '../../../../states/states';
import {
  ADD_SEARCH_CONDITION, ADD_SEARCH_GROUP_CONDITION, UPDATE_GROUP_OPERAND,
  UPDATE_SEARCH_OPERAND, DELETE_SINGLE_CONDITION, ADD_CONDITION_SIZE, ADD_GROUP_SIZE,
  NEW_SEARCH_RESULT, SAVE_SEARCH
} from '../../../../constants/constants';

@Component({
  selector: 'hls-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @select(['searchConditions']) $searchConditions: Observable<ISearchConditions>;
  @select(['searchConditionSize']) $searchConditionSize: Observable<Map<number, number>>;
  @select(['messages']) $messages: Observable<Map<number, IMessage>>;

  conditionGroups: ISearchConditions;
  conditionOperands = ['==', '!=', 'Like', 'Contains', '>', '<', '>=', '<='];
  functionOptions = ['', 'Length', 'Concat'];
  groupOperands = ['AND', 'OR'];
  searchOperands = ['AND', 'OR'];
  searchSize: Map<number, number>;
  messages: Map<number, IMessage>;
  selectedGroup: number = 0;
  localConditionGroups: ISearchConditions;
  generalSearch: string;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.$searchConditions.subscribe(condtions => {
      this.localConditionGroups = condtions;
    });

    this.$searchConditionSize.subscribe(size => {
      this.searchSize = size;
    });

    this.$messages.subscribe(message => {
      this.messages = message;
    });
    if (this.localConditionGroups == null) {
      let defaultCondition: ICondition = {
        leftValue: '',
        rightValue: '',
        conditionOperand: '==',
        functionModifier: '',
        conditionID: 0,
      };
      let defaultGroup: IConditionGroup = {
        conditions: Map<number, ICondition>().set(0, defaultCondition),
        groupOperand: 'AND',
        groupID: 0
      };
      this.localConditionGroups = {
        conditionGroups: Map<number, IConditionGroup>().set(0, defaultGroup),
        searchOperand: 'OR'
      };
    }
  }
  mainSearch() {
    let generalMessageSearch = new MessageReader();

    this.ngRedux.dispatch({
      type: NEW_SEARCH_RESULT,
      payload: {
        messageFilterMap: generalMessageSearch.generalSearch(this.messages, this.generalSearch)
      }
    });
  }

  getConditionGroups() {
    return this.localConditionGroups.conditionGroups.valueSeq();
  }

  getConditions(groupConditionId: number) {
    return this.localConditionGroups.conditionGroups.get(groupConditionId).conditions.valueSeq();
  }

  getCondition(groupConditionId: number, conditionId: number) {
    return this.localConditionGroups.conditionGroups.get(groupConditionId).conditions.get(conditionId);
  }

  getConditionOperand(groupConditionId: number, conditionId: number) {
    return this.localConditionGroups.conditionGroups.get(groupConditionId).conditions.get(conditionId).conditionOperand;
  }

  getGroupOperand(group: number) {
    return this.localConditionGroups.conditionGroups.get(group).groupOperand;
  }

  getSearchOperand() {
    return this.localConditionGroups.searchOperand;
  }

  onSelectionChange(currentGroupBox: number) {
    this.selectedGroup = currentGroupBox;
  }

  addCondition() {
    if (this.localConditionGroups.conditionGroups.get(this.selectedGroup) != null) {
      this.ngRedux.dispatch({
        type: ADD_CONDITION_SIZE
      });
      let condition: ICondition = {
        leftValue: '',
        rightValue: '',
        conditionOperand: '==',
        functionModifier: '',
        conditionID: this.searchSize.valueSeq().max()
      };
      let conidtionGroup: IConditionGroup = {
        conditions: this.localConditionGroups.conditionGroups.get(this.selectedGroup)
          .conditions.set(this.searchSize.valueSeq().max(), condition),
        groupID: this.selectedGroup,
        groupOperand: this.localConditionGroups.conditionGroups.get(this.selectedGroup).groupOperand
      };
      this.localConditionGroups = {
        conditionGroups: this.localConditionGroups.conditionGroups.set(this.selectedGroup, conidtionGroup),
        searchOperand: this.localConditionGroups.searchOperand
      };
    }
  }

  addConditionGroup() {
    this.ngRedux.dispatch({
      type: ADD_GROUP_SIZE
    });
    let condition: ICondition = {
      leftValue: '',
      rightValue: '',
      conditionOperand: '==',
      functionModifier: '',
      conditionID: this.searchSize.valueSeq().max()
    };
    let conidtionGroup: IConditionGroup = {
      conditions: Map<number, ICondition>().set(this.searchSize.valueSeq().max(), condition),
      groupID: this.searchSize.keySeq().max(),
      groupOperand: 'AND'
    };
    this.localConditionGroups = {
      conditionGroups: this.localConditionGroups.conditionGroups.set(this.searchSize.keySeq().max(), conidtionGroup),
      searchOperand: this.localConditionGroups.searchOperand
    };
    this.selectedGroup = this.searchSize.keySeq().max();
  }

  updateSearchOperand(newSearchOperand: 'AND' | 'OR') {
    this.localConditionGroups = {
      conditionGroups: this.localConditionGroups.conditionGroups,
      searchOperand: newSearchOperand
    };
  }

  deleteSingleCondition(groupId: number, conditionId: number) {
    let deleteCondtion: IConditionGroup = {
      conditions: this.localConditionGroups.conditionGroups.get(groupId).conditions.delete(conditionId),
      groupOperand: this.localConditionGroups.conditionGroups.get(groupId).groupOperand,
      groupID: groupId,
    };
    let newState: ISearchConditions = {
      conditionGroups: this.localConditionGroups.conditionGroups.set(groupId, deleteCondtion),
      searchOperand: this.localConditionGroups.searchOperand
    };
    if (this.localConditionGroups.conditionGroups.get(groupId).conditions.size === 1) {
      newState = {
        conditionGroups: this.localConditionGroups.conditionGroups.delete(groupId),
        searchOperand: this.localConditionGroups.searchOperand
      };
    }
    this.localConditionGroups = newState;
  }

  updateLeftValue(value: string, conditionId: number, groupId: number) {
    let condition: ICondition = {
      leftValue: value,
      rightValue: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).rightValue,
      conditionOperand: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).conditionOperand,
      conditionID: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).conditionID,
      functionModifier: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).functionModifier
    };
    let conidtionGroup: IConditionGroup = {
      conditions: this.localConditionGroups.conditionGroups.get(groupId).conditions.set(conditionId, condition),
      groupID: this.localConditionGroups.conditionGroups.get(groupId).groupID,
      groupOperand: this.localConditionGroups.conditionGroups.get(groupId).groupOperand
    };
    this.localConditionGroups = {
      conditionGroups: this.localConditionGroups.conditionGroups.set(groupId, conidtionGroup),
      searchOperand: this.localConditionGroups.searchOperand
    };
  }

  getLeftValue(conditionId: number, groupId) {
    return this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).leftValue;
  }

  updateRightValue(value: string, conditionId: number, groupId: number) {
    let condition: ICondition = {
      leftValue: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).leftValue,
      rightValue: value,
      conditionOperand: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).conditionOperand,
      conditionID: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).conditionID,
      functionModifier: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).functionModifier
    };
    let conidtionGroup: IConditionGroup = {
      conditions: this.localConditionGroups.conditionGroups.get(groupId).conditions.set(conditionId, condition),
      groupID: this.localConditionGroups.conditionGroups.get(groupId).groupID,
      groupOperand: this.localConditionGroups.conditionGroups.get(groupId).groupOperand
    };
    this.localConditionGroups = {
      conditionGroups: this.localConditionGroups.conditionGroups.set(groupId, conidtionGroup),
      searchOperand: this.localConditionGroups.searchOperand
    };
  }

  getRightValue(conditionId: number, groupId: number) {
    return this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).rightValue;
  }

  updateFunctionModifier(value: ''|'Length'|'Concat', conditionId: number, groupId: number ) {
    let condition: ICondition = {
      leftValue: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).leftValue,
      rightValue: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).rightValue,
      conditionOperand: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).conditionOperand,
      conditionID: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).conditionID,
      functionModifier: value
    };
    let conidtionGroup: IConditionGroup = {
      conditions: this.localConditionGroups.conditionGroups.get(groupId).conditions.set(conditionId, condition),
      groupID: this.localConditionGroups.conditionGroups.get(groupId).groupID,
      groupOperand: this.localConditionGroups.conditionGroups.get(groupId).groupOperand
    };
    this.localConditionGroups = {
      conditionGroups: this.localConditionGroups.conditionGroups.set(groupId, conidtionGroup),
      searchOperand: this.localConditionGroups.searchOperand
    };
  }

  getFunctionModifier(conidtionId: number, groupId: number) {
    return this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conidtionId).functionModifier;
  }

  updateConidtionOperand(value, conditionId: number, groupId: number) {
    let condition: ICondition = {
      leftValue: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).leftValue,
      rightValue: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).rightValue,
      conditionOperand: value,
      conditionID: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).conditionID,
      functionModifier: this.localConditionGroups.conditionGroups.get(groupId).conditions.get(conditionId).functionModifier
    };
    let conidtionGroup: IConditionGroup = {
      conditions: this.localConditionGroups.conditionGroups.get(groupId).conditions.set(conditionId, condition),
      groupID: this.localConditionGroups.conditionGroups.get(groupId).groupID,
      groupOperand: this.localConditionGroups.conditionGroups.get(groupId).groupOperand
    };
    this.localConditionGroups = {
      conditionGroups: this.localConditionGroups.conditionGroups.set(groupId, conidtionGroup),
      searchOperand: this.localConditionGroups.searchOperand
    };
  }

  updateGroupOperand(value, groupId: number) {
    let conidtionGroup: IConditionGroup = {
      conditions: this.localConditionGroups.conditionGroups.get(groupId).conditions,
      groupID: groupId,
      groupOperand: value
    };
    this.localConditionGroups = {
      conditionGroups: this.localConditionGroups.conditionGroups.set(groupId, conidtionGroup),
      searchOperand: this.localConditionGroups.searchOperand
    };
  }


  search() {
    this.ngRedux.dispatch({
      type: SAVE_SEARCH,
      payload: {
        search: this.localConditionGroups
      }
    });

    let messageSearch = new MessageReader;

    this.ngRedux.dispatch({
      type: NEW_SEARCH_RESULT,
      payload: {
        messageFilterMap: messageSearch.searchResults(this.messages, this.localConditionGroups)
      }
    });
  }



}
