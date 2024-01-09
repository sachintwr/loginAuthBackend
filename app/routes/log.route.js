
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import {authorize} from '../middleware/authorize'
import LogsController from '../controllers/logs.controller';

const routes = new Router();

routes.route('/').get(  LogsController.search);

export default routes;
