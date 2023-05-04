const assert = require('assert');
const  {add,digitsInNumber} = require('./../src/utils/functions');
const {IsSimple} = require("../src/utils/functions");

describe('Functions', function () {
    describe('#digitsInNumber()', function () {
        it('should return 10 for 5 and 5', function () {
            assert.equal(add(5,5),10);
        });

    });
});