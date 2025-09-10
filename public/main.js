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
  resultDiv.innerHTML = `<p>Cargando plan de dieta...</p>`;

  try {
    const response = await fetch(`/diet?calories=${calories}&diet=${diet}`);
    const data = await response.json();

    resultDiv.innerHTML = `
      <h2 class="fade-in">${data.message}</h2>
      <div class="meal fade-in"><h3>Desayuno</h3><p>${data.plan.breakfast}</p></div>
      <div class="meal fade-in"><h3>Almuerzo</h3><p>${data.plan.lunch}</p></div>
      <div class="meal fade-in"><h3>Cena</h3><p>${data.plan.dinner}</p></div>
    `;

    // Animación staggered
    const meals = resultDiv.querySelectorAll(".meal");
    meals.forEach((meal, i) => meal.style.animationDelay = `${i * 0.2}s`);

  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<p style="color:red;">Error al generar el plan de dieta. Intenta de nuevo.</p>`;
  }
}

// Evento del botón
const generateBtn = document.querySelector(".form-container button");
generateBtn.addEventListener("click", getDiet);
