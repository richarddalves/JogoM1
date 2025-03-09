/**
 * Funções relacionadas à interface de usuário da Missão Escolar
 */
(function () {
  /**
   * Cria a interface de usuário da missão
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createUI = function (width, height) {
    // Container principal para UI
    this.uiElements.container = this.add.container(0, 0);
    this.uiElements.container.setDepth(100);

    // Criar título da missão (inicialmente)
    this.createMissionTitle(width);

    // Área para objetivos da missão
    this.createTaskPanel(width, height);

    // Contador de tempo se necessário
    this.createTimeDisplay(width);

    // Área para dicas e feedback
    this.createFeedbackArea(width, height);

    // Criar botão de menu
    this.createMenuButton(width, height);

    // Criar painel de diálogo (inicialmente invisível)
    this.createDialogPanel(width, height);

    // Criar área de notificações
    this.createNotificationArea(width, height);

    // Criar tela de pausa (inicialmente invisível)
    this.createPauseScreen(width, height);
  };

  /**
   * Cria título da missão
   * @param {number} width - Largura da tela
   */
  schoolMission.prototype.createMissionTitle = function (width) {
    // Container para o título
    const titleContainer = this.add.container(width / 2, 50);

    // Fundo do título
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x111927, 0.8);
    titleBg.fillRoundedRect(-200, -25, 400, 50, 10);

    // Borda com gradiente
    titleBg.lineStyle(2, 0x0d84ff, 1);
    titleBg.strokeRoundedRect(-200, -25, 400, 50, 10);

    // Texto do título
    const titleText = this.add
      .text(0, 0, "ALERTA NA ESCOLA", {
        fontFamily: this.fontFamily,
        fontSize: "24px",
        color: "#ffffff",
        fontWeight: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    titleContainer.add([titleBg, titleText]);

    // Animação de entrada
    titleContainer.setAlpha(0);
    titleContainer.y = 0;

    this.tweens.add({
      targets: titleContainer,
      alpha: 1,
      y: 50,
      duration: 1000,
      ease: "Back.easeOut",
      delay: 500,
    });

    // Animação de saída após alguns segundos
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: titleContainer,
        alpha: 0,
        y: 0,
        duration: 500,
        ease: "Back.easeIn",
        onComplete: () => {
          titleContainer.destroy();
        },
      });
    });

    // Adicionar ao container principal
    this.uiElements.container.add(titleContainer);
    this.uiElements.titleContainer = titleContainer;
  };

  /**
   * Cria painel de tarefas/objetivos
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createTaskPanel = function (width, height) {
    // Container para o painel de tarefas
    const taskContainer = this.add.container(20, 100);

    // Fundo do painel
    const taskBg = this.add.graphics();
    taskBg.fillStyle(0x111927, 0.7);
    taskBg.fillRoundedRect(0, 0, 300, 200, 10);

    // Borda do painel
    taskBg.lineStyle(2, 0x0d84ff, 1);
    taskBg.strokeRoundedRect(0, 0, 300, 200, 10);

    // Título do painel
    const taskTitle = this.add
      .text(150, 20, "OBJETIVOS", {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    taskContainer.add([taskBg, taskTitle]);

    // Container para as tarefas (será preenchido dinamicamente)
    const taskListContainer = this.add.container(20, 50);
    taskContainer.add(taskListContainer);

    // Adicionar ao container principal
    this.uiElements.container.add(taskContainer);

    // Salvar referências
    this.uiElements.taskContainer = taskContainer;
    this.uiElements.taskListContainer = taskListContainer;

    // Inicialmente oculto, vai aparecer após a introdução
    taskContainer.setAlpha(0);
  };

  /**
   * Atualiza a lista de tarefas no painel
   * @param {Array} tasks - Lista de tarefas
   */
  schoolMission.prototype.updateTaskList = function (tasks) {
    if (!this.uiElements.taskListContainer) return;

    // Limpar container
    this.uiElements.taskListContainer.removeAll(true);

    // Adicionar cada tarefa
    tasks.forEach((task, index) => {
      // Container para item da tarefa
      const taskItemContainer = this.add.container(0, index * 40);

      // Ícone de status
      const statusIcon = this.add
        .image(0, 0, task.completed ? "task_complete" : "task_incomplete")
        .setScale(0.4)
        .setOrigin(0, 0.5);

      // Texto da tarefa
      const taskText = this.add
        .text(30, 0, task.text, {
          fontFamily: this.fontFamily,
          fontSize: "16px",
          color: task.completed ? "#4caf50" : "#ffffff",
          wordWrap: { width: 230 },
        })
        .setOrigin(0, 0.5);

      // Adicionar ao container do item
      taskItemContainer.add([statusIcon, taskText]);

      // Adicionar ao container da lista
      this.uiElements.taskListContainer.add(taskItemContainer);
    });

    // Mostrar o painel de tarefas se estiver oculto
    if (this.uiElements.taskContainer.alpha < 1) {
      this.tweens.add({
        targets: this.uiElements.taskContainer,
        alpha: 1,
        duration: 500,
        ease: "Power2",
      });
    }
  };

  /**
   * Cria exibição de tempo (opcional)
   * @param {number} width - Largura da tela
   */
  schoolMission.prototype.createTimeDisplay = function (width) {
    // Container para tempo
    const timeContainer = this.add.container(width - 20, 20);

    // Fundo do tempo
    const timeBg = this.add.graphics();
    timeBg.fillStyle(0x111927, 0.7);
    timeBg.fillRoundedRect(-120, -20, 120, 40, 10);

    // Borda
    timeBg.lineStyle(2, 0x0d84ff, 1);
    timeBg.strokeRoundedRect(-120, -20, 120, 40, 10);

    // Texto de tempo
    const timeText = this.add
      .text(-60, 0, "00:00", {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    timeContainer.add([timeBg, timeText]);

    // Adicionar ao container principal
    this.uiElements.container.add(timeContainer);

    // Salvar referência
    this.uiElements.timeContainer = timeContainer;
    this.uiElements.timeText = timeText;

    // Inicialmente oculto (opcional se esta missão não usar tempo)
    timeContainer.setVisible(false);
  };

  /**
   * Cria área para dicas e feedback
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createFeedbackArea = function (width, height) {
    // Container para feedback
    const feedbackContainer = this.add.container(width / 2, height - 100);

    // Fundo do feedback (inicialmente invisível)
    const feedbackBg = this.add.graphics();
    feedbackBg.fillStyle(0x111927, 0.9);
    feedbackBg.fillRoundedRect(-300, -50, 600, 100, 10);

    // Borda
    feedbackBg.lineStyle(2, 0x0d84ff, 1);
    feedbackBg.strokeRoundedRect(-300, -50, 600, 100, 10);

    // Texto de feedback
    const feedbackText = this.add
      .text(0, 0, "", {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 550 },
      })
      .setOrigin(0.5);

    // Adicionar ao container
    feedbackContainer.add([feedbackBg, feedbackText]);

    // Adicionar ao container principal
    this.uiElements.container.add(feedbackContainer);

    // Salvar referência
    this.uiElements.feedbackContainer = feedbackContainer;
    this.uiElements.feedbackText = feedbackText;

    // Inicialmente oculto
    feedbackContainer.setVisible(false);
  };

  /**
   * Mostra feedback temporário
   * @param {string} text - Texto de feedback
   * @param {number} duration - Duração em ms (padrão: 3000ms)
   */
  schoolMission.prototype.showFeedback = function (text, duration = 3000) {
    if (!this.uiElements.feedbackContainer || !this.uiElements.feedbackText) return;

    // Atualizar texto
    this.uiElements.feedbackText.setText(text);

    // Mostrar o container
    this.uiElements.feedbackContainer.setVisible(true);
    this.uiElements.feedbackContainer.setAlpha(0);

    // Animar entrada
    this.tweens.add({
      targets: this.uiElements.feedbackContainer,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        // Definir temporizador para ocultá-lo
        this.time.delayedCall(duration, () => {
          this.tweens.add({
            targets: this.uiElements.feedbackContainer,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.uiElements.feedbackContainer.setVisible(false);
            },
          });
        });
      },
    });
  };

  /**
   * Cria botão de menu
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createMenuButton = function (width, height) {
    // Container para o botão
    const buttonContainer = this.add.container(width - 50, 50);

    // Fundo do botão
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x111927, 0.8);
    buttonBg.fillCircle(0, 0, 25);

    // Borda
    buttonBg.lineStyle(2, 0x0d84ff, 1);
    buttonBg.strokeCircle(0, 0, 25);

    // Ícone de menu (três linhas)
    const line1 = this.add.rectangle(-10, -8, 20, 3, 0xffffff);
    const line2 = this.add.rectangle(-10, 0, 20, 3, 0xffffff);
    const line3 = this.add.rectangle(-10, 8, 20, 3, 0xffffff);

    // Adicionar ao container
    buttonContainer.add([buttonBg, line1, line2, line3]);

    // Tornar interativo
    buttonContainer.setInteractive(new Phaser.Geom.Circle(0, 0, 25), Phaser.Geom.Circle.Contains);

    // Eventos de hover e clique
    buttonContainer.on("pointerover", () => {
      this.tweens.add({
        targets: buttonContainer,
        scale: 1.1,
        duration: 100,
      });
    });

    buttonContainer.on("pointerout", () => {
      this.tweens.add({
        targets: buttonContainer,
        scale: 1,
        duration: 100,
      });
    });

    buttonContainer.on("pointerdown", () => {
      this.togglePauseMenu();
    });

    // Adicionar ao container principal
    this.uiElements.container.add(buttonContainer);

    // Salvar referência
    this.uiElements.menuButton = buttonContainer;
  };

  /**
   * Cria painel de diálogo
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createDialogPanel = function (width, height) {
    // Container para diálogo
    const dialogContainer = this.add.container(width / 2, height - 150);

    // Fundo do diálogo
    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x111927, 0.9);
    dialogBg.fillRoundedRect(-400, -100, 800, 200, 15);

    // Borda
    dialogBg.lineStyle(3, 0x0d84ff, 1);
    dialogBg.strokeRoundedRect(-400, -100, 800, 200, 15);

    // Área de nome do personagem
    const nameBox = this.add.graphics();
    nameBox.fillStyle(0x0d84ff, 1);
    nameBox.fillRoundedRect(-390, -120, 200, 40, { tl: 15, tr: 15, bl: 0, br: 0 });

    // Texto do nome
    const nameText = this.add
      .text(-290, -100, "", {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Texto do diálogo
    const dialogText = this.add.text(-380, -70, "", {
      fontFamily: this.fontFamily,
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: 760 },
      lineSpacing: 8,
    });

    // Indicador de continuar
    const continueIndicator = this.add
      .text(350, 80, "▼", {
        fontFamily: this.fontFamily,
        fontSize: "24px",
        color: "#39f5e2",
      })
      .setOrigin(0.5);

    // Animar indicador
    this.tweens.add({
      targets: continueIndicator,
      y: 70,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Opções de diálogo (container)
    const optionsContainer = this.add.container(0, 30);

    // Adicionar ao container de diálogo
    dialogContainer.add([dialogBg, nameBox, nameText, dialogText, continueIndicator, optionsContainer]);

    // Adicionar ao container principal
    this.uiElements.container.add(dialogContainer);

    // Salvar referências
    this.uiElements.dialogContainer = dialogContainer;
    this.uiElements.dialogText = dialogText;
    this.uiElements.nameText = nameText;
    this.uiElements.continueIndicator = continueIndicator;
    this.uiElements.optionsContainer = optionsContainer;

    // Inicialmente oculto
    dialogContainer.setVisible(false);

    // Tornar clicável para avançar
    dialogBg.setInteractive(new Phaser.Geom.Rectangle(-400, -100, 800, 200), Phaser.Geom.Rectangle.Contains);

    dialogBg.on("pointerdown", () => {
      this.advanceDialog();
    });
  };

  /**
   * Cria área de notificações
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createNotificationArea = function (width, height) {
    // Container para notificações (no topo da tela)
    const notificationContainer = this.add.container(width / 2, 50);

    // Adicionar ao container principal
    this.uiElements.container.add(notificationContainer);

    // Salvar referência
    this.uiElements.notificationContainer = notificationContainer;
  };

  /**
   * Mostra uma notificação temporária
   * @param {string} text - Texto da notificação
   * @param {string} type - Tipo da notificação (info, success, warning, error)
   * @param {number} duration - Duração em ms (padrão: 3000ms)
   */
  schoolMission.prototype.showNotification = function (text, type = "info", duration = 3000) {
    if (!this.uiElements.notificationContainer) return;

    // Determinar cor baseada no tipo
    let color;
    switch (type) {
      case "success":
        color = 0x4caf50;
        break;
      case "warning":
        color = 0xffc107;
        break;
      case "error":
        color = 0xff3a3a;
        break;
      case "info":
      default:
        color = 0x0d84ff;
        break;
    }

    // Container para esta notificação
    const notification = this.add.container(0, -50);

    // Fundo da notificação
    const notifBg = this.add.graphics();
    notifBg.fillStyle(0x111927, 0.9);
    notifBg.fillRoundedRect(-200, -20, 400, 40, 10);

    // Borda
    notifBg.lineStyle(2, color, 1);
    notifBg.strokeRoundedRect(-200, -20, 400, 40, 10);

    // Texto
    const notifText = this.add
      .text(0, 0, text, {
        fontFamily: this.fontFamily,
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    notification.add([notifBg, notifText]);

    // Adicionar à área de notificações
    this.uiElements.notificationContainer.add(notification);

    // Animar entrada
    this.tweens.add({
      targets: notification,
      y: 0,
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Programar remoção
        this.time.delayedCall(duration, () => {
          this.tweens.add({
            targets: notification,
            y: -50,
            alpha: 0,
            duration: 300,
            ease: "Back.easeIn",
            onComplete: () => {
              notification.destroy();
            },
          });
        });
      },
    });
  };

  /**
   * Cria tela de pausa
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createPauseScreen = function (width, height) {
    // Container para tela de pausa
    const pauseContainer = this.add.container(width / 2, height / 2);

    // Overlay escuro
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0.5);

    // Painel de pausa
    const pauseBg = this.add.graphics();
    pauseBg.fillStyle(0x111927, 0.9);
    pauseBg.fillRoundedRect(-200, -250, 400, 500, 20);

    // Borda
    pauseBg.lineStyle(3, 0x0d84ff, 1);
    pauseBg.strokeRoundedRect(-200, -250, 400, 500, 20);

    // Título
    const pauseTitle = this.add
      .text(0, -200, "JOGO PAUSADO", {
        fontFamily: this.fontFamily,
        fontSize: "28px",
        color: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Botões
    const resumeButton = this.createButton(0, -100, "CONTINUAR", 180, 50, () => {
      this.togglePauseMenu(false);
    });

    const restartButton = this.createButton(0, 0, "REINICIAR MISSÃO", 180, 50, () => {
      this.restartMission();
    });

    const hubButton = this.createButton(0, 100, "VOLTAR AO HUB", 180, 50, () => {
      this.goToMissionHub();
    });

    const quitButton = this.createButton(
      0,
      200,
      "SAIR DO JOGO",
      180,
      50,
      () => {
        this.exitToMainMenu();
      },
      0xff3a3a
    );

    // Adicionar ao container
    pauseContainer.add([overlay, pauseBg, pauseTitle, resumeButton, restartButton, hubButton, quitButton]);

    // Adicionar ao container principal
    this.uiElements.container.add(pauseContainer);

    // Salvar referência
    this.uiElements.pauseContainer = pauseContainer;

    // Inicialmente oculto
    pauseContainer.setVisible(false);
  };

  /**
   * Cria um botão customizado
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {number} width - Largura do botão
   * @param {number} height - Altura do botão
   * @param {Function} callback - Função de callback
   * @param {number} color - Cor do botão (opcional)
   * @returns {Phaser.GameObjects.Container} - Container do botão
   */
  schoolMission.prototype.createButton = function (x, y, text, width, height, callback, color = 0x0d84ff) {
    // Container do botão
    const buttonContainer = this.add.container(x, y);

    // Fundo do botão
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(color, 1);
    buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

    // Borda
    buttonBg.lineStyle(2, 0xffffff, 0.8);
    buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

    // Texto
    const buttonText = this.add
      .text(0, 0, text, {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    buttonContainer.add([buttonBg, buttonText]);

    // Tornar interativo
    buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    // Eventos de hover e clique
    buttonContainer.on("pointerover", () => {
      buttonBg.clear();
      buttonBg.fillStyle(color, 0.8);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
      buttonBg.lineStyle(2, 0xffffff, 1);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

      this.tweens.add({
        targets: buttonContainer,
        scale: 1.05,
        duration: 100,
      });
    });

    buttonContainer.on("pointerout", () => {
      buttonBg.clear();
      buttonBg.fillStyle(color, 1);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
      buttonBg.lineStyle(2, 0xffffff, 0.8);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

      this.tweens.add({
        targets: buttonContainer,
        scale: 1,
        duration: 100,
      });
    });

    buttonContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: buttonContainer,
        scale: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });

      // Som de clique
      if (this.sound.get("click_sound")) {
        this.sound.play("click_sound", { volume: 0.5 });
      }
    });

    return buttonContainer;
  };

  /**
   * Alterna visibilidade do menu de pausa
   * @param {boolean} visible - Se o menu deve estar visível (opcional)
   */
  schoolMission.prototype.togglePauseMenu = function (visible = null) {
    if (!this.uiElements.pauseContainer) return;

    // Se um valor específico não for fornecido, alternar o estado atual
    if (visible === null) {
      visible = !this.uiElements.pauseContainer.visible;
    }

    // Atualizar flag de pausa
    this.isPaused = visible;

    // Parar/retomar a física do jogo
    if (visible) {
      this.physics.pause();
    } else {
      this.physics.resume();
    }

    // Animar abertura/fechamento
    if (visible) {
      this.uiElements.pauseContainer.setVisible(true);
      this.uiElements.pauseContainer.setAlpha(0);
      this.uiElements.pauseContainer.getAt(0).setAlpha(0); // overlay

      this.tweens.add({
        targets: [this.uiElements.pauseContainer, this.uiElements.pauseContainer.getAt(0)],
        alpha: 1,
        duration: 300,
        ease: "Power2",
      });
    } else {
      this.tweens.add({
        targets: [this.uiElements.pauseContainer, this.uiElements.pauseContainer.getAt(0)],
        alpha: 0,
        duration: 300,
        ease: "Power2",
        onComplete: () => {
          this.uiElements.pauseContainer.setVisible(false);
        },
      });
    }
  };

  /**
   * Reinicia a missão atual
   */
  schoolMission.prototype.restartMission = function () {
    // Fade out
    this.cameras.main.fadeOut(this.fadeSpeed);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      try {
        this.scene.restart();
      } catch (e) {
        console.error("Erro ao reiniciar missão:", e);
        this.scene.start("missionsHub");
      }
    });
  };

  /**
   * Sai para o menu principal
   */
  schoolMission.prototype.exitToMainMenu = function () {
    // Fade out
    this.cameras.main.fadeOut(this.fadeSpeed);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      try {
        this.scene.start("mainMenu");
      } catch (e) {
        console.error("Erro ao voltar ao menu principal:", e);
      }
    });
  };

  /**
   * Cria a HUD do agente (mesmo sistema usado em outras cenas)
   */
  schoolMission.prototype.createAgentHUD = function () {
    try {
      // Verificar se a classe AgentHUD existe
      if (typeof AgentHUD === "function") {
        // Criar instância da HUD
        this.agentHUD = new AgentHUD(this);
        console.log("✅ HUD do agente criada com sucesso");
      } else {
        console.warn("⚠️ AgentHUD não definida, HUD não será criada");
      }
    } catch (e) {
      console.error("❌ Erro ao criar HUD do agente:", e);
    }
  };

  /**
   * Mostra a tela de introdução da missão
   */
  schoolMission.prototype.showMissionIntro = function () {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Container para intro
    const introContainer = this.add.container(width / 2, height / 2);
    introContainer.setDepth(200);

    // Overlay escuro
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0.5);

    // Painel de intro
    const introBg = this.add.graphics();
    introBg.fillStyle(0x111927, 0.9);
    introBg.fillRoundedRect(-400, -250, 800, 500, 20);

    // Borda
    introBg.lineStyle(3, 0x0d84ff, 1);
    introBg.strokeRoundedRect(-400, -250, 800, 500, 20);

    // Título
    const introTitle = this.add
      .text(0, -200, "MISSÃO: ALERTA NA ESCOLA", {
        fontFamily: this.fontFamily,
        fontSize: "32px",
        color: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Descrição da missão
    const introText = this.add
      .text(0, -50, "O professor Carlos quer criar um grupo de WhatsApp com todos os alunos para compartilhar informações sobre as aulas.\n\n" + "Como agente da AGPD, você deve investigar se isso está em conformidade com as leis de proteção de dados, já que os alunos são menores de idade.\n\n" + "Navegue pela escola, converse com o professor e alunos, e encontre uma solução adequada para esta situação.", {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 700 },
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    // Dicas
    const tipsText = this.add
      .text(0, 100, "Dicas:\n" + "- Use as teclas de seta ou WASD para mover o personagem\n" + "- Pressione E para interagir com pessoas e objetos\n" + "- Pressione ESPAÇO para avançar diálogos\n" + "- Pressione ESC para pausar o jogo", {
        fontFamily: this.fontFamily,
        fontSize: "16px",
        color: "#ffc107",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Botão de começar
    const startButton = this.createButton(0, 200, "INICIAR MISSÃO", 200, 50, () => {
      // Fechar introdução
      this.tweens.add({
        targets: introContainer,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          introContainer.destroy();

          // Mostrar painel de tarefas
          this.updateTaskList(this.tasks);
        },
      });
    });

    // Adicionar ao container
    introContainer.add([overlay, introBg, introTitle, introText, tipsText, startButton]);

    // Animar entrada
    introContainer.setAlpha(0);

    this.tweens.add({
      targets: introContainer,
      alpha: 1,
      duration: 500,
    });
  };

  /**
   * Mostra feedback para uma interação
   * @param {string} interactionId - ID da interação
   * @param {Object} properties - Propriedades adicionais
   */
  schoolMission.prototype.showInteractionFeedback = function (interactionId, properties) {
    // Determinar texto baseado no ID da interação
    let feedbackText = "";
    let notificationType = "info";

    switch (interactionId) {
      case "teacher_room":
        feedbackText = "Sala dos Professores. Talvez o Professor Carlos esteja aqui.";
        break;
      case "classroom":
        feedbackText = "Sala de Aula. Aqui é onde os alunos estudam.";
        break;
      case "notice_board":
        feedbackText = "Painel de Avisos. Há informações sobre eventos e regras da escola.";
        notificationType = "info";
        break;
      default:
        // Se tiver um nome customizado
        if (properties && properties.name) {
          feedbackText = properties.name;
        } else {
          feedbackText = "Você observa este local com atenção.";
        }
        break;
    }

    // Mostrar como notificação
    this.showNotification(feedbackText, notificationType);
  };

  /**
   * Mostra tela de conclusão da missão
   */
  schoolMission.prototype.showMissionCompleteScreen = function () {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Pausar o jogo
    this.physics.pause();
    this.dialogActive = true;

    // Container para tela de conclusão
    const completionContainer = this.add.container(width / 2, height / 2);
    completionContainer.setDepth(200);

    // Overlay escuro
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0.5);

    // Painel de conclusão
    const completionBg = this.add.graphics();
    completionBg.fillStyle(0x0d468a, 0.9);
    completionBg.fillRoundedRect(-400, -250, 800, 500, 20);

    // Borda
    completionBg.lineStyle(3, 0x39f5e2, 1);
    completionBg.strokeRoundedRect(-400, -250, 800, 500, 20);

    // Título
    const completionTitle = this.add
      .text(0, -200, "MISSÃO CONCLUÍDA!", {
        fontFamily: this.fontFamily,
        fontSize: "36px",
        color: "#ffffff",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Adicionar brilho ao título
    const titleGlow = this.add.graphics();
    titleGlow.fillStyle(0x39f5e2, 0.3);
    titleGlow.fillRoundedRect(-250, -220, 500, 40, 10);

    // Mensagem
    const messageText = this.add
      .text(0, -80, "Parabéns, Agente! Você resolveu com sucesso o problema do grupo de WhatsApp na escola.\n\n" + "Foram identificados os seguintes problemas:\n" + "• Os alunos são menores de idade\n" + "• O compartilhamento de números pessoais sem consentimento não é permitido\n" + "• Plataformas não aprovadas pelo MEC não devem ser usadas para dados escolares\n\n" + "Sua solução de utilizar uma plataforma oficial da instituição foi a ideal para proteger os dados dos alunos.", {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 700 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Pontos ganhos
    const pointsText = this.add
      .text(0, 100, "+ 100 PONTOS", {
        fontFamily: this.fontFamily,
        fontSize: "28px",
        color: "#4caf50",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Adicionar tween de pulso aos pontos
    this.tweens.add({
      targets: pointsText,
      scale: { from: 1, to: 1.1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Botões
    const hubButton = this.createButton(-150, 200, "CENTRAL DE MISSÕES", 220, 50, () => {
      // Salvar progresso antes de sair
      if (window.saveManager) {
        window.saveManager.completeMission("school_alert");
        window.saveManager.addPoints(100);
      }

      this.goToMissionHub();
    });

    const nextButton = this.createButton(150, 200, "PRÓXIMA MISSÃO", 220, 50, () => {
      // Salvar progresso antes de sair
      if (window.saveManager) {
        window.saveManager.completeMission("school_alert");
        window.saveManager.addPoints(100);
      }

      // Ir para a próxima missão (a ser implementada)
      this.cameras.main.fadeOut(this.fadeSpeed);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        try {
          this.scene.start("schoolTrip");
        } catch (e) {
          console.error("Erro ao navegar para próxima missão:", e);
          this.scene.start("missionsHub");
        }
      });
    });

    // Adicionar ao container
    completionContainer.add([overlay, completionBg, titleGlow, completionTitle, messageText, pointsText, hubButton, nextButton]);

    // Animar entrada
    completionContainer.setAlpha(0);

    this.tweens.add({
      targets: completionContainer,
      alpha: 1,
      duration: 500,
    });

    // Som de sucesso
    if (this.sound.get("success_sound")) {
      this.sound.play("success_sound", { volume: 0.7 });
    }
  };

  console.log("✅ Módulo de Interface da Missão Escolar carregado");
})();
