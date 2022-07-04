const mongodbModule = require("mongodb");
const { registerResponse, loginResponse, authResponse } = require("./modifyRequestObj.cjs");

const { createJwt } = require("./jwt.cjs");

// objekt zawiera połączenie z baza danych MongoDB i może zwracać połączenie z nią oraz kolekcje w której zapisujemy użytkowników
const mongoSettings = {
    mongoClient: new mongodbModule.MongoClient("mongodb://localhost:27017"),
    mongoDB: () => mongoSettings.mongoClient.db("video-chat"),

    mongoCollection: () => mongoSettings.mongoDB().collection("users"),
    mongoConnect: (cb) => mongoSettings.mongoClient.connect(cb.bind(this, mongoSettings.mongoCollection()))
};

//zapisaywanie użytkownika w bazie danych
function saveUser(res, data)
{
    return new Promise((resolve) => {

        mongoSettings.mongoConnect( async(collection) => {

            const user = await collection.findOne({
                login: data.login
            });

            if(user) return resolve( registerResponse(res, {err: "err_isset_user"}));
            await collection.insertOne(data);

            resolve( registerResponse(res, {registerWell: true}));
        });
    });
};

//aktualizujemy token użytkownika
function updateUserJwt(res, data)
{
    return new Promise((resolve) => {
        mongoSettings.mongoConnect( async(collection) => {
            await collection.updateOne(data.user, {
                $set: {
                    token: data.token
                }
            });

            resolve(loginResponse(res, { data: {login: true}, jwt: data.token } ));
        });
    });
    
}

// szukamy użytkownika w bazie danych poprzez jsonwebtoken
function findUserByJwt(res, token, isSock)
{
    return new Promise((resolve) => {
        mongoSettings.mongoConnect( async(collection) => {
            const user = await collection.findOne({
                token
            });

            if(user && isSock) return resolve({isset: true})
            else if(!user && isSock) return resolve({isset: false});

            user? resolve(authResponse(res, {can: true})): resolve(res, {can: false});
        });
    });
}

//wyszukiwanie użytkownika z bazy danych w przypadku logowania
function findUser(res, data)
{
    return new Promise((resolve) => {
        mongoSettings.mongoConnect( async(collection) => {
            const user = await collection.findOne({
                login: data.login,
                password: data.password
            });
            user? resolve( await updateUserJwt(res, {user, token: createJwt(res, {login: user.login})} )):
            (  resolve( loginResponse(res, {data: {err: "wrong_data"} })) );
        });
    });
};

module.exports = {
    saveUser,
    findUser,
    findUserByJwt
};