import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { Map } from 'immutable';

import { IMessage, IConditionGroup, IAppState, ISearchConditions } from '../../../../states/states';
import {
  ADD_SEARCH_CONDITION, ADD_SEARCH_GROUP_CONDITION, UPDATE_GROUP_OPERAND,
  UPDATE_SEARCH_OPERAND, DELETE_SINGLE_CONDITION, ADD_CONDITION_SIZE, ADD_GROUP_SIZE
} from '../../../../constants/constants';

@Component({
  selector: 'hls-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @select(['searchConditions']) $searchConditions: Observable<ISearchConditions>;
  @select(['searchConditionSize']) $searchConditionSize: Observable<Map<number, number>>;

  conditionGroups: ISearchConditions;
  searchControl: FormControl = new FormControl();
  conditionOperands = ['==', '!=', 'Like', 'Contains', '>', '<', '>=', '<='];
  groupOperands = ['AND', 'OR'];
  searchOperands = ['AND', 'OR'];
  searchSize: Map<number, number>;

  selectedGroup: number = 0;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.$searchConditions.subscribe(condtions => {
      this.conditionGroups = condtions;
    });

    this.$searchConditionSize.subscribe(size => {
      this.searchSize = size;
    });
  }
  getConditionGroups() {
    return this.conditionGroups.conditionGroups.valueSeq();
  }

  getConditions(groupConidtionId: number) {
    return this.conditionGroups.conditionGroups.get(groupConidtionId).conditions.valueSeq();
  }

  getCondition(groupConditionId: number, conditionId: number) {
    return this.conditionGroups.conditionGroups.get(groupConditionId).conditions.get(conditionId);
  }

  getConditionOperand(groupConditionId: number, conditionId: number) {
    return this.conditionGroups.conditionGroups.get(groupConditionId).conditions.get(conditionId).conditionOperand;
  }

  onSelectionChange(currentGroupBox: number) {
    this.selectedGroup = currentGroupBox;
  }

  getGroupOperand(group: number) {
    return this.conditionGroups.conditionGroups.get(group).groupOperand;
  }

  getSearchOperand() {
    return this.conditionGroups.searchOperand;
  }

  addCondition() {
    this.ngRedux.dispatch({
      type: ADD_CONDITION_SIZE
    });
    this.ngRedux.dispatch({
      type: ADD_SEARCH_CONDITION,
      payload: {
        leftValue: '',
        rightValue: '',
        conditionOperand: '==',
        conditionGroupID: this.selectedGroup,
        conditionID: this.searchSize.valueSeq().max()
      }
    });
  }
  addConditionGroup() {
    this.ngRedux.dispatch({
      type: ADD_GROUP_SIZE
    });
    this.ngRedux.dispatch({
      type: ADD_SEARCH_GROUP_CONDITION,
      payload: {
        conditionGroupID: this.searchSize.keySeq().max(),
        conditionID: this.searchSize.valueSeq().max()
      }
    });
    this.selectedGroup = this.searchSize.keySeq().max();
  }

  updateGroupOperand(groupId: number, newGroupOperand: 'AND' | 'OR') {
    this.ngRedux.dispatch({
      type: UPDATE_GROUP_OPERAND,
      payload: {
        id: groupId,
        conditionGroupOperand: newGroupOperand
      }
    });
  }

  updateSearchOperand(newSearchOperand: 'AND' | 'OR') {
    this.ngRedux.dispatch({
      type: UPDATE_SEARCH_OPERAND,
      payload: newSearchOperand
    });
  }

  deleteSingleCondition(groupId: number, conditionId: number) {
    this.ngRedux.dispatch({
      type: DELETE_SINGLE_CONDITION,
      payload: {
        conditionGroupID: groupId,
        conditionID: conditionId
      }
    });
  }



}
