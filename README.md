# JavaScript Ghost Game
A 2-D Geometry-Wars-Like game using a Ghost Character as the player, and varying sized Regular Polygons as the enemies.

This game was written as a JavaScript _(JS)_ implementation of "Assignment 2" from the video lecture series [COMP4300 - Intro to C++ Game Programming 2023](https://www.youtube.com/playlist?list=PL_xRyXins84_Jf-aCh7chj47HR4oZLPwK) by Professor David Churchill.

#### NOTE: This game is barely a Minimally Viable Product and is  still under development. See the [Upcoming Features](#upcoming-features) section to see what is to come :D.

## How To Play

### System Requirements
1) NodeJS -- [Installation Guide](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)

### Running The Game
1) Clone this repo to local and `cd` into the root directory
2) Run `npm install` to install all the dependecies
2) Run `node .` to start the server
3) Navigate to  http://localhost:3000/ in a modern browser
4) Have Fun :)

### Controls
- Movement:
  - W-A-S-D keys for Up-Down-Left-Right
  - Arrow Keys

- Aiming and Shooting:
  - Mouse movement and left-click
  - Trackpad and Tap

## Game Engine Design
As described in the lectures, this game follows the "Entity Component Systems" _(ECS)_ design pattern, where Entities are objects in the game, Components are properties of the Entities, and Systems that act on the entities through their components.

```
+---frontend
|   |   index.html
|   |
|   \---static
|       +---assets
|       |       sprite_ghost_left.png
|       |       sprite_ghost_right.png
|       |
|       \---js
|           |   index.js
|           |
|           \---game
|                   components.js
|                   entity.js
|                   entityManager.js
|                   gameEngine.js
|                   systems.js
|                   vector2Math.js
```
## Upcoming Features

### System Level

- Scenes
  - Currently, the game does not implement a mechanism for displaying different scenes such as a Main Menu, Settings, Game Over, etc. 
  - System requires a `SceneManager` and `Scene` objects.

- Pausing
  - Game does not implement a pausing mechanism during game.
  - System requires a boolean that toggles paused and running states.

- Animations
  - There are is no animation for player taking damage, enemy taking damage, or enemy destruction.
  - System requires a mechanism for displaying isolated animation sequences that are queued before re-renders, and dequeued after animation lifecycle.

- Configurations
  - The source files contain constant variables that configure player and enemy attributes like speed, spawn rate, etc. 
  - It would be better to have a config file that contains these values, and are loaded into the game at start.

### Gameplay

- Power Ups:
  - Player can obtain enhancements to their movement, shooting, defence, etc. 