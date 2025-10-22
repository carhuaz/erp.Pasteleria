// app.js
// ==========================================
// Sistema de gestion de ventas - DELICIA
// Panaderia y Pasteleria
// ==========================================

// Importacion de modulos necesarios
import readlineSync from "readline-sync";
import chalk from "chalk";
import {
  listarProductos,
  buscarProducto,
  agregarAlCarrito,
  verCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
  calcularTotales,
  generarTicket,
  reportes
} from "./services/ventas.js";

// Limpia la consola y muestra bienvenida
console.clear();
console.log(chalk.bgBlue.white.bold("\n🍞 Bienvenido al sistema Delicia 🧁"));
console.log(chalk.cyan("Gestion de Ventas - Panaderia & Pasteleria\n"));

let opcion;

do {
  // Menu principal del sistema
  console.log(chalk.yellowBright(`
1. Registrar venta
2. Listar productos
3. Buscar productos
4. Ver carrito
5. Calcular total
6. Generar ticket
7. Reportes
8. Salir
`));

  opcion = readlineSync.question(chalk.white("Seleccione una opcion: ")).trim();

  switch (opcion) {
    // -------------------- REGISTRAR VENTA --------------------
    case "1": {
      listarProductos(); // Muestra el catalogo actual
      let continuar;
      do {
        // Validacion del ID
        const id = Number(readlineSync.question("Ingrese el ID del producto: "));
        if (isNaN(id) || id <= 0) {
          console.log(chalk.red("❌ ID invalido. Intente nuevamente."));
          continue;
        }

        // Validacion de cantidad
        const cantidad = Number(readlineSync.question("Ingrese cantidad: "));
        if (isNaN(cantidad) || cantidad <= 0) {
          console.log(chalk.red("❌ Cantidad invalida. Debe ser mayor a 0."));
          continue;
        }

        agregarAlCarrito(id, cantidad); // Agrega producto al carrito

        // Validacion de la respuesta del usuario (solo s o n)
        let respuesta;
        do {
          respuesta = readlineSync.question("¿Desea agregar otro producto? (s/n): ").trim().toLowerCase();
          if (respuesta !== "s" && respuesta !== "n") {
            console.log(chalk.red("⚠️ Solo se acepta 's' o 'n'. Intente nuevamente."));
          }
        } while (respuesta !== "s" && respuesta !== "n");

        continuar = respuesta;
      } while (continuar === "s");
      break;
    }

    // -------------------- LISTAR PRODUCTOS --------------------
    case "2":
      listarProductos();
      break;

    // -------------------- BUSCAR PRODUCTO --------------------
    case "3": {
      const nombre = readlineSync.question("Ingrese nombre del producto: ");
      buscarProducto(nombre);
      break;
    }

    // -------------------- VER CARRITO --------------------
    case "4":
      verCarrito();
      break;

    // -------------------- CALCULAR TOTAL --------------------
    case "5": {
      const { subtotal, descuento, igv, total } = calcularTotales();
      console.log(chalk.yellow(`\nSubtotal: S/${subtotal.toFixed(2)}`));
      console.log(chalk.yellow(`Descuento: S/${descuento.toFixed(2)}`));
      console.log(chalk.yellow(`IGV: S/${igv.toFixed(2)}`));
      console.log(chalk.blueBright.bold(`TOTAL FINAL: S/${total.toFixed(2)}\n`));
      break;
    }

    // -------------------- GENERAR TICKET --------------------
    case "6":
      generarTicket();
      break;

    // -------------------- REPORTES --------------------
    case "7":
      reportes();
      break;

    // -------------------- SALIR --------------------
    case "8":
      console.log(chalk.green.bold("\n👋 Hasta pronto y buen dia en Delicia! 🥖"));
      break;

    // -------------------- OPCION INVALIDA --------------------
    default:
      console.log(chalk.red("⚠️ Opcion no valida, por favor intente nuevamente."));
  }
} while (opcion !== "8");
