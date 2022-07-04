const { getDataFromReq } = require("./dataFromReq.cjs");
const { findUser } = require("./mongodb.cjs")

const { loginResponse } = require("./modifyRequestObj.cjs");
const { hashPassword } = require("./hashPassword.cjs");

const { userSettings } = require("./userSettings.cjs");

// sprawdzamy czy dane z logowania użytkownika spełniają nasze kryteria i czy taki użytkownik jest
async function validLoginForm(req, res)
{
    const loginData = JSON.parse( await getDataFromReq(req));

    return new Promise( async(resolve) => {
        (loginData.login.length >= userSettings.loginMin && loginData.login.length <= userSettings.loginMax)
        &&
        (loginData.password.length >= userSettings.passwordMin && loginData.password.length <= userSettings.passwordMax)?
        resolve( await findUser(res, {login: loginData.login, password: hashPassword(loginData.password)}) ):
        resolve( loginResponse(res, {data: {err: "len_err"} }));
    });
};

module.exports = {
    validLoginForm
}