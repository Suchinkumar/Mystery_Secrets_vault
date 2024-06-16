
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "this is a long string",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secrets: [String]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
}, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ googleId: profile.id, username: profile.emails[0].value }, (err, user) => {
        return cb(err, user);
    });
}));


app.get("/", (req, res) => res.render("home"));
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/secrets", passport.authenticate("google", { failureRedirect: "/login", successRedirect: "/secrets" }));
app.get("/secrets", (req, res) => {
    User.find({ "secrets": { $ne: null } }, (error, foundUsers) => {
        if (error) {
            console.error(error);
        } else {
            res.render("secrets", { usersWithSecrets: foundUsers, loggedIn: req.isAuthenticated() });
        }
    });
});
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.error(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => res.redirect("/secrets"));
    });
});
app.post("/login", passport.authenticate("local", { failureRedirect: "/login", successRedirect: "/secrets" }));
app.get("/submit", (req, res) => req.isAuthenticated() ? res.render("submit") : res.redirect("/login"));
app.post("/submit", (req, res) => {
    const { secret } = req.body;
    if (req.isAuthenticated() && secret.trim()) {
        User.findById(req.user.id, (err, foundUser) => {
            if (err) {
                console.error(err);
                return res.redirect("/login");
            }
            foundUser.secrets.push(secret);
            foundUser.save(() => res.redirect("/secrets"));
        });
    } else {
        res.redirect("/login");
    }
});
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, () => console.log("Server started on port 3000."));