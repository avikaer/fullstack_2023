import axios from 'axios'

const baseUrl = '/api/people'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
    .then(response => response.data)
    .catch(error => {
      throw error.response
    })
}

const deletePerson = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request
    .then(response => response.data)
    .catch(error => {
      throw error.response
    })
}

export default {
  getAll,
  create,
  deletePerson,
  update
}
