const mocha = require("mocha");
const assert = require("assert");
const factorial = require("../src/utils/factorial");
const checkNums = {
    5:120,
    6:720,
    0:1,
    "-5":null,
    "-6":null
}

describe('Factorial', function () {
    describe("#factotial()",function(){
        for(const [key,value] of Object.entries(checkNums)) {
            it(`should return ${value}`, function () {
                assert.equal(factorial(parseInt(key)), value);
            });
        }
    });
});
