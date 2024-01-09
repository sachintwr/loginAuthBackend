import jwt from 'jsonwebtoken';
import User from '../models/user';
import Admin from '../models/admin';
import Constants from '../config/constants';


const {
  sessionSecret,
} = Constants.security;


export default function authenticate(req, res, next) {
  console.log('authenticate', req.headers.authorization)
  let authorization;
  // get jwt token from header
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    authorization = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    authorization = req.query.token;
  }

  jwt.verify(authorization, sessionSecret, async (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }

    // If token is decoded successfully, find User and attach to our request
    // for use in our route or other middleware
    try {
      let user = null;

      if (decoded.userLogin) {
        user = await User.findById(decoded._id).exec();

        if (!user) {
          user = await Admin.findById(decoded._id).exec();
        }
      }


      if (!user) {
        return res.sendStatus(401);
      }

      req.currentUser = user;

      next();
    } catch (err) {
      next(err);
    }
  });
}
