/**
 * Clase base para todas las clases de modelo de petición (Request).
 * Proporciona un contrato abstracto para la serialización de datos.
 */
export default class BaseModel {
    /**
     * Convierte el modelo a un objeto literal para ser serializado a JSON.
     * @abstract
     * @returns {Object}
     */
    toJson() {
        throw new Error("Polimorfismo requerido: El método 'toJson()' debe ser implementado en las clases hijas.");
    }
}
