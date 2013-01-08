try {
  var validate = require('../index.js').validate;
  var Rules = require('../index.js').Rules;
} catch(e) {
  failed('In loading', e);
}
var obj = {
  email : 'foo&invliad@email',
  firstName : 'Too long for just a firstname'
},
rules = {
  email : [{
    rule : Rules.email,
    message : 'Please enter a valied email',
  }, {
    rule : function(obj, fieldname, params, result) {
	     		// Access db , make sure the email does not exist
	        // mail is new, we should call back with true
	        // result(true)
	        // mail is already registered
	        result(false);
    },
    message : 'This email is already registered'
  }],
  firstName : [{
    rule : Rules.rang,
    message : 'First name must be between 6 and 12 charachters',
    min : 6,
    max : 12,
  }, {
    rule : Rules.alphaNumeric,
    message : 'First name must only contain alphanumeric charachters'
  },]
};

validate(obj, rules, function(errors) {
  if (errors === null) {
    console.log('obj validated fine');
  } else {
    console.log(errors);
  }
});

