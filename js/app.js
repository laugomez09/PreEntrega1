//Defini las variables.
let resultado = 0;
let ticket = "Detalle de la compra: \n";
let rta = "";
let jamon = 1500;
let queso = 1500;
let gaseosa = 1800;
let pan = 800;
let cigarrillos = 2300;

//Info de que es la pag.
function totalConDescuento(precio) {
    return precio * 0.9
}

alert("¡Bienvenidos al Kiosco Mari!")
let rta1 = prompt("Desea llevar algo?\nSi o No").toLowerCase();

//Interactuando con el usuario.

if (rta1 == "si") {
    alert("Productos disponibles:\nJamon:\t$" + jamon + "\nQueso:\t$" + queso + "\nGaseosa:\t$" + gaseosa + "\nPan:\t$" + pan + "\nCigarrillos:\t$" + cigarrillos);
    let seleccion = prompt("Desea comprar algun producto? (si o no)\nSi desea comprar tendra un 10% de descuento en todos los productos.").toLowerCase()

    while (seleccion != "si" && seleccion != "no") {
        alert("Por favor ingrese si o no")
        seleccion = prompt("Desea comprar algun producto? (si o no)")
    }

    if (seleccion == "si") {
        while (seleccion == "si") {
            let producto = prompt("Por favor ingrese el nombre del producto que desea comprarar\nJamon\nQueso\nGaseosa\nPan\nCigarrillos").toLowerCase()
            let precio = Number(prompt("Por favor ingrese el valor del producto\nJamon:\t$" + jamon + "\nQueso:\t$" + queso + "\nGaseosa:\t$" + gaseosa + "\nPan:\t$" + pan + "\nCigarrillos:\t$" + cigarrillos))

            resultado = resultado + totalConDescuento(precio)
            ticket = ticket + "\n" + producto + "\t$" + totalConDescuento(precio)


            seleccion = prompt("¿Desea seguir comprando?(Escriba 'si' o 'no' para proseguir).").toLowerCase()
        }
    } /*else {
        alert("¡Gracias por la visita!")
    }*/
    if (seleccion == "no") {
        alert(ticket + "\n\nTotal: $" + resultado + "\n¡Gracias por la visita!")
    }
} else {
    alert("¡Gracias por la visita!")
}
