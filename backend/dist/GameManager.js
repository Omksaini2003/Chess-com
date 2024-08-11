"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        // this.completedGames = []; // Initialize the completed games array
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
        console.log(`new user joined ${this.users.length}`);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        console.log(`one user left ${this.users.length}`);
        // Handle game termination if needed
    }
    addHandler(socket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            console.log(`backend presents: ${message.type}`);
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser && this.pendingUser !== socket) {
                    // Start a new game
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move);
                    if (game.isGameOver()) {
                        // Move the game to the completedGames array
                        // this.completedGames.push(game);
                        // Replace the game with a new instance
                        console.log('game over from GameManager');
                        const newGame = new Game_1.Game(game.player1, game.player2);
                        const gameIndex = this.games.indexOf(game);
                        if (gameIndex !== -1) {
                            this.games[gameIndex] = newGame;
                        }
                    }
                }
            }
        });
    }
}
exports.GameManager = GameManager;
