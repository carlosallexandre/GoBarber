import { Router } from 'express';

import multer from 'multer';
import multerConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(multerConfig);

usersRouter.post('/', UsersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  UsersController.update,
);

export default usersRouter;
