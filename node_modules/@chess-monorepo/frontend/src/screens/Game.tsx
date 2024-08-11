import { useSocket } from "../hooks/useSockets"
import React from "react";
import { Chess } from "chess.js";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { MoveHist } from "../components/MoveHist";
import CountdownWrapper from "../components/CountdownWrapper";

// import { useNavigate } from "react-router-dom"

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

// export const [moves, setMoves] = useState([]);


interface GameProps {
	user: any;
}

export const Game: React.FC<GameProps> = ({ user }) => {
	// const navigate = useNavigate();
	console.log(user);
	const socket = useSocket();
	// const [chess, setChess] = useState(new Chess());
	const [chess, setChess] = useState(new Chess());
	const [board, setBoard] = useState(chess.board());
	const [started, setStarted] = useState(false);

	const [color, setColor] = useState("w");

	const [moveHist, setMoveHist] = useState([]);


	//
	const initialMinutes = 0.5;
	// const [seconds, setSeconds] = useState(initialMinutes * 60);
	const [isCountdownActive, setIsCountdownActive] = useState(false);
	const [shouldResetCountdown, setShouldResetCountdown] = useState(false);

	// const onTick = useCallback(() => {
	//   setSeconds(prevSeconds => prevSeconds - 1);
	// }, []);

	const onComplete = useCallback(() => {
		setIsCountdownActive(false);
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

	const countdownComponent = useMemo(() => (
		<CountdownWrapper
			initialMinutes={initialMinutes}
			isActive={isCountdownActive}
			onComplete={onComplete}
			shouldReset={shouldResetCountdown}
		/>
	), [shouldResetCountdown, isCountdownActive, onComplete]);

	// Reset the shouldResetCountdown flag after it's been used
	useEffect(() => {
		if (shouldResetCountdown) {
			setShouldResetCountdown(false);
		}
	}, [shouldResetCountdown]);

	const handleMessage = useCallback((message) => {
		switch (message.type) {
			case INIT_GAME:
				chess.reset();
				setBoard(chess.board());
				setColor(message.payload.color)
				setStarted(true);
				setMoveHist([]);

				console.log("Game initialized frontend");

				setShouldResetCountdown(true);
				setIsCountdownActive(message.payload.color === "w");

				break;
			case MOVE:
				console.log(message);
				try {
					setIsCountdownActive(!message.payload.toSelf);
					chess.move(message.payload.move);
					// const temp = {moves: message.payload.moves, playedby: (color === "b"  ? "w":"b")};
					// const temp = {moves: message.payload.moves};
					setMoveHist(message.payload.moves);

					setBoard(chess.board());
					// setMoves(message.payload.move);
				}
				catch (e) {
					console.log(e);
				}
				break;
			case GAME_OVER:
				try {
					chess.move(message.payload.move);
					const temp = { move: message.payload.move, playedby: (color === "b" ? "w" : "b") };
					setMoveHist(prev => [...prev, temp]);
					// moveHist.push(temp);
					// setMoveHist(message.payload.moves);
				}
				catch (e) {
					console.log(e);
				}
				setBoard(chess.board());
				// setMoves(message.payload.move);
				setShouldResetCountdown(true);
				setStarted(false);
				console.log("Game over");
				break;
		}
	},[chess,color]);

	useEffect(() => {
		console.log("useEffect");

		if (!socket) return;

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message)

			handleMessage(message);
		}
	}, [handleMessage, socket]);

	// const memoizedBoard = useMemo(() => {board}, [board]);

	if (!socket) return <div>Connecting...</div>

	return (
		<>
			<div className="flex flex-1 bg-black justify-center h-full">
				<div className="pt-1 max-w-screen-lg w-full">
					<div className="grid grid-cols-6 gap-4 w-full h-full">

						<div className="col-span-4 w-full flex mt-auto mb-auto ">
							<ChessBoard
								socket={socket} color={color}
								board={board}
							/>
						</div>

						<div className="bg-slate-900 col-span-2 flex justify-center">
							<div className="grid grid-rows-3 gap-3 h-full w-full">

								<div className="pt-8 row-span-1">
									{!started && <Button onClick={() => {
										socket.send(JSON.stringify({
											type: INIT_GAME
										}))
									}}>
										Play Now
									</Button>}
									<div className="m-5">
										{countdownComponent}
									</div>
								</div>

								<div className="row-span-2">
									<MoveHist moveHist={moveHist} />
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</>
	)
}
