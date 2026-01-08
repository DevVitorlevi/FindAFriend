import axios from 'axios'

export const petAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  withCredentials: true
})

export const ibgeAPI = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
})

let isRefreshing = false;
let failedQueue: any[] = [];

petAPI.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if ((originalRequest as any)._retry) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => petAPI(originalRequest));
    }

    isRefreshing = true;

    try {
      await petAPI.post("/token/refresh");

      failedQueue.forEach(p => p.resolve(null));
      failedQueue = [];

      return petAPI(originalRequest);
    } catch (err) {
      failedQueue.forEach(p => p.reject(err));
      failedQueue = [];

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
