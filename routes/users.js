const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//LOGIN page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) =>{
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Form Validation
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all the details.' });
    }
    if(password != password2){
        errors.push({ msg: 'Passwords do not match.' });
    }
    if(password.length < 6){
        errors.push({ msg: 'Password should be 6 characters long!!' });
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else{
        //After successful validation
        User.findOne({ email: email })
        .then(user => {
            if(user){
                //User already exists
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else{
                const newUser = new User({
                    name,
                    email,
                    password
                });

                //Hash Password using bcrypt
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        newUser.password = hash;

                        //Save User
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'Registration Successful!!');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                }));
            }
        });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login');
});

module.exports = router;