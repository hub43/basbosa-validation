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
	function checkArguments(obj, field) {
		if(field === undefined || field ==='function') return false;
		if(obj !== undefined && field !== 'function') return true;
	};
	function finalize (one, second, returned) {
		if(one === 'function') {
			second = one;
		}
		typeof second === 'function' && second(returned);
		return returned;
	};
	BasbosaValidation.prototype.Rules = {
		urlPattern : new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?", "i"),
		isObjectId : function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				result =  BasbosaValidation.prototype.Rules.string(obj, field) && 
									!(obj[field].length != 24) && (/[\da-f]{24}/.test(obj[field]));
				return finalize(options, cb ,result);
			} else {
				result = !(obj[field].length != 24) && (/[\da-f]{24}/.test(obj));
				return finalize(field, cb , result);
			}
		},
		isPresent: function(obj, field, options, cb) {
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			typeof cb === 'function' &&	cb(_.has(obj, field));
			return _.has(obj, field);
		},
		string: function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				result = BasbosaValidation.prototype.Rules.isPresent(obj, field) && _.isString(obj[field]);
				return finalize(options, cb , result);
			} else {
				result = _.isString(obj);
				return finalize(field, cb, result);
			}
		},
		numeric: function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				result = BasbosaValidation.prototype.Rules.isPresent(obj, field) && _.isNumber(obj[field]);
				return finalize(options, cb , result);
			} else {
				result = _.isNumber(obj);
				return finalize(field, cb, result);
			}
		},
		url: function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				result = BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
								BasbosaValidation.prototype.Rules.urlPattern.test(obj[field]);
				return finalize(options, cb , result);
			} else {
				result = BasbosaValidation.prototype.Rules.urlPattern.test(obj);
				return finalize(field, cb, result);
			}
		},
		maxLength: function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				if(BasbosaValidation.prototype.Rules.isPresent(obj, field)) {
					result = obj[field].length >= options.max;
					return finalize(options, cb , result);
				} else {
					result = obj.length >= field.max;
					return finalize(options, cb , result);
				}	
			}
		},
		email :  function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				result = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(obj[field]);
				return finalize(options, cb , result);
			} else {
				result = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(obj);
				return finalize(field, cb , result);
			}
		},
		minLength: function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				if(BasbosaValidation.prototype.Rules.isPresent(obj, field)) {
					result = obj[field].length <= options.min;
					return finalize(options, cb , result);
				} else {
					result = obj.length <= field.min;
					return finalize(options, cb , result);
				}	
			}
		},
		rang: function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				if(BasbosaValidation.prototype.Rules.isPresent(obj, field)) {
					result = BasbosaValidation.prototype.Rules.minLength(obj, field, {min:	options.max}) && 
									BasbosaValidation.prototype.Rules.maxLength(obj, field, {max:	options.min});
					return finalize(options, cb , result);
				}
			}
		},
		isUnique: function(obj, field, options, cb) {
			
		},
		alphaNumeric: function(obj, field, options, cb) {
			var result ;
			if(checkArguments(obj, field)) {
				result = BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
								(/^[A-Za-z]*$|^[A-Za-z][A-Za-z0-9]*$/i.test(obj[field]));
				return finalize(options, cb , result);
			} else {
				result = /^[A-Za-z]*$|^[A-Za-z][A-Za-z0-9]*$/i.test(obj);
				return finalize(field, cb , result);
			}
		},
		extension: function(obj, field, options, cb) {
			var result ;
			var partOne = "/\.(", partTwo = ")$/i";
			if(checkArguments(obj, field)) {
				if(BasbosaValidation.prototype.Rules.isPresent(obj, field)) {
					result = (partOne + options.extension + partTwo).test(obj[field]);
					return finalize(options, cb , result);
				} else {
					result = (partOne + field.extension + partTwo).test(obj);
					return finalize(options, cb , result);
				}	
			}		
		}
	};
	BasbosaValidation.prototype.validate = function(obj, rules, callback) {
		var rulesFunctions = [];
		if(_.isEmpty(rules)) typeof callback === 'function' && callback(null, true);
		_.each(rules, function(validationRules, fieldName) {
			_.each(validationRules, function(rule) {
				rulesFunctions.push(function(cb) {
					rule.rule(obj,fieldName,{min: rule.min, max: rule.max}, function(result) {
						if(!result) cb(rule.message);
						if(result) cb(null, result);
					});
				});
			});
		});
		Async.parallel(rulesFunctions, function(error, result) {
			if(error) {
				typeof callback === 'function' && callback(error);
			} else {
				if(result) typeof callback === 'function' && callback(null, result);
			}
			
		});
	};
	if (typeof instance === 'undefined') instance = new BasbosaValidation;
  if (typeof Basbosa !== 'undefined') Basbosa.add('BasbosaValidation', instance);
  return instance;
}));