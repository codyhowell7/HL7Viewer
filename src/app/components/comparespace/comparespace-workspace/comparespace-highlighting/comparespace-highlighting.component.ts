import { Component, OnInit, Input } from '@angular/core';
import { HL7Segment } from '../../../../../parser/hl7Segment';
import { IMessageDiscrepancies } from '../../../../../messageReader/IMessageDiscrepancies';

@Component({
  selector: 'hls-comparespace-highlighting',
  templateUrl: './comparespace-highlighting.component.html',
  styleUrls: ['./comparespace-highlighting.component.scss']
})
export class ComparespaceHighlightingComponent implements OnInit {

  @Input() segment: HL7Segment;
  @Input() discrepancies: IMessageDiscrepancies;
  @Input() leftSide: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  missingSegment(segment: HL7Segment) {
    if (this.leftSide) {
      if (segment != null && this.discrepancies.message1.get(segment.segmentIndex) != null) {
        if (this.discrepancies.message1.get(segment.segmentIndex).missing) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    } else {
      if (segment != null && this.discrepancies.message2.get(segment.segmentIndex) != null) {
        if (this.discrepancies.message2.get(segment.segmentIndex).missing) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }
  }

}
