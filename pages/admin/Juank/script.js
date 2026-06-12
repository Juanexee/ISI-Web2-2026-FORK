import TeamsService from "../../../shared/services/teams.service.js";



class LocalLabelResponse {
    constructor(id, name, normalizedName, color, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.normalizedName = normalizedName;
        this.color = color;
        this.createdAt = new Date(createdAt);
        this.updatedAt = new Date(updatedAt);
    }

    static fromJson(json) {
        return new LocalLabelResponse(
            json.id,
            json.name,
            json.normalizedName,
            json.color,
            json.createdAt,
            json.updatedAt
        );
    }
}

class LocalLabelRequest {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }

    toJson() {
        return {
            name: this.name,
            color: this.color
        };
    }
}

const teamsService = new TeamsService();



// --- Petición GET ---
async function obtenerEtiquetasDeEquipo(teamId) {
    try {
        if (!teamId) throw new Error("Es necesario proporcionar el ID del equipo.");

        const endpointLabels = `${teamsService.endpoint}/${teamId}/labels`;
        console.log(`Iniciando petición GET a: ${teamsService.baseUrl}${endpointLabels}`);

        const jsonResponse = await teamsService.get(endpointLabels);

        if (jsonResponse === null || !Array.isArray(jsonResponse)) {
            return [];
        }

        return jsonResponse.map(labelJson => LocalLabelResponse.fromJson(labelJson));

    } catch (error) {
        console.error("Error en la petición a la API:", error.message);
        throw error;
    }
} 

// --- Petición POST ---
async function crearEtiquetaEnEquipo(teamId, localLabelRequest) {
    try {
        if (!teamId) throw new Error("El ID del equipo es requerido.");
        if (!localLabelRequest) throw new Error("Los datos de la etiqueta son requeridos.");

        const endpointLabels = `${teamsService.endpoint}/${teamId}/labels`;
        console.log(`Iniciando petición POST a: ${teamsService.baseUrl}${endpointLabels}`);

        const payload = [ localLabelRequest.toJson() ];

        const jsonResponse = await teamsService.post(endpointLabels, payload);
        return jsonResponse;

    } catch (error) {
        console.error("Error en la petición POST a la API:", error.message);
        throw error;
    }
}

// --- Petición PUT ---
async function actualizarEtiquetaEnEquipo(teamId, labelId, localLabelRequest) {
    try {
        if (!teamId) throw new Error("El ID del equipo es requerido.");
        if (!labelId) throw new Error("El ID de la etiqueta es requerido.");
        if (!localLabelRequest) throw new Error("Los nuevos datos de la etiqueta son requeridos.");

        const endpointLabelsPut = `${teamsService.endpoint}/${teamId}/labels/${labelId}`;
        console.log(`Iniciando petición PUT a: ${teamsService.baseUrl}${endpointLabelsPut}`);

        const jsonResponse = await teamsService.put(endpointLabelsPut, localLabelRequest.toJson());

        return LocalLabelResponse.fromJson(jsonResponse);

    } catch (error) {
        console.error("Error en la petición PUT a la API:", error.message);
        throw error;
    }
}

// --- Petición DELETE ---
async function eliminarEtiquetaEnEquipo(teamId, labelId) {
    try {
        if (!teamId) throw new Error("El ID del equipo es requerido.");
        if (!labelId) throw new Error("El ID de la etiqueta es requerido.");

        const endpointLabelsDelete = `${teamsService.endpoint}/${teamId}/labels/${labelId}`;
        console.log(`Iniciando petición DELETE a: ${teamsService.baseUrl}${endpointLabelsDelete}`);

        const response = await teamsService.delete(endpointLabelsDelete);
        return response;

    } catch (error) {
        if (error.message.includes("JSON")) {
            return true; 
        }
        console.error("Error en la petición DELETE a la API:", error.message);
        throw error;
    }
}




// --- DOM & Evento GET ---
const btnCargar = document.getElementById('btnCargar');
const inputTeamId = document.getElementById('teamIdInput');
const txtEstado = document.getElementById('mensajeEstado');
const ulEtiquetas = document.getElementById('listaEtiquetas');

btnCargar.addEventListener('click', async () => {
    const teamId = inputTeamId.value;
    
    ulEtiquetas.innerHTML = '';
    txtEstado.innerText = "Cargando datos desde la API...";
    
    try {
        const etiquetas = await obtenerEtiquetasDeEquipo(teamId);
        
        if (etiquetas.length === 0) {
            txtEstado.innerText = "El equipo no tiene etiquetas asignadas o no existe.";
            return;
        }

        txtEstado.innerText = `¡Éxito! Se encontraron ${etiquetas.length} etiquetas:`;
        
        etiquetas.forEach(label => {
            const li = document.createElement('li');
            li.innerText = `ID: ${label.id} | Nombre: ${label.name} | Color: ${label.color}`;
            ulEtiquetas.appendChild(li);
        });
        
    } catch (error) {
        txtEstado.innerText = `Error al consultar: ${error.message}`;
    }
});

// --- DOM & Evento POST ---
const btnCrear = document.getElementById('btnCrear');
const inputLabelName = document.getElementById('labelNameInput');
const inputLabelColor = document.getElementById('labelColorInput');
const txtCrearEstado = document.getElementById('mensajeCrearEstado');

btnCrear.addEventListener('click', async () => {
    const teamId = inputTeamId.value;
    const name = inputLabelName.value.trim();
    const color = inputLabelColor.value.trim();

    if (!name || !color) {
        txtCrearEstado.innerText = "Por favor, completa tanto el nombre como el color.";
        return;
    }

    txtCrearEstado.innerText = "Enviando nueva etiqueta...";

    try {
        const nuevaEtiquetaRequest = new LocalLabelRequest(name, color);
        const resultado = await crearEtiquetaEnEquipo(teamId, nuevaEtiquetaRequest);
       
        if (resultado.created && resultado.created.length > 0) {
            txtCrearEstado.innerText = `¡Éxito! Etiqueta "${resultado.created[0].name}" creada correctamente.`;
            inputLabelName.value = '';
            inputLabelColor.value = '';
        } else if (resultado.skipped && resultado.skipped.length > 0) {
            txtCrearEstado.innerText = `Omitido: La etiqueta ya existe en este equipo.`;
        } else {
            txtCrearEstado.innerText = "La API procesó la solicitud pero no retornó cambios.";
        }

    } catch (error) {
        txtCrearEstado.innerText = `Error al crear: ${error.message}`;
    }
});

// --- DOM & Evento PUT ---
const btnActualizar = document.getElementById('btnActualizar');
const inputLabelIdPut = document.getElementById('labelIdPutInput');
const inputLabelNamePut = document.getElementById('labelNamePutInput');
const inputLabelColorPut = document.getElementById('labelColorPutInput');
const txtPutEstado = document.getElementById('mensajePutEstado');

btnActualizar.addEventListener('click', async () => {
    const teamId = inputTeamId.value; 
    const labelId = inputLabelIdPut.value;
    const name = inputLabelNamePut.value.trim();
    const color = inputLabelColorPut.value.trim();

    if (!labelId || !name || !color) {
        txtPutEstado.innerText = "Por favor, completa todos los campos (ID, Nombre y Color).";
        return;
    }

    txtPutEstado.innerText = "Enviando actualización a la API...";

    try {
        const etiquetaActualizadaRequest = new LocalLabelRequest(name, color);
        const etiquetaModificada = await actualizarEtiquetaEnEquipo(teamId, labelId, etiquetaActualizadaRequest);

        txtPutEstado.innerText = `¡Éxito! Etiqueta ID ${etiquetaModificada.id} renombrada a "${etiquetaModificada.name}" con color ${etiquetaModificada.color}.`;
        
        inputLabelIdPut.value = '';
        inputLabelNamePut.value = '';
        inputLabelColorPut.value = '';

    } catch (error) {
        txtPutEstado.innerText = `Error al actualizar: ${error.message}`;
    }
});

    // --- DOM & Evento DELETE ---
const btnEliminar = document.getElementById('btnEliminar');
const inputLabelIdDelete = document.getElementById('labelIdDeleteInput');
const txtDeleteEstado = document.getElementById('mensajeDeleteEstado');

btnEliminar.addEventListener('click', async () => {
    const teamId = inputTeamId.value; 
    const labelId = inputLabelIdDelete.value;

    if (!labelId) {
        txtDeleteEstado.innerText = "Por favor, proporciona el ID de la etiqueta a eliminar.";
        return;
    }

    const confirmar = confirm(`¿Estás seguro de que deseas eliminar la etiqueta con ID ${labelId}?`);
    if (!confirmar) return;

    txtDeleteEstado.innerText = "Eliminando etiqueta en la API...";

    try {
        await eliminarEtiquetaEnEquipo(teamId, labelId);

        txtDeleteEstado.style.color = "red";
        txtDeleteEstado.innerText = `¡Éxito! La etiqueta con ID ${labelId} fue removida del equipo.`;
        inputLabelIdDelete.value = '';

    } catch (error) {
        txtDeleteEstado.style.color = "black";
        txtDeleteEstado.innerText = `Error al eliminar: ${error.message}`;
    }
});
