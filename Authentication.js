export function getUserId() {
    return localStorage.getItem("userId");
}

export function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username"); // safe even if unused
    window.location.href = "/login.html";
}

export function requireLogin() {
    const userId = getUserId();
    if (!userId) {
        window.location.href = "/login.html";
        return null;
    }
    return userId;
}

export async function getCurrentUser() {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;

    const res = await fetch(`/me/${userId}`);
    if (!res.ok) return null;

    return res.json(); // { username }
}
