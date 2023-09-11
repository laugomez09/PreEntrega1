class Producto {

    constructor({ id, nombre, precio, descripcion, img, img2 }) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.descripcion = descripcion
        this.img = img
        this.img2 = img2
    }

    aumentarCantidad() {
        this.cantidad++
    }

    disminuirCantidad() {
        if (this.cantidad > 1) {
            this.cantidad--
            return true
        }

        return false
    }

    descripcionHTMLCarrito() {
        return `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row_g-0">
                <div class="col-md-4">
                    <img src="${this.img}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${this.nombre}</h5>
                        <p class="card-text">Cantidad: <button class="btn btn-dark" id="minus-${this.id}"><i class="fa-solid fa-minus fa-1x"></i></button>${this.cantidad}<button class="btn btn-dark" id="plus-${this.id}"><i class="fa-solid fa-plus"></i></button> </p>
                        <p class="card-text">Precio: $${this.precio}</p>
                        <button class="btn btn-danger" id="eliminar-${this.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>`
    }

    descripcionHTML() {
        return `<div class="card">
        <div id="carouselExample" class="carousel slide">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="${this.img}" class="d-block w-100" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="${this.img2}" class="d-block w-100" alt="...">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
        <div class="card-body">
            <h3 class="card-title">${this.nombre}</h3>
            <p class="card-text">${this.descripcion}</p>
            <h4 class="card-text">$${this.precio}</h4>
            <button class="btn btn-primary" id="ap-${this.id}">Añadir al carrito</button>
        </div>
    </div>
        `
    }
}

class Carrito {
    constructor() {
        this._listaCarrito = []
        this._contenedor_carrito = document.getElementById('contenedor_carrito')
        this._total = document.getElementById('total')
        this._finalizar_compra = document.getElementById("finalizar_compra")
        this._vaciar_carrito = document.getElementById("vaciar_carrito")
        this._keyStorage = "listaCarrito"
    }

    levantarStorage() {
        this._listaCarrito = JSON.parse(localStorage.getItem(this._keyStorage)) || []

        if (this._listaCarrito.length > 0) {
            let listaAuxiliar = []

            for (let i = 0; i < this._listaCarrito.length; i++) {

                let productoDeLaClaseProducto = new Producto(this._listaCarrito[i])
                listaAuxiliar.push(productoDeLaClaseProducto)


            }

            this._listaCarrito = listaAuxiliar
        }

    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this._listaCarrito)

        localStorage.setItem(this._keyStorage, listaCarritoJSON)
    }

    agregar(productoAgregar) {

        let existeElProducto = this._listaCarrito.some(producto => producto.id == productoAgregar.id)

        if (existeElProducto) {
            let producto = this._listaCarrito.find(producto => producto.id == productoAgregar.id)
            producto.cantidad = producto.cantidad + 1
        } else {
            this._listaCarrito.push(productoAgregar)
        }
    }

    eliminar(productoEliminar) {
        let producto = this._listaCarrito.find(producto => producto.id == productoEliminar.id)
        let indice = this._listaCarrito.indexOf(producto)
        this._listaCarrito.splice(indice, 1)
    }

    _limpiarContenedorCarrito() {
        this._contenedor_carrito.innerHTML = ""
    }

    _eventoBotonEliminarProducto(producto) {
        let btn_eliminar = document.getElementById(`eliminar-${producto.id}`)

        btn_eliminar.addEventListener("click", () => {
            this.eliminar(producto)
            this.guardarEnStorage()
            this.mostrarProductos()
            Toastify({
                avatar: `${producto.img}`,
                text: `¡${producto.nombre} se ha eliminado!`,
                duration: 3000,
                gravity: "bottom",
                position: "right",

            }).showToast();
        })
    }

    _eventoBotonAumentarCantidad(producto) {
        let btn_plus = document.getElementById(`plus-${producto.id}`)

        btn_plus.addEventListener("click", () => {
            producto.aumentarCantidad()
            this.mostrarProductos()
        })
    }

    _eventoBotonDisminuirCantidad(producto) {
        let btn_minus = document.getElementById(`minus-${producto.id}`)
        btn_minus.addEventListener("click", () => {
            if (producto.disminuirCantidad()) {
                this.mostrarProductos()
            }
        })
    }

    mostrarProductos() {
        this._limpiarContenedorCarrito()

        this._listaCarrito.forEach(producto => {
            this._contenedor_carrito.innerHTML += producto.descripcionHTMLCarrito()
        })


        this._listaCarrito.forEach(producto => {

            this._eventoBotonEliminarProducto(producto)
            this._eventoBotonAumentarCantidad(producto)
            this._eventoBotonDisminuirCantidad(producto)

        })

        this._total.innerHTML = "Precio Total: $" + this._calcular_total()
    }

    _calcular_total() {
        return this._listaCarrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0)
    }

    eventoFinalizarCompra() {
        this._finalizar_compra.addEventListener("click", () => {

            if (this._listaCarrito.length > 0) {
                let precio_total = this._calcular_total()

                this._listaCarrito = []

                localStorage.removeItem(this._keyStorage)

                this._limpiarContenedorCarrito()
                this._total.innerHTML = ""
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `¡La compra se registró con éxito por un total de:  $${precio_total}`,
                    timer: 3000
                })

            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '¡Debes añadir productos para realizar la compra!',
                    timer: 3000
                })
            }
        })
    }

    eventoVaciarCarrito() {
        this._vaciar_carrito.addEventListener("click", () => {
            this._listaCarrito = []
            this._limpiarContenedorCarrito()
            localStorage.clear()
            this.mostrarProductos()
            if (this._listaCarrito.length >= 0){
                Toastify({
                    text: `No hay contenido en el carrito para vaciar`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                }).showToast()
            }else{
                Toastify({
                    text: `Se ha vaciado el carrito`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                })

            }
        })
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    cargarProductos() {
        //Instancias de Producto
        const p1 = new Producto({ id: 1, nombre: "Conjunto pollera y top para nenas", precio: 15000, descripcion: "Prepárate para un derroche de dulzura y estilo con nuestro conjunto infantil de pollera y top diseñado especialmente para las pequeñas fashionistas. Inspirado en la frescura de la primavera, este conjunto cautiva con su combinación de comodidad, elegancia y un toque de encanto juguetón.", img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/142/450/products/top-estampado-nina-paradise-11-ad00ab018f2090164c16906470356418-480-0.jpg", img2: "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/142/450/products/conjunto-top-y-short-estampado-nina-garden-verde1-207e997fd10362b25f16917843942923-480-0.jpg" })
        const p2 = new Producto({ id: 2, nombre: "Conjunto de la seleccion argentina Mundial 2022", precio: 10000, descripcion: "Celebra la pasión y el orgullo futbolero desde temprana edad con nuestro Conjunto Infantil Argentina 2022. Diseñado para los futuros fanáticos del fútbol y aquellos que llevan la bandera argentina en el corazón, este conjunto captura la esencia del deporte nacional en un estilo adorable y auténtico.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4ly8nEmHvinG-8FR7dhzMa1X7YhkExnfwfe1--HsemqW-MBsRVxUNC32OZXPtX9IUFCo&usqp=CAU", img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXCODBlDlapbhjer4IkwOpSp0BOON_ySl0iYIvq1jn550dHejecc43zrZHHLoh_MfEkKw&usqp=CAU" })
        const p3 = new Producto({ id: 3, nombre: "Conjunto adiddas", precio: 20000, descripcion: "Presentamos el Conjunto Infantil Adidas, una combinación perfecta de estilo deportivo y comodidad diseñada para los pequeños entusiastas del movimiento y la moda. Con la reconocida calidad de la marca y un toque de energía juvenil, este conjunto es la elección ideal para los niños que aman estar activos con un toque de estilo icónico.", img: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/9f62bada6132486cb2e8af5700fbb110_9366/conjunto-adidas-x-disney-mickey-mouse-jogger.jpg", img2: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/ef51706b5f0a4cb0bf82af5700fbaba4_9366/conjunto-adidas-x-disney-mickey-mouse-jogger.jpg" })

        this.agregar(p1)
        this.agregar(p2)
        this.agregar(p3)
    }

    agregar(producto) {
        this.listaProductos.push(producto)
    }

    eventoAgregarAlCarrito() {

        this.listaProductos.forEach(producto => {

            const btn = document.getElementById(`ap-${producto.id}`)

            btn.addEventListener("click", () => {
                carrito.agregar(producto)
                carrito.guardarEnStorage()
                carrito.mostrarProductos()
                Toastify({
                    avatar: `${producto.img}`,
                    text: `¡${producto.nombre} añadido!`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",

                }).showToast();
            })
        })
    }

    mostrarProductos() {

        this.listaProductos.forEach(producto => {
            this.contenedor_productos.innerHTML += producto.descripcionHTML()
        })

        this.eventoAgregarAlCarrito()
    }
}


const carrito = new Carrito()
carrito.levantarStorage()
carrito.mostrarProductos()

carrito.eventoFinalizarCompra()
carrito.eventoVaciarCarrito()


const controlador_productos = new ProductoController()
controlador_productos.cargarProductos()
controlador_productos.mostrarProductos()

fetch(`../JSON/infantil.json`)
    .then(resp => resp.json())
    .then(Redes_Sociales => {
        VerApps(Redes_Sociales)
    })

function VerApps(arr) {
    const Pie_de_pagina = document.getElementById("redes")
    arr.forEach(el => {
        Pie_de_pagina.innerHTML += `
            <div class:"redes_sociales">
                <h4>${el.parrafo}</h4>
                <ul class:"apps" >
                    <li>
                        <a href="https://www.youtube.com/@BanfieldOficial" target="_blank"><img class="youtube"
                            src="${el.youtube}"></a>
                        <a href="https://www.tiktok.com/@cab_oficial" target="_blank"><img class="tiktok"
                            src="${el.tiktok}" alt="Logo de Tik tiktok"></a>
                        <a href="https://www.instagram.com/cab_oficial/?hl=es" target="_blank"><img class="instagram"
                            src="${el.instagram}" alt="Logo de instagram"></a>
                    </li>
                </ul>
            </div>
        `
    }
    )

}
