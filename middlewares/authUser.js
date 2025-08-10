const jwt = require('jsonwebtoken');
require('dotenv').config();

const authUser = (req, res, next) => {
  const { token } = req.cookies;
   
  //if token is not available
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }
   //if token is available in cookies
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.user = { id: decoded.id }; // attach user info here
      //It is used to pass the user id to the next controller function
      next();
    } else {
      res.status(401).json({ success: false, message: 'Not Authorized' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

 module.exports = { authUser };

