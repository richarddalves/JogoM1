/**
 * Módulo de interface para o mini-game de identificação de dados pessoais e sensíveis
 */
(function () {
  /**
   * Configura o sistema responsivo
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  gameInicial.prototype.setupResponsiveDesign = function (width, height) {
    this.screenWidth = width;
    this.screenHeight = height;

    // Calcular escala baseada na resolução
    this.uiScale = Math.min(width / 1280, height / 720);

    // Salvar dimensões de referência para centralização
    this.centerX = width / 2;
    this.centerY = height / 2;
  };

  /**
   * Cria o ambiente visual do jogo
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  gameInicial.prototype.createEnvironment = function (width, height) {
    // Adicionar fundo com efeitos visuais aprimorados
    this.background = this.add.image(width / 2, height / 2, "game_bg").setDisplaySize(width, height);

    // Efeito de profundidade e foco - intensificado para melhor visual
    this.overlay = this.add.graphics().fillStyle(0x000022, 0.7).fillRect(0, 0, width, height);

    // Camada de vinheta para dar foco à área central
    const vignette = this.add.graphics();
    const gradientWidth = width * 0.9;
    const gradientHeight = height * 0.9;

    // Parte externa (mais escura)
    vignette.fillStyle(0x000000, 0.7);
    vignette.fillRect(0, 0, width, height);

    // Parte interna (transparente) - criar uma máscara
    vignette.fillStyle(0x000000, 0);

    // Gradientes para suavizar as bordas da vinheta
    for (let i = 0; i < 20; i++) {
      const alpha = i / 20;
      vignette.fillStyle(0x000000, alpha);
      vignette.fillRoundedRect(width / 2 - gradientWidth / 2 + i * 10, height / 2 - gradientHeight / 2 + i * 10, gradientWidth - i * 20, gradientHeight - i * 20, 50);
    }

    // Limpar o centro completamente
    vignette.fillStyle(0x000000, 0);
    vignette.fillRoundedRect(width / 2 - gradientWidth / 2 + 200, height / 2 - gradientHeight / 2 + 200, gradientWidth - 400, gradientHeight - 400, 30);

    // Grade digital para efeito futurista aprimorado
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, this.colors.secondary, 0.15);

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

    // Adicionar efeito de partículas melhorado
    try {
      this.particles = this.add.particles("data_icon");

      // Emitter principal (flutuantes de fundo)
      this.emitter = this.particles.createEmitter({
        x: { min: 0, max: width },
        y: { min: 0, max: height },
        scale: { start: 0.05, end: 0 },
        alpha: { start: 0.2, end: 0 },
        speed: 20,
        angle: { min: 0, max: 360 },
        rotate: { min: 0, max: 360 },
        lifespan: { min: 4000, max: 6000 },
        quantity: 1,
        frequency: 2000,
        blendMode: "ADD",
        tint: [0x39f5e2, 0x0d84ff],
      });

      // Emitter adicional (flocos digitais ascendentes)
      this.emitter2 = this.particles.createEmitter({
        x: { min: width * 0.25, max: width * 0.75 },
        y: height,
        scale: { start: 0.03, end: 0 },
        alpha: { start: 0.3, end: 0 },
        speed: { min: 50, max: 100 },
        angle: { min: 80, max: 100 },
        rotate: { min: 0, max: 360 },
        lifespan: { min: 6000, max: 10000 },
        quantity: 0.2,
        frequency: 500,
        blendMode: "ADD",
        tint: 0x39f5e2,
      });
    } catch (e) {
      console.warn("Não foi possível criar o sistema de partículas:", e);
    }

    // Efeito de "scanlines" para um visual mais cyberpunk/digital
    const scanlines = this.add.graphics();
    scanlines.lineStyle(1, 0x000000, 0.1);

    for (let y = 0; y < height; y += 2) {
      scanlines.beginPath();
      scanlines.moveTo(0, y);
      scanlines.lineTo(width, y);
      scanlines.strokePath();
    }
  };

  /**
   * Cria a HUD do agente com tratamento de erro
   */
  gameInicial.prototype.createAgentHUD = function () {
    try {
      // Verificar se a classe AgentHUD existe
      if (typeof AgentHUD === "undefined") {
        console.warn("AgentHUD não está definido. Importando a classe...");

        // Criar uma classe substituta temporária se necessário
        if (!window.AgentHUD) {
          window.AgentHUD = class TempAgentHUD {
            constructor(scene) {
              this.scene = scene;
              console.log("AgentHUD temporário criado");
            }

            addPoints(points, reason) {
              console.log(`[HUD] Adicionando ${points} pontos: ${reason}`);
              return { newPoints: points, levelUp: false };
            }

            updateHUDInfo() {}
            toggleVisibility() {}
          };
        }
      }

      // Criar a HUD
      this.agentHUD = new AgentHUD(this);

      // Adicionar botão para mostrar/esconder a HUD com estilo melhorado
      const hudBg = this.add.graphics();
      hudBg.fillStyle(this.colors.primary, 0.8);
      hudBg.fillRoundedRect(this.centerX - 30, 10, 60, 40, 10);
      hudBg.lineStyle(2, this.colors.secondary, 0.9);
      hudBg.strokeRoundedRect(this.centerX - 30, 10, 60, 40, 10);

      const hudButton = this.add
        .text(this.centerX, 30, "👤", {
          fontSize: "28px",
          padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.agentHUD.toggleVisibility())
        .on("pointerover", () => {
          hudBg.clear();
          hudBg.fillStyle(this.colors.secondary, 0.8);
          hudBg.fillRoundedRect(this.centerX - 30, 10, 60, 40, 10);
          hudBg.lineStyle(2, this.colors.primary, 0.9);
          hudBg.strokeRoundedRect(this.centerX - 30, 10, 60, 40, 10);

          // Efeito de escala
          this.tweens.add({
            targets: [hudButton, hudBg],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
          });
        })
        .on("pointerout", () => {
          hudBg.clear();
          hudBg.fillStyle(this.colors.primary, 0.8);
          hudBg.fillRoundedRect(this.centerX - 30, 10, 60, 40, 10);
          hudBg.lineStyle(2, this.colors.secondary, 0.9);
          hudBg.strokeRoundedRect(this.centerX - 30, 10, 60, 40, 10);

          // Restaurar escala
          this.tweens.add({
            targets: [hudButton, hudBg],
            scaleX: 1,
            scaleY: 1,
            duration: 100,
          });
        });

      // Tooltip que aparece ao passar o mouse
      const hudTooltip = this.add
        .text(this.centerX + 60, 30, "Perfil do Agente (H)", {
          fontSize: "14px",
          fontFamily: this.fontFamily,
          fill: "#FFFFFF",
          backgroundColor: this.colors.dark,
          padding: { x: 8, y: 4 },
          stroke: "#000000",
          strokeThickness: 1,
        })
        .setOrigin(0, 0.5)
        .setAlpha(0)
        .setShadow(2, 2, "rgba(0,0,0,0.5)", 5);

      // Mostrar/ocultar tooltip
      hudButton.on("pointerover", () => {
        this.tweens.add({
          targets: hudTooltip,
          alpha: 1,
          x: this.centerX + 50,
          duration: 200,
        });
      });

      hudButton.on("pointerout", () => {
        this.tweens.add({
          targets: hudTooltip,
          alpha: 0,
          x: this.centerX + 60,
          duration: 200,
        });
      });

      // Adicionar brilho animado ao botão da HUD
      const hudGlow = this.add.graphics();
      hudGlow.lineStyle(3, this.colors.secondary, 0.5);
      hudGlow.strokeRoundedRect(this.centerX - 33, 7, 66, 46, 12);

      this.tweens.add({
        targets: hudGlow,
        alpha: { from: 0.5, to: 0.1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
      });
    } catch (e) {
      console.error("Erro ao criar AgentHUD:", e);
    }
  };

  /**
   * Cria a interface do jogo
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  gameInicial.prototype.createGameInterface = function (width, height) {
    // Container principal para a interface
    this.gameContainer = this.add.container(0, 0);

    // Cabeçalho com título e instruções
    this.createHeader(width);

    // Painel de pergunta
    this.createQuestionPanel(width, height);

    // Painel de feedback
    this.createFeedbackPanel(width, height);

    // Botões de resposta
    this.createAnswerButtons(width, height);

    // Indicador de progresso
    this.createProgressIndicator(width, height);

    // Inicialmente, ocultar o painel de feedback
    this.feedbackPanel.setVisible(false);
  };

  /**
   * Cria o cabeçalho do jogo
   * @param {number} width - Largura da tela
   */
  gameInicial.prototype.createHeader = function (width) {
    // Container para o cabeçalho
    this.headerContainer = this.add.container(0, 0);
    this.gameContainer.add(this.headerContainer);

    // Plano de fundo para o cabeçalho inteiro
    const headerBgFull = this.add.graphics();
    headerBgFull.fillStyle(0x0d468a, 0.5);
    headerBgFull.fillRect(0, 0, width, 200);
    headerBgFull.lineStyle(2, this.colors.secondary, 0.5);
    headerBgFull.beginPath();
    headerBgFull.moveTo(0, 200);
    headerBgFull.lineTo(width, 200);
    headerBgFull.strokePath();
    this.headerContainer.add(headerBgFull);

    // Título do mini-game - Visual aprimorado
    const titleBg = this.add.graphics();

    // Criar efeito de gradiente (simulado com várias camadas)
    for (let i = 0; i < 3; i++) {
      const alpha = 0.7 - i * 0.1;
      titleBg.fillStyle(this.colors.primary, alpha);
      titleBg.fillRoundedRect(width / 2 - 260 + i * 3, 40 - i * 1, 520 - i * 6, 60 + i * 2, 16);
    }

    // Borda do título
    titleBg.lineStyle(2, this.colors.secondary, 0.9);
    titleBg.strokeRoundedRect(width / 2 - 260, 40, 520, 60, 16);

    this.headerContainer.add(titleBg);

    // Adicionar efeito de brilho ao título
    const titleGlow = this.add.graphics();
    titleGlow.lineStyle(5, this.colors.secondary, 0.3);
    titleGlow.strokeRoundedRect(width / 2 - 265, 35, 530, 70, 20);

    this.headerContainer.add(titleGlow);

    // Texto do título
    const titleText = this.add
      .text(width / 2, 70, "IDENTIFICAÇÃO DE DADOS SENSÍVEIS", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.headerContainer.add(titleText);

    // Descrição do mini-game com estilo visual aprimorado
    const descriptionBg = this.add.graphics();
    descriptionBg.fillStyle(this.colors.dark, 0.7);
    descriptionBg.fillRoundedRect(width / 2 - 350, 110, 700, 40, 10);
    descriptionBg.lineStyle(1, this.colors.primary, 0.5);
    descriptionBg.strokeRoundedRect(width / 2 - 350, 110, 700, 40, 10);
    this.headerContainer.add(descriptionBg);

    const descriptionText = this.add
      .text(width / 2, 130, "Identifique se as informações apresentadas contêm dados sensíveis", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    this.headerContainer.add(descriptionText);

    // Definição do que são dados sensíveis com estilo melhorado
    const definitionBg = this.add.graphics();
    definitionBg.fillStyle(0x000000, 0.5);
    definitionBg.fillRoundedRect(width / 2 - 400, 155, 800, 50, 8);

    // Bordas laterais decorativas
    definitionBg.lineStyle(2, this.colors.secondary, 0.6);
    definitionBg.beginPath();
    definitionBg.moveTo(width / 2 - 390, 155);
    definitionBg.lineTo(width / 2 - 390, 205);
    definitionBg.strokePath();

    definitionBg.beginPath();
    definitionBg.moveTo(width / 2 + 390, 155);
    definitionBg.lineTo(width / 2 + 390, 205);
    definitionBg.strokePath();

    this.headerContainer.add(definitionBg);

    const definitionText = this.add
      .text(width / 2, 180, "DADOS SENSÍVEIS: informações sobre raça, etnia, religião, opinião política, saúde,\nvida sexual, genética, biometria, e dados de crianças/adolescentes.", {
        fontSize: "14px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        align: "center",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    this.headerContainer.add(definitionText);

    // Animar o título
    this.tweens.add({
      targets: [titleGlow],
      alpha: { from: 0.3, to: 0.7 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Animar a definição para destacá-la
    this.tweens.add({
      targets: definitionText,
      alpha: { from: 1, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });
  };

  /**
   * Cria o painel de pergunta
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  gameInicial.prototype.createQuestionPanel = function (width, height) {
    // Dimensões e posição do painel
    const panelWidth = width * 0.8;
    const panelHeight = height * 0.35;
    const panelX = width / 2;
    const panelY = height / 2 - 30;

    // Container do painel
    this.questionPanel = this.add.container(0, 0);
    this.gameContainer.add(this.questionPanel);

    // Efeito de brilho externo
    const outerGlow = this.add.graphics();
    outerGlow.lineStyle(6, this.colors.secondary, 0.2);
    outerGlow.strokeRoundedRect(panelX - panelWidth / 2 - 5, panelY - panelHeight / 2 - 5, panelWidth + 10, panelHeight + 10, 20);
    this.questionPanel.add(outerGlow);

    // Animar o brilho externo
    this.tweens.add({
      targets: outerGlow,
      alpha: { from: 0.2, to: 0.5 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });

    // Fundo do painel com efeito de profundidade
    const panelShadow = this.add
      .graphics()
      .fillStyle(0x000000, 0.5)
      .fillRoundedRect(panelX - panelWidth / 2 + 10, panelY - panelHeight / 2 + 10, panelWidth, panelHeight, 16);

    this.questionPanel.add(panelShadow);

    // Fundo do painel principal com gradiente
    const panelBg = this.add.graphics();

    // Criar gradiente simulado
    for (let i = 0; i < 4; i++) {
      const alpha = 0.9 - i * 0.05;
      panelBg.fillStyle(this.colors.dark, alpha);
      panelBg.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2 + (i * panelHeight) / 4, panelWidth, panelHeight / 4, i === 0 ? { tl: 16, tr: 16, bl: 0, br: 0 } : i === 3 ? { tl: 0, tr: 0, bl: 16, br: 16 } : 0);
    }

    // Borda do painel
    panelBg.lineStyle(3, this.colors.primary, 0.8);
    panelBg.strokeRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 16);

    this.questionPanel.add(panelBg);

    // Cabeçalho do painel com gradiente
    const headerBg = this.add.graphics();
    headerBg.fillStyle(this.colors.primary, 0.8);
    headerBg.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, 40, { tl: 16, tr: 16, bl: 0, br: 0 });

    // Adicionar linhas decorativas no cabeçalho
    headerBg.lineStyle(1, this.colors.secondary, 0.6);

    // Linha horizontal inferior
    headerBg.beginPath();
    headerBg.moveTo(panelX - panelWidth / 2 + 20, panelY - panelHeight / 2 + 39.5);
    headerBg.lineTo(panelX + panelWidth / 2 - 20, panelY - panelHeight / 2 + 39.5);
    headerBg.strokePath();

    // Linhas verticais decorativas nas laterais
    headerBg.beginPath();
    headerBg.moveTo(panelX - panelWidth / 2 + 20, panelY - panelHeight / 2 + 5);
    headerBg.lineTo(panelX - panelWidth / 2 + 20, panelY - panelHeight / 2 + 35);
    headerBg.strokePath();

    headerBg.beginPath();
    headerBg.moveTo(panelX + panelWidth / 2 - 20, panelY - panelHeight / 2 + 5);
    headerBg.lineTo(panelX + panelWidth / 2 - 20, panelY - panelHeight / 2 + 35);
    headerBg.strokePath();

    this.questionPanel.add(headerBg);

    // Título do painel
    const panelTitle = this.add
      .text(panelX, panelY - panelHeight / 2 + 20, "ANÁLISE DE INFORMAÇÕES", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    this.questionPanel.add(panelTitle);

    // Texto da pergunta com estilo melhorado
    this.questionText = this.add
      .text(panelX, panelY + 10, "", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
        wordWrap: { width: panelWidth - 80 },
        lineSpacing: 8,
        padding: { left: 10, right: 10, top: 10, bottom: 10 },
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0.5);

    this.questionPanel.add(this.questionText);

    // Decoração para o painel - ícones melhorados
    const leftIcon = this.add
      .image(panelX - panelWidth / 2 + 35, panelY - panelHeight / 2 + 20, "data_icon")
      .setScale(0.2)
      .setTint(0x39f5e2);

    const rightIcon = this.add
      .image(panelX + panelWidth / 2 - 35, panelY - panelHeight / 2 + 20, "data_icon")
      .setScale(0.2)
      .setTint(0x39f5e2);

    // Animar ícones sutilmente
    this.tweens.add({
      targets: [leftIcon, rightIcon],
      angle: { from: -5, to: 5 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.questionPanel.add([leftIcon, rightIcon]);

    // Número da questão atual - estilo melhorado
    const questionCounterBg = this.add.graphics();
    questionCounterBg.fillStyle(this.colors.primary, 0.6);
    questionCounterBg.fillRoundedRect(panelX - panelWidth / 2 + 15, panelY + panelHeight / 2 - 40, 120, 30, 5);
    questionCounterBg.lineStyle(1, this.colors.secondary, 0.7);
    questionCounterBg.strokeRoundedRect(panelX - panelWidth / 2 + 15, panelY + panelHeight / 2 - 40, 120, 30, 5);
    this.questionPanel.add(questionCounterBg);

    this.questionCounter = this.add
      .text(panelX - panelWidth / 2 + 75, panelY + panelHeight / 2 - 25, "", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5, 0.5);

    this.questionPanel.add(this.questionCounter);

    // Adicionar efeito de quadrículas/scanlines no painel
    const scanlines = this.add.graphics();
    scanlines.lineStyle(1, 0x39f5e2, 0.05);

    // Linhas horizontais
    for (let y = panelY - panelHeight / 2 + 40; y < panelY + panelHeight / 2; y += 4) {
      scanlines.beginPath();
      scanlines.moveTo(panelX - panelWidth / 2 + 5, y);
      scanlines.lineTo(panelX + panelWidth / 2 - 5, y);
      scanlines.strokePath();
    }

    this.questionPanel.add(scanlines);
  };

  /**
   * Cria os botões de resposta
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  gameInicial.prototype.createAnswerButtons = function (width, height) {
    // Container para botões
    this.buttonContainer = this.add.container(0, 0);
    this.gameContainer.add(this.buttonContainer);

    // Posição dos botões
    const buttonY = height / 2 + 150;

    // Botão SIM - botão estilizado moderno
    this.yesButton = this.createCyberButton(width / 2 - 150, buttonY, "SIM, CONTÉM DADOS SENSÍVEIS", () => this.checkAnswer(true), {
      width: 280,
      height: 60,
      primaryColor: this.colors.positive,
      secondaryColor: 0x00dd00,
      icon: "✓",
    });

    // Botão NÃO - botão estilizado moderno
    this.noButton = this.createCyberButton(width / 2 + 150, buttonY, "NÃO CONTÉM DADOS SENSÍVEIS", () => this.checkAnswer(false), {
      width: 280,
      height: 60,
      primaryColor: this.colors.negative,
      secondaryColor: 0xff6666,
      icon: "✗",
    });

    // Adicionar botões ao container
    this.buttonContainer.add([this.yesButton, this.noButton]);
  };

  /**
   * Cria um botão com estilo cyberpunk moderno
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função de callback
   * @param {Object} config - Configurações opcionais
   * @returns {Phaser.GameObjects.Container} - Container com o botão
   */
  gameInicial.prototype.createCyberButton = function (x, y, text, callback, config = {}) {
    // Mesclar configurações padrão
    const defaults = {
      width: 200,
      height: 50,
      fontSize: 16,
      primaryColor: this.colors.primary,
      secondaryColor: this.colors.secondary,
      icon: null,
      cornerRadius: 10,
      shadow: true,
      glow: true,
    };

    const options = { ...defaults, ...config };

    // Container principal
    const container = this.add.container(x, y);

    // Sombra
    if (options.shadow) {
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.5);
      shadow.fillRoundedRect(-options.width / 2 + 4, -options.height / 2 + 4, options.width, options.height, options.cornerRadius);
      container.add(shadow);
    }

    // Glow externo
    if (options.glow) {
      const glow = this.add.graphics();
      glow.lineStyle(4, options.secondaryColor, 0.3);
      glow.strokeRoundedRect(-options.width / 2 - 3, -options.height / 2 - 3, options.width + 6, options.height + 6, options.cornerRadius + 2);
      container.add(glow);

      // Animar o glow
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.3, to: 0.7 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
      });
    }

    // Fundo principal do botão
    const bg = this.add.graphics();
    bg.fillStyle(options.primaryColor, 0.9);
    bg.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, options.cornerRadius);

    // Efeito de brilho no topo
    bg.fillStyle(0xffffff, 0.3);
    bg.fillRoundedRect(-options.width / 2 + 4, -options.height / 2 + 4, options.width - 8, options.height / 3, { tl: options.cornerRadius - 2, tr: options.cornerRadius - 2, bl: 0, br: 0 });

    // Bordas detalhadas
    bg.lineStyle(2, options.secondaryColor, 0.9);
    bg.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, options.cornerRadius);

    // Linhas decorativas
    bg.lineStyle(1, options.secondaryColor, 0.5);

    // Linha horizontal inferior
    bg.beginPath();
    bg.moveTo(-options.width / 2 + 15, options.height / 2 - 10);
    bg.lineTo(options.width / 2 - 15, options.height / 2 - 10);
    bg.strokePath();

    // Linhas angulares nos cantos (estilo tech/cyber)
    bg.beginPath();
    bg.moveTo(-options.width / 2 + 5, -options.height / 2 + 5);
    bg.lineTo(-options.width / 2 + 15, -options.height / 2 + 5);
    bg.lineTo(-options.width / 2 + 15, -options.height / 2 + 15);
    bg.strokePath();

    bg.beginPath();
    bg.moveTo(options.width / 2 - 5, -options.height / 2 + 5);
    bg.lineTo(options.width / 2 - 15, -options.height / 2 + 5);
    bg.lineTo(options.width / 2 - 15, -options.height / 2 + 15);
    bg.strokePath();

    bg.beginPath();
    bg.moveTo(-options.width / 2 + 5, options.height / 2 - 5);
    bg.lineTo(-options.width / 2 + 15, options.height / 2 - 5);
    bg.lineTo(-options.width / 2 + 15, options.height / 2 - 15);
    bg.strokePath();

    bg.beginPath();
    bg.moveTo(options.width / 2 - 5, options.height / 2 - 5);
    bg.lineTo(options.width / 2 - 15, options.height / 2 - 5);
    bg.lineTo(options.width / 2 - 15, options.height / 2 - 15);
    bg.strokePath();

    container.add(bg);

    // Calcular posição do texto considerando o ícone
    let textX = 0;
    if (options.icon) {
      // Adicionar ícone
      const icon = this.add
        .text(-options.width / 2 + 35, 0, options.icon, {
          fontSize: `${options.fontSize + 10}px`,
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      container.add(icon);
      textX = 15; // Deslocamento para o texto
    }

    // Texto do botão
    const buttonText = this.add
      .text(textX, 0, text, {
        fontSize: `${options.fontSize}px`,
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    container.add(buttonText);

    // Interatividade
    container.setInteractive(new Phaser.Geom.Rectangle(-options.width / 2, -options.height / 2, options.width, options.height), Phaser.Geom.Rectangle.Contains);

    // Estado hover
    container.on("pointerover", () => {
      bg.clear();

      // Refazer com cores invertidas
      bg.fillStyle(options.secondaryColor, 0.9);
      bg.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, options.cornerRadius);

      bg.fillStyle(0xffffff, 0.3);
      bg.fillRoundedRect(-options.width / 2 + 4, -options.height / 2 + 4, options.width - 8, options.height / 3, { tl: options.cornerRadius - 2, tr: options.cornerRadius - 2, bl: 0, br: 0 });

      bg.lineStyle(2, options.primaryColor, 0.9);
      bg.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, options.cornerRadius);

      // Redesenhar as linhas decorativas
      bg.lineStyle(1, options.primaryColor, 0.5);

      bg.beginPath();
      bg.moveTo(-options.width / 2 + 15, options.height / 2 - 10);
      bg.lineTo(options.width / 2 - 15, options.height / 2 - 10);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(-options.width / 2 + 5, -options.height / 2 + 5);
      bg.lineTo(-options.width / 2 + 15, -options.height / 2 + 5);
      bg.lineTo(-options.width / 2 + 15, -options.height / 2 + 15);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(options.width / 2 - 5, -options.height / 2 + 5);
      bg.lineTo(options.width / 2 - 15, -options.height / 2 + 5);
      bg.lineTo(options.width / 2 - 15, -options.height / 2 + 15);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(-options.width / 2 + 5, options.height / 2 - 5);
      bg.lineTo(-options.width / 2 + 15, options.height / 2 - 5);
      bg.lineTo(-options.width / 2 + 15, options.height / 2 - 15);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(options.width / 2 - 5, options.height / 2 - 5);
      bg.lineTo(options.width / 2 - 15, options.height / 2 - 5);
      bg.lineTo(options.width / 2 - 15, options.height / 2 - 15);
      bg.strokePath();

      // Efeito de escala
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });

      // Som de hover
      if (this.sound.get("hover")) {
        this.sound.play("hover", { volume: 0.3 });
      }
    });

    // Estado normal
    container.on("pointerout", () => {
      bg.clear();

      // Refazer na cor normal
      bg.fillStyle(options.primaryColor, 0.9);
      bg.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, options.cornerRadius);

      bg.fillStyle(0xffffff, 0.3);
      bg.fillRoundedRect(-options.width / 2 + 4, -options.height / 2 + 4, options.width - 8, options.height / 3, { tl: options.cornerRadius - 2, tr: options.cornerRadius - 2, bl: 0, br: 0 });

      bg.lineStyle(2, options.secondaryColor, 0.9);
      bg.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, options.cornerRadius);

      // Redesenhar as linhas decorativas
      bg.lineStyle(1, options.secondaryColor, 0.5);

      bg.beginPath();
      bg.moveTo(-options.width / 2 + 15, options.height / 2 - 10);
      bg.lineTo(options.width / 2 - 15, options.height / 2 - 10);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(-options.width / 2 + 5, -options.height / 2 + 5);
      bg.lineTo(-options.width / 2 + 15, -options.height / 2 + 5);
      bg.lineTo(-options.width / 2 + 15, -options.height / 2 + 15);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(options.width / 2 - 5, -options.height / 2 + 5);
      bg.lineTo(options.width / 2 - 15, -options.height / 2 + 5);
      bg.lineTo(options.width / 2 - 15, -options.height / 2 + 15);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(-options.width / 2 + 5, options.height / 2 - 5);
      bg.lineTo(-options.width / 2 + 15, options.height / 2 - 5);
      bg.lineTo(-options.width / 2 + 15, options.height / 2 - 15);
      bg.strokePath();

      bg.beginPath();
      bg.moveTo(options.width / 2 - 5, options.height / 2 - 5);
      bg.lineTo(options.width / 2 - 15, options.height / 2 - 5);
      bg.lineTo(options.width / 2 - 15, options.height / 2 - 15);
      bg.strokePath();

      // Restaurar escala
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    // Clique
    container.on("pointerdown", () => {
      // Efeito de pressionar
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });

      // Som de clique
      if (this.sound.get("click")) {
        this.sound.play("click", { volume: 0.5 });
      }
    });

    return container;
  };

  /**
   * Cria o indicador de progresso
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  gameInicial.prototype.createProgressIndicator = function (width, height) {
    // Container para o indicador
    this.progressContainer = this.add.container(0, height - 60);
    this.gameContainer.add(this.progressContainer);

    // Fundo para todo indicador de progresso
    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x000000, 0.4);
    progressBg.fillRect(0, -20, width, 80);
    progressBg.lineStyle(1, this.colors.secondary, 0.5);
    progressBg.beginPath();
    progressBg.moveTo(0, -20);
    progressBg.lineTo(width, -20);
    progressBg.strokePath();
    this.progressContainer.add(progressBg);

    // Texto de progresso com estilo melhorado
    this.progressText = this.add
      .text(width / 2, 0, "", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0);

    this.progressContainer.add(this.progressText);

    // Barra de progresso estilizada
    const progressBarWidth = width * 0.6;
    const progressBarHeight = 15;

    // Adicionar "moldura" para a barra
    const progressFrame = this.add.graphics();
    progressFrame.lineStyle(2, this.colors.primary, 0.9);
    progressFrame.strokeRoundedRect(width / 2 - progressBarWidth / 2 - 2, 29, progressBarWidth + 4, progressBarHeight + 4, 8);
    this.progressContainer.add(progressFrame);

    // Fundo da barra
    this.progressBarBg = this.add.graphics();
    this.progressBarBg.fillStyle(0x333333, 0.8);
    this.progressBarBg.fillRoundedRect(width / 2 - progressBarWidth / 2, 31, progressBarWidth, progressBarHeight, 6);
    this.progressContainer.add(this.progressBarBg);

    // Linhas de graduação na barra (para marcar as etapas)
    const tickMarks = this.add.graphics();
    tickMarks.lineStyle(1, 0xcccccc, 0.3);

    // Adicionar marcadores para cada questão
    for (let i = 1; i < 5; i++) {
      // Para 5 questões, 4 divisões
      const x = width / 2 - progressBarWidth / 2 + (progressBarWidth / 5) * i;
      tickMarks.beginPath();
      tickMarks.moveTo(x, 31);
      tickMarks.lineTo(x, 31 + progressBarHeight);
      tickMarks.strokePath();
    }

    this.progressContainer.add(tickMarks);

    // Preenchimento da barra (será atualizado dinamicamente)
    this.progressBarFill = this.add.graphics();
    this.progressContainer.add(this.progressBarFill);

    // Atualizar a barra de progresso
    this.updateProgressBar(0);
  };

  /**
   * Atualiza a barra de progresso
   * @param {number} progress - Progresso atual (0-1)
   */
  gameInicial.prototype.updateProgressBar = function (progress) {
    const progressBarWidth = this.screenWidth * 0.6;
    const progressBarHeight = 15;
    const fillWidth = progressBarWidth * progress;

    this.progressBarFill.clear();

    // Criar um gradiente para o preenchimento (simulado)
    const colors = [0x0d84ff, 0x39f5e2]; // Do azul ao ciano
    const segments = 10;
    const segmentWidth = fillWidth / segments;

    for (let i = 0; i < segments; i++) {
      // Interpolar entre as duas cores
      const ratio = i / segments;
      const r = Math.floor(((colors[1] >> 16) & 0xff) * ratio + ((colors[0] >> 16) & 0xff) * (1 - ratio));
      const g = Math.floor(((colors[1] >> 8) & 0xff) * ratio + ((colors[0] >> 8) & 0xff) * (1 - ratio));
      const b = Math.floor((colors[1] & 0xff) * ratio + (colors[0] & 0xff) * (1 - ratio));

      const color = (r << 16) | (g << 8) | b;

      this.progressBarFill.fillStyle(color, 1);

      // Cantos arredondados apenas nas extremidades
      if (i === 0 && segments === 1) {
        // Se for único segmento
        this.progressBarFill.fillRoundedRect(this.screenWidth / 2 - progressBarWidth / 2, this.progressContainer.y + 31, segmentWidth, progressBarHeight, 6);
      } else if (i === 0) {
        // Primeiro segmento (esquerda arredondada)
        this.progressBarFill.fillRoundedRect(this.screenWidth / 2 - progressBarWidth / 2, this.progressContainer.y + 31, segmentWidth, progressBarHeight, { tl: 6, bl: 6, tr: 0, br: 0 });
      } else if (i === segments - 1) {
        // Último segmento (direita arredondada)
        this.progressBarFill.fillRoundedRect(this.screenWidth / 2 - progressBarWidth / 2 + i * segmentWidth, this.progressContainer.y + 31, segmentWidth, progressBarHeight, { tr: 6, br: 6, tl: 0, bl: 0 });
      } else {
        // Segmentos do meio (sem arredondamento)
        this.progressBarFill.fillRect(this.screenWidth / 2 - progressBarWidth / 2 + i * segmentWidth, this.progressContainer.y + 31, segmentWidth, progressBarHeight);
      }
    }

    // Adicionar brilho na parte superior
    if (fillWidth > 0) {
      this.progressBarFill.fillStyle(0xffffff, 0.3);
      this.progressBarFill.fillRect(this.screenWidth / 2 - progressBarWidth / 2, this.progressContainer.y + 31, fillWidth, progressBarHeight / 3);
    }

    // Atualizar texto de progresso
    if (this.questions) {
      const questaoAtual = this.currentQuestionIndex + 1;
      const totalQuestoes = this.questions.length;

      this.progressText.setText(`QUESTÃO ${questaoAtual} DE ${totalQuestoes}`);

      // Animar o texto ao atualizar
      this.tweens.killTweensOf(this.progressText);
      this.progressText.setScale(1.2);
      this.tweens.add({
        targets: this.progressText,
        scale: 1,
        duration: 300,
        ease: "Back.easeOut",
      });
    }
  };

  /**
   * Inicia o jogo com uma introdução
   */
  gameInicial.prototype.startGameIntro = function () {
    // Ocultar elementos do jogo durante a introdução
    this.questionPanel.setVisible(false);
    this.buttonContainer.setVisible(false);

    // Criar painel de introdução
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Efeito de brilho externo
    const introBgGlow = this.add.graphics();
    introBgGlow.lineStyle(6, this.colors.secondary, 0.3);
    introBgGlow.strokeRoundedRect(width / 2 - 410, height / 2 - 210, 820, 420, 25);

    // Animar o brilho
    this.tweens.add({
      targets: introBgGlow,
      alpha: { from: 0.3, to: 0.6 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Fundo do painel com efeito de gradiente
    const introBg = this.add.graphics();

    // Cores do gradiente
    const startColor = 0x0d468a;
    const endColor = 0x052d5e;

    // Vários retângulos para simular gradiente
    for (let i = 0; i < 5; i++) {
      const alpha = 0.9 - i * 0.02;
      const color = Phaser.Display.Color.ValueToColor(startColor);
      const darkerColor = Phaser.Display.Color.ValueToColor(endColor);
      const lerpColor = Phaser.Display.Color.Interpolate.ColorWithColor(color, darkerColor, 5, i);
      const rgbColor = Phaser.Display.Color.GetColor(lerpColor.r, lerpColor.g, lerpColor.b);

      introBg.fillStyle(rgbColor, alpha);
      introBg.fillRoundedRect(width / 2 - 400, height / 2 - 200 + i * 80, 800, 80, i === 0 ? { tl: 20, tr: 20, bl: 0, br: 0 } : i === 4 ? { tl: 0, tr: 0, bl: 20, br: 20 } : 0);
    }

    // Borda
    introBg.lineStyle(3, this.colors.primary, 0.8);
    introBg.strokeRoundedRect(width / 2 - 400, height / 2 - 200, 800, 400, 20);

    // Título com estilo aprimorado
    const introTitle = this.add
      .text(width / 2, height / 2 - 160, "TREINAMENTO DE IDENTIFICAÇÃO DE DADOS", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Adicionar faixa de título
    const titleBg = this.add.graphics();
    titleBg.fillStyle(this.colors.primary, 0.6);
    titleBg.fillRoundedRect(width / 2 - 390, height / 2 - 180, 780, 50, { tl: 18, tr: 18, bl: 5, br: 5 });

    // Linhas decorativas
    titleBg.lineStyle(1, this.colors.secondary, 0.7);
    titleBg.beginPath();
    titleBg.moveTo(width / 2 - 350, height / 2 - 180);
    titleBg.lineTo(width / 2 - 350, height / 2 - 130);
    titleBg.strokePath();

    titleBg.beginPath();
    titleBg.moveTo(width / 2 + 350, height / 2 - 180);
    titleBg.lineTo(width / 2 + 350, height / 2 - 130);
    titleBg.strokePath();

    // Ícone com efeito visual
    const introIcon = this.add
      .image(width / 2, height / 2 - 80, "data_icon")
      .setScale(0.4)
      .setTint(0x39f5e2);

    // Adicionar brilho ao ícone
    const iconGlow = this.add.graphics();
    iconGlow.fillStyle(0x39f5e2, 0.2);
    iconGlow.fillCircle(width / 2, height / 2 - 80, 45);

    // Texto com estilo moderno
    const introText = this.add
      .text(width / 2, height / 2 + 20, "Como agente DPO, você precisa identificar corretamente quais informações contêm dados sensíveis.\n\n" + "Dados sensíveis incluem informações sobre origem racial ou étnica, convicção religiosa, opinião política, dados referentes à saúde ou à vida sexual, dados genéticos ou biométricos, e dados de crianças e adolescentes.\n\n" + "Analise cada caso e determine se há dados sensíveis presentes.", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
        wordWrap: { width: 700 },
        lineSpacing: 8,
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    // Botão de início estilizado
    const startButton = this.createCyberButton(
      width / 2,
      height / 2 + 160,
      "INICIAR TREINAMENTO",
      () => {
        // Remover elementos de introdução
        this.tweens.add({
          targets: [introBg, introBgGlow, introTitle, titleBg, introIcon, iconGlow, introText, startButton],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            introBg.destroy();
            introBgGlow.destroy();
            introTitle.destroy();
            titleBg.destroy();
            introIcon.destroy();
            iconGlow.destroy();
            introText.destroy();
            startButton.destroy();

            // Mostrar elementos do jogo
            this.questionPanel.setVisible(true);
            this.buttonContainer.setVisible(true);

            // Iniciar o jogo
            this.gameStarted = true;
            this.showQuestion();
          },
        });
      },
      {
        width: 300,
        height: 60,
        fontSize: 20,
        primaryColor: this.colors.primary,
        secondaryColor: this.colors.secondary,
        icon: "▶️",
      }
    );

    // Animação de entrada
    const introElements = [introBg, introBgGlow, introTitle, titleBg, introIcon, iconGlow, introText, startButton];
    introElements.forEach((el) => el.setAlpha(0));

    this.tweens.add({
      targets: [introBg, introBgGlow, titleBg],
      alpha: 1,
      duration: 500,
      ease: "Power2",
    });

    this.tweens.add({
      targets: [introTitle],
      alpha: 1,
      duration: 600,
      delay: 200,
      ease: "Power2",
    });

    this.tweens.add({
      targets: [introIcon, iconGlow],
      alpha: 1,
      duration: 600,
      delay: 400,
      ease: "Power2",
    });

    this.tweens.add({
      targets: [introText],
      alpha: 1,
      duration: 600,
      delay: 600,
      ease: "Power2",
    });

    this.tweens.add({
      targets: [startButton],
      alpha: 1,
      duration: 600,
      delay: 800,
      ease: "Power2",
    });

    // Animar o ícone
    this.tweens.add({
      targets: introIcon,
      y: introIcon.y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Animar o glow
    this.tweens.add({
      targets: iconGlow,
      alpha: { from: 0.2, to: 0.5 },
      scale: { from: 1, to: 1.2 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });
  };

  console.log("✅ Módulo de Interface carregado");
})();
