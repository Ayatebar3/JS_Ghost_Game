import { GameEngine } from './game/gameEngine.js';

const canvas = document.createElement('canvas');
const game = new GameEngine(canvas);

window.onload = () => {
  canvas.width = 1920;
  canvas.height = 1080;
  document.querySelector('#app').appendChild(canvas);

  canvas.setAttribute('tabindex', 0);
  canvas.focus();

  game.init();
  game.run();
}
