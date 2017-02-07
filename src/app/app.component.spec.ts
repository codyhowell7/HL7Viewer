/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Parser } from '../parser/parse';

describe('1st tests', () => {
  it('test control id', () => expect(messageControlIdTest).toBe('LYNX.46848.000014172'));
  it('test segment name', () => expect(segmentNameTest).toBe('MSH'));
  it('test encoding chars', () => expect(encodingCharTest).toBe(false));
  it('test encoding chars2', () => expect(encodingCharTest2).toBe(false));
});

let parser = new Parser;
let MSH = parser.parseHL7Message('MSH|^~\&|OTNLYNX||Centricity||201612271234||DFT^P03|LYNX.46848.000014172|P|2.3|');
let messageControlIdTest = MSH.HL7MessageControllerId;
let segmentNameTest = MSH.HL7Segments[0].Name;
let encodingCharTest = MSH.HL7Segments[0].HL7Fields[1].HasHL7Components === true;
let encodingCharTest2 = MSH.HL7Segments[0].HL7Fields[1].HasRepetition === true;
