const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
require('dotenv').config()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
			response.json(person)
		} else {
			response.status(404).end()
		}
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete({_id:request.params.id}).then(person => {
        if (person) {
            response.status(204).end()
        }
        else {
            response.status(404).end()
        }
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).end()
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.length)
    })
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	
	if (error.name === 'CastError') {
		return response.status(400).send({error: 'malformatted id'})
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)