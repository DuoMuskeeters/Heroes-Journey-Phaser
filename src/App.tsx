import React, { useEffect, useState } from "react";

import "./App.css";
import phaserGame from "./PhaserGame";
import HelloWorldScene from "./scenes/HelloWorldScene";
import { Scene } from "phaser";
let ischaracteronline = true;
const App = () => {
  const [gameInitialized, setGameInitialized] = useState(false);

  useEffect(() => {
    if (gameInitialized) {
      const scene = phaserGame.scene.keys.helloworld as HelloWorldScene;

      const updateCallback = (time: number, delta: number) => {
        scene.update(time, delta);
      };
      phaserGame.events.on("update", updateCallback);

      return () => {
        phaserGame.events.off("update", updateCallback);
      };
    }
  }, [gameInitialized]);

  const startGame = () => {
    setGameInitialized(!gameInitialized);
    const scene = phaserGame.scene.keys.helloworld as HelloWorldScene;
    scene.create(ischaracteronline);
    ischaracteronline = false;
  };

  return (
    <div className="App">
      {!gameInitialized && <button onClick={startGame}>Start Game</button>}
    </div>
  );
};

export default App;
