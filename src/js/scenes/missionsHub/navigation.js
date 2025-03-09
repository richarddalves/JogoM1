/**
 * Funções relacionadas à navegação entre missões e cenas do jogo
 */
(function () {
  /**
   * Configura eventos de navegação para o Hub de Missões
   */
  missionsHub.prototype.setupNavigationEvents = function () {
    // Adicionar key listeners para navegação com teclado
    const leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    const rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Navegar para missões anteriores
    leftKey.on("down", () => {
      if (this.missionIndex > 0 && !this.isTransitioning) {
        this.navigateMissions(-1);
      }
    });

    // Navegar para próximas missões
    rightKey.on("down", () => {
      if (this.missionIndex + 3 < this.missions.length && !this.isTransitioning) {
        this.navigateMissions(1);
      }
    });

    // Voltar ao menu principal
    escKey.on("down", () => {
      if (!this.isTransitioning) {
        this.returnToMainMenu();
      }
    });
  };

  /**
   * Navega entre grupos de missões
   * @param {number} direction - Direção da navegação (1 para frente, -1 para trás)
   */
  missionsHub.prototype.navigateMissions = function (direction) {
    // Verificar se já está em transição
    if (this.isTransitioning) return;

    // Marcar como em transição
    this.isTransitioning = true;

    // Validar movimento
    if (direction === 1 && this.missionIndex + 3 >= this.missions.length) {
      this.isTransitioning = false;
      return; // Não há mais missões a frente
    }

    if (direction === -1 && this.missionIndex <= 0) {
      this.isTransitioning = false;
      return; // Já está no início
    }

    // Som de navegação
    if (this.sound.get("select")) {
      this.sound.play("select", { volume: 0.4 });
    }

    // Calcular novo índice
    const newIndex = this.missionIndex + direction;

    // Efeito de transição dos cards
    const fadeDirection = direction === 1 ? -1 : 1;

    // Verificar se há cards para animar
    if (!this.missionCards || this.missionCards.length === 0) {
      this.missionIndex = newIndex;
      this.displayMissions();
      this.isTransitioning = false;
      return;
    }

    // Fade out dos cards atuais
    let cardsToAnimate = 0;
    let animationsCompleted = 0;

    // Contar quantos cards válidos existem para animar
    for (let i = 0; i < this.missionCards.length; i++) {
      const card = this.missionCards[i];
      if (card && card.container) {
        cardsToAnimate++;
      }
    }

    // Se não há cards válidos, apenas atualizar o índice e mostrar novos
    if (cardsToAnimate === 0) {
      this.missionIndex = newIndex;
      this.displayMissions();
      this.isTransitioning = false;
      return;
    }

    // Animar cada card individualmente
    for (let i = 0; i < this.missionCards.length; i++) {
      const card = this.missionCards[i];
      if (card && card.container) {
        this.tweens.add({
          targets: card.container,
          x: card.container.x + 300 * fadeDirection,
          alpha: 0,
          scale: 0.9,
          duration: 200,
          ease: "Power1",
          onComplete: () => {
            animationsCompleted++;
            // Quando todas as animações terminarem, mostrar novos cards
            if (animationsCompleted === cardsToAnimate) {
              this.missionIndex = newIndex;
              this.displayMissions();
              this.isTransitioning = false;
            }
          },
        });
      }
    }

    // Garantir que após 500ms a transição será concluída (segurança)
    this.time.delayedCall(500, () => {
      if (this.isTransitioning) {
        console.log("Forçando conclusão da transição após timeout");
        this.missionIndex = newIndex;
        this.displayMissions();
        this.isTransitioning = false;
      }
    });
  };

  /**
   * Inicia a missão selecionada
   * @param {Object} mission - Dados da missão a iniciar
   */
  missionsHub.prototype.startMission = function (mission) {
    if (!mission || !mission.unlocked || this.isTransitioning) return;

    // Marcar como em transição
    this.isTransitioning = true;

    console.log(`Iniciando missão: ${mission.title}`);

    // Som de seleção
    if (this.sound.get("select")) {
      this.sound.play("select", { volume: 0.6 });
    }

    // Verificar se a cena existe
    if (!this.doesSceneExist(mission.sceneKey)) {
      this.showNotAvailableMessage(mission);
      return;
    }

    // Efeito de flash na tela
    const flash = this.add.rectangle(0, 0, this.screenWidth, this.screenHeight, 0xffffff);
    flash.setOrigin(0);
    flash.setAlpha(0);
    flash.setDepth(1000);

    // Sequência de animação
    this.tweens.add({
      targets: flash,
      alpha: 0.7,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        flash.destroy();

        // Salvar para retornar depois
        localStorage.setItem("previousScene", "missionsHub");

        // Fade out para transição
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(450, () => {
          try {
            // Iniciar a cena correspondente
            this.scene.start(mission.sceneKey, { missionId: mission.id });
          } catch (e) {
            console.error(`Erro ao iniciar missão: ${e.message}`);
            this.cameras.main.fadeIn(400);
            this.showNotAvailableMessage(mission);
          }
        });
      },
    });

    // Segurança para garantir que a flag isTransitioning será resetada
    this.time.delayedCall(1000, () => {
      this.isTransitioning = false;
    });
  };

  /**
   * Exibe mensagem quando a missão não está disponível
   * @param {Object} mission - Missão que não está disponível
   */
  missionsHub.prototype.showNotAvailableMessage = function (mission) {
    // Resetar flag de transição
    this.isTransitioning = false;

    const width = this.screenWidth;
    const height = this.screenHeight;

    // Mostrar mensagem no centro da tela
    const messageBg = this.add.graphics();
    messageBg.fillStyle(0x333333, 0.9);
    messageBg.fillRoundedRect(width / 2 - 250, height / 2 - 75, 500, 150, 20);
    messageBg.lineStyle(2, 0xff5252);
    messageBg.strokeRoundedRect(width / 2 - 250, height / 2 - 75, 500, 150, 20);
    messageBg.setDepth(1000);

    const titleText = this.add
      .text(width / 2, height / 2 - 40, `Missão: ${mission.title}`, {
        fontSize: "20px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setDepth(1000);

    const messageText = this.add
      .text(width / 2, height / 2 + 10, "Esta missão está em desenvolvimento", {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0.5)
      .setDepth(1000);

    // Botão para fechar a mensagem
    const closeButton = this.createButton(
      width / 2,
      height / 2 + 60,
      "ENTENDI",
      () => {
        // Fazer a mensagem desaparecer
        this.tweens.add({
          targets: [messageBg, titleText, messageText, closeButton.container],
          alpha: 0,
          duration: 300,
          onComplete: () => {
            messageBg.destroy();
            titleText.destroy();
            messageText.destroy();
            closeButton.container.destroy();
          },
        });
      },
      {
        width: 120,
        height: 40,
        fontSize: 16,
        primaryColor: 0x990000,
        secondaryColor: 0xff3333,
      }
    );

    closeButton.container.setDepth(1000);

    // Armazenar elementos para limpeza posterior
    if (!this.errorMessages) this.errorMessages = [];
    this.errorMessages.push(messageBg, titleText, messageText, closeButton.container);
  };

  /**
   * Retorna ao menu principal
   */
  missionsHub.prototype.returnToMainMenu = function () {
    if (this.isTransitioning) return;

    // Marcar como em transição
    this.isTransitioning = true;

    console.log("Retornando ao menu principal");

    // Som de seleção
    if (this.sound.get("select")) {
      this.sound.play("select", { volume: 0.4 });
    }

    // Fade out para transição
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(650, () => {
      try {
        // Iniciar a cena do menu principal
        this.scene.start("mainMenu");
      } catch (e) {
        console.error(`Erro ao retornar ao menu: ${e.message}`);
        this.cameras.main.fadeIn(400);
        this.isTransitioning = false;
      }
    });

    // Segurança para garantir que a flag isTransitioning será resetada
    this.time.delayedCall(1000, () => {
      this.isTransitioning = false;
    });
  };

  /**
   * Recebe dados ao retornar de uma missão
   * @param {Object} data - Dados retornados da missão
   */
  missionsHub.prototype.handleMissionReturn = function (data) {
    if (!data) return;

    console.log("Retornando de missão:", data);

    // Verificar se a missão foi completada com sucesso
    if (data.completed && data.missionId) {
      // Calcular pontos ganhos (pode ser alterado com base no desempenho)
      const mission = this.missions.find((m) => m.id === data.missionId);
      if (!mission) {
        console.warn(`Missão com ID ${data.missionId} não encontrada`);
        return;
      }

      let earnedPoints = mission.points;

      // Considerar pontuação personalizada
      if (data.score !== undefined) {
        // Ajustar pontos com base no score (por exemplo, porcentagem de acertos)
        earnedPoints = Math.round(earnedPoints * (data.score / 100));
      }

      // Marcar missão como completada e salvar progresso
      const firstTime = this.completeMission(data.missionId, earnedPoints);

      // Mostrar mensagem de sucesso após pequeno delay para permitir carregamento completo
      this.time.delayedCall(300, () => {
        if (firstTime) {
          this.showCompletionMessage(data.missionId, earnedPoints);
        } else {
          // Mostrar mensagem de repetição se já completou antes
          this.showRepeatMessage(data.missionId);
        }

        // Atualizar a interface
        this.updateMissionStatus();
        this.displayMissions();
        this.updatePlayerInfoDisplay();
      });
    }

    // Garantir que não estamos em estado de transição
    this.isTransitioning = false;
  };

  /**
   * Mostra mensagem de conclusão de missão
   * @param {string} missionId - ID da missão completada
   * @param {number} points - Pontos ganhos
   */
  missionsHub.prototype.showCompletionMessage = function (missionId, points) {
    // Obter detalhes da missão
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;

    // Criar overlay para mensagem
    const overlay = this.add.rectangle(0, 0, this.screenWidth, this.screenHeight, 0x000000, 0.7);
    overlay.setOrigin(0);
    overlay.setDepth(100);

    // Container da mensagem
    const msgContainer = this.add.container(this.screenWidth / 2, this.screenHeight / 2);
    msgContainer.setDepth(101);

    // Fundo da mensagem
    const msgBg = this.add.graphics();
    msgBg.fillStyle(0x111927, 0.95);
    msgBg.fillRoundedRect(-300, -150, 600, 300, 20);

    // Borda com efeito pulsante
    const msgBorder = this.add.graphics();
    msgBorder.lineStyle(3, 0x39f5e2, 1);
    msgBorder.strokeRoundedRect(-300, -150, 600, 300, 20);

    // Animar borda
    this.tweens.add({
      targets: msgBorder,
      alpha: { from: 1, to: 0.4 },
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    // Título da mensagem
    const msgTitle = this.add
      .text(0, -100, "MISSÃO COMPLETADA!", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Nome da missão
    const missionName = this.add
      .text(0, -50, mission.title, {
        fontSize: "20px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Pontos ganhos
    const pointsText = this.add
      .text(0, 10, `+ ${points} PONTOS`, {
        fontSize: "24px",
        fontFamily: this.fontFamily,
        fill: "#00cc00",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Animar pontos
    this.tweens.add({
      targets: pointsText,
      scale: { from: 1, to: 1.1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Verificar se há novas missões desbloqueadas
    const newlyUnlocked = this.missions.filter((m) => m.requiredMissions && m.requiredMissions.includes(missionId) && !m.completed && m.unlocked);

    // Mensagem de novas missões
    const newMissionsText = this.add
      .text(0, 60, newlyUnlocked.length > 0 ? `${newlyUnlocked.length} nova(s) missão(ões) desbloqueada(s)!` : "Continue sua jornada como DPO Hero!", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    // Botão de OK
    const okButton = this.createButton(
      0,
      120,
      "CONTINUAR",
      () => {
        // Fechar mensagem
        this.tweens.add({
          targets: [overlay, msgContainer],
          alpha: 0,
          duration: 300,
          onComplete: () => {
            overlay.destroy();
            msgContainer.destroy();
          },
        });
      },
      {
        width: 160,
        height: 40,
        fontSize: 18,
        primaryColor: 0x0d84ff,
        secondaryColor: 0x39f5e2,
      }
    );

    // Adicionar elementos ao container
    msgContainer.add([msgBg, msgBorder, msgTitle, missionName, pointsText, newMissionsText, okButton.container]);

    // Animação de entrada
    overlay.setAlpha(0);
    msgContainer.setAlpha(0);
    msgContainer.setScale(0.8);

    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 300,
    });

    this.tweens.add({
      targets: msgContainer,
      alpha: 1,
      scale: 1,
      duration: 400,
      ease: "Back.easeOut",
    });
  };

  /**
   * Mostra mensagem ao repetir uma missão já completada
   * @param {string} missionId - ID da missão repetida
   */
  missionsHub.prototype.showRepeatMessage = function (missionId) {
    // Obter detalhes da missão
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;

    // Criar toast de feedback
    const toast = this.add.container(this.screenWidth / 2, 100);
    toast.setDepth(100);

    // Fundo do toast
    const toastBg = this.add.graphics();
    toastBg.fillStyle(0x0d489f, 0.9);
    toastBg.fillRoundedRect(-200, -30, 400, 60, 15);

    // Borda
    toastBg.lineStyle(2, 0x39f5e2, 0.8);
    toastBg.strokeRoundedRect(-200, -30, 400, 60, 15);

    // Texto
    const toastText = this.add
      .text(0, 0, `Missão "${mission.title}" repetida com sucesso!`, {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    toast.add([toastBg, toastText]);

    // Animação de entrada e saída
    toast.setAlpha(0);
    toast.y = 50;

    this.tweens.add({
      targets: toast,
      alpha: 1,
      y: 100,
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Manter visível por alguns segundos
        this.time.delayedCall(3000, () => {
          // Animação de saída
          this.tweens.add({
            targets: toast,
            alpha: 0,
            y: 50,
            duration: 300,
            onComplete: () => toast.destroy(),
          });
        });
      },
    });

    // Armazenar para limpeza posterior
    if (!this.errorMessages) this.errorMessages = [];
    this.errorMessages.push(toast);
  };

  /**
   * Atualiza a exibição de informações do jogador
   */
  missionsHub.prototype.updatePlayerInfoDisplay = function () {
    if (!this.uiElements || !this.uiElements.playerInfo) return;

    const info = this.uiElements.playerInfo;

    // Atualizar textos com os valores atuais
    if (info.level) {
      info.level.setText(this.playerProgress.level.toString());
    }

    if (info.points) {
      info.points.setText(this.playerProgress.currentPoints.toString());
    }

    if (info.missions) {
      info.missions.setText(`${this.playerProgress.completedMissions.length} / ${this.totalMissions}`);
    }

    // Efeito de destaque nos valores atualizados
    this.tweens.add({
      targets: [info.level, info.points, info.missions],
      scale: { from: 1, to: 1.2 },
      duration: 200,
      yoyo: true,
    });
  };

  console.log("✅ Sistema de Navegação carregado");
})();
