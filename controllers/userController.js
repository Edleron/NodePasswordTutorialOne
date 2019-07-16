const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');
const formValidation = require('../validation/formValidation');

require('../authentication/passport/local');

module.exports.getUserLogin = (req, res, next) => {
    res.render('./pages/login');
};
module.exports.getUserLogout = (req, res, next) => {
    req.logout();
    req.flash("success", "Successfuly Logout");
    res.redirect("/login");
};
module.exports.getUserRegister = (req, res, next) => {
    res.render('./pages/register');
};
module.exports.postUserLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "login",
        failureFlash: true,
        successFlash: true
    })(req, res, next);
    //Üsteki (req,res,next) ile kodu hemen çalıştırdık.
};
module.exports.postUserRegister = (req, res, next) => {
    // => Variables
    const username = req.body.username;
    const password = req.body.password;
    const errors = [];

    //Server Side Validation
    const validationErrors = formValidation.registerValidation(username, password);
    if (validationErrors.length > 0) {
        return res.render('pages/register', {
            username: username,
            password: password,
            errors: validationErrors
        });
    }


    // => Username Verification
    User.findOne({
        username
    }).then(user => {
        if (user) {
            errors.push({
                message: 'Username Already In Use'
            });
            return res.render('pages/register', {
                // => Username Validation
                username,
                password,
                errors
            });
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) throw err;

                // => User Schema Database
                //Tanımlananan Şemaya Göre User Instance Oluşturduk.
                const newUser = new User({
                    /* Defaul */
                    //username:username,
                    //password:password

                    /* Es 6 İle Beraber Field'lar Aynı Olduğundan Aşağıdaki Gibi Kullandık */
                    //username,
                    //password

                    /* Hash'lenmiş */
                    username: username,
                    password: hash
                });

                //MongoDb Insert Etme && ve Promise Yapısı                
                newUser.save().then(() => {
                    console.log("Succesful");
                    //Flash Succes
                    req.flash("flashSuccess", "Succesfuly Registered");
                    res.redirect('/');
                }).catch(err => console.log(err));

            });
        });

    }).catch(err => console.log(err));



};