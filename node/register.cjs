const { saveUser } = require("./mongodb.cjs");
const { registerResponse } = require("./modifyRequestObj.cjs");

const { getDataFromReq } = require("./dataFromReq.cjs");
const { userSettings } = require("./userSettings.cjs");

const { hashPassword } = require("./hashPassword.cjs");

// sprawdzamy poprawność danych do rejestracji
async function validRegisterData(req, res)
{
    const registerData = JSON.parse( await getDataFromReq(req));

    return new Promise( async(resolve) => {
        (registerData.login.length >= userSettings.loginMin && registerData.login.length <= userSettings.loginMax)
        &&
        (registerData.password.length >= userSettings.passwordMin && registerData.password.length <= userSettings.passwordMax)?
        resolve( await saveUser(res, {login: registerData.login, password: hashPassword(registerData.password)}) ):
        resolve( await registerResponse(res, {err: "len_err"}));
    });
};

module.exports = {
    validRegisterData
};