import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ color, socket, board, setBoard, chess} :{
      color : string;
      socket : WebSocket;
      board: ({
          square: Square;
          type: PieceSymbol;
          color: Color;
      } | null)[][];
      setBoard: any;
      chess: any;

}) => {

      const [from, setFrom] = useState<null | {square: Square,type: PieceSymbol,color: Color}>(null);

      // const rotation = (color === 'w' ? 0 : 180);
      const isWhite = color === 'w';
      
      return(
            <div className={`${isWhite ? '' : 'rotate-180'} bg-red text-white-200 `}>
                  {/* Chessboard here */}
                  {board.map((row, i) => {
                        return (
                        <div key={i} className="flex">
                              {row.map((square, j) => {

                                    const squareRepresentation = String.fromCharCode(97 + (j%8)) + "" + (8-i) as Square;

                                    return (
                                    <div onClick={() => 
                                    {      
                                          if(!from) setFrom(board[i][j]);
                                          else if(from.color === color){
                                                socket.send(JSON.stringify({
                                                      type: MOVE,
                                                      payload: {
                                                            move: {
                                                                  from : from.square,
                                                                  to: squareRepresentation      
                                                            }
                                                      }
                                                }))
                                                console.log("message sent")
                                                setFrom(null)
                                                chess.move({
                                                            from: from.square,
                                                            to: squareRepresentation
                                                      });
                                                setBoard(chess.board());
                                          }
                                          else setFrom(null)
                                    
                                    }
                                    } 
                                    key={j} className =
                                    {`w-16 h-16 
                                    ${(square?.square === from?.square && from?.square !=null && from.color === color) ? 'bg-red-300' : 
                                    (i+j)%2 === 0 ? 'bg-green-500' : 'bg-slate-200'}
                                    hover:bg-slate-400 `
                                    }>
                                          <div className="w-full justify-center flex h-full">
                                                <div className=" h-full justify-center flex flex-col">
                                                {square ? <img className={`${isWhite ? '' : "rotate-180"} w-10 `}  
                                                src = {`/pieces/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`}
                                                /> : null}  
                                                </div>
                                          </div>
                                    </div>
                                    )
                              })}

                        </div>
                        )
                  })}
            </div>
      )
}





// post winning display
// drag and drop