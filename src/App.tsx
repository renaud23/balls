import { useEffect, useRef } from "react";
import { createMotorPx } from "./physic/motor";
import { createRenderGame } from "./graphics/render";

import { createGame } from "./game/game";

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 600;

const WORLD_WIDTH = CANVAS_HEIGHT * 1;
const WORLD_HEIGHT = CANVAS_WIDTH * 1;

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

      const game = createGame(
        WORLD_WIDTH,
        WORLD_HEIGHT,
        createMotorPx({ width: WORLD_WIDTH, height: WORLD_HEIGHT })
      );
      const render = createRenderGame(CANVAS_WIDTH, CANVAS_HEIGHT);

      let time = new Date().getTime();
      function loop() {
        const current = new Date().getTime();
        const ellapsed = current - time;

        if (ellapsed > 20 && context) {
          time = current;

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
