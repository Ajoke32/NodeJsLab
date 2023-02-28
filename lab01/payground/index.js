import pkg from 'lodash/seq.js';
const {lodash: loads} = pkg;


console.log(loads.chunk(['a',1,'12','b'],1)); // розбиває масив на частини по заданому розміру

let nums = [1,2,30,40,5,6];

console.log(loads.takeWhile(nums, i=>i<20)); // створює зріз масиву до тих пір поки предикат повертає false

console.log(loads.intersection([2,4,'a','b'],['c',2,'a',9])); // повертає елементи, які є в першому та другому масиві

console.log(loads.fromPairs([['name','Nick'],['age',19]])); // розбиває масиви на ключ/значення об'єкт

console.log(loads.split('j,s,o,n',',')); // розбиває масив на рядки по сепаратору