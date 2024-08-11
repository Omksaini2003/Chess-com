import { WebSocket } from "ws";
import {Chess} from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{

      public player1: WebSocket;
      public player2: WebSocket;
      public player1Color: string;
      public player2Color: string;

      private board: Chess;
      private moves: {move:{from: string,to: string}, playedBy: string}[];
      private startTime: Date;
 
      private moveCount = 0;


      constructor(player1: WebSocket, player2: WebSocket){
            this.player1 = player1;
            this.player2 = player2;
            this.player1Color = "w";
            this.player2Color = "b";

            this.board = new Chess();
            this.moves =  [];
            this.startTime = new Date();

            this.player1.send(JSON.stringify({
                  type: INIT_GAME,
                  payload: {
                        color: "w"
                  },
            }))
            this.player2.send(JSON.stringify({
                  type: INIT_GAME,
                  payload: {
                        color: "b"
                  },
            }))
      }

      makeMove(socket: WebSocket, move: {
            from: string;
            to: string;
      }){
            console.log("make move");
            //validation 
            // is it this user move
            // is the move valid

            // update board
            // push the move

            //WON by timeout
            if(move.from === "" && move.to === ""){
                  this.player1.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                              move:move,
                              winner: this.board.turn() === "w" ? "black" : "white"
                        }
                  }))
                  this.player2.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                              move: move,
                              winner: this.board.turn() === "w" ? "black" : "white"
                        }
                  }))
                  return;
            }

            //making MOVE
            try{
                  const playedBy = this.board.turn();
                  this.board.move(move);

                  this.moves.push({move:move, playedBy: playedBy}); // registering move
                  console.log(this.moves);

                  this.moveCount++;
            }
            catch(e){
                  console.log(e);
                  return;
            }

            // CHECK if the game is over

            if(this.board.isGameOver()){
                  this.player1.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                              move:move,
                              winner: this.board.turn() === "w" ? "black" : "white"
                        }
                  }))
                  this.player2.send(JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                              move: move,
                              winner: this.board.turn() === "w" ? "black" : "white"
                        }
                  }))
                  return;
            }

            // send UPDATED board to both players

            if(this.moveCount % 2 === 0){
                  console.log("player2- black emits")
                  this.player1.send(JSON.stringify({
                        type: MOVE,
                        payload: {
                              move: move,
                              moves : this.moves,
                              toSelf: false, //for timer on/off
                        }
                  }))
                  this.player2.send(JSON.stringify({
                        type: MOVE,
                        payload: {
                              move: move,
                              moves: this.moves,
                              toSelf: true,
                        }
                  }));
            } else {
                  console.log("player1- white emits")
                  this.player2.send(JSON.stringify({
                        type: MOVE,
                        payload: {
                              move: move,
                              moves: this.moves,
                              toSelf: false,
                        }
                  }))
                  this.player1.send(JSON.stringify({
                        type: MOVE,
                        payload: {
                              move: move,
                              moves: this.moves,
                              toSelf: true,
                        }
                  }));
            }
      }

      moveHistory(){
            return this.moves;
      }
}