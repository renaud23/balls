import { useCallback, useEffect, useRef, useState } from "react";
import { activate, createGame, Game, render } from "./game";
import { createMotorPx } from "./physic/motor";
import { createRender } from "./graphics/render";
import { Ball } from "./physic/type";
import { createRandomBall } from "./physic/ball";
import { transformLevel } from "./levels/transformLevel";
import { LEVEL1 } from "./levels/l1";

// let PAUSE = false;
// export const DEBUG = false;

// function App() {
//   const canvasEl = useRef<HTMLCanvasElement>(null);
//   const init = useRef(false);
//   const [game, setGame] = useState<Game>();
//   const [speed, setSpeed] = useState(15);

//   const [nbBalls] = useState(10);
//   const anId = useRef<number>();
//   const [context, setContext] = useState<CanvasRenderingContext2D | null>();

//   const start = useCallback(
//     (speed: number) => {
//       if (canvasEl.current && game) {
//         let time = new Date().getTime();

//         function loop() {
//           const current = new Date().getTime();
//           const ellapsed = current - time;

//           if (ellapsed > speed && context && game && !PAUSE) {
//             time = current;
//             activate(game);
//             render(context, game);
//           }

//           anId.current = window.requestAnimationFrame(() => {
//             loop();
//           });
//         }

//         loop();
//       }
//     },
//     [game, context]
//   );

//   useEffect(() => {
//     if (!init.current) {
//       init.current = true;
//       setContext(canvasEl?.current?.getContext("2d"));
//       setGame(createGame(600, 600, nbBalls));
//       start(2);
//     }
//   }, [start, nbBalls]);

//   useEffect(() => {
//     start(speed);
//   }, [speed, start]);

//   return (
//     <>
//       <canvas ref={canvasEl} />
//       <div>
//         <label htmlFor="speed">Speed</label>
//         <input
//           aria-labelledby=""
//           type="range"
//           min="2"
//           max="300"
//           value={speed}
//           id="speed"
//           onChange={(e) => {
//             if (anId.current) window.cancelAnimationFrame(anId.current);
//             setSpeed(parseInt(e.target.value));
//           }}
//         />
//         <button
//           onClick={() => {
//             PAUSE = !PAUSE;
//           }}
//         >
//           Pause
//         </button>
//       </div>
//     </>
//   );
// }

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 600;

const WORLD_WIDTH = 600;
const WORLD_HEIGHT = 600;

function App() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const init = useRef(false);
  const anId = useRef<number>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();

  /* */
  useEffect(() => {
    if (!init.current) {
      init.current = true;
      const context = canvasEl?.current?.getContext("2d");
      //
      const motor = createMotorPx({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
      const render = createRender(CANVAS_WIDTH, CANVAS_HEIGHT);
      //
      const bricks = transformLevel(WORLD_WIDTH, WORLD_HEIGHT, LEVEL1);

      //
      const balls: Ball[] = new Array(10)
        .fill({})
        .map(() => createRandomBall(WORLD_WIDTH, WORLD_HEIGHT));

      motor.appendElements(balls);
      motor.appendElements(bricks);

      let time = new Date().getTime();
      function loop() {
        const current = new Date().getTime();
        const ellapsed = current - time;

        if (ellapsed > 10 && context) {
          time = current;
          motor.activate();
          render(context, motor);
        }

        anId.current = window.requestAnimationFrame(() => {
          loop();
        });
      }

      loop();
    }
  }, []);

  return <canvas ref={canvasEl} />;
}

export default App;
