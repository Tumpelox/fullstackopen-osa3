const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

morgan.token('content', (req) => {
    return JSON.stringify(req.body)
  })

app.use(morgan(':method :url :status :res[content-length] :content - :response-time ms'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let list = [
      {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
      },
      {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523 "
      },
      {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
      },
      {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
      }
    ]

app.get('/api/persons', (req, res) => {
    res.json(list)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = list.find(person => person.id === id)

    res.json(person)
})

app.post('/api/persons', (req, res) => {
    const person = {
        "name": req.body.name,
        "number": req.body.number,
        "id":  Math.floor(Math.random() * 10000)
    }
    list = list.concat(person)
    console.log(list)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    list = list.filter(person => person.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`<div><h2>Puhelinluettelossa on ${list.length} henkilöä</h2><p>${Date()}</p></div>`)
})

app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portilla ${PORT}`)
})
