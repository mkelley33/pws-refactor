import axios from 'axios';

export default axios.create({
  baseURL: `${process.env.GATSBY_API_URL || ''}/api/v1`,
  withCredentials: true,
});
