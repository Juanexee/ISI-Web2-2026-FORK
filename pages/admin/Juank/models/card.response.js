import BaseResponse from "./base-response.js";

/**
 * Representa una tarjeta (Card) devuelta por el API.
 * Modela la respuesta mediante herencia de BaseResponse.
 */
export default class CardResponse extends BaseResponse {
    /**
     * @param {number} id 
     * @param {string} title 
     * @param {string} description 
     * @param {number} order 
     * @param {number|null} boardColumnId 
     * @param {number} teamId 
     * @param {number|null} boardId 
     * @param {number|null} ownerId 
     * @param {string} ownerName 
     * @param {string|null} eTag 
     * @param {Array} labels 
     */
    constructor(id, title, description, order, boardColumnId, teamId, boardId, ownerId, ownerName, eTag, labels) {
        super(id);
        this.title = title;
        this.description = description;
        this.order = order;
        this.boardColumnId = boardColumnId;
        this.teamId = teamId;
        this.boardId = boardId;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.eTag = eTag;
        this.labels = labels || [];
    }

    /**
     * Factoría estática para construir la respuesta desde datos planos del API.
     * @param {Object} json 
     * @returns {CardResponse|null}
     */
    static fromJson(json) {
        if (!json) return null;
        return new CardResponse(
            json.id,
            json.title,
            json.description,
            json.order,
            json.boardColumnId,
            json.teamId,
            json.boardId,
            json.ownerId,
            json.ownerName,
            json.eTag,
            json.labels
        );
    }
}
