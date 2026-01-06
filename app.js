
// 👉 PEGA AQUÍ TU LINK CSV DE GOOGLE SHEETS
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

// 2️⃣ Al escanear
function onScanSuccess(text) {
  const codigoEscaneado = text
    .replace(/\*/g, "")
    .trim()
    .toUpperCase();

  const prenda = prendas.find(p =>
    p.codigo.trim().toUpperCase() === codigoEscaneado
  );

  const cont = document.getElementById("resultado");

  if (!prenda) {
    cont.style.display = "block";
    cont.innerHTML = "❌ Código no encontrado";
    return;
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
}


// 3️⃣ Iniciar cámara
const scanner = new Html5Qrcode("reader");

scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  onScanSuccess
);
