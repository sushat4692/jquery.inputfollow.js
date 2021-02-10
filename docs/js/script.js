;(function ($) {
  $(function () {
    var target = $('form')
    var validate = target.inputfollow({
      rules: {
        name: { type: 'required' },
        name2: { type: 'required' },
        email: [{ type: 'required' }, { type: 'email' }],
        textarea: { type: 'required' },
        number: { type: 'number' },
        orreq01: { type: 'required', mode: 'or', with: ['orreq02'] },
        andreq01: { type: 'required', mode: 'and', with: ['andreq02'] },
        checkbox: { type: 'required' },
        if_target: { type: 'required', if: { if_from: 'checked' } },
      },
      messages: {
        name: { required: 'Name is Required.' },
        name2: { required: 'Name2 is Required.' },
        email: { required: 'E-mail is Required.', email: 'E-mail is Invalid.' },
        textarea: { required: 'Textarea Required is Required.' },
        orreq01: {
          required: 'Input "or required" 01 or 02 is Required.',
        },
        andreq01: {
          required: 'Input "and required" 01 and 02 is Required.',
        },
        checkbox: { required: 'Checkboxes is Required.' },
        if_target: { required: 'If you checked, this area is required.' },
      },
    })

    console.log(validate)
  })
})(jQuery)
