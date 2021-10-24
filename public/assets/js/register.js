import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alerts';

export const register = async (name, email, password, passwordConfirm) => {
  console.log(name, email, password, passwordConfirm);
try {
  const res = await axios({
    method: 'POST',
    // url: 'http://localhost:3000/api/v1/users/signup',
    url: '/api/v1/users/signup',

    data: {
      name,
      email,
      password,
      passwordConfirm
    },
  });
  console.log(res);
  if(res.data.status === 'succes') {
    showAlert('success', 'Registro exitoso');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500)
  }
} catch (error) {
  showAlert('error', 'Registro fallo, intenta de nuevo');
}
};
