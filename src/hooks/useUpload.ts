import { useState } from 'react';

// TODO: нормальные типы
export function useUpload() {
  const [state, setState] = useState({
    status: 'idle',
    progress: 0,
    data: null,
    error: null,
  });

  const upload = async (file: any, options: any) => {
    const { url, onProgress } = options;

    setState({ status: 'uploading', progress: 0, data: null, error: null });

    try {
      // Имитация загрузки с прогрессом
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setState((prev) => ({ ...prev, progress: i }));
        onProgress?.(i);
      }

      // Имитация ответа
      const mockResponse = {
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setState({
        status: 'success',
        progress: 100,
        data: mockResponse,
        error: null,
      });

      return mockResponse;
    } catch (err: any) {
      setState({
        status: 'error',
        progress: 0,
        data: null,
        error: err.message || 'Ошибка загрузки',
      });
    }
  };

  const reset = () => {
    setState({ status: 'idle', progress: 0, data: null, error: null });
  };

  return {
    ...state,
    upload,
    reset,
    isUploading: state.status === 'uploading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}
