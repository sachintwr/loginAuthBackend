import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import AdminController from '../controllers/admin.controller';
import { getType } from '../middleware/typeAthorize';
const routes = new Router();

routes.route('/')
    .post(authenticate, AdminController.create)
    .get(authenticate, AdminController.search);

routes.route('/:id')
    .get(authenticate, getType(['admin']), AdminController._populate, AdminController.fetch)
    .put(authenticate, getType(['admin']), AdminController._populate, AdminController.update)
    .delete(authenticate, getType(['admin']), AdminController._populate, AdminController.delete);

export default routes;
