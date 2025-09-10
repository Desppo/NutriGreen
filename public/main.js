// Modo oscuro

document.querySelector('.theme-toggle').addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Cambiar ícono según el modo
            const icon = this.querySelector('svg');
            if (document.body.classList.contains('dark-mode')) {
                icon.innerHTML = '<path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/>';
            } else {
                icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            }
        });

// Obtener dieta
async function getDiet() {
  const calories = document.getElementById("calories").value || 2000;
  const diet = document.getElementById("diet").value;

  if (isNaN(calories)) {
    alert("Por favor ingresa un número válido.");
    return;
  }

  if (calories < 1200) calories = 1200;
  if (calories > 2500) calories = 2500;

  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `<p>Cargando planes de dieta...</p>`;

  try {
    const response = await fetch(`/diet?calories=${calories}&diet=${diet}`);
    const data = await response.json();

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
