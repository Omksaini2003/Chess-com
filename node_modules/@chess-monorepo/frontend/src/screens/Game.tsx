import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSockets"
import {Chess} from "chess.js";
import { Moves } from "../components/Moves";
// import { useNavigate } from "react-router-dom"

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

// export const [moves, setMoves] = useState([]);

export const Game =() =>{
      // const navigate = useNavigate();

      const socket = useSocket();
      // const [chess, setChess] = useState(new Chess());
      const [chess, setChess] = useState(new Chess());
      const [board, setBoard] = useState(chess.board());
      const [started, setStarted] = useState(false);
      
      const [color, setColor] = useState("w");


      useEffect(() => {
            if (!socket) return;
            // console.log("useEffect");

            socket.onmessage = (event) => {
                  const message = JSON.parse(event.data);
                  console.log(message)

                  switch (message.type){
                        case INIT_GAME:
                              chess.reset();
                              setBoard(chess.board());
                              setColor(message.payload.color)
                              setStarted(true);
                              console.log("Game initialized frontend");
                              break;
                        case MOVE:
                              console.log(message);
                              try{
                                    chess.move(message.payload.move);
                                    setBoard(chess.board());
                                    // setMoves(message.payload.move);
                              }
                              catch(e){
                                    console.log(e);
                              }
                              break;
                        case GAME_OVER:
                              try{
                                    chess.move(message.payload.move);
                                    setBoard(chess.board());
                                    // setMoves(message.payload.move);
                              }
                              catch(e){
                                    console.log(e);
                              }
                              setStarted(false);
                              console.log("Game over");
                              break;
                  }
            }
      },[chess,socket])

      if(!socket) return <div>Connecting...</div>

      return (
            <>
            <div className="bg-black justify-center flex">
                  <div className="pt-1 max-w-screen-lg w-full">
                        <div className="grid grid-cols-6 gap-4 w-full">
                              <div className="col-span-5 w-full flex justify-center">
                                    <ChessBoard color={color} socket={socket} board = {board} setBoard={setBoard} chess={chess}/>
                              </div>
                              <div className="bg-slate-900 col-span-1 w-full flex justify-center">
                                    <div className="pt-8">
                                          {!started && <Button onClick={()=>{
                                                socket.send(JSON.stringify({
                                                      type: INIT_GAME
                                                }))
                                          }}>
                                                Play Now
                                          </Button>}
                                          {/* <Moves /> */}
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
            </>
      )
}
