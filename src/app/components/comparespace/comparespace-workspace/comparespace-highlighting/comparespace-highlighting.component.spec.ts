/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ComparespaceHighlightingComponent } from './comparespace-highlighting.component';

describe('ComparespaceHighlightingComponent', () => {
  let component: ComparespaceHighlightingComponent;
  let fixture: ComponentFixture<ComparespaceHighlightingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparespaceHighlightingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparespaceHighlightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
