import { useCallback, useEffect, useRef, useState } from "react";
import { activate, createGame, Game, render } from "./game";

function App() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const init = useRef(false);
  const [game, setGame] = useState<Game>();
  const [speed, setSpeed] = useState(15);
  const [nbBalls] = useState(2);
  const anId = useRef<number>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();

  const start = useCallback(
    (speed: number) => {
      if (canvasEl.current && game) {
        let time = new Date().getTime();

        function loop() {
          const current = new Date().getTime();
          const ellapsed = current - time;

          if (ellapsed > speed && context && game) {
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
      setGame(createGame(800, 500, nbBalls));
      start(15);
      console.log("oo");
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
          min="5"
          max="300"
          value={speed}
          id="speed"
          onChange={(e) => {
            if (anId.current) window.cancelAnimationFrame(anId.current);
            setSpeed(parseInt(e.target.value));
          }}
        />
      </div>
    </>
  );
}

export default App;
