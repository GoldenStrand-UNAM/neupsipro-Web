function openLogoutModal() {
    document.getElementById("logoutModal").classList.remove("hidden");
}

function closeLogoutModal() {
    document.getElementById("logoutModal").classList.add("hidden");
}

async function logout() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No hay sesión activa");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.removeItem("token");
            alert("Sesión cerrada correctamente");
            window.location.href = "index.html";
        } else {
            alert(data.error || "Error al cerrar sesión");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
    }
}

window.openLogoutModal = openLogoutModal;
window.closeLogoutModal = closeLogoutModal;
window.logout = logout;