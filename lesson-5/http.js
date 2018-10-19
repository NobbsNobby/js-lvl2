class Http {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  request(url = '/', method = 'GET') {
    return fetch(`${this.baseURL}${url}`, {
      method
    }).then((res) => {
      return res.json()
    }).catch((err) => {
      console.error(err)
    })
  }
  get(url = '/') {
    return this.request(url, 'GET')
  }
  post(url = '/', queryString) {
    return this.request(`${url}?${queryString}`, 'POST')
  }
  delete(url = '/', queryString) {
    return this.request(`${url}?${queryString}`, 'DELETE')
  }
  patch(url = '/', queryString) {
    return this.request(`${url}?${queryString}`, 'PATCH')
  }
}
