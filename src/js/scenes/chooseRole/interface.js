/**
 * Funções de interface da cena de escolha de papel
 */
(function () {
  /**
   * Configura o sistema responsivo
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.setupResponsiveDesign = function (width, height) {
    this.screenWidth = width;
    this.screenHeight = height;

    // Calcular escala baseada na resolução
    this.uiScale = Math.min(width / 1280, height / 720);

    // Salvar dimensões de referência para centralização
    this.centerX = width / 2;
    this.centerY = height / 2;

    // Configurar eventos de redimensionamento
    this.scale.on("resize", this.resize, this);
  };

  /**
   * Cria o ambiente visual
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createEnvironment = function (width, height) {
    // Adicionar fundo
    this.background = this.add.image(width / 2, height / 2, "select_bg").setDisplaySize(width, height);

    // Adicionar overlay para melhorar contraste
    this.overlay = this.add.graphics().fillStyle(0x1e1e1e, 0.7).fillRect(0, 0, width, height);

    // Adicionar efeito de grade digital
    this.createDigitalGrid(width, height);

    // Criar elementos estáticos em vez do sistema de partículas
    this.createStaticElements(width, height);
  };

  /**
   * Cria o efeito de grade digital
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createDigitalGrid = function (width, height) {
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, this.colors.primary, 0.2);

    // Linhas horizontais
    for (let y = 0; y < height; y += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(width, y);
      gridGraphics.strokePath();
    }

    // Linhas verticais
    for (let x = 0; x < width; x += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, height);
      gridGraphics.strokePath();
    }
  };

  /**
   * Cria elementos estáticos como alternativa ao sistema de partículas
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createStaticElements = function (width, height) {
    try {
      // Criar vários elementos estáticos
      for (let i = 0; i < 50; i++) {
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(0, height);
        const size = Phaser.Math.FloatBetween(0.03, 0.1);
        const alpha = Phaser.Math.FloatBetween(0.1, 0.5);
      }

      // Criar alguns elementos que seguem o mouse
      this.input.on("pointermove", (pointer) => {
        if (Phaser.Math.Between(0, 10) < 3) {
          // Apenas criar ocasionalmente
          try {
            const particle = this.add.image(pointer.x, pointer.y, "particle").setScale(0.05).setAlpha(0.5);

            this.tweens.add({
              targets: particle,
              alpha: 0,
              scale: 0,
              x: pointer.x + Phaser.Math.Between(-30, 30),
              y: pointer.y + Phaser.Math.Between(-30, 30),
              duration: 1000,
              onComplete: () => particle.destroy(),
            });
          } catch (e) {
            // Ignora silenciosamente se a imagem "particle" não existir
          }
        }
      });
    } catch (e) {
      console.warn("Não foi possível criar os elementos estáticos:", e);
    }
  };

  /**
   * Cria os elementos de interface
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createInterface = function (width, height) {
    // Criar título
    this.createTitle(width, height);

    // Criar botão de voltar
    this.createBackButton(width, height);

    // Container para mensagem de destaque
    this.infoContainer = this.add.container(width / 2, height * 0.85);

    // Definir profundidade alta para o container de informações
    // para garantir que fique acima dos painéis
    this.infoContainer.setDepth(1000);

    // Inicializar o tooltip container
    this.tooltipContainer = null;
  };

  /**
   * Cria o título da cena
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createTitle = function (width, height) {
    // Container para o título
    this.titleContainer = this.add.container(width / 2, height * 0.15);

    // Fundo do título
    const titleBg = this.add.graphics();
    titleBg.fillStyle(this.colors.primary, 0.7);
    titleBg.fillRoundedRect(-250, -20, 500, 60, 16);

    // Adicionar brilho ao redor do título
    const titleGlow = this.add.graphics();
    titleGlow.fillStyle(this.colors.primary, 0.3);
    titleGlow.fillRoundedRect(-260, -30, 520, 80, 20);

    // Texto do título
    const titleText = this.add
      .text(0, 0, "ESCOLHA SUA FUNÇÃO", {
        fontSize: "32px",
        fontFamily: this.titleFontFamily,
        fill: "#FFFFFF",
        stroke: "#0d84ff",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Linha decorativa abaixo do título
    const titleLine = this.add.graphics();
    titleLine.lineStyle(2, this.colors.secondary, 0.8);
    titleLine.beginPath();
    titleLine.moveTo(-180, 30);
    titleLine.lineTo(180, 30);
    titleLine.strokePath();

    // Descrição
    const descText = this.add
      .text(0, 60, "Selecione seu papel na proteção de dados", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#CCCCCC",
      })
      .setOrigin(0.5);

    // Adicionar tudo ao container
    this.titleContainer.add([titleGlow, titleBg, titleText, titleLine, descText]);

    // Animar título
    this.tweens.add({
      targets: [titleGlow],
      alpha: { from: 0.3, to: 0.5 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
  };

  /**
   * Cria o botão de voltar
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createBackButton = function (width, height) {
    // Container para o botão
    this.backButton = this.add.container(width / 2, height * 0.92);

    // Fundo do botão
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x666666, 0.9);
    buttonBg.fillRoundedRect(-100, -20, 200, 40, 10);

    buttonBg.lineStyle(2, 0x888888, 0.8);
    buttonBg.strokeRoundedRect(-100, -20, 200, 40, 10);

    // Texto do botão
    const buttonText = this.add
      .text(0, 0, "VOLTAR", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    this.backButton.add([buttonBg, buttonText]);

    // Interatividade
    this.backButton.setInteractive(new Phaser.Geom.Rectangle(-100, -20, 200, 40), Phaser.Geom.Rectangle.Contains);

    // Efeitos de hover
    this.backButton.on("pointerover", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x888888, 0.9);
      buttonBg.fillRoundedRect(-100, -20, 200, 40, 10);

      buttonBg.lineStyle(2, 0xaaaaaa, 0.8);
      buttonBg.strokeRoundedRect(-100, -20, 200, 40, 10);

      // Parar tween anterior se existir
      if (this.activeTweens.backButton) {
        this.activeTweens.backButton.stop();
      }

      // Criar e armazenar o novo tween
      this.activeTweens.backButton = this.tweens.add({
        targets: this.backButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });

      // Som de hover (se disponível)
      this.playSoundSafely("hover_sound", { volume: 0.2 });
    });

    this.backButton.on("pointerout", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x666666, 0.9);
      buttonBg.fillRoundedRect(-100, -20, 200, 40, 10);

      buttonBg.lineStyle(2, 0x888888, 0.8);
      buttonBg.strokeRoundedRect(-100, -20, 200, 40, 10);

      // Parar tween anterior se existir
      if (this.activeTweens.backButton) {
        this.activeTweens.backButton.stop();
      }

      // Criar e armazenar o novo tween
      this.activeTweens.backButton = this.tweens.add({
        targets: this.backButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    this.backButton.on("pointerdown", () => {
      // Parar tween anterior se existir
      if (this.activeTweens.backButton) {
        this.activeTweens.backButton.stop();
      }

      // Criar e armazenar o novo tween
      this.activeTweens.backButton = this.tweens.add({
        targets: this.backButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          this.returnToMainMenu();
        },
      });

      // Som de clique (se disponível)
      this.playSoundSafely("select_sound", { volume: 0.5 });
    });
  };

  /**
   * Mostra um tooltip para elementos da UI
   * @param {string} text - Texto do tooltip
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   */
  chooseRole.prototype.showTooltip = function (text, x, y) {
    // Remover tooltip anterior, se existir
    this.hideTooltip();

    // Container para o tooltip (certifique-se que ele tenha z-index alto)
    this.tooltipContainer = this.add.container(x, y);
    this.tooltipContainer.setDepth(2000); // Aumentar a profundidade para garantir que fique acima dos painéis

    // Fundo do tooltip com largura ajustada
    const tooltipBg = this.add.graphics();
    tooltipBg.fillStyle(this.colors.dark, 0.9);
    tooltipBg.fillRoundedRect(-80, -15, 160, 30, 5);

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
  chooseRole.prototype.hideTooltip = function () {
    if (this.tooltipContainer) {
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
    }
  };

  /**
   * Cria a caixa de destaque na parte inferior
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createHighlightBox = function (width, height) {
    // Limpar o container se já existir conteúdo
    this.infoContainer.removeAll(true);

    // Garantir que a caixa de informações tenha profundidade alta
    this.infoContainer.setDepth(1000);

    // Largura da caixa
    const boxWidth = width * 0.7;

    // Fundo da caixa de destaque
    const boxBg = this.add.graphics();
    boxBg.fillStyle(this.colors.primary, 0.2);
    boxBg.fillRoundedRect(-boxWidth / 2, -25, boxWidth, 50, 10);

    boxBg.lineStyle(2, this.colors.secondary, 0.4);
    boxBg.strokeRoundedRect(-boxWidth / 2, -25, boxWidth, 50, 10);

    // Ícone
    const infoIcon = this.add
      .text(-boxWidth / 2 + 20, 0, "ℹ️", {
        fontSize: "24px",
      })
      .setOrigin(0, 0.5);

    // Texto de informação
    this.infoText = this.add
      .text(0, 0, "Na versão demo, ambos os papéis seguem o mesmo caminho de missões.", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    this.infoContainer.add([boxBg, infoIcon, this.infoText]);

    // Animação de destaque
    this.tweens.add({
      targets: this.infoContainer,
      alpha: { from: 0.7, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
  };

  console.log("✅ Interface de Escolha de Papel carregada");
})();
