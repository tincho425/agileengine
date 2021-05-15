export default function ({ $axios, redirect, store }) {
  $axios.onRequest(config => {
    console.log(config.method.toUpperCase()+' - ' + config.url)
  })

  $axios.onError(error => {
    // On error, get token, set token & re-request
    const code = parseInt(error.response && error.response.status)
    if(code === 401){
      return $axios.$post('/auth', {apiKey: '23567b218376f79d9415' })
      .then(async response => {
        $axios.setToken(response.token, 'Bearer')
        return $axios(error.config).then((rsp) =>{
          return rsp
        }).catch((e) => {
          console.log(e);
          return e
        })
      }).catch(error => {
        console.log(error);
      })
    }
    return error
  })
}
