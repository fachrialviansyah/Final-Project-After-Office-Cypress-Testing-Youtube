import { normalize } from '../support/utils/text';

// YouTube keeps earlier pages in hidden ytd-browse elements, so the list is taken from the visible section only.
const LIST = 'ytd-item-section-renderer:has(ytd-grid-renderer)';
// Only real video tiles of the trending grid count; ads and other shelves render as different elements.
const VIDEO = 'ytd-grid-renderer #items > ytd-grid-video-renderer';

class YouTubeTrendingPage {
  list() {
    return cy.get(LIST, { timeout: 30000 }).filter(':visible').should('have.length', 1);
  }

  header() {
    return this.list().find('ytd-shelf-renderer #title-container #title');
  }

  videos() {
    return this.list().find(VIDEO);
  }

  /** Yields { position, title, channel, href } of the n-th (1-based) video in the trending grid. */
  getVideo(position) {
    return this.videos()
      .should('have.length.at.least', position)
      .eq(position - 1)
      .scrollIntoView()
      .should(($v) => {
        // Tiles are lazily filled; wait until title and channel text are rendered.
        expect(normalize($v.find('a#video-title').text()), `title of trending video #${position}`).to.not.be.empty;
        expect(normalize($v.find('ytd-channel-name #text').text()), `channel of trending video #${position}`).to.not.be.empty;
      })
      .then(($v) => ({
        position,
        title: normalize($v.find('a#video-title').text()),
        channel: normalize($v.find('ytd-channel-name #text').text()),
        href: $v.find('a#video-title').attr('href'),
      }));
  }

  openVideo(position) {
    this.videos().eq(position - 1).find('a#video-title').click();
  }
}

export default new YouTubeTrendingPage();
