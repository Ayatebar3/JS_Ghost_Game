import { Vector2D } from './components.js';

export class Vector2Math {
  constructor() {
    throw new Error('Vector2Math: Cannot instantiate Static Class')
  }

  /**
   * @method sum
   * @param { Vector2D } A 
   * @param { Vector2D } B 
   * @returns { Vector2D }
   */
  static sum = (A, B) => {
    return new Vector2D(
      A.x + B.x,
      A.y + B.y
    )
  }

  /**
   * @method difference
   * @param { Vector2D } A 
   * @param { Vector2D } B 
   * @returns { Vector2D }
   */
  static difference = (A, B) => {
    return new Vector2D(
      A.x - B.x,
      A.y - B.y
    )
  }

  /**
   * @method scale
   * @param { Vector2D } A 
   * @param { Number } s 
   * @returns { Vector2D }
   */
  static scale = (A, s) => {
    return new Vector2D(
      s * A.x,
      s * A.y
    )
  }

  /**
   * @method magnitude
   * @param { Vector2D } A 
   * @returns { Number }
   */
  static magnitude = (A) => {
    return Math.sqrt(
      (A.x ** 2) + (A.y ** 2)
    )
  }

  /**
   * @method normalize
   * @param { Vector2D } A
   * @param { Number } s
   * @returns { Vector2D } 
   */
  static normalize = (A, s = 1) => {
    if (!A.x && !A.y) {
      return A;
    }
    const magnitude = this.magnitude(A);
    return new Vector2D(
      s * A.x / magnitude,
      s * A.y / magnitude
    )
  }

  /**
   * @method distance
   * @param { Vector2D } A 
   * @param { Vector2D } B 
   * @returns { Number }
   */
  static distance = (A, B) => {
    const diff = this.difference(A, B)
    return this.magnitude(diff)
  }

  /**
   * 
   * @param { Vector2D } A 
   * @param { Vector2D } B 
   * @returns { Number }
   */
  static distSquared = (A, B) => {
    const diff = this.difference(A, B);
    return (
      (diff.x ** 2) + (diff.y ** 2)
    )
  }

  /**
   * @method dotProduct
   * @param { Vector2D } A 
   * @param { Vector2D } B 
   * @returns { Number }
   */
  static dotProduct = (A, B) => {
    return (
      (A.x * B.x) + (A.y * B.y)
    )
  }

  /**
   * @method angleBetween
   * @param { Vector2D } A 
   * @param { Vector2D } B 
   * @returns { Number }
   */
  static angleBetween = (A, B) => {
    const dot = this.dotProduct(A, B);
    const A_mag = this.magnitude(A);
    const B_mag = this.magnitude(B);
    return Math.acos(
      dot / (A_mag * B_mag)
    )
  }
}