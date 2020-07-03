import React, { useRef, useCallback } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { FiLock } from 'react-icons/fi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimatedContent, Background } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const queryParams = useQuery();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          confirmPassword: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, confirmPassword } = data;
        const token = queryParams.get('token');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          confirmPassword,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }

        addToast({
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
          type: 'error',
        });
      }
    },
    [addToast, history, queryParams],
  );

  return (
    <Container>
      <Content>
        <AnimatedContent>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Nova senha"
            />

            <Input
              icon={FiLock}
              name="confirmPassword"
              type="password"
              placeholder="Confirmação nova senha"
            />

            <Button type="submit">Resetar senha</Button>
          </Form>
        </AnimatedContent>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
