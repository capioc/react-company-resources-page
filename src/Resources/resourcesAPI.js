import axios from 'axios';
import { oauth2 } from "../environment";
const baseURL = 'https://api.foleon.com/v2/magazine/'


const axiosClient = axios.create({ baseURL });
// Add a request interceptor
axiosClient.interceptors.request.use( async (config) => {
  let token = localStorage.getItem("foleonToken");
  const expiresAt = localStorage.getItem("foleonExpiresAt");
  if (!token || (expiresAt < Date.now())) {
    token = await requestToken();
  }
  config.headers['Authorization'] = `Bearer ${token}`
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

const requestToken = async (id, secret) => {
  try {
    const res = await axios.post('https://api.foleon.com/oauth', oauth2);
    console.log(res);
    const expiresAt = Date.now() + 36000000
    localStorage.setItem("foleonToken", res.data.access_token);
    localStorage.setItem("foleonExpiresAt", expiresAt);
    return res.data;
  } catch (error) {
    console.log(error)
  }
}

export const getPublications = async (page=1, limit=100, orderBy={}, filter={}) => {
  const endpoint = 'edition';
  const _page = page ? `&page=${page}` : '';
  const _limit = '&limit=' + (limit ? `${limit}` : '100');
  const _orderBy = `&order-by[0][field]=created_on&order-by[0][type]=field&order-by[0][direction]=desc`;
  try {
    const res = await axiosClient.get(`${baseURL}${endpoint}?${_page}${_limit}${_orderBy}`)
    return res.data;
  } catch (error) {
    console.log('couldn\'t fetch Publications')
  }
}

export const getProjects = async (page=1, limit=100, orderBy={}, filter={}) => {
  const endpoint = 'title';
  const _page = page ? `&page=${page}` : '';
  const _limit = '&limit=' + (limit ? `${limit}` : '100');
  const _orderBy = `&order-by[0][field]=name&order-by[0][type]=field&order-by[0][direction]=asc`;
  try {
    const res = await axiosClient.get(`${baseURL}${endpoint}?${_page}${_limit}${_orderBy}`)
    const map = new Map();
    res.data._embedded.title.forEach((p) => {
      map.set(p.id, p);
    });
    res.data.map = map;
    return res.data;
  } catch (error) {
    console.log('couldn\'t fetch Projects')
  }
}

export default axiosClient;

