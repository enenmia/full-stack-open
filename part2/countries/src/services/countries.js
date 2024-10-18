import axios from "axios";
const baseUrl='https://studies.cs.helsinki.fi/restcountries/api'

const getAll=()=>{
    const request=axios.get(`${baseUrl}/all`)
    return request.then(response=>response.data)
}
const getByName = (name) => {
    return axios.get(`${baseUrl}/name/${name}`).then(response => response.data);
  };

export default{
    getAll,
    getByName
    // update,
    // create,
    // deletePerson
}