/**
 * Funções relacionadas a barras de progresso e elementos de progresso
 */
(function () {
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
  UIComponents.createProgressBar = function (scene, x, y, width, height, value = 0, style = {}) {
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
  };

  console.log("✅ Módulo de Elementos de Progresso carregado");
})();
