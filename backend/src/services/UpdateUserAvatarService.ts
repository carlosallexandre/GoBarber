import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import User from '../models/User.model';
import uploadConfig from '../config/upload';

interface Request {
  userId: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id: userId } });

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
    usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
