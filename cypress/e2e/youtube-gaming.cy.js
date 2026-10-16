import homePage from '../pages/YouTubeHomePage';
import gamingPage from '../pages/YouTubeGamingPage';
import trendingPage from '../pages/YouTubeTrendingPage';
import watchPage from '../pages/YouTubeWatchPage';

const POSITION = 3;

describe('YouTube Gaming trending', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it(`opens trending gaming video #${POSITION} and matches its title and channel`, () => {
    // Step 1 — open YouTube
    homePage.open();
    cy.title().should('eq', 'YouTube');

    // Step 2 — Gaming from the sidebar
    homePage.selectGaming();
    cy.location('pathname').should('eq', '/gaming');
    cy.title().should('match', /^Gaming - YouTube$/);

    // Step 3 — "View all" of the Trending videos section
    gamingPage.trendingSection().should('be.visible');
    gamingPage.openTrending();
    cy.location('pathname', { timeout: 30000 }).should('eq', '/gaming/trending');
    trendingPage.header().should('have.text', 'Trending videos');
    trendingPage.videos().should('have.length.at.least', POSITION);

    // Step 4 — video #3 as currently listed
    trendingPage.getVideo(POSITION).then((expected) => {
      cy.addTestContext({ title: `Trending video #${POSITION}`, value: expected });
      const videoId = new URL(expected.href, 'https://www.youtube.com').searchParams.get('v');
      expect(videoId, 'video id in trending link').to.be.a('string').and.not.be.empty;

      trendingPage.openVideo(POSITION);
      cy.location('pathname', { timeout: 30000 }).should('eq', '/watch');
      cy.location('search').should('include', `v=${videoId}`);

      // Step 5 — title
      watchPage.getTitle().should('eq', expected.title);

      // Step 6 — channel name
      watchPage.getChannelName().should('eq', expected.channel);
    });
  });
});
