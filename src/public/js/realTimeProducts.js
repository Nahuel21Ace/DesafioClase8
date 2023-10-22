const socket = io();
const formNewProd = document.getElementById("formNewProd");
const formDeleteProd = document.getElementById("formDeleteProd");

formNewProd.addEventListener("submit", (e) => {
  e.preventDefault();
  const dataForm = new FormData(e.target);
  const prod = Object.fromEntries(dataForm);
  socket.emit("newProd", prod);
  e.target.reset();
});

formDeleteProd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idDelete = formDeleteProd.elements["idDelete"].value;
  await socket.emit("deleteProd", idDelete);
  e.target.reset();
});

socket.on("prodsData", (prods) => {
  console.log(prods);
  const showProds = document.getElementById("showProds");

  const cleanListProd = document.getElementById("listProds");
  cleanListProd.remove();

  const divListProds = document.createElement("div");
  divListProds.setAttribute("id", "listProds");

  if (prods) {
    divListProds.innerHTML = `<h2>Lista de productos</h2>`;
    prods.forEach((prod) => {
      const divProd = document.createElement("div");
      divProd.classList.add("container");
      divProd.innerHTML = `<h3>${prod.title}</h3>
      <p>Id: ${prod._id} 
      || Código: ${prod.code} 
      || Categoría: ${prod.category}
      </p>
      <p>Imagen: ${prod.thumbnail}</p>
      <p>Descripción: ${prod.description}</p>
      <p>Stock: ${prod.stock} unidades || Precio: $${prod.price}</p>`;

      divListProds.appendChild(divProd);
    });
  } else {
    divListProds.innerHTML = "<h2>No hay productos para mostrar</h2>";
  }

  showProds.appendChild(divListProds);
});

socket.emit("initialProds");