/**
 * Biblioteca de componentes de UI reutilizáveis para o jogo
 * @class UIComponents
 * @description Fornece métodos para criar e gerenciar elementos de interface do usuário
 */
class UIComponents {
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
  static createButton(scene, x, y, text, callback, style = {}) {
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
  }

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

  /**
   * Cria um painel de diálogo estilizado
   * @param {Phaser.Scene} scene - A cena atual
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {number} width - Largura do painel
   * @param {number} height - Altura do painel
   * @param {Object} style - Estilo personalizado (opcional)
   * @returns {Phaser.GameObjects.Container} - Container do painel
   * @static
   */
  static createPanel(scene, x, y, width, height, style = {}) {
    // Verificar parâmetros essenciais
    if (!scene || !scene.add) {
      console.error("❌ Cena inválida fornecida para createPanel");
      return null;
    }

    // Definir estilos padrão
    const defaultStyle = {
      backgroundColor: 0x111927,
      borderColor: 0x0d84ff,
      borderColorSecondary: 0x39f5e2,
      borderWidth: 2,
      borderRadius: 10,
      alpha: 0.9,
      shadowColor: 0x000000,
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      header: false,
      headerHeight: 40,
      headerColor: 0x0d84ff,
      title: null,
      titleSize: 22,
      titleColor: "#FFFFFF",
      closeButton: false,
      cyberpunk: true,
      scanlines: true,
      topLight: true,
    };

    // Mesclar estilos padrão com personalizados
    const finalStyle = { ...defaultStyle, ...style };

    try {
      // Criar container
      const container = scene.add.container(x, y);

      // Adicionar sombra
      if (finalStyle.shadowBlur > 0) {
        const shadow = scene.add.graphics();
        shadow.fillStyle(finalStyle.shadowColor, 0.5);
        shadow.fillRoundedRect(-width / 2 + finalStyle.shadowOffsetX, -height / 2 + finalStyle.shadowOffsetY, width, height, finalStyle.borderRadius);
        container.add(shadow);
        container.shadow = shadow;
      }

      // Usar DrawingUtils se disponível
      if (window.drawCyberPanel && finalStyle.cyberpunk) {
        const panelBg = scene.add.graphics();
        window.drawCyberPanel(panelBg, 0, 0, width, height, {
          fillColor: finalStyle.backgroundColor,
          strokeColor: finalStyle.borderColor,
          strokeWidth: finalStyle.borderWidth,
          cornerRadius: finalStyle.borderRadius,
          alpha: finalStyle.alpha,
          header: finalStyle.header,
          headerHeight: finalStyle.headerHeight,
          headerColor: finalStyle.headerColor,
          topLight: finalStyle.topLight,
          topLightColor: finalStyle.borderColorSecondary,
        });
        container.add(panelBg);
        container.panelBg = panelBg;
      } else {
        // Fallback: criar fundo do painel diretamente
        const panelBg = scene.add.graphics();
        panelBg.fillStyle(finalStyle.backgroundColor, finalStyle.alpha);
        panelBg.fillRoundedRect(-width / 2, -height / 2, width, height, finalStyle.borderRadius);

        panelBg.lineStyle(finalStyle.borderWidth, finalStyle.borderColor, finalStyle.alpha);
        panelBg.strokeRoundedRect(-width / 2, -height / 2, width, height, finalStyle.borderRadius);

        // Adicionar cabeçalho se necessário
        if (finalStyle.header) {
          panelBg.fillStyle(finalStyle.headerColor, finalStyle.alpha);

          // Cabeçalho com cantos arredondados apenas no topo
          const headerRadius = {
            tl: finalStyle.borderRadius,
            tr: finalStyle.borderRadius,
            bl: 0,
            br: 0,
          };

          panelBg.fillRoundedRect(-width / 2, -height / 2, width, finalStyle.headerHeight, headerRadius);
        }

        container.add(panelBg);
        container.panelBg = panelBg;
      }

      // Adicionar efeito de scanlines se habilitado
      if (finalStyle.scanlines && window.drawScanlines) {
        const scanlineGraphics = scene.add.graphics();
        window.drawScanlines(scanlineGraphics, -width / 2, -height / 2, width, height, {
          alpha: 0.1,
        });
        container.add(scanlineGraphics);
        container.scanlines = scanlineGraphics;
      }

      // Adicionar título se fornecido
      if (finalStyle.title) {
        const titleY = finalStyle.header ? -height / 2 + finalStyle.headerHeight / 2 : -height / 2 + 25;

        const titleText = scene.add
          .text(0, titleY, finalStyle.title, {
            fontSize: finalStyle.titleSize + "px",
            fontFamily: "'Chakra Petch', sans-serif",
            fill: finalStyle.titleColor,
            fontWeight: "bold",
          })
          .setOrigin(0.5);

        container.add(titleText);
        container.titleText = titleText;
      }

      // Adicionar botão de fechar se habilitado
      if (finalStyle.closeButton) {
        const closeBtn = this.createCloseButton(scene, width / 2 - 20, -height / 2 + 20);

        container.add(closeBtn);
        container.closeBtn = closeBtn;
      }

      // Adicionar métodos para gestão de conteúdo
      container.addContent = (gameObject) => {
        container.add(gameObject);
        return gameObject;
      };

      container.clearContents = () => {
        // Preservar objetos essenciais do painel
        const essential = [container.shadow, container.panelBg, container.scanlines, container.titleText, container.closeBtn].filter((item) => item !== undefined);

        // Remover tudo exceto os essenciais
        const children = [...container.list];
        for (const child of children) {
          if (!essential.includes(child)) {
            container.remove(child);
          }
        }

        return container;
      };

      return container;
    } catch (error) {
      console.error("❌ Erro ao criar painel:", error);
      return null;
    }
  }

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
  static createCloseButton(scene, x, y, style = {}) {
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
  }

  /**
   * Cria uma barra de progresso estilizada
   * @param {Phaser.Scene} scene - A cena atual
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {number} width - Largura da barra
   * @param {number} height - Altura da barra
   * @param {number} value - Valor inicial (0-1)
   * @param {Object} style - Estilo personalizado (opcional)
   * @returns {Object} - Objeto com a barra e métodos para atualizá-la
   * @static
   */
  static createProgressBar(scene, x, y, width, height, value = 0, style = {}) {
    // Verificar parâmetros essenciais
    if (!scene || !scene.add) {
      console.error("❌ Cena inválida fornecida para createProgressBar");
      return null;
    }

    // Validar valor
    value = Math.max(0, Math.min(1, value));

    // Definir estilos padrão
    const defaultStyle = {
      backgroundColor: 0x222222,
      fillColor: 0x0d84ff,
      fillColorSecondary: 0x39f5e2,
      borderColor: 0x444444,
      borderWidth: 2,
      borderRadius: 5,
      showLabel: false,
      labelStyle: {
        fontSize: "16px",
        fontFamily: "'Chakra Petch', sans-serif",
        fill: "#FFFFFF",
        fontWeight: "bold",
      },
      animate: true,
      animationDuration: 500,
      animationEase: "Cubic.easeOut",
      gradient: true,
      glowEffect: true,
    };

    // Mesclar estilos padrão com personalizados
    const finalStyle = { ...defaultStyle, ...style };

    try {
      // Criar container
      const container = scene.add.container(x, y);

      // Determinar se usar DrawingUtils
      const useDrawingUtils = window.drawProgressBar && finalStyle.glowEffect;

      // Criar elementos visuais
      let barBg, fill, label;

      // Desenhar a barra usando DrawingUtils
      if (useDrawingUtils) {
        barBg = scene.add.graphics();
        fill = scene.add.graphics();

        // Desenhar fundo
        window.drawProgressBar(
          barBg,
          -width / 2,
          -height / 2,
          width,
          height,
          0, // Valor 0 para o fundo
          {
            bgColor: finalStyle.backgroundColor,
            fillColor: finalStyle.fillColor,
            borderColor: finalStyle.borderColor,
            cornerRadius: finalStyle.borderRadius,
            gradient: false,
          }
        );

        // Desenhar preenchimento inicial
        window.drawProgressBar(fill, -width / 2, -height / 2, width, height, value, {
          bgColor: 0x000000, // Transparente
          fillColor: finalStyle.fillColor,
          gradientColor: finalStyle.fillColorSecondary,
          cornerRadius: finalStyle.borderRadius,
          gradient: finalStyle.gradient,
        });
      } else {
        // Fallback: criar barra de progresso diretamente
        barBg = scene.add.graphics();
        barBg.fillStyle(finalStyle.backgroundColor, 1);
        barBg.fillRoundedRect(-width / 2, -height / 2, width, height, finalStyle.borderRadius);

        if (finalStyle.borderWidth > 0) {
          barBg.lineStyle(finalStyle.borderWidth, finalStyle.borderColor, 1);
          barBg.strokeRoundedRect(-width / 2, -height / 2, width, height, finalStyle.borderRadius);
        }

        // Preenchimento
        fill = scene.add.graphics();
        fill.fillStyle(finalStyle.fillColor, 1);
        const fillWidth = width * value;
        fill.fillRoundedRect(-width / 2, -height / 2, fillWidth, height, finalStyle.borderRadius);
      }

      // Adicionar elementos ao container
      container.add(barBg);
      container.add(fill);

      // Adicionar label se necessário
      if (finalStyle.showLabel) {
        const percentage = Math.round(value * 100);
        label = scene.add.text(0, 0, `${percentage}%`, finalStyle.labelStyle).setOrigin(0.5);

        container.add(label);
      }

      // Método para atualizar o valor da barra
      const updateValue = (newValue, animate = finalStyle.animate) => {
        // Validar novo valor
        newValue = Math.max(0, Math.min(1, newValue));

        // Atualizar label se existir
        if (finalStyle.showLabel && label) {
          const percentage = Math.round(newValue * 100);
          label.setText(`${percentage}%`);
        }

        // Determinar como atualizar o preenchimento
        if (useDrawingUtils) {
          // Animação ou atualização imediata
          if (animate) {
            // Valor para animação
            const currentValue = fill.getData("value") || 0;

            // Criar novo gráfico para transição
            const newFill = scene.add.graphics();

            // Configurar animação
            scene.tweens.add({
              targets: { value: currentValue },
              value: newValue,
              duration: finalStyle.animationDuration,
              ease: finalStyle.animationEase,
              onUpdate: (tween) => {
                const val = tween.getValue();

                // Limpar e redesenhar
                newFill.clear();
                window.drawProgressBar(newFill, -width / 2, -height / 2, width, height, val, {
                  bgColor: 0x000000, // Transparente
                  fillColor: finalStyle.fillColor,
                  gradientColor: finalStyle.fillColorSecondary,
                  cornerRadius: finalStyle.borderRadius,
                  gradient: finalStyle.gradient,
                });
              },
              onComplete: () => {
                // Substituir o gráfico antigo
                fill.destroy();
                fill = newFill;
                fill.setData("value", newValue);
                container.add(fill);
              },
            });
          } else {
            // Atualização imediata
            fill.clear();
            window.drawProgressBar(fill, -width / 2, -height / 2, width, height, newValue, {
              bgColor: 0x000000, // Transparente
              fillColor: finalStyle.fillColor,
              gradientColor: finalStyle.fillColorSecondary,
              cornerRadius: finalStyle.borderRadius,
              gradient: finalStyle.gradient,
            });
            fill.setData("value", newValue);
          }
        } else {
          // Fallback: atualização simples
          const fillWidth = width * newValue;

          if (animate) {
            // Animação
            scene.tweens.add({
              targets: fill,
              scaleX: newValue,
              duration: finalStyle.animationDuration,
              ease: finalStyle.animationEase,
            });
          } else {
            // Atualização imediata
            fill.clear();
            fill.fillStyle(finalStyle.fillColor, 1);
            fill.fillRoundedRect(-width / 2, -height / 2, fillWidth, height, finalStyle.borderRadius);
          }
        }

        return container;
      };

      // Armazenar valor atual
      fill.setData("value", value);

      // Retornar objeto com container e método de atualização
      return {
        container,
        updateValue,
        getValue: () => fill.getData("value") || 0,
      };
    } catch (error) {
      console.error("❌ Erro ao criar barra de progresso:", error);
      return null;
    }
  }

  /**
   * Cria um balão de diálogo estilizado
   * @param {Phaser.Scene} scene - A cena atual
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto a ser exibido
   * @param {Object} style - Estilo personalizado (opcional)
   * @returns {Phaser.GameObjects.Container} - Container do balão
   * @static
   */
  static createDialogBubble(scene, x, y, text, style = {}) {
    // Verificar parâmetros essenciais
    if (!scene || !scene.add) {
      console.error("❌ Cena inválida fornecida para createDialogBubble");
      return null;
    }

    // Definir estilos padrão
    const defaultStyle = {
      width: 300,
      padding: 15,
      backgroundColor: 0x111927,
      borderColor: 0x0d84ff,
      borderWidth: 2,
      borderRadius: 10,
      textStyle: {
        fontSize: "18px",
        fontFamily: "'Chakra Petch', sans-serif",
        fill: "#FFFFFF",
        wordWrap: { width: 270 },
      },
      pointerDirection: "bottom", // 'top', 'bottom', 'left', 'right'
      pointerSize: 20,
      alpha: 0.9,
      autoSize: true,
      timeout: 0, // 0 = sem timeout
      typewriterEffect: false,
      typewriterSpeed: 30,
      cyberpunk: true,
      glowEffect: false,
    };

    // Mesclar estilos padrão com personalizados
    const finalStyle = { ...defaultStyle, ...style };

    try {
      // Criar container
      const container = scene.add.container(x, y);

      // Criar texto para determinar altura se autoSize for true
      const textObject = scene.add.text(0, 0, text, finalStyle.textStyle);
      const textWidth = Math.min(textObject.width + finalStyle.padding * 2, finalStyle.width);
      const textHeight = textObject.height + finalStyle.padding * 2;

      // Determinar dimensões do balão
      let bubbleWidth = finalStyle.autoSize ? textWidth : finalStyle.width;
      let bubbleHeight = finalStyle.autoSize ? textHeight : finalStyle.height || 100;

      // Desenhar balão de diálogo
      const bubble = scene.add.graphics();
      container.add(bubble);

      // Determinar se usar DrawingUtils
      if (window.drawCyberPanel && finalStyle.cyberpunk) {
        // Usar DrawingUtils para estilo cyberpunk
        window.drawCyberPanel(bubble, 0, 0, bubbleWidth, bubbleHeight, {
          fillColor: finalStyle.backgroundColor,
          strokeColor: finalStyle.borderColor,
          cornerRadius: finalStyle.borderRadius,
          alpha: finalStyle.alpha,
          topLight: true,
          shadow: true,
        });
      } else {
        // Fallback: desenhar balão tradicional
        bubble.fillStyle(finalStyle.backgroundColor, finalStyle.alpha);
        bubble.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, finalStyle.borderRadius);

        bubble.lineStyle(finalStyle.borderWidth, finalStyle.borderColor, finalStyle.alpha);
        bubble.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, finalStyle.borderRadius);
      }

      // Desenhar ponteiro (direção do balão)
      this.drawBubblePointer(bubble, bubbleWidth, bubbleHeight, finalStyle.pointerDirection, finalStyle.pointerSize, finalStyle.backgroundColor, finalStyle.borderColor, finalStyle.borderWidth, finalStyle.alpha);

      // Ajustar posição do texto
      textObject.setPosition(0, 0);
      textObject.setOrigin(0.5);

      // Ajustar quebra de texto
      if (finalStyle.textStyle.wordWrap) {
        textObject.setWordWrapWidth(bubbleWidth - finalStyle.padding * 2);
      }

      // Adicionar texto ao container
      container.add(textObject);

      // Efeito de digitação
      if (finalStyle.typewriterEffect) {
        this.applyTypewriterEffect(scene, textObject, text, finalStyle.typewriterSpeed);
      }

      // Efeito de entrada
      container.setAlpha(0);
      container.setScale(0.9);

      scene.tweens.add({
        targets: container,
        alpha: 1,
        scale: 1,
        duration: 200,
        ease: "Back.easeOut",
      });

      // Adicionar método para atualizar o texto
      container.updateText = (newText) => {
        // Armazenar texto atual
        container.currentText = newText;

        if (finalStyle.typewriterEffect) {
          this.applyTypewriterEffect(scene, textObject, newText, finalStyle.typewriterSpeed);
        } else {
          textObject.setText(newText);
        }

        // Recalcular tamanho se autoSize
        if (finalStyle.autoSize) {
          const newHeight = textObject.height + finalStyle.padding * 2;

          // Redesenhar o balão
          bubble.clear();

          if (window.drawCyberPanel && finalStyle.cyberpunk) {
            window.drawCyberPanel(bubble, 0, 0, bubbleWidth, newHeight, {
              fillColor: finalStyle.backgroundColor,
              strokeColor: finalStyle.borderColor,
              cornerRadius: finalStyle.borderRadius,
              alpha: finalStyle.alpha,
              topLight: true,
              shadow: true,
            });
          } else {
            bubble.fillStyle(finalStyle.backgroundColor, finalStyle.alpha);
            bubble.fillRoundedRect(-bubbleWidth / 2, -newHeight / 2, bubbleWidth, newHeight, finalStyle.borderRadius);

            bubble.lineStyle(finalStyle.borderWidth, finalStyle.borderColor, finalStyle.alpha);
            bubble.strokeRoundedRect(-bubbleWidth / 2, -newHeight / 2, bubbleWidth, newHeight, finalStyle.borderRadius);
          }

          // Redesenhar ponteiro
          this.drawBubblePointer(bubble, bubbleWidth, newHeight, finalStyle.pointerDirection, finalStyle.pointerSize, finalStyle.backgroundColor, finalStyle.borderColor, finalStyle.borderWidth, finalStyle.alpha);
        }

        return container;
      };

      // Fechar balão após tempo (opcional)
      if (finalStyle.timeout > 0) {
        scene.time.delayedCall(finalStyle.timeout, () => {
          scene.tweens.add({
            targets: container,
            alpha: 0,
            scale: 0.9,
            duration: 200,
            ease: "Back.easeIn",
            onComplete: () => {
              container.destroy();
            },
          });
        });
      }

      return container;
    } catch (error) {
      console.error("❌ Erro ao criar balão de diálogo:", error);
      return null;
    }
  }

  /**
   * Desenha o ponteiro do balão de diálogo
   * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico
   * @param {number} width - Largura do balão
   * @param {number} height - Altura do balão
   * @param {string} direction - Direção do ponteiro
   * @param {number} size - Tamanho do ponteiro
   * @param {number} fillColor - Cor de preenchimento
   * @param {number} strokeColor - Cor da borda
   * @param {number} strokeWidth - Largura da borda
   * @param {number} alpha - Transparência
   * @private
   * @static
   */
  static drawBubblePointer(graphics, width, height, direction, size, fillColor, strokeColor, strokeWidth, alpha) {
    try {
      graphics.fillStyle(fillColor, alpha);

      if (strokeColor !== null) {
        graphics.lineStyle(strokeWidth, strokeColor, alpha);
      }

      graphics.beginPath();

      switch (direction) {
        case "bottom":
          graphics.moveTo(-size / 2, height / 2);
          graphics.lineTo(0, height / 2 + size);
          graphics.lineTo(size / 2, height / 2);
          break;
        case "top":
          graphics.moveTo(-size / 2, -height / 2);
          graphics.lineTo(0, -height / 2 - size);
          graphics.lineTo(size / 2, -height / 2);
          break;
        case "left":
          graphics.moveTo(-width / 2, -size / 2);
          graphics.lineTo(-width / 2 - size, 0);
          graphics.lineTo(-width / 2, size / 2);
          break;
        case "right":
          graphics.moveTo(width / 2, -size / 2);
          graphics.lineTo(width / 2 + size, 0);
          graphics.lineTo(width / 2, size / 2);
          break;
      }

      graphics.closePath();
      graphics.fillPath();

      if (strokeColor !== null) {
        graphics.strokePath();
      }
    } catch (error) {
      console.error("❌ Erro ao desenhar ponteiro do balão:", error);
    }
  }

  /**
   * Aplica efeito de digitação (typewriter) a um texto
   * @param {Phaser.Scene} scene - A cena atual
   * @param {Phaser.GameObjects.Text} textObject - Objeto de texto
   * @param {string} fullText - Texto completo
   * @param {number} speed - Velocidade da digitação (ms por caractere)
   * @returns {Object} - Controlador do efeito
   * @private
   * @static
   */
  static applyTypewriterEffect(scene, textObject, fullText, speed = 30) {
    // Limpar texto inicial
    textObject.setText("");

    let index = 0;
    let timer;

    // Iniciar digitação
    const typeNextChar = () => {
      if (index < fullText.length) {
        textObject.setText(textObject.text + fullText.charAt(index));
        index++;

        // Som de digitação (se disponível)
        if (scene.sound && scene.sound.get && scene.sound.get("type_sound") && index % 3 === 0) {
          scene.sound.play("type_sound", { volume: 0.2 });
        }

        // Velocidade variável para pausas naturais
        let delay = speed;

        // Pausas mais longas para pontuação
        const currentChar = fullText.charAt(index - 1);
        if ([".", "!", "?"].includes(currentChar)) {
          delay = 300;
        } else if ([",", ";", ":"].includes(currentChar)) {
          delay = 150;
        }

        timer = scene.time.delayedCall(delay, typeNextChar);
      }
    };

    // Iniciar efeito após pequeno atraso
    timer = scene.time.delayedCall(200, typeNextChar);

    // Retornar controlador
    return {
      skip: () => {
        if (timer) {
          timer.remove();
        }
        textObject.setText(fullText);
      },
      pause: () => {
        if (timer) {
          timer.paused = true;
        }
      },
      resume: () => {
        if (timer) {
          timer.paused = false;
        }
      },
    };
  }

  /**
   * Exibe uma notificação temporária na tela
   * @param {Phaser.Scene} scene - A cena atual
   * @param {string} text - Texto da notificação
   * @param {Object} style - Estilo personalizado (opcional)
   * @static
   */
  static showNotification(scene, text, style = {}) {
    // Verificar parâmetros essenciais
    if (!scene || !scene.add) {
      console.error("❌ Cena inválida fornecida para showNotification");
      return;
    }

    // Definir estilos padrão
    const defaultStyle = {
      duration: 3000,
      position: "top", // 'top', 'bottom'
      backgroundColor: 0x0d84ff,
      textColor: "#FFFFFF",
      fontSize: 18,
      fontFamily: "'Chakra Petch', sans-serif",
      padding: 15,
      borderRadius: 8,
      width: 300,
      y: 50,
      icon: null, // Ícone opcional (texto emoji)
      cyberpunk: true,
    };

    // Mesclar estilos
    const finalStyle = { ...defaultStyle, ...style };

    try {
      // Calcular posição
      const x = scene.cameras.main.width / 2;
      let y = finalStyle.position === "top" ? finalStyle.y : scene.cameras.main.height - finalStyle.y;

      // Criar container para a notificação
      const container = scene.add.container(x, y);
      container.setDepth(9999); // Garantir que fique acima de tudo

      // Ajustar largura se o texto for muito longo
      const tempText = scene.add.text(0, 0, text, {
        fontSize: finalStyle.fontSize + "px",
        fontFamily: finalStyle.fontFamily,
      });

      const textWidth = tempText.width + finalStyle.padding * 3 + (finalStyle.icon ? finalStyle.fontSize * 2 : 0);

      const notificationWidth = Math.max(finalStyle.width, textWidth);
      tempText.destroy();

      // Criar fundo da notificação
      let notificationBg;

      if (window.drawCyberPanel && finalStyle.cyberpunk) {
        // Usar DrawingUtils para estilo cyberpunk
        notificationBg = scene.add.graphics();
        window.drawCyberPanel(notificationBg, 0, 0, notificationWidth, finalStyle.fontSize * 2 + finalStyle.padding, {
          fillColor: finalStyle.backgroundColor,
          strokeColor: 0xffffff,
          cornerRadius: finalStyle.borderRadius,
          alpha: 0.9,
          topLight: true,
          shadow: true,
        });
      } else {
        // Fallback: criar fundo diretamente
        notificationBg = scene.add.graphics();
        notificationBg.fillStyle(finalStyle.backgroundColor, 0.9);
        notificationBg.fillRoundedRect(-notificationWidth / 2, -(finalStyle.fontSize * 2 + finalStyle.padding) / 2, notificationWidth, finalStyle.fontSize * 2 + finalStyle.padding, finalStyle.borderRadius);

        notificationBg.lineStyle(2, 0xffffff, 0.5);
        notificationBg.strokeRoundedRect(-notificationWidth / 2, -(finalStyle.fontSize * 2 + finalStyle.padding) / 2, notificationWidth, finalStyle.fontSize * 2 + finalStyle.padding, finalStyle.borderRadius);
      }

      container.add(notificationBg);

      // Adicionar ícone se especificado
      let textX = 0;

      if (finalStyle.icon) {
        const icon = scene.add
          .text(-notificationWidth / 2 + finalStyle.padding * 1.5, 0, finalStyle.icon, {
            fontSize: finalStyle.fontSize * 1.2 + "px",
          })
          .setOrigin(0, 0.5);

        container.add(icon);

        // Ajustar posição do texto
        textX = icon.width / 2 + 5;
      }

      // Adicionar texto
      const notificationText = scene.add
        .text(textX, 0, text, {
          fontSize: finalStyle.fontSize + "px",
          fontFamily: finalStyle.fontFamily,
          fill: finalStyle.textColor,
          align: "center",
          wordWrap: { width: notificationWidth - finalStyle.padding * 3 },
        })
        .setOrigin(0.5);

      container.add(notificationText);

      // Animar entrada
      const startY = finalStyle.position === "top" ? -50 : scene.cameras.main.height + 50;

      container.setAlpha(0);
      container.y = startY;

      scene.tweens.add({
        targets: container,
        alpha: 1,
        y: y,
        duration: 300,
        ease: "Back.easeOut",
      });

      // Definir saída após a duração
      scene.time.delayedCall(finalStyle.duration, () => {
        scene.tweens.add({
          targets: container,
          alpha: 0,
          y: startY,
          duration: 300,
          ease: "Back.easeIn",
          onComplete: () => {
            container.destroy();
          },
        });
      });
    } catch (error) {
      console.error("❌ Erro ao exibir notificação:", error);
    }
  }

  /**
   * Cria um efeito de digitação para texto
   * @param {Phaser.Scene} scene - A cena atual
   * @param {Phaser.GameObjects.Text} textObject - Objeto de texto a animar
   * @param {string} fullText - Texto completo a ser digitado
   * @param {Object} config - Configuração (opcional)
   * @returns {Object} - Objeto com controles de digitação
   * @static
   */
  static typewriterEffect(scene, textObject, fullText, config = {}) {
    // Verificar parâmetros essenciais
    if (!scene || !textObject) {
      console.error("❌ Parâmetros inválidos para typewriterEffect");
      return null;
    }

    // Configurações padrão
    const defaultConfig = {
      speed: 30, // ms por caractere
      startDelay: 0, // ms de atraso antes de começar
      endDelay: 1000, // ms de atraso após terminar
      onComplete: null, // callback quando terminar
      sounds: {
        type: null, // som de digitação
        punctuation: null, // som de pontuação
      },
      punctuationSpeed: {
        ".": 300,
        ",": 200,
        "!": 300,
        "?": 300,
        ":": 200,
        ";": 200,
      },
      showCursor: true, // mostrar cursor piscante
      cursorChar: "|", // caractere do cursor
    };

    // Mesclar configurações
    const finalConfig = { ...defaultConfig, ...config };

    try {
      // Armazenar texto original
      const originalText = fullText;
      textObject.setText("");

      // Variáveis de controle
      let index = 0;
      let timer;
      let isPaused = false;
      let isComplete = false;
      let cursor = null;

      // Adicionar cursor piscante
      if (finalConfig.showCursor) {
        cursor = scene.add
          .text(textObject.x + 5, textObject.y, finalConfig.cursorChar, {
            fontSize: textObject.style.fontSize,
            fontFamily: textObject.style.fontFamily,
            fill: textObject.style.color,
          })
          .setOrigin(0, 0);

        // Animar cursor
        scene.tweens.add({
          targets: cursor,
          alpha: 0,
          duration: 500,
          yoyo: true,
          repeat: -1,
        });
      }

      // Função para atualizar a posição do cursor
      const updateCursorPosition = () => {
        if (!cursor) return;

        // Pegar a última posição de texto
        const textMetrics = textObject.getTextMetrics();
        const lastLine = textMetrics.lines[textMetrics.lines.length - 1] || { width: 0 };

        cursor.setPosition(textObject.x + textObject.originX * textObject.width + lastLine.width, textObject.y + (textMetrics.lines.length - 1) * textMetrics.lineHeight);
      };

      // Função para digitar o próximo caractere
      const typeNextChar = () => {
        if (isPaused || isComplete) return;

        if (index < originalText.length) {
          textObject.setText(textObject.text + originalText.charAt(index));
          updateCursorPosition();

          // Determinar velocidade para o próximo caractere
          let charDelay = finalConfig.speed;
          const nextChar = originalText.charAt(index);

          // Aplicar velocidade de pontuação se definida
          if (finalConfig.punctuationSpeed && finalConfig.punctuationSpeed[nextChar]) {
            charDelay = finalConfig.punctuationSpeed[nextChar];
          }

          // Reproduzir som se fornecido
          if (finalConfig.sounds) {
            if (nextChar === " ") {
              // Som de espaço (silêncio)
            } else if (".!?:;,".includes(nextChar)) {
              // Som de pontuação
              if (finalConfig.sounds.punctuation) {
                scene.sound.play(finalConfig.sounds.punctuation, { volume: 0.4 });
              }
            } else {
              // Som normal de digitação
              if (finalConfig.sounds.type && index % 3 === 0) {
                scene.sound.play(finalConfig.sounds.type, { volume: 0.2 });
              }
            }
          }

          index++;
          timer = scene.time.delayedCall(charDelay, typeNextChar);
        } else {
          isComplete = true;

          // Remover cursor
          if (cursor) {
            scene.tweens.add({
              targets: cursor,
              alpha: 0,
              duration: 200,
              onComplete: () => {
                cursor.destroy();
              },
            });
          }

          // Callback de conclusão
          if (finalConfig.onComplete) {
            scene.time.delayedCall(finalConfig.endDelay, finalConfig.onComplete);
          }
        }
      };

      // Iniciar efeito após o atraso
      timer = scene.time.delayedCall(finalConfig.startDelay, typeNextChar);

      // Retornar controles
      return {
        skip: () => {
          // Parar digitação e exibir texto completo
          if (timer) timer.remove();
          isPaused = false;
          isComplete = true;
          textObject.setText(originalText);

          // Remover cursor
          if (cursor) {
            scene.tweens.add({
              targets: cursor,
              alpha: 0,
              duration: 200,
              onComplete: () => {
                cursor.destroy();
              },
            });
          }

          // Callback de conclusão
          if (finalConfig.onComplete) {
            scene.time.delayedCall(finalConfig.endDelay, finalConfig.onComplete);
          }
        },
        pause: () => {
          // Pausar digitação
          isPaused = true;
          if (timer) timer.paused = true;

          // Pausar animação do cursor
          if (cursor) {
            cursor.alpha = 1;
            scene.tweens.killTweensOf(cursor);
          }
        },
        resume: () => {
          // Retomar digitação
          isPaused = false;
          if (timer) timer.paused = false;

          // Retomar animação do cursor
          if (cursor) {
            scene.tweens.add({
              targets: cursor,
              alpha: 0,
              duration: 500,
              yoyo: true,
              repeat: -1,
            });
          }
        },
        isComplete: () => isComplete,
      };
    } catch (error) {
      console.error("❌ Erro ao criar efeito de digitação:", error);
      return null;
    }
  }
}

// Registro para debugging
console.log("🎮 UIComponents carregado com sucesso!");
