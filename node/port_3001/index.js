import path from 'path';
import { createServer } from 'http';

import express from 'express';
import { getIO, initIO } from './socket.cjs';

const app = express();

// zwracamy zestaw plików do użytkownika
app.use('/', express.static(path.join('static')));

const httpServer = createServer(app);

initIO(httpServer);
httpServer.listen(3001)

getIO();