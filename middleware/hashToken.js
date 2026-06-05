const CryptoJS = require("crypto-js");

const hashToken = (token) => {
    return CryptoJS.HmacSHA256(
        token,
        process.env.TOKEN_SECRET
    ).toString(CryptoJS.enc.Hex);

};

module.exports = hashToken;