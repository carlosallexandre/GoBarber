import { Request, Response } from 'express';
import { container } from 'tsyringe';

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

    delete userProfile?.password;
    return response.json({ ...userProfile });
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

    delete user?.password;

    return response.json(user);
  }
}

export default ProfileController;
