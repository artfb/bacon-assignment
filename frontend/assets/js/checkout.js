import '../css/checkout.css'
import { schema } from './validate'
import InputMask from 'inputmask'
import { creditCardType, debounce } from './utils'

class Checkout {
  submitButton = document.querySelector('button')
  form = document.querySelector('form')
  creditCard = document.querySelector('input[name="creditCard"]')
  expDate = document.querySelector('input[name="expDate"]')
  CVV = document.querySelector('input[name="CVV"]')
  postalCode = document.querySelector('input[name="postalCode"]')
  phone = document.querySelector('input[name="phone"]')
  card = document.querySelector('input[name="creditCard"]')
  cardType = document.querySelector('#cardType')

  INPUT_MASKS = {
    phone: '(999) 999-99-99',
    creditCard: '9999-9999-9999-9999',
  }

  constructor () {
    this.creditCard.onkeyup = this.creditCardProvider()
    this.maskInputs()
    this.form.onsubmit = this.validateForm
  }

  validateForm = (e) => {
    e.preventDefault()

    document.querySelectorAll('.jsFormField').forEach((elem) => {
      elem.querySelector('.error').textContent = ''
      elem.querySelector('label').classList.remove('border-red-500')
    })

    const formData = new FormData(e.target)

    const map = [...formData.entries()].reduce((acc, [k, v]) => ({
      ...acc,
      [k]: this.INPUT_MASKS[k] ? Inputmask.unmask(v, { mask: this.INPUT_MASKS[k] }) : v,
    }), {})

    schema.validate(map, { abortEarly: false }).then((e) => {
      this.sendForm(map)
    }).catch((e) => {
      e.inner.forEach((err) => {
        this.renderFieldError(err.path, err.errors)
      })
    })
  }

  renderFieldError = (fieldName, errors) => {
    const el = document.querySelector(`#formField-${fieldName}`)
    el.classList.add('border-red-500')
    el.parentNode.querySelector('.error').textContent = errors.join(' ')
  }

  sendForm = (data) => {
    this.submitButton.disabled = true

    fetch('/order', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(r => {
        if (r.ok) {
          return r.json().then(j => j.message)
        } else {
          this.submitButton.disabled = false
          return r.json().then(j => {
            for (const key in j) {
              if (Object.hasOwnProperty.call(j, key)) {
                this.renderFieldError(key, j[key])
              }
            }
            throw new Error()
          })
        }
      })
      .then(text => {
        this.submitButton.textContent = text
        this.submitButton.classList.remove('bg-lime-500')
        this.submitButton.classList.remove('border-b-2')
        this.submitButton.classList.remove('border-lime-600')
        this.submitButton.classList.remove('focus:bg-lime-600')
        this.submitButton.classList.add('bg-gray-500')
        this.submitButton.classList.add('border-gray-600')
      })
      .catch(() => {
        this.submitButton.disabled = false
      })
  }

  creditCardProvider = () => {
    let lastType

    return debounce((e) => {
      const v = Inputmask.unmask(e.target.value, { mask: this.INPUT_MASKS.creditCard })
      const type = creditCardType(v.replace(/\s/g, ''))
      if (type) {
        this.cardType.classList.add(type)
        lastType = type
      } else {
        this.cardType.classList.remove(lastType)
      }
    })
  }

  maskInputs = () => {
    Inputmask('99/99').mask(this.expDate)
    Inputmask('999').mask(this.CVV)
    Inputmask('99999').mask(this.postalCode)
    Inputmask(this.INPUT_MASKS.phone).mask(this.phone)
    Inputmask(this.INPUT_MASKS.creditCard).mask(this.card)
  }
}

window.onload = () => {
  new Checkout()
}
