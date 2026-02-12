import { requireLogin, getCurrentUser } from "./Authentication.js";

let allProducts = [];

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
    setupModal();
    setupProductClicks();
    showUser();
    loadProducts();
    console.log("app.js loaded");
});

/* ---------- USER ---------- */
async function showUser() {
    const user = await getCurrentUser();
    if (!user) return;

    document.getElementById("user-info").innerText =
        `Signed in as ${user.username}`;
}

/* ---------- PRODUCTS ---------- */
async function loadProducts() {
    const res = await fetch("/products");
    allProducts = await res.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    allProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${product.image}" class="product-img" />
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">R${Number(product.price).toFixed(2)}</p>
        `;

        const btn = document.createElement("button");
        btn.innerText = "Add to cart";

        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent modal
            addToCart(product.id);
        });

        card.appendChild(btn);
        container.appendChild(card);
    });
}

/* ---------- SIMILAR PRODUCTS ---------- */
function showSimilarProducts(product) {
    const container = document.getElementById("similarProducts");
    container.innerHTML = "";

    const similar = getSimilarProducts(product);

    if (similar.length === 0) {
        container.innerHTML = "<p>No similar products found.</p>";
    }

    similar.forEach(item => {
        const div = document.createElement("div");
        div.className = "similar-card";

        div.innerHTML = `
            <img src="${item.image}" />
            <div>
                <strong>${item.name}</strong>
                <p>R${Number(item.price).toFixed(2)}</p>
                <button>Add to cart</button>
            </div>
        `;

        div.querySelector("button").addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(item.id);
        });

        container.appendChild(div);
    });

    document.getElementById("similarModal").classList.remove("hidden");
}

function getSimilarProducts(product) {
    const keywords = product.name.toLowerCase().split(" ");

    return allProducts.filter(p =>
        p.id !== product.id &&
        keywords.some(word => p.name.toLowerCase().includes(word))
    ).slice(0, 3);
}

/* ---------- CART ---------- */
async function addToCart(productId) {
    const userId = requireLogin();
    if (!userId) return;

    await fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId })
    });

    showCartMessage("Item added to cart!");
}

function showCartMessage(text) {
    const msg = document.getElementById("cart-message");
    msg.innerText = text;
    msg.style.opacity = "1";

    setTimeout(() => {
        msg.style.opacity = "0";
    }, 1500);
}

/* ---------- UI HELPERS ---------- */
function setupModal() {
    const modal = document.getElementById("similarModal");
    const closeBtn = document.getElementById("closeModal");

    modal.classList.add("hidden");

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

function setupProductClicks() {
    document.getElementById("products").addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (!card) return;

        const cards = [...document.querySelectorAll("#products .card")];
        const index = cards.indexOf(card);
        const product = allProducts[index];

        showSimilarProducts(product);
    });
}
