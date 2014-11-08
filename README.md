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
        foo: 'required',
        bar: [ 'required', 'email' ],
        baz: 'required_or_qux'
    },
    messages: {
        name: { required: 'Error Messages' }
    }
} );
```

## Demo

[Hear](https://sus-happy.github.io/jquery.inputfollow.js/)