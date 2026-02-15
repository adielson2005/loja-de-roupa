import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetchFunction, params = null, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (overrideParams = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchFunction(overrideParams ?? params);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar dados';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  const refetch = useCallback((newParams = null) => {
    return execute(newParams);
  }, [execute]);

  return { data, loading, error, refetch, setData };
}

export default useFetch;
