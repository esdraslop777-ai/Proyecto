// ========================================
// SISTEMA BELLANOVA
// MÓDULO DE PRODUCTOS
// ========================================


// Array donde se guardarán los productos

let productos = [];


// Producto que se está editando

let indiceEdicion = -1;


// ========================================
// INICIAR SISTEMA
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    cargarProductos();

    mostrarProductos();


    const formulario =
        document.getElementById("formProducto");


    if (formulario) {

        formulario.addEventListener(
            "submit",
            guardarProducto
        );

    }

});


// ========================================
// GUARDAR PRODUCTO
// ========================================

function guardarProducto(event) {

    event.preventDefault();


    const codigo =
        document.getElementById("codigo").value.trim();


    const nombre =
        document.getElementById("nombre").value.trim();


    const categoria =
        document.getElementById("categoria").value;


    const precio =
        parseFloat(
            document.getElementById("precio").value
        );


    const stock =
        parseInt(
            document.getElementById("stock").value
        );


    const imagenInput =
        document.getElementById("imagen");


    // Validar datos

    if (
        codigo === "" ||
        nombre === "" ||
        categoria === "" ||
        isNaN(precio) ||
        isNaN(stock)
    ) {

        alert(
            "Por favor complete todos los campos."
        );

        return;

    }


    // Comprobar código repetido

    if (indiceEdicion === -1) {

        const existe =
            productos.some(
                producto =>
                    producto.codigo.toLowerCase() ===
                    codigo.toLowerCase()
            );


        if (existe) {

            alert(
                "Ya existe un producto con ese código."
            );

            return;

        }

    }


    // Crear producto

    const producto = {

        codigo: codigo,

        nombre: nombre,

        categoria: categoria,

        precio: precio,

        stock: stock,

        imagen: ""

    };


    // Leer imagen

    if (
        imagenInput.files &&
        imagenInput.files.length > 0
    ) {

        const archivo =
            imagenInput.files[0];


        const lector =
            new FileReader();


        lector.onload = function () {

            producto.imagen =
                lector.result;


            finalizarGuardado(producto);

        };


        lector.readAsDataURL(archivo);

    } else {

        // Si estamos editando
        // conservar imagen anterior

        if (indiceEdicion !== -1) {

            producto.imagen =
                productos[indiceEdicion].imagen;

        }


        finalizarGuardado(producto);

    }

}


// ========================================
// FINALIZAR GUARDADO
// ========================================

function finalizarGuardado(producto) {


    if (indiceEdicion === -1) {

        productos.push(producto);

        alert(
            "✅ Producto registrado correctamente."
        );

    } else {

        productos[indiceEdicion] =
            producto;

        alert(
            "✅ Producto actualizado correctamente."
        );

        indiceEdicion = -1;

    }


    guardarEnMemoria();

    mostrarProductos();

    limpiarFormulario();

}


// ========================================
// MOSTRAR PRODUCTOS
// ========================================

function mostrarProductos(
    lista = productos
) {


    const contenedor =
        document.getElementById(
            "listaProductos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


    if (lista.length === 0) {

        contenedor.innerHTML = `

            <div class="sin-productos">

                <h3>📦 No hay productos registrados</h3>

                <p>
                    Registre su primer producto
                    usando el formulario.
                </p>

            </div>

        `;

        return;

    }


    lista.forEach(
        (producto, indice) => {


            const tarjeta =
                document.createElement("div");


            tarjeta.className =
                "producto-card";


            let imagenHTML = "";


            if (producto.imagen) {

                imagenHTML = `

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        class="producto-imagen">

                `;

            } else {

                imagenHTML = `

                    <div class="producto-sin-imagen">
                        💄
                    </div>

                `;

            }


            tarjeta.innerHTML = `

                ${imagenHTML}


                <div class="producto-info">

                    <span class="categoria">
                        ${producto.categoria}
                    </span>


                    <h3>
                        ${producto.nombre}
                    </h3>


                    <p>
                        <strong>Código:</strong>
                        ${producto.codigo}
                    </p>


                    <p class="precio">
                        L. ${producto.precio.toFixed(2)}
                    </p>


                    <p>
                        <strong>Stock:</strong>
                        ${producto.stock}
                    </p>


                    <div class="acciones">
               <button class="boton-carrito" onclick="agregarAlCarrito(${indice})" style="background-color:#007bff; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; width:100%; margin-bottom:5px; font-weight:bold; display:block;">
    🛒 Añadir al carrito
</button>

               <button class="solo-admin" onclick="editarProducto(${indice})">
    ✏️ Editar
</button>

<button class="solo-admin" onclick="eliminarProducto(${indice})">
    🗑️ Eliminar
</button>
                    </div>

                </div>

            `;


            contenedor.appendChild(tarjeta);

        }
    );

}


// ========================================
// EDITAR PRODUCTO
// ========================================

function editarProducto(indice) {


    const producto =
        productos[indice];


    document.getElementById("codigo").value =
        producto.codigo;


    document.getElementById("nombre").value =
        producto.nombre;


    document.getElementById("categoria").value =
        producto.categoria;


    document.getElementById("precio").value =
        producto.precio;


    document.getElementById("stock").value =
        producto.stock;


    indiceEdicion = indice;


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// ELIMINAR PRODUCTO
// ========================================

function eliminarProducto(indice) {


    const producto =
        productos[indice];


    const confirmar =
        confirm(
            "¿Está seguro de eliminar el producto " +
            producto.nombre +
            "?"
        );


    if (!confirmar) {

        return;

    }


    productos.splice(indice, 1);


    guardarEnMemoria();

    mostrarProductos();


    alert(
        "Producto eliminado correctamente."
    );

}


// ========================================
// BUSCAR PRODUCTO
// ========================================

function buscarProducto() {


    const texto =
        document.getElementById(
            "buscarProducto"
        ).value.toLowerCase();


    const resultados =
        productos.filter(
            producto =>

                producto.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.codigo
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.categoria
                    .toLowerCase()
                    .includes(texto)
        );


    mostrarProductos(resultados);

}


// ========================================
// LIMPIAR FORMULARIO
// ========================================

function limpiarFormulario() {


    const formulario =
        document.getElementById(
            "formProducto"
        );


    if (formulario) {

        formulario.reset();

    }


    indiceEdicion = -1;

}


// ========================================
// GUARDAR EN LOCALSTORAGE
// ========================================

function guardarEnMemoria() {


    localStorage.setItem(
        "productosBellanova",
        JSON.stringify(productos)
    );

}


// ========================================
// CARGAR PRODUCTOS
// ========================================

function cargarProductos() {


    const datos =
        localStorage.getItem(
            "productosBellanova"
        );


    if (datos) {

        productos =
            JSON.parse(datos);

    }

}
// ========================================
// MÓDULO DE CLIENTES - BELLANOVA
// ========================================

let clientes = [];

let indiceClienteEdicion = -1;


// ========================================
// CARGAR CLIENTES
// ========================================

function cargarClientes() {

    const datos =
        localStorage.getItem("clientesBellanova");

    if (datos) {

        clientes = JSON.parse(datos);

    }

}


// ========================================
// GUARDAR CLIENTES
// ========================================

function guardarClientes() {

    localStorage.setItem(
        "clientesBellanova",
        JSON.stringify(clientes)
    );

}


// ========================================
// INICIAR CLIENTES
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarClientes();

        mostrarClientes();


        const formulario =
            document.getElementById("formCliente");


        if (formulario) {

            formulario.addEventListener(
                "submit",
                guardarCliente
            );

        }

    }
);


// ========================================
// GUARDAR CLIENTE
// ========================================

function guardarCliente(event) {

    event.preventDefault();


    const identidad =
        document
            .getElementById("identidad")
            .value
            .trim();


    const nombre =
        document
            .getElementById("nombreCliente")
            .value
            .trim();


    const telefono =
        document
            .getElementById("telefono")
            .value
            .trim();


    const correo =
        document
            .getElementById("correo")
            .value
            .trim();


    const direccion =
        document
            .getElementById("direccion")
            .value
            .trim();


    if (
        identidad === "" ||
        nombre === ""
    ) {

        alert(
            "Ingrese la identidad y el nombre del cliente."
        );

        return;

    }


    // Comprobar identidad repetida

    if (indiceClienteEdicion === -1) {

        const existe =
            clientes.some(
                cliente =>
                    cliente.identidad.toLowerCase() ===
                    identidad.toLowerCase()
            );


        if (existe) {

            alert(
                "Ya existe un cliente con esa identidad."
            );

            return;

        }

    }


    const cliente = {

        identidad: identidad,

        nombre: nombre,

        telefono: telefono,

        correo: correo,

        direccion: direccion

    };


    if (indiceClienteEdicion === -1) {

        clientes.push(cliente);

        alert(
            "✅ Cliente registrado correctamente."
        );

    } else {

        clientes[indiceClienteEdicion] =
            cliente;

        alert(
            "✅ Cliente actualizado correctamente."
        );

        indiceClienteEdicion = -1;

    }


    guardarClientes();

    mostrarClientes();

    limpiarCliente();

}


// ========================================
// MOSTRAR CLIENTES
// ========================================

function mostrarClientes(
    lista = clientes
) {

    const tabla =
        document.getElementById(
            "tablaClientes"
        );


    if (!tabla) {

        return;

    }


    tabla.innerHTML = "";


    if (lista.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="6">

                    No hay clientes registrados.

                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        (cliente, indice) => {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${cliente.identidad}
                </td>

                <td>
                    ${cliente.nombre}
                </td>

                <td>
                    ${cliente.telefono || "-"}
                </td>

                <td>
                    ${cliente.correo || "-"}
                </td>

                <td>
                    ${cliente.direccion || "-"}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarCliente(${indice})">

                        ✏️ Editar

                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarCliente(${indice})">

                        🗑️ Eliminar

                    </button>

                </td>

            `;


            tabla.appendChild(fila);

        }
    );

}


// ========================================
// EDITAR CLIENTE
// ========================================

function editarCliente(indice) {

    const cliente =
        clientes[indice];


    document.getElementById(
        "identidad"
    ).value = cliente.identidad;


    document.getElementById(
        "nombreCliente"
    ).value = cliente.nombre;


    document.getElementById(
        "telefono"
    ).value = cliente.telefono;


    document.getElementById(
        "correo"
    ).value = cliente.correo;


    document.getElementById(
        "direccion"
    ).value = cliente.direccion;


    indiceClienteEdicion =
        indice;


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// ELIMINAR CLIENTE
// ========================================

function eliminarCliente(indice) {

    const cliente =
        clientes[indice];


    const confirmar =
        confirm(
            "¿Desea eliminar al cliente " +
            cliente.nombre +
            "?"
        );


    if (!confirmar) {

        return;

    }


    clientes.splice(indice, 1);


    guardarClientes();

    mostrarClientes();


    alert(
        "Cliente eliminado correctamente."
    );

}


// ========================================
// BUSCAR CLIENTE
// ========================================

function buscarCliente() {

    const texto =
        document
            .getElementById("buscarCliente")
            .value
            .toLowerCase();


    const resultados =
        clientes.filter(
            cliente =>

                cliente.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                cliente.identidad
                    .toLowerCase()
                    .includes(texto)

                ||

                cliente.telefono
                    .toLowerCase()
                    .includes(texto)
        );


    mostrarClientes(resultados);

}


// ========================================
// LIMPIAR FORMULARIO CLIENTE
// ========================================

function limpiarCliente() {

    const formulario =
        document.getElementById(
            "formCliente"
        );


    if (formulario) {

        formulario.reset();

    }


    indiceClienteEdicion = -1;

}
// ========================================
// MÓDULO DE FACTURACIÓN - BELLANOVA
// ========================================

let detalleFactura = [];


// ========================================
// INICIAR FACTURACIÓN
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        iniciarFacturacion();

        // Revisar si viene del carrito (autoFill)
        if (window.location.search.includes("autoFill=true")) {
            const carritoGuardado = localStorage.getItem("carritoBellanova");
            if (carritoGuardado) {
                const carritoItems = JSON.parse(carritoGuardado);
                if (carritoItems.length > 0) {
                    carritoItems.forEach(item => {
                        detalleFactura.push({
                            codigo: item.codigo,
                            nombre: item.nombre,
                            precio: Number(item.precio),
                            cantidad: item.cantidad,
                            subtotal: item.cantidad * Number(item.precio)
                        });
                    });
                    
                    // Limpiar carrito después de pasarlo a facturación
                    localStorage.setItem("carritoBellanova", JSON.stringify([]));
                    if (typeof carritoGlobal !== 'undefined') carritoGlobal = [];
                    
                    setTimeout(() => {
                        mostrarDetalleFactura();
                        calcularTotales();
                        if (typeof actualizarCarritoGlobal === 'function') {
                            actualizarCarritoGlobal();
                        }
                    }, 200);
                }
            }
        }

    }
);


function iniciarFacturacion() {

    const numero =
        document.getElementById(
            "numeroFactura"
        );

    if (!numero) {

        return;

    }


    numero.value =
        generarNumeroFactura();


    const fecha =
        document.getElementById(
            "fechaFactura"
        );


    const hoy =
        new Date();


    fecha.value =
        hoy.toISOString().split("T")[0];


    cargarClientesFactura();

    cargarProductosFactura();

}


// ========================================
// GENERAR NÚMERO DE FACTURA
// ========================================

function generarNumeroFactura() {

    let facturas =
        JSON.parse(
            localStorage.getItem(
                "facturasBellanova"
            )
        ) || [];


    let numero =
        facturas.length + 1;


    return "FAC-" +
        String(numero).padStart(4, "0");

}


// ========================================
// CARGAR CLIENTES
// ========================================

function cargarClientesFactura() {

    const select =
        document.getElementById(
            "clienteFactura"
        );


    if (!select) {

        return;

    }


    const clientes =
        JSON.parse(
            localStorage.getItem(
                "clientesBellanova"
            )
        ) || [];


    select.innerHTML = `

        <option value="">
            Seleccione un cliente
        </option>

    `;


    clientes.forEach(
        (cliente, indice) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value = indice;


            option.textContent =
                cliente.nombre +
                " - " +
                cliente.identidad;


            select.appendChild(option);

        }
    );

}


// ========================================
// CARGAR PRODUCTOS
// ========================================

function cargarProductosFactura() {

    const select =
        document.getElementById(
            "productoFactura"
        );


    if (!select) {

        return;

    }


    const productos =
        JSON.parse(
            localStorage.getItem(
                "productosBellanova"
            )
        ) || [];


    select.innerHTML = `

        <option value="">
            Seleccione un producto
        </option>

    `;


    productos.forEach(
        (producto, indice) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value = indice;


            option.textContent =
                producto.nombre +
                " | L. " +
                Number(producto.precio)
                    .toFixed(2) +
                " | Stock: " +
                producto.stock;


            select.appendChild(option);

        }
    );

}


// ========================================
// AGREGAR PRODUCTO
// ========================================

function agregarProductoFactura() {

    const select =
        document.getElementById(
            "productoFactura"
        );


    const cantidad =
        parseInt(
            document.getElementById(
                "cantidadFactura"
            ).value
        );


    if (select.value === "") {

        alert(
            "Seleccione un producto."
        );

        return;

    }


    if (
        isNaN(cantidad) ||
        cantidad <= 0
    ) {

        alert(
            "Ingrese una cantidad válida."
        );

        return;

    }


    const productos =
        JSON.parse(
            localStorage.getItem(
                "productosBellanova"
            )
        ) || [];


    const producto =
        productos[
            parseInt(select.value)
        ];


    if (!producto) {

        alert(
            "No se encontró el producto."
        );

        return;

    }


    if (cantidad > producto.stock) {

        alert(
            "No hay suficiente stock. " +
            "Stock disponible: " +
            producto.stock
        );

        return;

    }


    // Comprobar si ya existe

    const existente =
        detalleFactura.find(
            item =>
                item.codigo ===
                producto.codigo
        );


    if (existente) {

        if (
            existente.cantidad +
            cantidad >
            producto.stock
        ) {

            alert(
                "La cantidad supera el stock disponible."
            );

            return;

        }


        existente.cantidad += cantidad;


        existente.subtotal =
            existente.cantidad *
            existente.precio;

    } else {

        detalleFactura.push({

            codigo: producto.codigo,

            nombre: producto.nombre,

            precio: Number(producto.precio),

            cantidad: cantidad,

            subtotal:
                cantidad *
                Number(producto.precio)

        });

    }


    mostrarDetalleFactura();

    calcularTotales();

}


// ========================================
// MOSTRAR DETALLE
// ========================================

function mostrarDetalleFactura() {

    const tabla =
        document.getElementById(
            "detalleFactura"
        );


    if (!tabla) {

        return;

    }


    tabla.innerHTML = "";


    if (detalleFactura.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="6">

                    No hay productos en la factura.

                </td>

            </tr>

        `;

        return;

    }


    detalleFactura.forEach(
        (item, indice) => {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${item.codigo}
                </td>

                <td>
                    ${item.nombre}
                </td>

                <td>
                    ${item.cantidad}
                </td>

                <td>
                    L. ${item.precio.toFixed(2)}
                </td>

                <td>
                    L. ${item.subtotal.toFixed(2)}
                </td>

                <td>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarProductoFactura(${indice})">

                        🗑️

                    </button>

                </td>

            `;


            tabla.appendChild(fila);

        }
    );

}


// ========================================
// ELIMINAR PRODUCTO DE FACTURA
// ========================================

function eliminarProductoFactura(indice) {

    detalleFactura.splice(
        indice,
        1
    );


    mostrarDetalleFactura();

    calcularTotales();

}


// ========================================
// CALCULAR TOTALES
// ========================================

function calcularTotales() {

    let subtotal = 0;


    detalleFactura.forEach(
        item => {

            subtotal +=
                item.subtotal;

        }
    );


    const impuesto =
        subtotal * 0.15;


    const total =
        subtotal + impuesto;


    const campoSubtotal =
        document.getElementById(
            "subtotalFactura"
        );


    const campoImpuesto =
        document.getElementById(
            "impuestoFactura"
        );


    const campoTotal =
        document.getElementById(
            "totalFactura"
        );


    if (campoSubtotal) {

        campoSubtotal.textContent =
            "L. " +
            subtotal.toFixed(2);

    }


    if (campoImpuesto) {

        campoImpuesto.textContent =
            "L. " +
            impuesto.toFixed(2);

    }


    if (campoTotal) {

        campoTotal.textContent =
            "L. " +
            total.toFixed(2);

    }


    return {

        subtotal: subtotal,

        impuesto: impuesto,

        total: total

    };

}


// ========================================
// GUARDAR FACTURA
// ========================================

function guardarFactura() {

    const clienteSelect =
        document.getElementById(
            "clienteFactura"
        );


    if (!clienteSelect ||
        clienteSelect.value === "") {

        alert(
            "Seleccione un cliente."
        );

        return;

    }


    if (detalleFactura.length === 0) {

        alert(
            "Agregue al menos un producto."
        );

        return;

    }


    const clientes =
        JSON.parse(
            localStorage.getItem(
                "clientesBellanova"
            )
        ) || [];


    const cliente =
        clientes[
            parseInt(clienteSelect.value)
        ];


    const totales =
        calcularTotales();


    const numero =
        document.getElementById(
            "numeroFactura"
        ).value;


    const fecha =
        document.getElementById(
            "fechaFactura"
        ).value;

const usuarioActual = obtenerUsuarioActual();
    const factura = {

        numero: numero,

        fecha: fecha,
usuario: usuarioActual ? usuarioActual.usuario : "Sin usuario",
        cliente: {

            identidad:
                cliente.identidad,

            nombre:
                cliente.nombre,

            telefono:
                cliente.telefono,

            correo:
                cliente.correo,

            direccion:
                cliente.direccion

        },

        productos:
            JSON.parse(
                JSON.stringify(
                    detalleFactura
                )
            ),

        subtotal:
            totales.subtotal,

        impuesto:
            totales.impuesto,

        total:
            totales.total

    };


    let facturas =
        JSON.parse(
            localStorage.getItem(
                "facturasBellanova"
            )
        ) || [];


    facturas.push(factura);


    localStorage.setItem(
        "facturasBellanova",
        JSON.stringify(facturas)
    );


    // Actualizar inventario

    actualizarStock();


    alert(
        "✅ Factura " +
        numero +
        " guardada correctamente."
    );


    detalleFactura = [];

    mostrarDetalleFactura();

    calcularTotales();


    // Preparar una nueva factura

    document.getElementById(
        "numeroFactura"
    ).value =
        generarNumeroFactura();


    document.getElementById(
        "clienteFactura"
    ).value = "";

}


// ========================================
// ACTUALIZAR STOCK
// ========================================

function actualizarStock() {

    let productos =
        JSON.parse(
            localStorage.getItem(
                "productosBellanova"
            )
        ) || [];


    detalleFactura.forEach(
        item => {

            const producto =
                productos.find(
                    producto =>
                        producto.codigo ===
                        item.codigo
                );


            if (producto) {

                producto.stock -=
                    item.cantidad;

            }

        }
    );


    localStorage.setItem(
        "productosBellanova",
        JSON.stringify(productos)
    );

}


// ========================================
// NUEVA FACTURA
// ========================================

function nuevaFactura() {

    const confirmar =
        confirm(
            "¿Desea comenzar una nueva factura? " +
            "Se perderá el detalle actual."
        );


    if (!confirmar) {

        return;

    }


    detalleFactura = [];


    mostrarDetalleFactura();

    calcularTotales();


    document.getElementById(
        "clienteFactura"
    ).value = "";


    document.getElementById(
        "cantidadFactura"
    ).value = 1;


    document.getElementById(
        "productoFactura"
    ).value = "";


    document.getElementById(
        "numeroFactura"
    ).value =
        generarNumeroFactura();

}


// ========================================
// IMPRIMIR FACTURA
// ========================================

function imprimirFactura() {

    if (detalleFactura.length === 0) {

        alert(
            "No hay productos para imprimir."
        );

        return;

    }


    window.print();

}
// ==========================================
// HISTORIAL DE FACTURAS - BELLANOVA
// ==========================================

let facturasHistorial = [];


// CARGAR FACTURAS
function cargarFacturasHistorial() {

    const datos = localStorage.getItem("facturasBellanova");

    if (datos) {

        facturasHistorial = JSON.parse(datos);

    } else {

        facturasHistorial = [];

    }
}


// MOSTRAR FACTURAS
function mostrarFacturasHistorial(lista = facturasHistorial) {

    const tabla = document.getElementById("tablaFacturas");
    const sinFacturas = document.getElementById("sinFacturas");

    if (!tabla) return;

    tabla.innerHTML = "";

    if (lista.length === 0) {

        sinFacturas.style.display = "block";

        return;

    }

    sinFacturas.style.display = "none";


    lista.forEach((factura, indice) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `

            <td>
                <strong>${factura.numero}</strong>
            </td>

            <td>
                ${factura.cliente.nombre}
            </td>

            <td>
                ${factura.fecha}
            </td>

            <td>
                L. ${Number(factura.subtotal).toFixed(2)}
            </td>

            <td>
                L. ${Number(factura.impuesto).toFixed(2)}
            </td>

            <td>
                <strong>
                    L. ${Number(factura.total).toFixed(2)}
                </strong>
            </td>

            <td>

                <button
                    class="btn-editar"
                    onclick="verFactura(${indice})">
                    👁️ Ver
                </button>

                <button
                    class="btn-eliminar"
                    onclick="imprimirFacturaHistorial(${indice})">
                    🖨️ Imprimir
                </button>
                

            </td>

        `;

        tabla.appendChild(fila);

    });

}


// BUSCAR FACTURA
function buscarFactura() {

    const texto = document
        .getElementById("buscarFactura")
        .value
        .toLowerCase();

    const resultados = facturasHistorial.filter(factura => {

        return (
            factura.numero.toLowerCase().includes(texto) ||
            factura.cliente.nombre.toLowerCase().includes(texto)
        );

    });

    mostrarFacturasHistorial(resultados);

}


// VER FACTURA
function verFactura(indice) {

    const factura = facturasHistorial[indice];

    if (!factura) return;


    let productosTexto = "";

    factura.productos.forEach(producto => {

        productosTexto +=
            `${producto.nombre} | ` +
            `Cantidad: ${producto.cantidad} | ` +
            `Precio: L. ${Number(producto.precio).toFixed(2)} | ` +
            `Subtotal: L. ${Number(producto.subtotal).toFixed(2)}\n`;

    });


    alert(

        "========== BELLANOVA ==========\n\n" +

        "FACTURA: " + factura.numero + "\n" +

        "Fecha: " + factura.fecha + "\n\n" +

        "CLIENTE\n" +
        "Nombre: " + factura.cliente.nombre + "\n" +
        "Identidad: " + factura.cliente.identidad + "\n" +
        "Teléfono: " + factura.cliente.telefono + "\n\n" +

        "PRODUCTOS\n" +
        "------------------------------\n" +

        productosTexto +

        "\n------------------------------\n" +

        "Subtotal: L. " +
        Number(factura.subtotal).toFixed(2) + "\n" +

        "Impuesto: L. " +
        Number(factura.impuesto).toFixed(2) + "\n" +

        "TOTAL: L. " +
        Number(factura.total).toFixed(2)

    );

}


// IMPRIMIR FACTURA DEL HISTORIAL
function imprimirFacturaHistorial(indice) {

    const factura = facturasHistorial[indice];

    if (!factura) return;


    let contenido = `

        <html>

        <head>

            <title>${factura.numero}</title>

            <style>

                body {
                    font-family: Arial;
                    padding: 30px;
                }

                h1 {
                    text-align: center;
                }

                .encabezado {
                    text-align: center;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #999;
                    padding: 8px;
                    text-align: center;
                }

                .totales {
                    margin-top: 20px;
                    text-align: right;
                }

            </style>

        </head>

        <body>

            <div class="encabezado">

                <h1>BELLANOVA</h1>

                <h3>Tienda de Cosméticos</h3>

                <p>
                    Factura: <strong>${factura.numero}</strong>
                </p>

                <p>
                    Fecha: ${factura.fecha}
                </p>

            </div>


            <hr>


            <h3>Datos del cliente</h3>

            <p>
                Nombre: ${factura.cliente.nombre}
            </p>

            <p>
                Identidad: ${factura.cliente.identidad}
            </p>

            <p>
                Teléfono: ${factura.cliente.telefono}
            </p>


            <table>

                <thead>

                    <tr>

                        <th>Código</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>

                    </tr>

                </thead>

                <tbody>
    `;


    factura.productos.forEach(producto => {

        contenido += `

            <tr>

                <td>${producto.codigo}</td>

                <td>${producto.nombre}</td>

                <td>${producto.cantidad}</td>

                <td>
                    L. ${Number(producto.precio).toFixed(2)}
                </td>

                <td>
                    L. ${Number(producto.subtotal).toFixed(2)}
                </td>

            </tr>

        `;

    });


    contenido += `

                </tbody>

            </table>


            <div class="totales">

                <p>
                    Subtotal:
                    L. ${Number(factura.subtotal).toFixed(2)}
                </p>

                <p>
                    Impuesto:
                    L. ${Number(factura.impuesto).toFixed(2)}
                </p>

                <h2>
                    Total:
                    L. ${Number(factura.total).toFixed(2)}
                </h2>

            </div>


            <hr>

            <p style="text-align:center;">
                Gracias por comprar en BELLANOVA
            </p>


        </body>

        </html>

    `;


    const ventana = window.open(
        "",
        "_blank",
        "width=900,height=700"
    );


    ventana.document.write(contenido);

    ventana.document.close();

    ventana.focus();

    ventana.print();

}


// INICIAR HISTORIAL
document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("tablaFacturas")) {

        cargarFacturasHistorial();

        mostrarFacturasHistorial();

    }

});
// ==========================================
// LOGIN BELLANOVA
// ==========================================

const usuariosBellanova = [

    {
        usuario: "admin",
        clave: "admin123",
        rol: "Administrador"
    },

    {
        usuario: "vendedor",
        clave: "venta123",
        rol: "Vendedor"
    }

];


// LOGIN
document.addEventListener("DOMContentLoaded", function () {

    const formularioLogin =
        document.getElementById("formLogin");

    if (!formularioLogin) return;


    formularioLogin.addEventListener("submit", function (event) {

        event.preventDefault();


        const usuario =
            document.getElementById("usuario").value.trim();

        const clave =
            document.getElementById("clave").value;


        const mensaje =
            document.getElementById("mensajeLogin");


        const usuarioEncontrado =
            usuariosBellanova.find(function (u) {

                return u.usuario === usuario &&
                       u.clave === clave;

            });


        if (!usuarioEncontrado) {

            mensaje.textContent =
                "❌ Usuario o contraseña incorrectos.";

            mensaje.className =
                "mensaje-login error";

            return;
        }


        // Guardar sesión
        localStorage.setItem(
            "usuarioBellanova",
            JSON.stringify(usuarioEncontrado)
        );


        mensaje.textContent =
            "✅ Acceso correcto. Entrando...";

        mensaje.className =
            "mensaje-login correcto";


        setTimeout(function () {

            window.location.href = "index.html";

        }, 700);

    });

});
// ==========================================
// CERRAR SESIÓN
// ==========================================

function cerrarSesion() {

    const confirmar = confirm(
        "¿Desea cerrar la sesión?"
    );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem("usuarioBellanova");

    window.location.href = "login.html";
}
// ==========================================
// CONTROL DE ACCESO
// ==========================================

function obtenerUsuarioActual() {

    const usuarioGuardado =
        localStorage.getItem("usuarioBellanova");

    if (!usuarioGuardado) {
        return null;
    }

    return JSON.parse(usuarioGuardado);
}


function protegerPagina() {

    const usuario = obtenerUsuarioActual();

    const pagina =
        window.location.pathname
            .split("/")
            .pop();


    // LOGIN NO NECESITA PROTECCIÓN
    if (pagina === "login.html" || pagina === "") {
        return;
    }


    // Si no hay sesión
    if (!usuario) {

        window.location.href = "login.html";

        return;
    }


    // VENDEDOR
   if (usuario.rol === "Vendedor") {
    const paginasPermitidas = [
        "index.html",
        "productos.html",
        "facturacion.html",
        "cierre-caja.html"
    ];

    if (!paginasPermitidas.includes(pagina)) {
        alert(
            "Acceso restringido. " +
            "El vendedor solo puede consultar productos, realizar ventas y hacer cierre de caja."
        );

        window.location.href = "facturacion.html";
    }
}
}


// Ejecutar control de acceso
document.addEventListener(
    "DOMContentLoaded",
    function () {

        protegerPagina();

    }
);
document.addEventListener("DOMContentLoaded", function () {

    protegerPagina();
    aplicarPermisosMenu();

});
function cargarCierreCaja() {

    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    const facturas = JSON.parse(
        localStorage.getItem("facturasBellanova")
    ) || [];

    const hoy = new Date().toISOString().split("T")[0];

    let facturasTurno = facturas.filter(function(factura) {

        return factura.fecha === hoy &&
               factura.usuario === usuario.usuario;

    });

    let subtotal = 0;
    let impuesto = 0;
    let total = 0;

    facturasTurno.forEach(function(factura) {

        subtotal += Number(factura.subtotal) || 0;
        impuesto += Number(factura.impuesto) || 0;
        total += Number(factura.total) || 0;

    });

    document.getElementById("usuarioCaja").textContent =
        usuario.usuario;

    document.getElementById("fechaCaja").textContent =
        hoy;

    document.getElementById("cantidadFacturas").textContent =
        facturasTurno.length;

    document.getElementById("subtotalCaja").textContent =
        subtotal.toFixed(2);

    document.getElementById("impuestoCaja").textContent =
        impuesto.toFixed(2);

    document.getElementById("totalCaja").textContent =
        total.toFixed(2);
}


function realizarCierre() {

    const total = document.getElementById("totalCaja").textContent;

    const confirmar = confirm(
        "¿Desea realizar el cierre de caja?\n\n" +
        "Total vendido: L. " + total
    );

    if (!confirmar) {
        return;
    }

    alert(
        "✅ Cierre de caja realizado correctamente.\n\n" +
        "Total vendido: L. " + total
    );
}


document.addEventListener("DOMContentLoaded", function() {

    if (document.getElementById("totalCaja")) {
        cargarCierreCaja();
    }

});

// ========================================
// SISTEMA DE CARRITO DE COMPRAS FLOTANTE
// ========================================

let carritoGlobal = [];

document.addEventListener("DOMContentLoaded", function() {
    // Cargar carrito de localStorage
    const carritoGuardado = localStorage.getItem("carritoBellanova");
    if (carritoGuardado) {
        carritoGlobal = JSON.parse(carritoGuardado);
    }
    
    // Solo mostrar el carrito si hay una etiqueta body
    if (document.body) {
        crearInterfazCarrito();
        actualizarCarritoGlobal();
    }
});

function crearInterfazCarrito() {
    const contenedor = document.createElement("div");
    contenedor.id = "carritoFlotanteContenedor";
    contenedor.innerHTML = `
        <div id="botonCarritoFlotante" onclick="toggleCarrito()" style="position:fixed; bottom:20px; right:20px; background-color:#e83e8c; color:white; border-radius:50%; width:60px; height:60px; display:flex; justify-content:center; align-items:center; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3); z-index:9999; font-size:24px; transition:transform 0.2s;">
            🛒
            <span id="contadorCarrito" style="position:absolute; top:-5px; right:-5px; background-color:#ff0000; color:white; border-radius:50%; width:24px; height:24px; font-size:12px; display:flex; justify-content:center; align-items:center; font-weight:bold; border:2px solid white;">0</span>
        </div>
        
        <div id="panelCarrito" style="position:fixed; bottom:90px; right:20px; background-color:white; width:320px; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.2); z-index:9998; display:none; flex-direction:column; overflow:hidden; border:1px solid #ddd; max-height:80vh;">
            <div style="background-color:#e83e8c; color:white; padding:15px; font-weight:bold; text-align:center; display:flex; justify-content:space-between; align-items:center;">
                <span>🛒 Mi Carrito de Compras</span>
                <span style="cursor:pointer; font-size:18px;" onclick="toggleCarrito()">✖</span>
            </div>
            <div id="itemsCarrito" style="padding:15px; overflow-y:auto; flex-grow:1; max-height:300px;">
                <!-- items go here -->
            </div>
            <div style="padding:15px; background-color:#f8f9fa; border-top:1px solid #ddd;">
                <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:15px; font-size:18px;">
                    <span>Total a Pagar:</span>
                    <span id="totalCarritoTexto" style="color:#28a745;">L. 0.00</span>
                </div>
                <button onclick="irAFacturacionConCarrito()" style="width:100%; background-color:#28a745; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; font-size:16px;">
                    🧾 Cobrar Pedido
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(contenedor);
}

function agregarAlCarrito(indice) {
    if (typeof productos === 'undefined' || !productos[indice]) return;
    
    const producto = productos[indice];
    
    // Verificar si ya existe
    const itemExistente = carritoGlobal.find(item => item.codigo === producto.codigo);
    
    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad++;
            alert("✨ Se añadió otra unidad de " + producto.nombre + " al carrito.");
        } else {
            alert("❌ No hay más stock disponible de este producto.");
            return;
        }
    } else {
        if (producto.stock > 0) {
            carritoGlobal.push({
                codigo: producto.codigo,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
            alert("✅ " + producto.nombre + " añadido al carrito.");
        } else {
            alert("❌ El producto está agotado.");
            return;
        }
    }
    
    guardarCarritoGlobal();
    actualizarCarritoGlobal();
    
    // Animación del botón
    const btnFlotante = document.getElementById("botonCarritoFlotante");
    if(btnFlotante) {
        btnFlotante.style.transform = "scale(1.2)";
        setTimeout(() => btnFlotante.style.transform = "scale(1)", 200);
    }
}

function actualizarCarritoGlobal() {
    const contador = document.getElementById("contadorCarrito");
    const itemsContenedor = document.getElementById("itemsCarrito");
    const totalTexto = document.getElementById("totalCarritoTexto");
    
    if(!contador || !itemsContenedor || !totalTexto) return;
    
    // Actualizar contador
    const totalItems = carritoGlobal.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;
    
    // Actualizar lista
    if (carritoGlobal.length === 0) {
        itemsContenedor.innerHTML = '<div style="text-align:center; color:#888; padding:20px; font-style:italic;">El carrito está vacío</div>';
        totalTexto.textContent = "L. 0.00";
        return;
    }
    
    let html = "";
    let totalPrecio = 0;
    
    carritoGlobal.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalPrecio += subtotal;
        
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div style="flex-grow:1; max-width: 190px;">
                    <div style="font-weight:bold; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.nombre}</div>
                    <div style="font-size:12px; color:#555;">L. ${item.precio.toFixed(2)} x ${item.cantidad}</div>
                </div>
                <div style="font-weight:bold; margin-right:10px; font-size:14px;">L. ${subtotal.toFixed(2)}</div>
                <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:16px;" title="Eliminar">🗑️</button>
            </div>
        `;
    });
    
    itemsContenedor.innerHTML = html;
    totalTexto.textContent = "L. " + totalPrecio.toFixed(2);
}

function eliminarDelCarrito(index) {
    carritoGlobal.splice(index, 1);
    guardarCarritoGlobal();
    actualizarCarritoGlobal();
}

function toggleCarrito() {
    const panel = document.getElementById("panelCarrito");
    if (panel) {
        if (panel.style.display === "none" || panel.style.display === "") {
            panel.style.display = "flex";
        } else {
            panel.style.display = "none";
        }
    }
}

function guardarCarritoGlobal() {
    localStorage.setItem("carritoBellanova", JSON.stringify(carritoGlobal));
}

function irAFacturacionConCarrito() {
    if(carritoGlobal.length === 0) {
        alert("⚠️ El carrito está vacío.");
        return;
    }
    
    // Si ya estamos en la página de facturación, pasar los productos directamente
    if (window.location.pathname.includes("facturacion.html")) {
        carritoGlobal.forEach(item => {
            const existente = detalleFactura.find(df => df.codigo === item.codigo);
            if (existente) {
                existente.cantidad += item.cantidad;
                existente.subtotal = existente.cantidad * existente.precio;
            } else {
                detalleFactura.push({
                    codigo: item.codigo,
                    nombre: item.nombre,
                    precio: Number(item.precio),
                    cantidad: item.cantidad,
                    subtotal: item.cantidad * Number(item.precio)
                });
            }
        });
        
        mostrarDetalleFactura();
        calcularTotales();
        toggleCarrito();
        
        carritoGlobal = [];
        guardarCarritoGlobal();
        actualizarCarritoGlobal();
        
    } else {
        // Redirigir a facturación y llenar automáticamente
        window.location.href = "facturacion.html?autoFill=true";
    }
}
function cerrarSesion() { window.location.href = 'index.html'; }
