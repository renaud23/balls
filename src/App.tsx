import { useCallback, useEffect, useRef, useState } from "react";
import { activate, createGame, Game, render } from "./game";

let PAUSE = false;
export const DEBUG = false;

function App() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const init = useRef(false);
  const [game, setGame] = useState<Game>();
  const [speed, setSpeed] = useState(15);

  const [nbBalls] = useState(5);
  const anId = useRef<number>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();

  const start = useCallback(
    (speed: number) => {
      if (canvasEl.current && game) {
        let time = new Date().getTime();

        function loop() {
          const current = new Date().getTime();
          const ellapsed = current - time;

          if (ellapsed > speed && context && game && !PAUSE) {
            time = current;
            activate(game);
            render(context, game);
          }

          anId.current = window.requestAnimationFrame(() => {
            loop();
          });
        }

        loop();
      }
    },
    [game, context]
  );

  useEffect(() => {
    if (!init.current) {
      init.current = true;
      setContext(canvasEl?.current?.getContext("2d"));
      setGame(createGame(600, 600, nbBalls));
      start(2);
    }
  }, [start, nbBalls]);

  useEffect(() => {
    start(speed);
  }, [speed, start]);

  return (
    <>
      <canvas ref={canvasEl} />
      <div>
        <label htmlFor="speed">Speed</label>
        <input
          aria-labelledby=""
          type="range"
          min="2"
          max="300"
          value={speed}
          id="speed"
          onChange={(e) => {
            if (anId.current) window.cancelAnimationFrame(anId.current);
            setSpeed(parseInt(e.target.value));
          }}
        />
        <button
          onClick={() => {
            PAUSE = !PAUSE;
          }}
        >
          Pause
        </button>
      </div>
    </>
  );
}

export default App;
