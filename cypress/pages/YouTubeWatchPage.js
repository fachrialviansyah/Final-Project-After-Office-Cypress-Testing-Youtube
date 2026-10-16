import { normalize } from '../support/utils/text';

const META = 'ytd-watch-flexy:not([hidden]) ytd-watch-metadata';

class YouTubeWatchPage {
  readText(selector, label) {
    return cy
      .get(`${META} ${selector}`, { timeout: 30000 })
      .should(($el) => expect(normalize($el.text()), `${label} on watch page`).to.not.be.empty)
      .then(($el) => normalize($el.text()));
  }

  getTitle() {
    return this.readText('#title h1 yt-formatted-string', 'video title');
  }

  getChannelName() {
    return this.readText('#owner ytd-channel-name #text', 'channel name');
  }
}

export default new YouTubeWatchPage();
