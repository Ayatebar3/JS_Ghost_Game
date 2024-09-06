export class Component {
  constructor() { }
}

/**
 * @class
 * @constructor 
 * @public
 */
export class Vector2D extends Component {

  /**
   * @member x
   * @type { Number }
   * @public
   */
  x;

  /**
   * @member y
   * @type { Number }
   * @public
   */
  y;

  /**
   * @method constructor
   * @param { Number } x 
   * @param { Number } y 
   */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class Position extends Vector2D {
  /**
   * @method constructor
   * @param { Number } x 
   * @param { Number } y 
   */
  constructor(x, y) {
    super(x, y)
  }
}

export class Velocity extends Vector2D {
  /**
   * @method constructor
   * @param { Number } x 
   * @param { Number } y 
   */
  constructor(x, y) {
    super(x, y)
  }
}

export class Acceleration extends Vector2D {
  /**
   * @method constructor
   * @param { Number } x 
   * @param { Number } y 
   */
  constructor(x, y) {
    super(x, y)
  }
}

export class Speed extends Component {

  /**
   * @member value
   * @type { Number }
   * @public
   */
  value;
  /**
   * @method constructor
   * @param { Number } s
   */
  constructor(speed) {
    super();
    this.value = speed;
  }
}

export class Input extends Component {
  constructor() {
    super();
    this.movement = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.mouse = {
      position: new Position(0, 0),
      leftClick: false,
      rightClick: false
    }
  }
}

export class Sprite extends Component {

  /**
   * @member image
   * @type { HTMLImageElement }
   * @public
   */
  image;

  /**
   * @member width
   * @type { Number }
   * @public
   */
  width;

  /**
   * @member height
   * @type { Number }
   * @public
   */
  height;

  /**
   * @method constructor
   * @param { HTMLImageElement } image 
   * @param { Number } width 
   * @param { Number } height 
   */
  constructor(image, width, height) {
    super();
    this.image = image;
    this.width = width;
    this.height = height;
  }
}

export class Score extends Component {
  constructor(score) {
    super();
    this.value = score
  }
}

export class Health extends Component {
  constructor(health) {
    super();
    this.value = health
  }
}

export class Damage extends Component {
  constructor(damage) {
    super();
    this.value = damage
  }
}

export class RegularPolygon extends Component {
  /**
   * @method constructor
   * @param { Number } radius 
   * @param { Number } numOfVertices 
   */
  constructor(radius, numOfVertices) {
    super();
    this.radius = radius;
    this.rotation = 0;
    this.vertices = (() => {
      const vertexList = [];
      const deltaTheta = (Math.PI * 2) / numOfVertices;
      for (let i = 0; i < numOfVertices; i++) {
        vertexList.push(new Vector2D(
            radius * Math.cos(deltaTheta * i),
            radius * Math.sin(deltaTheta * i)
          )
        );
      }
      return vertexList;
    })();
  }
}