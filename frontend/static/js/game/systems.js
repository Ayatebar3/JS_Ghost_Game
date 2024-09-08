import { Entity } from './entity.js';
import { EntityManager } from './entityManager.js';
import { Vector2Math } from './vector2Math.js';
import {
  Position,
  Velocity,
  Speed,
  Input,
  Sprite,
  RegularPolygon,
  Damage,
  Health,
  Score,
  Vector2D
} from './components.js'

/**
 * @module Systems
 * @param { HTMLCanvasElement } canvas 
 * @param { EntityManager } entityManager 
 * @return { { () => void }[] } 
 */
export const Systems = (canvas, entityManager) => {
  const context = canvas.getContext('2d');
  const bulletSpeed = 50;
  const enemySpeed = 7;
  const enemyRadius = 50;
  const enemySpawnTime = 1500;
  const enemyColors = [
    "",
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "indigo",
    "purple"
  ];
  const getEnemySpawnCoordinates = (index) => {
    switch(index) {
      case 0:
        return [100, 100]
      case 1:
        return [100, canvas.height - 100]
      case 2: 
        return [canvas.width - 100 , 100]
      case 3:
        return [canvas.width - 100 , canvas.height - 100]
    }
  }
  
  let then = Date.now();

  const EnemySpawner = () => {
    const now = Date.now();
    if (now - then > enemySpawnTime) {
      const random = Math.floor(Math.random() * 7) + 3;
      const enemy = entityManager.addEntity('enemy');
      const enemyPosition = getEnemySpawnCoordinates(random % 4)
      enemy.setComponent(new Position(enemyPosition[0], enemyPosition[1]));
      enemy.setComponent(new Velocity(0, 0));
      enemy.setComponent(new RegularPolygon(enemyRadius, random));
      enemy.setComponent(new Score(random));
      enemy.setComponent(new Health(random));
      enemy.setComponent(new Damage(random));
      then = now;
    }
  }

  const EnemyMovement = () => {
    const player = entityManager.getEntity('player');
    for (const enemy of entityManager.getEntities('enemy')) {
      /**
       * @type { RegularPolygon }
       */
      const enemyPolygon = enemy.getComponent(RegularPolygon.name)
      const enemyVelocity = enemy.getComponent(Velocity.name);
      const enemyPosition = enemy.getComponent(Position.name);
      const playerPosition = player.getComponent(Position.name);

      const newEnemyVelocity = Vector2Math.normalize(
        Vector2Math.difference(
          playerPosition,
          enemyPosition
        ),
        enemySpeed
      )
      enemyVelocity.x = newEnemyVelocity.x;
      enemyVelocity.y = newEnemyVelocity.y;

      enemyPolygon.rotation += 0.05;
    }
  }

  const UserInputs = () => {
    const player = entityManager.getEntity('player');

    /**
     * @type { Sprite }
     */
    const playerSprite = player.getComponent(Sprite.name);

    /**
     * @type { Position }
     */
    const playerPosition = player.getComponent(Position.name);

    /**
     * @type { Velocity }
     */
    const playerVelocity = player.getComponent(Velocity.name);

    /**
     * @type { Input }
     */
    const inputs = player.getComponent(Input.name);

    const playerMovement = () => {

      /**
       * @type { Number }
       */
      const speedValue = player.getComponent(Speed.name).value;
      const movementList = Object.keys(inputs.movement).filter(k => inputs.movement[k] === true);

      let newVelocity = new Velocity(0, 0);
      if (movementList.includes('left')) {
        newVelocity.x = -1;
      }
      if (movementList.includes('right')) {
        newVelocity.x = newVelocity.x === -1 ? 0 : 1
      }
      if (movementList.includes('up')) {
        newVelocity.y = -1;
      }
      if (movementList.includes('down')) {
        newVelocity.y = newVelocity.y === -1 ? 0 : 1
      }

      newVelocity = Vector2Math.normalize(newVelocity, speedValue);
      playerVelocity.x = newVelocity.x;
      playerVelocity.y = newVelocity.y;
    }

    const playerMouse = () => {
      const mouse = inputs.mouse;
      if (mouse.leftClick) {
        const bullet = entityManager.addEntity('bullet');
        const bulletPosition = new Position(
          playerPosition.x + (playerSprite.width / 2),
          playerPosition.y + (playerSprite.height / 2)
        )
        const velocityVector = Vector2Math.normalize(
          Vector2Math.difference(
            mouse.position,
            bulletPosition
          ),
          bulletSpeed
        );
        const bulletVelocity = new Velocity(
          velocityVector.x,
          velocityVector.y
        );
        bullet.setComponent(bulletPosition);
        bullet.setComponent(bulletVelocity);
        bullet.setComponent(player.getComponent(Damage.name))
      }
      mouse.leftClick = false;
    }

    playerMovement();
    playerMouse();
  }

  const Kinematics = () => {
    for (const entity of entityManager.getEntities()) {
      const position = entity.getComponent(Position.name);
      const velocity = entity.getComponent(Velocity.name);
      const { x, y } = Vector2Math.sum(position, velocity);
      position.x = x;
      position.y = y;
    }
  }

  const Collision = () => {
    
    const player = entityManager.getEntity('player');
    const playerHealth = player.getComponent(Health.name);
    const playerScore = player.getComponent(Score.name);

    /**
     * @function playerCollisions 
     */
    const playerCollisions = () => {
      /**
       * @type { Position }
       */
      const playerPosition = player.getComponent(Position.name);

      /**
       * @type { Sprite }
       */
      const sprite = player.getComponent(Sprite.name)

      // Keep Player within Canvas
      if (playerPosition.x < 0) {
        playerPosition.x = 0;
      } else if (playerPosition.x + sprite.width > canvas.width) {
        playerPosition.x = canvas.width - sprite.width;
      }

      // Keep Player within Canvas
      if (playerPosition.y < 0) {
        playerPosition.y = 0;
      } else if (playerPosition.y + sprite.height > canvas.height) {
        playerPosition.y = canvas.height - sprite.height;
      }

      for (const enemy of entityManager.getEntities('enemy')) {
        const enemyPosition = enemy.getComponent(Position.name);
        const enemyDamage = enemy.getComponent(Damage.name);
        if (Vector2Math.distSquared(
          Vector2Math.sum(enemyPosition, new Vector2D(enemyRadius * 0.5, enemyRadius * 0.5)),
          Vector2Math.sum(playerPosition, new Vector2D(sprite.width * 0.5, sprite.height * 0.5)),
        ) < (enemyRadius * enemyRadius) - enemyRadius) {
          enemy.destroy();
          playerHealth.value -= enemyDamage.value
          if (playerHealth.value <= 0) {
            alert('You died :P');
            location.reload();
          }
        }
      }
    }

    /**
     * @function bulletCollisions
     * @param { Entity } bullet 
     */
    const bulletCollisions = (bullet) => {
      /**
       * @type { Position }
       */
      const bulletPosition = bullet.getComponent(Position.name);
      const bulletDamage = bullet.getComponent(Damage.name);

      // Destroy bullet when wall is hit
      if (
        bulletPosition.x < 0 ||
        bulletPosition.y < 0 ||
        bulletPosition.x + 10 > canvas.width ||
        bulletPosition.y + 10 > canvas.height
      ) {
        bullet.destroy();
      }

      for (const enemy of entityManager.getEntities('enemy')) {
        const enemyPosition = enemy.getComponent(Position.name);
        const enemyHealth = enemy.getComponent(Health.name);
        const enemyScore = enemy.getComponent(Score.name);
        if (Vector2Math.distSquared(
          enemyPosition,
          bulletPosition
        ) < enemyRadius * enemyRadius) {
          bullet.destroy();
          enemyHealth.value -= bulletDamage.value;
          if (enemyHealth.value <= 0) {
            enemy.destroy();
            playerScore.value += enemyScore.value
          }
        }
      }
    }
    
    playerCollisions();
    for (const bullet of entityManager.getEntities('bullet')) {
      bulletCollisions(bullet);
    }
  }

  const Render = () => {

    const clearScreen = () => {
      context.save();
      context.clearRect(0, 0, canvas.width, canvas.height)
      // context.fillStyle = 'rgba(0,0,0,0.5)'
      // context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    }

    /**
     * @function drawEnemy
     * @param { Entity } enemy 
     */
    const drawEnemy = (enemy) => {
      /**
       * @type { RegularPolygon }
       */
      const polygon = enemy.getComponent(RegularPolygon.name);
      const position = enemy.getComponent(Position.name);
      const health = enemy.getComponent(Health.name);
      context.save();
      context.lineWidth = 10;
      context.strokeStyle = enemyColors[health.value];
      context.beginPath();
      context.translate(
        position.x,
        position.y
      );
      context.rotate(polygon.rotation);
      for (const vertex of polygon.vertices) {
        context.lineTo(vertex.x, vertex.y)
      }
      context.closePath();
      // context.fill();
      context.stroke();
      context.restore();
    }

    /**
     * @function drawBullet
     * @param { Entity } bullet 
     */
    const drawBullet = (bullet) => {
      const position = bullet.getComponent(Position.name);
      context.save();
      context.fillStyle = "fuchsia" //"#abb054";
      context.beginPath();
      context.arc(
        position.x,
        position.y,
        10,
        0,
        Math.PI * 2
      );
      context.fill();
      context.closePath();
      context.restore();
    }

    /**
     * @function drawPlayer
     * @param { Entity } player 
     */
    const drawPlayer = (player) => {
      const sprite = player.getComponent(Sprite.name);
      const position = player.getComponent(Position.name);
      context.save();

      context.drawImage(
        sprite.image,
        position.x,
        position.y,
        sprite.width,
        sprite.height
      )
      
      // context.fillStyle = "fuchsia"
      // context.fillRect(
      //   position.x,
      //   position.y,
      //   sprite.width,
      //   sprite.height
      // )

      context.restore();
    }

    /**
     * @function drawReticule
     * @param { Entity } player 
     */
    const drawReticule = (player) => {
      const mousePosition = player.getComponent(Input.name).mouse.position;
      context.save();
      context.strokeStyle = "fuchsia" //"#abb054";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(
        mousePosition.x,
        mousePosition.y,
        10,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.closePath();
    }

    const drawPlayerStats = (player) => {
      const playerScore = player.getComponent(Score.name);
      const playerHealth = player.getComponent(Health.name);
      context.font = "36px serif";
      context.fillStyle = "fuchsia";
      context.fillText(`Score: ${playerScore.value}`, canvas.width * 0.8, canvas.height *0.1);    
      context.fillText(`Health: ${playerHealth.value}`, canvas.width * 0.1, canvas.height *0.1);      
    }

    clearScreen();
    for (const entity of entityManager.getEntities()) {
      switch (entity.getTag()) {
        case 'player':
          drawPlayer(entity);
          drawReticule(entity);
          drawPlayerStats(entity)
          break;
        case 'bullet':
          drawBullet(entity);
          break;
        case 'enemy':
          drawEnemy(entity);
        default:
          break;
      }
    }
  }

  return [
    EnemySpawner,
    EnemyMovement,
    UserInputs,
    Kinematics,
    Collision,
    Render,
  ]
};