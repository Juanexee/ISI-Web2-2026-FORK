import TeamsService from "../../../shared/services/teams.service.js";

const teamsService = new TeamsService();

async function loadTeams() {
    const teams = await teamsService.get();
    console.log('Teams loaded successfully:');
    console.log(teams);
}

loadTeams();