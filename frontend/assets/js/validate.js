import * as yup from 'yup'

export const schema = yup.object().shape({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  postalCode: yup.string()
    .matches(/^[0-9]{5}$/, { message: 'Wrong format, eg: 00000'})
    .required('Required'),
  email: yup.string().email().required('Required'),
  creditCard: yup.string()
    .matches(/^[0-9]{16}$/, { message: 'Wrong format, eg: 0000-0000-0000-0000' })
    .required('Required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, { message: 'Wrong format, eg: (000) 000-00-00' })
    .required('Required'),
  CVV: yup.string()
    .matches(/^[0-9]{3}$/, { message: 'Wrong format, eg: 000' })
    .required('Required'),
  expDate: yup.string()
    .matches(/^[0-9]{2}\/[0-9]{2}$/, { message: 'Wrong format, eg: 00/00' })
    .required('Required'),
})
