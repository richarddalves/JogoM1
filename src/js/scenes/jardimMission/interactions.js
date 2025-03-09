/**
 * Módulo de interações para a missão do jardim (CORRIGIDO)
 */
(function () {
  /**
   * Cria NPCs e objetos interativos
   */
  jardimMission.prototype.createNPCs = function () {
    console.log("🧑‍🤝‍🧑 Criando NPCs e objetos interativos...");

    // Criar professor
    this.createProfessor();

    // Criar outros personagens e objetos interativos (se necessário)
    this.createInteractiveObjects();

    console.log("✅ NPCs e objetos interativos criados com sucesso!");
  };

  /**
   * Cria o NPC do professor
   */
  jardimMission.prototype.createProfessor = function () {
    // Determinar posição do professor
    let professorX = 500;
    let professorY = 300;

    // Usar ponto de spawn do mapa se disponível
    if (this.npcSpawnPoints && this.npcSpawnPoints.professor) {
      professorX = this.npcSpawnPoints.professor.x;
      professorY = this.npcSpawnPoints.professor.y;
      console.log(`📍 Usando ponto de spawn do professor: (${professorX}, ${professorY})`);
    } else {
      console.log(`📍 Usando coordenadas padrão do professor: (${professorX}, ${professorY})`);
    }

    // CORRIGIDO: Criar sprite do professor com imagem PNG única em vez de spritesheet
    const professorSprite = this.physics.add.sprite(professorX, professorY, "professor");

    // CORRIGIDO: Ajustar tamanho do professor para proporção adequada
    // A imagem original é 314x961, vamos redimensioná-la para um tamanho proporcional
    professorSprite.setScale(0.15); // Escalado para baixo para um tamanho razoável

    // CORRIGIDO: Configurar física do professor
    professorSprite.setSize(40, 80); // Ajustar a hitbox para corresponder ao tamanho visual
    professorSprite.setOffset(professorSprite.width / 2 - 20, professorSprite.height - 80); // Centralizar a hitbox
    professorSprite.setImmovable(true);
    professorSprite.setDepth(5); // Mesma profundidade do jogador para ordenar corretamente

    // CORRIGIDO: Não precisamos mais criar animações do professor já que estamos usando uma imagem estática

    // Criar objeto do professor
    this.professor = {
      sprite: professorSprite,
      name: "Professor Silva",
      direction: "down",
      isMoving: false,
      patrolPoints: [],
      currentPatrolPoint: 0,
      patrolSpeed: 40, // Reduzido para movimento mais suave
      patrolWaitTime: 3000, // Tempo de espera em cada ponto em ms
      lastPatrolMove: 0,
      isWaiting: false,
      dialogState: "initial", // Estado inicial do diálogo
      missionState: "pending", // Estado da missão com este NPC
      talkRadius: 100, // Raio para exibir ícone de diálogo
      chatIcon: null, // Ícone de diálogo
      update: (time, delta) => this.updateProfessor(time, delta),
    };

    // Adicionar pontos de patrulha (opcional)
    // O professor andará entre esses pontos até o jogador interagir
    this.professor.patrolPoints = [
      { x: professorX, y: professorY },
      { x: professorX + 100, y: professorY },
      { x: professorX + 100, y: professorY + 100 },
      { x: professorX, y: professorY + 100 },
    ];

    // Criar ícone de diálogo/chat
    this.professor.chatIcon = this.add
      .text(professorX, professorY - 60, "💬", {
        fontSize: "24px",
      })
      .setOrigin(0.5);
    this.professor.chatIcon.setVisible(false);
    this.professor.chatIcon.setDepth(20);

    // Adicionar indicador flutuante com o nome
    this.professor.nameTag = this.add
      .text(professorX, professorY - 50, "Professor Silva", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "14px",
        color: "#FFFFFF",
        backgroundColor: "#000000",
        padding: { x: 5, y: 2 },
      })
      .setOrigin(0.5);
    this.professor.nameTag.setDepth(20);
  };

  /**
   * Cria objetos interativos no mapa
   */
  jardimMission.prototype.createInteractiveObjects = function () {
    // Criar zonas de interação para objetos no mapa
    this.interactiveObjects = [];

    // Processar pontos de interação do mapa
    this.interactPoints.forEach((point) => {
      // Criar zona de colisão para o ponto de interação
      const interactiveZone = this.add.zone(point.x, point.y, point.width, point.height);
      this.physics.world.enable(interactiveZone, Phaser.Physics.Arcade.STATIC_BODY);

      // Adicionar ao array de objetos interativos
      this.interactiveObjects.push({
        zone: interactiveZone,
        data: point,
      });

      console.log(`🔍 Criado ponto de interação: ${point.name} em (${point.x}, ${point.y})`);
    });

    // Adicionar marcadores visuais para objetos interativos (apenas no modo de desenvolvimento)
    if (this.debugMode) {
      this.interactiveObjects.forEach((obj) => {
        const marker = this.add.graphics();
        marker.lineStyle(2, 0xffff00, 1);
        marker.strokeRect(obj.zone.x - obj.zone.width / 2, obj.zone.y - obj.zone.height / 2, obj.zone.width, obj.zone.height);
      });
    }
  };

  /**
   * Atualiza os NPCs
   */
  jardimMission.prototype.updateNPCs = function (time, delta) {
    // Atualizar professor
    if (this.professor) {
      this.professor.update(time, delta);
    }

    // Verificar proximidade do jogador com o professor para mostrar ícone de diálogo
    this.checkDialogIndicators();
  };

  /**
   * Atualiza o professor
   */
  jardimMission.prototype.updateProfessor = function (time, delta) {
    if (!this.professor || !this.professor.sprite) return;

    // Não mover o professor se o jogador estiver próximo ou em diálogo
    if (this.dialog && this.dialog.active) {
      // Certificar que o professor está olhando para o jogador durante o diálogo
      this.makeNPCFacePlayer(this.professor);
      return;
    }

    // Verificar se o professor está próximo ao jogador
    if (this.player && this.player.sprite) {
      const distance = Phaser.Math.Distance.Between(this.professor.sprite.x, this.professor.sprite.y, this.player.sprite.x, this.player.sprite.y);

      // Se o jogador estiver próximo, olhar para ele
      if (distance < 100) {
        this.makeNPCFacePlayer(this.professor);
        this.professor.isMoving = false;
        return;
      }
    }

    // CORRIGIDO: Movimento de patrulha simplificado para professor estático
    // Apenas movemos levemente para simular postura em pé

    // Atualizar posição do ícone de diálogo e nametag
    if (this.professor.chatIcon) {
      this.professor.chatIcon.setPosition(
        this.professor.sprite.x,
        this.professor.sprite.y - 80 // CORRIGIDO: Ajustado para posição acima do sprite grande
      );
    }

    if (this.professor.nameTag) {
      this.professor.nameTag.setPosition(
        this.professor.sprite.x,
        this.professor.sprite.y - 100 // CORRIGIDO: Ajustado para posição acima do sprite grande
      );
    }

    // Adicionar movimento sutil para o professor parecer mais vivo
    if (!this.professorIdleAnimation) {
      this.professorIdleAnimation = this.tweens.add({
        targets: this.professor.sprite,
        y: this.professor.sprite.y + 5,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  };

  /**
   * Faz um NPC olhar para o jogador
   */
  jardimMission.prototype.makeNPCFacePlayer = function (npc) {
    if (!npc || !npc.sprite || !this.player || !this.player.sprite) return;

    // CORRIGIDO: Para o professor como imagem estática, não precisamos
    // mudar animações, apenas virar o sprite se necessário
    const dx = this.player.sprite.x - npc.sprite.x;

    // Apenas viramos horizontalmente baseado na posição do jogador
    if (dx < 0) {
      // Jogador está à esquerda
      npc.sprite.setFlipX(true);
    } else {
      // Jogador está à direita
      npc.sprite.setFlipX(false);
    }

    // Parar movimento e registrar direção
    npc.sprite.setVelocity(0, 0);
    npc.isMoving = false;
    npc.direction = dx < 0 ? "left" : "right";
  };

  /**
   * Verifica a proximidade do jogador com NPCs para mostrar indicadores de diálogo
   */
  jardimMission.prototype.checkDialogIndicators = function () {
    if (!this.player || !this.player.sprite || !this.professor || !this.professor.sprite) return;

    // Verificar distância até o professor
    const distance = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, this.professor.sprite.x, this.professor.sprite.y);

    // Mostrar ícone de diálogo se estiver próximo
    if (this.professor.chatIcon) {
      const isNearby = distance < this.professor.talkRadius;
      this.professor.chatIcon.setVisible(isNearby && (!this.dialog || !this.dialog.active));
    }
  };

  /**
   * Inicia diálogo com o professor
   */
  jardimMission.prototype.startProfessorDialog = function () {
    // Verificar se já está em diálogo
    if (this.dialog && this.dialog.active) return;

    // Desabilitar movimento do jogador durante o diálogo
    this.disablePlayerMovement();

    // Fazer o professor olhar para o jogador
    this.makeNPCFacePlayer(this.professor);

    // Atualizar estado da missão se for o primeiro diálogo
    if (!this.missionStarted) {
      this.missionStarted = true;
      this.currentTask = 0;

      // Atualizar objetivo
      this.updateObjectiveIndicator();
    }

    // Determinar qual diálogo mostrar baseado no estado da missão
    let dialogLines = [];

    switch (this.professor.dialogState) {
      case "initial":
        dialogLines = this.getProfessorInitialDialog();
        break;
      case "explanation":
        dialogLines = this.getProfessorExplanationDialog();
        break;
      case "completed":
        dialogLines = this.getProfessorCompletedDialog();
        break;
      default:
        dialogLines = this.getProfessorDefaultDialog();
    }

    // Iniciar diálogo
    this.startDialog(dialogLines, "Professor Silva", () => {
      // Callback ao finalizar o diálogo

      // Habilitar movimento do jogador
      this.enablePlayerMovement();

      // Processar mudanças de estado baseadas no diálogo
      if (this.professor.dialogState === "initial") {
        this.professor.dialogState = "explanation";

        // Avançar para o próximo estágio da missão
        this.currentTask = 1;

        // Mostrar notificação com o novo objetivo
        this.showTaskNotification("Explique ao professor os problemas com o grupo de WhatsApp");

        // Atualizar indicador de objetivo
        this.updateObjectiveIndicator();
      } else if (this.professor.dialogState === "explanation") {
        this.professor.dialogState = "completed";

        // Marcar a missão como concluída
        this.missionCompleted = true;

        // Mostrar notificação de conclusão
        this.showTaskNotification("Missão concluída! O professor entendeu os problemas com o grupo de WhatsApp");

        // Dar pontos ao jogador
        this.addPoints(100);

        // Atualizar indicador de objetivo
        this.updateObjectiveIndicator();
      }
    });
  };

  /**
   * Adiciona pontos ao jogador
   * @param {number} points - Quantidade de pontos
   */
  jardimMission.prototype.addPoints = function (points) {
    try {
      // Verificar se a HUD do agente está disponível
      if (this.agentHUD) {
        this.agentHUD.addPoints(points, "Missão do jardim completada com sucesso!");
      } else {
        console.log(`Pontos adicionados: ${points}`);
      }
    } catch (e) {
      console.warn("Erro ao adicionar pontos:", e);
    }
  };

  /**
   * Mostra um diálogo simples sem opções
   */
  jardimMission.prototype.showSimpleDialog = function (message) {
    // Usar o sistema de diálogo para mostrar uma mensagem simples
    this.startDialog([{ text: message }], "", () => {
      // Habilitar movimento do jogador após o diálogo
      this.enablePlayerMovement();
    });
  };

  console.log("✅ Módulo de Interações carregado");
})();
