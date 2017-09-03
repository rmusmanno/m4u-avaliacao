var Utils = require('../utils/response');
var Obj = require('../model/bookmark');
var User = require('../model/user')

const bookmarkDefaultReturnFields = { 'url': '1', 'owner': '1', 'updated': '1' };

// List
exports.list = function (req, res) {
    var params = {};
    if (!req.user.admin)
        params = { owner: req.user._id };

    Obj.find(params, bookmarkDefaultReturnFields, { sort: { owner:1 } }, function (err, objs) {
        if (err)
            return Utils.return_error(res);

        User.populate(objs, { path: 'owner', select: 'username' }, function (err, popObjs) {
            if (err)
                return Utils.return_error(res);
            return Utils.return_ok(res, popObjs);
        });
    });   
};

// Create
exports.create = function (req, res) {
    Obj.create({
            url: req.body.url,
            owner: req.user._id
        },
        function (err, obj) {
            if (err)
                return Utils.return_error(res);
            Utils.return_ok(res, obj);
        });
};

// Read
exports.read = function (req, res) {
    var params = { _id: req.params.id };
    if (!req.user.admin)
        params = { owner: req.user._id, _id: req.params.id };

    Obj.find(params, bookmarkDefaultReturnFields, function (err, obj) {
        if (err)
          return Utils.return_error(res);
        if (!obj) 
          return Utils.return_notfound(res);

        User.populate(obj, { path: 'owner', select: 'username' }, function (err, popObj) {
            if (err)
                return Utils.return_error(res);
            return Utils.return_ok(res, popObj);
        });
    });
};

// Update
exports.update = function (req, res) {
    if (req.body.url) {
        var params = { _id: req.params.id };
        if (!req.user.admin)
            params = { owner: req.user._id, _id: req.params.id };

        req.body.updated = Date.now();

        var opts = { 'new': true, 'fields': bookmarkDefaultReturnFields };
        var upd = req.body;

        Obj.findOneAndUpdate(params, upd, opts, function (err, obj) {
            if (err)
                return Utils.return_error(res);
            if (!obj)
                return Utils.return_error(res);
            Utils.return_ok(res, obj);
        });
    } else {
        Utils.return_error(res);
    }


};

// Delete
exports.delete = function (req, res) {
    var params = { _id: req.params.id };
    if (!req.user.admin)
        params = { owner: req.user._id, _id: req.params.id };

    Obj.findOne(params, bookmarkDefaultReturnFields, function (err, obj) {
        if (err)
            return Utils.return_error(res);
        if (!obj)
            return Utils.return_error(res);
        obj.remove();
        Utils.return_ok(res, {"message": "Object " + obj._id + " was deleted." });
    });
};