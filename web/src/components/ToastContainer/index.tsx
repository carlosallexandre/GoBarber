import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { Container } from './styles';

import { Toast as IToast } from '../../hooks/toast';

interface ToastContainerProps {
  toasts: IToast[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const toastsWithTransition = useTransition(toasts, toast => toast.id, {
    from: { right: '-120%' },
    enter: { right: '0' },
    leave: { right: '-120%' },
  });
  return (
    <Container>
      {toasts &&
        toastsWithTransition.map(({ item, key, props }) => (
          <Toast key={key} toast={item} style={props} />
        ))}
    </Container>
  );
};

export default ToastContainer;
