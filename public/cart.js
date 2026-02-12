import { requireLogin } from "./Authentication.js";

async function loadCart() {
  const userId = requireLogin();
  if (!userId) return;

  const res = await fetch(`/cart/${userId}`);
  const items = await res.json();

  console.log("CART ITEMS:", items);

  const container = document.getElementById("cart");
  container.innerHTML = "";

  let cartTotal = 0;

  if (!items || items.length === 0) {
    container.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  items.forEach(item => {
    cartTotal += Number(item.total);

    const div = document.createElement("div");
div.innerHTML = `
  <img src="/${item.image}" class="cart-img" />
  <h3>${item.name}</h3>
  <p>Qty: ${item.quantity}</p>
  <p>Total: R${Number(item.total).toFixed(2)}</p>
`;
    const btn = document.createElement("button");
    btn.innerText = "➖ Remove one";
    btn.addEventListener("click", () => removeFromCart(item.id));

    div.appendChild(btn);
    container.appendChild(div);
  });

  //  TOTAL DISPLAY 
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `
    <hr />
    <h2>Cart Total: R${cartTotal.toFixed(2)}</h2>
  `;
  container.appendChild(totalDiv);
}

async function checkout() {
  const userId = requireLogin();
  if (!userId) return;

  console.log("CHECKOUT CLICKED");

  const res = await fetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Checkout failed");
    return;
  }

  alert(`✅ Checkout complete! Total: R${data.total}`);
  loadCart();
}

async function removeFromCart(cartItemId) {
  await fetch(`/cart/${cartItemId}`, { method: "PATCH" });
  loadCart();
}

async function addToCart(productId) {
  const userId = requireLogin();
  if (!userId) return;

  await fetch("/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId })
  });

  showCartMessage("✅ Added to cart");
}

document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!checkoutBtn) {
    console.error("Checkout button not found");
    return;
  }

  checkoutBtn.addEventListener("click", checkout);
});

loadCart();
