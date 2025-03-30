class Api {
    constructor(options) {
      // constructor body
    }
  
    getInitialCards() {
        return fetch("https://around-api.en.tripleten-services.com/v1", {
          headers: {
            authorization: "46c1a639-4215-418c-8205-87dec37d68b7"
          }
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            }
          });
      }
  
    // other methods for working with the API
  }
  
export default Api;