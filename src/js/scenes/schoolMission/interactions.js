/**
 * Funções relacionadas ao sistema de interações da Missão Escolar
 */
(function () {
  /**
   * Cria NPCs (personagens não jogáveis)
   */
  schoolMission.prototype.createNPCs = function () {
    // Container para os NPCs
    this.npcs = {};

    try {
      // Criar NPC do professor
      this.createTeacherNPC();

      // Criar NPC da estudante
      this.createStudentNPC();

      console.log("✅ NPCs criados com sucesso");
    } catch (e) {
      console.error("❌ Erro ao criar NPCs:", e);
    }
  };

  /**
   * Cria o NPC do professor
   */
  schoolMission.prototype.createTeacherNPC = function () {
    // Verificar se há informação de spawn
    if (!this.mapElements.npcSpawns || !this.mapElements.npcSpawns.teacher) {
      console.warn("⚠️ Dados de spawn do professor não encontrados");

      // Posição padrão caso não tenha dados de spawn
      const x = this.cameras.main.width * 0.3;
      const y = this.cameras.main.height * 0.3;

      this.mapElements.npcSpawns = this.mapElements.npcSpawns || {};
      this.mapElements.npcSpawns.teacher = { x, y, name: "Professor Carlos" };
    }

    // Obter posição de spawn
    const spawnData = this.mapElements.npcSpawns.teacher;

    // Criar sprite do professor
    const teacher = this.physics.add.sprite(spawnData.x, spawnData.y, "teacher");

    // Configurar física
    teacher.setImmovable(true);
    teacher.setCollideWorldBounds(true);

    // Ajustar tamanho conforme necessário
    teacher.setScale(0.5);

    // Definir profundidade para ficar na frente do mapa, mas atrás do jogador
    teacher.setDepth(5);

    // Adicionar corpo de colisão
    teacher.body.setSize(teacher.width * 0.7, teacher.height * 0.5);
    teacher.body.setOffset(teacher.width * 0.15, teacher.height * 0.5);

    // Adicionar dados do NPC
    teacher.setData("id", "teacher");
    teacher.setData("name", spawnData.name || "Professor Carlos");
    teacher.setData("role", "teacher");
    teacher.setData("interactable", true);

    // Adicionar colisão com o jogador
    if (this.player) {
      this.physics.add.collider(this.player, teacher);
    }

    // Adicionar dica visual quando aproximar
    this.addHoverEffect(teacher);

    // Armazenar referência ao NPC
    this.npcs.teacher = teacher;

    return teacher;
  };

  /**
   * Cria o NPC da estudante
   */
  schoolMission.prototype.createStudentNPC = function () {
    // Verificar se há informação de spawn
    if (!this.mapElements.npcSpawns || !this.mapElements.npcSpawns.student) {
      console.warn("⚠️ Dados de spawn da estudante não encontrados");

      // Posição padrão caso não tenha dados de spawn
      const x = this.cameras.main.width * 0.7;
      const y = this.cameras.main.height * 0.3;

      this.mapElements.npcSpawns = this.mapElements.npcSpawns || {};
      this.mapElements.npcSpawns.student = { x, y, name: "Clara" };
    }

    // Obter posição de spawn
    const spawnData = this.mapElements.npcSpawns.student;

    // Criar sprite da estudante
    const student = this.physics.add.sprite(spawnData.x, spawnData.y, "student");

    // Configurar física
    student.setImmovable(true);
    student.setCollideWorldBounds(true);

    // Ajustar tamanho conforme necessário
    student.setScale(0.5);

    // Definir profundidade para ficar na frente do mapa, mas atrás do jogador
    student.setDepth(5);

    // Adicionar corpo de colisão
    student.body.setSize(student.width * 0.7, student.height * 0.5);
    student.body.setOffset(student.width * 0.15, student.height * 0.5);

    // Adicionar dados do NPC
    student.setData("id", "student");
    student.setData("name", spawnData.name || "Clara");
    student.setData("role", "student");
    student.setData("interactable", true);

    // Adicionar colisão com o jogador
    if (this.player) {
      this.physics.add.collider(this.player, student);
    }

    // Adicionar dica visual quando aproximar
    this.addHoverEffect(student);

    // Armazenar referência ao NPC
    this.npcs.student = student;

    return student;
  };

  /**
   * Adiciona efeito visual ao passar o mouse/aproximar de um objeto interativo
   * @param {Phaser.GameObjects.GameObject} object - Objeto interativo
   */
  schoolMission.prototype.addHoverEffect = function (object) {
    // Adicionar sombra ou destaque
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.3);
    highlight.fillCircle(0, 0, 30);

    // Posicionar inicialmente fora da tela
    highlight.setPosition(-100, -100);
    highlight.setVisible(false);

    // Associar destaque ao objeto
    object.setData("highlight", highlight);

    // Criar animação de brilho
    this.tweens.add({
      targets: highlight,
      alpha: { from: 0.3, to: 0.5 },
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  };

  /**
   * Mostra interações disponíveis com base na proximidade
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
      case "phone_policy":
        feedbackText = "Política de uso de celulares: Os dispositivos pessoais devem ser utilizados apenas para fins pedagógicos autorizados.";
        this.showPhonePolicy();
        break;
      case "data_protection":
        feedbackText = "Aviso sobre proteção de dados: A escola segue a LGPD e protege os dados pessoais de alunos e funcionários.";
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

    // Verificar progresso de tarefas
    if (interactionId === "phone_policy" || interactionId === "data_protection") {
      this.checkTaskProgressFromInteraction(interactionId);
    }
  };

  /**
   * Mostra política de uso de celulares
   */
  schoolMission.prototype.showPhonePolicy = function () {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Container para política
    const policyContainer = this.add.container(width / 2, height / 2);
    policyContainer.setDepth(200);

    // Overlay escuro
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0.5);

    // Fundo do painel
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x111927, 0.9);
    panelBg.fillRoundedRect(-300, -200, 600, 400, 15);

    // Borda
    panelBg.lineStyle(3, 0x0d84ff, 1);
    panelBg.strokeRoundedRect(-300, -200, 600, 400, 15);

    // Título
    const titleText = this.add
      .text(0, -160, "POLÍTICA DE USO DE CELULARES", {
        fontFamily: this.fontFamily,
        fontSize: "22px",
        color: "#39f5e2",
        fontWeight: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Conteúdo
    const contentText = this.add
      .text(0, 0, "Os dispositivos móveis pessoais (celulares, tablets, etc.) só podem ser utilizados em ambiente escolar nas seguintes condições:\n\n" + "1. Para fins educacionais específicos, sob orientação do professor.\n\n" + "2. Em áreas designadas durante os intervalos.\n\n" + "3. Grupos de comunicação da escola devem usar plataformas oficiais aprovadas pela instituição, em conformidade com a LGPD.\n\n" + "4. A coleta de números de telefone ou outras informações pessoais de alunos menores de idade requer autorização dos pais ou responsáveis.", {
        fontFamily: this.fontFamily,
        fontSize: "16px",
        color: "#ffffff",
        align: "left",
        wordWrap: { width: 550 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Botão de fechar
    const closeButton = this.createButton(0, 170, "FECHAR", 120, 40, () => {
      // Animar saída
      this.tweens.add({
        targets: policyContainer,
        alpha: 0,
        scale: 0.9,
        duration: 300,
        onComplete: () => {
          policyContainer.destroy();
        },
      });
    });

    // Adicionar elementos ao container
    policyContainer.add([overlay, panelBg, titleText, contentText, closeButton]);

    // Animar entrada
    policyContainer.setAlpha(0);
    policyContainer.setScale(0.9);

    this.tweens.add({
      targets: policyContainer,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: "Back.easeOut",
    });
  };

  /**
   * Verifica se uma interação progride as tarefas da missão
   * @param {string} interactionId - ID da interação
   */
  schoolMission.prototype.checkTaskProgressFromInteraction = function (interactionId) {
    // Verificar se a interação está relacionada à tarefa atual
    const currentTask = this.getCurrentTask();
    if (!currentTask) return;

    // Associar interações a tarefas
    const taskInteractions = {
      check_policy: ["phone_policy", "data_protection"],
      talk_to_teacher: ["teacher"],
      talk_to_student: ["student"],
    };

    // Verificar se a interação contribui para a tarefa atual
    if (currentTask.id && taskInteractions[currentTask.id] && taskInteractions[currentTask.id].includes(interactionId)) {
      // Casos especiais
      if (currentTask.id === "check_policy") {
        // Para políticas, só completa quando viu todas
        this.policyChecks = this.policyChecks || {};
        this.policyChecks[interactionId] = true;

        // Verificar se viu todas as políticas necessárias
        if (Object.keys(this.policyChecks).length >= taskInteractions.check_policy.length) {
          this.completeCurrentTask();
        }
      }
    }
  };

  console.log("✅ Módulo de Interações da Missão Escolar carregado");
})();
