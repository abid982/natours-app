/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

console.log('Hello from parcel');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
