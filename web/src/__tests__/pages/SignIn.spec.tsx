import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

const mockedPushHistory = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedPushHistory,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}));

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedPushHistory.mockClear();
  });

  it('sould be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' }});
    fireEvent.change(passField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedPushHistory).toHaveBeenCalledWith('/dashboard');
    })
  });

  it('sould not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' }});
    fireEvent.change(passField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedPushHistory).not.toHaveBeenCalled();
    })
  });

  it('sould display an error on failed signIn', async () => {
    mockedSignIn.mockImplementation(() => { throw new Error() });
    
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' }});
    fireEvent.change(passField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedPushHistory).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
