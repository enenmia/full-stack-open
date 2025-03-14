import axios from 'axios'

const baseUrl = '/api/login'  // Proxy will forward this to the backend

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
