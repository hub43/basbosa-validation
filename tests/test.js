try {
  var validate = require('../index.js').validate;
  var Rules = require('../index.js').Rules;
} catch(e) {
  failed('In loading', e);
}
console.log(Rules.minLength('ssssss',6));
console.log(Rules.rang('ssssss',6,10));
console.log(Rules.isObjectId('4fb212dd6c379e2810000000'));
console.log(Rules.isPresent({ss:'ddddd'},'ss'));
console.log(Rules.string({ssssss:'ddddd'},'ssssss'));
console.log(Rules.numeric(1234));
console.log(Rules.url('http://www.hub43.com'));
console.log(Rules.maxLength({ss:'ddddd'},'ss',2));
console.log(Rules.email('nfutoam@h.com'));
