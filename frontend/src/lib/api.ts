import axios from 'axios';

// =====================================================================
// CORREÇÃO APLICADA AQUI
// 1. A baseURL agora lê a variável correta: NEXT_PUBLIC_API_URL.
// 2. A baseURL NÃO inclui mais o /api/v1. Isso evita URLs duplicadas.
//    As chamadas agora devem ser feitas como: api.post('/api/v1/auth/register')
// =====================================================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

if (typeof window !== 'undefined') {
  console.log('🔗 Usando a URL base da API:', API_BASE_URL);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (seu código original mantido)
api.interceptors.request.use((config) => {
  // Garante que o código só acesse localStorage no navegador
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratar erros de resposta (seu código original mantido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado para debug
    console.error('🚨 Erro na API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Redirecionamento em caso de erro 401
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
