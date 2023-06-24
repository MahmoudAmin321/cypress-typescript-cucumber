describe("Test suite", () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    cy.log("before each test in this suite");
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("test case 1", () => {
    cy.log("test1");
  });

  it("test case 2", () => {
    cy.log("test2");
  });
});
