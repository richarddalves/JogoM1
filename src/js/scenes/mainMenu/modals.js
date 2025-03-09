/**
 * Funções de modais e diálogos do menu principal
 */
(function () {
  /**
   * Abre a tela de configurações
   */
  mainMenu.prototype.openSettings = function () {
    // Criar painel de configurações como overlay
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Container para o painel
    this.settingsContainer = this.add.container(0, 0);

    // Fundo escurecido
    const settingsOverlay = this.add.graphics();
    settingsOverlay.fillStyle(0x000000, 0.8);
    settingsOverlay.fillRect(0, 0, width, height);

    this.settingsContainer.add(settingsOverlay);

    // Painel de configurações
    const panelWidth = Math.min(600, width * 0.8);
    const panelHeight = Math.min(500, height * 0.7);

    const settingsPanel = this.add.graphics();
    settingsPanel.fillStyle(this.colors.darkGlass, 0.95);
    settingsPanel.fillRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    settingsPanel.lineStyle(3, this.colors.primary, 1);
    settingsPanel.strokeRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    this.settingsContainer.add(settingsPanel);

    // Título
    const settingsTitle = this.add
      .text(width / 2, height / 2 - panelHeight / 2 + 40, "CONFIGURAÇÕES", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    this.settingsContainer.add(settingsTitle);

    // Aviso de versão demo
    const demoNotice = this.add
      .text(width / 2, height / 2, "Configurações indisponíveis na versão demo", {
        fontSize: "20px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    this.settingsContainer.add(demoNotice);

    // Botão Fechar
    const closeButton = this.createStyledButton(width / 2, height / 2 + panelHeight / 2 - 60, "FECHAR", () => this.closeSettings(), null);

    this.settingsContainer.add(closeButton);

    // Animação de entrada
    this.settingsContainer.setAlpha(0);

    this.tweens.add({
      targets: this.settingsContainer,
      alpha: 1,
      duration: 300,
    });

    // Som de abertura
    this.playSoundSafely("click_sound", { volume: 0.5 });
  };

  /**
   * Fecha a tela de configurações
   */
  mainMenu.prototype.closeSettings = function () {
    if (!this.settingsContainer) return;

    // Animação de saída
    this.tweens.add({
      targets: this.settingsContainer,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.settingsContainer.destroy();
        this.settingsContainer = null;
      },
    });

    // Som de fechamento
    this.playSoundSafely("click_sound", { volume: 0.5 });
  };

  /**
   * Abre a tela de acessibilidade
   */
  mainMenu.prototype.openAccessibility = function () {
    // Criar painel de acessibilidade como overlay
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Container para o painel
    this.accessibilityContainer = this.add.container(0, 0);

    // Fundo escurecido
    const accessibilityOverlay = this.add.graphics();
    accessibilityOverlay.fillStyle(0x000000, 0.8);
    accessibilityOverlay.fillRect(0, 0, width, height);

    this.accessibilityContainer.add(accessibilityOverlay);

    // Painel de acessibilidade
    const panelWidth = Math.min(600, width * 0.8);
    const panelHeight = Math.min(500, height * 0.7);

    const accessibilityPanel = this.add.graphics();
    accessibilityPanel.fillStyle(this.colors.darkGlass, 0.95);
    accessibilityPanel.fillRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    accessibilityPanel.lineStyle(3, this.colors.primary, 1);
    accessibilityPanel.strokeRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    this.accessibilityContainer.add(accessibilityPanel);

    // Título
    const accessibilityTitle = this.add
      .text(width / 2, height / 2 - panelHeight / 2 + 40, "ACESSIBILIDADE", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    this.accessibilityContainer.add(accessibilityTitle);

    // Aviso de versão demo
    const demoNotice = this.add
      .text(width / 2, height / 2, "Configurações de acessibilidade indisponíveis na versão demo", {
        fontSize: "20px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    this.accessibilityContainer.add(demoNotice);

    // Botão Fechar
    const closeButton = this.createStyledButton(width / 2, height / 2 + panelHeight / 2 - 60, "FECHAR", () => this.closeAccessibility(), null);

    this.accessibilityContainer.add(closeButton);

    // Animação de entrada
    this.accessibilityContainer.setAlpha(0);

    this.tweens.add({
      targets: this.accessibilityContainer,
      alpha: 1,
      duration: 300,
    });

    // Som de abertura
    this.playSoundSafely("click_sound", { volume: 0.5 });
  };

  /**
   * Fecha a tela de acessibilidade
   */
  mainMenu.prototype.closeAccessibility = function () {
    if (!this.accessibilityContainer) return;

    // Animação de saída
    this.tweens.add({
      targets: this.accessibilityContainer,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.accessibilityContainer.destroy();
        this.accessibilityContainer = null;
      },
    });

    // Som de fechamento
    this.playSoundSafely("click_sound", { volume: 0.5 });
  };

  /**
   * Mostra tela de ajuda
   */
  mainMenu.prototype.showHelp = function () {
    // Criar painel de ajuda como modal
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Container para o painel
    this.helpContainer = this.add.container(0, 0);

    // Fundo escurecido
    const helpOverlay = this.add.graphics();
    helpOverlay.fillStyle(0x000000, 0.8);
    helpOverlay.fillRect(0, 0, width, height);

    this.helpContainer.add(helpOverlay);

    // Painel de ajuda
    const panelWidth = Math.min(700, width * 0.8);
    const panelHeight = Math.min(550, height * 0.8);

    const helpPanel = this.add.graphics();
    helpPanel.fillStyle(this.colors.darkGlass, 0.95);
    helpPanel.fillRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    helpPanel.lineStyle(3, this.colors.primary, 1);
    helpPanel.strokeRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    this.helpContainer.add(helpPanel);

    // Título
    const helpTitle = this.add
      .text(width / 2, height / 2 - panelHeight / 2 + 40, "AJUDA & GUIA RÁPIDO", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    this.helpContainer.add(helpTitle);

    // Conteúdo de ajuda
    const helpContent = this.add
      .text(width / 2, height / 2, "DPO HERO: GUARDIÕES DE DADOS\n\n" + "Neste jogo, você assumirá o papel de um Agente DPO (Data Protection Officer)\n" + "cuja missão é proteger os dados pessoais dos cidadãos e garantir o cumprimento\n" + "da Lei Geral de Proteção de Dados (LGPD).\n\n" + "• Conclua missões para proteger os dados em diferentes cenários\n" + "• Identifique dados sensíveis e pessoais corretamente\n" + "• Resolva problemas de vazamentos e uso inadequado de dados\n" + "• Ganhe pontos, suba de nível e desbloqueie novas missões\n\n" + "CONTROLES:\n" + "• Setas do teclado: Movimentar o personagem\n" + "• E: Interagir com objetos e personagens\n" + "• H: Mostrar/esconder HUD do agente\n" + "• J: Expandir/recolher informações da HUD", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.helpContainer.add(helpContent);

    // Botão Fechar
    const closeButton = this.createStyledButton(width / 2, height / 2 + panelHeight / 2 - 60, "ENTENDIDO", () => this.closeHelp(), null);

    this.helpContainer.add(closeButton);

    // Animação de entrada
    this.helpContainer.setAlpha(0);

    this.tweens.add({
      targets: this.helpContainer,
      alpha: 1,
      duration: 300,
    });
  };

  /**
   * Fecha a tela de ajuda
   */
  mainMenu.prototype.closeHelp = function () {
    if (!this.helpContainer) return;

    // Animação de saída
    this.tweens.add({
      targets: this.helpContainer,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.helpContainer.destroy();
        this.helpContainer = null;
      },
    });
  };

  /**
   * Mostra informações sobre o jogo
   */
  mainMenu.prototype.showAbout = function () {
    // Criar painel sobre como modal
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Container para o painel
    this.aboutContainer = this.add.container(0, 0);

    // Fundo escurecido
    const aboutOverlay = this.add.graphics();
    aboutOverlay.fillStyle(0x000000, 0.8);
    aboutOverlay.fillRect(0, 0, width, height);

    this.aboutContainer.add(aboutOverlay);

    // Painel sobre
    const panelWidth = Math.min(700, width * 0.8);
    const panelHeight = Math.min(550, height * 0.8);

    const aboutPanel = this.add.graphics();
    aboutPanel.fillStyle(this.colors.darkGlass, 0.95);
    aboutPanel.fillRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    aboutPanel.lineStyle(3, this.colors.primary, 1);
    aboutPanel.strokeRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 16);

    this.aboutContainer.add(aboutPanel);

    // Título
    const aboutTitle = this.add
      .text(width / 2, height / 2 - panelHeight / 2 + 40, "SOBRE O JOGO", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    this.aboutContainer.add(aboutTitle);

    // Ícone do jogo
    const gameIcon = this.add.image(width / 2, height / 2 - 120, "hero_icon").setScale(0.6);

    this.aboutContainer.add(gameIcon);

    // Conteúdo sobre
    const aboutContent = this.add
      .text(width / 2, height / 2 + 20, "DPO HERO: GUARDIÕES DE DADOS\n" + "Versão 1.0.0\n\n" + "Um jogo educativo sobre proteção de dados e LGPD\n" + "desenvolvido para conscientizar sobre a importância da\n" + "privacidade digital e os direitos dos titulares de dados.\n\n" + "© 2025 Data Protection Heroes\n" + "Todos os direitos reservados.", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.aboutContainer.add(aboutContent);

    // Botão Fechar
    const closeButton = this.createStyledButton(width / 2, height / 2 + panelHeight / 2 - 60, "FECHAR", () => this.closeAbout(), null);

    this.aboutContainer.add(closeButton);

    // Animação de entrada
    this.aboutContainer.setAlpha(0);

    this.tweens.add({
      targets: this.aboutContainer,
      alpha: 1,
      duration: 300,
    });
  };

  /**
   * Fecha a tela sobre
   */
  mainMenu.prototype.closeAbout = function () {
    if (!this.aboutContainer) return;

    // Animação de saída
    this.tweens.add({
      targets: this.aboutContainer,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.aboutContainer.destroy();
        this.aboutContainer = null;
      },
    });
  };

  console.log("✅ Menu Modals Module loaded");
})();
