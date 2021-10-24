import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alerts';

export const login = async (email, password) => {
    console.log(email,password);
  try {
    const res = await axios({
      method: 'POST',
      // url: 'http://localhost:3000/api/v1/users/login',
      url: '/api/v1/users/login',

      data: {
        email,
        password,
      },
    });
    console.log(res);
    if(res.data.status === 'succes') {
      showAlert('success', 'Inicio de sesion exitoso');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500)
    }
  } catch (error) {
    showAlert('error', 'Error, vuelva a intentarlo');
  }
};

export const forgotPassword = async (email) => {
  console.log(email);
try {
  const res = await axios({
    method: 'POST',
    // url: 'http://localhost:3000/api/v1/users/forgotPassword',
    url: '/api/v1/users/forgotPassword',

    data: {
      email,
    },
  });
  console.log(res);
  if(res.status === 200) {
    showAlert('success', 'Si el correo existe en nuestro sitio, se enviara un codigo de restauración de contraseña');
    window.setTimeout(() => {
      location.assign('/');
    }, 2500)
  }
} catch (error) {
  showAlert('error', 'No existe ninguna cuenta asociada a ese correo!');
}
};

export const resetPassword = async (password, passwordConfirm, code) => {
  console.log(password, passwordConfirm);
try {
  const res = await axios({
    method: 'PATCH',
    // url: `http://localhost:3000/api/v1/users/resetPassword/${code}`,
    url: `/api/v1/users/resetPassword/${code}`,

    data: {
      password,
      passwordConfirm
    },
  });
  console.log(res);
  if(res.status === 200) {
    showAlert('success', 'Se actualizo la contraseña');
    window.setTimeout(() => {
      location.assign('/');
    }, 2500)
  }
} catch (error) {
  showAlert('error', 'Hubo un error, intenta de nuevo!');
}
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      // url: 'http://localhost:3000/api/v1/users/logout'
      url: '/api/v1/users/logout'

    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};