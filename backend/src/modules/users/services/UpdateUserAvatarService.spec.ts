import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;
describe('Update user avatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpeg',
    });

    expect(user.avatar).toBe('avatar.jpeg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    expect(
      updateUserAvatarService.execute({
        userId: 'any-id',
        avatarFilename: 'avatar.jpeg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old user avatar and update new user avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpeg',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'avatar2.jpeg',
    });

    expect(user.avatar).toBe('avatar2.jpeg');
    expect(deleteFile).toBeCalledWith('avatar.jpeg');
  });
});
