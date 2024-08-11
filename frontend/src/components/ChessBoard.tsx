import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";
import React from "react";

export const ChessBoard = React.memo(({ color, socket, board, } :
      {
      color : string;
      socket : WebSocket;
      board: ({
          square: Square;
          type: PieceSymbol;
          color: Color;
      } | null)[][];
}) => {

      const [from, setFrom] = useState<null | {square: Square,type: PieceSymbol,color: Color}>(null);

      // const rotation = (color === 'w' ? 0 : 180);
      const isWhite = color === 'w';

      console.log("chessboard");
      
      return(
            <div className="chessboard-container w-[80vw] h-[80vw] max-w-[435px] max-h-[435px]">
            <div className={`${isWhite ? '' : 'rotate-180'} bg-red text-white-200 w-full h-full flex flex-col`}>
                  {/* Chessboard here */}
                  {board.map((row, i) => {
                        return (
                        <div key={i} className="flex flex-1">
                              {row.map((square, j) => {

                                    const squareRepresentation = String.fromCharCode(97 + (j%8)) + "" + (8-i) as Square;

                                    return (
                                    <div onClick={() => 
                                    {      
                                          if(!from) setFrom(board[i][j]);
                                          else if(from.color === color){
                                                try{
                                                      const move = {
                                                            from : from.square,
                                                            to: squareRepresentation      
                                                      };

                                                      socket.send(JSON.stringify({
                                                            type: MOVE,
                                                            payload: {
                                                                  move: move,
                                                            }
                                                      }))
                                                      // moveHist.push({move: move, playedby: color })
                                                      console.log("message sent")

                                                      setFrom(null)
                                                      // chess.move({
                                                      //             from: from.square,
                                                      //             to: squareRepresentation
                                                      //       });
                                                      // setBoard(chess.board());
                                                      // setIsActive(true);
                                                }
                                                catch(e){
                                                      console.log(e);
                                                }
                                          }
                                          else setFrom(null)
                                    
                                    }
                                    } 
                                    key={j} className =
                                    {`flex-1 aspect-square 
                                    ${(square?.square === from?.square && from?.square !=null && from.color === color) ? 'bg-red-300' : 
                                    (i+j)%2 === 0 ? 'bg-green-500' : 'bg-slate-200'}
                                    hover:bg-slate-400 `
                                    }>
                                          {/* <div className="w-full h-full justify-center flex "> */}
                                                <div className="w-full h-full flex items-center justify-center">
                                                {square ? <img className={`${isWhite ? '' : "rotate-180"} w-3/4 h-3/4 object-contain`}  
                                                src = {`/pieces/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`}
                                                /> : null}  
                                                </div>
                                          {/* </div> */}
                                    </div>
                                    )
                              })}

                        </div>
                        )
                  })}
            </div>
            </div>
      )
});





// post winning display
// drag and drop