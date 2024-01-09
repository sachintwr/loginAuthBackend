import { Router } from 'express';
import AuthController from '../controllers/auth.controller'
import authenticate from '../middleware/authenticate';
import accessControl from '../middleware/access-control';
import { getType } from '../middleware/typeAthorize';
const routes = new Router();

routes.route('/login').post(AuthController.login);
routes.route('/admin-login').post(AuthController.AdminLogin);
routes.route('/register').post(AuthController.register);
routes.route('/check-credentials').post(AuthController.checkCredentials);
routes.route('/otp-login').post(AuthController.otpLogin);
routes.route('/change-password').put(AuthController.changePassword);
routes.route('/dashboard').get(authenticate, getType(['user']), (req, res) => {
    res.json("success");
});
export default routes;
