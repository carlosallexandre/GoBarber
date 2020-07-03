import React, { useRef, useCallback, useState } from 'react';

import { Link } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { FiLogIn, FiMail } from 'react-icons/fi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimatedContent, Background } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Enviamos um e-mail para você',
          description:
            'Em alguns instantes você receberá um e-mail com orientações para recuperar sua senha.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }

        addToast({
          title: 'Houve um erro',
          description:
            'Ocorreu um erro na recuperação de senha, tente novamente.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimatedContent>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input icon={FiMail} name="email" placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimatedContent>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
