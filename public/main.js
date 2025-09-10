// Modo oscuro
const darkModeBtn = document.getElementById("darkModeToggle");
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Función para obtener dieta
async function getDiet() {
  const calories = document.getElementById("calories").value || 2000;
  const diet = document.getElementById("diet").value;

  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `<p>Cargando planes de dieta...</p>`;

  try {
    const response = await fetch(`/diet?calories=${calories}&diet=${diet}`);
    const data = await response.json();

    // Aquí recorremos el array de opciones
    resultDiv.innerHTML = `<h2 class="fade-in">${data.message}</h2>`;

    data.options.forEach((plan, index) => {
      const planHTML = `
        <div class="plan fade-in">
          <h3>Opción ${index + 1}</h3>
          <div class="meal"><h4>Desayuno</h4><p>${plan.breakfast}</p></div>
          <div class="meal"><h4>Almuerzo</h4><p>${plan.lunch}</p></div>
          <div class="meal"><h4>Cena</h4><p>${plan.dinner}</p></div>
        </div>
      `;
      resultDiv.innerHTML += planHTML;
    });

    // Animación staggered para todos los bloques
    const meals = resultDiv.querySelectorAll(".meal, .plan");
    meals.forEach((meal, i) => {
      meal.style.animationDelay = `${i * 0.2}s`;
    });

  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<p style="color:red;">Error al generar los planes de dieta. Intenta de nuevo.</p>`;
  }
}

// Evento del botón
const generateBtn = document.querySelector(".form-container button");
generateBtn.addEventListener("click", getDiet);
