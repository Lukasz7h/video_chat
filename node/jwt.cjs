const jwtModule = require("jsonwebtoken");
const { authResponse } = require("./modifyRequestObj.cjs");

let find;
function setModule()
{
    find = { findUserByJwt } = require("./mongodb.cjs")
};

const secret = "asdJGJ9asd*(^)(*9868aaaWda&*)(^58&*^*&ads(*^78^*&^hjGhF67%$d&^P(v$cm6w ) s)&&5w9)(e";

// tworzymy jwt
function createJwt(res, dataUser)
{
    return jwtModule.sign(dataUser, secret, {expiresIn: 60 * 60 * 24 * 7});
};

// pobieramy wartość jwt
function getJwt(req, res, isSocket)
{
    return new Promise( async(resolve) => {
        if(!req.headers.cookie && !isSocket) { return resolve(authResponse(res, {can: false}))} ;
        if(!req.headers.cookie && isSocket) {
            return resolve(undefined);
        };

        if(!req.headers.cookie.includes("jwt")) return resolve(undefined);
        
        req.headers.cookie.split(";").forEach( async(element) => {
            if( element.includes("jwt") )
            {
                if(!find) setModule();
                const result = await find.findUserByJwt(null, element.split("=")[1], true);

                isSocket? (result.isset? resolve(jwtModule.decode(element.split("=")[1])) : resolve(undefined) ):
                resolve( validJwt(res, element.split("=")[1]));
            };
            
        });
    });
    
};

// sprawdzamy czy jwt jest OK
function validJwt(res, jwt)
{
    return new Promise((resolve) => {
        setModule();
        jwtModule.verify(jwt, secret)? resolve(find.findUserByJwt(res, jwt)): resolve(authResponse(res, {can: false}))
    });
};

module.exports = {
    createJwt,
    getJwt
};