import { Router } from 'express';
import MetaController from './controllers/meta.controller';
import errorHandler from './middleware/error-handler';
import AuthRoutes from './routes/auth.route';
import LogRoutes from './routes/log.route';
import UsersRoutes from './routes/user.route'
import AdminRoutes from './routes/admin.route';
import accessControl from './middleware/access-control';

const routes = new Router();

routes.get('/', MetaController.index);

// Authentication
routes.use('/auth', AuthRoutes);

// Logs
routes.use('/logs', LogRoutes);

// Users
routes.use('/users', UsersRoutes);

// Admin
routes.use('/admins', AdminRoutes);

routes.get('/admin', accessControl('admin'), MetaController.index);

routes.use(errorHandler);

export default routes;