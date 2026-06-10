import BaseCrudService from "./base-crud.service.js";
import MemberRequest from "../models/member.request.js";
import { MemberResponse } from "../models/member.response.js";

/**
 * Servicio encargado de la gestión de Miembros del equipo.
 * Hereda de BaseCrudService y parametriza dinámicamente el endpoint anidado del API (/api/teams/{teamId}/members).
 */
export default class MembersService extends BaseCrudService {
    /**
     * @param {number} teamId - Identificador del equipo.
     */
    constructor(teamId) {
        super(`/teams/${teamId}/members`);
        this.teamId = teamId;
    }

    /**
     * Sobreescritura polimórfica del método get() para estructurar la colección de respuesta.
     * @override
     * @returns {Promise<MemberResponse[]>}
     */
    async get() {
        const json = await super.get();
        if (json === null || !Array.isArray(json)) return [];
        return json.map(item => MemberResponse.fromJson(item));
    }

    /**
     * Añade un usuario registrado como miembro del equipo especificado.
     * @param {MemberRequest} memberRequest 
     * @returns {Promise<any>}
     */
    async create(memberRequest) {
        if (!memberRequest || !(memberRequest instanceof MemberRequest)) {
            throw new Error('Datos de miembro inválidos. Se esperaba una instancia de MemberRequest.');
        }
        return await super.post(this.endpoint, memberRequest.toJson());
    }

    /**
     * Elimina a un miembro del equipo utilizando su ID de Usuario en la ruta anidada.
     * @override
     * @param {number} userId - ID del usuario a eliminar del equipo.
     * @returns {Promise<any>}
     */
    async delete(userId) {
        if (!userId) throw new Error('El ID de usuario es requerido para remover al miembro.');
        return await super.delete(`${this.endpoint}/${userId}`);
    }
}
