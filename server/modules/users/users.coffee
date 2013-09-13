User = undefined
_ = require("underscore")
_users = require __dirname + '/users.json'
passport = require("passport")
LocalStrategy = require("passport-local").Strategy

module.exports =
  # findAll: ->
  #   _.map users, (user) ->
  #     _.clone user


  findById: (id) ->
    _.clone _.find(_users, (user) ->
      user.id is id
    )

  findByUsername: (username) ->
    _.clone _.find(_users, (user) ->
      user.username is username
    )

  # findByProviderId: (provider, id) ->
  #   _.find users, (user) ->
  #     user[provider] is id

  localStrategy: new LocalStrategy((username, password, done) ->
    user = module.exports.findByUsername(username)
    unless user
      done null, false,
        message: "Incorrect username."

    else unless user.password is password
      done null, false,
        message: "Incorrect username."

    else
      done null, user
  )
  serializeUser: (user, done) ->
    done null, user.id

  deserializeUser: (id, done) ->
    user = module.exports.findById(id)
    if user
      done null, user
    else
      done null, false