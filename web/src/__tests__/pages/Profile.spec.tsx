import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import Profile from '../../pages/Profile';
import api from '../../services/api';

const mockedAddToast = jest.fn();
const mockApi = new MockAdapter(api);

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    user: {},
    updateUser: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({ history: {} }),
  Link: (({ children }: { children: React.ReactNode }) => children),
}));

describe('Profile Page', () => {
  describe('Avatar', () => {
    beforeEach(() => {
      mockedAddToast.mockClear();
      mockApi.onPatch('users/avatar').reply(200);
    });

    it('should be able change avatar', async () => {
      const { getByTestId } = render(<Profile />);

      const avatarField = getByTestId('avatar-field');

      fireEvent.change(avatarField, { target: { files: ['image.png'] }});

      await waitFor(() => {
        expect(mockedAddToast).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'success' }),
        );
      });
    });

    it('should not be able change avatar without an image', async () => {
      const { getByTestId } = render(<Profile />);

      const avatarField = getByTestId('avatar-field');

      fireEvent.change(avatarField, { target: { files: null }});

      await waitFor(() => {
        expect(mockedAddToast).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: 'success' }),
        );
      });
    });
  });

  describe('User', () => {
    beforeEach(() => {
      mockedAddToast.mockClear();
    });

    it('should be able update user data', () => {
      
    });
  });
})