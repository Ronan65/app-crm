passport = require("passport")
User = require("../modules/users/users.coffee")
module.exports =

  login: (req, res, next) ->
    passport.authenticate("local", (err, user) ->
      return next(err)  if err
      return res.send(400)  unless user
      req.logIn user, (err) ->
        return next(err)  if err
        req.session.cookie.maxAge = 1000 * 60 * 60 * 2  if req.body.rememberme
        res.json 200,
          username: user.username


    ) req, res, next

  logout: (req, res) ->
    req.logout()
    res.send 200