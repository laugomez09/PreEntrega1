alert("¡Bienvenidos al Kiosco Mari!");
let rta1 = prompt("Desea llevar algo?\nSi o No").toLowerCase();
if (rta1 == "si") {
    class Producto {
        constructor(id, nombre, precio, cantidad) {
            this.id = id
            this.nombre = nombre
            this.precio = precio
            this.cantidad = cantidad
        }

        aumentarCantidad(cantidad) {
            this.cantidad = this.cantidad + cantidad
        }

        descripcion() {
            return "id: " + this.id +
                "\nnombre: " + this.nombre +
                "\nprecio: " + this.precio
        }

        descripcionDeCompra() {
            return "nombre: " + this.nombre +
                "\nprecio: " + this.precio +
                "\ncantidad: " + this.cantidad
        }
        cargarProductos(productos) {
            let listaProductos = []
            productos.map((producto) => listaProductos.push(producto))
            return listaProductos
        }
    }

    class ProductoControlador {
        constructor() {
            this.listaProductos = []
        }

        agregar(producto) {
            this.listaProductos.push(producto)
        }

        buscarProductoPorID(id) {
            return this.listaProductos.find(producto => producto.id == id)
        }

        mostrarProductos() {
            let listaEnTexto = ""
            this.listaProductos.forEach(producto => {
                listaEnTexto = listaEnTexto + producto.descripcion() + "\n---------------------\n"
            })
            alert("Productos disponibles:\n" + listaEnTexto)
        }
    }

    class Carrito {
        constructor() {
            this.listaCarrito = []
        }

        agregar(producto, cantidad) {
            let existe = this.listaCarrito.some(el => el.id == producto.id)

            if (existe) {
                producto.aumentarCantidad(cantidad)
            } else {

                producto.aumentarCantidad(cantidad)
                this.listaCarrito.push(producto)
                console.log('listaCarrito ', this.listaCarrito)
            }

        }

        mostrarProductos() {
            let listaEnTexto = "Carrito de compras:\n"
            this.listaCarrito.forEach(producto => {
                listaEnTexto = listaEnTexto + producto.descripcionDeCompra() + "\n--------------\n"

            })
            return listaEnTexto
        }

        calcularTotal() {
            return this.listaCarrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0)
        }

        totalConDescuento() {
            return this.calcularTotal() * 0.9
        }
    }

    const p = new ProductoControlador()
    const CARRITO = new Carrito()
    const PRODUCTOS = new Producto()

    p.agregar(new Producto(1, "jamon", 1500, 0))
    p.agregar(new Producto(2, "queso", 1500, 0))
    p.agregar(new Producto(3, "pan", 800, 0))
    p.agregar(new Producto(4, "cigarrillos", 2500, 0))
    p.agregar(new Producto(5, "gaseosa", 1200, 0))
    p.agregar(new Producto(6, "chicles", 500, 0))

    let rta

    let seleccion = prompt("Desea comprar algun producto? (si o no)\nSi desea comprar tendra un 10% de descuento en todos los productos.").toLowerCase()

    while (seleccion != "si" && seleccion != "no") {
        alert("Por favor ingrese si o no")
        seleccion = prompt("Desea comprar algun producto? (si o no)")
    }
    if (seleccion == "si") {
        do {
            p.mostrarProductos()
            let opcion = Number(prompt("Ingrese el ID del producto que desea agregar"))
            let producto = p.buscarProductoPorID(opcion)
            let cantidad = Number(prompt("Ingrese la cantidad del producto seleccionado que desea"))
            CARRITO.agregar(producto, cantidad)
            alert("El producto fué añadido exitosamente: ")
            CARRITO.mostrarProductos()

            rta = prompt("Ingrese 'ESC' para salir").toUpperCase()
        } while (rta != "ESC")

        alert("El ticket es:  \n" + CARRITO.mostrarProductos() + "\nPrecio TOTAL es de:  " + CARRITO.calcularTotal() + "\nEl precio FINAL con descuento es de:  " + CARRITO.totalConDescuento() + "\n¡Muchas gracias por la visita!")
        /*alert("El total de su compra con descuento ed 10% es de: " + CARRITO.totalConDescuento())*/
        /*let total_para_descuento = Carrito.calcularTotal()
        function totalConDescuento(total_para_descuento) {
            return total_para_descuento * 0.9
        }
        alert("El total de la compra con el descuento del 10% qquedaria en:  " + total_para_descuento())*/

    } else {
        alert("Muchas gracias por su visita.")
    }
} else {
    alert("Muchas gracias por su visita.")
}
alert