class Api {
    constructor({ baseUrl, headers }) {
      this._baseUrl = baseUrl;
      this._headers = headers;
    }
  
    getUserInfo() {
      return fetch(`${this._baseUrl}/users/me`, {
        headers: { authorization: this._headers.authorization }
      })
        .then(res => {
          if (res.ok) return res.json();
          return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }
  
    getInitialCards() {
      return fetch(`${this._baseUrl}/cards`, {
        headers: { ...this._headers, authorization: this._headers.authorization }
      })
        .then(res => {
          if (res.ok) return res.json();
          return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }
  
    getUserAndCards() {
      return Promise.all([this.getUserInfo(), this.getInitialCards()])
        .then(([userData, cards]) => ({ userData, cards }));
    }
  
    editUserInfo({ name, about }) {
      return fetch(`${this._baseUrl}/users/me`, {
        method: "PATCH",
        headers: { ...this._headers, authorization: this._headers.authorization },
        body: JSON.stringify({ name, about })
      })
        .then(res => {
          if (res.ok) return res.json();
          return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }
  
    addNewCard({ name, link }) {
      return fetch(`${this._baseUrl}/cards`, {
        method: "POST",
        headers: { ...this._headers, authorization: this._headers.authorization, "Content-Type": "application/json" },
        body: JSON.stringify({ name, link })
      })
        .then(res => {
          if (res.ok) return res.json();
          return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }
  
    deleteCard(cardId) {
      return fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: { ...this._headers, authorization: this._headers.authorization }
      })
        .then(res => {
          if (res.ok) return res.json();
          return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }
  
    toggleLike(cardId, isLiked) {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: isLiked ? "PUT" : "DELETE",
        headers: { ...this._headers, authorization: this._headers.authorization }
      })
        .then(res => {
          if (res.ok) return res.json();
          return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }

    handleError(err) {
      console.error(err);
      throw err;
    }
  }
  
  export default Api;
  