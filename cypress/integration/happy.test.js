describe('Administrator Happy Path.', () => {
  it('Register, Create Quiz, Start Quiz, Stop Quiz, View Quiz Results, Logout, Login', () => {
    cy.server();
    cy.route('POST', '/admin/auth/login').as('login');
    cy.route('POST', '/admin/auth/register').as('register');
    cy.route('POST', '/admin/auth/login').as('logout');
    cy.route('POST', '/admin/quiz/new').as('createquiz');
    cy.route('GET', '/admin/quiz/**').as('getquiz');
    cy.route('PUT', '/admin/quiz/**').as('putquiz');
    cy.route('POST', '/admin/quiz/**/start').as('startquiz');
    cy.route('POST', '/admin/quiz/**/end').as('endquiz');

    cy.visit('http://localhost:3000/');

    cy.get('[test-marker="landing-to-login-btn"]')
      .click();

    cy.get('[test-marker="login-to-register-btn"]')
      .click();

    cy.get('[test-marker="register-name-input"]')
      .click()
      .clear()
      .type('cs6080 admin');

    cy.get('[test-marker="register-email-input"]')
      .click()
      .clear()
      .type('cs6080user@email.com');

    cy.get('[test-marker="register-password-input"]')
      .click()
      .clear()
      .type('password');

    cy.get('[test-marker="register-submit-btn"]')
      .click();

    cy.wait('@register')
      .then((e) => {
        expect(e.status).equals(200);
        expect(e.response.body).to.have.property('token');
      })

    cy.url()
      .should('eq', 'http://localhost:3000/dashboard');

    cy.get('[test-marker="create-new-quiz-button"]')
      .click();

    cy.get('[test-marker="new-quiz-name-input"]')
      .click()
      .clear()
      .type('my quiz');

    cy.get('[test-marker="new-quiz-create-btn"]')
      .click();

    cy.wait('@createquiz')
      .then((cqr) => {
        expect(cqr.status).equals(200);
        expect(cqr.response.body).to.have.property('quizId');

        cy.get('[test-marker="quiz-card-0"]')
          .click();

        cy.url()
          .should('eq', `http://localhost:3000/dashboard/game/${cqr.response.body.quizId}`);

        cy.wait('@getquiz')
          .then((gqr) => {
            expect(gqr.status).equals(200);
            expect(gqr.response.body).to.have.property('name');
            expect(gqr.response.body).to.have.property('owner');
            expect(gqr.response.body).to.have.property('questions');
            expect(gqr.response.body).to.have.property('active');
            expect(gqr.response.body).to.have.property('createdAt');
            expect(gqr.response.body).to.have.property('oldSessions');
            expect(gqr.response.body.owner).equals('cs6080user@email.com');
            expect(gqr.response.body.name).equals('my quiz');
            expect(gqr.response.body.questions.length).equals(0);
            expect(gqr.response.body.active).equals(null);
            expect(gqr.response.body.oldSessions.length).equals(0);

            cy.get('[test-marker="add-question-to-quiz-btn"]')
              .click();

            cy.url()
              .should('eq', `http://localhost:3000/dashboard/game/${cqr.response.body.quizId}/question/1`);

            cy.get('[test-marker="edit-game-question-input"]')
              .clear()
              .type('q1');

            cy.get('[test-marker="edit-game-answer-input-0"]')
              .clear()
              .type('a1');

            cy.get('[test-marker="edit-game-answer-input-1"]')
              .clear()
              .type('a2');

            cy.get('[test-marker="create-quiz-question-btn"]')
              .click();

            cy.wait('@putquiz')
              .then((pqr) => {
                expect(pqr.status).equals(200);

                cy.url()
                  .should('eq', `http://localhost:3000/dashboard/game/${cqr.response.body.quizId}`);
              })
          })
      })

    cy.get('[test-marker="to-dashbard-btn"]')
      .click();

    cy.url()
      .should('eq', 'http://localhost:3000/dashboard');

    cy.get('[test-marker="quiz-card-start-0"]')
      .click();

    cy.wait('@startquiz')
      .then((sqr) => {
        expect(sqr.status).equals(200);

        cy.get('[test-marker="close-session-popup"]')
          .click();

        cy.get('[test-marker="quiz-card-stop-0"]')
          .click();

        cy.wait('@endquiz')
          .then((eqr) => {
            expect(sqr.status).equals(200);

            cy.get('[test-marker="navigate-to-results-page-btn"]')
              .click();
          })

        cy.wait(4000); // Wait for Toast messages to clear up so that logout button is visible
        cy.get('[test-marker="logout-button"]')
          .first()
          .click();

        cy.get('[test-marker="landing-to-login-btn"]')
          .click();

        cy.get('[test-marker="login-email-input"]')
          .click()
          .clear()
          .type('cs6080user@email.com');

        cy.get('[test-marker="login-password-input"]')
          .click()
          .clear()
          .type('password');

        cy.get('[test-marker="login-button"]')
          .click();

        cy.url()
          .should('eq', 'http://localhost:3000/dashboard');
      })
  });
})
