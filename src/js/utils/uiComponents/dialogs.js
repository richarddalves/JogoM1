/**
 * Funções relacionadas a diálogos e balões de texto
 */
(function () {
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
  UIComponents.drawBubblePointer = function (graphics, width, height, direction, size, fillColor, strokeColor, strokeWidth, alpha) {
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
  };

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
  UIComponents.applyTypewriterEffect = function (scene, textObject, fullText, speed = 30) {
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
  };

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
  UIComponents.createDialogBubble = function (scene, x, y, text, style = {}) {
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
  };

  /**
   * Cria um efeito de digitação para texto
   * @param {Phaser.Scene} scene - A cena atual
   * @param {Phaser.GameObjects.Text} textObject - Objeto de texto a animar
   * @param {string} fullText - Texto completo a ser digitado
   * @param {Object} config - Configuração (opcional)
   * @returns {Object} - Objeto com controles de digitação
   * @static
   */
  UIComponents.typewriterEffect = function (scene, textObject, fullText, config = {}) {
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
  };

  /**
   * Exibe uma notificação temporária na tela
   * @param {Phaser.Scene} scene - A cena atual
   * @param {string} text - Texto da notificação
   * @param {Object} style - Estilo personalizado (opcional)
   * @static
   */
  UIComponents.showNotification = function (scene, text, style = {}) {
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
  };

  console.log("✅ Módulo de Diálogos UI carregado");
})();
