import { toast as sonnerToast } from 'sonner@2.0.3';

export const showSuccessToast = (message) => {
  sonnerToast.success(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#e8f5e9',
      color: '#2e7d32',
      border: '1px solid #4caf50',
    },
  });
};

export const showErrorToast = (message) => {
  sonnerToast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#ffebee',
      color: '#c62828',
      border: '1px solid #f44336',
    },
  });
};

export const showInfoToast = (message) => {
  sonnerToast.info(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#e3f2fd',
      color: '#1565c0',
      border: '1px solid #2196f3',
    },
  });
};

export const showWarningToast = (message) => {
  sonnerToast.warning(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#fff3e0',
      color: '#e65100',
      border: '1px solid #ff9800',
    },
  });
};