import HttpService from "./http.service.js";

export default class TeamsService extends HttpService {
    endpoint = '/teams';
    async get() {
        const json = await super.get(this.endpoint);
        return json;
    }
}