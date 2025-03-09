/**
 * Funções relacionadas às tarefas da Missão Escolar
 */
(function () {
  /**
   * Configura as tarefas da missão
   */
  schoolMission.prototype.setupTasks = function () {
    // Definir lista de tarefas para esta missão
    this.tasks = [
      {
        id: "check_policy",
        text: "Verificar a política da escola sobre uso de celulares",
        completed: false,
        hint: "Procure pelo painel de avisos nos corredores da escola",
      },
      {
        id: "talk_to_student",
        text: "Conversar com Clara sobre as preocupações dos estudantes",
        completed: false,
        hint: "Clara deve estar na sala de aula",
      },
      {
        id: "talk_to_teacher",
        text: "Conversar com o Professor Carlos sobre o grupo de WhatsApp",
        completed: false,
        hint: "O Professor Carlos deve estar na sala dos professores",
      },
      {
        id: "solve_problem",
        text: "Propor uma solução adequada para a comunicação",
        completed: false,
        hint: "Após conversar com todos os envolvidos, sugira a melhor solução ao professor",
      },
    ];

    // Índice da tarefa atual
    this.currentTaskIndex = 0;

    // Iniciar indicadores de tarefa
    this.setupTaskIndicators();
  };

  /**
   * Configura indicadores de tarefas visuais
   */
  schoolMission.prototype.setupTaskIndicators = function () {
    // Container para indicadores de tarefa
    this.taskIndicators = [];

    // Criar indicadores para NPCs
    if (this.npcs) {
      // Processar cada NPC
      Object.entries(this.npcs).forEach(([id, npc]) => {
        // Determinar se este NPC está relacionado a alguma tarefa
        const relatedTask = this.tasks.find((task) => (task.id === "talk_to_teacher" && id === "teacher") || (task.id === "talk_to_student" && id === "student"));

        if (relatedTask) {
          // Criar indicador de tarefa
          const indicator = this.add
            .image(npc.x, npc.y - npc.height / 2 - 30, "task_incomplete")
            .setScale(0.5)
            .setDepth(100);

          // Animar flutuação
          this.tweens.add({
            targets: indicator,
            y: indicator.y - 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          // Armazenar referência
          this.taskIndicators.push({
            indicator,
            targetObject: npc,
            taskId: relatedTask.id,
          });

          // Inicialmente ocultar
          indicator.setVisible(false);
        }
      });
    }

    // Criar indicadores para áreas interativas
    if (this.mapElements && this.mapElements.interactionZones) {
      this.mapElements.interactionZones.forEach((zone) => {
        const props = zone.getData("properties");

        if (props && (props.id === "phone_policy" || props.id === "data_protection")) {
          // Criar indicador para área de política
          const indicator = this.add
            .image(zone.x + zone.width / 2, zone.y, "task_incomplete")
            .setScale(0.5)
            .setDepth(100);

          // Animar flutuação
          this.tweens.add({
            targets: indicator,
            y: indicator.y - 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          // Armazenar referência
          this.taskIndicators.push({
            indicator,
            targetObject: zone,
            taskId: "check_policy",
          });

          // Inicialmente ocultar
          indicator.setVisible(false);
        }
      });
    }
  };

  /**
   * Atualiza a visibilidade dos indicadores de tarefa
   */
  schoolMission.prototype.updateTaskIndicators = function () {
    if (!this.taskIndicators || !this.tasks) return;

    // Obter a tarefa atual
    const currentTask = this.getCurrentTask();
    if (!currentTask) return;

    // Atualizar cada indicador
    this.taskIndicators.forEach((item) => {
      // Verificar se o indicador corresponde à tarefa atual
      const isForCurrentTask = item.taskId === currentTask.id;

      // Verificar se a tarefa já foi concluída
      const isTaskCompleted = this.taskCompleted(item.taskId);

      // Atualizar visibilidade
      item.indicator.setVisible(isForCurrentTask && !isTaskCompleted);

      // Atualizar posição (caso o objeto se mova)
      if (item.targetObject.x !== undefined && item.targetObject.y !== undefined) {
        const offsetY = item.targetObject.height ? item.targetObject.height / 2 + 30 : 30;
        item.indicator.setPosition(item.targetObject.x, item.targetObject.y - offsetY);
      }
    });
  };

  /**
   * Obtém a tarefa atual
   * @returns {Object} - Tarefa atual ou null se não houver mais tarefas
   */
  schoolMission.prototype.getCurrentTask = function () {
    if (!this.tasks || this.currentTaskIndex >= this.tasks.length) return null;
    return this.tasks[this.currentTaskIndex];
  };

  /**
   * Obtém o ID da tarefa atual
   * @returns {string} - ID da tarefa atual ou null
   */
  schoolMission.prototype.getCurrentTaskId = function () {
    const currentTask = this.getCurrentTask();
    return currentTask ? currentTask.id : null;
  };

  /**
   * Verifica se uma tarefa foi concluída
   * @param {string} taskId - ID da tarefa
   * @returns {boolean} - Verdadeiro se a tarefa foi concluída
   */
  schoolMission.prototype.taskCompleted = function (taskId) {
    if (!this.tasks) return false;

    const task = this.tasks.find((t) => t.id === taskId);
    return task ? task.completed : false;
  };

  /**
   * Marca a tarefa atual como concluída e avança para a próxima
   */
  schoolMission.prototype.completeCurrentTask = function () {
    if (!this.tasks || this.currentTaskIndex >= this.tasks.length) return;

    // Obter tarefa atual
    const currentTask = this.tasks[this.currentTaskIndex];

    // Verificar se já está completa
    if (currentTask.completed) return;

    // Marcar como completa
    currentTask.completed = true;

    // Atualizar a lista de tarefas na UI
    this.updateTaskList(this.tasks);

    // Mostrar feedback
    this.showNotification(`Tarefa concluída: ${currentTask.text}`, "success");

    // Som de sucesso
    if (this.sound.get("success_sound")) {
      this.sound.play("success_sound", { volume: 0.3 });
    }

    // Adicionar pontos se HUD estiver disponível
    if (this.agentHUD) {
      this.agentHUD.addPoints(20, `Tarefa concluída: ${currentTask.text}`);
    }

    // Avançar para a próxima tarefa
    this.currentTaskIndex++;

    // Verificar se completou todas as tarefas
    if (this.currentTaskIndex >= this.tasks.length) {
      // Todas as tarefas concluídas
      this.showMissionSuccessFeedback();
    } else {
      // Mostrar dica para próxima tarefa
      const nextTask = this.tasks[this.currentTaskIndex];
      if (nextTask && nextTask.hint) {
        this.time.delayedCall(2000, () => {
          this.showNotification(`Nova tarefa: ${nextTask.hint}`, "info");
        });
      }
    }
  };

  /**
   * Marca uma tarefa específica como concluída
   * @param {string} taskId - ID da tarefa
   */
  schoolMission.prototype.completeTask = function (taskId) {
    if (!this.tasks) return;

    // Encontrar a tarefa pelo ID
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    // Verificar se já está completa
    if (this.tasks[taskIndex].completed) return;

    // Marcar como completa
    this.tasks[taskIndex].completed = true;

    // Se for a tarefa atual, avançar para a próxima
    if (taskIndex === this.currentTaskIndex) {
      this.currentTaskIndex++;
    }

    // Atualizar a lista de tarefas na UI
    this.updateTaskList(this.tasks);

    // Mostrar feedback
    this.showNotification(`Tarefa concluída: ${this.tasks[taskIndex].text}`, "success");

    // Som de sucesso
    if (this.sound.get("success_sound")) {
      this.sound.play("success_sound", { volume: 0.3 });
    }

    // Verificar se completou todas as tarefas
    const allCompleted = this.tasks.every((task) => task.completed);
    if (allCompleted) {
      this.showMissionSuccessFeedback();
    }
  };

  /**
   * Mostra feedback quando todas as tarefas são concluídas
   */
  schoolMission.prototype.showMissionSuccessFeedback = function () {
    // Mostrar notificação
    this.showNotification("Todas as tarefas concluídas! Missão resolvida com sucesso.", "success");

    // Se não estiver em diálogo, mostrar tela de conclusão
    if (!this.dialogActive) {
      this.time.delayedCall(2000, () => {
        this.completeMission();
      });
    }
  };

  console.log("✅ Módulo de Tarefas da Missão Escolar carregado");
})();
