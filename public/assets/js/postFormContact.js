import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alerts';

export const sendContact = async (name, email, number, asunto) => {
  console.log(name, email, number, asunto);
try {
  // console.log('llamada axios');
  const res = await axios({
    method: 'POST',
    // url: 'http://localhost:3000/api/v1/users/signup',
    url: '/api/v1/users/contact',

    data: {
      name,
      email,
      number,
      asunto
    },
  });
  console.log(res);
  if(res.data.status === 'succes') {
    showAlert('success', 'Correo enviado');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500)
  }
} catch (error) {
  showAlert('error', 'Algo fallo, intenta de nuevo');
}
};
