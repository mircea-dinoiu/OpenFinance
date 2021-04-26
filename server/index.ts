#!/usr/bin/env node

import http from 'http';
import dotenv from 'dotenv';
import {getDb} from './getDb';
import {setupCrons} from './crons';
import {RequestListener} from './RequestListener';

function main() {
    dotenv.config();

    const sql = getDb();

    setupCrons();

    const app = RequestListener();

    /**
     * Get port from environment and store in Express.
     */
    const port = normalizePort(process.env.PORT || '8080');

    app.set('port', port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    sql.sync().then(() => {
        server.listen(port);
        server.on(
            'error',
            /**
             * Event listener for HTTP server "error" event.
             */ function onError(error: {syscall: string; code: string}) {
                if (error.syscall !== 'listen') {
                    throw error;
                }

                const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

                // handle specific listen errors with friendly messages
                switch (error.code) {
                    case 'EACCES':
                        console.error(bind + ' requires elevated privileges');
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        console.error(bind + ' is already in use');
                        process.exit(1);
                        break;
                    default:
                        throw error;
                }
            },
        );
        server.on(
            'listening',
            /**
             * Event listener for HTTP server "listening" event.
             */ function onListening() {
                const addr = server.address();
                const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;

                console.log('------------ FINANCIAL ------------');
                console.log('Listening on ' + bind);
            },
        );
    });
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

if (require.main === module) {
    main();
}
