(function(root, factory) {
  if (typeof exports !== 'undefined') {
    // Node.js
    module.exports = factory(root);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
      // If Basbosa is loaded, do not register a global logger
      if (typeof Basbosa === 'undefined') {
        return root.BasbosaValidation = factory(root);
      }
      return factory(root);
    });
  } else {
    // Browser globals
    root.BasbosaValidation = factory(root);
  }
}(this, function(root) {

	var BasbosaValidation = function() {}, instance;
	var _ = require('underscore');
	var Async = require('async');
	BasbosaValidation.prototype.Rules = {
		urlPattern : new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?", "i"),
		isObjectId : function(obj, field, options, cb) {
			// Checks if field is an object id
			// (i.e. a 12 byte hex number, taking into consideration that it's represented in a string)
			// Check if field is a string (includes checking if it's present)
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(field === undefined) {
				if (obj.length != 24) {
					if(cb === 'function')	cb(false);
					return false;
				}
				// checking that each character represents a hex numbers using a regular expression
				if(cb === 'function')	cb(/[\da-f]{24}/.test(obj));
				return  /[\da-f]{24}/.test(obj);	
			} else {
				if (!this.string(obj, field)) {
					if(cb === 'function')	cb(false);
					return false;
				}
				// Check if length is 24 characters (i.e. 12 bytes)
				if (obj[field].length != 24) {
					if(cb === 'function')	cb(false);
					return false;
				}
				// checking that each character represents a hex numbers using a regular expression
				if(cb === 'function')	cb(/[\da-f]{24}/.test(obj[field]));
				return  /[\da-f]{24}/.test(obj[field]);	
			}
			
		},
		isPresent: function(obj, field, options, cb) {
			// Checks if field exists in a obj or not
			
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(cb === 'function')	cb(_.has(obj, field));
			return _.has(obj, field);
		},

		string: function(obj, field, options, cb) {
			// Checks if field inside obj is a string or not
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(field === undefined) {
				if(cb === 'function') cb(_.isString(field));
				return  _.isString(field);
			} else {
				if(cb === 'function')	cb(this.isPresent(obj, field) && _.isString(obj[field]));
				return this.isPresent(obj, field) && _.isString(obj[field]);
			}
			
			
		},
		numeric: function(obj, field, options, cb) {
			// Checks if field inside obj is an integer or not
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(field === undefined) {
				if(cb === 'function') cb(_.isNumber(obj));
				return  _.isNumber(obj);
			} else {
				if(cb === 'function')	cb(this.isPresent(obj, field) && _.isNumber(obj[field]));
				return this.isPresent(obj, field) && _.isNumber(obj[field]);
			}
			
		},
		url: function(obj, field, options, cb) {
			var self = this;
			// Checks if field inside obj is a url or not
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(options === undefined) {
				options = field ;
				field = obj;
				obj = undefined;
			}
			if(obj ===	undefined) {
				if(cb === 'function') cb(self.urlPattern.test(field));
				return (self.urlPattern.test(field));
			} else {
				if(cb === 'function')	cb(this.isPresent(obj, field) && self.urlPattern.test(obj[field]));
				return this.isPresent(obj, field) && self.urlPattern.test(obj[field]);
			}
			
		},
		/**
		 * @method isLargerThan used to check if the length of any string  is larger than specific number.
		 * @param {String} obj hold the message  that contain specific string that need t check on it.
		 * @param {String} field hold the string that need to check on it.
		 * @param {Number} min hold the number that need to limit the length of the string by it.
		 */
		maxLength: function(obj, field, options, cb) {
			// Checks if field inside obj is larger than the min value
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  } 
			if(options === undefined) {
				options = field ;
				field = obj;
				obj = undefined;
			}
			if(obj ===	undefined) {
				if(cb === 'function') cb((field.length >= options));
				return (field.length >= options);
			} else {
				if(cb === 'function') cb(this.isPresent(obj, field) && (obj[field].length >= options));
				return this.isPresent(obj, field) && (obj[field].length >= options);
			}
			
		},
		email :  function(obj, field, options, cb) {
			if (typeof field === 'function') {
		    cb = field;
		    options	= {};
		    field = {};
		  }
			if (typeof options === 'function') {
		    cb = options;
		    options = {};
		  }
			
			if(cb === 'function') {
				cb(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(obj));
			}
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(obj);
		},
		minLength: function(obj, field, options, cb) {
			var self = this;
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(options === undefined) {
				options = field ;
				field = obj;
				obj = undefined;
			}
			if(obj ===	undefined) {
				if(cb === 'function') cb(field.length <= options);
				return field.length <= options;
			} else {
				if(cb === 'function') cb(self.isPresent(obj, field) && (obj[field].length <= options));
				// Checks if field inside obj is smaller than the max value
				return self.isPresent(obj, field) && (obj[field].length <= options);
			}
		},
		rang: function(obj, field, options, cb) {
			// Checks if field inside obj is within the min and max values
			if(typeof options === 'function') {
				cb = options;
				options = field;
				field = obj;
				obj = undefined;
			}
			if(cb === 'function')	cb(this.minLength(obj, field, options.max) && this.maxLength(obj, field, options.min));
			return this.minLength(obj, field, options.max) && this.maxLength(obj, field, options.min);
		},


	};
	BasbosaValidation.prototype.validate = function(validator, msg, callback) {
	//Does the actual validation
		if(_.isEmpty(validator)) {
			// We either drop or pass a message with an empty validator here, except what happens
			// for authn.socket? There is nothing being passed in it
			// return true; was originally like this
			
			typeof callback === 'funcrion' && callback(false);
			return false; // now any message with empty validator will simply be dropped
	
		}	else { // Validate
			var validation_results = new Array();
			_.each(validator, function(fields) {
				_.each(fields, function(validators, key) {
					_.each(validators, function(obj) {
						// obj could be a function or an array that contains a function + extra paramters to be given
						// while invoking that function later on in the validation process
						// so first we check if it's an array
						if(_.isArray(obj)) {
							// handle this
							var func = _.first(obj);
							var args = _.union( [msg, key], _.rest(obj, 1) ); // We are ignoring the first item in obj array
							// since this is the validation function name that'll be called below
							if( func.length < _.size( args ) ) { // Arguments passed in validator must not be more
								// than expected function arguments
								typeof callback === 'funcrion' && callback(false);
								return false;
							} else if( func.length > _.size( args ) ) { // or less
								typeof callback === 'funcrion' && callback(false);
								return false;
							} else { // If we reach this final else, then they are equal
								validation_results.push( func.apply(null, args ) );
							}
						} else {
							// must have been a function
							validation_results.push(obj(msg, key));
						}
					});
	
				});
	
			});
	
			if (_.all(validation_results, _.identity)) {
				typeof callback === 'funcrion' && callback(true);
				return true;
			} else {
				typeof callback === 'funcrion' && callback(false);
				return false;
			}
		}
		console.log('hereeeeeeeeeee');
	};
	if (typeof instance === 'undefined') instance = new BasbosaValidation;
  if (typeof Basbosa !== 'undefined') Basbosa.add('BasbosaValidation', instance);
  return instance;
}));