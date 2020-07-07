import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;
let fakeCacheProvider: FakeCacheProvider;

describe('Update profile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateProfileService = new UpdateProfileService(
      fakeHashProvider,
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'John Tre',
      email: 'johntre@sample.com',
    });

    expect(updatedUser?.name).toBe('John Tre');
    expect(updatedUser?.email).toBe('johntre@sample.com');
  });

  it('should not be able to update user profile from non-existing-user', async () => {
    await expect(
      updateProfileService.execute({
        userId: 'non-existing-user',
        name: 'John Doe',
        email: 'johndoe@gobarber.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email to another already register email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gobarber.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@gobarber.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Teste',
        email: 'johndoe@gobarber.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'John Tre',
      email: 'johntre@sample.com',
      oldPassword: '123456',
      password: '123123',
    });

    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to update user password without oldPassword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'John Tre',
        email: 'johntre@sample.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password with wrong oldPassword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'John Tre',
        email: 'johntre@sample.com',
        oldPassword: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
