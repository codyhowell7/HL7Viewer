/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FindAllComponent } from './find-all.component';

describe('FindAllComponent', () => {
  let component: FindAllComponent;
  let fixture: ComponentFixture<FindAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
