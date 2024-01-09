import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import UsersController from '../controllers/users.controller';

const routes = new Router();

routes.route('/')
    .post(authenticate, UsersController.create)
    .get( UsersController.search);

routes.route('/:id')
    .get(authenticate, UsersController._populate, UsersController.fetch)
    .put(authenticate, UsersController._populate, UsersController.update)
    .delete(authenticate, UsersController._populate, UsersController.delete);

export default routes;
