class Api {
    constructor(options) {
      this.options= options;
    }

    getUserInfo() {
        return fetch(`${this.options.baseUrl}/users/me`, {
            headers: {
                authorization: "46c1a639-4215-418c-8205-87dec37d68b7"
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            const error = new Error(`Error: ${res.status}`);
            error.status = res.status;
            return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }

    getInitialCards() {
        return fetch(`${this.options.baseUrl}/cards`, { 
            headers: {
                authorization: "46c1a639-4215-418c-8205-87dec37d68b7"
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            const error = new Error(`Error: ${res.status}`);
            error.status = res.status;
            return Promise.reject(new Error(`Error: ${res.status}`));
        })
        .catch(err => this.handleError(err));
    }

    getUserAndCards() {
        return Promise.all([this.getUserInfo(), this.getInitialCards()])
            .then(([userData, cards]) => {
                return { userData, cards };
            });
    }
    editUserInfo({ name, about }) {
        return fetch(`${this._baseUrl}/users/me`, {
              method: "PATCH",
              headers: this._headers,
              body: JSON.stringify({
                name,
                about,
              }),
            })
        .then(res => {
                if (res.ok) {
                    return res.json();
                }
                const error = new Error(`Error: ${res.status}`);
                error.status = res.status;
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