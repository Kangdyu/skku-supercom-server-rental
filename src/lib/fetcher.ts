import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

export const fetcher = (url: string) => axiosClient.get(url).then((res) => res.data);
