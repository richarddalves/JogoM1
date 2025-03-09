/**
 * Funções de interface do menu principal
 */
(function () {
  /**
   * Configura o sistema responsivo
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  mainMenu.prototype.setupResponsiveDesign = function (width, height) {
    this.screenWidth = width;
    this.screenHeight = height;

    // Calcular escala baseada na resolução
    this.uiScale = Math.min(width / 1280, height / 720);

    // Ajustar espaçamento de botões com base na escala
    this.buttonSpacing = 80 * this.uiScale;

    // Salvar dimensões de referência para centralização
    this.centerX = width / 2;
    this.centerY = height / 2;

    // Configurar eventos de redimensionamento
    this.scale.on("resize", this.resize, this);
  };

  /**
   * Cria a interface do menu
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  mainMenu.prototype.createInterface = function (width, height) {
    // Container para elementos do título
    this.titleContainer = this.add.container(width / 2, this.titleY);

    // Logo do jogo
    // Verificar se a imagem do logo existe, senão criar um textual
    try {
      const logo = this.add.image(0, 0, "logo").setOrigin(0.5);
      // Ajustar escala do logo
      const maxWidth = width * 0.7;
      if (logo.width > maxWidth) {
        const scale = maxWidth / logo.width;
        logo.setScale(scale);
      }
      this.titleContainer.add(logo);
    } catch (e) {
      // Criar título textual como fallback
      this.createTextTitle();
    }

    // Container para botões
    this.menuContainer = this.add.container(width / 2, height / 2);

    // Container para botões extras
    this.extraButtonsContainer = this.add.container(width / 2, height - 80);

    // Criar os botões do menu
    this.createMenuButtons();

    // Criar rodapé com versão
    this.createFooter(width, height);

    // Criar botão de redes sociais
    this.createSocialButtons(width, height);
  };

  /**
   * Cria um título textual se a imagem do logo não estiver disponível
   */
  mainMenu.prototype.createTextTitle = function () {
    // Título principal
    const titleText = this.add
      .text(0, 0, "DPO HERO", {
        fontSize: "64px",
        fontFamily: this.titleFontFamily,
        align: "center",
        stroke: this.colors.primary,
        strokeThickness: 8,
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    // Adicionar brilho ao título
    const titleGlow = this.add.graphics();
    titleGlow.fillStyle(this.colors.primary, 0.3);
    titleGlow.fillRoundedRect(-titleText.width / 2 - 20, -titleText.height / 2 - 10, titleText.width + 40, titleText.height + 20, 10);

    // Garantir que o brilho fique atrás do texto
    this.titleContainer.add(titleGlow);
    this.titleContainer.add(titleText);

    // Subtítulo
    const subtitleText = this.add
      .text(0, 70, "Guardiões de Dados", {
        fontSize: "32px",
        fontFamily: this.fontFamily,
        align: "center",
        fill: "#88CCFF",
      })
      .setOrigin(0.5);

    this.titleContainer.add(subtitleText);

    // Animar o brilho
    this.tweens.add({
      targets: titleGlow,
      alpha: { from: 0.3, to: 0.5 },
      width: titleGlow.width + 20,
      x: titleGlow.x - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });
  };

  /**
   * Cria o rodapé com informações de versão
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  mainMenu.prototype.createFooter = function (width, height) {
    // Versão do jogo
    this.versionText = this.add
      .text(width - 20, height - 20, "v1.0.0", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#aaaaaa",
      })
      .setOrigin(1, 1);

    // Data de atualização
    const dateText = this.add
      .text(20, height - 20, "LGPD Hero 2025", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#aaaaaa",
      })
      .setOrigin(0, 1);
  };

  /**
   * Mostra uma dica na parte inferior da tela
   * @param {string} text - Texto da dica
   */
  mainMenu.prototype.showTip = function (text) {
    // Remover dica anterior, se existir
    if (this.tipContainer) {
      this.tipContainer.destroy();
    }

    const width = this.screenWidth;
    const height = this.screenHeight;

    // Container para a dica
    this.tipContainer = this.add.container(width / 2, height - 80);

    // Fundo da dica
    const tipBg = this.add.graphics();
    tipBg.fillStyle(this.colors.primary, 0.6);
    tipBg.fillRoundedRect(-300, -20, 600, 40, 10);

    // Texto da dica
    const tipText = this.add
      .text(0, 0, text, {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    this.tipContainer.add([tipBg, tipText]);

    // Animação de entrada
    this.tipContainer.setAlpha(0);
    this.tipContainer.setY(height - 60);

    this.tweens.add({
      targets: this.tipContainer,
      alpha: 1,
      y: height - 80,
      duration: 300,
      ease: "Power2",
    });

    // Esconder automaticamente após alguns segundos
    this.time.delayedCall(10000, () => {
      if (this.tipContainer) {
        this.tweens.add({
          targets: this.tipContainer,
          alpha: 0,
          y: height - 60,
          duration: 300,
          ease: "Power2",
          onComplete: () => {
            if (this.tipContainer) {
              this.tipContainer.destroy();
              this.tipContainer = null;
            }
          },
        });
      }
    });
  };

  /**
   * Mostra um tooltip para elementos da UI
   * @param {string} text - Texto do tooltip
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   */
  mainMenu.prototype.showTooltip = function (text, x, y) {
    // Remover tooltip anterior, se existir
    if (this.tooltipContainer) {
      this.tooltipContainer.destroy();
    }

    // Container para o tooltip
    this.tooltipContainer = this.add.container(x, y);

    // Fundo do tooltip com largura ajustada
    const tooltipBg = this.add.graphics();
    tooltipBg.fillStyle(this.colors.dark, 0.9);
    tooltipBg.fillRoundedRect(-80, -15, 160, 30, 5); // Ajustado para melhor posicionamento

    tooltipBg.lineStyle(1, this.colors.secondary, 0.8);
    tooltipBg.strokeRoundedRect(-80, -15, 160, 30, 5);

    // Texto do tooltip
    const tooltipText = this.add
      .text(0, 0, text, {
        fontSize: "14px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    this.tooltipContainer.add([tooltipBg, tooltipText]);

    // Animação de entrada
    this.tooltipContainer.setAlpha(0);
    this.tooltipContainer.setScale(0.8);

    this.tweens.add({
      targets: this.tooltipContainer,
      alpha: 1,
      scale: 1,
      duration: 200,
      ease: "Power2",
    });
  };

  /**
   * Esconde o tooltip atual
   */
  mainMenu.prototype.hideTooltip = function () {
    if (!this.tooltipContainer) return;

    // Animação de saída
    this.tweens.add({
      targets: this.tooltipContainer,
      alpha: 0,
      scale: 0.8,
      duration: 200,
      ease: "Power2",
      onComplete: () => {
        if (this.tooltipContainer) {
          this.tooltipContainer.destroy();
          this.tooltipContainer = null;
        }
      },
    });
  };

  console.log("✅ Menu Interface Module loaded");
})();
