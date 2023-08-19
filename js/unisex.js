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

        const p1 = new Producto({ id: 1, nombre: "Conjunto de tenis", precio: 20000, descripcion: "Presentamos el Conjunto de Tenis Unisex, una combinación perfecta de estilo, comodidad y rendimiento diseñada para aquellos que buscan dominar la cancha con confianza. Tanto para jugadores principiantes como para profesionales, este conjunto ofrece la combinación ideal de moda y funcionalidad para llevar el juego al siguiente nivel.", img: "https://tennisworldcolombia.com/wp-content/uploads/2022/03/Diseno-sin-titulo-2022-03-27T114133.368.png", img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7rclP8uv6CQ8YNGdSxoVzIqbpvbnQHwrLQQ&usqp=CAU" })
        const p2 = new Producto({ id: 2, nombre: "Campera rompe viento", precio: 25000, descripcion: "El tejido rompevientos es la característica principal de esta campera. Ofrece una barrera efectiva contra las ráfagas de viento, manteniendo a raya el frío y garantizando la comodidad en condiciones desafiantes. El diseño ligero permite llevarla consigo en cualquier ocasión.", img: "https://d368r8jqz0fwvm.cloudfront.net/46528-product_lg/anorak-unisex-alfa.jpg", img2: "https://d368r8jqz0fwvm.cloudfront.net/44507-product_lg/anorak-unisex-alfa.jpg" })
        const p3 = new Producto({ id: 3, nombre: "Camiseta DJP", precio: 15000, descripcion: "La Camiseta DJP presenta un diseño vanguardista que combina elementos musicales y estéticos urbanos. Gráficos y detalles inspirados en la cultura de la música electrónica y la vida nocturna se fusionan en una obra de arte en tela.", img: "https://image.made-in-china.com/202f0j00COpTPJnRhVzG/Unisex-Sportswear-Dry-Fit-Custom-Gym-Wear-T-Shirt.webp", img2: "https://i.pinimg.com/550x/73/78/2c/73782c98646f07c26ac84c6aab7addca.jpg" })

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