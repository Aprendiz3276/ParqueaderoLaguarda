// MiParqueo App - Sistema de Autenticación y Gestión
// Conectado a API con PostgreSQL/SQLite

// Detectar automáticamente la URL de la API según el entorno
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
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

async function apiAddVehicle(userId, plate, model) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plate, model })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error agregando vehículo');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function apiRegister(email, password, name) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error registrando usuario');
        }
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
        
        // Verificar que el usuario tiene rol
        if (!user || !user.role) {
            showError('Error: Usuario sin rol asignado');
            return;
        }
        
        // Login exitoso
        appState.isAuthenticated = true;
        appState.currentUser = user;
        appState.userRole = user.role;

        console.log('Login exitoso:', { email: user.email, role: user.role });

        // Mostrar dashboard correspondiente
        showDashboard(user.role);
        loginForm.reset();
        errorMessage.classList.add('hidden');
    } catch (error) {
        console.error('Error en login:', error);
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

    // Normalizar el rol (por si viene en mayúsculas o diferente formato)
    const normalizedRole = (role || '').toLowerCase().trim();

    if (normalizedRole === 'user' || normalizedRole === 'usuario') {
        // Mostrar dashboard de usuario
        userDashboard.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        userName.textContent = appState.currentUser.name || appState.currentUser.email;
        initializeUserDashboard();
    } else if (normalizedRole === 'admin' || normalizedRole === 'administrador') {
        // Mostrar dashboard de admin
        adminDashboard.classList.remove('hidden');
        userDashboard.classList.add('hidden');
        adminName.textContent = appState.currentUser.name || appState.currentUser.email;
        initializeAdminDashboard();
    } else {
        console.error('Rol desconocido:', role);
        showError('Error: Rol de usuario no reconocido');
        loginPage.classList.remove('hidden');
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

    // Event listener para agregar vehículo
    const addVehicleBtn = userDashboard.querySelector('#add-vehicle-btn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', showAddVehicleModal);
    }

    // Mostrar primera pestaña
    switchUserTab('reservations');
    
    // Actualizar vistas
    updateReservationsView();
    updateVehiclesView();
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

    // Event listener para agregar usuario
    const addUserBtn = adminDashboard.querySelector('#add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showRegisterModal);
    }

    // Mostrar primera pestaña
    switchAdminTab('admin-dashboard');
}

// Mostrar modal de registro
function showRegisterModal() {
    const name = prompt('Ingresa el nombre completo:');
    if (!name) return;
    
    const email = prompt('Ingresa el correo electrónico:');
    if (!email) return;
    
    const password = prompt('Ingresa la contraseña:');
    if (!password) return;

    handleRegister(email.trim(), password.trim(), name.trim());
}

// Manejar registro
async function handleRegister(email, password, name) {
    try {
        await apiRegister(email, password, name);
        alert('Usuario registrado exitosamente');
        // Opcional: recargar la lista de usuarios
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Actualizar vista de reservas
function updateReservationsView() {
    const reservationsContainer = document.querySelector('#reservations-tab .space-y-4');
    if (!reservationsContainer) return;

    if (appState.userReservations.length === 0) {
        reservationsContainer.innerHTML = '<p class="text-gray-600">No tienes reservas activas</p>';
        return;
    }

    reservationsContainer.innerHTML = appState.userReservations.map(res => `
        <div class="border-2 border-[#FFD600] p-4 hover:bg-yellow-50">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h4 class="text-lg uppercase tracking-wide mb-1">${res.parking_name || 'Parqueadero'}</h4>
                    <p class="text-sm text-gray-600">Vehículo: ${res.vehicle_plate || 'N/A'}</p>
                </div>
                <span class="bg-[#FFD600] text-black px-3 py-1 uppercase tracking-wide text-xs">${res.status || 'Activa'}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <p class="text-gray-600">Costo</p>
                    <p class="font-bold text-[#FFD600]">$${res.total_cost || '0'}</p>
                </div>
            </div>
            ${res.status === 'active' ? `
                <button onclick="cancelReservation(${res.id})" class="mt-4 px-4 py-2 bg-red-500 text-white border-2 border-black hover:bg-red-600 transition-all duration-200 uppercase tracking-wide text-sm">
                    Cancelar
                </button>
            ` : ''}
        </div>
    `).join('');
}

// Actualizar vista de vehículos
function updateVehiclesView() {
    const vehiclesContainer = document.querySelector('#vehicles-tab .space-y-4');
    if (!vehiclesContainer) return;

    if (appState.userVehicles.length === 0) {
        vehiclesContainer.innerHTML = '<p class="text-gray-600">No tienes vehículos registrados</p>';
        return;
    }

    vehiclesContainer.innerHTML = appState.userVehicles.map(vehicle => `
        <div class="border-2 border-black p-4 hover:shadow-[8px_8px_0px_0px_#FFD600]">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="text-lg uppercase tracking-wide mb-2">${vehicle.model || 'Vehículo'}</h4>
                    <p class="text-gray-600 mb-2">Placa: ${vehicle.plate || 'N/A'}</p>
                </div>
                <button onclick="deleteVehicle(${vehicle.id})" class="text-red-500 hover:text-red-700 transition-colors text-sm uppercase tracking-wide">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Mostrar modal para agregar vehículo
function showAddVehicleModal() {
    const plate = prompt('Ingresa la placa del vehículo:');
    if (!plate) return;
    
    const model = prompt('Ingresa el modelo del vehículo:');
    if (!model) return;

    handleAddVehicle(plate.trim(), model.trim());
}

// Manejar agregar vehículo
async function handleAddVehicle(plate, model) {
    try {
        await apiAddVehicle(appState.currentUser.id, plate, model);
        // Recargar vehículos
        appState.userVehicles = await apiGetUserVehicles(appState.currentUser.id);
        updateVehiclesView();
        alert('Vehículo agregado exitosamente');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Eliminar vehículo
async function deleteVehicle(vehicleId) {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${vehicleId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error eliminando vehículo');
        
        // Recargar vehículos
        appState.userVehicles = await apiGetUserVehicles(appState.currentUser.id);
        updateVehiclesView();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Hacer funciones globales para onclick
window.cancelReservation = cancelReservation;
window.deleteVehicle = deleteVehicle;

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

    // Actualizar botones activos y línea amarilla
    const allTabButtons = userDashboard.querySelectorAll('.tab-btn');
    allTabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
            btn.classList.remove('text-gray-600');
            btn.classList.add('text-black');
            btn.classList.remove('border-transparent');
            btn.classList.add('border-[#FFD600]');
        } else {
            btn.classList.remove('active');
            btn.classList.add('text-gray-600');
            btn.classList.remove('text-black');
            btn.classList.add('border-transparent');
            btn.classList.remove('border-[#FFD600]');
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

    // Actualizar botones activos y línea amarilla
    const allTabButtons = adminDashboard.querySelectorAll('.admin-tab-btn');
    allTabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
            btn.classList.remove('text-gray-600');
            btn.classList.add('text-black');
            btn.classList.remove('border-transparent');
            btn.classList.add('border-[#FFD600]');
        } else {
            btn.classList.remove('active');
            btn.classList.add('text-gray-600');
            btn.classList.remove('text-black');
            btn.classList.add('border-transparent');
            btn.classList.remove('border-[#FFD600]');
        }
    });
}

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtnUser.addEventListener('click', logout);
logoutBtnAdmin.addEventListener('click', logout);

// Event listener para botón de registro
const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        showRegisterModal();
    });
}

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
