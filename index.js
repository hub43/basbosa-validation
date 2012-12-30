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
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(field === undefined) {
				if (obj.length != 24) {
					if(cb === 'function')	cb(false);
					return false;
				}
				if(cb === 'function')	cb(/[\da-f]{24}/.test(obj));
				return  /[\da-f]{24}/.test(obj);	
			} else {
				if (!BasbosaValidation.prototype.Rules.string(obj, field)) {
					if(cb === 'function')	cb(false);
					return false;
				}
				if (obj[field].length != 24) {
					if(cb === 'function')	cb(false);
					return false;
				}
				if(cb === 'function')	cb(/[\da-f]{24}/.test(obj[field]));
				return  /[\da-f]{24}/.test(obj[field]);	
			}
		},
		isPresent: function(obj, field, options, cb) {
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(cb === 'function')	cb(_.has(obj, field));
			return _.has(obj, field);
		},
		string: function(obj, field, options, cb) {
			if(typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(field === undefined) {
				if(cb === 'function') cb(_.isString(field));
				return  _.isString(field);
			} else {
				if(cb === 'function')	cb(BasbosaValidation.prototype.Rules.isPresent(obj, field) && _.isString(obj[field]));
				return BasbosaValidation.prototype.Rules.isPresent(obj, field) && _.isString(obj[field]);
			}
		},
		numeric: function(obj, field, options, cb) {
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  }
			if(field === undefined) {
				if(cb === 'function') cb(_.isNumber(obj));
				return  _.isNumber(obj);
			} else {
				if(cb === 'function')	cb(BasbosaValidation.prototype.Rules.isPresent(obj, field) && _.isNumber(obj[field]));
				return BasbosaValidation.prototype.Rules.isPresent(obj, field) && _.isNumber(obj[field]);
			}
		},
		url: function(obj, field, options, cb) {
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
				return (BasbosaValidation.prototype.Rules.urlPattern.test(field));
			} else {
				if(cb === 'function')	cb(BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
						BasbosaValidation.prototype.Rules.urlPattern.test(obj[field]));
				return BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
						BasbosaValidation.prototype.Rules.urlPattern.test(obj[field]);
			}
			
		},
		maxLength: function(obj, field, options, cb) {
			if (typeof options === 'function') {
		    cb = options;
		    options = undefined;
		  } 
			if(options === undefined) {
				options = field;
				field = obj;
				obj = undefined;
			}
			if(obj ===	undefined) {
				if(cb === 'function') cb((field.length >= options));
				return (field.length >= options);
			} else {
				if(cb === 'function') cb(BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
						(obj[field].length >= options));
				return BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
						(obj[field].length >= options);
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
				if(cb === 'function') cb(BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
						(obj[field].length <= options));
				return BasbosaValidation.prototype.Rules.isPresent(obj, field) && 
						(obj[field].length <= options);
			}
		},
		rang: function(obj, field, options, cb) {
			if(typeof options === 'function') {
				cb = options;
				options = field;
				field = obj;
				obj = undefined;
			}
			if(cb === 'function')	cb(BasbosaValidation.prototype.Rules.minLength(obj, field, options.max) && 
					BasbosaValidation.prototype.Rules.maxLength(obj, field, options.min));
			return BasbosaValidation.prototype.Rules.minLength(obj, field, options.max) && 
					BasbosaValidation.prototype.Rules.maxLength(obj, field, options.min);
		},
	};
	BasbosaValidation.prototype.validate = function(validator, msg, callback) {
		if(_.isEmpty(validator)) {
			typeof callback === 'function' && callback(false);
			return false;
		}	else {
			var validation_results = new Array();
			_.each(validator, function(fields) {
				_.each(fields, function(validators, key) {
					_.each(validators, function(obj) {
						if(_.isArray(obj)) {
							var func = _.first(obj);
							var args = _.union( [msg, key], _.rest(obj, 1) ); 
							if( func.length < _.size(args) ) {
								typeof callback === 'function' && callback(false);
								return false;
							} else if( func.length > _.size( args ) ) {
								typeof callback === 'function' && callback(false);
								return false;
							} else {
								validation_results.push( func.apply(null, args ) );
							}
						} else {
							validation_results.push(obj(msg, key));
						}
					});
				});
			});
			if (_.all(validation_results, _.identity)) {
				typeof callback === 'function' && callback(true);
				return true;
			} else {
				typeof callback === 'function' && callback(false);
				return false;
			}
		}
	};
	if (typeof instance === 'undefined') instance = new BasbosaValidation;
  if (typeof Basbosa !== 'undefined') Basbosa.add('BasbosaValidation', instance);
  return instance;
}));