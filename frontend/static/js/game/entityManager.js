import { Entity } from './entity.js';

export class EntityManager {

  /**
   * @member totalEntities
   * @type { Number }
   * @private
   */
  #_totalEntities;

  /**
   * @member entities
   * @type { Entity []}
   * @private
   */
  #_entities;

  /**
   * @member entitesMap
   * @type { Entity | { [key: string]: Entity[] }}
   * @private
   */
  #_entitiesMap;

  /**
   * @member entitiesToAdd
   * @type { Entity []}
   * @private
   */
  #_entitiesToAdd;

  constructor() {
    this.#_totalEntities = 0;
    this.#_entities = [];
    this.#_entitiesMap = {}
    this.#_entitiesToAdd = [];
  }

  update = () => {

    const addNewEntities = () => {
      while (this.#_entitiesToAdd.length) {
        const entity = this.#_entitiesToAdd.shift();
        const tag = entity.getTag();
        this.#_entities.push(entity);
        if (this.#_entitiesMap[tag] === null) {
          this.#_entitiesMap[tag] = entity;
        } else {
          this.#_entitiesMap[tag].push(entity)
        }
      }
    }

    const removeDeadEntities = () => {
      const deadEntities = this.#_entities.filter(entity => !entity.isActive());
      while (deadEntities.length) {
        const entity = deadEntities.shift();

        const listIndex = this.#_entities.indexOf(entity);
        this.#_entities.splice(listIndex, 1);

        const mapIndex = this.#_entitiesMap[entity.getTag()].indexOf(entity);
        this.#_entitiesMap[entity.getTag()].splice(mapIndex, 1);
      }
    }

    removeDeadEntities();
    addNewEntities();
  }

  /**
   * @method addEntity
   * @param { string } tag 
   * @returns { Entity } 
   */
  addEntity = (tag) => {
    if (!tag || !(tag in this.#_entitiesMap)) {
      throw new Error('EntityManager.addEntity method requires a valid tag');
    }
    const newEntity = new Entity(this.#_totalEntities++, tag);
    this.#_entitiesToAdd.push(newEntity);
    return newEntity;
  }

  /**
   * @method addEntityType
   * @param { string } tag 
   * @param { Boolean } isUnique
   */
  addEntityType = (tag, isUnique = false) => {
    if (!tag || typeof tag !== "string") {
      throw new Error("EntityManager.addEntityType input parameter 'tag' must be a valid string");
    }

    this.#_entitiesMap[tag] = isUnique ? null : []
  }

  /**
   * @method hasEntityType
   * @param { string } tag 
   * @returns { Boolean } 
   */
  hasEntityType = (tag) => {
    if (!tag || typeof tag !== "string") {
      throw new Error("EntityManager.hasEntityType input parameter 'tag' must be a valid string")
    }

    return tag in this.#_entitiesMap;
  }

  /**
   * @method getEntity
   * @param { String } tag 
   * @returns { Entity }
   */
  getEntity = (tag) => {
    if (!tag || typeof tag !== "string") {
      throw new Error("EntityManager.getEntity input parameter 'tag' must be a valid string")
    }

    if (Array.isArray(this.#_entitiesMap[tag])) {
      throw new Error(`EntityManager.getEntity attempted to get non-unique entity 'tag=${tag}' - Use EntityManager.getEntities(tag: string)`)
    }

    if (!(tag in this.#_entitiesMap)) {
      throw new Error(`EntityManager.getEntity input parameter 'tag=${tag}' does not exist in Entity Map`);
    }

    return this.#_entitiesMap[tag]
  }

  /**
   * @method getEntities
   * @param { string } tag 
   * @returns { Entity []} 
   */
  getEntities = (tag = null) => {
    if (!tag) {
      return this.#_entities;
    }

    if (!Array.isArray(this.#_entitiesMap[tag])) {
      throw new Error(`EntityManager.getEntities attempted to get unique entity 'tag=${tag}' - Use EntityManager.getEntity(tag: string)`)
    }

    if (!(tag in this.#_entitiesMap)) {
      throw new Error(`EntityManager.getEntities input parameter 'tag=${tag}' does not exist in Entity Map`);
    }

    return this.#_entitiesMap[tag];
  }
}