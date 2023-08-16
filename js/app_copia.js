
class Producto {
    constructor(id, nombre, precio, descripcion, img) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.descripcion = descripcion
        this.img = img

    }
}

class Carrito {
    constructor() {
        this.listacarrito = []
    }

    agregar(producto) {
        this.listacarrito.push(producto)
    }

    imprimir() {
        let listadejson = localStorage.getItem("ListaCarrito")
        this.listacarrito = JSON.parse(listadejson)
    }

    guardar() {
        let listadejson = JSON.stringify(this.listacarrito)
        localStorage.setItemt("ListaCarrito", listadejson)
    }


    mostrarProducto() {
        /*let contenedor = document.getElementById(`cc`)
        contenedor.innerHTML = ""*/
        this.listacarrito.forEach(producto => {
            console.log(producto)
            contenedor.innerHTML += `<div class="card mb-3" style="width: auto;">
            <div class="row g-0">
            <div class="col-md-4">
                <img src="${producto.img}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
            <div class="card-body">
                <h3 class="card-title">${producto.nombre}</h3>
                <p class="card-text"><small class="text-body-secondary">Precio: $${producto.precio}</small></p>
            </div>
            </div>
        </div>
    </div>`
        })
    }
}

class ControladorDeProductos {
    constructor() {
        this.listadeproductos = []
    }
    agregar(producto) {
        this.listadeproductos.push(producto)
    }
    mostrar() {
        let seccion = document.getElementById("seccion1")
        this.listadeproductos.forEach(producto => {
            seccion.innerHTML += `<div class="card"><img src="${producto.img}" class="card-img-top"
            alt="...">
        <div class="card-body">
            <h3 class="card-title">${producto.nombre}</h3>
            <p class="card-text">${producto.descripcion}</p>
            <h4>$${producto.precio}</h4>
            <a href="#" class="btn btn-primary" id="ap-${producto.id}" >Añadir a carrito</a>
        </div>
    </div>`

        })

        this.listadeproductos.forEach(producto => {
            let btn = document.getElementById(`ap-${producto.id}`)
            btn.addEventListener("click",() => {
                console.log("producto añadido")
                carrito.agregar(producto)
                carrito.guardar()
                carrito.mostrarProducto()
            })
        })

    }

}

const p1 = new Producto(1, "Conjunto Remera Y Short Deportivo", 7000, "Conjunto de short y remera de tela set deportivo. Para entrenamiento o practicas de deporte diverso. Muy comodo y estirable", "https://http2.mlstatic.com/D_NQ_NP_752644-MLA49141281424_022022-O.webp")
const p2 = new Producto(id: 2, nombre: "Buzo Nike Dri-Fit Academy", precio: 15000, descripcion: "El Buzo Nike Dri-Fit Academy está pensando para quienes aman combinar un look deportivo y uno casual. Está elaborado en poliéster y se adapta fácilmente a tu cuerpo para acompañarte a donde vayas", img: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw852f334f/products/NI_CW6110-010/NI_CW6110-010-1.JPG")
const p3 = new Producto(id: 3,nombre:  "Pantalón deportivo adiddas Tiro 19", precio: 16000, descripcion: "Este pantalón adidas Tiro te lleva al campo de entrenamiento y más allá. Incorpora la tecnología de absorción AEROREADY que mantiene tu piel seca hasta en los días más intensos.", img: "https://http2.mlstatic.com/D_NQ_NP_661942-MLA42902589147_072020-O.webp")

const carrito = new Carrito()
carrito.imprimir()

const cp = new ControladorDeProductos()

cp.agregar(p1)
cp.agregar(p2)
cp.agregar(p3)

cp.mostrar()


