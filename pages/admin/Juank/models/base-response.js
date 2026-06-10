/**
 * Clase base para todos los modelos de respuesta (Response).
 * Encapsula propiedades comunes compartidas por las entidades del dominio.
 */
export default class BaseResponse {
    /**
     * @param {number} id - Identificador único de la entidad en la base de datos SQL Server.
     */
    constructor(id) {
        if (this.constructor === BaseResponse) {
            throw new TypeError("No se puede instanciar la clase abstracta BaseResponse directamente.");
        }
        this.id = id;
    }
}
