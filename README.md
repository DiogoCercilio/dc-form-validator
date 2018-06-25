# DC Form Validator

## A Vanilla JS form Validator (under construction...)

#### PLEASE DON'T USE IN PRODUCTION YET!

How to use:

HTML:
```html
    <form id="my-form" action="/" method="post">
        <input type="text" autocomplete="off" data-rule="from" name="from" value="" />
        <input type="text" autocomplete="off" data-rule="to" name="to" />
        <input type="text" autocomplete="off" data-rule="when" name="when" />
        <input type="submit" value="Submit Form" />
    </form>
```

Javascript:
```js

        var validator = new DCValidator({
            form: "#my-form",
            listeners: ["blur", "keyup", "submit"],
            errorListeners: ["keyup", "submit"],
            rules: {
                from: function (input) {
                    return !!input.value.length && input.value.length > 10;
                },
                to: function () {
                    return true;
                },
                when: function () {
                    return true;
                }
            },
            onError: function (input) {
                input.classList.add("is-error");
            },
            offError: function (input) {
                input.classList.remove("is-error");
            },
            onFormValid: function (form, submit) {
                submit.removeAttribute("disabled");
            },
            onFormInvalid: function (form, submit) {
                submit.setAttribute("disabled", "disabled");
            },
            onSubmit: function () {
                alert("submit");
            }
        });

        validator.validate();

```


NPM
https://www.npmjs.com/package/dc-form-validator

GITHUB
https://github.com/DiogoCercilio/dc-form-validator