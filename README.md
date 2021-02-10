# jquery.inputfollow.js

Input Validate, Input Limit etc.

## Validate

* Require
* E-mail

## Limit

* Number
* Code

## Usage

```
$( 'form' ).inputfollow( {
    rules: {
        foo: { type: 'required' },
        bar: [{ type: 'required' }, { type: 'email' }],
        baz: { type: 'required_or_qux' },
        or_name: { type: 'required', mode: 'or', with: ['or_name_with'] },
        and_name: { type: 'required', mode: 'and', with: ['and_name_with'] },
        if_name: { type: 'required', if: { if_from: 'checked' } }
    },
    messages: {
        name: { required: 'Error Messages' }
    }
} );
```

## Demo

[Hear](https://sushat4692.github.io/jquery.inputfollow.js/)

## Releases

* 2.0.0
  * Change to TypeScript
  * Support array input (e.g. Checkboxes)
  * Support separate error display
* 2.1.0
  * Change rules option structure
  * Add if condition rule
* 2.1.1
  * [Fixed name fileds issue](https://github.com/sushat4692/jquery.inputfollow.js/issues/2)