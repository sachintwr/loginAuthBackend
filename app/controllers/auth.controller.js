import BaseController from './base.controller';
import User from '../models/user';
import Admin from '../models/admin';
import LogsController from '../controllers/logs.controller';

class AuthController extends BaseController {
  whitelist = [
    'name',
    'mobile',
    'email',
    'password',
    'type'
  ];

  login = async (req, res, next) => {
    const {
      mobile,
      password,
    } = req.body;

    try {
      const user = await User.findOne({
        mobile: mobile,
      }).exec();

      if (!user || !user.authenticate(password)) {
        LogsController.write({
          eventName: 'LOGIN',
          ip: LogsController.extractIp(req),
          message: `failed login attempt for ${mobile}`,
          level: 3,
        });

        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      if (user.isBlocked) {
        const err = new Error('The IDS has detected an abnormality with your access and has blocked it as a precaution. Please contact the Helpdesk.');
        err.status = 403;
        return next(err);
      }

      const accessToken = user.generateToken();
      LogsController.write({
        eventName: 'LOGIN',
        ip: LogsController.extractIp(req),
        message: `Successful login attempt for ${mobile}`,
        level: 3,
        user: user._id,
      });
      console.log('Login Successful')
      const isSuccess = true;
      return res.status(200).json({
        isSuccess,
        accessToken,
        user,
      });

    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ isSuccess: false, message: err.message });
      } else {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
      }
    }
  }

  AdminLogin = async (req, res, next) => {
    const {
      email,
      password,
    } = req.body;

    try {
      const admin = await Admin.findOne({
        email: email,
      }).exec();

      if (!admin || !admin.authenticate(password)) {
        LogsController.write({
          eventName: 'LOGIN',
          ip: LogsController.extractIp(req),
          message: `failed login attempt for ${email}`,
          level: 3,
        });

        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      if (admin.isBlocked) {
        const err = new Error('The IDS has detected an abnormality with your access and has blocked it as a precaution. Please contact the Helpdesk.');
        err.status = 403;
        return next(err);
      }

      const accessToken = admin.generateToken();
      LogsController.write({
        eventName: 'LOGIN',
        ip: LogsController.extractIp(req),
        message: `Successful login attempt for ${email}`,
        level: 3,
        user: admin._id,
      });
      console.log('Admin Login Successful')
      const isSuccess = true;
      return res.status(200).json({
        isSuccess,
        accessToken,
        admin,
      });

    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ isSuccess: false, message: err.message });
      } else {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
      }
    }
  }

  register = async (req, res, next) => {
    const filter = req.body;

    if (!filter.type) {
      filter.type = 'guest';
    }

    if (!filter.password) {
      filter.password = "123456"
    }

    const existingUser = await User.findOne({ 'mobile': req.body.mobile });

    if (existingUser) {
      const err = new Error('Mobile number already exist.');
      err.status = 401;
      return next(err);
    } else {
      const params = this.filterParams(filter, this.whitelist);
      let newUser = new User({
        ...params,
        password: filter.password,
        type: filter.type,
        provider: 'local'
      });

      try {
        const user = await newUser.save();
        const accessToken = user.generateToken();
        const isSuccess = true;
        return res.status(200).json({
          accessToken,
          isSuccess,
          user,
        });
      } catch (err) {
        if (err.status) {
          res.status(err.status).json({ isSuccess: false, message: err.message });
        } else {
          console.error('Error:', err);
          res.status(500).json({ isSuccess: false, message: 'Internal server error' });
        }
      }
    }
  }

  checkCredentials = async (req, res, next) => {
    const {
      mobile
    } = req.body;

    try {
      const user = await User.findOne({
        mobile: mobile,
      }).exec();

      if (!user) {
        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      if (user.isBlocked) {
        const err = new Error('The IDS has detected an abnormality with your access and has blocked it as a precaution. Please contact the Helpdesk.');
        err.status = 403;
        return next(err);
      }

      return res.status(200).json({
        isSuccess: true
      });

    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ isSuccess: false, message: err.message });
      } else {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
      }
    }
  }

  otpLogin = async (req, res, next) => {
    const {
      mobile
    } = req.body;

    try {
      const user = await User.findOne({
        mobile: mobile,
      }).exec();

      if (!user) {
        LogsController.write({
          eventName: 'LOGIN',
          ip: LogsController.extractIp(req),
          message: `failed login attempt for ${mobile}`,
          level: 3,
        });

        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      if (user.isBlocked) {
        const err = new Error('The IDS has detected an abnormality with your access and has blocked it as a precaution. Please contact the Helpdesk.');
        err.status = 403;
        return next(err);
      }

      const accessToken = user.generateToken();
      LogsController.write({
        eventName: 'LOGIN',
        ip: LogsController.extractIp(req),
        message: `Successful login attempt for ${mobile}`,
        level: 3,
        user: user._id,
      });
      console.log('Log in Successful')
      const isSuccess = true;
      return res.status(200).json({
        isSuccess,
        accessToken,
        user,
      });

    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ isSuccess: false, message: err.message });
      } else {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
      }
    }
  }

  changePassword = async (req, res, next) => {
    const {
      mobile,
      password,
    } = req.body;

    try {
      const user = await User.findOne({
        mobile: mobile,
      }).exec();

      if (!user) {
        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      if (user.isBlocked) {
        const err = new Error('The IDS has detected an abnormality with your access and has blocked it as a precaution. Please contact the Helpdesk.');
        err.status = 403;
        return next(err);
      }
      let jsonData = {
        "password": password
      }
      let updatedUser = Object.assign(user, jsonData);
      const savedUser = await updatedUser.save();

      return res.status(200).json({
        isSuccess: true
      });

    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ isSuccess: false, message: err.message });
      } else {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
      }
    }
  }

}

export default new AuthController();
