import io from 'socket.io-client';
import { config } from "./config";


export let socket = null;

export function initSocketIo(authToken) {
    socket = io.connect(config.serverURL, {
        auth: {
            token: authToken
        }
    });

}