import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: '/api/v1',
});

export const fetcher = (url: string) => axiosClient.get(url).then((res) => res.data);
