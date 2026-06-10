import HttpService from "/shared/services/http.service.js";

/**
 * Clase de servicio base genérica que implementa operaciones CRUD básicas.
 * Aplica Herencia sobre HttpService y encapsula la lógica HTTP básica.
 */
export default class BaseCrudService extends HttpService {
    /**
     * @param {string} endpoint - El segmento de ruta relativo para el recurso (ej. '/members').
     */
    constructor(endpoint) {
        super();
        this.endpoint = endpoint;
    }

    /**
     * Obtiene recursos desde el API utilizando peticiones GET.
     * Polimorfismo: Si se provee id, obtiene un recurso específico; si no, obtiene la lista.
     * @param {string|number} [id=''] 
     * @returns {Promise<any>}
     */
    async get(id = '') {
        const url = id ? `${this.endpoint}/${id}` : this.endpoint;
        return await super.get(url);
    }

    /**
     * Envía una petición DELETE para eliminar un recurso por su ID.
     * @param {string|number} id 
     * @returns {Promise<any>}
     */
    async delete(id) {
        if (!id) throw new Error('El ID es requerido para realizar la eliminación.');
        return await super.delete(`${this.endpoint}/${id}`);
    }
}
