export class CustomSegment {
    segmentName: string;
    newFields: { fieldNum: number, fieldDef: string };

    constructor(segName: string, fieldNums: number[], fieldDefs: string[]) {
        this.buildNewSegment(segName, fieldNums, fieldDefs);
    }

    buildNewSegment(segName: string, fieldNums: number[], fieldDefs: string[]) {
        if ( segName.length !== 3) {
            throw 'Something';
        }
        this.segmentName = segName;
        fieldNums.forEach((element, index) => {
            this.newFields = ({ fieldNum: element, fieldDef: fieldDefs[index] });
        });
    }
}
