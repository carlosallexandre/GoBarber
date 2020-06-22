import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('Show profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sample.com',
      password: '123456',
    });

    const userProfile = await showProfileService.execute({
      userId: user.id,
    });

    expect(userProfile?.name).toBe('John Doe');
    expect(userProfile?.email).toBe('johndoe@sample.com');
  });

  it('should not be able to show user profile from non-existing-user', async () => {
    await expect(
      showProfileService.execute({
        userId: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
