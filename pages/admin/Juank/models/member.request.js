import BaseModel from "./base.model.js";

/**
 * Representa la petición de adición de un miembro a un equipo en el API de C#.
 * Mapea directamente a AddTeamMemberRequest en el backend.
 */
export default class MemberRequest extends BaseModel {
    /**
     * @param {number} userId - ID del usuario registrado (ej. 1, 2, 3).
     * @param {string} role - Rol en el equipo ('Owner', 'Member', 'Viewer').
     */
    constructor(userId, role) {
        super();
        this.userId = userId;
        this.role = role;
    }

    /**
     * Convierte el modelo a JSON.
     * @override
     * @returns {Object}
     */
    toJson() {
        return {
            userId: this.userId,
            role: this.role
        };
    }
}
