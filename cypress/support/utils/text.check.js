const assert = require('assert');
const { normalize } = require('./text');

assert.strictEqual(normalize('MINECRAFT ‪@BANGJBLOX‬'), 'MINECRAFT @BANGJBLOX');
assert.strictEqual(normalize('  a  \n b '), 'a b');
assert.notStrictEqual(normalize('Build Your Own Train!'), normalize('Rakit Kereta Sendiri!'));
assert.notStrictEqual(normalize('Title'), normalize('title'));
assert.strictEqual(normalize(undefined), '');
console.log('text.check: ok');
