Cypress.Commands.add('joinAsPlayer', (uid) => {
  cy.visit('http://localhost:3000');
  cy.log(uid);
  cy.window().its('sessionStorage').invoke('setItem', 'uid', uid);
  cy.wait(1000);
  cy.reload();
});

describe('visiting /', () => {
  let p1 = 0;
  let p2 = 0;
  it('should join the lobby as player 1', () => {
    cy.visit('http://localhost:3000');
    cy.window().its('sessionStorage').invoke('getItem', 'uid').then((uid) => {
      p1 = uid;
    });
    cy.get('#player-1').should('contain', 'player 1');
  });

  it('should join the lobby as player 2', () => {
    cy.visit('http://localhost:3000');
    cy.window().its('sessionStorage').invoke('getItem', 'uid').then((uid) => {
      p2 = uid;
    });
    cy.get('#player-2').should('contain', 'player 2');
  });

  it('should join the lobby as a spectator', () => {
    cy.visit('http://localhost:3000');
    cy.get('#player-3').should('contain', 'spectating');
  });

  it('can make a move as player 1', () => {
    cy.joinAsPlayer(p1);
    cy.get('#player-1').should('contain', 'player 1');
    cy.get('#square-0').click();
    cy.get('#square-0').should('have.class', 'player-1');
  });

  it('cant move twice in a row', () => {
    cy.joinAsPlayer(p1);
    cy.get('#player-1').should('contain', 'player 1');
    cy.get('#square-0').click();
    cy.get('#square-0').should('have.class', 'player-1');
    cy.get('#square-1').click();
    cy.get('#square-1').should('not.have.class', 'player-1');
  });

  it('doesnt allow player 2 to click already clicked square', () => {
    cy.joinAsPlayer(p2);
    cy.get('#player-2').should('contain', 'player 2');
    cy.get('#square-0').click();
    cy.get('#square-0').should('have.class', 'player-1');
    cy.get('#square-0').should('not.have.class', 'player-2');
  });

  it('allows player 2 to click anything else', () => {
    cy.joinAsPlayer(p2);
    cy.get('#player-2').should('contain', 'player 2');
    cy.get('#square-1').click();
    cy.get('#square-1').should('have.class', 'player-2');
  });
});
