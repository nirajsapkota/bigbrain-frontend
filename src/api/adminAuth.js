import axios from 'axios';
import url from './constants';

const AdminAuthRegister = (name, email, password) => {
  return axios({
    url: url + '/admin/auth/register',
    method: 'POST',
    data: { name, email, password }
  });
}

const AdminAuthLogin = (email, password) => {
  return axios({
    url: url + '/admin/auth/login',
    method: 'POST',
    data: { email, password }
  });
}

const AdminAuthLogout = (token) => {
  return axios({
    url: url + '/admin/auth/logout',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export {
  AdminAuthRegister,
  AdminAuthLogin,
  AdminAuthLogout
}
