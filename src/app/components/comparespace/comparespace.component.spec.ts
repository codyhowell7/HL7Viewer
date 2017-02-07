/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ComparespaceComponent } from './comparespace.component';

describe('ComparespaceComponent', () => {
  let component: ComparespaceComponent;
  let fixture: ComponentFixture<ComparespaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparespaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
