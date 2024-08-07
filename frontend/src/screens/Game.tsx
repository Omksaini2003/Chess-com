import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSockets"
import {Chess} from "chess.js";
import Countdown from "../components/Countdown";
import { MoveHist } from "../components/MoveHist";

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

      const [moveHist, setMoveHist] = useState([]);


//
      const initialMinutes = 0.5;
      const [seconds, setSeconds] = useState(initialMinutes * 60);
      const [isActive, setIsActive] = useState(false);

      const onTick = useCallback(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, []);

      const onComplete = useCallback(() => {
        setIsActive(false);
        socket?.send(JSON.stringify({
                  type: MOVE,
                  payload: {
                        move: {
                              from: "",
                              to: ""
                        }
                  }
        }));
      }, [socket]);



      useEffect(() => {

            const reset = () => {
                  setSeconds(initialMinutes * 60);
                  setIsActive(false);
            };

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
                              setMoveHist([]);

                              console.log("Game initialized frontend");

                              reset();
                              if(message.payload.color === "w"){
                                    setIsActive(true);
                              }

                              break;
                        case MOVE:
                              console.log(message);
                              try{
                                    setIsActive(!message.payload.toSelf);
                                    chess.move(message.payload.move);
                                    const temp = {move: message.payload.move, playedby: (color === "b"  ? "w":"b")};
                                    moveHist.push(temp);
                                    
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
                                    const temp = {move: message.payload.move, playedby: (color === "b"  ? "w":"b")};
                                    moveHist.push(temp);
                              }
                              catch(e){
                                    console.log(e);
                              }
                              setBoard(chess.board());
                              // setMoves(message.payload.move);
                              reset();
                              setStarted(false);
                              console.log("Game over");
                              break;
                  }
            }
      },[chess, socket, isActive, color, moveHist])

      if(!socket) return <div>Connecting...</div>

      return (
            <>
            <div className="flex flex-1 bg-black justify-center h-full">
                  <div className="pt-1 max-w-screen-lg w-full">
                        <div className="grid grid-cols-6 gap-4 w-full h-full">
                              
                              <div className="col-span-4 w-full flex mt-auto mb-auto ">
                                    <ChessBoard socket={socket} color={color} chess={chess}
                                    board = {board} setBoard={setBoard} 
                                    moveHist={moveHist} setMoveHist={setMoveHist}/>
                              </div>

                              <div className="bg-slate-900 col-span-2 flex justify-center">
                                    <div className="grid grid-rows-3 gap-3 h-full w-full">
                                          
                                          <div className="pt-8 row-span-1">
                                                {!started && <Button onClick={()=>{
                                                      socket.send(JSON.stringify({
                                                            type: INIT_GAME
                                                      }))
                                                }}>
                                                      Play Now
                                                </Button>}
                                                <div className="m-5">
                                                <Countdown 
                                                      initialMinutes={initialMinutes}
                                                      seconds={seconds}
                                                      isActive={isActive}
                                                      onTick={onTick}
                                                      onComplete={onComplete}
                                                />
                                                </div>
                                          </div>

                                          <div className="row-span-2">
                                                <MoveHist moveHist={moveHist}/>
                                          </div>
                                    </div>
                              </div>

                        </div>
                  </div>
            </div>
            </>
      )
}