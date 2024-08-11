import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";

export const Landing =() => {
      const navigate = useNavigate();
      return (
      <>
      <div>
            <div className="pt-8">
                  <div className="grid grid-cols-1 gap-4 
                  md:grid-cols-2">
                        <div className="flex justify-center">
                              <img src="/chessboard.png" className="max-w-96"/>
                        </div>

                        <div className="pt-16">
                              <div className="flex justify-center">
                                    <h1 className="text-3xl font-semibold">Welcome to Chess</h1>
                              </div>
                              <div className="mt-4 flex justify-center">
                                    <Button onClick={()=>{
                                          navigate("/login")
                                    }}>
                                          Login
                                    </Button>
                              </div>
                              <div className="mt-4 flex justify-center">
                                    <Button onClick={()=>{
                                          navigate("/game")
                                    }}>
                                          Play As Guest
                                    </Button>
                              </div>
                        </div>

                  </div>
            </div>
      </div>
      </>
      )
}