import React from 'react';
import { render, fireEvent, waitFor, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

let mockedToken = '';
const mockedPushHistory = jest.fn();
const mockedAddToast = jest.fn();
const mockApi = new MockAdapter(api);

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
      search: mockedToken,
    }),
    useHistory: () => ({
      push: mockedPushHistory,
    }),
}));

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedPushHistory.mockClear();
    mockedAddToast.mockClear();
    mockedToken = '?token=any-token';
  });

  it('should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);
    
    mockApi.onPost('password/reset').reply(200);

    const newPassField = getByPlaceholderText('Nova senha');
    const confirmNewPassField = getByPlaceholderText('Confirmação nova senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(newPassField, { target: { value: '123456' }});
    fireEvent.change(confirmNewPassField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);
    
    await waitFor(() => {
      expect(mockedPushHistory).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to reset password without token', async () => {
    mockedToken = '';

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);
    
    mockApi.onPost('password/reset').reply(200);

    const newPassField = getByPlaceholderText('Nova senha');
    const confirmNewPassField = getByPlaceholderText('Confirmação nova senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(newPassField, { target: { value: '123456' }});
    fireEvent.change(confirmNewPassField, { target: { value: '123456' }});
    fireEvent.click(buttonElement);
    
    await waitFor(() => {
      expect(mockedPushHistory).not.toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should not be able to reset password on invalid password match', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);
    
    const newPassField = getByPlaceholderText('Nova senha');
    const confirmNewPassField = getByPlaceholderText('Confirmação nova senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(newPassField, { target: { value: '123456' }});
    fireEvent.change(confirmNewPassField, { target: { value: 'wrong-password' }});
    fireEvent.click(buttonElement);
    
    await waitFor(() => {
      expect(mockedPushHistory).not.toHaveBeenCalledWith('/');
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });
});