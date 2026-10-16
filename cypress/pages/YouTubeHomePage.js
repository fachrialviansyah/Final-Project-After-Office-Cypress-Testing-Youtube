const GAMING_ENTRY = 'ytd-guide-entry-renderer a#endpoint[title="Gaming"]';

class YouTubeHomePage {
  open() {
    // Geo-IP picks UI language and region (e.g. Indonesian). YouTube's own PREF cookie pins English labels;
    // US region keeps video language = UI language, otherwise the watch page shows auto-translated titles.
    cy.setCookie('PREF', 'hl=en&gl=US', { domain: '.youtube.com' });
    cy.visit(Cypress.expose('YOUTUBE_BASE_URL'), {
      onBeforeLoad(win) {
        win.document.addEventListener('yt-navigate-finish', () => (win.ytNavigated = true));
      },
    });
    this.dismissConsent();
    cy.get('ytd-masthead', { timeout: 30000 }).should('be.visible');
    // Clicks before the SPA router finishes its first navigation are swallowed (entry highlights, page stays).
    cy.window({ timeout: 30000 }).its('ytNavigated').should('eq', true);
  }

  dismissConsent() {
    cy.location('hostname').then((host) => {
      // EU locales redirect to consent.youtube.com before the app loads.
      if (host.startsWith('consent.')) cy.get('form[action*="save"] button').last().click();
    });
    cy.get('body').then(($body) => {
      const accept = $body.find('ytd-consent-bump-v2-lightbox button[aria-label*="Accept"]');
      if (accept.length) cy.wrap(accept.first()).click();
    });
  }

  /** Full sidebar (ytd-guide-renderer); at narrow widths only the mini guide shows until the menu button is pressed. */
  guide() {
    return cy.get('body').then(($body) => {
      if (!$body.find('#guide-inner-content:visible').length) cy.get('#guide-button').click();
      return cy.get('#guide-inner-content').should('be.visible');
    });
  }

  selectGaming() {
    this.guide().then(($guide) => {
      // Gaming sits in the Explore group, which is collapsed behind "Show more" by default.
      if (!$guide.find(`${GAMING_ENTRY}:visible`).length) {
        cy.contains('ytd-guide-collapsible-entry-renderer #expander-item', 'Show more').click();
      }
    });
    cy.get(GAMING_ENTRY).should('be.visible').click();
  }
}

export default new YouTubeHomePage();
