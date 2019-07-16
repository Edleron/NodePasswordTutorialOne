const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrpypt = require('bcryptjs');

const User = require('../../models/User');

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({
        username
    }, (err, user) => {

        /*
        return done(err, null, "Bir Hata Oluştu"
        err = Hata Mesajı
        Null = User
        "Bir Hata Oluştu" = Message
        */
        if (err) return done(err, null, "Bir Hata Oluştu")

        if (!user) {
            return done(null, false, "User Not Found");
        }

        /*
        password,user.password, ifadelerinde

        password = şifrelenmemiş olan
        user.password = şifrelenmiş olan
        */
        bcrpypt.compare(password, user.password, (err, res) => {
            if (res) {
                /* req.user serialize edilip buradan kullanılacak */
                return done(null, user, "Successfully Logged In")
            } else {
                return done(null, false, "Incorrect Password")
            }
        })
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});