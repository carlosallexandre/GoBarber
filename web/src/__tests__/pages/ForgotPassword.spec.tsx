import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import ForgotPassword from '../../pages/ForgotPassword';
import api from '../../services/api';

const mockAddToast = jest.fn();
const mockApi = new MockAdapter(api);
mockApi.onPost('password/forgot').reply(200);

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockAddToast,
  })
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockAddToast.mockClear();
  });

  it('sould be able recovery password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');
    
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' }});
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('sould display error for unregister email', async () => {
    mockApi.onPost('password/forgot').reply(400);

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');
    
    fireEvent.change(emailField, { target: { value: 'unregister@example.com' }});
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });

  it('sould not be able recovery password of invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');
    
    fireEvent.change(emailField, { target: { value: 'invalid-email' }});
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockAddToast).not.toHaveBeenCalled();
    });
  });
});