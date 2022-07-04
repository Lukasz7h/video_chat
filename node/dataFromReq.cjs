
// pobieramy dane wysłane w żądaniu (dane z formularza)
function getDataFromReq(req, res)
{
    let body;
    req.on("data", (chunk) => {
        body = Buffer.from(chunk).toString("utf8");
    });

    return new Promise((resolve) => {
        req.on("end", () => {
            resolve( body );
        });
    });
    
};

module.exports = {
    getDataFromReq
};