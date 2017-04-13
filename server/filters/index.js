module.exports = {
    auth: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.status(401);
            res.json('You are not logged in.');
        }
    },

    guest: (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.status(401);
            res.json('You are already logged in.');
        }
    }
};