import BaseResponse from "./base-response.js";

/**
 * Representa un miembro retornado por la consulta de miembros de equipo en el API de C#.
 * Mapea a TeamMembersResponse en el backend.
 */
export class MemberResponse extends BaseResponse {
    /**
     * @param {number} userId 
     * @param {string} displayName 
     * @param {string} role 
     * @param {string} email 
     * @param {number} teamId 
     */
    constructor(userId, displayName, role, email, teamId) {
        super(userId); // El identificador primario del miembro en este contexto es el UserId
        this.userId = userId;
        this.displayName = displayName;
        this.role = role;
        this.email = email;
        this.teamId = teamId;
    }

    /**
     * Factoría polimórfica para construir respuestas basadas en el JSON del servidor.
     * @param {Object} json 
     * @returns {MemberResponse|null}
     */
    static fromJson(json) {
        if (!json) return null;
        return new MemberResponse(
            json.userId,
            json.displayName,
            json.role,
            json.email,
            json.teamId
        );
    }
}
export default MemberResponse;
