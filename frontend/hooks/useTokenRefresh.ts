import { useEffect } from 'react';
import { petAPI } from '@/services/api';

export function useTokenRefresh() {
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        await petAPI.post('/token/refresh');
        console.log('✅ Token renovado preventivamente');
      } catch (error) {
        console.error('❌ Erro ao renovar token:', error);
      }
    }, 8 * 60 * 1000); // 8 minutos

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          await petAPI.post('/token/refresh');
          console.log('✅ Token renovado ao retornar à aba');
        } catch (error) {
          console.error('❌ Erro ao renovar token:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const initialRefresh = async () => {
      try {
        await petAPI.post('/token/refresh');
        console.log('✅ Token renovado na inicialização');
      } catch (error) {
        console.error('❌ Erro na renovação inicial:', error);
      }
    };

    initialRefresh();

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}