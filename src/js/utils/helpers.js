// Adiciona evento de clique para expandir explicações no mandamentos LGPD
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll(".mandamento").length > 0) {
    document.querySelectorAll(".mandamento").forEach((item) => {
      item.addEventListener("click", (event) => {
        const explanation = event.currentTarget.nextElementSibling;
        const iconLab = event.currentTarget.querySelector(".icon-lab");

        if (explanation.classList.contains("open")) {
          explanation.classList.remove("open");
          iconLab.classList.remove("rotated");
        } else {
          // Fecha outros itens abertos
          document.querySelectorAll(".explanation.open").forEach((openItem) => {
            openItem.classList.remove("open");
            openItem.previousElementSibling.querySelector(".icon-lab").classList.remove("rotated");
          });

          // Abre o item atual
          explanation.classList.add("open");
          iconLab.classList.add("rotated");

          // Simula o efeito de digitação
          const text = explanation.textContent.trim();
          explanation.textContent = "";

          let i = 0;
          const typeEffect = setInterval(() => {
            if (i < text.length) {
              explanation.textContent += text.charAt(i);
              i++;
            } else {
              clearInterval(typeEffect);
            }
          }, 10);
        }
      });
    });
  }
});

// Função auxiliar para formatar textos
window.formatText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
