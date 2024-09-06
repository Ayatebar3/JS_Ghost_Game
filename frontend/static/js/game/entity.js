import { Component } from './components.js';

/**
 * @class
 * @constructor 
 * @public
 */
export class Entity {

  /** 
   * @member id
   * @type { Number }
   * @private
   */
  #_id;

  /**
   * @member tag
   * @type { String }
   * @private
   */
  #_tag;

  /**
   * @member isAlive
   * @type { Boolean }
   * @private
   */
  #_isAlive;

  /**
   * @member components
   * @type { { [key: string]: Component } }
   * @private
   */
  #_components;

  /**
   * @method constructor
   * @param { Number } id
   * @param { String } tag
   */
  constructor(id, tag) {
    this.#_id = id;
    this.#_tag = tag;
    this.#_isAlive = true;
    this.#_components = {};
  }

  /**
   * @method setComponent
   * @param { Component } component 
   */
  setComponent = (component) => {
    if (!component) {
      throw new Error("Entity.setComponent missing parameter 'component'")
    }

    if (!(component instanceof Component)) {
      throw new Error("Entity.setComponent input parameter 'component' must be an instance of Component")
    }

    if (component.constructor === undefined) {
      throw new Error("Entity.setComponent method can only take a component instance")
    }
    this.#_components[component.constructor.name] = component;
  }

  /**
   * @method getComponent
   * @param { String } componentName 
   * @returns { Component } 
   */
  getComponent = (componentName) => {
    if (typeof componentName !== "string") {
      throw new Error("Entity.getComponent method can only take a string");
    }
    return this.#_components[componentName];
  }

  /**
   * @method hasComponent
   * @param { String } componentName 
   * @returns { Boolean }
   */
  hasComponent = (componentName) => {
    if (typeof componentName !== "string") {
      throw new Error("Entity.hasComponent method can only take a string")
    }
    return this.#_components[componentName] !== undefined;
  }

  /**
   * @method removeComponent
   * @param { String } componentName 
   */
  removeComponent = (componentName) => {
    if (typeof componentName !== "string") {
      throw new Error("Entity.removeComponent method can only take a string")
    }
    delete this.#_components[componentName];
  }

  getId = () => {
    return this.#_id;
  }

  getTag = () => {
    return this.#_tag;
  }

  isActive = () => {
    return this.#_isAlive;
  }

  destroy = () => {
    this.#_isAlive = false;
  }
}