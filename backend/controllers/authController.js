// Importing authentication packages
const jwt = require('jsonwebtoken');
const env = require('dotenv').config()
const key = process.env.SECRET;
const bcrypt = require('bcrypt');
const userRepository = require("../repository/userRepository");
const {getUserById} = require("../repository/userRepository");

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
    const {surname, lastname, email, password} = req.body;

    if (surname === undefined || lastname === undefined || email === undefined || password === undefined) {
        res.status(400);
        throw new Error(
            `Not all required values are valid!`
        );
    }

    console.log("signup_post called with: surname[" + surname + "] lastname[" + lastname + "] email [" + email + "] password[" + password + "]")

    let userExists = await userRepository.userExists(email)
    if (userExists) {
        console.log('This email is already registered.')
        res.status(400);
        throw new Error(
            `The email address ${email} is already associated with an account. Please check and try again!`
        );
    }

    let pwHsh = await bcrypt.hash(password, await bcrypt.genSalt(12))
    userRepository.insertUser(surname, lastname, email, pwHsh).then(
        user => {
            const payload = {
                email: email,
            };
            createToken(payload)
            //   await emailVerification(user, token);
            //   res.status(200).json({
            //   //     message: `A verification email has been sent to ${user.email}. It will be expire after one day. If you not get verification Email click on resend token.`,
            //   //   });
            res.status(200).json({message: 'User ' + surname + " " + lastname + " " + email + ' has been created!'});
        },
        error => {
            console.log(error)
            res.status().json({message: 'Error: ' + error});
        }
    )
};

login_post = async (req, res) => {
    let {email, password} = req.body;
  //  let pwHsh = await bcrypt.hash(password, await bcrypt.genSalt(12))

    console.log("LOGIN: user[" + email + "] " + new Date())

    console.log("LOGIN: req.body = " + req.body)

    let userExists = await userRepository.userExists(email)

    if (!userExists) {
        console.log("Email could not be found in Database!")
        res.status(401);
        throw new Error(
            `The email address ${email} is not associated with any account. Please check and try again!`
        );
    }

    let user = await userRepository.getUser(email)
    if (!await bcrypt.compare(password, user.password)) {
        res.status(403)
        throw new Error(
            "Wrong email or password"
        )
    }

    const payload = {
        id : user.id,
        email: user.email,
    };

    const token = createToken(payload);

    res.status(200).json({token: `Bearer ${token}`});
};

module.exports = {
    signup_post,
    login_post,
};
