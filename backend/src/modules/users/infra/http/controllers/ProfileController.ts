import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

class ProfileController {
  public static async show(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userId = request.user.id;
    const showProfile = container.resolve(ShowProfileService);

    const userProfile = await showProfile.execute({ userId });

    return response.json(classToClass(userProfile));
  }

  public static async update(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userId = request.user.id;
    const { name, email, password, oldPassword } = request.body;
    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      name,
      email,
      password,
      oldPassword,
      userId,
    });

    return response.json(classToClass(user));
  }
}

export default ProfileController;
