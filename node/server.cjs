const { createServer } = require("http");

// tu przechowywany tworzony i przechowywany jest serwer 
class Server
{
    _createServer;

    constructor(cb)
    {
        if(!Server.instance)
        {
            Server.instance = this;
            this._createServer = createServer(cb).listen(3000, "127.0.0.1");
        };

        return Server.instance;
    }
};

module.exports = {
    Server
};