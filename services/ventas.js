import chalk from "chalk";
import { productos } from "../data/productos.js";

let carrito = [];
let historialVentas = [];

//  Listar productos
export const listarProductos = () => {
  console.log(chalk.bold.bgBlue.white("\n=== CATÁLOGO DE PRODUCTOS ==="));
  console.log(chalk.yellow("ID   Nombre                 Precio    Categoría"));
  console.log(chalk.gray("-----------------------------------------------"));
  productos.forEach(p =>
    console.log(
      chalk.white(`${p.id.toString().padEnd(4)} ${p.nombre.padEnd(22)} S/${p.precio.toFixed(2).padEnd(8)} ${p.categoria}`)
    )
  );
  console.log(chalk.gray("-----------------------------------------------\n"));
};

//  Buscar producto
// --------------------------------------------
// Buscar producto por nombre o coincidencia parcial
// --------------------------------------------
export const buscarProducto = (nombre) => {
  // Validar entrada vacia o nula
  if (!nombre || nombre.trim() === "") {
    console.log(chalk.red(" Debe ingresar un texto para buscar."));
    return;
  }

  // Convertir a minusculas para busqueda sin sensibilidad de mayusculas
  const texto = nombre.toLowerCase().trim();

  // Filtrar productos que incluyan el texto en su nombre
  const resultados = productos.filter(p => p.nombre.toLowerCase().includes(texto));

  // Si no hay coincidencias, mostrar mensaje
  if (resultados.length === 0) {
    console.log(chalk.red(`\n No se encontro ningun producto que coincida con: "${nombre}"`));
    return;
  }

  // Mostrar resultados formateados
  console.log(chalk.bold.bgBlue.white(`\n RESULTADOS DE BUSQUEDA: "${nombre}"`));
  console.log(chalk.yellow("ID   Nombre                 Precio    Categoria"));
  console.log(chalk.gray("-----------------------------------------------"));

  resultados.forEach(p => {
    console.log(
      chalk.white(
        `${p.id.toString().padEnd(4)} ${p.nombre.padEnd(22)} S/${p.precio.toFixed(2).padEnd(8)} ${p.categoria}`
      )
    );
  });

  console.log(chalk.gray("-----------------------------------------------"));
  console.log(chalk.green(`Se encontraron ${resultados.length} producto(s) relacionados.\n`));
};


//  Agregar al carrito
export const agregarAlCarrito = (id, cantidad) => {
  const prod = productos.find(p => p.id === id);
  if (!prod) return console.log(chalk.red(" ID de producto no válido."));
  if (isNaN(cantidad) || cantidad <= 0) return console.log(chalk.red(" Cantidad inválida. Debe ser mayor a 0."));

  const item = carrito.find(i => i.id === id);
  if (item) item.cantidad += cantidad;
  else carrito.push({ ...prod, cantidad });

  console.log(chalk.greenBright(` ${prod.nombre} agregado (${cantidad} x S/${prod.precio.toFixed(2)} = S/${(prod.precio * cantidad).toFixed(2)})`));
};

//  Ver carrito
export const verCarrito = () => {
  if (carrito.length === 0) return console.log(chalk.yellow("\n El carrito está vacío.\n"));
  console.log(chalk.cyan.bold("\n=== CARRITO ACTUAL ==="));
  console.log(chalk.yellow("Producto              Cant.  Precio   Subtotal"));
  console.log(chalk.gray("-----------------------------------------------"));
  carrito.forEach(i => {
    console.log(`${i.nombre.padEnd(22)} ${i.cantidad.toString().padEnd(6)} S/${i.precio.toFixed(2).padEnd(7)} S/${(i.precio * i.cantidad).toFixed(2)}`);
  });
  console.log(chalk.gray("-----------------------------------------------\n"));
};

//  Eliminar producto
export const eliminarDelCarrito = (nombre) => {
  const idx = carrito.findIndex(i => i.nombre.toLowerCase() === nombre.toLowerCase());
  if (idx === -1) return console.log(chalk.red(" Producto no encontrado en el carrito."));
  carrito.splice(idx, 1);
  console.log(chalk.green("🗑️  Producto eliminado correctamente."));
};

//  Vaciar carrito
export const vaciarCarrito = () => {
  carrito = [];
  console.log(chalk.yellow("🧹 Carrito vaciado."));
};

//  Calcular totales
export const calcularTotales = () => {
  let subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  let descuento = 0;
  if (subtotal >= 100) descuento = subtotal * 0.15;
  else if (subtotal >= 50) descuento = subtotal * 0.10;
  else if (subtotal >= 20) descuento = subtotal * 0.05;
  const igv = (subtotal - descuento) * 0.18;
  const total = subtotal - descuento + igv;
  return { subtotal, descuento, igv, total };
};

//  Generar ticket
export const generarTicket = () => {
  if (carrito.length === 0) return console.log(chalk.red(" No hay productos en el carrito."));

  const { subtotal, descuento, igv, total } = calcularTotales();
  console.log(chalk.bgCyan.white.bold("\n=====  RESUMEN DE COMPRA ====="));
  console.log("Producto              Cant.  Precio   Subtotal");
  console.log(chalk.gray("-----------------------------------------------"));
  carrito.forEach(i => {
    console.log(`${i.nombre.padEnd(22)} ${i.cantidad.toString().padEnd(6)} S/${i.precio.toFixed(2).padEnd(7)} S/${(i.precio * i.cantidad).toFixed(2)}`);
  });
  console.log(chalk.gray("-----------------------------------------------"));
  console.log(chalk.yellow(`Subtotal:   S/${subtotal.toFixed(2)}`));
  console.log(chalk.yellow(`Descuento:  S/${descuento.toFixed(2)}`));
  console.log(chalk.yellow(`IGV (18%):  S/${igv.toFixed(2)}`));
  console.log(chalk.blueBright.bold(`TOTAL:      S/${total.toFixed(2)}`));
  console.log(chalk.green.bold("\n ¡Gracias por su compra en Panadería Delicia! \n"));

  historialVentas.push(...carrito);
  carrito = [];
};

//  Reportes
export const reportes = () => {
  console.log(chalk.magenta.bold("\n===  REPORTES ==="));

  const top3 = [...productos].sort((a, b) => b.precio - a.precio).slice(0, 3);
  console.log(chalk.yellow("\n Top 3 productos más caros:"));
  top3.forEach(p => console.log(`${p.nombre} - S/${p.precio.toFixed(2)}`));

  const vendidos = {};
  historialVentas.forEach(v => vendidos[v.nombre] = (vendidos[v.nombre] || 0) + v.cantidad);
  const topVendidos = Object.entries(vendidos).sort((a, b) => b[1] - a[1]);

  if (topVendidos.length > 0) {
    console.log(chalk.yellow("\n Productos más vendidos:"));
    topVendidos.forEach(([nombre, cant]) => console.log(`${nombre} - ${cant} unidades`));
  } else console.log(chalk.gray("Aún no hay ventas registradas."));

  const totalVendidos = historialVentas.reduce((acc, v) => acc + v.precio * v.cantidad, 0);
  console.log(chalk.cyan(`\nResumen general: ${historialVentas.length} ítems vendidos | Total S/${totalVendidos.toFixed(2)}\n`));
};
