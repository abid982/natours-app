/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';
import { updateData } from './updateSettings';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const settingsBtn = document.querySelector('.btn--settings');

const userDataForm = document.querySelector('.form-user-data');

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

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(name, email);
    updateData(name, email);
  });
}
