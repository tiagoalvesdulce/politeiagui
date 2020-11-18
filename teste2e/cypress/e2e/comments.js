import { buildProposal, buildComment } from "../support/generate";

describe("User comments", () => {
  it("Can not comment if hasn't paid the paywall", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      // logout
      cy.logout(user);
      // login non-paid user
      const user3 = {
        email: "user3@example.com",
        username: "user3",
        password: "password"
      };
      cy.login(user3);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByRole("button", { name: /add comment/i }).should("be.disabled");
      cy.findByText(
        /you won't be able to submit comments or proposals before paying the paywall/i
      ).should("be.visible");
    });
  });

  it("Can comment, vote and reply if paid the paywall", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      // logout
      cy.logout(user);
      // login paid user
      const user1 = {
        email: "user1@example.com",
        username: "user1",
        password: "password"
      };
      cy.login(user1);
      cy.identity();
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      const { text } = buildComment();
      cy.findByTestId(/text-area/i).type(text);
      cy.route("POST", "/api/v1/comments/new").as("newComment");
      cy.findByText(/add comment/i).click();
      cy.wait("@newComment").its("status").should("eq", 200);
      cy.route("POST", "/api/v1/comments/like").as("likeComment");
      cy.findByTestId("like-btn").click();
      cy.wait("@likeComment", { timeout: 10000 })
        .its("status")
        .should("eq", 200);
      cy.findByText(/reply/i).click();
      cy.findAllByTestId(/text-area/i)
        .eq(1)
        .type(text);
      cy.findAllByText(/add comment/i)
        .eq(1)
        .click();
      cy.wait("@newComment").its("status").should("eq", 200);
    });
  });
});
