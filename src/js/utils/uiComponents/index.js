/**
 * Biblioteca de componentes de UI reutilizáveis para o jogo
 * @class UIComponents
 * @description Fornece métodos para criar e gerenciar elementos de interface do usuário
 */

// Função para carregar scripts dinamicamente
(function () {
  function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback || function () {};
    document.head.appendChild(script);
  }

  // Carregar scripts de módulos dos componentes UI
  const uiComponentsModules = ["buttons.js", "dialogs.js", "panels.js", "progress.js"];

  const uiComponentsPath = "src/js/utils/uiComponents/";
  let loadedCount = 0;

  uiComponentsModules.forEach((module) => {
    loadScript(uiComponentsPath + module, function () {
      loadedCount++;
      if (loadedCount === uiComponentsModules.length) {
        console.log("✅ Todos os módulos de UIComponents carregados com sucesso!");
      }
    });
  });
})();

class UIComponents {
  /**
   * Métodos comuns e auxiliares
   */

  /**
   * Atualiza o estado visual do botão
   * @param {Phaser.GameObjects.Container} container - Container do botão
   * @param {string} state - Estado do botão ('normal', 'hover', 'down')
   * @param {Object} style - Estilo do botão
   * @private
   * @static
   */
  static updateButtonState(container, state, style) {
    if (!container || !container.buttonBg) return;

    const scene = container.scene;
    const buttonBg = container.buttonBg;

    // Determinar cores com base no estado
    let bgColor, borderColor, scale;

    switch (state) {
      case "hover":
        bgColor = style.backgroundColorOver;
        borderColor = style.borderColor;
        scale = 1.05;
        break;
      case "down":
        bgColor = style.backgroundColorDown;
        borderColor = style.borderColor;
        scale = 0.95;
        break;
      case "normal":
      default:
        bgColor = style.backgroundColor;
        borderColor = style.borderColor;
        scale = 1;
        break;
    }

    // Atualizar visualmente (se DrawingUtils estiver disponível)
    if (window.drawCyberButton) {
      buttonBg.clear();
      window.drawCyberButton(buttonBg, 0, 0, style.width, style.height, {
        fillColor: bgColor,
        strokeColor: borderColor,
        strokeWidth: style.borderWidth,
        cornerRadius: style.borderRadius,
        glowEffect: style.glowEffect && state === "hover",
      });
    } else {
      // Fallback: redesenhar diretamente
      buttonBg.clear();
      buttonBg.fillStyle(bgColor, 1);
      buttonBg.fillRoundedRect(-style.width / 2, -style.height / 2, style.width, style.height, style.borderRadius);

      buttonBg.lineStyle(style.borderWidth, borderColor, 1);
      buttonBg.strokeRoundedRect(-style.width / 2, -style.height / 2, style.width, style.height, style.borderRadius);
    }

    // Animação de escala
    scene.tweens.add({
      targets: container,
      scaleX: scale * style.scale,
      scaleY: scale * style.scale,
      duration: 100,
      ease: "Power1",
    });
  }
}

// Registro para debugging
console.log("🎮 UIComponents carregado com sucesso!");
