(function() {

  function stepShow(step) {
    const currentStepElement = document.querySelector(`[data-step='${step}']`)

    currentStepElement.classList.add('visible')
  }

  function createErrorMessage(message) {
    let fieldError = document.createElement('div')

    fieldError.classList.add('field__message')
    fieldError.classList.add('field__message_error')
    fieldError.innerHTML = `<p>${message}</p>`

    return fieldError
  }

  function checkField(input) {
    const field = input.closest('.field'),
          value = input.value.trim()

    if (value === '') {
      field.classList.add('field_error')
      field.appendChild(createErrorMessage('Пожалуйста заполните поле!'))
      return false
    }

    return true
  }

  function checkForm() {
    const currentStepElement = document.querySelector('[data-step].visible')

    let errors = false

    document.querySelectorAll('.field').forEach((field, i) => {
      const message = field.querySelector('.field__message_error')

      field.classList.remove('field_error')

      if (message) message.remove()
    })

    currentStepElement.querySelectorAll('input:not([type="radio"])').forEach((input, i) => {
      if (checkField(input) === false) errors = true
    })

    if (errors === true) return false
  }

  function addChildren() {
    const childrenData = document.getElementById('form-passport-children-data')

    let childrenCountElement = document.getElementById('form-passport-children-count'),
        childrenCount = Number(childrenCountElement.textContent)

    childrenCountElement.textContent = ++childrenCount

    const inputs = [
      {
        name: 'ФИО:',
        type: 'text',
        id: 'form-passport-children-name',
        placeholder: 'Иванов Иван Иванович'
      },{
        name: 'Дата рождения:',
        type: 'date',
        id: 'form-passport-children-birthday',
        value: '1990-01-01'
      },{
        name: 'Пол:',
        type: 'radio',
        radio: {
          name: 'sex',
          values: [
            {
              name: 'М',
              value: 'Мальчик'
            },{
              name: 'Ж',
              value: 'Девочка'
            }
          ]
        },
        id: 'form-passport-children-sex'
      }
    ]

    document.getElementById('form-passport-children-save').classList.remove('hidden')

    let formSet = document.createElement('div'),
        removeButton = document.createElement('button')

    removeButton.classList.add('remove')
    formSet.classList.add('form__set')
    formSet.classList.add('form__set_border')
    formSet.id = 'form-passport-children'+childrenCount
    formSet.setAttribute('data-children', '')
    formSet.appendChild(removeButton)

    for (let i = 0; i < inputs.length; i++) {
      const data = inputs[i],
            id = data.id+childrenCount

      let field, fieldInput, input, caption

      switch (data.type) {
        case 'radio':
          caption = document.createElement('span')

          let formSetInner = document.createElement('div')

          formSetInner.classList.add('form__set')

          caption.classList.add('caption')
          caption.textContent = data.name

          formSetInner.appendChild(caption)
          formSetInner.id = data.id

          for (let k = 0; k < data.radio.values.length; k++) {
            const values = data.radio.values

            field = document.createElement('label'),
            caption = document.createElement('span')
            input = document.createElement('input')

            caption.textContent = values[k].name

            input.type = data.type
            input.name = data.radio.name+childrenCount
            input.value = values[k].value

            if (k === 0) input.checked = true

            field.appendChild(caption)
            field.appendChild(input)
            field.classList.add('radio')

            formSetInner.appendChild(field)

          }

          formSet.appendChild(formSetInner)

          break
        default:
          field = document.createElement('label'),
          fieldInput = document.createElement('div'),
          input = document.createElement('input'),
          caption = document.createElement('span')

          field.classList.add('field')
          fieldInput.classList.add('field__input')
          caption.classList.add('caption')

          field.appendChild(caption)
          field.appendChild(fieldInput)
          fieldInput.appendChild(input)
          formSet.appendChild(field)

          caption.textContent = data.name
          input.id = id
          input.type = data.type

          if (data.value) input.value = data.value
          if (data.placeholder) input.placeholder = data.placeholder

          childrenData.appendChild(formSet)
          break
      }
    }
  }

  function saveChildren() {
    document.querySelectorAll('[data-children]').forEach((children, i) => {
      if (checkForm() === false) {
        return false
      } else {
        document.getElementById('form-passport-children-save').classList.add('hidden')
      }

      let div = document.createElement('div'),
          removeButton = document.createElement('button')

      removeButton.classList.add('remove')

      children.querySelectorAll('[id]').forEach((id, k) => {

        let value, caption, text,
            p = document.createElement('p'),
            strong = document.createElement('strong')

        switch (id.tagName) {
          case 'INPUT':
            caption = id.closest('.field').querySelector('.caption').textContent
            value = id.value
            break
          case 'DIV':
            caption = id.querySelector('.caption').textContent
            value = id.querySelector(':checked').value
            break
        }

        text = document.createTextNode(value)

        strong.textContent = caption
        p.classList.add('info')
        p.appendChild(strong)
        p.appendChild(text)

        div.appendChild(p)
        div.appendChild(removeButton)
      })

      children.innerHTML = div.innerHTML
      children.removeAttribute('data-children')
    })

  }

  const currentStep = 0

  stepShow(currentStep)

  document.querySelectorAll('[data-step-next]').forEach((button, i) => {
    button.addEventListener('click', (e) => {
      e.preventDefault()

      const currentStepElement = document.querySelector('[data-step].visible')

      if (checkForm() === false) return

      let currentStep = currentStepElement.dataset.step

      currentStep++

      currentStepElement.classList.remove('visible')

      stepShow(currentStep)

    })
  })

  document.getElementById('form-passport-children-add').addEventListener('click', (e) => {
    e.preventDefault()
    addChildren()
  })

  document.getElementById('form-passport-children-save').addEventListener('click', (e) => {
    e.preventDefault()
    saveChildren()
  })

  document.getElementById('form-passport-agree').addEventListener('click', (e) => {
    const state = e.target.checked,
          button = document.getElementById('form-passport-finish')

    switch (state) {
      case true:
        button.disabled = false
        break
      case false:
        button.disabled = true
        break
    }
  })

  document.addEventListener('click', (e) => {
    if (e.target.classList[0] === 'remove') {
      e.preventDefault()

      e.target.closest('.form__set').remove()

      let childrenCountElement = document.getElementById('form-passport-children-count'),
          childrenCount = Number(childrenCountElement.textContent)

      childrenCountElement.textContent = --childrenCount

      if (!document.querySelector('[data-children]')) document.getElementById('form-passport-children-save').classList.add('hidden')
    }
  })

})();
