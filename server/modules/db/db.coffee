express = require 'express'
url = require 'url'
fs = require 'fs'
convert = require __dirname + '/csvToJson.coffee'
Datastore = require 'nedb'
db = new Datastore({ filename: 'data/datafile', autoload: true })
dbu = new Datastore({ filename: 'data/updatefile', autoload: true })
dataUpdate = require __dirname + '../../../data/update.json'

module.exports = 
	getForm: (req, res) ->
		res.render 'form'

	getFile: (req, res) ->
		file = req.files.loadDB
		info = {}
		info.docUpdate = file.lastModifiedDate
		info.docSize = file.size
		fs.rename file.path, "data/dbUpload.csv"
		fs.unlinkSync("data/datafile")
		convert "data/dbUpload.csv", (err,result) ->
			info.docItems = result.length
			fs.writeFile 'data/update.json', JSON.stringify(info), (err) ->
				console.log err
			db = null
			db = new Datastore({ filename: 'data/datafile', autoload: true })
			db.insert item for item in result
		res.end()

	getList: (req, res) ->
		parts = url.parse req.url,true
		search = []
		for param of req.query
			insert = {}
			insert[param] = req.query[param]
			search.push insert
		db.find
			$and: search
			, (err, docs) ->
				res.json docs

	getDetailsId : (req, res) ->
		db.find
			_id: req.params.id
		, (err, docs) ->
			res.json docs

	getStat: (req, res) ->
		res.json dataUpdate

	updateCustomer: (req, res) ->
		insert = {}
		insert.customer = req.body
		insert.date = new Date
		insert.action = 'update'
		dbu.insert insert

	addCustomer : (req, res) ->
		console.log 'entree add customer'
		insert = {}
		insert.customer = req.body
		insert.date = new Date
		insert.action = 'add'
		dbu.insert insert

	deleteCustomer:  (req, res) ->
		db.find
			_id: req.params.id
		, (err, docs) ->
			insert = {}
			insert.customer = docs
			insert.date = new Date
			insert.action = 'delete'
			dbu.insert insert


		
