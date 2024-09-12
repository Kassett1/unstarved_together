import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:1339/api',
});

export default instance;
