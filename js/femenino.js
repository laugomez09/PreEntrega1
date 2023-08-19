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

        //damos evento al botón "Eliminar producto del carrito"
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
                //limpiar el carrito
                this._listaCarrito = []
                //limpiar el storage
                localStorage.removeItem(this._keyStorage)
                //total
                this._limpiarContenedorCarrito()
                this._total.innerHTML = ""
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `¡La compra se registró con éxito por un total de:  $${precio_total}`,
                    text: "Para más detalle, revise su e-mail",
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
        const p1 = new Producto({ id: 1, nombre: "Top deportivo espalda cruzada", precio: 10000, descripcion: "Este top deportivo cuenta con soporte medio de busto y con detalles únicos como cortes laterales que dejan ver tu piel o la espalda cruzada con cargaderas fijas ¡querrás hacerlo parte de tu armario, e incluso puedes usarlo como parte de tus looks de exterior! Incluye copas removibles para que decidas cómo usarlo, con ellas tu busto se verá más redondeado o sin ellas, más natural. Es parte de la colección co-creada con Silvy Araujo diseñada para que te sientas cómoda en todos tus movimientos.", img: "https://leonisa.co/cdn/shop/products/19AA03_700_1200X1500_1_280x.jpg?v=1688990891", img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj-NtCSVzSx_bOpnA4bOFz5kE2boWOw0vHulAUCapd0wqqQGBKYUk47dvvwatBtZ_AiXQ&usqp=CAU" })
        const p2 = new Producto({ id: 2, nombre: "Enterizo deportivo", precio: 20000, descripcion: "Este enterizo deportivo co-creado con Silvy Araujo tiene muchos detalles que te harán decir ¡quiero uno! Su top interno tiene un elástico en la base que le da más soporte a tu busto. Sus cargaderas son delgadas y fijas, y al ser cruzadas en espalda, el enterizo se mantiene en su lugar y tus manos quedan libres durante tus entrenamientos. En los glúteos cuenta con un corte tipo corazón que les da una modelación más redondeada y un efecto de realce. Su tacto es muy suave y su material es de secado rápido para que te sientas fresca todo el tiempo. ¡Muévete sin parar, hazlo con nuestra nueva colección! Incluso, puedes usarlo para salir, como parte de tu look de exterior.", img: "https://leonisa.co/cdn/shop/products/195601_700_1200X1500_1_140x.jpg?v=1687444058", img2: "https://leonisa.co/cdn/shop/products/195601_700_1200X1500_2_140x.jpg?v=1687444058" })
        //const p2 = new Producto(2, "ryzen 5", 150000, "un producto de gama media", "https://m.media-amazon.com/images/I/51f2hkWjTlL.__AC_SX300_SY300_QL70_ML2_.jpg")
        const p3 = new Producto({ id: 3, nombre: "Camiseta deportiva", precio: 16000, descripcion: "Te sentirás muy fresca durante y después de tu entrenamiento con esta camiseta deportiva de secado rápido. Es manga sisa, de espalda atlética y de silueta semiajustada, lo cual te permitirá moverte con total libertad. Ideal para combinar con nuestros leggings, shorts y capris deportivos.", img: "https://leonisa.co/cdn/shop/products/195336_410_1200X1500_1_140x.jpg?v=1680534686", img2: "https://leonisa.co/cdn/shop/products/195336_410_1200X1500_2_140x.jpg?v=1680534686" })
        //const p3 = new Producto(3, "ryzen 7", 300000, "un producto de gama alta", "https://m.media-amazon.com/images/I/51D3DrDmwkL.__AC_SX300_SY300_QL70_ML2_.jpg")


        this.agregar(p1)
        this.agregar(p2)
        this.agregar(p3)
    }

    agregar(producto) {
        this.listaProductos.push(producto)
    }

    eventoAgregarAlCarrito() {
        //damos evento al botón "añadir al carrito"
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
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`

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

//Instancia de Carrito | Es para los productos que el cliente escoja
const carrito = new Carrito()
carrito.levantarStorage()
carrito.mostrarProductos()
//quedan a la escucha del 'click'
carrito.eventoFinalizarCompra()
carrito.eventoVaciarCarrito()

//Instancia de ProductoController - Gestiona todos los productos, es decir: mostrar, calcularTotal
const controlador_productos = new ProductoController()
controlador_productos.cargarProductos()
controlador_productos.mostrarProductos()