var Utils = require('../utils/response');
var Obj = require('../model/user');

// List
exports.list = function (req, res) {
    if (req.user.admin) {
        Obj.find({}, function (err, objs) {
        if (err)
            return Utils.return_error(res);
        Utils.return_ok(res, objs);
        });
    } else {
        Utils.return_error(res);
    }
};

// Create
exports.create = function (req, res) {
    Obj.create({
            username: req.body.username,
            password: req.body.password,
            admin: false        // user can only be created as client
        },
        function (err, obj) {
            if (err)
            	return Utils.return_error(res);
            Utils.return_ok(res, obj);
        });
};

// Read
exports.read = function (req, res) {
    if (req.user.admin || req.user._id == req.params.id) {
        Obj.findById(req.params.id, function (err, obj) {
            if (err)
                return Utils.return_error(res);
            if (!obj) 
                return Utils.return_notfound(res);
            Utils.return_ok(res, obj);
        });
    } else {
        Utils.return_error(res);
    }
};

// Update
exports.update = function (req, res) {
    if (req.user.admin || req.user._id == req.params.id) {
        if (!req.user.admin && req.body.admin)  // only admin users can grant admin status
            req.body.admin = false;

        req.body.updated = Date.now();
        Obj.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, obj) {
            if (err)
                return Utils.return_error(res);
            Utils.return_ok(res, obj);
        });
    }
};

// Delete
exports.delete = function (req, res) {
    if (req.user.admin || req.user._id == req.params.id) {
        Obj.findById(req.params.id, function (err, obj) {
            if (err)
                return Utils.return_error(res);
            obj.remove();
            Utils.return_ok(res, {"message": "Object " + obj._id + " was deleted." });
        });
    }
};

// Me
exports.me = function (req, res) {
    Obj.findById(req.user._id, function (err, obj) {
        if (err)
            return Utils.return_error(res);
        if (!obj) 
            return Utils.return_notfound(res);
        Utils.return_ok(res, obj);
    });
};