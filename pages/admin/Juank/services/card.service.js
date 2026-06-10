import BaseCrudService from "./base-crud.service.js";
import CardRequest from "../models/card.request.js";
import CardResponse from "../models/card.response.js";
import TokenResponse from "/shared/models/response/token.response.js";

/**
 * Servicio encargado de la lógica de negocio y consumo de API para Tarjetas (Cards).
 * Especializa BaseCrudService adaptando los endpoints anidados del API de Teams (/api/teams/{teamId}/cards).
 */
export default class CardsService extends BaseCrudService {
    /**
     * @param {number} teamId - Identificador del equipo al cual pertenecen las tarjetas.
     */
    constructor(teamId) {
        // Construimos el endpoint anidado correspondiente al controlador de Teams
        super(`/teams/${teamId}/cards`);
        this.teamId = teamId;
    }

    /**
     * Sobreescritura polimórfica del método get() para obtener tarjetas de un equipo.
     * @override
     * @param {string|number} [id=''] - ID de la tarjeta (opcional)
     * @returns {Promise<CardResponse|CardResponse[]>}
     */
    async get(id = '') {
        const json = await super.get(id);
        if (id) {
            return CardResponse.fromJson(json);
        }
        if (json === null || !Array.isArray(json)) return [];
        return json.map(item => CardResponse.fromJson(item));
    }

    /**
     * Crea una nueva tarjeta para el equipo asociado a este servicio.
     * @param {CardRequest} cardRequest 
     * @returns {Promise<CardResponse>}
     */
    async create(cardRequest) {
        if (!cardRequest || !(cardRequest instanceof CardRequest)) {
            throw new Error('Datos de tarjeta inválidos. Se esperaba una instancia de CardRequest.');
        }
        const json = await super.post(this.endpoint, cardRequest.toJson());
        return CardResponse.fromJson(json);
    }

    /**
     * Actualiza una tarjeta específica usando PATCH y el encabezado If-Match para concurrencia optimista.
     * @param {number} id - ID de la tarjeta.
     * @param {CardRequest} cardRequest - Datos de actualización.
     * @param {string} etag - ETag de control de concurrencia.
     * @returns {Promise<CardResponse>}
     */
    async update(id, cardRequest, etag) {
        if (!id) throw new Error('El ID es requerido para actualizar la tarjeta.');
        if (!cardRequest || !(cardRequest instanceof CardRequest)) {
            throw new Error('Datos de actualización inválidos. Se esperaba una instancia de CardRequest.');
        }

        const token = TokenResponse.loadFromLocalStorage();
        const headers = { 'Content-Type': 'application/json' };
        
        if (token !== null && token.isValid()) {
            headers['Authorization'] = `Bearer ${token.token}`;
        }
        if (etag) {
            headers['If-Match'] = etag;
        }

        const fullEndpoint = this.baseUrl + `${this.endpoint}/${id}`;
        const response = await fetch(fullEndpoint, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(cardRequest.toJson())
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ocurrió un error al actualizar la tarjeta.');
        }

        const json = await response.json();
        return CardResponse.fromJson(json);
    }
}
