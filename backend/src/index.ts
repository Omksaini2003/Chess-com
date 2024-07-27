
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { SOCKET_PORT } from './messages';

const wss = new WebSocketServer({ port: SOCKET_PORT });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws)



  ws.on('disconnect', ()=> gameManager.removeUser(ws))

});


