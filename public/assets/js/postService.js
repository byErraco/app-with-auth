import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alerts';

// export const postService = async (name, price, summary, category,publishedBy,imageCover) => {
export const postService = async (data) => {

  console.log('creando');
  for(var pair of data.entries()) {
    console.log(pair[0]+ ', '+ pair[1]); 
 }
  console.log(data);

// console.log(name, price, summary, category,publishedBy,imageCover);
try {
  // const url =   'http://localhost:3000/api/v1/services';
  const url =   '/api/v1/services';

  const res = await axios({
    method: 'POST',
    url,
    // data: {
    //   name, price, summary, category,publishedBy,imageCover
    // },
    data,
  });
  console.log(res);
  if(res.data.status === 'succes') {
    showAlert('success', 'Servicio publicado exitosamente');
    window.setTimeout(() => {
      location.assign('/me');
    }, 1500)
  }
} catch (error) {
  console.log(error);
  showAlert('error', 'La publicacion fallo, intenta de nuevo');
}
};


export const deleteService = async (id) => {

  console.log('eliminando');


// console.log(name, price, summary, category,publishedBy,imageCover);
try {
  // const url =   `http://localhost:3000/api/v1/services/${id}`;
  const url =   `/api/v1/services/${id}`;

  const res = await axios({
    method: 'Delete',
    url,
    // data: {
    //   name, price, summary, category,publishedBy,imageCover
    // },
    // data,
  });
  console.log(res);
  if(res.data.status === 'succes') {
    showAlert('success', 'Servicio eliminado exitosamente');
    window.setTimeout(() => {
      location.assign('/me');
    }, 1500)
  }
} catch (error) {
  console.log(error);
  showAlert('error', 'La eliminacion fallo, intenta de nuevo');
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