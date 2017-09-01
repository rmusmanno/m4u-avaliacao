var Utils = require('../utils/response');
var Obj = require('../model/bookmark');

// List
exports.list = function (req, res) {
    var params = {};
    if (!req.user.admin)
        params = { owner: req.user._id };

    Obj.find(params, null, { sort: { owner:1 } }, function (err, objs) {
        if (err)
            return Utils.return_error(res);
        Utils.return_ok(res, objs);
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

    Obj.find(params, function (err, obj) {
        if (err)
          return Utils.return_error(res);
        if (!obj) 
          return Utils.return_notfound(res);
        Utils.return_ok(res, obj);
    });
};

// Update
exports.update = function (req, res) {
    var params = { _id: req.params.id };
    if (!req.user.admin)
        params = { owner: req.user._id, _id: req.params.id };

    req.body.updated = Date.now();
    Obj.findByIdAndUpdate(params, req.body, {new: true}, function (err, obj) {
        if (err)
          return Utils.return_error(res);
        Utils.return_ok(res, obj);
    });
};

// Delete
exports.delete = function (req, res) {
    var params = { _id: req.params.id };
    if (!req.user.admin)
        params = { owner: req.user._id, _id: req.params.id };

    Obj.remove(params, function (err, obj) {
        if (err)
          return Utils.return_error(res);
        Utils.return_ok(res, { "message": "Object was deleted." });
    });
};