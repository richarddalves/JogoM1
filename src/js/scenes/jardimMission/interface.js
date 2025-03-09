/**
 * Módulo de interface aprimorado para a missão do jardim
 */
(function () {
  /**
   * Cria a interface do usuário com design e posicionamento aprimorados
   */
  jardimMission.prototype.createUI = function () {
    // Obter dimensões da tela
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Container principal para a UI com melhor profundidade
    this.uiContainer = this.add.container(0, 0);
    this.uiContainer.setDepth(100); // Acima de todos os elementos do jogo
    this.uiContainer.setScrollFactor(0); // Fixar na tela, não rolagem com a câmera

    // Criar HUD do agente
    this.createEnhancedAgentHUD();

    // Criar indicador de objetivo atual
    this.createEnhancedObjectiveIndicator();

    // Criar sistema de notificações
    this.createEnhancedNotificationSystem();

    // Criar sistema de diálogo
    this.createEnhancedDialogSystem();

    // Criar minimapa
    this.createEnhancedMinimap();

    // Criar menu de opções/ajuda
    this.createEnhancedGameMenu();

    // Posicionar elementos da UI
    this.updateUIPositions(width, height);

    // Adicionar eventos de redimensionamento
    this.scale.on("resize", this.handleResize, this);

    // Animação de entrada da UI principal
    this.animateUIEntrance();

    console.log("✅ Interface de usuário aprimorada criada com sucesso!");
  };

  /**
   * Anima a entrada dos elementos de UI
   */
  jardimMission.prototype.animateUIEntrance = function () {
    // Array com todos os elementos principais de UI para animar
    const uiElements = [
      { element: this.objectiveBg, delay: 0 },
      { element: this.objectiveIcon, delay: 100 },
      { element: this.objectiveText, delay: 200 },
      { element: this.menuBg, delay: 300 },
      { element: this.menuIcon, delay: 350 },
      { element: this.helpBg, delay: 400 },
      { element: this.helpIcon, delay: 450 },
      { element: this.minimapBorder, delay: 500 },
    ].filter((item) => item.element);

    // Configura estado inicial
    uiElements.forEach((item) => {
      if (item.element) {
        item.element.setAlpha(0);
        item.element.setScale(0.8);
      }
    });

    // Anima cada elemento
    uiElements.forEach((item) => {
      if (item.element) {
        this.tweens.add({
          targets: item.element,
          alpha: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 400,
          delay: item.delay,
          ease: "Back.easeOut",
        });
      }
    });
  };

  /**
   * Cria a HUD do agente com design aprimorado
   */
  jardimMission.prototype.createEnhancedAgentHUD = function () {
    try {
      // Verificar se a classe AgentHUD existe
      if (typeof AgentHUD === "undefined") {
        console.warn("AgentHUD não está definido. Importando a classe substituta...");

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
            update() {}
          };
        }
      }

      // Criar a HUD
      this.agentHUD = new AgentHUD(this);

      // Adicionar botão para mostrar/esconder a HUD com design melhorado
      this.createAgentHUDButton();

      console.log("✅ HUD do agente aprimorada criada com sucesso!");
    } catch (e) {
      console.error("❌ Erro ao criar AgentHUD:", e);
      this.createFallbackAgentHUDButton();
    }
  };

  /**
   * Cria um botão aprimorado para a HUD do agente
   */
  jardimMission.prototype.createAgentHUDButton = function () {
    // Container para o botão
    const buttonContainer = this.add.container(80, 30);
    buttonContainer.setDepth(101);
    buttonContainer.setScrollFactor(0);

    // Fundo do botão com estilo cyberpunk
    const hudBg = this.add.graphics();

    // Forma principal
    hudBg.fillStyle(this.colors.primary, 0.8);
    hudBg.fillRoundedRect(-35, -35, 70, 70, 15);

    // Borda
    hudBg.lineStyle(3, this.colors.secondary, 0.9);
    hudBg.strokeRoundedRect(-35, -35, 70, 70, 15);

    // Detalhes angulares (estilo cyberpunk)
    hudBg.lineStyle(2, this.colors.secondary, 0.7);
    hudBg.beginPath();
    hudBg.moveTo(-35, -15);
    hudBg.lineTo(-25, -15);
    hudBg.moveTo(-35, 15);
    hudBg.lineTo(-25, 15);
    hudBg.moveTo(35, -15);
    hudBg.lineTo(25, -15);
    hudBg.moveTo(35, 15);
    hudBg.lineTo(25, 15);
    hudBg.strokePath();

    // Linha do meio
    hudBg.lineStyle(1, this.colors.secondary, 0.5);
    hudBg.beginPath();
    hudBg.moveTo(-35, 0);
    hudBg.lineTo(35, 0);
    hudBg.strokePath();

    // Ícone do agente (avatar)
    const hudIcon = this.add
      .text(0, 0, "👤", {
        fontSize: "32px",
      })
      .setOrigin(0.5);

    // Texto "AGENTE" abaixo do ícone
    const hudLabel = this.add
      .text(0, 20, "AGENTE", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "10px",
        color: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Adicionar elementos ao container
    buttonContainer.add([hudBg, hudIcon, hudLabel]);

    // Tornar interativo
    buttonContainer.setSize(70, 70);
    buttonContainer.setInteractive({ useHandCursor: true });

    // Eventos de hover e clique
    buttonContainer.on("pointerover", () => {
      // Efeito de hover
      hudBg.clear();

      // Forma principal hover
      hudBg.fillStyle(this.colors.secondary, 0.8);
      hudBg.fillRoundedRect(-35, -35, 70, 70, 15);

      // Borda hover
      hudBg.lineStyle(3, this.colors.primary, 0.9);
      hudBg.strokeRoundedRect(-35, -35, 70, 70, 15);

      // Detalhes angulares hover
      hudBg.lineStyle(2, this.colors.primary, 0.7);
      hudBg.beginPath();
      hudBg.moveTo(-35, -15);
      hudBg.lineTo(-25, -15);
      hudBg.moveTo(-35, 15);
      hudBg.lineTo(-25, 15);
      hudBg.moveTo(35, -15);
      hudBg.lineTo(25, -15);
      hudBg.moveTo(35, 15);
      hudBg.lineTo(25, 15);
      hudBg.strokePath();

      // Linha do meio hover
      hudBg.lineStyle(1, this.colors.primary, 0.5);
      hudBg.beginPath();
      hudBg.moveTo(-35, 0);
      hudBg.lineTo(35, 0);
      hudBg.strokePath();

      // Efeito de escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });

      // Mostrar tooltip
      this.showTooltip("Abrir/fechar a HUD do agente", buttonContainer.x + 100, buttonContainer.y);
    });

    buttonContainer.on("pointerout", () => {
      // Restaurar aparência normal
      hudBg.clear();

      // Forma principal
      hudBg.fillStyle(this.colors.primary, 0.8);
      hudBg.fillRoundedRect(-35, -35, 70, 70, 15);

      // Borda
      hudBg.lineStyle(3, this.colors.secondary, 0.9);
      hudBg.strokeRoundedRect(-35, -35, 70, 70, 15);

      // Detalhes angulares
      hudBg.lineStyle(2, this.colors.secondary, 0.7);
      hudBg.beginPath();
      hudBg.moveTo(-35, -15);
      hudBg.lineTo(-25, -15);
      hudBg.moveTo(-35, 15);
      hudBg.lineTo(-25, 15);
      hudBg.moveTo(35, -15);
      hudBg.lineTo(25, -15);
      hudBg.moveTo(35, 15);
      hudBg.lineTo(25, 15);
      hudBg.strokePath();

      // Linha do meio
      hudBg.lineStyle(1, this.colors.secondary, 0.5);
      hudBg.beginPath();
      hudBg.moveTo(-35, 0);
      hudBg.lineTo(35, 0);
      hudBg.strokePath();

      // Restaurar escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });

      // Esconder tooltip
      this.hideTooltip();
    });

    buttonContainer.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          if (this.agentHUD) {
            this.agentHUD.toggleVisibility();
          }
        },
      });
    });

    // Adicionar à UI
    this.uiContainer.add(buttonContainer);
    this.hudButton = buttonContainer;
  };

  /**
   * Cria um botão substituto em caso de falha
   */
  jardimMission.prototype.createFallbackAgentHUDButton = function () {
    // Versão simplificada do botão em caso de falha
    const hudBg = this.add.graphics();
    hudBg.fillStyle(this.colors.primary, 0.8);
    hudBg.fillRoundedRect(25, 10, 60, 40, 10);
    hudBg.lineStyle(2, this.colors.secondary, 0.9);
    hudBg.strokeRoundedRect(25, 10, 60, 40, 10);
    hudBg.setScrollFactor(0);
    hudBg.setDepth(101);

    const hudButton = this.add
      .text(55, 30, "AGENTE", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "16px",
        color: "#FFFFFF",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.showNotification("HUD do agente não disponível nesta versão", "info"))
      .setScrollFactor(0)
      .setDepth(102);

    // Adicionar à UI
    this.uiContainer.add([hudBg, hudButton]);
    this.hudButton = { bg: hudBg, text: hudButton };
  };

  /**
   * Cria o indicador de objetivo aprimorado
   */
  jardimMission.prototype.createEnhancedObjectiveIndicator = function () {
    const width = this.cameras.main.width;

    // Container para o indicador de objetivo
    const container = this.add.container(width / 2, 30);
    container.setScrollFactor(0);

    // Fundo do indicador com estilo moderno
    this.objectiveBg = this.add.graphics();
    this.objectiveBg.fillStyle(0x000000, 0.7);
    this.objectiveBg.fillRoundedRect(-200, -25, 400, 50, 15);

    // Borda com estilo cyberpunk
    this.objectiveBg.lineStyle(3, this.colors.secondary, 0.8);
    this.objectiveBg.strokeRoundedRect(-200, -25, 400, 50, 15);

    // Detalhes angulares (estilo cyberpunk)
    this.objectiveBg.lineStyle(2, this.colors.primary, 0.7);
    this.objectiveBg.beginPath();
    this.objectiveBg.moveTo(-200, -15);
    this.objectiveBg.lineTo(-190, -15);
    this.objectiveBg.moveTo(-200, 15);
    this.objectiveBg.lineTo(-190, 15);
    this.objectiveBg.moveTo(200, -15);
    this.objectiveBg.lineTo(190, -15);
    this.objectiveBg.moveTo(200, 15);
    this.objectiveBg.lineTo(190, 15);
    this.objectiveBg.strokePath();

    // Título "OBJETIVO" acima do texto principal
    const objectiveTitle = this.add.text(-180, -15, "OBJETIVO", {
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: "12px",
      color: this.colors.secondary,
      fontWeight: "bold",
    });

    // Ícone do objetivo
    this.objectiveIcon = this.add.image(-165, 5, "task-icon").setScale(0.3);

    // Texto do objetivo
    this.objectiveText = this.add
      .text(-140, 5, "Encontre o professor no jardim da escola", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "16px",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 1,
        wordWrap: { width: 320 },
      })
      .setOrigin(0, 0.5);

    // Adicionar elementos ao container
    container.add([this.objectiveBg, objectiveTitle, this.objectiveIcon, this.objectiveText]);

    // Adicionar à UI
    this.uiContainer.add(container);
    this.objectiveContainer = container;

    // Efeito de pulso suave
    this.tweens.add({
      targets: this.objectiveIcon,
      scaleX: 0.35,
      scaleY: 0.35,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  };

  /**
   * Cria um sistema de notificações aprimorado
   */
  jardimMission.prototype.createEnhancedNotificationSystem = function () {
    // Container para notificações
    this.notificationContainer = this.add.container(0, 0);
    this.notificationContainer.setScrollFactor(0);
    this.notificationContainer.setDepth(200);

    // Fila de notificações
    this.notifications = [];
    this.notificationActive = false;

    // Adicionar à UI
    this.uiContainer.add(this.notificationContainer);
  };

  /**
   * Cria um sistema de diálogo aprimorado
   */
  jardimMission.prototype.createEnhancedDialogSystem = function () {
    // Garantir que o objeto dialog existe
    if (!this.dialog) {
      this.dialog = {
        active: false,
        lines: [],
        currentLine: 0,
        speaker: null,
        callback: null,
        typing: false,
        typewriterEffect: null,
      };
    }

    // Container para diálogos
    this.dialogContainer = this.add.container(0, 0);
    this.dialogContainer.setScrollFactor(0);
    this.dialogContainer.setDepth(150);
    this.dialogContainer.setVisible(false);

    // Fundo do diálogo
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Container de fundo para diálogos (escurece toda a tela)
    const dialogBackdrop = this.add.graphics();
    dialogBackdrop.fillStyle(0x000000, 0.5);
    dialogBackdrop.fillRect(0, 0, width, height);

    // Fundo do diálogo principal com estilo cyberpunk
    this.dialogBg = this.add.graphics();

    // Desenhar o painel do diálogo principal
    this.dialogBg.fillStyle(0x0a1a2f, 0.9); // Azul escuro
    this.dialogBg.fillRoundedRect(20, height - 220, width - 40, 200, 15);

    // Borda com efeito de brilho
    this.dialogBg.lineStyle(3, this.colors.primary, 0.9);
    this.dialogBg.strokeRoundedRect(20, height - 220, width - 40, 200, 15);

    // Detalhes angulares (estilo cyberpunk)
    this.dialogBg.lineStyle(2, this.colors.secondary, 0.7);

    // Canto superior esquerdo
    this.dialogBg.beginPath();
    this.dialogBg.moveTo(20, height - 190);
    this.dialogBg.lineTo(40, height - 190);
    this.dialogBg.moveTo(20, height - 160);
    this.dialogBg.lineTo(40, height - 160);
    this.dialogBg.strokePath();

    // Canto superior direito
    this.dialogBg.beginPath();
    this.dialogBg.moveTo(width - 20, height - 190);
    this.dialogBg.lineTo(width - 40, height - 190);
    this.dialogBg.moveTo(width - 20, height - 160);
    this.dialogBg.lineTo(width - 40, height - 160);
    this.dialogBg.strokePath();

    // Linha horizontal no topo (separador do nome)
    this.dialogBg.lineStyle(2, this.colors.secondary, 0.7);
    this.dialogBg.beginPath();
    this.dialogBg.moveTo(140, height - 190);
    this.dialogBg.lineTo(width - 100, height - 190);
    this.dialogBg.strokePath();

    // Área para o avatar do personagem com borda estilizada
    this.dialogBg.fillStyle(this.colors.primary, 0.2);
    this.dialogBg.fillRoundedRect(30, height - 180, 100, 100, 10);
    this.dialogBg.lineStyle(2, this.colors.secondary, 0.7);
    this.dialogBg.strokeRoundedRect(30, height - 180, 100, 100, 10);

    // Detalhes no avatar
    this.dialogBg.lineStyle(1, this.colors.secondary, 0.5);
    this.dialogBg.beginPath();
    this.dialogBg.moveTo(30, height - 150);
    this.dialogBg.lineTo(50, height - 150);
    this.dialogBg.moveTo(30, height - 120);
    this.dialogBg.lineTo(50, height - 120);
    this.dialogBg.strokePath();

    // Avatar do personagem com escala adequada
    this.dialogAvatar = this.add.sprite(80, height - 130, "professor", 0);
    this.dialogAvatar.setScale(0.8);

    // Nome do personagem com estilo aprimorado
    this.dialogName = this.add.text(140, height - 205, "Professor", {
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: "20px",
      color: this.colors.secondary,
      fontWeight: "bold",
      stroke: "#000000",
      strokeThickness: 2,
    });

    // Texto do diálogo com formatação melhorada
    this.dialogText = this.add.text(140, height - 150, "", {
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: "18px",
      color: "#FFFFFF",
      wordWrap: { width: width - 180 },
      lineSpacing: 6,
    });

    // Indicador para continuar com estilo moderno
    this.dialogContinue = this.add.text(width - 60, height - 40, "Continuar ➤", {
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: "18px",
      color: "#FFFFFF",
      fontWeight: "bold",
      stroke: "#000000",
      strokeThickness: 2,
    });

    // Animar o indicador para continuar
    this.tweens.add({
      targets: this.dialogContinue,
      x: "+=10",
      alpha: 0.7,
      yoyo: true,
      repeat: -1,
      duration: 800,
      ease: "Sine.easeInOut",
    });

    // Adicionar elementos ao container de diálogo
    this.dialogContainer.add([dialogBackdrop, this.dialogBg, this.dialogAvatar, this.dialogName, this.dialogText, this.dialogContinue]);

    // Adicionar à UI
    this.uiContainer.add(this.dialogContainer);
  };

  /**
   * Cria um minimapa aprimorado
   */
  jardimMission.prototype.createEnhancedMinimap = function () {
    try {
      // Verificar se o mapa existe
      if (!this.map) {
        console.warn("Mapa não encontrado para criar minimapa.");
        return;
      }

      // Posicionamento no canto superior direito
      const minimapWidth = 180;
      const minimapHeight = 180;
      const minimapX = this.cameras.main.width - minimapWidth - 20;
      const minimapY = 20;

      // Container para minimapa
      const minimapContainer = this.add.container(minimapX + minimapWidth / 2, minimapY + minimapHeight / 2);
      minimapContainer.setScrollFactor(0);
      minimapContainer.setDepth(90);

      // Fundo com estilo cyberpunk
      const minimapBg = this.add.graphics();
      minimapBg.fillStyle(0x000000, 0.5);
      minimapBg.fillRoundedRect(-minimapWidth / 2, -minimapHeight / 2, minimapWidth, minimapHeight, 10);

      // Borda estilizada
      minimapBg.lineStyle(3, this.colors.primary, 0.8);
      minimapBg.strokeRoundedRect(-minimapWidth / 2, -minimapHeight / 2, minimapWidth, minimapHeight, 10);

      // Detalhes angulares
      minimapBg.lineStyle(2, this.colors.secondary, 0.7);
      minimapBg.beginPath();
      minimapBg.moveTo(-minimapWidth / 2, -minimapHeight / 2 + 30);
      minimapBg.lineTo(-minimapWidth / 2 + 20, -minimapHeight / 2 + 30);
      minimapBg.moveTo(-minimapWidth / 2, -minimapHeight / 2 + 60);
      minimapBg.lineTo(-minimapWidth / 2 + 20, -minimapHeight / 2 + 60);
      minimapBg.strokePath();

      // Título "MINIMAPA"
      const minimapTitle = this.add
        .text(0, -minimapHeight / 2 + 15, "MINIMAPA", {
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: "14px",
          color: this.colors.secondary,
          fontWeight: "bold",
          stroke: "#000000",
          strokeThickness: 1,
        })
        .setOrigin(0.5);

      // Adicionar ao container
      minimapContainer.add([minimapBg, minimapTitle]);

      // Criar câmera do minimapa
      this.minimapCamera = this.cameras
        .add(minimapX + 10, minimapY + 30, minimapWidth - 20, minimapHeight - 40)
        .setZoom(0.2)
        .setName("minimap");

      this.minimapCamera.setBackgroundColor(0x0c1824);
      this.minimapCamera.setAlpha(0.8);

      // Configurar visualização do minimapa
      if (this.player && this.player.sprite) {
        this.minimapCamera.startFollow(this.player.sprite, true);
      }

      // Limites do minimapa
      if (this.map) {
        const mapWidth = this.map.widthInPixels;
        const mapHeight = this.map.heightInPixels;
        this.minimapCamera.setBounds(0, 0, mapWidth, mapHeight);
      }

      // Indicador do jogador no minimapa
      const playerIndicator = this.createMinimapIndicator("player");
      this.minimapPlayerIndicator = playerIndicator;

      // Indicador do professor no minimapa
      const professorIndicator = this.createMinimapIndicator("professor");
      this.minimapProfessorIndicator = professorIndicator;

      // Guardar referência
      this.minimapBorder = minimapContainer;
      this.minimapContainer = minimapContainer;

      // Adicionar barra de zoom
      this.createMinimapZoomControl(minimapX, minimapY + minimapHeight + 10, minimapWidth);

      // Adicionar à UI
      this.uiContainer.add(minimapContainer);
    } catch (e) {
      console.warn("Erro ao criar minimapa:", e);
    }
  };

  /**
   * Cria indicador para entidades no minimapa
   */
  jardimMission.prototype.createMinimapIndicator = function (type) {
    // Cor do indicador baseada no tipo
    let color;

    if (type === "player") {
      color = 0x39f5e2; // Ciano
    } else if (type === "professor") {
      color = 0xff3a3a; // Vermelho
    } else {
      color = 0xffffff; // Branco
    }

    // Criar objeto gráfico
    const indicator = this.add.graphics();

    // Desenhar triângulo para o jogador, círculo para outros
    if (type === "player") {
      // Triângulo apontando na direção do movimento
      indicator.fillStyle(color, 1);
      indicator.fillTriangle(0, -8, -5, 5, 5, 5);

      // Borda
      indicator.lineStyle(1, 0xffffff, 0.8);
      indicator.strokeTriangle(0, -8, -5, 5, 5, 5);

      // Efeito de pulso
      this.tweens.add({
        targets: indicator,
        alpha: 0.7,
        yoyo: true,
        repeat: -1,
        duration: 600,
      });
    } else {
      // Círculo para outros personagens
      indicator.fillStyle(color, 1);
      indicator.fillCircle(0, 0, 5);

      // Borda
      indicator.lineStyle(1, 0xffffff, 0.8);
      indicator.strokeCircle(0, 0, 5);

      // Círculo externo pulsante
      const outerCircle = this.add.graphics();
      outerCircle.fillStyle(color, 0.3);
      outerCircle.fillCircle(0, 0, 8);

      // Agrupar com o indicador principal
      const container = this.add.container(0, 0, [indicator, outerCircle]);

      // Efeito de pulso no círculo externo
      this.tweens.add({
        targets: outerCircle,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        yoyo: false,
        repeat: -1,
        duration: 1000,
      });

      return container;
    }

    return indicator;
  };

  /**
   * Cria controle de zoom para o minimapa
   */
  jardimMission.prototype.createMinimapZoomControl = function (x, y, width) {
    // Container para o controle de zoom
    const zoomContainer = this.add.container(x + width / 2, y);
    zoomContainer.setScrollFactor(0);

    // Fundo do controle
    const zoomBg = this.add.graphics();
    zoomBg.fillStyle(0x000000, 0.5);
    zoomBg.fillRoundedRect(-width / 2, 0, width, 30, 10);

    zoomBg.lineStyle(2, this.colors.primary, 0.7);
    zoomBg.strokeRoundedRect(-width / 2, 0, width, 30, 10);

    // Botão de zoom in
    const zoomInButton = this.add
      .text(-width / 2 + 20, 15, "+", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Botão de zoom out
    const zoomOutButton = this.add
      .text(-width / 2 + 60, 15, "−", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Marcador de zoom atual (slider)
    const zoomSlider = this.add.graphics();
    zoomSlider.fillStyle(this.colors.secondary, 0.8);
    zoomSlider.fillRect(-width / 2 + 90, 10, width - 110, 10);

    // Indicador do nível de zoom
    const zoomIndicator = this.add.graphics();
    zoomIndicator.fillStyle(0xffffff, 1);
    zoomIndicator.fillCircle(-width / 2 + 130, 15, 8);

    zoomIndicator.lineStyle(2, this.colors.primary, 1);
    zoomIndicator.strokeCircle(-width / 2 + 130, 15, 8);

    // Texto indicador
    const zoomText = this.add
      .text(width / 2 - 40, 15, "Zoom", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "14px",
        color: "#FFFFFF",
      })
      .setOrigin(0.5);

    // Adicionar elementos ao container
    zoomContainer.add([zoomBg, zoomInButton, zoomOutButton, zoomSlider, zoomIndicator, zoomText]);

    // Adicionar interatividade
    zoomInButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      if (this.minimapCamera) {
        const newZoom = Math.min(0.4, this.minimapCamera.zoom + 0.05);
        this.minimapCamera.setZoom(newZoom);

        // Atualizar posição do indicador
        updateZoomIndicator(newZoom);
      }
    });

    zoomOutButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      if (this.minimapCamera) {
        const newZoom = Math.max(0.1, this.minimapCamera.zoom - 0.05);
        this.minimapCamera.setZoom(newZoom);

        // Atualizar posição do indicador
        updateZoomIndicator(newZoom);
      }
    });

    // Função para atualizar a posição do indicador baseado no zoom
    const updateZoomIndicator = (zoom) => {
      // Mapear zoom de 0.1-0.4 para posição no slider
      const minZoom = 0.1;
      const maxZoom = 0.4;
      const minPos = -width / 2 + 90;
      const maxPos = width / 2 - 40;

      const position = minPos + ((zoom - minZoom) / (maxZoom - minZoom)) * (maxPos - minPos);

      // Animar movimento do indicador
      this.tweens.add({
        targets: zoomIndicator,
        x: position - (-width / 2 + 130),
        duration: 200,
        ease: "Sine.easeOut",
      });
    };

    // Adicionar à UI
    this.uiContainer.add(zoomContainer);
    this.minimapZoomControl = zoomContainer;
  };

  /**
   * Cria menu de jogo aprimorado (botões de pausa, ajuda, etc)
   */
  jardimMission.prototype.createEnhancedGameMenu = function () {
    const width = this.cameras.main.width;

    // Container para botões
    const buttonsContainer = this.add.container(0, 0);
    buttonsContainer.setScrollFactor(0);
    buttonsContainer.setDepth(100);

    // Criar botão de menu/pausa aprimorado
    this.createMenuButton(width - 70, 70, buttonsContainer);

    // Criar botão de ajuda aprimorado
    this.createHelpButton(width - 70, 150, buttonsContainer);

    // Adicionar à UI
    this.uiContainer.add(buttonsContainer);
  };

  /**
   * Cria o botão de menu/pausa
   */
  jardimMission.prototype.createMenuButton = function (x, y, container) {
    // Container para o botão
    const buttonContainer = this.add.container(x, y);

    // Fundo circular com estilo cyberpunk
    this.menuBg = this.add.graphics();
    this.menuBg.fillStyle(this.colors.primary, 0.8);
    this.menuBg.fillCircle(0, 0, 40);

    this.menuBg.lineStyle(3, this.colors.secondary, 0.9);
    this.menuBg.strokeCircle(0, 0, 40);

    // Linhas decorativas
    this.menuBg.lineStyle(2, this.colors.secondary, 0.6);
    this.menuBg.beginPath();
    this.menuBg.moveTo(-40, 0);
    this.menuBg.lineTo(-30, 0);
    this.menuBg.moveTo(40, 0);
    this.menuBg.lineTo(30, 0);
    this.menuBg.moveTo(0, -40);
    this.menuBg.lineTo(0, -30);
    this.menuBg.moveTo(0, 40);
    this.menuBg.lineTo(0, 30);
    this.menuBg.strokePath();

    // Ícone do menu com textura visual
    this.menuIcon = this.add
      .text(0, 0, "≡", {
        fontSize: "40px",
        fontWeight: "bold",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Texto abaixo do ícone
    const menuLabel = this.add
      .text(0, 25, "MENU", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "12px",
        color: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Adicionar elementos ao container
    buttonContainer.add([this.menuBg, this.menuIcon, menuLabel]);

    // Interatividade
    buttonContainer.setSize(80, 80);
    buttonContainer.setInteractive({ useHandCursor: true });

    // Eventos
    buttonContainer.on("pointerover", () => {
      // Estado hover
      this.menuBg.clear();
      this.menuBg.fillStyle(this.colors.secondary, 0.8);
      this.menuBg.fillCircle(0, 0, 40);

      this.menuBg.lineStyle(3, this.colors.primary, 0.9);
      this.menuBg.strokeCircle(0, 0, 40);

      this.menuBg.lineStyle(2, this.colors.primary, 0.6);
      this.menuBg.beginPath();
      this.menuBg.moveTo(-40, 0);
      this.menuBg.lineTo(-30, 0);
      this.menuBg.moveTo(40, 0);
      this.menuBg.lineTo(30, 0);
      this.menuBg.moveTo(0, -40);
      this.menuBg.lineTo(0, -30);
      this.menuBg.moveTo(0, 40);
      this.menuBg.lineTo(0, 30);
      this.menuBg.strokePath();

      this.menuIcon.setColor("#000000");
      menuLabel.setColor("#000000");

      // Efeito de escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: "Sine.easeOut",
      });

      // Mostrar tooltip
      this.showTooltip("Abrir Menu Principal", x - 100, y);
    });

    buttonContainer.on("pointerout", () => {
      // Estado normal
      this.menuBg.clear();
      this.menuBg.fillStyle(this.colors.primary, 0.8);
      this.menuBg.fillCircle(0, 0, 40);

      this.menuBg.lineStyle(3, this.colors.secondary, 0.9);
      this.menuBg.strokeCircle(0, 0, 40);

      this.menuBg.lineStyle(2, this.colors.secondary, 0.6);
      this.menuBg.beginPath();
      this.menuBg.moveTo(-40, 0);
      this.menuBg.lineTo(-30, 0);
      this.menuBg.moveTo(40, 0);
      this.menuBg.lineTo(30, 0);
      this.menuBg.moveTo(0, -40);
      this.menuBg.lineTo(0, -30);
      this.menuBg.moveTo(0, 40);
      this.menuBg.lineTo(0, 30);
      this.menuBg.strokePath();

      this.menuIcon.setColor("#FFFFFF");
      menuLabel.setColor("#FFFFFF");

      // Restaurar escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Sine.easeOut",
      });

      // Esconder tooltip
      this.hideTooltip();
    });

    buttonContainer.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.togglePauseMenu();
        },
      });
    });

    // Adicionar ao container pai
    container.add(buttonContainer);
  };

  /**
   * Cria o botão de ajuda
   */
  jardimMission.prototype.createHelpButton = function (x, y, container) {
    // Container para o botão
    const buttonContainer = this.add.container(x, y);

    // Fundo circular com estilo cyberpunk
    this.helpBg = this.add.graphics();
    this.helpBg.fillStyle(this.colors.primary, 0.8);
    this.helpBg.fillCircle(0, 0, 40);

    this.helpBg.lineStyle(3, this.colors.secondary, 0.9);
    this.helpBg.strokeCircle(0, 0, 40);

    // Linhas decorativas
    this.helpBg.lineStyle(2, this.colors.secondary, 0.6);
    this.helpBg.beginPath();
    this.helpBg.moveTo(-40, 0);
    this.helpBg.lineTo(-30, 0);
    this.helpBg.moveTo(40, 0);
    this.helpBg.lineTo(30, 0);
    this.helpBg.moveTo(0, -40);
    this.helpBg.lineTo(0, -30);
    this.helpBg.moveTo(0, 40);
    this.helpBg.lineTo(0, 30);
    this.helpBg.strokePath();

    // Ícone de ajuda
    this.helpIcon = this.add
      .text(0, 0, "?", {
        fontSize: "40px",
        fontWeight: "bold",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Texto abaixo do ícone
    const helpLabel = this.add
      .text(0, 25, "AJUDA", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "12px",
        color: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Adicionar elementos ao container
    buttonContainer.add([this.helpBg, this.helpIcon, helpLabel]);

    // Interatividade
    buttonContainer.setSize(80, 80);
    buttonContainer.setInteractive({ useHandCursor: true });

    // Eventos
    buttonContainer.on("pointerover", () => {
      // Estado hover
      this.helpBg.clear();
      this.helpBg.fillStyle(this.colors.secondary, 0.8);
      this.helpBg.fillCircle(0, 0, 40);

      this.helpBg.lineStyle(3, this.colors.primary, 0.9);
      this.helpBg.strokeCircle(0, 0, 40);

      this.helpBg.lineStyle(2, this.colors.primary, 0.6);
      this.helpBg.beginPath();
      this.helpBg.moveTo(-40, 0);
      this.helpBg.lineTo(-30, 0);
      this.helpBg.moveTo(40, 0);
      this.helpBg.lineTo(30, 0);
      this.helpBg.moveTo(0, -40);
      this.helpBg.lineTo(0, -30);
      this.helpBg.moveTo(0, 40);
      this.helpBg.lineTo(0, 30);
      this.helpBg.strokePath();

      this.helpIcon.setColor("#000000");
      helpLabel.setColor("#000000");

      // Efeito de escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: "Sine.easeOut",
      });

      // Mostrar tooltip
      this.showTooltip("Ver Instruções e Ajuda", x - 100, y);
    });

    buttonContainer.on("pointerout", () => {
      // Estado normal
      this.helpBg.clear();
      this.helpBg.fillStyle(this.colors.primary, 0.8);
      this.helpBg.fillCircle(0, 0, 40);

      this.helpBg.lineStyle(3, this.colors.secondary, 0.9);
      this.helpBg.strokeCircle(0, 0, 40);

      this.helpBg.lineStyle(2, this.colors.secondary, 0.6);
      this.helpBg.beginPath();
      this.helpBg.moveTo(-40, 0);
      this.helpBg.lineTo(-30, 0);
      this.helpBg.moveTo(40, 0);
      this.helpBg.lineTo(30, 0);
      this.helpBg.moveTo(0, -40);
      this.helpBg.lineTo(0, -30);
      this.helpBg.moveTo(0, 40);
      this.helpBg.lineTo(0, 30);
      this.helpBg.strokePath();

      this.helpIcon.setColor("#FFFFFF");
      helpLabel.setColor("#FFFFFF");

      // Restaurar escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Sine.easeOut",
      });

      // Esconder tooltip
      this.hideTooltip();
    });

    buttonContainer.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.showHelpScreen();
        },
      });
    });

    // Adicionar ao container pai
    container.add(buttonContainer);
  };

  /**
   * Exibe um tooltip informativo
   * @param {string} text - Texto do tooltip
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   */
  jardimMission.prototype.showTooltip = function (text, x, y) {
    // Remover tooltip anterior se existir
    this.hideTooltip();

    // Criar container para o tooltip
    this.tooltipContainer = this.add.container(x, y).setDepth(2000);
    this.tooltipContainer.setScrollFactor(0);

    // Calcular largura baseada no texto
    const tempText = this.add.text(0, 0, text, {
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: "14px",
    });
    const textWidth = tempText.width;
    tempText.destroy();

    // Fundo do tooltip com estilo moderno
    const tooltipBg = this.add.graphics();

    // Fundo principal
    tooltipBg.fillStyle(0x000000, 0.8);
    tooltipBg.fillRoundedRect(0, -15, textWidth + 20, 30, 8);

    // Borda
    tooltipBg.lineStyle(2, this.colors.secondary, 0.7);
    tooltipBg.strokeRoundedRect(0, -15, textWidth + 20, 30, 8);

    // Texto do tooltip
    const tooltipText = this.add
      .text(10, 0, text, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "14px",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0, 0.5);

    // Adicionar ao container
    this.tooltipContainer.add([tooltipBg, tooltipText]);

    // Animar entrada do tooltip
    this.tooltipContainer.setAlpha(0);
    this.tooltipContainer.setScale(0.8);

    this.tweens.add({
      targets: this.tooltipContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: "Back.easeOut",
    });
  };

  /**
   * Esconde o tooltip atual
   */
  jardimMission.prototype.hideTooltip = function () {
    if (this.tooltipContainer) {
      this.tweens.add({
        targets: this.tooltipContainer,
        alpha: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 200,
        ease: "Back.easeIn",
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
   * Atualiza a posição dos elementos da UI
   */
  jardimMission.prototype.updateUIPositions = function (width, height) {
    // Indicador de objetivo
    if (this.objectiveContainer) {
      this.objectiveContainer.x = width / 2;
      this.objectiveContainer.y = 30;
    }

    // Minimapa
    if (this.minimapContainer) {
      this.minimapContainer.x = width - 100;
      this.minimapContainer.y = 110;
    }

    // Atualizar posição do controle de zoom
    if (this.minimapZoomControl) {
      this.minimapZoomControl.x = width - 100;
      this.minimapZoomControl.y = 210;
    }

    // Container de diálogo
    if (this.dialogContainer) {
      // Atualizar posições dos elementos internos
      if (this.dialogBg) {
        this.dialogBg.clear();

        // Redesenhar o painel do diálogo
        this.dialogBg.fillStyle(0x0a1a2f, 0.9);
        this.dialogBg.fillRoundedRect(20, height - 220, width - 40, 200, 15);

        this.dialogBg.lineStyle(3, this.colors.primary, 0.9);
        this.dialogBg.strokeRoundedRect(20, height - 220, width - 40, 200, 15);

        // Redesenhar detalhes
        this.dialogBg.lineStyle(2, this.colors.secondary, 0.7);

        // Canto superior esquerdo
        this.dialogBg.beginPath();
        this.dialogBg.moveTo(20, height - 190);
        this.dialogBg.lineTo(40, height - 190);
        this.dialogBg.moveTo(20, height - 160);
        this.dialogBg.lineTo(40, height - 160);
        this.dialogBg.strokePath();

        // Canto superior direito
        this.dialogBg.beginPath();
        this.dialogBg.moveTo(width - 20, height - 190);
        this.dialogBg.lineTo(width - 40, height - 190);
        this.dialogBg.moveTo(width - 20, height - 160);
        this.dialogBg.lineTo(width - 40, height - 160);
        this.dialogBg.strokePath();

        // Linha horizontal no topo
        this.dialogBg.lineStyle(2, this.colors.secondary, 0.7);
        this.dialogBg.beginPath();
        this.dialogBg.moveTo(140, height - 190);
        this.dialogBg.lineTo(width - 100, height - 190);
        this.dialogBg.strokePath();

        // Área para o avatar
        this.dialogBg.fillStyle(this.colors.primary, 0.2);
        this.dialogBg.fillRoundedRect(30, height - 180, 100, 100, 10);
        this.dialogBg.lineStyle(2, this.colors.secondary, 0.7);
        this.dialogBg.strokeRoundedRect(30, height - 180, 100, 100, 10);

        // Detalhes no avatar
        this.dialogBg.lineStyle(1, this.colors.secondary, 0.5);
        this.dialogBg.beginPath();
        this.dialogBg.moveTo(30, height - 150);
        this.dialogBg.lineTo(50, height - 150);
        this.dialogBg.moveTo(30, height - 120);
        this.dialogBg.lineTo(50, height - 120);
        this.dialogBg.strokePath();
      }

      // Atualizar posições
      if (this.dialogAvatar) {
        this.dialogAvatar.setPosition(80, height - 130);
      }

      if (this.dialogName) {
        this.dialogName.setPosition(140, height - 205);
      }

      if (this.dialogText) {
        this.dialogText.setPosition(140, height - 150);
        this.dialogText.setWordWrapWidth(width - 180);
      }

      if (this.dialogContinue) {
        this.dialogContinue.setPosition(width - 60, height - 40);
      }
    }
  };

  /**
   * Trata evento de redimensionamento da janela
   */
  jardimMission.prototype.handleResize = function (gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    console.log(`🔄 Redimensionando interface para ${width}x${height}`);

    // Atualizar posições de elementos da UI
    this.updateUIPositions(width, height);

    // Reconfigurar câmera do minimapa
    if (this.minimapCamera) {
      const minimapWidth = 180;
      const minimapHeight = 180;
      const minimapX = width - minimapWidth - 20;
      const minimapY = 20;

      this.minimapCamera.setPosition(minimapX + 10, minimapY + 30);
      this.minimapCamera.setSize(minimapWidth - 20, minimapHeight - 40);
    }
  };

  /**
   * Atualiza a interface do usuário
   */
  jardimMission.prototype.updateUI = function (time, delta) {
    // Atualizar indicadores de objetivos
    this.updateObjectiveIndicator();

    // Atualizar notificações
    this.updateNotifications();

    // Atualizar minimapa
    this.updateMinimap();
  };

  /**
   * Atualiza o minimapa
   */
  jardimMission.prototype.updateMinimap = function () {
    // Atualizar indicador do jogador no minimapa
    if (this.minimapPlayerIndicator && this.player && this.player.sprite) {
      // O indicador do jogador já é seguido automaticamente pela câmera do minimapa,
      // mas podemos atualizar sua rotação baseada na direção do jogador

      let angle = 0;

      switch (this.player.direction) {
        case "up":
          angle = 0;
          break;
        case "right":
          angle = 90;
          break;
        case "down":
          angle = 180;
          break;
        case "left":
          angle = 270;
          break;
      }

      this.minimapPlayerIndicator.setRotation(Phaser.Math.DegToRad(angle));
    }

    // Atualizar indicador do professor no minimapa
    if (this.minimapProfessorIndicator && this.professor && this.professor.sprite) {
      this.minimapProfessorIndicator.setPosition(this.professor.sprite.x, this.professor.sprite.y);
    }
  };

  /**
   * Atualiza o indicador de objetivo com animações
   */
  jardimMission.prototype.updateObjectiveIndicator = function () {
    // Verificar se o indicador existe
    if (!this.objectiveText) return;

    let objectiveString = "Encontre o professor no jardim da escola";

    if (this.missionStarted) {
      if (this.currentTask === 0) {
        objectiveString = "Fale com o professor sobre o grupo de WhatsApp";
      } else if (this.currentTask === 1) {
        objectiveString = "Explique os problemas com o grupo de WhatsApp";
      } else if (this.missionCompleted) {
        objectiveString = "Missão concluída! Volte ao Hub de Missões";
      }
    }

    // Atualizar apenas se o texto mudou
    if (this.objectiveText.text !== objectiveString) {
      // Animar transição do texto
      this.tweens.add({
        targets: this.objectiveText,
        alpha: 0,
        x: this.objectiveText.x - 20,
        duration: 200,
        onComplete: () => {
          this.objectiveText.setText(objectiveString);
          this.objectiveText.x += 20;

          this.tweens.add({
            targets: this.objectiveText,
            alpha: 1,
            x: this.objectiveText.x - 20,
            duration: 200,
          });
        },
      });
    }
  };

  /**
   * Mostra uma notificação aprimorada
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo de notificação: 'info', 'success', 'warning', 'error'
   * @param {number} duration - Duração em ms (padrão: 3000)
   */
  jardimMission.prototype.showNotification = function (message, type = "info", duration = 3000) {
    // Adicionar à fila de notificações
    this.notifications.push({
      message,
      type,
      duration,
    });

    // Processar a fila se não houver notificação ativa
    if (!this.notificationActive) {
      this.processNextNotification();
    }
  };

  /**
   * Processa a próxima notificação na fila com animações aprimoradas
   */
  jardimMission.prototype.processNextNotification = function () {
    if (this.notifications.length === 0) {
      this.notificationActive = false;
      return;
    }

    this.notificationActive = true;
    const notification = this.notifications.shift();

    // Cores e ícones baseados no tipo
    const typeConfig = {
      info: {
        color: this.colors.primary,
        icon: "ℹ️",
        borderColor: this.colors.secondary,
      },
      success: {
        color: this.colors.positive,
        icon: "✅",
        borderColor: 0xffffff,
      },
      warning: {
        color: this.colors.warning,
        icon: "⚠️",
        borderColor: 0x000000,
      },
      error: {
        color: this.colors.accent,
        icon: "❌",
        borderColor: 0xffffff,
      },
      points: {
        color: 0xffd700, // Dourado
        icon: "🏆",
        borderColor: 0xffffff,
      },
    };

    const config = typeConfig[notification.type] || typeConfig.info;

    // Largura baseada no tamanho do texto
    const tempText = this.add.text(0, 0, notification.message, {
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: "16px",
    });
    const textWidth = tempText.width;
    tempText.destroy();

    const notifWidth = Math.max(300, textWidth + 60);

    // Container para a notificação
    const notifContainer = this.add.container(
      this.cameras.main.width / 2,
      -80 // Começa fora da tela
    );
    notifContainer.setDepth(200);
    notifContainer.setScrollFactor(0);

    // Fundo com estilo moderno
    const notifBg = this.add.graphics();

    // Forma principal
    notifBg.fillStyle(0x000000, 0.8);
    notifBg.fillRoundedRect(-notifWidth / 2, -40, notifWidth, 80, 15);

    // Borda com cor baseada no tipo
    notifBg.lineStyle(3, config.color, 0.9);
    notifBg.strokeRoundedRect(-notifWidth / 2, -40, notifWidth, 80, 15);

    // Detalhes angulares (estilo cyberpunk)
    notifBg.lineStyle(2, config.borderColor, 0.7);
    notifBg.beginPath();
    notifBg.moveTo(-notifWidth / 2, -20);
    notifBg.lineTo(-notifWidth / 2 + 20, -20);
    notifBg.moveTo(-notifWidth / 2, 0);
    notifBg.lineTo(-notifWidth / 2 + 20, 0);
    notifBg.moveTo(-notifWidth / 2, 20);
    notifBg.lineTo(-notifWidth / 2 + 20, 20);
    notifBg.moveTo(notifWidth / 2, -20);
    notifBg.lineTo(notifWidth / 2 - 20, -20);
    notifBg.moveTo(notifWidth / 2, 0);
    notifBg.lineTo(notifWidth / 2 - 20, 0);
    notifBg.moveTo(notifWidth / 2, 20);
    notifBg.lineTo(notifWidth / 2 - 20, 20);
    notifBg.strokePath();

    // Barra de progresso (para mostrar tempo restante)
    const progressBar = this.add.graphics();
    progressBar.fillStyle(config.color, 0.5);
    progressBar.fillRect(-notifWidth / 2 + 10, 30, notifWidth - 20, 5);

    // Ícone baseado no tipo
    const notifIcon = this.add
      .text(-notifWidth / 2 + 25, 0, config.icon, {
        fontSize: "24px",
      })
      .setOrigin(0, 0.5);

    // Texto da notificação
    const notifText = this.add
      .text(-notifWidth / 2 + 60, 0, notification.message, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "16px",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 1,
        align: "left",
        wordWrap: { width: notifWidth - 80 },
      })
      .setOrigin(0, 0.5);

    // Botão para fechar
    const closeBtn = this.add
      .text(notifWidth / 2 - 20, -30, "×", {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#FFFFFF",
      })
      .setOrigin(0.5);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on("pointerdown", () => {
      // Animar saída manualmente
      this.tweens.add({
        targets: notifContainer,
        y: -80,
        alpha: 0,
        duration: 300,
        ease: "Back.easeIn",
        onComplete: () => {
          notifContainer.destroy();
          this.notificationActive = false;
          this.processNextNotification();
        },
      });
    });

    // Adicionar ao container
    notifContainer.add([notifBg, progressBar, notifIcon, notifText, closeBtn]);

    // Adicionar ao container de notificações
    this.notificationContainer.add(notifContainer);

    // Animar entrada
    this.tweens.add({
      targets: notifContainer,
      y: 60,
      duration: 500,
      ease: "Back.easeOut",
      onComplete: () => {
        // Animar barra de progresso
        this.tweens.add({
          targets: progressBar,
          scaleX: 0,
          duration: notification.duration,
          ease: "Linear",
        });

        // Aguardar duração e animar saída
        this.time.delayedCall(notification.duration, () => {
          this.tweens.add({
            targets: notifContainer,
            y: -80,
            alpha: 0,
            duration: 300,
            ease: "Back.easeIn",
            onComplete: () => {
              notifContainer.destroy();
              this.notificationActive = false;
              this.processNextNotification();
            },
          });
        });
      },
    });
  };

  /**
   * Atualiza as notificações
   */
  jardimMission.prototype.updateNotifications = function () {
    // Já é processado através da fila de notificações
  };

  /**
   * Mostra uma notificação de tarefa
   * @param {string} message - Mensagem da tarefa
   */
  jardimMission.prototype.showTaskNotification = function (message) {
    // Usar o mesmo sistema de notificação, mas com estilo diferente
    this.showNotification(message, "info", 5000);

    // Destacar o indicador de objetivo por um momento
    if (this.objectiveBg) {
      // Salvar estilo original
      const originalFill = this.objectiveBg.fillColor;
      const originalAlpha = this.objectiveBg.fillAlpha;

      // Destacar
      this.objectiveBg.clear();
      this.objectiveBg.fillStyle(this.colors.secondary, 0.9);
      this.objectiveBg.fillRoundedRect(-200, -25, 400, 50, 15);

      this.objectiveBg.lineStyle(3, this.colors.primary, 0.9);
      this.objectiveBg.strokeRoundedRect(-200, -25, 400, 50, 15);

      // Animar escala
      this.tweens.add({
        targets: this.objectiveContainer,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 300,
        yoyo: true,
        repeat: 1,
        ease: "Sine.easeInOut",
        onComplete: () => {
          // Restaurar estilo original
          this.objectiveBg.clear();
          this.objectiveBg.fillStyle(0x000000, 0.7);
          this.objectiveBg.fillRoundedRect(-200, -25, 400, 50, 15);

          this.objectiveBg.lineStyle(3, this.colors.secondary, 0.8);
          this.objectiveBg.strokeRoundedRect(-200, -25, 400, 50, 15);

          // Restaurar detalhes
          this.objectiveBg.lineStyle(2, this.colors.primary, 0.7);
          this.objectiveBg.beginPath();
          this.objectiveBg.moveTo(-200, -15);
          this.objectiveBg.lineTo(-190, -15);
          this.objectiveBg.moveTo(-200, 15);
          this.objectiveBg.lineTo(-190, 15);
          this.objectiveBg.moveTo(200, -15);
          this.objectiveBg.lineTo(190, -15);
          this.objectiveBg.moveTo(200, 15);
          this.objectiveBg.lineTo(190, 15);
          this.objectiveBg.strokePath();
        },
      });
    }
  };

  /**
   * Alterna o menu de pausa aprimorado
   */
  jardimMission.prototype.togglePauseMenu = function () {
    // Verificar se o menu de pausa já existe
    if (this.pauseMenuContainer) {
      // Se existe, verificar se está visível
      if (this.pauseMenuContainer.visible) {
        // Esconder com animação
        this.tweens.add({
          targets: this.pauseMenuContainer,
          alpha: 0,
          scale: 0.9,
          duration: 300,
          ease: "Back.easeIn",
          onComplete: () => {
            this.pauseMenuContainer.setVisible(false);
            // Retomar o jogo
            this.scene.resume();
          },
        });
      } else {
        // Mostrar com animação
        this.pauseMenuContainer.setVisible(true);
        this.pauseMenuContainer.setAlpha(0);
        this.pauseMenuContainer.setScale(0.9);

        this.tweens.add({
          targets: this.pauseMenuContainer,
          alpha: 1,
          scale: 1,
          duration: 300,
          ease: "Back.easeOut",
        });

        // Pausar o jogo
        this.scene.pause();
      }
      return;
    }

    // Criar menu de pausa com estilo moderno
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.pauseMenuContainer = this.add.container(0, 0);
    this.pauseMenuContainer.setDepth(300);
    this.pauseMenuContainer.setScrollFactor(0);

    // Fundo escuro semi-transparente
    const bgOverlay = this.add.graphics();
    bgOverlay.fillStyle(0x000000, 0.7);
    bgOverlay.fillRect(0, 0, width, height);

    // Adicionar efeito de blur (não suportado diretamente, simulado com grid)
    const blurEffect = this.add.graphics();

    // Criar grid de linhas para simular blur
    blurEffect.lineStyle(1, 0xffffff, 0.03);

    // Linhas horizontais
    for (let y = 0; y < height; y += 4) {
      blurEffect.beginPath();
      blurEffect.moveTo(0, y);
      blurEffect.lineTo(width, y);
      blurEffect.strokePath();
    }

    // Linhas verticais
    for (let x = 0; x < width; x += 4) {
      blurEffect.beginPath();
      blurEffect.moveTo(x, 0);
      blurEffect.lineTo(x, height);
      blurEffect.strokePath();
    }

    // Painel do menu com estilo cyberpunk
    const menuPanel = this.add.graphics();

    // Fundo do painel
    menuPanel.fillStyle(0x0a1a2f, 0.9);
    menuPanel.fillRoundedRect(width / 2 - 200, height / 2 - 250, 400, 500, 20);

    // Borda principal
    menuPanel.lineStyle(3, this.colors.primary, 0.9);
    menuPanel.strokeRoundedRect(width / 2 - 200, height / 2 - 250, 400, 500, 20);

    // Detalhes angulares
    menuPanel.lineStyle(2, this.colors.secondary, 0.7);

    // Cantos superiores
    menuPanel.beginPath();
    menuPanel.moveTo(width / 2 - 200, height / 2 - 220);
    menuPanel.lineTo(width / 2 - 180, height / 2 - 220);
    menuPanel.moveTo(width / 2 - 200, height / 2 - 190);
    menuPanel.lineTo(width / 2 - 180, height / 2 - 190);
    menuPanel.moveTo(width / 2 + 200, height / 2 - 220);
    menuPanel.lineTo(width / 2 + 180, height / 2 - 220);
    menuPanel.moveTo(width / 2 + 200, height / 2 - 190);
    menuPanel.lineTo(width / 2 + 180, height / 2 - 190);
    menuPanel.strokePath();

    // Cantos inferiores
    menuPanel.beginPath();
    menuPanel.moveTo(width / 2 - 200, height / 2 + 220);
    menuPanel.lineTo(width / 2 - 180, height / 2 + 220);
    menuPanel.moveTo(width / 2 - 200, height / 2 + 190);
    menuPanel.lineTo(width / 2 - 180, height / 2 + 190);
    menuPanel.moveTo(width / 2 + 200, height / 2 + 220);
    menuPanel.lineTo(width / 2 + 180, height / 2 + 220);
    menuPanel.moveTo(width / 2 + 200, height / 2 + 190);
    menuPanel.lineTo(width / 2 + 180, height / 2 + 190);
    menuPanel.strokePath();

    // Linha de separação do título
    menuPanel.lineStyle(2, this.colors.secondary, 0.5);
    menuPanel.beginPath();
    menuPanel.moveTo(width / 2 - 150, height / 2 - 200);
    menuPanel.lineTo(width / 2 + 150, height / 2 - 200);
    menuPanel.strokePath();

    // Círculos decorativos
    menuPanel.lineStyle(1, this.colors.primary, 0.5);
    menuPanel.strokeCircle(width / 2 - 180, height / 2 - 230, 5);
    menuPanel.strokeCircle(width / 2 + 180, height / 2 - 230, 5);
    menuPanel.strokeCircle(width / 2 - 180, height / 2 + 230, 5);
    menuPanel.strokeCircle(width / 2 + 180, height / 2 + 230, 5);

    // Título do menu
    const menuTitle = this.add
      .text(width / 2, height / 2 - 230, "MENU DE PAUSA", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "28px",
        color: this.colors.secondary,
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Subtítulo
    const menuSubtitle = this.add
      .text(width / 2, height / 2 - 180, "Jardim da Escola", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    // Criar botões do menu
    const buttonData = [
      { text: "CONTINUAR", y: -100, callback: () => this.togglePauseMenu() },
      { text: "OPÇÕES", y: -40, callback: () => this.showOptionsScreen() },
      {
        text: "AJUDA",
        y: 20,
        callback: () => {
          this.togglePauseMenu();
          this.showHelpScreen();
        },
      },
      { text: "HUB DE MISSÕES", y: 80, callback: () => this.exitToMissionsHub() },
      { text: "MENU PRINCIPAL", y: 140, callback: () => this.exitToMainMenu() },
    ];

    // Array para armazenar os botões
    const buttons = [];

    // Criar cada botão
    buttonData.forEach((button, index) => {
      const btn = this.createPauseMenuButton(width / 2, height / 2 + button.y, button.text, button.callback);
      buttons.push(btn);

      // Configurar delay para animação de entrada
      btn.setAlpha(0);
      btn.setY(btn.y + 30);

      this.tweens.add({
        targets: btn,
        alpha: 1,
        y: btn.y - 30,
        duration: 300,
        delay: 100 + index * 100,
        ease: "Back.easeOut",
      });
    });

    // Tornar o overlay interativo para impedir cliques nos objetos por baixo
    bgOverlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

    // Adicionar elementos ao container
    this.pauseMenuContainer.add([bgOverlay, blurEffect, menuPanel, menuTitle, menuSubtitle, ...buttons]);

    // Pausar o jogo
    this.scene.pause();

    // Adicionar à UI
    this.uiContainer.add(this.pauseMenuContainer);

    // Animar entrada do menu
    this.pauseMenuContainer.setAlpha(0);
    this.pauseMenuContainer.setScale(0.9);

    this.tweens.add({
      targets: this.pauseMenuContainer,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: "Back.easeOut",
    });
  };

  /**
   * Cria um botão para o menu de pausa
   */
  jardimMission.prototype.createPauseMenuButton = function (x, y, text, callback) {
    // Container para o botão
    const buttonContainer = this.add.container(x, y);

    // Fundo do botão com estilo cyberpunk
    const buttonBg = this.add.graphics();

    // Dimensões
    const width = 300;
    const height = 50;

    // Fundo principal
    buttonBg.fillStyle(this.colors.primary, 0.7);
    buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);

    // Borda
    buttonBg.lineStyle(2, this.colors.secondary, 0.8);
    buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 15);

    // Detalhes angulares
    buttonBg.lineStyle(1, this.colors.secondary, 0.6);
    buttonBg.beginPath();
    buttonBg.moveTo(-width / 2, -15);
    buttonBg.lineTo(-width / 2 + 15, -15);
    buttonBg.moveTo(-width / 2, 15);
    buttonBg.lineTo(-width / 2 + 15, 15);
    buttonBg.moveTo(width / 2, -15);
    buttonBg.lineTo(width / 2 - 15, -15);
    buttonBg.moveTo(width / 2, 15);
    buttonBg.lineTo(width / 2 - 15, 15);
    buttonBg.strokePath();

    // Brilho na parte superior
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.2);
    highlight.fillRoundedRect(-width / 2 + 5, -height / 2 + 5, width - 10, height / 3, { tl: 10, tr: 10, bl: 0, br: 0 });

    // Texto do botão
    const buttonText = this.add
      .text(0, 0, text, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "22px",
        color: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Adicionar elementos ao container
    buttonContainer.add([buttonBg, highlight, buttonText]);

    // Interatividade
    buttonContainer.setSize(width, height);
    buttonContainer.setInteractive({ useHandCursor: true });

    // Eventos
    buttonContainer.on("pointerover", () => {
      // Estado hover
      buttonBg.clear();
      buttonBg.fillStyle(this.colors.secondary, 0.8);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);

      buttonBg.lineStyle(2, this.colors.primary, 0.9);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 15);

      buttonBg.lineStyle(1, this.colors.primary, 0.6);
      buttonBg.beginPath();
      buttonBg.moveTo(-width / 2, -15);
      buttonBg.lineTo(-width / 2 + 15, -15);
      buttonBg.moveTo(-width / 2, 15);
      buttonBg.lineTo(-width / 2 + 15, 15);
      buttonBg.moveTo(width / 2, -15);
      buttonBg.lineTo(width / 2 - 15, -15);
      buttonBg.moveTo(width / 2, 15);
      buttonBg.lineTo(width / 2 - 15, 15);
      buttonBg.strokePath();

      // Mudar cor do texto
      buttonText.setColor("#000000");
      buttonText.setStroke("#FFFFFF", 2);

      // Efeito de escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: "Sine.easeOut",
      });

      // Adicionar ícone indicador
      if (!buttonContainer.indicator) {
        const icon = this.add
          .text(-width / 2 + 30, 0, "▶", {
            fontSize: "16px",
            color: "#000000",
          })
          .setOrigin(0.5);

        buttonContainer.add(icon);
        buttonContainer.indicator = icon;

        // Animar entrada
        icon.setAlpha(0);

        this.tweens.add({
          targets: icon,
          alpha: 1,
          x: icon.x + 5,
          duration: 200,
        });
      }
    });

    buttonContainer.on("pointerout", () => {
      // Restaurar aparência normal
      buttonBg.clear();
      buttonBg.fillStyle(this.colors.primary, 0.7);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);

      buttonBg.lineStyle(2, this.colors.secondary, 0.8);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 15);

      buttonBg.lineStyle(1, this.colors.secondary, 0.6);
      buttonBg.beginPath();
      buttonBg.moveTo(-width / 2, -15);
      buttonBg.lineTo(-width / 2 + 15, -15);
      buttonBg.moveTo(-width / 2, 15);
      buttonBg.lineTo(-width / 2 + 15, 15);
      buttonBg.moveTo(width / 2, -15);
      buttonBg.lineTo(width / 2 - 15, -15);
      buttonBg.moveTo(width / 2, 15);
      buttonBg.lineTo(width / 2 - 15, 15);
      buttonBg.strokePath();

      // Restaurar cor do texto
      buttonText.setColor("#FFFFFF");
      buttonText.setStroke("#000000", 2);

      // Restaurar escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Sine.easeOut",
      });

      // Remover ícone indicador
      if (buttonContainer.indicator) {
        this.tweens.add({
          targets: buttonContainer.indicator,
          alpha: 0,
          x: buttonContainer.indicator.x - 5,
          duration: 200,
          onComplete: () => {
            buttonContainer.indicator.destroy();
            buttonContainer.indicator = null;
          },
        });
      }
    });

    buttonContainer.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });
    });

    return buttonContainer;
  };

  /**
   * Mostra a tela de opções
   */
  jardimMission.prototype.showOptionsScreen = function () {
    // Implementar tela de opções se necessário
    this.showNotification("Opções não disponíveis nesta versão", "info");
  };

  /**
   * Mostra a tela de ajuda com estilo aprimorado
   */
  jardimMission.prototype.showHelpScreen = function () {
    // Verificar se a tela de ajuda já existe
    if (this.helpScreenContainer) {
      // Se existe, verificar se está visível
      if (this.helpScreenContainer.visible) {
        // Esconder com animação
        this.tweens.add({
          targets: this.helpScreenContainer,
          alpha: 0,
          scale: 0.9,
          duration: 300,
          ease: "Back.easeIn",
          onComplete: () => {
            this.helpScreenContainer.setVisible(false);
          },
        });
      } else {
        // Mostrar com animação
        this.helpScreenContainer.setVisible(true);
        this.helpScreenContainer.setAlpha(0);
        this.helpScreenContainer.setScale(0.9);

        this.tweens.add({
          targets: this.helpScreenContainer,
          alpha: 1,
          scale: 1,
          duration: 300,
          ease: "Back.easeOut",
        });
      }
      return;
    }

    // Criar tela de ajuda com estilo cyberpunk
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.helpScreenContainer = this.add.container(0, 0);
    this.helpScreenContainer.setDepth(250);
    this.helpScreenContainer.setScrollFactor(0);

    // Fundo escuro semi-transparente
    const bgOverlay = this.add.graphics();
    bgOverlay.fillStyle(0x000000, 0.7);
    bgOverlay.fillRect(0, 0, width, height);

    // Adicionar efeito de grid para simular blur
    const gridEffect = this.add.graphics();
    gridEffect.lineStyle(1, 0xffffff, 0.03);

    // Linhas horizontais
    for (let y = 0; y < height; y += 4) {
      gridEffect.beginPath();
      gridEffect.moveTo(0, y);
      gridEffect.lineTo(width, y);
      gridEffect.strokePath();
    }

    // Linhas verticais
    for (let x = 0; x < width; x += 4) {
      gridEffect.beginPath();
      gridEffect.moveTo(x, 0);
      gridEffect.lineTo(x, height);
      gridEffect.strokePath();
    }

    // Painel principal
    const helpPanel = this.add.graphics();

    // Fundo do painel
    helpPanel.fillStyle(0x0a1a2f, 0.9);
    helpPanel.fillRoundedRect(width / 2 - 350, height / 2 - 300, 700, 600, 20);

    // Borda principal
    helpPanel.lineStyle(3, this.colors.primary, 0.9);
    helpPanel.strokeRoundedRect(width / 2 - 350, height / 2 - 300, 700, 600, 20);

    // Detalhes angulares
    helpPanel.lineStyle(2, this.colors.secondary, 0.7);

    // Cantos superiores
    helpPanel.beginPath();
    helpPanel.moveTo(width / 2 - 350, height / 2 - 270);
    helpPanel.lineTo(width / 2 - 330, height / 2 - 270);
    helpPanel.moveTo(width / 2 - 350, height / 2 - 240);
    helpPanel.lineTo(width / 2 - 330, height / 2 - 240);
    helpPanel.moveTo(width / 2 + 350, height / 2 - 270);
    helpPanel.lineTo(width / 2 + 330, height / 2 - 270);
    helpPanel.moveTo(width / 2 + 350, height / 2 - 240);
    helpPanel.lineTo(width / 2 + 330, height / 2 - 240);
    helpPanel.strokePath();

    // Cantos inferiores
    helpPanel.beginPath();
    helpPanel.moveTo(width / 2 - 350, height / 2 + 270);
    helpPanel.lineTo(width / 2 - 330, height / 2 + 270);
    helpPanel.moveTo(width / 2 - 350, height / 2 + 240);
    helpPanel.lineTo(width / 2 - 330, height / 2 + 240);
    helpPanel.moveTo(width / 2 + 350, height / 2 + 270);
    helpPanel.lineTo(width / 2 + 330, height / 2 + 270);
    helpPanel.moveTo(width / 2 + 350, height / 2 + 240);
    helpPanel.lineTo(width / 2 + 330, height / 2 + 240);
    helpPanel.strokePath();

    // Título da ajuda
    const helpTitle = this.add
      .text(width / 2, height / 2 - 275, "MANUAL DE INSTRUÇÕES", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "30px",
        color: this.colors.secondary,
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Subtítulo
    const helpSubtitle = this.add
      .text(width / 2, height / 2 - 235, "Missão no Jardim da Escola", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    // Linha de separação
    const separatorLine = this.add.graphics();
    separatorLine.lineStyle(2, this.colors.secondary, 0.5);
    separatorLine.beginPath();
    separatorLine.moveTo(width / 2 - 300, height / 2 - 210);
    separatorLine.lineTo(width / 2 + 300, height / 2 - 210);
    separatorLine.strokePath();

    // Conteúdo de ajuda organizado em seções
    const helpContent = [
      {
        title: "CONTROLES",
        text: "• SETAS ou WASD - Movimentação do personagem\n• E - Interagir com objetos e personagens\n• ESPAÇO - Avançar diálogos\n• ESC - Menu de pausa\n• H - Abrir/fechar HUD do agente",
        icon: "🎮",
      },
      {
        title: "OBJETIVO DA MISSÃO",
        text: "Encontre o professor no jardim da escola e converse com ele sobre a sua ideia de criar um grupo de WhatsApp com os alunos. Você deve explicar as questões relacionadas à proteção de dados pessoais e ajudá-lo a encontrar uma alternativa adequada.",
        icon: "🎯",
      },
      {
        title: "INTERAÇÕES",
        text: "Aproxime-se de NPCs e objetos para interagir. Um indicador aparecerá quando você estiver próximo de algo interativo. Durante os diálogos, pressione ESPAÇO ou clique para avançar. Em alguns diálogos, você precisará escolher entre opções.",
        icon: "🤝",
      },
      {
        title: "INTERFACE",
        text: "• Indicador de Objetivo - Mostra sua tarefa atual\n• Minimapa - Visualiza o mapa e localização de NPCs\n• Menu de Pausa - Acesse opções e volte ao hub\n• Notificações - Informam sobre progresso e eventos",
        icon: "📱",
      },
    ];

    // Criar cada seção de ajuda
    const helpSections = [];
    let yOffset = height / 2 - 180;

    // Adicionar seções com estilo visual e animação sequencial
    helpContent.forEach((section, index) => {
      // Container para a seção
      const sectionContainer = this.add.container(width / 2, yOffset);

      // Fundo da seção
      const sectionBg = this.add.graphics();
      sectionBg.fillStyle(this.colors.primary, 0.2);
      sectionBg.fillRoundedRect(-320, -20, 640, 120, 10);

      sectionBg.lineStyle(2, this.colors.secondary, 0.3);
      sectionBg.strokeRoundedRect(-320, -20, 640, 120, 10);

      // Ícone da seção
      const sectionIcon = this.add.text(-300, -10, section.icon, {
        fontSize: "30px",
      });

      // Título da seção
      const sectionTitle = this.add.text(-260, -10, section.title, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "20px",
        color: this.colors.secondary,
        fontWeight: "bold",
      });

      // Texto da seção
      const sectionText = this.add.text(-260, 20, section.text, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "16px",
        color: "#FFFFFF",
        wordWrap: { width: 570 },
        lineSpacing: 6,
      });

      // Adicionar elementos à seção
      sectionContainer.add([sectionBg, sectionIcon, sectionTitle, sectionText]);

      // Configurar animação de entrada
      sectionContainer.setAlpha(0);
      sectionContainer.setX(sectionContainer.x + 50);

      this.tweens.add({
        targets: sectionContainer,
        alpha: 1,
        x: width / 2,
        duration: 400,
        delay: 200 + index * 150,
        ease: "Back.easeOut",
      });

      // Adicionar ao array de seções
      helpSections.push(sectionContainer);

      // Atualizar posição Y para a próxima seção
      yOffset += 140;
    });

    // Botão de fechar com estilo moderno
    const closeButton = this.add.container(width / 2, height / 2 + 260);

    // Fundo do botão
    const closeBtnBg = this.add.graphics();
    closeBtnBg.fillStyle(this.colors.primary, 0.8);
    closeBtnBg.fillRoundedRect(-100, -25, 200, 50, 15);

    closeBtnBg.lineStyle(2, this.colors.secondary, 0.9);
    closeBtnBg.strokeRoundedRect(-100, -25, 200, 50, 15);

    // Texto do botão
    const closeBtnText = this.add
      .text(0, 0, "FECHAR", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "22px",
        color: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Adicionar ao container do botão
    closeButton.add([closeBtnBg, closeBtnText]);

    // Interatividade
    closeButton.setSize(200, 50);
    closeButton.setInteractive({ useHandCursor: true });

    // Eventos
    closeButton.on("pointerover", () => {
      // Estado hover
      closeBtnBg.clear();
      closeBtnBg.fillStyle(this.colors.secondary, 0.8);
      closeBtnBg.fillRoundedRect(-100, -25, 200, 50, 15);

      closeBtnBg.lineStyle(2, this.colors.primary, 0.9);
      closeBtnBg.strokeRoundedRect(-100, -25, 200, 50, 15);

      closeBtnText.setColor("#000000");
      closeBtnText.setStroke("#FFFFFF", 2);

      // Efeito de escala
      this.tweens.add({
        targets: closeButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: "Sine.easeOut",
      });
    });

    closeButton.on("pointerout", () => {
      // Estado normal
      closeBtnBg.clear();
      closeBtnBg.fillStyle(this.colors.primary, 0.8);
      closeBtnBg.fillRoundedRect(-100, -25, 200, 50, 15);

      closeBtnBg.lineStyle(2, this.colors.secondary, 0.9);
      closeBtnBg.strokeRoundedRect(-100, -25, 200, 50, 15);

      closeBtnText.setColor("#FFFFFF");
      closeBtnText.setStroke("#000000", 2);

      // Restaurar escala
      this.tweens.add({
        targets: closeButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Sine.easeOut",
      });
    });

    closeButton.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: closeButton,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Animar saída
          this.tweens.add({
            targets: this.helpScreenContainer,
            alpha: 0,
            scale: 0.9,
            duration: 300,
            ease: "Back.easeIn",
            onComplete: () => {
              this.helpScreenContainer.setVisible(false);

              // Retomar o jogo se estiver pausado
              if (this.scene.isPaused()) {
                this.scene.resume();
              }
            },
          });
        },
      });
    });

    // Animar entrada do botão
    closeButton.setAlpha(0);
    closeButton.setY(closeButton.y + 30);

    this.tweens.add({
      targets: closeButton,
      alpha: 1,
      y: height / 2 + 260,
      duration: 400,
      delay: 800,
      ease: "Back.easeOut",
    });

    // Adicionar elementos ao container
    this.helpScreenContainer.add([bgOverlay, gridEffect, helpPanel, helpTitle, helpSubtitle, separatorLine, ...helpSections, closeButton]);

    // Tornar o overlay interativo para impedir cliques nos objetos por baixo
    bgOverlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

    // Adicionar à UI
    this.uiContainer.add(this.helpScreenContainer);

    // Animar entrada do painel
    this.helpScreenContainer.setAlpha(0);
    this.helpScreenContainer.setScale(0.9);

    this.tweens.add({
      targets: this.helpScreenContainer,
      alpha: 1,
      scale: 1,
      duration: 400,
      ease: "Back.easeOut",
    });
  };

  /**
   * Sai da missão e retorna ao hub de missões com confirmaçcão aprimorada
   */
  jardimMission.prototype.exitToMissionsHub = function () {
    // Confirmar saída com diálogo aprimorado
    this.showExitConfirmation("Voltar para o Hub de Missões?", "Seu progresso nesta missão será salvo.", "HUB DE MISSÕES", () => {
      // Animar transição de saída
      this.cameras.main.fadeOut(this.fadeSpeed, 0, 0, 0);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        // Salvar progresso da missão
        this.saveProgress();

        // Iniciar cena do hub de missões
        this.scene.start("missionsHub", {
          fromMission: true,
          missionId: "jardim",
          missionCompleted: this.missionCompleted,
        });
      });
    });
  };

  /**
   * Sai da missão e retorna ao menu principal com confirmação aprimorada
   */
  jardimMission.prototype.exitToMainMenu = function () {
    // Confirmar saída com diálogo aprimorado
    this.showExitConfirmation("Voltar para o Menu Principal?", "Seu progresso nesta missão será salvo.", "MENU PRINCIPAL", () => {
      // Animar transição de saída
      this.cameras.main.fadeOut(this.fadeSpeed, 0, 0, 0);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        // Salvar progresso da missão
        this.saveProgress();

        // Iniciar cena do menu principal
        this.scene.start("mainMenu");
      });
    });
  };

  /**
   * Mostra uma confirmação de saída aprimorada com animações
   * @param {string} title - Título da confirmação
   * @param {string} message - Mensagem adicional
   * @param {string} confirmText - Texto do botão de confirmação
   * @param {Function} confirmCallback - Função ao confirmar
   */
  jardimMission.prototype.showExitConfirmation = function (title, message, confirmText, confirmCallback) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Container para o diálogo de confirmação
    const confirmContainer = this.add.container(0, 0);
    confirmContainer.setDepth(350);
    confirmContainer.setScrollFactor(0);

    // Fundo escuro semi-transparente com efeito de animação
    const bgOverlay = this.add.graphics();
    bgOverlay.fillStyle(0x000000, 0);
    bgOverlay.fillRect(0, 0, width, height);

    // Animar o fundo entrando
    this.tweens.add({
      targets: bgOverlay,
      fillAlpha: 0.7,
      duration: 300,
    });

    // Painel do diálogo com estilo cyberpunk
    const confirmPanel = this.add.graphics();

    // Fundo do painel
    confirmPanel.fillStyle(0x0a1a2f, 0.9);
    confirmPanel.fillRoundedRect(width / 2 - 250, height / 2 - 150, 500, 300, 20);

    // Borda principal
    confirmPanel.lineStyle(3, this.colors.primary, 0.9);
    confirmPanel.strokeRoundedRect(width / 2 - 250, height / 2 - 150, 500, 300, 20);

    // Detalhes angulares
    confirmPanel.lineStyle(2, this.colors.secondary, 0.7);

    // Cantos superiores
    confirmPanel.beginPath();
    confirmPanel.moveTo(width / 2 - 250, height / 2 - 120);
    confirmPanel.lineTo(width / 2 - 230, height / 2 - 120);
    confirmPanel.moveTo(width / 2 - 250, height / 2 - 90);
    confirmPanel.lineTo(width / 2 - 230, height / 2 - 90);
    confirmPanel.moveTo(width / 2 + 250, height / 2 - 120);
    confirmPanel.lineTo(width / 2 + 230, height / 2 - 120);
    confirmPanel.moveTo(width / 2 + 250, height / 2 - 90);
    confirmPanel.lineTo(width / 2 + 230, height / 2 - 90);
    confirmPanel.strokePath();

    // Cantos inferiores
    confirmPanel.beginPath();
    confirmPanel.moveTo(width / 2 - 250, height / 2 + 120);
    confirmPanel.lineTo(width / 2 - 230, height / 2 + 120);
    confirmPanel.moveTo(width / 2 - 250, height / 2 + 90);
    confirmPanel.lineTo(width / 2 - 230, height / 2 + 90);
    confirmPanel.moveTo(width / 2 + 250, height / 2 + 120);
    confirmPanel.lineTo(width / 2 + 230, height / 2 + 120);
    confirmPanel.moveTo(width / 2 + 250, height / 2 + 90);
    confirmPanel.lineTo(width / 2 + 230, height / 2 + 90);
    confirmPanel.strokePath();

    // Ícone de alerta
    const alertIcon = this.add
      .text(width / 2, height / 2 - 100, "⚠️", {
        fontSize: "48px",
      })
      .setOrigin(0.5);

    // Título da confirmação
    const confirmTitle = this.add
      .text(width / 2, height / 2 - 30, title, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "28px",
        color: this.colors.secondary,
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Mensagem adicional
    const confirmMessage = this.add
      .text(width / 2, height / 2 + 20, message, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    // Botão SIM
    const yesButton = this.add.container(width / 2 - 100, height / 2 + 100);

    // Fundo do botão SIM
    const yesBtnBg = this.add.graphics();
    yesBtnBg.fillStyle(this.colors.positive, 0.8);
    yesBtnBg.fillRoundedRect(-80, -25, 160, 50, 10);

    yesBtnBg.lineStyle(2, 0xffffff, 0.9);
    yesBtnBg.strokeRoundedRect(-80, -25, 160, 50, 10);

    // Texto do botão SIM
    const yesBtnText = this.add
      .text(0, 0, confirmText, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    yesButton.add([yesBtnBg, yesBtnText]);

    // Botão NÃO
    const noButton = this.add.container(width / 2 + 100, height / 2 + 100);

    // Fundo do botão NÃO
    const noBtnBg = this.add.graphics();
    noBtnBg.fillStyle(this.colors.accent, 0.8);
    noBtnBg.fillRoundedRect(-80, -25, 160, 50, 10);

    noBtnBg.lineStyle(2, 0xffffff, 0.9);
    noBtnBg.strokeRoundedRect(-80, -25, 160, 50, 10);

    // Texto do botão NÃO
    const noBtnText = this.add
      .text(0, 0, "CANCELAR", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    noButton.add([noBtnBg, noBtnText]);

    // Interatividade dos botões
    yesButton.setSize(160, 50);
    yesButton.setInteractive({ useHandCursor: true });

    noButton.setSize(160, 50);
    noButton.setInteractive({ useHandCursor: true });

    // Evento hover botão SIM
    yesButton.on("pointerover", () => {
      yesBtnBg.clear();
      yesBtnBg.fillStyle(0xffffff, 0.9);
      yesBtnBg.fillRoundedRect(-80, -25, 160, 50, 10);

      yesBtnBg.lineStyle(2, this.colors.positive, 1);
      yesBtnBg.strokeRoundedRect(-80, -25, 160, 50, 10);

      yesBtnText.setColor("#000000");

      this.tweens.add({
        targets: yesButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
    });

    yesButton.on("pointerout", () => {
      yesBtnBg.clear();
      yesBtnBg.fillStyle(this.colors.positive, 0.8);
      yesBtnBg.fillRoundedRect(-80, -25, 160, 50, 10);

      yesBtnBg.lineStyle(2, 0xffffff, 0.9);
      yesBtnBg.strokeRoundedRect(-80, -25, 160, 50, 10);

      yesBtnText.setColor("#FFFFFF");

      this.tweens.add({
        targets: yesButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    // Evento hover botão NÃO
    noButton.on("pointerover", () => {
      noBtnBg.clear();
      noBtnBg.fillStyle(0xffffff, 0.9);
      noBtnBg.fillRoundedRect(-80, -25, 160, 50, 10);

      noBtnBg.lineStyle(2, this.colors.accent, 1);
      noBtnBg.strokeRoundedRect(-80, -25, 160, 50, 10);

      noBtnText.setColor("#000000");

      this.tweens.add({
        targets: noButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
    });

    noButton.on("pointerout", () => {
      noBtnBg.clear();
      noBtnBg.fillStyle(this.colors.accent, 0.8);
      noBtnBg.fillRoundedRect(-80, -25, 160, 50, 10);

      noBtnBg.lineStyle(2, 0xffffff, 0.9);
      noBtnBg.strokeRoundedRect(-80, -25, 160, 50, 10);

      noBtnText.setColor("#FFFFFF");

      this.tweens.add({
        targets: noButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    // Eventos de clique
    yesButton.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: yesButton,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Animar saída e executar callback
          this.animateConfirmationExit(confirmContainer, confirmCallback);
        },
      });
    });

    noButton.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: noButton,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Animar saída sem callback
          this.animateConfirmationExit(confirmContainer);
        },
      });
    });

    // Adicionar elementos ao container
    confirmContainer.add([bgOverlay, confirmPanel, alertIcon, confirmTitle, confirmMessage, yesButton, noButton]);

    // Tornar o overlay interativo para impedir cliques nos objetos por baixo
    bgOverlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

    // Adicionar à UI
    this.uiContainer.add(confirmContainer);

    // Animar entrada
    alertIcon.setScale(0);
    confirmTitle.setAlpha(0);
    confirmMessage.setAlpha(0);
    yesButton.setAlpha(0);
    noButton.setAlpha(0);

    // Sequência de animações
    this.tweens.add({
      targets: alertIcon,
      scale: 1,
      duration: 400,
      ease: "Back.easeOut",
      onComplete: () => {
        // Títulos
        this.tweens.add({
          targets: [confirmTitle, confirmMessage],
          alpha: 1,
          duration: 300,
          ease: "Sine.easeOut",
          onComplete: () => {
            // Botões
            this.tweens.add({
              targets: [yesButton, noButton],
              alpha: 1,
              duration: 300,
              ease: "Sine.easeOut",
            });
          },
        });
      },
    });
  };

  /**
   * Anima a saída do diálogo de confirmação
   * @param {Phaser.GameObjects.Container} container - Container do diálogo
   * @param {Function} callback - Callback opcional ao fechar
   */
  jardimMission.prototype.animateConfirmationExit = function (container, callback) {
    // Animar saída
    this.tweens.add({
      targets: container,
      alpha: 0,
      scale: 0.8,
      duration: 300,
      ease: "Back.easeIn",
      onComplete: () => {
        container.destroy();

        // Executar callback se fornecido
        if (callback) callback();
      },
    });
  };

  /**
   * Salva o progresso da missão
   */
  jardimMission.prototype.saveProgress = function () {
    try {
      // Verificar se o SaveManager existe
      if (window.saveManager) {
        // Salvar progresso
        window.saveManager.saveMissionProgress("jardim", {
          started: this.missionStarted,
          completed: this.missionCompleted,
          currentTask: this.currentTask,
          timestamp: Date.now(),
        });

        // Se a missão foi completada, registrar no SaveManager
        if (this.missionCompleted) {
          window.saveManager.completeMission("jardim");
        }
      } else {
        // Salvar no localStorage como fallback
        const progress = {
          started: this.missionStarted,
          completed: this.missionCompleted,
          currentTask: this.currentTask,
          timestamp: Date.now(),
        };

        localStorage.setItem("jardimMissionProgress", JSON.stringify(progress));
      }

      console.log("✅ Progresso da missão salvo com sucesso!");

      // Mostrar notificação se não estiver saindo da cena
      if (this.scene.isActive()) {
        this.showNotification("Progresso salvo com sucesso!", "info", 2000);
      }
    } catch (e) {
      console.error("❌ Erro ao salvar progresso da missão:", e);
    }
  };

  console.log("✅ Módulo de Interface aprimorado carregado");
})();
