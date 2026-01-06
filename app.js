

const API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQqyxK5J8LVHzdAKQOmbOqwjExJFw-k4anUd7LmAviJ71RvI6WuzqF5sBgX_zaLzgie2KJVmtx9t6Um/pub?output=csv";

let prendas = [];

// 1️⃣ Cargar BD
fetch(API_URL)
  .then(res => res.text())
  .then(csv => {
    const filas = csv.split("\n");
    const headers = filas[0].split(",").map(h => h.trim());

    prendas = filas.slice(1).map(fila => {
      const valores = fila.split(",");
      let obj = {};
      headers.forEach((h, i) => obj[h] = valores[i]?.trim());
      return obj;
    });

    console.log("BD cargada:", prendas);
  })
  .catch(err => console.error("Error cargando BD", err));

  

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIS3QcUcqgZC0bNm5uelWP8hs5X9t7PlMWs6145cQeHFVxwGanFGRN1bh1zLXWfl7-kg/exec";

function enviarASheets(prenda) {
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(prenda)
  })
  .then(() => {
    console.log("☁️ Registro enviado a Google Sheets:", prenda.codigo);
  })
  .catch(err => {
    console.error("❌ Error enviando a Sheets", err);
  });
}


// 2️⃣ Al escanear
// function onScanSuccess(text) {
//   const codigoEscaneado = text
//     .replace(/\*/g, "")
//     .trim()
//     .toUpperCase();

//   const prenda = prendas.find(p =>
//     p.codigo.trim().toUpperCase() === codigoEscaneado
//   );

//   const cont = document.getElementById("resultado");

//   if (!prenda) {
//     cont.style.display = "block";
//     cont.innerHTML = "❌ Código no encontrado";
//     return;
//   }


function onScanSuccess(code) {
  const codigo = code.trim();

  console.log("📥 Código escaneado:", codigo);

  // Buscar prenda en la BD cargada
  const prenda = prendas.find(p => p.codigo === codigo);

  if (!prenda) {
    alert("❌ Código no encontrado");
    return;
  }

  // Validar duplicados
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const yaExiste = registros.some(r => r.codigo === codigo);

  if (yaExiste) {
    alert("⚠️ Este código ya fue registrado");
    return;
  }

  // Guardar registro
  guardarRegistro(prenda);
  enviarASheets(prenda);


  // Mostrar confirmación
  alert("✅ Registro guardado correctamente");

  console.log("✅ Registro completo:", prenda);
}




  cont.style.display = "block";
  cont.innerHTML = `
    <b>📌 Código:</b> ${prenda.codigo}<br>
    <b>👕 Categoría:</b> ${prenda.categoria}<br>
    <b>📦 Caja:</b> ${prenda.n_caja}<br>
    <b>🤝 Donador:</b> ${prenda.donador}<br>
    <b>🔄 Etapa:</b> ${prenda.etapa}<br>
    <b>📅 Fecha:</b> ${prenda.fecha}
  `;



// 3️⃣ Iniciar cámara
const scanner = new Html5Qrcode("reader");

scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  onScanSuccess
);




function guardarRegistro(prenda) {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];

  registros.push({
    fecha_scan: new Date().toISOString(),
    codigo: prenda.codigo,
    categoria: prenda.categoria,
    n_caja: prenda.n_caja,
    donador: prenda.donador,
    etapa: prenda.etapa
  });

  localStorage.setItem("registros", JSON.stringify(registros));

  console.log("💾 Registro guardado:", prenda.codigo);
}


