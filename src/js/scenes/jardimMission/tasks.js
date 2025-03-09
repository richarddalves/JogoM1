/**
 * Módulo de tarefas para a missão do jardim
 */
(function () {
  /**
   * Configura os eventos da cena
   */
  jardimMission.prototype.setupEvents = function () {
    // Configurar teclas de atalho
    this.input.keyboard.on("keydown-ESC", () => {
      this.togglePauseMenu();
    });

    this.input.keyboard.on("keydown-M", () => {
      this.togglePauseMenu();
    });

    // Evento para completar a missão (usado em testes)
    this.events.on("completeMission", () => {
      this.completeMission();
    });

    // Evento para progresso da missão
    this.events.on("missionProgress", (taskId) => {
      this.progressMission(taskId);
    });

    // Eventos de verificação de proximidade
    this.time.addEvent({
      delay: 1000,
      callback: this.checkMissionTriggers,
      callbackScope: this,
      loop: true,
    });
  };

  /**
   * Verifica gatilhos para progresso da missão
   */
  jardimMission.prototype.checkMissionTriggers = function () {
    // Verificar se a missão já foi concluída
    if (this.missionCompleted) return;

    // Verificar proximidade com professor se a missão não foi iniciada
    if (!this.missionStarted && this.professor && this.professor.sprite && this.player && this.player.sprite) {
      const distance = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, this.professor.sprite.x, this.professor.sprite.y);

      if (distance < 150) {
        // Mostrar dica sobre interação
        this.showInteractionHint("Pressione E para falar com o professor");
      }
    }
  };

  /**
   * Mostra uma dica de interação
   * @param {string} message - Mensagem de dica
   */
  jardimMission.prototype.showInteractionHint = function (message) {
    // Verificar se já existe uma dica ativa
    if (this.interactionHint) return;

    // Criar texto da dica
    this.interactionHint = this.add
      .text(this.cameras.main.width / 2, 100, message, {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
        stroke: this.colors.secondary,
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.interactionHint.setScrollFactor(0);
    this.interactionHint.setDepth(500);
    this.interactionHint.setAlpha(0);

    // Animar entrada da dica
    this.tweens.add({
      targets: this.interactionHint,
      alpha: 1,
      y: 80,
      duration: 500,
      ease: "Back.easeOut",
      onComplete: () => {
        // Configurar remoção automática após alguns segundos
        this.time.delayedCall(3000, () => {
          if (this.interactionHint) {
            this.tweens.add({
              targets: this.interactionHint,
              alpha: 0,
              y: 60,
              duration: 500,
              ease: "Back.easeIn",
              onComplete: () => {
                if (this.interactionHint) {
                  this.interactionHint.destroy();
                  this.interactionHint = null;
                }
              },
            });
          }
        });
      },
    });
  };

  /**
   * Atualiza o progresso das tarefas da missão
   */
  jardimMission.prototype.updateTasks = function (time, delta) {
    // Verificar estado atual da missão
    if (this.missionCompleted) {
      this.checkMissionCompletionActions();
    }
  };

  /**
   * Verifica ações a serem tomadas após conclusão da missão
   */
  jardimMission.prototype.checkMissionCompletionActions = function () {
    // Verificar se deve mostrar botão para retornar ao hub de missões
    if (!this.returnToHubButton && this.missionCompleted) {
      this.createReturnToHubButton();
    }
  };

  /**
   * Cria botão para retornar ao hub de missões após conclusão
   */
  jardimMission.prototype.createReturnToHubButton = function () {
    // Verificar se o botão já existe
    if (this.returnToHubButton) return;

    // Criar botão flutuante no canto inferior direito
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fundo do botão
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(this.colors.primary, 0.8);
    buttonBg.fillRoundedRect(width - 250, height - 70, 230, 50, 10);
    buttonBg.lineStyle(2, this.colors.secondary, 0.9);
    buttonBg.strokeRoundedRect(width - 250, height - 70, 230, 50, 10);
    buttonBg.setScrollFactor(0);
    buttonBg.setDepth(400);

    // Texto do botão
    const buttonText = this.add
      .text(width - 135, height - 45, "VOLTAR AO HUB DE MISSÕES", {
        fontFamily: this.fontFamily,
        fontSize: "14px",
        color: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    buttonText.setScrollFactor(0);
    buttonText.setDepth(401);

    // Tornar o botão interativo
    buttonBg
      .setInteractive(new Phaser.Geom.Rectangle(width - 250, height - 70, 230, 50), Phaser.Geom.Rectangle.Contains)
      .on("pointerdown", () => {
        this.exitToMissionsHub();
      })
      .on("pointerover", () => {
        buttonBg.clear();
        buttonBg.fillStyle(this.colors.secondary, 0.8);
        buttonBg.fillRoundedRect(width - 250, height - 70, 230, 50, 10);
        buttonBg.lineStyle(2, this.colors.primary, 0.9);
        buttonBg.strokeRoundedRect(width - 250, height - 70, 230, 50, 10);
        buttonText.setColor("#000000");
      })
      .on("pointerout", () => {
        buttonBg.clear();
        buttonBg.fillStyle(this.colors.primary, 0.8);
        buttonBg.fillRoundedRect(width - 250, height - 70, 230, 50, 10);
        buttonBg.lineStyle(2, this.colors.secondary, 0.9);
        buttonBg.strokeRoundedRect(width - 250, height - 70, 230, 50, 10);
        buttonText.setColor("#FFFFFF");
      });

    // Armazenar referência ao botão
    this.returnToHubButton = {
      bg: buttonBg,
      text: buttonText,
    };

    // Animar entrada do botão
    const initialY = height + 50;
    buttonBg.y = initialY;
    buttonText.y = initialY + 25;

    this.tweens.add({
      targets: [buttonBg, buttonText],
      y: "-=120",
      duration: 800,
      ease: "Back.easeOut",
      delay: 1000,
    });
  };

  /**
   * Progride a missão para a próxima tarefa
   * @param {string} taskId - Identificador da tarefa
   */
  jardimMission.prototype.progressMission = function (taskId) {
    // Implementar lógica para progresso de tarefas específicas
    switch (taskId) {
      case "find_professor":
        // Marcar que o jogador encontrou o professor
        this.professorFound = true;

        // Avançar para próxima tarefa
        this.currentTask = 1;

        // Mostrar notificação
        this.showTaskNotification("Tarefa concluída: Encontrou o professor!");

        // Atualizar objetivo
        this.updateObjectiveIndicator();
        break;

      case "explain_problem":
        // Marcar que o jogador explicou o problema
        this.problemExplained = true;

        // Avançar para próxima tarefa
        this.currentTask = 2;

        // Mostrar notificação
        this.showTaskNotification("Tarefa concluída: Explicou os problemas com o grupo de WhatsApp!");

        // Atualizar objetivo
        this.updateObjectiveIndicator();
        break;

      case "complete_mission":
        // Completar a missão
        this.completeMission();
        break;
    }
  };

  /**
   * Completa a missão
   */
  jardimMission.prototype.completeMission = function () {
    // Verificar se já está completa
    if (this.missionCompleted) return;

    // Marcar como completa
    this.missionCompleted = true;

    // Mostrar notificação
    this.showTaskNotification("Missão concluída com sucesso! Volte ao Hub de Missões quando quiser.");

    // Salvar progresso
    this.saveProgress();

    // Dar pontos ao jogador
    this.addPoints(100);

    // Atualizar objetivo
    this.updateObjectiveIndicator();

    // Criar botão para voltar ao hub
    this.createReturnToHubButton();

    // Completar missão no SaveManager (se disponível)
    try {
      if (window.saveManager) {
        window.saveManager.completeMission("jardim");
      }
    } catch (e) {
      console.warn("Erro ao completar missão no SaveManager:", e);
    }
  };

  /**
   * Configura tarefas da missão
   */
  jardimMission.prototype.setupMissionTasks = function () {
    // Definir tarefas da missão
    this.missionTasks = [
      {
        id: "find_professor",
        description: "Encontre o professor no jardim da escola",
        completed: false,
      },
      {
        id: "explain_problem",
        description: "Explique os problemas com o grupo de WhatsApp",
        completed: false,
      },
      {
        id: "complete_mission",
        description: "Convença o professor a usar plataformas oficiais",
        completed: false,
      },
    ];
  };

  console.log("✅ Módulo de Tarefas carregado");
})();
