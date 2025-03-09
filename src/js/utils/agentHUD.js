/**
 * Interface do agente que exibe status, missões e recursos do jogador
 * @class AgentHUD
 * @description Cria e gerencia a HUD do jogador, exibindo informações vitais do jogo como nível, pontuação e missões
 */
class AgentHUD {
  /**
   * Cria uma nova instância da HUD do Agente
   * @param {Phaser.Scene} scene - A cena atual do jogo
   */
  constructor(scene) {
    this.scene = scene;
    this.isVisible = true;
    this.isExpanded = false;
    this.container = null;
    this.hudComponents = {};
    this.notificationQueue = [];
    this.isProcessingNotification = false;
    this.animations = [];

    // Configurações de estilo
    this.style = {
      colors: {
        primary: 0x0d84ff, // Azul principal
        secondary: 0x39f5e2, // Ciano secundário
        accent: 0xff3a3a, // Vermelho para alertas
        positive: 0x4caf50, // Verde para positivo
        warning: 0xffc107, // Amarelo para avisos
        dark: 0x1a1a2e, // Fundo escuro
        light: 0xffffff, // Texto claro
      },
      fonts: {
        main: {
          fontFamily: "OldSchoolAdventures",
          fontSize: "16px",
          color: "#FFFFFF",
        },
        title: {
          fontFamily: "OldSchoolAdventures",
          fontSize: "20px",
          color: "#FFFFFF",
        },
        small: {
          fontFamily: "OldSchoolAdventures",
          fontSize: "14px",
          color: "#CCCCCC",
        },
      },
      animation: {
        duration: 400,
        easing: "Sine.easeInOut",
      },
    };

    // Criar os elementos da HUD
    this.createHUD();

    // Configurar teclas de atalho
    this.setupKeyListeners();
  }

  /**
   * Cria todos os elementos visuais da HUD
   * @private
   */
  createHUD() {
    // Verificar se a scene é válida
    if (!this.scene || !this.scene.add) {
      console.error("❌ Cena inválida fornecida para AgentHUD");
      return;
    }

    // Criar container principal com profundidade alta para ficar sobre outros elementos
    this.container = this.scene.add.container(10, 10);
    this.container.setDepth(1000);

    // Criar a visualização recolhida (apenas ícone)
    this.createCollapsedView();

    // Criar a visualização expandida (painel completo)
    this.createExpandedView();

    // Inicializar na visualização recolhida
    this.toggleExpanded(false);

    // Atualizar informações
    this.updateHUDInfo();
  }

  /**
   * Cria a versão recolhida da HUD (apenas ícone)
   * @private
   */
  createCollapsedView() {
    // Container para a visão recolhida
    this.hudComponents.collapsedView = this.scene.add.container(0, 0);
    this.container.add(this.hudComponents.collapsedView);

    // Círculo exterior animado (aura)
    const outerAura = this.scene.add.graphics();
    outerAura.fillStyle(this.style.colors.primary, 0.3);
    outerAura.fillCircle(25, 25, 30);
    this.hudComponents.collapsedView.add(outerAura);

    // Animar a aura externa - Armazenar o tween para poder manipulá-lo depois
    this.collapsedAuraTween = this.scene.tweens.add({
      targets: outerAura,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.1,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Badge principal
    const badgeBg = this.scene.add.graphics();
    badgeBg.fillStyle(this.style.colors.primary, 0.8);
    badgeBg.fillCircle(25, 25, 25);
    badgeBg.lineStyle(2, this.style.colors.secondary);
    badgeBg.strokeCircle(25, 25, 25);
    this.hudComponents.collapsedView.add(badgeBg);

    // Ícone do agente
    const badgeIcon = this.scene.add
      .text(25, 25, "DPO", {
        fontSize: "16px",
        fontFamily: this.style.fonts.title.fontFamily,
        fontWeight: "bold",
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);
    this.hudComponents.collapsedView.add(badgeIcon);

    // Indicador de nível
    const levelIndicator = this.scene.add.container(40, 40);
    const levelBg = this.scene.add.graphics();
    levelBg.fillStyle(this.style.colors.accent, 0.9);
    levelBg.fillCircle(0, 0, 12);
    levelBg.lineStyle(1, this.style.colors.light);
    levelBg.strokeCircle(0, 0, 12);

    // Pegar o nível atual do jogador
    const playerLevel = this.getPlayerLevel();

    const levelText = this.scene.add
      .text(0, 0, playerLevel.toString(), {
        fontSize: "12px",
        fontFamily: this.style.fonts.main.fontFamily,
        fontWeight: "bold",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    levelIndicator.add([levelBg, levelText]);
    this.hudComponents.collapsedView.add(levelIndicator);
    this.hudComponents.levelIndicator = levelIndicator;

    // Adicionar interatividade
    this.hudComponents.collapsedView.setInteractive(new Phaser.Geom.Circle(25, 25, 30), Phaser.Geom.Circle.Contains);

    // Eventos
    this.hudComponents.collapsedView.on("pointerover", () => {
      badgeBg.clear();
      badgeBg.fillStyle(this.style.colors.secondary, 0.8);
      badgeBg.fillCircle(25, 25, 25);
      badgeBg.lineStyle(2, this.style.colors.primary);
      badgeBg.strokeCircle(25, 25, 25);

      // Criar o tooltip explicativo
      this.showTooltip("Central de Missões", 80, 25);

      this.scene.tweens.add({
        targets: this.hudComponents.collapsedView,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
      });
    });

    this.hudComponents.collapsedView.on("pointerout", () => {
      badgeBg.clear();
      badgeBg.fillStyle(this.style.colors.primary, 0.8);
      badgeBg.fillCircle(25, 25, 25);
      badgeBg.lineStyle(2, this.style.colors.secondary);
      badgeBg.strokeCircle(25, 25, 25);

      // Esconder o tooltip
      this.hideTooltip();

      this.scene.tweens.add({
        targets: this.hudComponents.collapsedView,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
      });
    });

    this.hudComponents.collapsedView.on("pointerdown", () => {
      this.toggleExpanded(true);

      // Efeito de som (se disponível e habilitado)
      if (this.scene.sound && this.scene.sound.add) {
        try {
          const clickSound = this.scene.sound.add("click_sound");
          if (clickSound) clickSound.play({ volume: 0.5 });
        } catch (e) {
          // Som não disponível, ignorar
        }
      }
    });
  }

  /**
   * Cria a versão expandida da HUD (painel completo)
   * @private
   */
  createExpandedView() {
    // Container para o painel expandido
    this.hudComponents.expandedView = this.scene.add.container(0, 0);
    this.container.add(this.hudComponents.expandedView);

    // Dimensões do painel
    const panelWidth = 320;
    const panelHeight = 240;

    // Sombra do painel
    const panelShadow = this.scene.add.graphics();
    this.drawRoundedRect(panelShadow, 5, 5, panelWidth, panelHeight, 10, 0x000000, null, 0, 0.5);
    this.hudComponents.expandedView.add(panelShadow);

    // Fundo do painel principal
    const panelBg = this.scene.add.graphics();
    this.drawRoundedRect(panelBg, 0, 0, panelWidth, panelHeight, 10, this.style.colors.dark, this.style.colors.primary, 2, 0.9);
    this.hudComponents.expandedView.add(panelBg);

    // Efeito de grade digital (simulando interface futurista)
    const gridEffect = this.scene.add.graphics();
    // Padrão de grade horizontal
    gridEffect.lineStyle(1, this.style.colors.primary, 0.2);
    for (let y = 20; y < panelHeight; y += 20) {
      gridEffect.beginPath();
      gridEffect.moveTo(10, y);
      gridEffect.lineTo(panelWidth - 10, y);
      gridEffect.strokePath();
    }
    // Linha de separação do cabeçalho
    gridEffect.lineStyle(2, this.style.colors.secondary, 0.5);
    gridEffect.beginPath();
    gridEffect.moveTo(0, 40);
    gridEffect.lineTo(panelWidth, 40);
    gridEffect.strokePath();
    this.hudComponents.expandedView.add(gridEffect);

    // Cabeçalho do painel
    const headerBg = this.scene.add.graphics();
    this.drawRoundedRect(
      headerBg,
      0,
      0,
      panelWidth,
      40,
      { tl: 10, tr: 10, bl: 0, br: 0 }, // Cantos arredondados apenas no topo
      this.style.colors.primary,
      null,
      0,
      1
    );
    this.hudComponents.expandedView.add(headerBg);

    // Título do painel com ícone
    const title = this.scene.add
      .text(panelWidth / 2, 20, "AGENTE DPO HERO", {
        fontSize: "18px",
        fontFamily: this.style.fonts.title.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    this.hudComponents.expandedView.add(title);

    // Ícone de status
    const statusIcon = this.scene.add.graphics();
    statusIcon.fillStyle(0x00ff00, 1);
    statusIcon.fillCircle(15, 20, 5);
    this.hudComponents.expandedView.add(statusIcon);

    // Botão para fechar o painel
    const closeBtn = this.scene.add.container(panelWidth - 20, 20);
    const closeBtnBg = this.scene.add.graphics();
    closeBtnBg.fillStyle(this.style.colors.accent, 1);
    closeBtnBg.fillCircle(0, 0, 12);
    const closeBtnText = this.scene.add
      .text(0, 0, "X", {
        fontSize: "16px",
        fontFamily: this.style.fonts.main.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);
    closeBtn.add([closeBtnBg, closeBtnText]);
    closeBtn.setInteractive(new Phaser.Geom.Circle(0, 0, 12), Phaser.Geom.Circle.Contains);
    closeBtn.on("pointerdown", () => this.toggleExpanded(false));

    // Efeitos de hover
    closeBtn.on("pointerover", () => {
      closeBtnBg.clear();
      closeBtnBg.fillStyle(0xff6666, 1);
      closeBtnBg.fillCircle(0, 0, 12);

      this.scene.tweens.add({
        targets: closeBtn,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
      });
    });

    closeBtn.on("pointerout", () => {
      closeBtnBg.clear();
      closeBtnBg.fillStyle(this.style.colors.accent, 1);
      closeBtnBg.fillCircle(0, 0, 12);

      this.scene.tweens.add({
        targets: closeBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    this.hudComponents.expandedView.add(closeBtn);

    // Informações do jogador - Seção de identidade
    const identSection = this.scene.add.container(15, 50);

    // Ícone de identidade
    const identIcon = this.scene.add.graphics();
    identIcon.fillStyle(this.style.colors.secondary, 1);
    identIcon.fillRoundedRect(0, 0, 30, 30, 5);
    identIcon.lineStyle(1, this.style.colors.light);
    identIcon.strokeRoundedRect(0, 0, 30, 30, 5);
    identIcon.fillStyle(this.style.colors.light, 1);
    identIcon.fillCircle(15, 11, 5);
    identIcon.fillRect(10, 17, 10, 10);

    // Texto de identidade
    const playerName = this.getPlayerName();
    const identText = this.scene.add
      .text(40, 15, playerName, {
        fontSize: "16px",
        fontFamily: this.style.fonts.main.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0, 0.5);

    identSection.add([identIcon, identText]);
    this.hudComponents.expandedView.add(identSection);

    // Status e estatísticas
    const statsSection = this.scene.add.container(15, 90);

    // Ícone de estatísticas
    const statsIcon = this.scene.add.graphics();
    statsIcon.fillStyle(this.style.colors.secondary, 1);
    statsIcon.fillRoundedRect(0, 0, 30, 30, 5);
    statsIcon.lineStyle(1, this.style.colors.light);
    statsIcon.strokeRoundedRect(0, 0, 30, 30, 5);
    statsIcon.fillStyle(this.style.colors.light, 1);
    statsIcon.fillRect(7, 10, 4, 15);
    statsIcon.fillRect(13, 5, 4, 20);
    statsIcon.fillRect(19, 15, 4, 10);

    // Texto de estatísticas - pontos e missões
    this.hudComponents.statsText = this.scene.add
      .text(40, 15, "", {
        fontSize: "14px",
        fontFamily: this.style.fonts.main.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0, 0.5);

    statsSection.add([statsIcon, this.hudComponents.statsText]);
    this.hudComponents.expandedView.add(statsSection);

    // Barra de progresso para o próximo nível
    const progressLabel = this.scene.add.text(15, 130, "PROGRESSO DE NÍVEL", {
      fontSize: "12px",
      fontFamily: this.style.fonts.small.fontFamily,
      fill: "#CCCCCC",
    });

    this.hudComponents.expandedView.add(progressLabel);

    // Fundo da barra de progresso
    const progressBarBg = this.scene.add.graphics();
    this.drawRoundedRect(progressBarBg, 15, 150, panelWidth - 30, 15, 5, 0x333333, this.style.colors.primary, 1, 1);
    this.hudComponents.expandedView.add(progressBarBg);

    // Preenchimento da barra de progresso (será atualizado dinamicamente)
    this.hudComponents.progressBar = this.scene.add.graphics();
    this.hudComponents.expandedView.add(this.hudComponents.progressBar);

    // Informações de nível atual e próximo
    this.hudComponents.levelInfo = this.scene.add.text(15, 175, "", {
      fontSize: "12px",
      fontFamily: this.style.fonts.small.fontFamily,
      fill: "#CCCCCC",
    });
    this.hudComponents.expandedView.add(this.hudComponents.levelInfo);

    // Botão para central de missões com estilo melhorado
    const missionButton = this.createStylizedButton(panelWidth / 2, panelHeight - 30, "Central de Missões", () => this.openMissionsHub(), panelWidth - 30, 36);
    this.hudComponents.expandedView.add(missionButton);
  }

  /**
   * Obtém o nome do jogador de forma segura
   * @returns {string} Nome do jogador
   * @private
   */
  getPlayerName() {
    try {
      if (window.saveManager && typeof window.saveManager.getPlayerName === "function") {
        return window.saveManager.getPlayerName();
      }
    } catch (e) {
      console.warn("❌ Erro ao obter nome do jogador:", e);
    }
    return "Agente";
  }

  /**
   * Obtém o nível do jogador de forma segura
   * @returns {number} Nível do jogador
   * @private
   */
  getPlayerLevel() {
    try {
      if (window.saveManager && typeof window.saveManager.getRank === "function") {
        return window.saveManager.getRank() + 1;
      }
    } catch (e) {
      console.warn("❌ Erro ao obter nível do jogador:", e);
    }
    return 1;
  }

  /**
   * Cria um botão estilizado compatível com a HUD
   * @param {number} x - Posição X do botão
   * @param {number} y - Posição Y do botão
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função de callback quando clicado
   * @param {number} width - Largura do botão
   * @param {number} height - Altura do botão
   * @returns {Phaser.GameObjects.Container} - Container do botão
   * @private
   */
  createStylizedButton(x, y, text, callback, width = 200, height = 40) {
    const buttonContainer = this.scene.add.container(x, y);

    // Sombra
    const buttonShadow = this.scene.add.graphics();
    this.drawRoundedRect(buttonShadow, -width / 2 + 2, -height / 2 + 2, width, height, 6, 0x000000, null, 0, 0.5);
    buttonContainer.add(buttonShadow);

    // Fundo do botão
    const buttonBg = this.scene.add.graphics();
    this.drawRoundedRect(buttonBg, -width / 2, -height / 2, width, height, 6, this.style.colors.primary, this.style.colors.secondary, 2, 1);
    buttonContainer.add(buttonBg);

    // Gradiente/brilho (simulado com uma linha mais clara)
    const highlight = this.scene.add.graphics();
    highlight.fillStyle(0xffffff, 0.2);
    highlight.fillRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, height / 3, { tl: 4, tr: 4, bl: 0, br: 0 });
    buttonContainer.add(highlight);

    // Texto do botão
    const buttonText = this.scene.add
      .text(0, 0, text, {
        fontSize: "16px",
        fontFamily: this.style.fonts.main.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    buttonContainer.add(buttonText);

    // Adicionar interatividade
    buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    // Eventos de hover e clique
    buttonContainer.on("pointerover", () => {
      buttonBg.clear();
      this.drawRoundedRect(buttonBg, -width / 2, -height / 2, width, height, 6, this.style.colors.secondary, this.style.colors.primary, 2, 1);

      this.scene.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });
    });

    buttonContainer.on("pointerout", () => {
      buttonBg.clear();
      this.drawRoundedRect(buttonBg, -width / 2, -height / 2, width, height, 6, this.style.colors.primary, this.style.colors.secondary, 2, 1);

      this.scene.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    buttonContainer.on("pointerdown", () => {
      this.scene.tweens.add({
        targets: buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });
    });

    return buttonContainer;
  }

  /**
   * Configura os ouvintes de teclado para atalhos da HUD
   * @private
   */
  setupKeyListeners() {
    // Verificar se o Phaser está disponível
    if (!this.scene || !this.scene.input || !this.scene.input.keyboard) {
      return;
    }

    // Alternar visibilidade com a tecla H
    this.scene.input.keyboard.on("keydown-H", () => {
      this.toggleVisibility();
    });

    // Alternar expansão com a tecla J
    this.scene.input.keyboard.on("keydown-J", () => {
      if (this.isVisible) {
        this.toggleExpanded(!this.isExpanded);
      }
    });
  }

  /**
   * Atualiza as informações exibidas na HUD
   * @public
   */
  updateHUDInfo() {
    if (!this.container) return;

    // Obter dados atualizados do SaveManager
    if (!window.saveManager) {
      console.warn("SaveManager não disponível para a HUD");
      return;
    }

    try {
      const playerData = window.saveManager.data;
      const nextLevel = window.saveManager.getNextLevelInfo();
      const progress = window.saveManager.getProgress();

      // Atualizar o indicador de nível na visão recolhida
      if (this.hudComponents.levelIndicator) {
        const levelText = this.hudComponents.levelIndicator.getAt(1);
        if (levelText) {
          levelText.setText((playerData.rank + 1).toString());
        }
      }

      // Atualizar estatísticas
      if (this.hudComponents.statsText) {
        const completedMissions = playerData.completedMissions ? playerData.completedMissions.length : 0;
        const totalPoints = playerData.points || 0;

        this.hudComponents.statsText.setText(`Pontos: ${totalPoints}\n` + `Missões: ${completedMissions}`);
      }

      // Atualizar barra de progresso
      if (this.hudComponents.progressBar) {
        this.hudComponents.progressBar.clear();
        const barWidth = Math.max(0, Math.min(1, progress)) * 280; // Largura total - margens
        this.drawRoundedRect(this.hudComponents.progressBar, 15, 150, barWidth, 15, 5, this.style.colors.secondary, null, 0, 1);
      }

      // Atualizar informações de nível
      if (this.hudComponents.levelInfo) {
        if (nextLevel) {
          this.hudComponents.levelInfo.setText(`Nível atual: ${playerData.level}\n` + `Próximo: ${nextLevel.name} (faltam ${nextLevel.pointsNeeded} pontos)`);
        } else {
          this.hudComponents.levelInfo.setText(`Nível máximo atingido: ${playerData.level}!\n` + `Pontuação total: ${playerData.points}`);
        }
      }
    } catch (e) {
      console.warn("❌ Erro ao atualizar informações da HUD:", e);
    }
  }

  /**
   * Alterna a visibilidade da HUD
   * @public
   */
  toggleVisibility() {
    this.isVisible = !this.isVisible;

    if (this.isVisible) {
      // Animação de entrada
      this.container.setAlpha(0);
      this.container.setVisible(true);
      this.scene.tweens.add({
        targets: this.container,
        alpha: 1,
        duration: 200,
        ease: "Sine.easeOut",
        onComplete: () => {
          this.updateHUDInfo();
        },
      });
    } else {
      // Animação de saída
      this.scene.tweens.add({
        targets: this.container,
        alpha: 0,
        duration: 200,
        ease: "Sine.easeIn",
        onComplete: () => {
          this.container.setVisible(false);
        },
      });
    }
  }

  /**
   * Alterna entre a visão expandida e recolhida da HUD
   * @param {boolean} expanded - Se verdadeiro, expande a HUD
   * @public
   */
  toggleExpanded(expanded) {
    this.isExpanded = expanded;

    // Verificar se o container foi criado corretamente
    if (!this.hudComponents.expandedView || !this.hudComponents.collapsedView) {
      console.warn("Componentes da HUD não foram inicializados corretamente");
      return;
    }

    if (this.isExpanded) {
      // Animação de transição para expandido
      this.hudComponents.collapsedView.setVisible(false);
      this.hudComponents.expandedView.setScale(0.95);
      this.hudComponents.expandedView.setAlpha(0);
      this.hudComponents.expandedView.setVisible(true);

      this.scene.tweens.add({
        targets: this.hudComponents.expandedView,
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        duration: 200,
        ease: "Back.easeOut",
        onComplete: () => {
          this.updateHUDInfo();
        },
      });
    } else {
      // Animação de transição para recolhido
      this.scene.tweens.add({
        targets: this.hudComponents.expandedView,
        scaleX: 0.9,
        scaleY: 0.9,
        alpha: 0,
        duration: 200,
        ease: "Back.easeIn",
        onComplete: () => {
          this.hudComponents.expandedView.setVisible(false);
          this.hudComponents.collapsedView.setVisible(true);

          // Pequena animação para o ícone
          this.scene.tweens.add({
            targets: this.hudComponents.collapsedView,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
          });
        },
      });
    }
  }

  /**
   * Abre a central de missões
   * @public
   */
  openMissionsHub() {
    // Verificar se a cena missionsHub existe
    try {
      const missionsHubKey = "missionsHub";
      const sceneExists = this.checkSceneExists(missionsHubKey);

      if (!sceneExists) {
        this.showNotification({
          message: "Central de Missões não disponível no momento",
          type: "warning",
          duration: 3000,
        });

        // Fechar o painel mesmo assim
        this.toggleExpanded(false);
        return;
      }

      // Salvar a cena atual para retornar depois
      if (window.game) {
        try {
          const activeScene = this.scene.scene.key;
          localStorage.setItem("previousScene", activeScene);
        } catch (e) {
          console.warn("Não foi possível salvar a cena atual:", e);
        }
      }

      // Fechar o painel da HUD
      this.toggleExpanded(false);

      // Fade out e transição
      this.scene.cameras.main.fadeOut(500);
      this.scene.cameras.main.once("camerafadeoutcomplete", () => {
        try {
          this.scene.scene.start(missionsHubKey);
        } catch (e) {
          console.error("Erro ao abrir a central de missões:", e);
          // Fallback: tenta iniciar a cena do menu principal
          try {
            this.scene.scene.start("mainMenu");
          } catch (err) {
            console.error("Não foi possível voltar ao menu principal:", err);
          }
        }
      });
    } catch (e) {
      console.error("❌ Erro ao abrir a central de missões:", e);

      // Notificar o jogador sobre o erro
      this.showNotification({
        message: "Erro ao abrir a Central de Missões",
        type: "error",
        duration: 3000,
      });

      // Fechar o painel da HUD
      this.toggleExpanded(false);
    }
  }

  /**
   * Verifica se uma cena existe no jogo
   * @param {string} key - Chave da cena
   * @returns {boolean} - Se a cena existe
   * @private
   */
  checkSceneExists(key) {
    try {
      // Método 1: Verificar se a cena está no gerenciador de cenas
      if (this.scene.scene.get(key)) {
        return true;
      }

      // Método 2: Verificar se a classe existe globalmente
      if (window[key]) {
        return true;
      }

      return false;
    } catch (e) {
      console.warn(`❌ Erro ao verificar se a cena ${key} existe:`, e);
      return false;
    }
  }

  /**
   * Adiciona pontos ao jogador com uma animação e notificação
   * @param {number} points - Quantidade de pontos a adicionar
   * @param {string} reason - Razão pela qual os pontos foram adicionados
   * @returns {Object} - Resultado da operação de adicionar pontos
   * @public
   */
  addPoints(points, reason = "") {
    if (!window.saveManager) {
      console.warn("SaveManager não está disponível para adicionar pontos");
      return { newPoints: 0, levelUp: false, level: "Desconhecido" };
    }

    try {
      // Adicionar pontos via SaveManager
      const result = window.saveManager.addPoints(points);

      // Obter posição da HUD para animação
      const hudPos = this.isExpanded
        ? { x: 160, y: 120 } // Centro do painel expandido
        : { x: 25, y: 25 }; // Centro do ícone recolhido

      // Criar um texto flutuante para mostrar os pontos
      const floatingPoints = this.scene.add
        .text(this.container.x + hudPos.x, this.container.y + hudPos.y, `+${points}`, {
          fontSize: "24px",
          fontFamily: this.style.fonts.main.fontFamily,
          fontWeight: "bold",
          fill: "#FFFF00",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(2000);

      // Animar os pontos flutuantes
      this.scene.tweens.add({
        targets: floatingPoints,
        y: floatingPoints.y - 80,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 1500,
        ease: "Power2",
        onComplete: () => {
          floatingPoints.destroy();
        },
      });

      // Adicionar a mensagem à fila de notificações
      let message = `+${points} pontos`;
      if (reason) message += ` - ${reason}`;

      this.showNotification({
        message: message,
        type: "points",
        duration: 2000,
      });

      // Se subiu de nível, mostrar uma notificação especial
      if (result.levelUp) {
        this.showNotification({
          message: `Parabéns! Novo nível: ${result.level}`,
          type: "levelUp",
          duration: 3000,
        });
      }

      // Atualizar a HUD
      this.updateHUDInfo();

      return result;
    } catch (e) {
      console.error("❌ Erro ao adicionar pontos:", e);
      return { newPoints: 0, levelUp: false, level: "Erro" };
    }
  }

  /**
   * Mostra uma notificação na tela
   * @param {Object} config - Configuração da notificação
   * @param {string} config.message - Mensagem a ser exibida
   * @param {string} config.type - Tipo de notificação (default, points, levelUp, warning, error)
   * @param {number} config.duration - Duração da notificação em ms
   * @public
   */
  showNotification(config) {
    // Adicionar à fila de notificações
    this.notificationQueue.push(config);

    // Processar a fila se não estiver ocupado
    if (!this.isProcessingNotification) {
      this.processNextNotification();
    }
  }

  /**
   * Processa a próxima notificação na fila
   * @private
   */
  processNextNotification() {
    if (this.notificationQueue.length === 0) {
      this.isProcessingNotification = false;
      return;
    }

    this.isProcessingNotification = true;
    const config = this.notificationQueue.shift();

    // Determinar estilo com base no tipo
    let backgroundColor, textColor;
    switch (config.type) {
      case "points":
        backgroundColor = this.style.colors.primary;
        textColor = "#FFFFFF";
        break;
      case "levelUp":
        backgroundColor = this.style.colors.warning;
        textColor = "#000000";
        break;
      case "warning":
        backgroundColor = 0xffa500;
        textColor = "#000000";
        break;
      case "error":
        backgroundColor = this.style.colors.accent;
        textColor = "#FFFFFF";
        break;
      default:
        backgroundColor = 0x333333;
        textColor = "#FFFFFF";
    }

    // Criar o container de notificação
    const notification = this.scene.add.container(this.scene.cameras.main.width / 2, 50).setDepth(3000);

    // Fundo da notificação
    const notifBg = this.scene.add.graphics();
    const padding = 15;
    const fontSize = config.type === "levelUp" ? 20 : 16;

    // Texto da notificação
    const notifText = this.scene.add
      .text(0, 0, config.message, {
        fontSize: `${fontSize}px`,
        fontFamily: this.style.fonts.main.fontFamily,
        fill: textColor,
        align: "center",
      })
      .setOrigin(0.5);

    // Calcular tamanho do fundo baseado no texto
    const bgWidth = notifText.width + padding * 2;
    const bgHeight = notifText.height + padding * 2;

    // Desenhar fundo com tamanho apropriado
    this.drawRoundedRect(notifBg, -bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 10, backgroundColor, 0xffffff, 2, 0.9);

    // Adicionar ao container
    notification.add([notifBg, notifText]);

    // Inicialmente invisível
    notification.setAlpha(0);
    notification.y = -50;

    // Animação de entrada
    this.scene.tweens.add({
      targets: notification,
      y: 50,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Esperar a duração da notificação
        this.scene.time.delayedCall(config.duration || 2000, () => {
          // Animação de saída
          this.scene.tweens.add({
            targets: notification,
            y: -50,
            alpha: 0,
            duration: 300,
            ease: "Back.easeIn",
            onComplete: () => {
              notification.destroy();
              // Processar a próxima notificação
              this.processNextNotification();
            },
          });
        });
      },
    });
  }

  /**
   * Atualiza a HUD (chamado no método update da cena)
   * @public
   */
  update(time, delta) {
    // Atualização dinâmica de componentes
    // (Implementar conforme necessário, por exemplo animações que dependem do tempo)
  }

  /**
   * Mostra um tooltip com informações
   * @param {string} text - Texto para exibir
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @private
   */
  showTooltip(text, x, y) {
    // Remover tooltip anterior se existir
    this.hideTooltip();

    // Criar container para o tooltip
    this.tooltipContainer = this.scene.add.container(x, y).setDepth(2000);

    // Fundo do tooltip
    const tooltipBg = this.scene.add.graphics();

    // Adicionar texto
    const tooltipText = this.scene.add
      .text(0, 0, text, {
        fontSize: "14px",
        fontFamily: this.style.fonts.main.fontFamily,
        fill: "#FFFFFF",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0, 0.5);

    // Calcular dimensões do fundo com base no texto
    const bgWidth = tooltipText.width + 16;
    const bgHeight = tooltipText.height + 8;

    // Desenhar fundo
    this.drawRoundedRect(tooltipBg, -8, -bgHeight / 2, bgWidth, bgHeight, 4, this.style.colors.dark, this.style.colors.secondary, 1, 0.9);

    // Adicionar elementos ao container
    this.tooltipContainer.add([tooltipBg, tooltipText]);

    // Animar entrada do tooltip
    this.tooltipContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.tooltipContainer,
      alpha: 1,
      duration: 200,
    });
  }

  /**
   * Esconde o tooltip atual
   * @private
   */
  hideTooltip() {
    if (this.tooltipContainer) {
      this.scene.tweens.add({
        targets: this.tooltipContainer,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          if (this.tooltipContainer) {
            this.tooltipContainer.destroy();
            this.tooltipContainer = null;
          }
        },
      });
    }
  }

  /**
   * Versão interna segura da função drawRoundedRect
   * Fallback para fillRect normal se a função falhar
   */
  drawRoundedRect(graphics, x, y, width, height, radius, fillColor, strokeColor = null, strokeWidth = 0, alpha = 1) {
    try {
      // Verificar se a função global existe
      if (typeof window.drawRoundedRect === "function") {
        window.drawRoundedRect(graphics, x, y, width, height, radius, fillColor, strokeColor, strokeWidth, alpha);
      } else {
        // Fallback simples se a função não existir
        graphics.fillStyle(fillColor, alpha);
        graphics.fillRect(x, y, width, height);

        if (strokeColor !== null) {
          graphics.lineStyle(strokeWidth, strokeColor, alpha);
          graphics.strokeRect(x, y, width, height);
        }
      }
    } catch (e) {
      // Fallback em caso de erro
      console.warn("❌ Erro ao desenhar retângulo arredondado, usando fallback:", e);

      graphics.fillStyle(fillColor, alpha);
      graphics.fillRect(x, y, width, height);

      if (strokeColor !== null) {
        graphics.lineStyle(strokeWidth, strokeColor, alpha);
        graphics.strokeRect(x, y, width, height);
      }
    }
  }
}

// Tornar a classe disponível globalmente
window.AgentHUD = AgentHUD;
