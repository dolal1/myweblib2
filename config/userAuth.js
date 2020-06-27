module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Login as an Admin to View this Resource');
        res.redirect('/users/login');
    }
}