/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuickViewUseComponent } from './quick-view-use.component';

describe('QuickViewUseComponent', () => {
  let component: QuickViewUseComponent;
  let fixture: ComponentFixture<QuickViewUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickViewUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickViewUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
