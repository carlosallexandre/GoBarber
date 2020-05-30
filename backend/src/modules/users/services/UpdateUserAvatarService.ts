import { injectable, inject } from 'tsyringe';

import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User.model';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Only authenticated user could update avatar', 401);
    }

    /**
     * Delete old avatar
     */
    if (user.avatar) {
      const avatarPath = path.join(uploadConfig.directory, user.avatar);
      const hasAvatar = await fs.promises.stat(avatarPath);

      if (hasAvatar) {
        await fs.promises.unlink(avatarPath);
      }
    }

    /**
     * Update new avatar
     */
    user.avatar = avatarFilename;
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
