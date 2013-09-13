express = require 'express'
fs = require 'fs'

_customers = require __dirname + '/customers.json'

app = module.exports = express()

app.use express.bodyParser()

module.exports = 
    #page d'accueil client, renvoie la liste client
    getListCustomers: (req, res) ->
        console.log("liste")
        res.json _customers

    #page renvoyant le client passé en parametre
    getDetailsCustomer: (req, res) ->
        console.log("details : " + req.params.id)
        res.json _customers.filter (customer) ->
            return false if customer["id"] isnt req.params.id
            console.log customer
            true

    #page permettant la modification de client
    updateCustomer: (req, res) ->
        index = null
        customer = _customers.filter (customer, i) ->
            return false if customer["id"] isnt req.params.id
            index = i
            true
        if index? then _customers[index] = req.body else _customers.push(req.body)
        fs.writeFile __dirname + '/customers.json', JSON.stringify(_customers), (err) ->
            console.log err
            res.send 200

    #page permettant l'ajout de client
    addCustomer: (req, res) ->
        console.log("entree add")
        index = null
        customer = _customers.filter (customer, i) ->
            return false if customer["id"] isnt req.params.id
            index = i
            true
        console.log(customer)
        _customers.push(req.body) if index == null
        fs.writeFile __dirname + '/customers.json', JSON.stringify(_customers), (err) ->
            console.log err
            res.send 200

    #page permettant la suppression de client
    deleteCustomer:  (req, res) ->
        console.log("entree del")
        index = null
        customer = _customers.filter (customer, i) ->
            console.log("entree filtre")
            return false if customer["id"] isnt req.params.id
            index = i
            true
        console.log(index)
        if index? then _customers.splice(index,1)
        fs.writeFile __dirname + '/customers.json', JSON.stringify(_customers), (err) ->
            console.log err
            res.send 200