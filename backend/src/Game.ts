import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
      public player1: WebSocket;
      public player2: WebSocket;
      public player1Color: string;
      public player2Color: string;

      private board: Chess;
      private moves: { move: { from: string; to: string }; playedBy: string }[];
      private startTime: Date;
      private moveCount = 0;

      constructor(player1: WebSocket, player2: WebSocket) {
            this.player1 = player1;
            this.player2 = player2;
            this.player1Color = "w";
            this.player2Color = "b";

            this.board = new Chess();
            this.moves = [];
            this.startTime = new Date();

            this.player1.send(
                  JSON.stringify({
                        type: INIT_GAME,
                        payload: {
                              color: "w",
                        },
                  })
            );
            this.player2.send(
                  JSON.stringify({
                        type: INIT_GAME,
                        payload: {
                              color: "b",
                        },
                  })
            );
      }

      makeMove(socket: WebSocket, move: { from: string; to: string }) {
            console.log("make move");

            if (move.from === "" && move.to === "") {
                  console.log("Time out");
                  this.sendGameOverMessage(move);
                  return;
            }

            try {
                  const playedBy = this.board.turn();
                  this.board.move(move);

                  this.moves.push({ move: move, playedBy: playedBy });
                  // console.log(this.moves);

                  this.moveCount++;
            } catch (e) {
                  console.log(e);
                  return;
            }

            if (this.board.isGameOver()) {
                  this.sendGameOverMessage(move);
                  return;
            }

            this.sendMoveToPlayers(move);
      }

      private sendMoveToPlayers(move: { from: string; to: string }) {
            if (this.moveCount % 2 === 0) {
                  this.player1.send(
                        JSON.stringify({
                              type: MOVE,
                              payload: {
                                    move: move,
                                    moves: this.moves,
                                    toSelf: false,
                              },
                        })
                  );
                  this.player2.send(
                        JSON.stringify({
                              type: MOVE,
                              payload: {
                                    move: move,
                                    moves: this.moves,
                                    toSelf: true,
                              },
                        })
                  );
            } else {
                  this.player2.send(
                        JSON.stringify({
                              type: MOVE,
                              payload: {
                                    move: move,
                                    moves: this.moves,
                                    toSelf: false,
                              },
                        })
                  );
                  this.player1.send(
                        JSON.stringify({
                              type: MOVE,
                              payload: {
                                    move: move,
                                    moves: this.moves,
                                    toSelf: true,
                              },
                        })
                  );
            }
      }

      private sendGameOverMessage(move) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(
                  JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                              move:  move,
                              winner: winner,
                        },
                  })
            );
            this.player2.send(
                  JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                              move: move,
                              winner: winner,
                        },
                  })
            );
      }

      isGameOver(): boolean {
            return this.board.isGameOver();
      }

      moveHistory() {
            return this.moves;
      }
}
