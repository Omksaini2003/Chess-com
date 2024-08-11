"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    notifyGameOver() {
        if (this.onGameOverCallback) {
            this.onGameOverCallback();
        }
    }
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.player1Color = "w";
        this.player2Color = "b";
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "w",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "b",
            },
        }));
    }
    setOnGameOverCallback(callback) {
        this.onGameOverCallback = callback;
    }
    makeMove(socket, move) {
        console.log("make move");
        if (move.from === "" && move.to === "") {
            console.log("Time out");
            this.sendGameOverMessage(move);
            this.notifyGameOver();
            return;
        }
        try {
            const playedBy = this.board.turn();
            this.board.move(move);
            this.moves.push({ move: move, playedBy: playedBy });
            // console.log(this.moves);
            this.moveCount++;
        }
        catch (e) {
            console.log(e);
            return;
        }
        if (this.board.isGameOver()) {
            this.sendGameOverMessage(move);
            this.notifyGameOver();
            return;
        }
        this.sendMoveToPlayers(move);
    }
    sendMoveToPlayers(move) {
        if (this.moveCount % 2 === 0) {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    moves: this.moves,
                    toSelf: false,
                },
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    moves: this.moves,
                    toSelf: true,
                },
            }));
        }
        else {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    moves: this.moves,
                    toSelf: false,
                },
            }));
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                    moves: this.moves,
                    toSelf: true,
                },
            }));
        }
    }
    sendGameOverMessage(move) {
        console.log(move);
        const winner = this.board.turn() === "w" ? "black" : "white";
        this.player1.send(JSON.stringify({
            type: messages_1.GAME_OVER,
            payload: {
                move: move,
                winner: winner,
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.GAME_OVER,
            payload: {
                move: move,
                winner: winner,
            },
        }));
    }
    isGameOver() {
        return this.board.isGameOver();
    }
    moveHistory() {
        return this.moves;
    }
}
exports.Game = Game;
