import { login, logout, forgotPassword, resetPassword } from './login';
import { register } from './register';


//values
//dom elements
const loginForm = document.querySelector('.form');
const registerForm = document.querySelector('.form-register');
const logOutBtn = document.querySelector('.logout');



if(loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    login(email, password);
});

if(registerForm)
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('a')
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    register(name, email, password, passwordConfirm);
});


if(logOutBtn) logOutBtn.addEventListener('click', logout);