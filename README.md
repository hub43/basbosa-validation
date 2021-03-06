basbosa-validation
==================

A JavaScript module for object validation using callback functions

Usage
------

```javascript
var Rules = require('basbosa-validation').Rules,
  validate = require('basbosa-validation').validate,
  obj = {
    email : 'foo&invliad@email',
    firstName : 'Too long for just a first name'
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
```  
### On browsers
```html
  <script src="basbosa.validation-0.0.1.min.js" type="text/javascript"></script>
  <script>
   var Rules = BasbosaValidation.Rules,
      validate = BasbosaValidation.validate;
      // same as on nodejs ...
