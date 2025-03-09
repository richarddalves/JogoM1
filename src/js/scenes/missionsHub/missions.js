/**
 * Funções relacionadas às missões disponíveis no Hub
 */
(function () {
  /**
   * Configura as missões disponíveis no jogo
   */
  missionsHub.prototype.setupMissions = function () {
    // Array com as definições de todas as missões
    this.missions = [
      {
        id: "training",
        title: "IDENTIFICAÇÃO DE DADOS SENSÍVEIS",
        description: "Aprenda os conceitos fundamentais da LGPD e como identificar dados sensíveis em diferentes contextos.",
        difficulty: "Fácil",
        location: "Academia AGPD",
        points: 50,
        icon: "assets/images/ui/botao_retangular.png",
        unlocked: true, // Primeira missão sempre desbloqueada
        sceneKey: "gameInicial",
      },
      {
        id: "school_alert",
        title: "ALERTA NA ESCOLA",
        description: "O professor quer criar um grupo de WhatsApp com todos os alunos. Investigue os problemas de privacidade envolvidos.",
        difficulty: "Médio",
        location: "Escola Municipal",
        points: 100,
        icon: "assets/images/escola.jpeg",
        unlocked: false, // Desbloqueada após completar a primeira missão
        requiredMissions: ["training"],
        sceneKey: "cenaInicial",
      },
      {
        id: "school_trip",
        title: "PASSEIO COM A ESCOLA",
        description: "Um professor postou fotos dos alunos nas redes sociais sem autorização. Resolva essa situação delicada.",
        difficulty: "Médio",
        location: "Sala dos Professores",
        points: 150,
        icon: "assets/images/rascunho_sala_dos_professores.jpeg",
        unlocked: false,
        requiredMissions: ["school_alert"],
        sceneKey: "schoolTrip",
      },
      {
        id: "suspicious_network",
        title: "REDE SUSPEITA",
        description: "Uma rede suspeita está coletando dados sem autorização. Infiltre-se na empresa e colete provas contra hackers.",
        difficulty: "Difícil",
        location: "Corporação Global",
        points: 200,
        icon: "assets/images/empresa.jpeg",
        unlocked: false,
        requiredMissions: ["school_trip"],
        sceneKey: "suspiciousNetwork",
      },
      {
        id: "final_challenge",
        title: "DESAFIO FINAL: NETSHADOW",
        description: "Descubra a identidade do hacker da NetShadow e impeça futuras invasões para proteger dados sensíveis.",
        difficulty: "Muito Difícil",
        location: "Operação Especial",
        points: 300,
        icon: "assets/images/funcionario.png", // Usando um ícone mais adequado para o desafio final
        unlocked: false,
        requiredMissions: ["suspicious_network"],
        sceneKey: "finalChallenge",
      },
    ];

    // Atualizar contador de missões totais
    this.totalMissions = this.missions.length;

    // Verificar missões desbloqueadas com base no progresso
    this.updateMissionStatus();

    // Contar missões desbloqueadas
    this.unlockedMissions = this.missions.filter((mission) => mission.unlocked).length;
  };

  /**
   * Atualiza o status das missões com base no progresso do jogador
   */
  missionsHub.prototype.updateMissionStatus = function () {
    // Para cada missão, verificar se ela deve estar desbloqueada
    this.missions.forEach((mission) => {
      // Verificar se a missão já foi completada
      const isCompleted = this.playerProgress.completedMissions.includes(mission.id);
      mission.completed = isCompleted;

      // Se a missão requer outras missões, verificar se todas foram completadas
      if (mission.requiredMissions && mission.requiredMissions.length > 0) {
        const allRequiredCompleted = mission.requiredMissions.every((reqMissionId) => this.playerProgress.completedMissions.includes(reqMissionId));

        // Desbloquear se todos os requisitos foram atendidos
        mission.unlocked = allRequiredCompleted;
      }
    });
  };

  /**
   * Exibe as missões na interface
   */
  missionsHub.prototype.displayMissions = function () {
    // Limpar container de cards de missão
    if (this.missionCardsContainer) {
      this.missionCardsContainer.removeAll(true);
    }

    // Resetar array de cards
    this.missionCards = [];

    // Calcular quantas missões mostrar por vez (no máximo 3)
    const missionsPerPage = 3;
    const startIndex = this.missionIndex;
    const endIndex = Math.min(startIndex + missionsPerPage, this.missions.length);

    // Verificar se há missões para mostrar
    if (startIndex >= this.missions.length) {
      this.missionIndex = Math.max(0, this.missions.length - missionsPerPage);
      return this.displayMissions(); // Chamar novamente com índice corrigido
    }

    // Gerar cards para as missões visíveis
    for (let i = startIndex; i < endIndex; i++) {
      const mission = this.missions[i];
      const cardY = 230 + (i - startIndex) * 150;

      this.createMissionCard(mission, this.screenWidth / 2, cardY, i);
    }

    // Atualizar visibilidade dos botões de navegação
    if (this.prevButton && this.prevButton.container) {
      this.prevButton.container.setVisible(startIndex > 0);
    }

    if (this.nextButton && this.nextButton.container) {
      this.nextButton.container.setVisible(endIndex < this.missions.length);
    }
  };

  /**
   * Cria um card de missão
   * @param {Object} mission - Dados da missão
   * @param {number} x - Posição X do card
   * @param {number} y - Posição Y do card
   * @param {number} index - Índice da missão no array
   */
  missionsHub.prototype.createMissionCard = function (mission, x, y, index) {
    // Container para o card
    const cardContainer = this.add.container(x, y);
    cardContainer.setData("missionId", mission.id);

    // Background do card
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x111927, 0.9);
    cardBg.fillRoundedRect(-350, -60, 700, 120, 15);

    // Borda do card com cores diferentes dependendo do status
    let borderColor;
    if (mission.completed) {
      borderColor = 0x00cc00; // Verde para completado
    } else if (mission.unlocked) {
      borderColor = 0x0d84ff; // Azul para desbloqueado
    } else {
      borderColor = 0x888888; // Cinza para bloqueado
    }

    cardBg.lineStyle(2, borderColor, 1);
    cardBg.strokeRoundedRect(-350, -60, 700, 120, 15);

    // Título da missão
    let titleColor = mission.unlocked ? "#FFFFFF" : "#888888";
    const missionTitle = this.add
      .text(-330, -45, mission.title, {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: titleColor,
        fontWeight: "bold",
      })
      .setOrigin(0, 0);

    // Descrição da missão
    let descColor = mission.unlocked ? "#CCCCCC" : "#666666";
    const missionDesc = this.add
      .text(-330, -15, mission.description, {
        fontSize: "14px",
        fontFamily: this.fontFamily,
        fill: descColor,
        wordWrap: { width: 400 },
      })
      .setOrigin(0, 0);

    // Informações adicionais
    const difficultyText = this.add
      .text(-330, 30, `Dificuldade: ${mission.difficulty}`, {
        fontSize: "12px",
        fontFamily: this.fontFamily,
        fill: descColor,
      })
      .setOrigin(0, 0);

    const pointsText = this.add
      .text(-150, 30, `Pontos: ${mission.points}`, {
        fontSize: "12px",
        fontFamily: this.fontFamily,
        fill: descColor,
      })
      .setOrigin(0, 0);

    const locationText = this.add
      .text(0, 30, `Local: ${mission.location}`, {
        fontSize: "12px",
        fontFamily: this.fontFamily,
        fill: descColor,
      })
      .setOrigin(0, 0);

    // Elementos do card
    const cardElements = [cardBg, missionTitle, missionDesc, difficultyText, pointsText, locationText];

    // Indicador de status - NÃO USAR O ÍCONE "correto.png"
    if (mission.completed) {
      // CORRIGIDO: Usar simplesmente um indicador de texto em vez do ícone
      const completedText = this.add
        .text(320, -40, "CONCLUÍDA", {
          fontSize: "14px",
          fontFamily: this.fontFamily,
          fill: "#00cc00",
          fontWeight: "bold",
        })
        .setOrigin(0.5);

      cardElements.push(completedText);
    } else if (!mission.unlocked) {
      // Usar o ícone de cadeado com escala adequada
      statusIcon = this.add.image(320, -15, "icon_locked").setScale(0.25);
      cardElements.push(statusIcon);
    }

    // Botão de iniciar missão (apenas para missões desbloqueadas)
    let startButton;
    if (mission.unlocked) {
      const buttonText = mission.completed ? "REPETIR" : "INICIAR";
      const buttonColor = mission.completed ? 0x0d489f : 0x006600;
      const buttonHoverColor = mission.completed ? 0x39f5e2 : 0x00cc00;

      startButton = this.createButton(
        300,
        20,
        buttonText,
        () => {
          if (!this.isTransitioning) {
            this.startMission(mission);
          }
        },
        {
          width: 120,
          height: 40,
          fontSize: 16,
          primaryColor: buttonColor,
          secondaryColor: buttonHoverColor,
        }
      );

      cardElements.push(startButton.container);
    } else {
      // Container para o status de bloqueio
      const lockedContainer = this.add.container(300, 20);

      // Fundo para o texto bloqueado
      const lockedBg = this.add.graphics();
      lockedBg.fillStyle(0x990000, 0.6);
      lockedBg.fillRoundedRect(-60, -15, 120, 30, 5);
      lockedBg.lineStyle(1, 0xff5252, 0.8);
      lockedBg.strokeRoundedRect(-60, -15, 120, 30, 5);

      // Texto "Bloqueado" com melhor estilo
      const lockedText = this.add
        .text(0, 0, "BLOQUEADO", {
          fontSize: "14px",
          fontFamily: this.fontFamily,
          fill: "#FFFFFF",
          fontWeight: "bold",
        })
        .setOrigin(0.5);

      lockedContainer.add([lockedBg, lockedText]);
      cardElements.push(lockedContainer);
    }

    // Adicionar elementos ao container
    cardContainer.add(cardElements);

    // Adicionar o card ao container principal
    this.missionCardsContainer.add(cardContainer);

    // Efeito de entrada
    cardContainer.setAlpha(0);
    cardContainer.setScale(0.95);

    this.tweens.add({
      targets: cardContainer,
      alpha: 1,
      scale: 1,
      duration: 300,
      delay: (index - this.missionIndex) * 100,
      ease: "Back.easeOut",
    });

    // Armazenar referência ao card
    this.missionCards[index] = {
      container: cardContainer,
      background: cardBg,
      title: missionTitle,
      description: missionDesc,
      difficulty: difficultyText,
      points: pointsText,
      location: locationText,
      startButton: startButton,
    };
  };

  /**
   * Marca uma missão como completada e salva o progresso
   * @param {string} missionId - ID da missão completada
   * @param {number} earnedPoints - Pontos ganhos
   * @returns {boolean} - Verdadeiro se a missão foi completada pela primeira vez
   */
  missionsHub.prototype.completeMission = function (missionId, earnedPoints) {
    // Verificar se a missão já foi completada
    if (!this.playerProgress.completedMissions.includes(missionId)) {
      // Adicionar à lista de missões completadas
      this.playerProgress.completedMissions.push(missionId);

      // Adicionar pontos
      this.playerProgress.currentPoints += earnedPoints;

      // Atualizar nível com base nos pontos
      this.updatePlayerLevel();

      // Salvar progresso
      this.savePlayerData();

      // Atualizar status das missões
      this.updateMissionStatus();

      console.log(`✅ Missão ${missionId} completada! +${earnedPoints} pontos`);
      return true;
    }

    return false;
  };

  /**
   * Atualiza o nível do jogador com base nos pontos
   */
  missionsHub.prototype.updatePlayerLevel = function () {
    // Fórmula simples para cálculo de nível
    // Cada nível requer mais pontos que o anterior
    const basePointsPerLevel = 100;
    let pointsRequired = 0;
    let level = 1;

    while (true) {
      pointsRequired += basePointsPerLevel * level;
      if (this.playerProgress.currentPoints < pointsRequired) {
        break;
      }
      level++;
    }

    this.playerProgress.level = level;
  };

  /**
   * Salva os dados do jogador
   */
  missionsHub.prototype.savePlayerData = function () {
    try {
      localStorage.setItem("dpoHeroProgress", JSON.stringify(this.playerProgress));
      console.log("✅ Progresso do jogador salvo com sucesso");
    } catch (error) {
      console.error("❌ Erro ao salvar progresso do jogador:", error);
    }
  };

  /**
   * Verifica se uma cena existe antes de tentar iniciá-la
   * @param {string} sceneKey - Chave da cena a verificar
   * @returns {boolean} - Verdadeiro se a cena existe
   */
  missionsHub.prototype.doesSceneExist = function (sceneKey) {
    try {
      return this.scene.get(sceneKey) !== null;
    } catch (e) {
      return false;
    }
  };

  console.log("✅ Sistema de Missões carregado");
})();
