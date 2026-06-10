import MembersService from "./services/service.js";
import MemberRequest from "./models/member.request.js";
import CardsService from "./services/card.service.js";
import CardRequest from "./models/card.request.js";
import TokenResponse from "/shared/models/response/token.response.js";

// Instanciación dinámica de servicios del dominio (Aplicando encapsulamiento)
let currentMembersService = null;
let currentCardsService = null;

// --- REFERENCIAS DE ELEMENTOS DEL DOM ---
// Gestión de Pestañas (Tabs)
const tabMembersBtn = document.getElementById('tab-members-btn');
const tabCardsBtn = document.getElementById('tab-cards-btn');
const panelMembers = document.getElementById('panel-members');
const panelCards = document.getElementById('panel-cards');

// Formulario y Controles de Miembros
const memberForm = document.getElementById('memberForm');
const membersTableBody = document.getElementById('membersTableBody');
const btnLoadMembers = document.getElementById('btn-load-members');
const searchMemberTeamIdInput = document.getElementById('searchMemberTeamId');

// Formulario y Controles de Tarjetas (Cards)
const cardForm = document.getElementById('cardForm');
const cardsTableBody = document.getElementById('cardsTableBody');
const btnLoadCards = document.getElementById('btn-load-cards');
const searchTeamIdInput = document.getElementById('searchTeamId');
const cardFormTitle = document.getElementById('card-form-title');
const btnSubmitCard = document.getElementById('btn-submit-card');
const btnCancelCardEdit = document.getElementById('btn-cancel-card-edit');

// --- CONTROL DE NAVEGACIÓN ENTRE TABS ---
function switchTab(activeTabBtn, activePanel, inactiveTabBtn, inactivePanel) {
    activeTabBtn.style.fontWeight = 'bold';
    activePanel.style.display = 'block';
    inactiveTabBtn.style.fontWeight = 'normal';
    inactivePanel.style.display = 'none';
}

tabMembersBtn.addEventListener('click', () => {
    switchTab(tabMembersBtn, panelMembers, tabCardsBtn, panelCards);
    cargarMiembros();
});

tabCardsBtn.addEventListener('click', () => {
    switchTab(tabCardsBtn, panelCards, tabMembersBtn, panelMembers);
    cargarTarjetas();
});

// --- OPERACIONES CRUD: MIEMBROS ---
function inicializarServicioMembers() {
    const teamId = parseInt(searchMemberTeamIdInput.value);
    if (isNaN(teamId) || teamId <= 0) {
        alert('Debe especificar un ID de Equipo (Team ID) numérico y válido para miembros.');
        return false;
    }
    currentMembersService = new MembersService(teamId);
    return true;
}

async function cargarMiembros() {
    if (!inicializarServicioMembers()) return;

    try {
        membersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Consumiendo API de Miembros...</td></tr>';
        
        // Polimorfismo implícito al llamar a get() heredado de BaseCrudService
        const miembros = await currentMembersService.get();

        if (miembros.length === 0) {
            membersTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No hay miembros registrados en este equipo.</td></tr>`;
            return;
        }

        membersTableBody.innerHTML = '';
        miembros.forEach(miembro => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><span class="badge">#${miembro.userId}</span></td>
                <td><strong>${miembro.displayName || 'N/A'}</strong></td>
                <td>${miembro.role}</td>
                <td>${miembro.email || 'N/A'}</td>
                <td><span class="badge" style="background:rgba(192, 132, 252, 0.15); color:#c084fc;">Team ${miembro.teamId}</span></td>
                <td>
                    <button class="btn-delete btn-delete-member" data-userid="${miembro.userId}">Eliminar</button>
                </td>
            `;
            membersTableBody.appendChild(fila);
        });

        asignarEventosEliminarMiembros();
    } catch (error) {
        alert('Error en capa de presentación al cargar miembros: ' + error.message);
    }
}

btnLoadMembers.addEventListener('click', cargarMiembros);

memberForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = parseInt(document.getElementById('memberUserId').value);
    const role = document.getElementById('memberRole').value;

    try {
        if (!currentMembersService) {
            inicializarServicioMembers();
        }

        // Instanciación del Modelo de Petición (Request)
        const nuevoMiembro = new MemberRequest(userId, role);
        
        // Consumo del servicio
        await currentMembersService.create(nuevoMiembro);
        
        alert('¡Miembro agregado exitosamente al equipo!');
        memberForm.reset();
        await cargarMiembros();
    } catch (error) {
        alert('Error en la persistencia del miembro: ' + error.message);
    }
});

function asignarEventosEliminarMiembros() {
    const botones = document.querySelectorAll('.btn-delete-member');
    botones.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            const userId = event.target.getAttribute('data-userid');
            const confirmar = confirm(`¿Confirmas la eliminación del miembro con ID Usuario #${userId} del equipo actual?`);
            if (!confirmar) return;

            try {
                await currentMembersService.delete(userId);
                alert('Miembro removido del equipo de forma exitosa.');
                await cargarMiembros();
            } catch (error) {
                alert('Fallo al eliminar miembro: ' + error.message);
            }
        });
    });
}


// --- OPERACIONES CRUD: TARJETAS (CARDS) ---
function inicializarServicioCards() {
    const teamId = parseInt(searchTeamIdInput.value);
    if (isNaN(teamId) || teamId <= 0) {
        alert('Debe especificar un ID de Equipo (Team ID) numérico y válido para tarjetas.');
        return false;
    }
    currentCardsService = new CardsService(teamId);
    return true;
}

async function cargarTarjetas() {
    if (!inicializarServicioCards()) return;

    try {
        cardsTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Consumiendo API de Tarjetas del Equipo...</td></tr>';
        
        // Polimorfismo al invocar get() adaptado a CardsService
        const tarjetas = await currentCardsService.get();

        if (tarjetas.length === 0) {
            cardsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted);">El equipo actual no posee tarjetas asignadas.</td></tr>`;
            return;
        }

        cardsTableBody.innerHTML = '';
        tarjetas.forEach(tarjeta => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td><span class="badge">#${tarjeta.id}</span></td>
                <td><strong>${tarjeta.title}</strong></td>
                <td>${tarjeta.description || 'N/A'}</td>
                <td>${tarjeta.order}</td>
                <td>${tarjeta.boardColumnId !== null ? `<span class="badge">${tarjeta.boardColumnId}</span>` : '<em>Ninguno</em>'}</td>
                <td>${tarjeta.boardId !== null ? `<span class="badge">${tarjeta.boardId}</span>` : '<em>Ninguno</em>'}</td>
                <td>${tarjeta.ownerName ? `${tarjeta.ownerName} <em style="color:var(--text-muted);">(ID:${tarjeta.ownerId})</em>` : '<em>Sin asignar</em>'}</td>
                <td>
                    <div class="btn-action-group">
                        <button class="btn-edit btn-edit-card" 
                                data-id="${tarjeta.id}"
                                data-title="${tarjeta.title}"
                                data-description="${tarjeta.description}"
                                data-order="${tarjeta.order}"
                                data-columnid="${tarjeta.boardColumnId || ''}"
                                data-boardid="${tarjeta.boardId || ''}"
                                data-ownerid="${tarjeta.ownerId || ''}"
                                data-etag='${tarjeta.eTag || ''}'>
                            Editar
                        </button>
                        <button class="btn-delete btn-delete-card" data-id="${tarjeta.id}">
                            Eliminar
                        </button>
                    </div>
                </td>
            `;
            cardsTableBody.appendChild(fila);
        });

        asignarEventosTarjetas();
    } catch (error) {
        alert('Error en capa de presentación al consultar tarjetas: ' + error.message);
    }
}

btnLoadCards.addEventListener('click', cargarTarjetas);

cardForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('cardId').value;
    const title = document.getElementById('cardTitle').value;
    const description = document.getElementById('cardDescription').value;
    const order = parseInt(document.getElementById('cardOrder').value);
    
    const colVal = document.getElementById('cardColumnId').value;
    const boardVal = document.getElementById('cardBoardId').value;
    const ownerVal = document.getElementById('cardOwnerId').value;

    const boardColumnId = colVal ? parseInt(colVal) : null;
    const boardId = boardVal ? parseInt(boardVal) : null;
    const ownerId = ownerVal ? parseInt(ownerVal) : null;

    try {
        if (!currentCardsService) {
            inicializarServicioCards();
        }

        // Modelo de Petición para Tarjeta
        const cardRequest = new CardRequest(title, description, order, boardColumnId, boardId, ownerId);

        if (id) {
            // Modo Edición / Actualización (Requiere control de concurrencia mediante ETag)
            const etag = document.getElementById('cardEtag').value;
            await currentCardsService.update(id, cardRequest, etag);
            alert('¡Tarjeta modificada con éxito!');
        } else {
            // Modo Creación
            await currentCardsService.create(cardRequest);
            alert('¡Tarjeta creada de manera exitosa!');
        }

        resetCardForm();
        await cargarTarjetas();
    } catch (error) {
        alert('Fallo en persistencia de tarjeta: ' + error.message);
    }
});

function asignarEventosTarjetas() {
    // Manejo de la acción Editar Tarjeta (Precarga de formulario y cambio de estado visual)
    const botonesEditar = document.querySelectorAll('.btn-edit-card');
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const btn = event.target;
            
            document.getElementById('cardId').value = btn.getAttribute('data-id');
            document.getElementById('cardTitle').value = btn.getAttribute('data-title');
            document.getElementById('cardDescription').value = btn.getAttribute('data-description');
            document.getElementById('cardOrder').value = btn.getAttribute('data-order');
            document.getElementById('cardColumnId').value = btn.getAttribute('data-columnid');
            document.getElementById('cardBoardId').value = btn.getAttribute('data-boardid');
            document.getElementById('cardOwnerId').value = btn.getAttribute('data-ownerid');
            document.getElementById('cardEtag').value = btn.getAttribute('data-etag');

            cardFormTitle.textContent = `Editar Tarjeta #${btn.getAttribute('data-id')}`;
            btnSubmitCard.textContent = 'Guardar Cambios';
            btnCancelCardEdit.style.display = 'block';
        });
    });

    // Manejo de la acción Eliminar Tarjeta
    const botonesEliminar = document.querySelectorAll('.btn-delete-card');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            const confirmar = confirm(`¿Desea dar de baja (Soft Delete) la tarjeta #${id}?`);
            if (!confirmar) return;

            try {
                await currentCardsService.delete(id);
                alert('Tarjeta eliminada con éxito.');
                await cargarTarjetas();
            } catch (error) {
                alert('Fallo al ejecutar soft delete en tarjeta: ' + error.message);
            }
        });
    });
}

function resetCardForm() {
    cardForm.reset();
    document.getElementById('cardId').value = '';
    document.getElementById('cardEtag').value = '';
    cardFormTitle.textContent = 'Agregar Nueva Tarjeta';
    btnSubmitCard.textContent = 'Crear Tarjeta';
    btnCancelCardEdit.style.display = 'none';
}

btnCancelCardEdit.addEventListener('click', resetCardForm);

// --- CONTROL DE SESIÓN ---
function verificarSesion() {
    const token = TokenResponse.loadFromLocalStorage();
    const sessionStatus = document.getElementById('session-status');
    const sessionActionBtn = document.getElementById('session-action-btn');

    if (token !== null && token.isValid()) {
        sessionStatus.textContent = "Sesión activa";
        sessionStatus.style.backgroundColor = "var(--success-color)";
        sessionActionBtn.textContent = "Cerrar Sesión";
        sessionActionBtn.href = "#";
        sessionActionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });
    } else {
        sessionStatus.textContent = "Sesión no iniciada (HTTP 401)";
        sessionStatus.style.backgroundColor = "var(--danger-color)";
        sessionActionBtn.textContent = "Iniciar Sesión";
        sessionActionBtn.href = "/pages/login/index.html";
    }
}

// --- INICIALIZACIÓN DE LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarMiembros();
});
