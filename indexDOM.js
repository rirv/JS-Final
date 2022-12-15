const consultarProductos = async () => {
  const response = await fetch("./data.json");
  const frutas = await response.json();
  return frutas;
};

const frutas = consultarProductos();
const btnCarrito = document.querySelector("#exampleModalLabel");
const botonFinalizar = document.querySelector("#botonFinalizar");
const divProductos = document.getElementById("divProductos");
const totalP = document.querySelector("#total");

consultarProductos().then((frutas) => {
  frutas.forEach((fruta) => {
    divProductos.innerHTML += `<div id=${fruta.id} class="card mb-5" style="width: 18rem;">
    <img src="${fruta.imagen}" class="card-img-top" alt="...">
    <div class="card-body">
    <h5 class="card-title">${fruta.fruta}</h5>
    <p class="card-text"> Precio ${fruta.precio}</p>
    <button id=${fruta.id} class="btn btn-primary botonesadd">Añadir</button>
    </div>
    </div>`;
  });
  comprarFruta(frutas);
});

let carritoCompra = JSON.parse(localStorage.getItem("carrito")) || [];

function comprarFruta(frutas) {
  const btnAgregar = document.querySelectorAll(".botonesadd");

  btnAgregar.forEach((boton) => {
    boton.onclick = (e) => {
      e.preventDefault();
      const productoSeleccionado = frutas.find(
        (prod) => prod.id === parseInt(boton.id)
      );
      const productoCarrito = { ...productoSeleccionado, cantidad: 1 };
      const indexCarrito = carritoCompra.findIndex(
        (prod) => prod.id === productoCarrito.id
      );
      if (indexCarrito === -1) {
        carritoCompra.push(productoCarrito);
      } else {
        carritoCompra[indexCarrito].cantidad++;
      }
      localStorage.setItem("carrito", JSON.stringify(carritoCompra));
      botonFinalizar.classList.remove("disabled");

      mostrarCarrito();
    };
  });
}

const modalBody = document.querySelector(".modal-body");

function mostrarCarrito() {
  modalBody.innerHTML = "";
  carritoCompra.forEach((item) => {
    modalBody.innerHTML += `<li><div><img src="${item.imagen}" /> ${
      item.fruta
    } x ${item.cantidad}</div> <div><p>$${
      item.cantidad * item.precio
    }</p><i class="bi bi-x-circle" style="font-size: 2rem; color: cornflowerblue;" data-id='${
      item.id
    }'></i></div> </li>`;
  });
  if (carritoCompra !== []) {
    const btnEliminar = document.querySelectorAll(".bi-x-circle");
    btnEliminar.forEach((btn) => {
      btn.onclick = (e) => {
        const productoId = e.target.getAttribute("data-id");
        carritoCompra = carritoCompra.filter((prod) => prod.id != productoId);
        localStorage.setItem("carrito", JSON.stringify(carritoCompra));

        mostrarCarrito();
      };
    });
  }

  sumaTotal();
}

mostrarCarrito();

function sumaTotal() {
  totalTotal = 0;
  carritoCompra.forEach((fruta) => {
    totalTotal += fruta.precio * fruta.cantidad;
  });

  totalP.innerHTML = `<p>El total es de: $${totalTotal}</p>`;
}

function compraFinalizada() {
  swal("Compra realizada con exito", `El total es de: $${totalTotal}`);
  carritoCompra = [];
  localStorage.setItem("carrito", JSON.stringify(carritoCompra));
  mostrarCarrito();
  chequeoCarrito();
}

botonFinalizar.addEventListener("click", compraFinalizada);

function chequeoCarrito() {
  totalTotal !== 0 ? carritoActivo() : carritoVacio();
}

chequeoCarrito();

function carritoActivo() {
  totalP.innerHTML = `El total es de: $${totalTotal}`;
  botonFinalizar.classList.remove("disabled");
}

function carritoVacio() {
  totalP.innerHTML = `El carrito esta vacio`;
  botonFinalizar.classList.add("disabled");
}
