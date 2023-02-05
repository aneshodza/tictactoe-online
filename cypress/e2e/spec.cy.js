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
    cy.visit('http://localhost:3000');
    cy.window().its('sessionStorage').invoke('setItem', 'uid', p1);
    cy.reload();
    cy.get('#player-1').should('contain', 'player 1');
    cy.get('#square-0').click();
    cy.get('#square-0').should('have.class', 'player-1');
  });

  it('cant move twice in a row', () => {
    cy.visit('http://localhost:3000');
    cy.window().its('sessionStorage').invoke('setItem', 'uid', p1);
    cy.reload();
    cy.get('#player-1').should('contain', 'player 1');
    cy.get('#square-0').click();
    cy.get('#square-0').should('have.class', 'player-1');
    cy.get('#square-1').click();
    cy.get('#square-1').should('not.have.class', 'player-1');
  });
});
