const express=require("express");
const morgan=require("morgan");
const app=express();
const http = require('http');
const cors=require('cors');
const PORT = process.env.PORT || 3001


app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

morgan.token('post-data', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
  })

let phonebook=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {res.json(phonebook)})
app.get("/info", (req, res) => {
    const currentTime = new Date()
    res.send(`
        <p>Phonebook has info for ${phonebook.length} people</p>
        <p>Current time is: ${currentTime.toISOString()}</p>        
        `)})
app.get("/api/persons/:id",(req,res)=>{
    const id=req.params.id
    const person=phonebook.find(p=>p.id===id)
    if(person){
        res.json(person)
    }else{
        res.status(404).send()
    }
})
app.delete("/api/persons/:id",(req,res)=>{
    const id=req.params.id
    phonebook = phonebook.filter(person => person.id !== id)

    res.status(204).end()
})
app.post("/api/persons",(req,res)=>{
    const body=req.body
    if(!body.name || !body.number){
        return res.status(400).json({error: "Name and number are required"})
    }
    if(phonebook.some(person=>person.name===body.name)){
        return res.status(400).json({error: "Name must be unique"})
    }
    const newId=Math.floor(Math.random()*100000)
    const person={id:newId.toString(),name:body.name,number:body.number}
    phonebook=phonebook.push(person)
   res.json(person)
})
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })