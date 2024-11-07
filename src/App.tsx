import { useEffect, useRef } from "react";

import { activate, createGame, render } from "./game";

function App() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const init = useRef(false);
  // const [context, setContext] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!init.current && canvasEl.current) {
      init.current = true;
      let time = new Date().getTime();

      const ctx = canvasEl.current.getContext("2d");
      const game = createGame(800, 500);

      function loop() {
        const current = new Date().getTime();
        const ellapsed = current - time;

        if (ellapsed > 15 && ctx) {
          time = current;
          activate(game);
          render(ctx, game);
        }

        window.requestAnimationFrame(() => {
          loop();
        });
      }

      loop();
    }
  }, []);

  return <canvas ref={canvasEl} />;
}

export default App;
