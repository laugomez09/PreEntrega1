class Producto {

    constructor({ id, nombre, precio, descripcion, img }) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.descripcion = descripcion
        this.img = img
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
        return `<div class="card"  >
        <img src="${this.img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h2 class="card-title">${this.nombre}</h2>
            <p class="card-text">${this.descripcion}</p>
            <h3 class="card-text">$${this.precio}</h3>
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
        //this._listaCarrito = JSON.parse(localStorage.getItem("listaCarrito")) || []
        this._listaCarrito = JSON.parse(localStorage.getItem(this._keyStorage)) || []

        if (this._listaCarrito.length > 0) {
            let listaAuxiliar = []

            for (let i = 0; i < this._listaCarrito.length; i++) {
                //pasa de objeto literal a una instancia de Producto
                let productoDeLaClaseProducto = new Producto(this._listaCarrito[i])
                listaAuxiliar.push(productoDeLaClaseProducto)
                //id, nombre, precio, descripcion, img
                //const element2 = new Producto(this._listaCarrito[i].id, this._listaCarrito[i].nombre, this._listaCarrito[i].precio, this._listaCarrito[i].descripcion, this._listaCarrito[i].img )

            }

            this._listaCarrito = listaAuxiliar
        }
        /*
        let listaCarritoJSON = localStorage.getItem("listaCarrito")
        if(listaCarritoJSON){
            this._listaCarrito = JSON.parse(listaCarritoJSON)
        }else{
            this._listaCarrito = []
        }
        */
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this._listaCarrito)
        //localStorage.setItem("listaCarrito", listaCarritoJSON)
        localStorage.setItem(this._keyStorage, listaCarritoJSON)
    }

    agregar(productoAgregar) {
        //this._listaCarrito.push(productoAgregar)
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

        const p1 = new Producto({ id: 1, nombre: "Conjunto Remera Y Short Deportivo", precio: 7000, descripcion: "Conjunto de short y remera de tela set deportivo. Para entrenamiento o practicas de deporte diverso. Muy comodo y estirable", img: "https://http2.mlstatic.com/D_NQ_NP_752644-MLA49141281424_022022-O.webp" })
        const p2 = new Producto({ id: 2, nombre: "Buzo Nike Dri-Fit Academy", precio: 15000, descripcion: "El Buzo Nike Dri-Fit Academy está pensando para quienes aman combinar un look deportivo y uno casual. Está elaborado en poliéster y se adapta fácilmente a tu cuerpo para acompañarte a donde vayas", img: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw852f334f/products/NI_CW6110-010/NI_CW6110-010-1.JPG" })
        const p3 = new Producto({ id: 3, nombre: "Pantalón deportivo adiddas Tiro 19", precio: 16000, descripcion: "Este pantalón adidas Tiro te lleva al campo de entrenamiento y más allá. Incorpora la tecnología de absorción AEROREADY que mantiene tu piel seca hasta en los días más intensos.", img: "https://http2.mlstatic.com/D_NQ_NP_661942-MLA42902589147_072020-O.webp" })


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