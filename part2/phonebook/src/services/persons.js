import axios from "axios";
// const baseUrl='http://localhost:3001/api/persons'
const baseUrl='/api/persons'
const getAll=()=>{
    const request=axios.get(baseUrl)
    return request.then(response=>response.data)
}

const update = (id,newObject)=>{
    const request=axios.put(`${baseUrl}/${id}`,newObject)
    return request.then(response=>response.data)
}

// const create = (newObject)=>{
//     const request=axios.post(baseUrl,newObject)
//     return request.then(response=>response.data)
// }
const create = (newObject) => {
    return axios
        .post(baseUrl, newObject)
        .then(response => response.data)
        .catch(error => {
            if (error.response && error.response.status === 400) {
                return getAll().then(persons => {
                    const existingPerson = persons.find(p => p.name === newObject.name);
                    if (existingPerson) {
                        return update(existingPerson.id, newObject);
                    }
                    throw error;
                });
            }
            throw error;
        });
};

const deletePerson =(id)=>{
    const request=axios.delete(`${baseUrl}/${id}`)
    return request.then(response=>response.data)
}

export default{getAll,update,create,deletePerson}