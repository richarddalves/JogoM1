/**
 * Funções relacionadas a botões UI
 */
(function () {
  /**
   * Cria um botão estilizado e interativo
   * @param {Phaser.Scene} scene - A cena atual
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função a ser chamada quando clicado
   * @param {Object} style - Estilo personalizado (opcional)
   * @returns {Phaser.GameObjects.Container} - Container com o botão e texto
   * @static
   */
  UIComponents.createButton = function (scene, x, y, text, callback, style = {}) {
    // Verificar parâmetros essenciais
    if (!scene || !scene.add) {
      console.error("❌ Cena inválida fornecida para createButton");
      return null;
    }

    // Definir estilos padrão
    const defaultStyle = {
      width: 200,
      height: 50,
      fontSize: 20,
      fontFamily: "'Chakra Petch', sans-serif",
      color: "#FFFFFF",
      backgroundColor: 0x0d84ff,
      backgroundColorOver: 0x39f5e2,
      backgroundColorDown: 0x084ea5,
      borderWidth: 2,
      borderColor: 0x39f5e2,
      borderRadius: 10,
      shadowColor: 0x000000,
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      scale: 1,
      originX: 0.5,
      originY: 0.5,
      icon: null,
      iconScale: 0.5,
      iconPosition: "left",
      iconOffset: 30,
      textOffset: 0,
      textShadow: true,
      soundEffects: true,
      glowEffect: true,
    };

    // Mesclar estilos padrão com personalizados
    const finalStyle = { ...defaultStyle, ...style };

    try {
      // Criar container
      const container = scene.add.container(x, y);

      // Sombra (como objeto separado para efeito de profundidade)
      if (finalStyle.shadowBlur > 0) {
        const shadow = scene.add.graphics();
        shadow.fillStyle(finalStyle.shadowColor, 0.3);
        shadow.fillRoundedRect(-finalStyle.width / 2 + finalStyle.shadowOffsetX, -finalStyle.height / 2 + finalStyle.shadowOffsetY, finalStyle.width, finalStyle.height, finalStyle.borderRadius);
        container.add(shadow);
        container.shadow = shadow;
      }

      // Usar DrawingUtils para melhor visão
      if (window.drawCyberButton) {
        // Criar o background com a função avançada
        const buttonBg = scene.add.graphics();
        window.drawCyberButton(buttonBg, 0, 0, finalStyle.width, finalStyle.height, {
          fillColor: finalStyle.backgroundColor,
          strokeColor: finalStyle.borderColor,
          strokeWidth: finalStyle.borderWidth,
          cornerRadius: finalStyle.borderRadius,
          glowEffect: finalStyle.glowEffect,
        });
        container.add(buttonBg);
        container.buttonBg = buttonBg;
      } else {
        // Fallback: criar background diretamente
        const buttonBg = scene.add.graphics();
        buttonBg.fillStyle(finalStyle.backgroundColor, 1);
        buttonBg.fillRoundedRect(-finalStyle.width / 2, -finalStyle.height / 2, finalStyle.width, finalStyle.height, finalStyle.borderRadius);

        buttonBg.lineStyle(finalStyle.borderWidth, finalStyle.borderColor, 1);
        buttonBg.strokeRoundedRect(-finalStyle.width / 2, -finalStyle.height / 2, finalStyle.width, finalStyle.height, finalStyle.borderRadius);

        container.add(buttonBg);
        container.buttonBg = buttonBg;
      }

      // Adicionar ícone se especificado
      if (finalStyle.icon) {
        let iconX = 0;

        // Calcular posição do ícone com base no alinhamento
        if (finalStyle.iconPosition === "left") {
          iconX = -finalStyle.width / 2 + finalStyle.iconOffset;
        } else if (finalStyle.iconPosition === "right") {
          iconX = finalStyle.width / 2 - finalStyle.iconOffset;
        }

        try {
          const buttonIcon = scene.add.image(iconX, 0, finalStyle.icon).setScale(finalStyle.iconScale).setOrigin(0.5);

          container.add(buttonIcon);
          container.buttonIcon = buttonIcon;

          // Ajustar posição do texto se houver ícone
          if (finalStyle.iconPosition === "left") {
            finalStyle.textOffset = 15;
          } else if (finalStyle.iconPosition === "right") {
            finalStyle.textOffset = -15;
          }
        } catch (e) {
          console.warn(`⚠️ Não foi possível adicionar o ícone '${finalStyle.icon}':`, e);
          // Restaurar offset do texto
          finalStyle.textOffset = 0;
        }
      }

      // Adicionar texto
      const textOptions = {
        fontSize: finalStyle.fontSize + "px",
        fontFamily: finalStyle.fontFamily,
        fill: finalStyle.color,
        align: "center",
      };

      // Adicionar sombra no texto se configurado
      if (finalStyle.textShadow) {
        textOptions.stroke = "#000000";
        textOptions.strokeThickness = 2;
        textOptions.shadow = {
          offsetX: 1,
          offsetY: 1,
          color: "#000000",
          blur: 2,
          fill: true,
        };
      }

      const buttonText = scene.add.text(finalStyle.textOffset, 0, text, textOptions).setOrigin(0.5);

      container.add(buttonText);
      container.buttonText = buttonText;

      // Configurar área interativa
      const hitArea = new Phaser.Geom.Rectangle(-finalStyle.width / 2, -finalStyle.height / 2, finalStyle.width, finalStyle.height);

      container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      // Adicionar eventos de interação
      container.on("pointerover", () => {
        this.updateButtonState(container, "hover", finalStyle);

        // Som de hover (se disponível e habilitado)
        if (finalStyle.soundEffects && scene.sound && scene.sound.get && scene.sound.get("hover_sound")) {
          scene.sound.play("hover_sound", { volume: 0.2 });
        }
      });

      container.on("pointerout", () => {
        this.updateButtonState(container, "normal", finalStyle);
      });

      container.on("pointerdown", () => {
        this.updateButtonState(container, "down", finalStyle);

        // Som de clique (se disponível e habilitado)
        if (finalStyle.soundEffects && scene.sound && scene.sound.get && scene.sound.get("click_sound")) {
          scene.sound.play("click_sound", { volume: 0.5 });
        }
      });

      container.on("pointerup", () => {
        this.updateButtonState(container, "hover", finalStyle);

        if (callback) {
          callback();
        }
      });

      // Definir escala inicial
      container.setScale(finalStyle.scale);

      // Adicionar métodos para controle do botão
      container.setEnabled = (enabled) => {
        if (enabled) {
          container.setAlpha(1);
          container.setInteractive();
        } else {
          container.setAlpha(0.5);
          container.disableInteractive();
        }

        container.enabled = enabled;
        return container;
      };

      container.setText = (newText) => {
        buttonText.setText(newText);
        return container;
      };

      container.setTextColor = (color) => {
        buttonText.setColor(color);
        return container;
      };

      // Estado inicial
      container.enabled = true;

      return container;
    } catch (error) {
      console.error("❌ Erro ao criar botão:", error);
      return null;
    }
  };

  /**
   * Cria um botão de fechar estilizado (X)
   * @param {Phaser.Scene} scene - A cena atual
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {Object} style - Estilo personalizado (opcional)
   * @returns {Phaser.GameObjects.Container} - Container do botão
   * @private
   * @static
   */
  UIComponents.createCloseButton = function (scene, x, y, style = {}) {
    // Definir estilos padrão
    const defaultStyle = {
      size: 24,
      backgroundColor: 0xff3a3a,
      hoverColor: 0xff6666,
      textColor: "#FFFFFF",
    };

    // Mesclar estilos
    const finalStyle = { ...defaultStyle, ...style };

    try {
      // Criar container
      const container = scene.add.container(x, y);

      // Fundo do botão
      const bg = scene.add.graphics();
      bg.fillStyle(finalStyle.backgroundColor, 1);
      bg.fillCircle(0, 0, finalStyle.size / 2);

      // Texto "X"
      const text = scene.add
        .text(0, 0, "X", {
          fontSize: finalStyle.size * 0.6 + "px",
          fontFamily: "'Chakra Petch', sans-serif",
          fill: finalStyle.textColor,
        })
        .setOrigin(0.5);

      // Adicionar ao container
      container.add([bg, text]);

      // Interatividade
      container.setInteractive(new Phaser.Geom.Circle(0, 0, finalStyle.size / 2), Phaser.Geom.Circle.Contains);

      // Eventos
      container.on("pointerover", () => {
        bg.clear();
        bg.fillStyle(finalStyle.hoverColor, 1);
        bg.fillCircle(0, 0, finalStyle.size / 2);

        scene.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100,
        });
      });

      container.on("pointerout", () => {
        bg.clear();
        bg.fillStyle(finalStyle.backgroundColor, 1);
        bg.fillCircle(0, 0, finalStyle.size / 2);

        scene.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
        });
      });

      return container;
    } catch (error) {
      console.error("❌ Erro ao criar botão de fechar:", error);
      return null;
    }
  };

  console.log("✅ Módulo de Botões UI carregado");
})();
