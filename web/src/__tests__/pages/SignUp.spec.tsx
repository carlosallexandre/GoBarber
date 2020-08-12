import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import SignUp from '../../pages/SignUp';
import api from '../../services/api';

const mockedPushHistory = jest.fn();
const mockedAddToast = jest.fn();
const mockApi = new MockAdapter(api);

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

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedPushHistory.mockClear();
  });

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    
    mockApi.onPost('users').reply(201);
    
    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' }});
    fireEvent.change(emailField, { target: { value: 'johnDoe@example.com' }});
    fireEvent.change(passField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);
    
    await waitFor(() => {
      expect(mockedPushHistory).toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
        }),
      );
    });
  });

  it('should not be able to sign up with invalid e-mail', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    
    mockApi.onPost('users').reply(201);
    
    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' }});
    fireEvent.change(emailField, { target: { value: 'invalid-email' }});
    fireEvent.change(passField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);
    
    await waitFor(() => {
      expect(mockedPushHistory).not.toHaveBeenCalledWith('/');
    });
  });

  it('should display message on sign up with unexpected error', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    
    mockApi.onPost('users').reply(500);
    
    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' }});
    fireEvent.change(emailField, { target: { value: 'johnDoe@example.com' }});
    fireEvent.change(passField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);
    
    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});