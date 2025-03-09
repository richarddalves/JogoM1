/**
 * Funções relacionadas aos elementos da HUD do Agente
 */
(function () {
  /**
   * Cria a versão recolhida da HUD (apenas ícone)
   * @private
   */
  AgentHUD.prototype.createCollapsedView = function () {
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
  };

  /**
   * Cria a versão expandida da HUD (painel completo)
   * @private
   */
  AgentHUD.prototype.createExpandedView = function () {
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
  };

  /**
   * Obtém o nome do jogador de forma segura
   * @returns {string} Nome do jogador
   * @private
   */
  AgentHUD.prototype.getPlayerName = function () {
    try {
      if (window.saveManager && typeof window.saveManager.getPlayerName === "function") {
        return window.saveManager.getPlayerName();
      }
    } catch (e) {
      console.warn("❌ Erro ao obter nome do jogador:", e);
    }
    return "Agente";
  };

  /**
   * Obtém o nível do jogador de forma segura
   * @returns {number} Nível do jogador
   * @private
   */
  AgentHUD.prototype.getPlayerLevel = function () {
    try {
      if (window.saveManager && typeof window.saveManager.getRank === "function") {
        return window.saveManager.getRank() + 1;
      }
    } catch (e) {
      console.warn("❌ Erro ao obter nível do jogador:", e);
    }
    return 1;
  };

  /**
   * Atualiza as informações exibidas na HUD
   * @public
   */
  AgentHUD.prototype.updateHUDInfo = function () {
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
  };

  /**
   * Alterna entre a visão expandida e recolhida da HUD
   * @param {boolean} expanded - Se verdadeiro, expande a HUD
   * @public
   */
  AgentHUD.prototype.toggleExpanded = function (expanded) {
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
  };

  /**
   * Mostra um tooltip com informações
   * @param {string} text - Texto para exibir
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @private
   */
  AgentHUD.prototype.showTooltip = function (text, x, y) {
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
  };

  /**
   * Esconde o tooltip atual
   * @private
   */
  AgentHUD.prototype.hideTooltip = function () {
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
  };

  console.log("✅ Elementos da HUD carregados");
})();
