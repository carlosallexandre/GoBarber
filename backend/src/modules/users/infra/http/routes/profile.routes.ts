import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);
profileRouter.put('/', ProfileController.update);
profileRouter.get('/', ProfileController.show);

export default profileRouter;
