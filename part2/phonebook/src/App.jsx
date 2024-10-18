import { useEffect, useState } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
// import axios from 'axios'
import personService from './services/persons'
// import './index.css'
const App = () => {
  const [persons, setPersons] = useState([
   
  ])

  const [newName, setNewName] = useState('')
  const handleNameChange=(event)=>{
    setNewName(event.target.value)
  }
  const [newNumber, setNewNumber]=useState('')
  const handleNumberChange=(event)=>{
    setNewNumber(event.target.value)
  }
  const [newQuery, setNewQuery]=useState('')
  const handleNewQuery=(e)=>{
    setNewQuery(e.target.value)
  }
  const[successMessage, setSuccessMessage]=useState(null)
  const[errorMessage, setErrorMessage]=useState(null)
  const Notification=({message,style})=>{
    if (message===null){
      return null
    }
    return (
      <div className={style}> 
        {message}
      </div>
    )
  }
  useEffect(() => {
    // axios
      // .get('http://localhost:3001/persons')
      // .then(response => {
      //   setPersons(response.data);
      // })
      personService
      .getAll()
      .then(initialPersons=>setPersons(initialPersons))
      .catch(error=>{
        console.log('error getting data:',error)
      })
      // .catch(error => {
      //   console.error('Error fetching data:', error);
      // });
  }, []);
  const deletePerson=(id)=>{
    const personToDelete=persons.find(person=>person.id===id)
    if(window.confirm(`delete ${personToDelete.name}?`)){
      personService
      .deletePerson(id)
      .then(()=>setPersons(persons.filter(person=>person.id!==id)))
      .catch(error=>{
        console.log('error deleting person:',error)
      })
    }

  }
  const addPerson=(event)=>{
    event.preventDefault()
    const personObject={name:newName,number: newNumber}
    // const nameExist=persons.some(person => person.name === newName)
    const personToUpdate=persons.find(person=>person.name===newName)
    if (personToUpdate){
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        personService
        .update(personToUpdate.id,personObject)
        .then(updatedPerson=>{
        setPersons(persons.map(person=>person.id!==personToUpdate.id?person:updatedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`Updated ${newName}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000);
      })
      .catch(error => {
        setErrorMessage(`Information of ${newName} has already been removed from server.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        console.log('error updating person:', error)
      })
      // alert(`${newName} is already added to phonebook`)
      return
    }}
    
    // axios
    //   .post('http://localhost:3001/persons',{name:newName,number: newNumber})
    //   .then(response=>{
    //     setPersons(persons.concat(response.data))
    //     setNewName('')
    //     setNewNumber('')
    //   })
    //   .catch(error=>{
    //     console.error("error adding person:",error)
    //   })
    personService
    .create(personObject)
    .then(returnedPerson=>{
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      setSuccessMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000);
    })
    .catch(error=>{
      console.log('error adding person:',error)
    })
  }

  const personsToShow= newQuery===''?persons:persons.filter(person=>person.name.toLowerCase().includes(newQuery))
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} style={'notification'}/>
      <Notification message={errorMessage} style={'error'}/>
      <Filter 
        newQuery={newQuery} 
        handleNewQuery={handleNewQuery} 
      />
      <h2>add a new</h2>
       <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>

    </div>
  )
}

export default App