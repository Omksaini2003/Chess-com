"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
// interface Game{
//       id: number;
//       name: string;
//       player1: WebSocket;
//       player2: WebSocket;
// }
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
        // this.showUsers();
        console.log(`new user joined ${this.users.length}`);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        console.log(`one user left ${this.users.length}`);
        //stop game cuz user left 
    }
    addHandler(socket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            console.log(`backend presents : ${message.type}`);
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser && this.pendingUser != socket) {
                    //start a game
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else
                    this.pendingUser = socket;
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("inside make move");
                    console.log(message.payload);
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
