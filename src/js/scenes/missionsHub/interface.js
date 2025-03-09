/**
 * Funções relacionadas à interface do Hub de Missões
 */
(function () {
  /**
   * Cria a interface do Hub de Missões
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  missionsHub.prototype.createInterface = function (width, height) {
    // Container principal para UI
    this.uiContainer = this.add.container(0, 0);

    // Criar título principal
    this.createHeader(width);

    // Criar área de informações do jogador
    this.createPlayerInfoPanel(width, height);

    // Criar área de missões
    this.createMissionsArea(width, height);

    // Criar botões de navegação
    this.createNavigationButtons(width, height);

    // Criar botão de retorno ao menu
    this.createBackButton(width, height);
  };

  /**
   * Cria o cabeçalho do Hub de Missões
   * @param {number} width - Largura da tela
   */
  missionsHub.prototype.createHeader = function (width) {
    // Fundo do título
    const headerBg = this.add.graphics();
    headerBg.fillStyle(0x0d489f, 0.8);
    headerBg.fillRect(0, 0, width, 80);

    // Adicionar borda inferior do título
    headerBg.lineStyle(3, 0x39f5e2, 0.9);
    headerBg.beginPath();
    headerBg.moveTo(0, 80);
    headerBg.lineTo(width, 80);
    headerBg.strokePath();

    // Título principal
    const headerTitle = this.add
      .text(width / 2, 40, "CENTRAL DE MISSÕES AGPD", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Efeito de brilho no título
    this.tweens.add({
      targets: headerTitle,
      alpha: { from: 1, to: 0.8 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Adicionar ao container
    this.uiContainer.add([headerBg, headerTitle]);

    // Armazenar referências
    this.uiElements.header = {
      background: headerBg,
      title: headerTitle,
    };
  };

  /**
   * Cria o painel de informações do jogador
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  missionsHub.prototype.createPlayerInfoPanel = function (width, height) {
    // Container para informações do jogador
    const playerInfoContainer = this.add.container(0, 0);

    // Fundo do painel de informações
    const infoPanelBg = this.add.graphics();
    infoPanelBg.fillStyle(0x111927, 0.9);
    infoPanelBg.fillRoundedRect(width - 320, 100, 280, 150, 15);

    // Borda do painel
    infoPanelBg.lineStyle(2, 0x0d84ff, 1);
    infoPanelBg.strokeRoundedRect(width - 320, 100, 280, 150, 15);

    // Título do painel
    const panelTitle = this.add
      .text(width - 180, 120, "AGENTE DPO HERO", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Detalhes do jogador
    const levelText = this.add
      .text(width - 300, 155, "NÍVEL:", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0, 0.5);

    const levelValue = this.add
      .text(width - 220, 155, this.playerProgress.level.toString(), {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0, 0.5);

    const pointsText = this.add
      .text(width - 300, 185, "PONTOS:", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0, 0.5);

    const pointsValue = this.add
      .text(width - 220, 185, this.playerProgress.currentPoints.toString(), {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0, 0.5);

    const missionsText = this.add
      .text(width - 300, 215, "MISSÕES:", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0, 0.5);

    const missionsValue = this.add
      .text(width - 220, 215, `${this.playerProgress.completedMissions.length} / ${this.totalMissions}`, {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0, 0.5);

    // Adicionar todos ao container
    playerInfoContainer.add([infoPanelBg, panelTitle, levelText, levelValue, pointsText, pointsValue, missionsText, missionsValue]);

    // Adicionar ao container principal
    this.uiContainer.add(playerInfoContainer);

    // Armazenar referências
    this.uiElements.playerInfo = {
      container: playerInfoContainer,
      background: infoPanelBg,
      title: panelTitle,
      level: levelValue,
      points: pointsValue,
      missions: missionsValue,
    };
  };

  /**
   * Cria a área de exibição de missões
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  missionsHub.prototype.createMissionsArea = function (width, height) {
    // Container para área de missões
    this.missionsContainer = this.add.container(0, 0);

    // Fundo da área de missões
    const missionAreaBg = this.add.graphics();
    missionAreaBg.fillStyle(0x111927, 0.7);
    missionAreaBg.fillRoundedRect(width / 2 - 400, 120, 800, height - 250, 20);

    // Borda da área
    missionAreaBg.lineStyle(3, 0x0d84ff, 0.8);
    missionAreaBg.strokeRoundedRect(width / 2 - 400, 120, 800, height - 250, 20);

    // Área para os cards de missão
    this.missionCardsContainer = this.add.container(0, 0);

    // Título da área
    const areaTitle = this.add
      .text(width / 2, 150, "MISSÕES DISPONÍVEIS", {
        fontSize: "22px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Adicionar ao container principal
    this.missionsContainer.add([missionAreaBg, areaTitle, this.missionCardsContainer]);
    this.uiContainer.add(this.missionsContainer);

    // Armazenar referências
    this.uiElements.missionsArea = {
      container: this.missionsContainer,
      background: missionAreaBg,
      title: areaTitle,
      cardsContainer: this.missionCardsContainer,
    };
  };

  /**
   * Cria botões de navegação entre as missões
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  missionsHub.prototype.createNavigationButtons = function (width, height) {
    // Container para botões de navegação
    const navButtonsContainer = this.add.container(0, 0);

    // Botão anterior
    this.prevButton = this.createButton(
      width / 2 - 150,
      height - 80,
      "ANTERIOR",
      () => {
        this.navigateMissions(-1);
      },
      {
        width: 140,
        height: 40,
        fontSize: 16,
        primaryColor: 0x0d84ff,
        secondaryColor: 0x39f5e2,
      }
    );

    // Botão próximo
    this.nextButton = this.createButton(
      width / 2 + 150,
      height - 80,
      "PRÓXIMA",
      () => {
        this.navigateMissions(1);
      },
      {
        width: 140,
        height: 40,
        fontSize: 16,
        primaryColor: 0x0d84ff,
        secondaryColor: 0x39f5e2,
      }
    );

    // Adicionar ao container
    navButtonsContainer.add([this.prevButton.container, this.nextButton.container]);

    // Adicionar ao container principal
    this.uiContainer.add(navButtonsContainer);

    // Armazenar referências
    this.uiElements.navigationButtons = {
      container: navButtonsContainer,
      prev: this.prevButton,
      next: this.nextButton,
    };
  };

  /**
   * Cria botão de retorno ao menu principal
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  missionsHub.prototype.createBackButton = function (width, height) {
    // Botão para voltar ao menu principal
    this.backButton = this.createButton(
      120,
      height - 50,
      "VOLTAR AO MENU",
      () => {
        this.returnToMainMenu();
      },
      {
        width: 180,
        height: 40,
        fontSize: 16,
        primaryColor: 0x990000,
        secondaryColor: 0xff3333,
      }
    );

    // Adicionar ao container principal
    this.uiContainer.add(this.backButton.container);

    // Armazenar referência
    this.uiElements.backButton = this.backButton;
  };

  /**
   * Cria um botão personalizado com estilo
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função a chamar quando clicado
   * @param {Object} config - Configurações do botão
   * @returns {Object} - Objeto com componentes do botão
   */
  missionsHub.prototype.createButton = function (x, y, text, callback, config = {}) {
    // Valores padrão
    const options = {
      width: 200,
      height: 50,
      fontSize: 18,
      color: "#FFFFFF",
      primaryColor: 0x0d84ff, // Cor principal
      secondaryColor: 0x39f5e2, // Cor secundária
      stroke: 0x39f5e2, // Cor da borda
      shadowColor: 0x000000, // Cor da sombra
      ...config,
    };

    // Container principal
    const container = this.add.container(x, y);

    // Sombra
    const shadow = this.add.graphics();
    shadow.fillStyle(options.shadowColor, 0.4);
    shadow.fillRoundedRect(-options.width / 2 + 3, -options.height / 2 + 3, options.width, options.height, 10);
    container.add(shadow);

    // Background do botão
    const background = this.add.graphics();
    background.fillStyle(options.primaryColor, 1);
    background.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);

    // Borda
    background.lineStyle(2, options.stroke, 1);
    background.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);

    container.add(background);

    // Efeito de destaque na parte superior
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.3);
    highlight.fillRoundedRect(-options.width / 2 + 4, -options.height / 2 + 4, options.width - 8, options.height / 3, { tl: 8, tr: 8, bl: 0, br: 0 });
    container.add(highlight);

    // Texto
    const buttonText = this.add
      .text(0, 0, text, {
        fontSize: `${options.fontSize}px`,
        fontFamily: this.fontFamily,
        fill: options.color,
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    container.add(buttonText);

    // Linha de brilho na parte inferior
    const bottomGlow = this.add.graphics();
    bottomGlow.lineStyle(2, options.secondaryColor, 0.5);
    bottomGlow.beginPath();
    bottomGlow.moveTo(-options.width / 2 + 10, options.height / 2 - 3);
    bottomGlow.lineTo(options.width / 2 - 10, options.height / 2 - 3);
    bottomGlow.strokePath();
    container.add(bottomGlow);

    // Tornar o botão interativo
    container.setInteractive(new Phaser.Geom.Rectangle(-options.width / 2, -options.height / 2, options.width, options.height), Phaser.Geom.Rectangle.Contains);

    // Estado do botão
    const buttonState = {
      isOver: false,
      isDown: false,
      originalScale: 1,
    };

    // Eventos do mouse
    container.on("pointerover", () => {
      buttonState.isOver = true;
      this.updateButtonVisual(container, background, buttonText, options, buttonState);

      // Som de hover
      if (this.sound.get("hover")) {
        this.sound.play("hover", { volume: 0.3 });
      }
    });

    container.on("pointerout", () => {
      buttonState.isOver = false;
      buttonState.isDown = false;
      this.updateButtonVisual(container, background, buttonText, options, buttonState);
    });

    container.on("pointerdown", () => {
      buttonState.isDown = true;
      this.updateButtonVisual(container, background, buttonText, options, buttonState);
    });

    container.on("pointerup", () => {
      if (buttonState.isDown && buttonState.isOver) {
        // Som de clique
        if (this.sound.get("click")) {
          this.sound.play("click", { volume: 0.5 });
        }

        // Adicionar efeito de clique
        this.tweens.add({
          targets: container,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 50,
          yoyo: true,
          onComplete: () => {
            // Verificar novamente se o botão ainda existe e é válido
            if (container.active && container.visible) {
              // Chamar callback
              if (callback) callback();

              // Restaurar estado após o clique
              buttonState.isDown = false;
              this.updateButtonVisual(container, background, buttonText, options, buttonState);
            }
          },
        });
      } else {
        buttonState.isDown = false;
        this.updateButtonVisual(container, background, buttonText, options, buttonState);
      }
    });

    // Retornar componentes do botão para acesso posterior
    return {
      container,
      background,
      text: buttonText,
      state: buttonState,
      options,
    };
  };

  /**
   * Atualiza o visual do botão com base no estado
   * @param {Phaser.GameObjects.Container} container - Container do botão
   * @param {Phaser.GameObjects.Graphics} background - Fundo do botão
   * @param {Phaser.GameObjects.Text} text - Texto do botão
   * @param {Object} options - Configurações do botão
   * @param {Object} state - Estado atual do botão
   */
  missionsHub.prototype.updateButtonVisual = function (container, background, text, options, state) {
    // Limpar gráficos
    background.clear();

    if (state.isDown) {
      // Estado pressionado
      background.fillStyle(options.secondaryColor, 1);
      text.setColor("#111111"); // Texto escuro para contraste
    } else if (state.isOver) {
      // Estado hover
      background.fillStyle(0x24a2ff, 1); // Azul mais brilhante
      text.setColor("#FFFFFF");

      // Escalar suavemente para cima
      if (container.scaleX === 1) {
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100,
          ease: "Power1",
        });
      }
    } else {
      // Estado normal
      background.fillStyle(options.primaryColor, 1);
      text.setColor("#FFFFFF");

      // Retornar à escala normal
      if (container.scaleX !== 1) {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          ease: "Power1",
        });
      }
    }

    // Redesenhar o fundo
    background.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);

    // Redesenhar a borda
    background.lineStyle(2, options.stroke, 1);
    background.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);
  };

  /**
   * Recria a interface após redimensionamento
   * @param {number} width - Nova largura
   * @param {number} height - Nova altura
   */
  missionsHub.prototype.recreateInterface = function (width, height) {
    try {
      // Verificar se o uiContainer existe
      if (!this.uiContainer) return;

      // Limpar mensagens de erro que possam estar visíveis
      if (this.errorMessages) {
        this.errorMessages.forEach((msg) => {
          if (msg && msg.destroy) msg.destroy();
        });
        this.errorMessages = [];
      }

      // Remover elementos antigos com segurança
      this.uiContainer.removeAll(true);

      // Limpar referências ao missionCards para evitar interações com objetos destruídos
      this.missionCards = [];

      // Recriar interface
      this.createInterface(width, height);

      // Atualizar exibição de missões
      this.displayMissions();
    } catch (error) {
      console.error("Erro ao recriar interface:", error);
    }
  };

  /**
   * Mostra uma mensagem de erro temporária
   * @param {string} message - Mensagem de erro
   * @param {number} duration - Duração em ms (padrão: 3000ms)
   */
  missionsHub.prototype.showError = function (message, duration = 3000) {
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Criar container para a mensagem
    const errorContainer = this.add.container(width / 2, height / 2);
    errorContainer.setDepth(1000); // Garantir que fique acima de tudo

    // Fundo da mensagem
    const errorBg = this.add.graphics();
    errorBg.fillStyle(0x990000, 0.9);
    errorBg.fillRoundedRect(-200, -50, 400, 100, 15);
    errorBg.lineStyle(2, 0xff3333, 1);
    errorBg.strokeRoundedRect(-200, -50, 400, 100, 15);

    // Texto da mensagem
    const errorText = this.add
      .text(0, 0, message, {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 380 },
      })
      .setOrigin(0.5);

    // Adicionar ao container
    errorContainer.add([errorBg, errorText]);

    // Animação de entrada
    errorContainer.setAlpha(0);
    errorContainer.setScale(0.8);

    this.tweens.add({
      targets: errorContainer,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Desaparecer após o tempo determinado
        this.time.delayedCall(duration, () => {
          this.tweens.add({
            targets: errorContainer,
            alpha: 0,
            scale: 0.8,
            duration: 300,
            ease: "Back.easeIn",
            onComplete: () => {
              errorContainer.destroy();
            },
          });
        });
      },
    });

    // Armazenar referência para poder limpar depois
    if (!this.errorMessages) this.errorMessages = [];
    this.errorMessages.push(errorContainer);

    return errorContainer;
  };

  console.log("✅ Interface do Hub de Missões carregada");
})();
