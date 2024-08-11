import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
      private games: Game[];
      // private completedGames: Game[]; // Array to store completed games
      private pendingUser: WebSocket | null;
      private users: WebSocket[];

      constructor() {
            this.games = [];
            // this.completedGames = []; // Initialize the completed games array
            this.pendingUser = null;
            this.users = [];
      }

      addUser(socket: WebSocket) {
            this.users.push(socket);
            this.addHandler(socket);
            console.log(`new user joined ${this.users.length}`);
      }

      removeUser(socket: WebSocket) {
            this.users = this.users.filter(user => user !== socket);
            console.log(`one user left ${this.users.length}`);
            // Handle game termination if needed
      }

      private addHandler(socket: WebSocket) {
            socket.on('message', (data) => {
                  const message = JSON.parse(data.toString());

                  console.log(`backend presents: ${message.type}`);

                  if (message.type === INIT_GAME) {
                        if (this.pendingUser && this.pendingUser !== socket) {
                              // Start a new game
                              const game = new Game(this.pendingUser, socket);
                              this.games.push(game);
                              this.pendingUser = null;
                        } else {
                              this.pendingUser = socket;
                        }
                  }

                  if (message.type === MOVE) {
                        const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                        if (game) {
                              game.makeMove(socket, message.payload.move);

                              if (game.isGameOver()) {
                                    // Move the game to the completedGames array
                                    // this.completedGames.push(game);

                                    // Replace the game with a new instance
                                    console.log('game over from GameManager');
                                    const newGame = new Game(game.player1, game.player2);
                                    const gameIndex = this.games.indexOf(game);
                                    if (gameIndex !== -1) {
                                          this.games[gameIndex] = newGame;
                                    }
                              }
                        }
                  }
            });
      }

      // Method to retrieve all completed games
      // getCompletedGames(): Game[] {
      //       return this.completedGames;
      // }

      // // Method to retrieve details of the last completed game
      // getLastCompletedGame(): Game | null {
      //       return this.completedGames.length > 0 ? this.completedGames[this.completedGames.length - 1] : null;
      // }
}
