// Importar SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAlTpiJofRGk5a-bT99K2bAcvO7fumNS34",
  authDomain: "misquincevalentina-d348e.firebaseapp.com",
  projectId: "misquincevalentina-d348e",
  storageBucket: "misquincevalentina-d348e.firebasestorage.app",
  messagingSenderId: "849619986001",
  appId: "1:849619986001:web:5bd61ee9b15f4cfec63a70"
};

// Inicializar Firebase y Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elementos del DOM
const wishForm = document.getElementById('wishForm');
const wishesContainer = document.getElementById('wishesContainer');
const verDeseosBtn = document.getElementById('verDeseosBtn');
const magicSound = document.getElementById('magicSound');
const magicEffect = document.getElementById('magicEffect');

let deseosVisibles = false;

// Función para mostrar brillitos mágicos
function showMagicSparkles() {
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = Math.random() * window.innerHeight + "px";
    magicEffect.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

// Guardar buen deseo
wishForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !mensaje) {
    alert("Por favor completa ambos campos.");
    return;
  }

  try {
    await push(ref(database, 'buenos_deseos'), {
      nombre,
      mensaje,
      fecha: new Date().toISOString()
    });

    magicSound.play();
    showMagicSparkles();

    alert("¡Gracias por tu mensaje!");
    wishForm.reset();
  } catch (error) {
    console.error("Error al guardar el deseo:", error);
  }
});

// Ver/Ocultar deseos
verDeseosBtn.addEventListener('click', () => {
  if (!deseosVisibles) {
    wishesContainer.innerHTML = "<p>Cargando deseos...</p>";

    const deseosRef = ref(database, 'buenos_deseos');
    onValue(deseosRef, (snapshot) => {
      wishesContainer.innerHTML = "";

      if (!snapshot.exists()) {
        wishesContainer.innerHTML = "<p>No hay deseos aún 💌</p>";
        return;
      }

      const data = snapshot.val();
      Object.values(data).forEach(deseo => {
        wishesContainer.innerHTML += `
          <div class="wish-card">
            <strong>${deseo.nombre}</strong><br/>
            <em>${deseo.mensaje}</em>
          </div>
        `;
      });

      verDeseosBtn.textContent = "Ocultar buenos deseos";
      deseosVisibles = true;
    });
  } else {
    wishesContainer.innerHTML = "";
    verDeseosBtn.textContent = "Ver buenos deseos";
    deseosVisibles = false;
  }
});

