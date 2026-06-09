export default class TokenResponse {
    constructor(
        token,
        refreshToken,
        tokenExpiresIn,
        refreshTokenExpiresIn
    ) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.tokenExpiresIn = new Date(tokenExpiresIn);
        this.refreshTokenExpiresIn = new Date(refreshTokenExpiresIn);
    }

    static fromJson(json) {
        return new TokenResponse(
            json.token,
            json.refreshToken,
            json.tokenExpiresIn,
            json.refreshTokenExpiresIn
        );
    }

    isValid() {
        const now = new Date();
        return now < this.tokenExpiresIn;
    }

    saveToLocalStorage() {
        const token = {
            token: this.token,
            refreshToken: this.refreshToken,
            tokenExpiresIn: this.tokenExpiresIn,
            refreshTokenExpiresIn: this.refreshTokenExpiresIn
        };
        const tokenString = JSON.stringify(token);
        localStorage.setItem('token', tokenString);
    }

    static loadFromLocalStorage() {
        const tokenString = localStorage.getItem('token');
        if (!tokenString) return null;
        const tokenJson = JSON.parse(tokenString);

        return TokenResponse.fromJson(tokenJson);
    }
}