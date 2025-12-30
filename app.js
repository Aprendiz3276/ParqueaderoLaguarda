// MiParqueo App - Sistema de Autenticación y Gestión
// Conectado a API con PostgreSQL/SQLite

// Detectar si estamos en producción (Vercel) o desarrollo local
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

// Estado de la aplicación
let appState = {
    isAuthenticated: false,
    currentUser: null,
    userRole: null,
    parkingLots: [],
    userVehicles: [],
    userReservations: []
};

// Elementos del DOM
const loginPage = document.getElementById('login-page');
const userDashboard = document.getElementById('user-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const errorMessage = document.getElementById('error-message');
const logoutBtnUser = document.getElementById('logout-btn-user');
const logoutBtnAdmin = document.getElementById('logout-btn-admin');
const userName = document.getElementById('user-name');
const adminName = document.getElementById('admin-name');

// Funciones de API
async function apiLogin(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error en login');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function apiGetParkingLots() {
    try {
        const response = await fetch(`${API_URL}/parking`);
        if (!response.ok) throw new Error('Error obteniendo parqueaderos');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function apiGetUserReservations(userId) {
    try {
        const response = await fetch(`${API_URL}/reservations/user/${userId}`);
        if (!response.ok) throw new Error('Error obteniendo reservas');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function apiGetUserVehicles(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/vehicles`);
        if (!response.ok) throw new Error('Error obteniendo vehículos');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function apiCreateReservation(userId, parkingLotId, vehicleId, startTime, endTime) {
    try {
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, parkingLotId, vehicleId, startTime, endTime })
        });
        
        if (!response.ok) throw new Error('Error creando reserva');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function apiCancelReservation(reservationId) {
    try {
        const response = await fetch(`${API_URL}/reservations/${reservationId}/cancel`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Error cancelando reserva');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Funciones de autenticación
async function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validar credenciales
    if (!email || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    try {
        const user = await apiLogin(email, password);
        
        // Login exitoso
        appState.isAuthenticated = true;
        appState.currentUser = user;
        appState.userRole = user.role;

        // Mostrar dashboard correspondiente
        showDashboard(user.role);
        loginForm.reset();
        errorMessage.classList.add('hidden');
    } catch (error) {
        showError(error.message || 'Correo o contraseña incorrectos');
        passwordInput.value = '';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function showDashboard(role) {
    // Ocultar login
    loginPage.classList.add('hidden');

    if (role === 'user') {
        // Mostrar dashboard de usuario
        userDashboard.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        userName.textContent = appState.currentUser.name;
        initializeUserDashboard();
    } else if (role === 'admin') {
        // Mostrar dashboard de admin
        adminDashboard.classList.remove('hidden');
        userDashboard.classList.add('hidden');
        adminName.textContent = appState.currentUser.name;
        initializeAdminDashboard();
    }
}

function logout() {
    appState.isAuthenticated = false;
    appState.currentUser = null;
    appState.userRole = null;
    appState.parkingLots = [];
    appState.userVehicles = [];
    appState.userReservations = [];

    // Mostrar login
    loginPage.classList.remove('hidden');
    userDashboard.classList.add('hidden');
    adminDashboard.classList.add('hidden');

    loginForm.reset();
    errorMessage.classList.add('hidden');
}

// Inicializar dashboard de usuario
async function initializeUserDashboard() {
    // Cargar datos
    appState.parkingLots = await apiGetParkingLots();
    appState.userVehicles = await apiGetUserVehicles(appState.currentUser.id);
    appState.userReservations = await apiGetUserReservations(appState.currentUser.id);

    // Event listeners para tabs
    const tabButtons = userDashboard.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchUserTab(btn.dataset.tab));
    });

    // Mostrar primera pestaña
    switchUserTab('reservations');
    
    // Actualizar vistas
    updateReservationsView();
}

// Inicializar dashboard de admin
async function initializeAdminDashboard() {
    // Cargar datos
    appState.parkingLots = await apiGetParkingLots();

    // Event listeners para tabs admin
    const adminTabButtons = adminDashboard.querySelectorAll('.admin-tab-btn');
    adminTabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
    });

    // Mostrar primera pestaña
    switchAdminTab('admin-dashboard');
}

// Actualizar vista de reservas
function updateReservationsView() {
    const reservationsContainer = document.querySelector('#reservations-tab');
    if (!reservationsContainer) return;

    if (appState.userReservations.length === 0) {
        reservationsContainer.innerHTML = '<p>No tienes reservas activas</p>';
        return;
    }

    reservationsContainer.innerHTML = appState.userReservations.map(res => `
        <div class="reservation-card">
            <h4>${res.parking_name}</h4>
            <p>Vehículo: ${res.vehicle_plate}</p>
            <p>Estado: ${res.status}</p>
            <p>Costo: $${res.total_cost}</p>
            ${res.status === 'active' ? `
                <button onclick="cancelReservation(${res.id})" class="btn-danger">Cancelar</button>
            ` : ''}
        </div>
    `).join('');
}

async function cancelReservation(reservationId) {
    try {
        await apiCancelReservation(reservationId);
        appState.userReservations = await apiGetUserReservations(appState.currentUser.id);
        updateReservationsView();
    } catch (error) {
        alert('Error cancelando reserva: ' + error.message);
    }
}

// Cambiar pestaña de usuario
function switchUserTab(tabName) {
    // Ocultar todos los tabs
    const allTabs = userDashboard.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.add('hidden'));

    // Mostrar tab seleccionado
    const selectedTab = userDashboard.querySelector(`#${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Actualizar botones activos
    const allTabButtons = userDashboard.querySelectorAll('.tab-btn');
    allTabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Cambiar pestaña de admin
function switchAdminTab(tabName) {
    // Ocultar todos los tabs
    const allTabs = adminDashboard.querySelectorAll('.admin-tab-content');
    allTabs.forEach(tab => tab.classList.add('hidden'));

    // Mostrar tab seleccionado
    const selectedTab = adminDashboard.querySelector(`#${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Actualizar botones activos
    const allTabButtons = adminDashboard.querySelectorAll('.admin-tab-btn');
    allTabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtnUser.addEventListener('click', logout);
logoutBtnAdmin.addEventListener('click', logout);

// Permitir enter en inputs de login
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin(e);
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin(e);
});

// Limpiar mensaje de error al escribir
emailInput.addEventListener('input', () => {
    if (errorMessage.textContent) {
        errorMessage.classList.add('hidden');
    }
});

passwordInput.addEventListener('input', () => {
    if (errorMessage.textContent) {
        errorMessage.classList.add('hidden');
    }
});

// Detectar tecla ESC para cerrar sesión (opcional)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appState.isAuthenticated) {
        // Puedes cambiar este comportamiento según necesites
    }
});

console.log('✅ MiParqueo App cargado');
console.log('🔗 Conectado a API en:', API_URL);
console.log('⚙️  Asegúrate de que el servidor está ejecutándose: npm start');
