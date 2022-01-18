const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongo = require('./mongo')
var dotenv = require('dotenv').config()

const app = express()

morgan.token('content', (req) => {
  return JSON.stringify(req.body)
})


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] :content - :response-time ms'))

const PORT = process.env.PORT || 3001

//########API###########

app.get('/api/persons', (req, res) => {
  mongo.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  mongo.findById(id)
    .then(contacts => {
      if (contacts) {
        res.json(contacts)
      } else {
        next()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const number = req.body.number
  mongo.findByIdAndUpdate(id, { number: number  }, { new: true })
    .then(contacts => {
      if (contacts) {
        res.json(contacts)
      } else {
        next()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const contact = new mongo({
    'name': req.body.name,
    'number': req.body.number,
    'id':  Math.floor(Math.random() * 10000)
  })
  contact.save()
    .then(contacts => res.json(contacts))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  mongo.findByIdAndRemove(id).then(() => res.status(204).end())
})

//#########Info-page##########
app.get('/info', (req, res) => {
  mongo.find({}).then(contacts => res.send(`<div><h2>Puhelinluettelossa on ${contacts.length} henkilöä</h2><p>${Date()}</p></div>`))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'tietoa ei löytynyt' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'väärin muotoiltu id' })
  } else if (error.name === 'ValidationError') {
    return res.status(406).send({ error: 'pyyntö ei täyttänyt vaatimuksia: nimen pituus > 2, numeron pituus > 7 ja nimi ei saa olla palvelimella' })
  }
  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portilla ${PORT}`)
})
