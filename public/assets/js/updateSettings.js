import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alerts';

export const updateSettings = async (data, type) => {
//   for(var pair of data.entries()) {
//     console.log(pair[0]+ ', '+ pair[1]); 
//  }
  try {
    const url = 
    type === 'password'
    // ? 'http://localhost:3000/api/v1/users/updateMyPassword'
    ? '/api/v1/users/updateMyPassword'

    // : 'http://localhost:3000/api/v1/users/updateMe'
    : '/api/v1/users/updateMe'

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(res);
    if(res.data.status === 'succes') {
      showAlert('success', `${type.toUpperCase()} Informacion actualizada`);
      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 1500)
    }
  } catch (error) {
    showAlert('error', 'Error, vuelva a intentarlo');
  }
};

