// Importing authentication packages
const jwt = require('jsonwebtoken');
const key = process.env.SECRET;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Creating a JWT
// max age in seconds
const maxAge = 3 * 24 * 60 * 60;

// creating a token
const createToken = (payload) => {
  return jwt.sign(payload, key, {
    expiresIn: maxAge,
  });
};

signup_post = async (req, res) => {
  const { surname, lastname, email, password } = req.body;

  // const checkUser = await User.findOne({ email: email });

  // if (checkUser) {
  //   res.status(400);
  //   throw new Error('This email is already registered.');
  // }

  // const userData = { surname, lastname, email, password };

  // const salt = await bcrypt.genSalt();

  // userData.password = await bcrypt.hash(userData.password, salt);

  // const user = await User.create(userData);

  // if (user) {
  //   // generate token and save
  //   // var token = await new Token({
  //   //   _userId: user._id,
  //   //   value: crypto.randomBytes(16).toString('hex'),
  //   // });

  //   // const tokenSuccess = await token.save();

  //   // if (tokenSuccess) {
  //   //   await emailVerification(user, token);

  //   //   res.status(200).json({
  //   //     message: `A verification email has been sent to ${user.email}. It will be expire after one day. If you not get verification Email click on resend token.`,
  //   //   });
  //   // } else {
  //   //   res.status(500);
  //   //   throw new Error('Error creating verification token.');
  //   // }
  res.status(201).json({ message: 'User has been created!' });
  // } else {
  //   res.status(500);
  //   throw new Error('Error creating new user.');
  // }
};

login_post = async (req, res) => {
  let { email, password } = req.body;

  const data = {
    email: 'test@todoapp.com',
    password: '$2b$10$0lsHmHx7lUOJ6XZqG.WVqupwGWV60WxZT30xrKepYZy3497UZVefi',
  };

  let userFromDB = undefined;

  email === data.email ? (userFromDB = data) : (userFromDB = null);

  // const user = await User.findOne({ email });

  if (!userFromDB) {
    res.status(401);
    throw new Error(
      `The email address ${email} is not associated with any account. Please check and try again!`
    );
  }

  // comapre user's password if user is find in above step
  if (bcrypt.compareSync(password, userFromDB.password) === false) {
    res.status(401);
    throw new Error('Wrong Password!');
  }

  const payload = {
    email: userFromDB.email,
  };

  const token = createToken(payload);

  res.status(200).json({ token: `Bearer ${token}` });
};

module.exports = {
  signup_post,
  login_post,
};
