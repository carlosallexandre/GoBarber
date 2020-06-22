import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSession: CreateSessionService;
let createUser: CreateUserService;

describe('Create Session', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    const response = await createSession.execute({
      email: 'johndoe@sample.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a non existing user', async () => {
    expect(
      createSession.execute({
        email: 'johndoe@sample.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    expect(
      createSession.execute({
        email: 'johndoe@sample.com',
        password: 'wrong-pass',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
