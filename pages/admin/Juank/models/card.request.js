import BaseModel from "./base.model.js";

/**
 * Representa la petición de creación o actualización de una tarjeta (Card).
 * Utiliza abstracción y encapsulamiento heredando de BaseModel.
 */
export default class CardRequest extends BaseModel {
    /**
     * @param {string} title 
     * @param {string} description 
     * @param {number} order 
     * @param {number|null} boardColumnId 
     * @param {number|null} boardId 
     * @param {number|null} ownerId 
     */
    constructor(title, description, order = 0, boardColumnId = null, boardId = null, ownerId = null) {
        super();
        this.title = title;
        this.description = description;
        this.order = order;
        this.boardColumnId = boardColumnId;
        this.boardId = boardId;
        this.ownerId = ownerId;
    }

    /**
     * Sobreescritura polimórfica para estructurar los datos del cuerpo HTTP.
     * @returns {Object}
     */
    toJson() {
        return {
            title: this.title,
            description: this.description,
            order: this.order,
            boardColumnId: this.boardColumnId,
            boardId: this.boardId,
            ownerId: this.ownerId
        };
    }
}
