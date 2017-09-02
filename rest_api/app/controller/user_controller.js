var Utils = require('../utils/response');
var Obj = require('../model/user');

const userDefaultReturnFields = { 'username': '1', 'admin': '1', 'updated': '1' };

// List
exports.list = function (req, res) {
    if (req.user.admin) {
        Obj.find({}, userDefaultReturnFields, function (err, objs) {
        if (err)
            return Utils.return_error(res);
        Utils.return_ok(res, objs);
        });
    } else {
        Obj.findById(req.user._id, userDefaultReturnFields, function (err, obj) {
            if (err)
                return Utils.return_error(res);
            if (!obj) 
                return Utils.return_notfound(res);
            Utils.return_ok(res, obj);
        });
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
            Utils.return_ok(res, { '_id': obj._id });
        });
};

// Read
exports.read = function (req, res) {
    if (req.user.admin || req.user._id == req.params.id) {
        Obj.findById(req.params.id, userDefaultReturnFields, function (err, obj) {
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

        var opts = { 'new': true, 'fields': userDefaultReturnFields };

        Obj.findOneAndUpdate(req.params.id, req.body, opts, function (err, obj) {
            if (err)
                return Utils.return_error(res);
            return Utils.return_ok(res, obj);
        });
    }

    return Utils.return_error(res);
};

// Delete
exports.delete = function (req, res) {
    if (req.user.admin || req.user._id == req.params.id) {
        Obj.findById(req.params.id, userDefaultReturnFields, function (err, obj) {
            if (err)
                return Utils.return_error(res);
            obj.remove();
            return Utils.return_ok(res, {"message": "Object " + obj._id + " was deleted." });
        });
    }

    return Utils.return_error(res);
};

// Me
exports.me = function (req, res) {
    Obj.findById(req.user._id, userDefaultReturnFields, function (err, obj) {
        if (err)
            return Utils.return_error(res);
        if (!obj) 
            return Utils.return_notfound(res);
        return Utils.return_ok(res, obj);
    });
};