import { logout } from "./Authentication.js";

console.log("logout.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("logoutBtn");

  if (!btn) {
    console.error("Logout button not found");
    return;
  }

  btn.addEventListener("click", () => {
    console.log("LOGOUT CLICKED");
    logout();
  });
});
