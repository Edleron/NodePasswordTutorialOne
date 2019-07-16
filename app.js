const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// "Body Parse" Html İnputlarını Datalarını Almamıza Yarayan bir Npm Modülüdür.
// Validation / Form Validation ile kendi kontrol sistemizi yazdık
// "bcryptJs"  ile password şifreleme işlemi yapacağız
// "connect-flash" İki Sayfa ARasında Redirect Yapılır iken Ekranda Mesaj Gösterme "Flash"
// Bunlar ile birlikte express-session, ve cookie-parser'de indirildi

//Schema
const User = require('./models/User');

//Routers
const userRouter = require('./routes/users');

const app = express();
const PORT = 5000 || process.env.PORT;

//Flash Middlewares
app.use(cookieParser('passportTutorial'));
app.use(session({
    cookie: {
        maxAge: 6000,
    },
    resave: true,
    secret: "passportTutorial",
    saveUninitialized: true
}));
app.use(flash());

//Passport: Initialize --Passport middleware Olarak araya girecektir.
app.use(passport.initialize());
app.use(passport.session());


//Global - Res.Locals --Midleware
app.use((req, res, next) => {
    //Our own Flash
    res.locals.flashSuccess = req.flash("flashSuccess");
    res.locals.flashError = req.flash("flashError");

    //Passport Flash Mesajlarnı Almak için
    res.locals.passportFailure = req.flash("error");
    res.locals.passportSuccess = req.flash("success");

    //Our Logged In User
    res.locals.user = req.user;

    //middleWare Araya girer ve eğer succees yakalamz ise next ile devam ettirmemiz gerekiyor.
    next();
});

//Mongo Db Connection Strings
mongoose.connect('mongodb://localhost/passportdb', {
    useNewUrlParser: true
});

//Mongo Db Connect
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log("Connected to Database");
});

//Tempalete Engine Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'mainLayout'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

//Router Middleware
app.use(userRouter);

app.get('/', (req, res, next) => {
    //Bütün User'leri Listeleme
    User.find({}).then(users => {
        res.render('pages/index', {
            users
        });
    }).catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.render('static/404')
});

app.listen(PORT, () => {
    console.log("App Started");
});