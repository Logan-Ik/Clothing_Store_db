fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("products");

    products.forEach(product => {
      container.innerHTML += `
        <div class="product">
          <img src="${product.image}" width="150">
          <h3>${product.name}</h3>
          <p>R${product.price}</p>
        </div>
      `;
    });
  });
