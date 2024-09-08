import { Entity } from './entity.js';
import { EntityManager } from './entityManager.js';
import { Systems } from './systems.js';
import {
  Vector2D,
  Position,
  Velocity,
  Speed,
  Input,
  Sprite,
  RegularPolygon,
  Score,
  Health,
  Damage
} from './components.js'

/**
 * @class
 * @constructor 
 * @public
 */
export class GameEngine {

  /**
   * @member canvas
   * @type { HTMLCanvasElement }
   * @private
   */
  #_canvas;

  /**
   * @member entityManager
   * @type { EntityManager }
   * @private
   */
  #_entityManager;

  /**
   * @member systems
   * @type { { () => void }[] }
   * @private
   */
  #_systems;

  /**
   * @member player
   * @type { Entity }
   * @private
   */
  #_player;

  /**
   * @member sprites
   * @type { Sprite[] }
   * @private
   */
  #_sprites;

  /**
   * @method constructor
   * @param { HTMLCanvasElement } canvas 
   */
  constructor(canvas) {
    this.#_canvas = canvas;
    this.#_entityManager = new EntityManager();
    this.#_systems = Systems(this.#_canvas, this.#_entityManager);
  }

  init = () => {
    this.#_createEntityTypes();
    this.#_createPlayerEntity();
    this.#_attachEventListeners();
  }

  #_createEntityTypes = () => {
    this.#_entityManager.addEntityType('player', true);
    this.#_entityManager.addEntityType('bullet')
    this.#_entityManager.addEntityType('enemy')
  }

  #_createPlayerEntity = () => {
    const spriteImages = [...document.querySelectorAll('.player-sprite')];
    this.#_sprites = spriteImages.map(s => new Sprite(s, 100, 100));
    this.#_player = this.#_entityManager.addEntity('player');
    this.#_player.setComponent(this.#_sprites[1]);
    this.#_player.setComponent(
      new Position(
        (this.#_canvas.width / 2) - 100,
        (this.#_canvas.height / 2) - 100
      )
    );
    this.#_player.setComponent(new Velocity(0, 0));
    this.#_player.setComponent(new Speed(10));
    this.#_player.setComponent(new Input());
    this.#_player.setComponent(new Score(0));
    this.#_player.setComponent(new Health(10));
    this.#_player.setComponent(new Damage(1));
  }

  #_setPlayerSprite = (shouldLookLeft) => {
    this.#_player.setComponent(this.#_sprites[shouldLookLeft ? 0 : 1]);
  }

  #_attachEventListeners = () => {

    /**
     * @type { Input }
     */
    const playerInput = this.#_player.getComponent(Input.name);

    const addPlayerMovementInput = () => {
      const movementEventKeyToActionMapping = {
        ArrowLeft: 'left',
        a: 'left',
        A: 'left',
        ArrowRight: 'right',
        d: 'right',
        D: 'right',
        ArrowUp: 'up',
        w: 'up',
        W: 'up',
        ArrowDown: 'down',
        s: 'down',
        S: 'down',
      }
      const inputKeys = new Set(Object.keys(movementEventKeyToActionMapping));
      this.#_canvas.addEventListener("keydown", (e) => {
        if (inputKeys.has(e.key)) {
          e.preventDefault();
          const keyPressed = movementEventKeyToActionMapping[e.key];
          playerInput.movement[keyPressed] = true;

          if (keyPressed === 'left') {
            this.#_setPlayerSprite(true);
          } else if (keyPressed === 'right') {
            this.#_setPlayerSprite(false);
          }
        }
      });
      this.#_canvas.addEventListener("keyup", (e) => {
        if (inputKeys.has(e.key)) {
          e.preventDefault();
          const keyReleased = movementEventKeyToActionMapping[e.key];
          playerInput.movement[keyReleased] = false;
        }
      });
    }

    const addPlayerMouseInput = () => {
      this.#_canvas.addEventListener("mousemove", (e) => {
        e.preventDefault();
        const mousePosition = getMouseOnCanvasPosition(e);
        playerInput.mouse.position.x = mousePosition.x;
        playerInput.mouse.position.y = mousePosition.y;
      })
      this.#_canvas.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (e.button === 0) {
          playerInput.mouse.leftClick = true;
        }
      })
    }

    const getCanvasOffset = () => {
      const { top, left, width, height } = this.#_canvas.getBoundingClientRect()
      return {
        top,
        left,
        width,
        height
      }
    }

    const getCanvasScaleFactors = (offset) => {
      return new Vector2D(
        this.#_canvas.width / offset.width,
        this.#_canvas.height / offset.height
      )
    }

    const getEventCoordinates = (event) => {
      return new Vector2D(
        event.clientX,
        event.clientY
      )
    }

    const getMouseOnCanvasPosition = (event) => {
      const mouseCoordinates = getEventCoordinates(event);
      const canvasOffset = getCanvasOffset();
      const scaleFactors = getCanvasScaleFactors(canvasOffset);
      return new Vector2D(
        (mouseCoordinates.x - canvasOffset.left) * scaleFactors.x,
        (mouseCoordinates.y - canvasOffset.top) * scaleFactors.y
      )
    }
 
    const addManualEnemyCreator = () => {
      this.#_canvas.addEventListener("keydown", (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          for (let i = 3; i < 10; i++) {
            const enemy = this.#_entityManager.addEntity('enemy');
            const vertexCount = i;
            const x_rand = Math.floor(Math.random() * this.#_canvas.width - 2) + 1;
            const y_rand = Math.floor(Math.random() * this.#_canvas.height - 2) + 1;
            enemy.setComponent(new Position(x_rand, y_rand));
            enemy.setComponent(new Velocity(0, 0));
            enemy.setComponent(new RegularPolygon(50, vertexCount));
            enemy.setComponent(new Score(vertexCount));
            enemy.setComponent(new Health(vertexCount));
            enemy.setComponent(new Damage(vertexCount));
          }
        }
      })
    }

    addPlayerMovementInput();
    addPlayerMouseInput();
    // addManualEnemyCreator();
  }

  run = () => {

    const gameLoop = () => {
      this.#_entityManager.update();
      this.#_systems.forEach(system => system())
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }
}