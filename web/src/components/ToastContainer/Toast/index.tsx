import React, { useEffect } from 'react';

import {
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import { Container } from './styles';

import { Toast as IToast, useToast } from '../../../hooks/toast';

interface ToastProps {
  toast: IToast;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ toast, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 3000);

    return () => clearTimeout(timer);
  }, [removeToast, toast.id]);

  return (
    <Container
      hasDescription={!!toast.description}
      type={toast.type}
      style={style}
    >
      {icons[toast.type || 'info']}

      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(toast.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
