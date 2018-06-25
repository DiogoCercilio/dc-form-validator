
(function (global) {
    'use strict';

    function DCValidator(formObj) {

        if (!formObj.form) throw new Error(ERRORS.EMPTY_FORM_ID);
        if (!formObj.onError || !formObj.offError) throw new Error(ERRORS.ON_ERROR_EMPTY_WARNING);
        if (!formObj.onFormValid || !formObj.onFormInvalid) throw new Error(ERRORS.ON_VALID_EMPTY_WARNING);

        this.form = document.querySelector(formObj.form);
        this.inputs = this.form.querySelectorAll('[data-rule]');
        this.submit = this.form.querySelector('[type="submit"]');
        this.errorListeners = formObj.errorListeners || ["blur"];

        if (!this.inputs.length) console.warn(ERRORS.NO_RULES_FOUND);
        if (this.submit.length > 1) throw new Error(ERRORS.MULTIPLE_SUBMIT);

        this.onError = function(input) {
            formObj.onError ? formObj.onError(input) : null;
        };

        this.offError = function(input) {
            formObj.offError ? formObj.offError(input) : null;
        };	

        this.onFormValid = function() {
            formObj.onFormValid ? formObj.onFormValid(this.form, this.submit) : null;
        };

        this.onFormInvalid = function() {
            formObj.onFormInvalid ? formObj.onFormInvalid(this.form, this.submit) : null;
        };	

        this.onSubmit = function() {
            formObj.onSubmit ? formObj.onSubmit(this.form, this.submit) : null;
        };			

        this.rules = this.getCoreRules();

        if (formObj.rules) this.setCustomRules(formObj.rules);

        var self = this;

        if (formObj.listeners && formObj.listeners.submit) delete formObj.listeners.submit; 

        var listeners = formObj.listeners || ["blur", "keyup"];

        if (formObj.listeners && !Array.isArray(formObj.listeners)) throw new Error(ERRORS.WRONG_LISTENERS_PATTERN);
        if (formObj.errorListeners && !Array.isArray(formObj.errorListeners)) throw new Error(ERRORS.WRONG_LISTENERS_PATTERN);

        this.inputs.forEach(function(input) {
            listeners.forEach(function(listener) {
                input.addEventListener(listener, function() {
                        self.validate(listener);
                }); 					
            });			
        });

        this.form.addEventListener("submit", function(e) {

            e.preventDefault();
            e.stopPropagation();

            if (!self.validate("submit")) return;

            if (!formObj.onSubmit) {
                self.form.submit();
            } else {
                self.onSubmit(e);
            }
        });		
    }

    DCValidator.prototype.setCustomRules = function(rules) {
        for (var rule in rules) {
            this.rules[rule] = rules[rule];
        }
    };

    DCValidator.prototype.getCoreRules = function() {
        return {
            email: function(input) {
                return /\S+@\S+\.\S+/.test(input.value);
            }
        };		
    };

    DCValidator.prototype.isValid = function(input, listener) {
        var rule = input.getAttribute("data-rule");

        if (rule.length && !this.rules[rule]) throw new Error(ERRORS.MISSING_RULE + "\"" + rule + "\"");
        var valid = !rule || this.rules[rule](input);

        if (this.errorListeners.includes(listener) || listener == "submit") {
            this[valid ? "offError" : "onError"](input);		
        }
        return valid;
    };

    DCValidator.prototype.validate = function(listener) {

        var self = this;
        var allInputsAreValid = true; 

        this.inputs.forEach(function(input) {
            if(!self.isValid(input, listener)) allInputsAreValid = false; 
        });

        this[allInputsAreValid ? "onFormValid" : "onFormInvalid"]();
        return allInputsAreValid;
    };

    var ERRORS =  {
        EMPTY_FORM_ID: "Inform the Form id",
        NO_RULES_FOUND: "No rules found. Form always will return true.",
        MULTIPLE_SUBMIT: "Multiple submit found.",
        MISSING_RULE: "Missing Rule on the rules instance",
        WRONG_LISTENERS_PATTERN: "Listeners should be an array",
        ON_ERROR_EMPTY_WARNING: "Inform \"onError\" and \"offError\" functions on Validator instance.",
        ON_VALID_EMPTY_WARNING: "Inform \"onFormValid\" and \"onFormInvalid\" functions on Validator instance.",
    };

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return DCValidator;
        });
    } 
    else if (typeof exports !== 'undefined') {
        
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = DCValidator;
        }

        exports.DCValidator = DCValidator;
    } else {
        global.DCValidator = DCValidator;
    }
})(this);