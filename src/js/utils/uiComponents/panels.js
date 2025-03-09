/**
 * Funções relacionadas a painéis e containers UI
 */
(function () {
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
  UIComponents.createPanel = function (scene, x, y, width, height, style = {}) {
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
  };

  console.log("✅ Módulo de Painéis UI carregado");
})();