import { Angular2HL7ViewerPage } from './app.po';

describe('angular2-hl7-viewer App', function() {
  let page: Angular2HL7ViewerPage;

  beforeEach(() => {
    page = new Angular2HL7ViewerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
