import { buildProposal } from "../support/generate";

describe("Proposals", () => {
  it("Paid user can create proposals", () => {
    // paid user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
  });

  it("Non-paid user can not create proposals", () => {
    const user = {
      email: "user2@example.com",
      username: "user2",
      password: "password"
    };
    cy.typeLogin(user);
    cy.findByText(/new proposal/i).should("be.disabled");
    cy.visit("/proposals/new");
    cy.findByText(
      /you won't be able to submit comments or proposals before paying the paywall/i
    ).should("be.visible");
    const proposal = buildProposal();
    cy.findByTestId("proposal-name", { timeout: 10000 }).type(proposal.name);
    cy.findByTestId("text-area").type(proposal.description);
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
  });
});