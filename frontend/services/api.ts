// lib/axios.ts
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

const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

petAPI.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Só trata erro 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Se já tentou renovar, rejeita
    if ((originalRequest as any)._retry) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    // Se já está renovando, adiciona na fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => petAPI(originalRequest))
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      await petAPI.post("/token/refresh");

      processQueue(null);

      return petAPI(originalRequest);
    } catch (err) {
      processQueue(err);

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);