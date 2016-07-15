var assert = require('chai').assert;

/**
 * Example from off docs
 */
describe('Array', function () {
    describe('#component1', function () {
        it('Annotation', function() {
            assert.equal(-1, [1,2,3].indexOf(5));
        });
    });
});