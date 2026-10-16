// Invisible bidi controls YouTube wraps around @mentions on the watch page (U+200E/F, U+202A-E, U+2066-9).
const BIDI_CONTROLS = /[‎‏‪-‮⁦-⁩]/g;

// Strips invisible bidi controls and collapses whitespace (incl. NBSP); case, punctuation and emoji stay significant.
const normalize = (text) => (text || '').replace(BIDI_CONTROLS, '').replace(/\s+/g, ' ').trim();

module.exports = { normalize };
