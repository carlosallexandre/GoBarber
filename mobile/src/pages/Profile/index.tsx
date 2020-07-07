import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
  LogoutButton,
  LogoutButtonText,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const nameInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const oldPassInputRef = useRef<any>(null);
  const passInputRef = useRef<any>(null);
  const confirmPassInputRef = useRef<any>(null);

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          confirmPassword: Yup.string()
            .when('oldPassword', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, oldPassword, password, confirmPassword } = data;

        const formData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                password,
                confirmPassword,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu algum erro na atualização do perfil, tente novament',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecionar avatar',
        cancelButtonTitle: 'Cancelar',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
        takePhotoButtonTitle: 'Tirar foto',
        maxHeight: 480,
        maxWidth: 480,
      },
      response => {
        console.log(response);

        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao selecionar avatar!');
        }

        const data = new FormData();

        data.append('avatar', {
          type: response.type,
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api
          .patch('users/avatar', data)
          .then(apiResponse => updateUser(apiResponse.data));
      },
    );
  }, [updateUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEnabled
          showsVerticalScrollIndicator
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form ref={formRef} initialData={user} onSubmit={handleSignUp}>
              <Input
                ref={nameInputRef}
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => nameInputRef.current?.focus()}
                autoCorrect
                autoCapitalize="words"
              />

              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                keyboardType="email-address"
                onSubmitEditing={() => emailInputRef.current?.focus()}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                ref={oldPassInputRef}
                name="oldPassword"
                icon="lock"
                placeholder="Senha atual"
                containerStyle={{ marginTop: 16 }}
                returnKeyType="next"
                onSubmitEditing={() => oldPassInputRef.current?.focus()}
                textContentType="newPassword"
                secureTextEntry
              />

              <Input
                ref={passInputRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                returnKeyType="next"
                onSubmitEditing={() => passInputRef.current?.focus()}
                textContentType="newPassword"
                secureTextEntry
              />

              <Input
                ref={confirmPassInputRef}
                name="confirmPassword"
                icon="lock"
                placeholder="Confirmar nova senha"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                textContentType="newPassword"
                secureTextEntry
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>

            <LogoutButton onPress={signOut}>
              <LogoutButtonText>Sair</LogoutButtonText>
            </LogoutButton>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
export default Profile;
