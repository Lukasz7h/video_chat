import { Server } from "./server.cjs";
import { validRegisterData } from "./register.cjs";

import { optionsMethodRequest } from "./modifyRequestObj.cjs";
import { validLoginForm } from "./login.cjs";

import { getJwt } from "./jwt.cjs";

// metody dla rządania GET
const allowParamsGET = {
    auth: (req, res) => {
        return new Promise( (resolve) => resolve( getJwt(req, res, false) ));
    }
}

// metody dla rządania POST
const allowParamsPOST = {
    login: (req, res) => {
        return new Promise( async(resolve) => resolve(await validLoginForm(req, res) ));
    },
    register: (req, res) => {
        return new Promise( async(resolve) => resolve(await validRegisterData(req, res) ));
    }
};


// pobieramy parametry z linku url zawartym w żądaniu i przechodzimy do dalszej metody
function methods(req, res, method)
{
    return new Promise( async(resolve) => {
        const urlSearchParams = new URLSearchParams(req.url);
        const urlWorth = urlSearchParams.keys().next().value;
    
        let that;
        for( let e in that = method == "POST"? allowParamsPOST: allowParamsGET)
        {
            if(urlWorth.includes(e))
            {
                resolve( await that[`${e}`](req, res, urlWorth.includes("room")? urlWorth.split("/")[2]: false));
                break;
            };
        };
    });
};


// jeśli wywsłana metoda jest przez nas obsługiwana to wyszukujemy funkcji adekwatnej do niej
function serveMethod(req, res)
{
    return new Promise( async(resolve) => {
        switch(req.method)
        {
            case "GET": res = await methods(req, res, req.method);
            break;
            case "POST": res = await methods(req, res, req.method);
            break;
            case "OPTIONS": res = optionsMethodRequest(res);
            break;
        };

        resolve(res);
    });
    
};

const server = new Server(async (req, res) => {

    // zwracamy odpowiedni objekt odpowiedzi w zależności od przesłanej metody
    res = await serveMethod(req, res);
    return res['res']? res['res'].end(): res;
});