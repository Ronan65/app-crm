var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , AuthCtrl =  require('../controllers/auth.coffee')
    , User =      require('../modules/users/users.coffee')
    , Customer = require('../modules/customers/index.coffee')
    , DataBase = require('../modules/db/db.coffee')

var routes = [

    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },

    // Local Auth

    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },

    //Customers resource
    {
        path: '/customers',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, DataBase.getList]
    },
    {
        path: '/customers/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, DataBase.getDetailsId]
    },
    {
        path: '/customers/:id',
        httpMethod: 'PUT',
        middleware: [ensureAuthenticated, DataBase.updateCustomer]
    },
    {
        path: '/customers',
        httpMethod: 'POST',
        middleware: [ensureAuthenticated, DataBase.addCustomer]
    },
    {
        path: '/customers/:id',
        httpMethod: 'DELETE',
        middleware: [ensureAuthenticated, DataBase.deleteCustomer]
    },

    //Upload files
    {
        path: '/db/list',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated,DataBase.getList]
    },
    {
        path: '/db/list/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, DataBase.getDetailsId]
    },
    {
        path: '/db/upload',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, DataBase.getForm]
    },
    {
        path: '/db/upload',
        httpMethod: 'POST',
        middleware: [ensureAuthenticated, DataBase.getFile]
    },
    {
        path: '/db/stat',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, DataBase.getStat]
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            if(req.user) {
                var username = req.user.username;
            }
            res.cookie('user', JSON.stringify({
                'username': username,
            }));
            res.render('index');
        }]
    }
];

module.exports = function(app) {

    _.each(routes, function(route) {
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                console.log('case post');
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return next();
    else                      return res.send(401);
}