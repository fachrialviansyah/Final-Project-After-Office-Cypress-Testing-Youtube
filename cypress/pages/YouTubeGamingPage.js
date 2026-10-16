class YouTubeGamingPage {
  /** The "Trending videos" shelf, matched by its own header title rather than page position. */
  trendingSection() {
    return cy
      .contains('ytd-item-section-renderer ytd-rich-list-header-renderer #title', /^Trending videos$/, { timeout: 30000 })
      .closest('ytd-item-section-renderer');
  }

  // The header has two links to the same page (title and button); only the button is "View all".
  viewAllButton() {
    return this.trendingSection().find('#header-button a[aria-label="View all"]');
  }

  openTrending() {
    this.viewAllButton().should('be.visible').click();
  }
}

export default new YouTubeGamingPage();
