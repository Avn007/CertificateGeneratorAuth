module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please Login first');
        res.redirect('/users/login');
    }
}



//need to make a file keys.js where you have your MongoDb connection key.
