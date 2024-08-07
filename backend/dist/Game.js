"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "w"
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "b"
            },
        }));
    }
    makeMove(socket, move) {
        console.log("make move");
        //validation 
        // is it this user move
        // is the move valid
        // update board
        // push the move
        //won by timeout
        if (move.from === "" && move.to === "") {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    move: move,
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    move: move,
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        //making move
        try {
            this.board.move(move);
            this.moves.push(move);
            this.moveCount++;
        }
        catch (e) {
            console.log(e);
            return;
        }
        // check if the game is over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    move: move,
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    move: move,
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        // send updated board to both players
        if (this.moveCount % 2 === 0) {
            console.log("player2- black emits");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    toSelf: false,
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    toSelf: true,
                }
            }));
        }
        else {
            console.log("player1- white emits");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    toSelf: false,
                }
            }));
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    toSelf: true,
                }
            }));
        }
    }
    moveHistory() {
        return this.moves;
    }
}
exports.Game = Game;
