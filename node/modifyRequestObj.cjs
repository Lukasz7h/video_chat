
// modyfikujemy objekt odpowiedzi dla użytkownika który próbował się zarejestrować
function registerResponse(res, result)
{
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    res.write(JSON.stringify(result));
    return {res};
};

// zwracamy odpowiedź dla metody OPTIONS
function optionsMethodRequest(res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    return {res};
};

// zwracana jest odpowiedź dla użytkownika który próbował się zalogować
function loginResponse(res, result)
{
    res.setHeader("Content-Type", "application/json");

    if(result.jwt) res.setHeader("Set-Cookie", "jwt="+result.jwt+"; Expires="+new Date(new Date().getTime() + 60 * 60 * 1000 * 1000).toUTCString()+"http");

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

    res.write(JSON.stringify(result.data));
    return {res};
};

// zwracamy odpowiedź dla próby autoryzacji
function authResponse(res, data)
{
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    return {res, data};
}

module.exports = {
    registerResponse,
    optionsMethodRequest,
    loginResponse,
    authResponse
};