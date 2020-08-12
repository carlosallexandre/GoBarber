import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => ({
  useField: () => ({
    fieldName: 'email',
    error: '',
    defaultValue: '',
    registerField: jest.fn(),
  }),
}));

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainer = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(inputContainer).toHaveStyle('border-color: #ff9000');
      expect(inputContainer).toHaveStyle('color: #ff9000');
    })
  });

  it('should remove highlight on input blur', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainer = getByTestId('input-container');

    fireEvent.focus(inputElement);
    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(inputContainer).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainer).not.toHaveStyle('color: #ff9000');
    })
  });

  it('should keep highlight color on filled input', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="name" placeholder="name" />
    );

    const inputElement = getByPlaceholderText('name');
    const inputContainer = getByTestId('input-container');

    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, { target: { value: 'john' }});
    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(inputContainer).toHaveStyle('color: #ff9000');
    })
  });
})