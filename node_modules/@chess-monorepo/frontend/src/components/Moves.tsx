import { moves } from "../screens/Game";


export const Moves = () => {
      // const moves = [1,2,3,4];
      return <>
            <div>
                  {/* <ul>
                        {moves.map((i)=>{
                              return(
                              <li>{i.from} {i.to}</li>
                              )
                        })}
                  </ul> */}
                  <ul>
                        {moves.map( (i) => {
                              const text = `${i.from} -> ${i.to}`
                              return(
                                    <li className="text-white">{text}</li>
                              )
                        }

                        )}
                  </ul>
            </div>
      </>
}