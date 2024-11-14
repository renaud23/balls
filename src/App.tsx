import { useEffect, useRef } from "react";
import { createMotorPx } from "./physic/motor";
import { createRender, createRenderGame } from "./graphics/render";
import { createRandomBall } from "./physic/ball";
import { transformLevel } from "./levels/transformLevel";
import { LEVEL1 } from "./levels/l1";
import { BallPx } from "./physic/type";
import { createGame } from "./game/game";

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 600;

const WORLD_WIDTH = 600;
const WORLD_HEIGHT = 600;

function App() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const init = useRef(false);
  const anId = useRef<number>();

  /* */
  useEffect(() => {
    if (!init.current) {
      init.current = true;
      const context = canvasEl?.current?.getContext("2d");
      //
      // const motor = createMotorPx({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
      const game = createGame(
        WORLD_WIDTH,
        WORLD_HEIGHT,
        createMotorPx({ width: WORLD_WIDTH, height: WORLD_HEIGHT })
      );
      const render = createRenderGame(WORLD_WIDTH, WORLD_HEIGHT);
      // const render = createRender(CANVAS_WIDTH, CANVAS_HEIGHT);
      // //
      // const bricks = transformLevel(WORLD_WIDTH, WORLD_HEIGHT, LEVEL1);

      // //
      // const balls: BallPx[] = new Array(5)
      //   .fill({})
      //   .map(() => createRandomBall(WORLD_WIDTH, WORLD_HEIGHT));

      // motor.appendElements(balls);
      // motor.appendElements(bricks);

      let time = new Date().getTime();
      function loop() {
        const current = new Date().getTime();
        const ellapsed = current - time;

        if (ellapsed > 5 && context) {
          time = current;
          // motor.activate();
          // render(context, motor);
          game.activate();
          render(context, game);
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
