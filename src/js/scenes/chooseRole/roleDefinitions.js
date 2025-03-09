/**
 * Funções relacionadas às definições e seleção de papéis
 */
(function () {
  /**
   * Função auxiliar para tocar som com tratamento para arquivos ausentes
   * @param {string} key - Chave do som
   * @param {Object} config - Configuração do som
   * @returns {Phaser.Sound.BaseSound} - O som ou null
   */
  chooseRole.prototype.playSoundSafely = function (key, config = { volume: 0.5 }) {
    if (this.soundEnabled && this.sound && this.sound.get) {
      try {
        // Verificar se o som existe antes de tentar reproduzi-lo
        const soundExists = this.cache.audio.exists(key);
        if (soundExists) {
          return this.sound.play(key, config);
        }
      } catch (e) {
        // Silenciosamente falhar se o som não estiver disponível
        console.log(`Som ${key} não encontrado ou não pôde ser reproduzido.`);
      }
    }
    return null;
  };

  /**
   * Cria as opções de seleção de papel
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  chooseRole.prototype.createRoleOptions = function (width, height) {
    // Container para as opções
    this.optionsContainer = this.add.container(width / 2, height / 2);

    // Definir papéis disponíveis
    const roles = [
      {
        key: "professor",
        title: "PROFESSOR",
        avatar: "teacher_avatar",
        features: ["• Foco em proteção de dados educacionais", "• Gestão de consentimento parental", "• Treinamento para colegas educadores", "• Conformidade institucional com a LGPD"],
        description: "Como professor, você será responsável por garantir que os dados dos alunos sejam protegidos adequadamente e que a instituição de ensino esteja em conformidade com a LGPD.",
        color: 0x2e7d32, // Verde
      },
      {
        key: "student",
        title: "ALUNO",
        avatar: "student_avatar",
        features: ["• Proteção de dados pessoais", "• Reconhecimento de riscos online", "• Compartilhamento seguro de informações", "• Defesa de direitos digitais"],
        description: "Como aluno, você aprenderá a identificar riscos à sua privacidade digital e ajudará colegas a proteger seus dados pessoais contra uso indevido.",
        color: 0x1565c0, // Azul
      },
    ];

    // Calcular espaçamento entre painéis
    const panelOffset = 220 * this.uiScale;

    // Criar cada painel de papel
    this.rolePanels = roles.map((role, index) => {
      // Posição X ajustada com base no número de opções
      const posX = roles.length === 1 ? 0 : index * 2 * panelOffset - panelOffset;

      // Criar o painel
      const panel = this.createRolePanel(posX, 0, role);

      // Adicionar ao container de opções
      this.optionsContainer.add(panel);

      return panel;
    });

    // Criar caixa de destaque informativo na parte inferior
    this.createHighlightBox(width, height);
  };

  /**
   * Cria um painel para seleção de papel
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {Object} role - Dados do papel
   * @returns {Phaser.GameObjects.Container} - Container do painel
   */
  chooseRole.prototype.createRolePanel = function (x, y, role) {
    // Container para o painel
    const panelContainer = this.add.container(x, y);

    // Dimensões do painel
    const panelWidth = 350;
    // Aumentar a altura do painel para acomodar melhor o conteúdo
    const panelHeight = 520;

    // Sombra do painel
    const panelShadow = this.add.graphics();
    panelShadow.fillStyle(0x000000, 0.5);
    panelShadow.fillRoundedRect(-panelWidth / 2 + 8, -panelHeight / 2 + 8, panelWidth, panelHeight, 16);

    // Fundo do painel
    const panelBg = this.add.graphics();
    panelBg.fillStyle(this.colors.darkGlass, 0.9);
    panelBg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);

    // Borda do painel
    panelBg.lineStyle(3, role.color, 0.8);
    panelBg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);

    // Cabeçalho do painel
    const headerBg = this.add.graphics();
    headerBg.fillStyle(role.color, 0.8);
    headerBg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, 60, { tl: 16, tr: 16, bl: 0, br: 0 });

    // Título do papel
    const title = this.add
      .text(0, -panelHeight / 2 + 30, role.title, {
        fontSize: "26px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Ajustar posição do avatar para que não fique em cima do texto
    // Mover mais para cima para deixar mais espaço para o texto
    const avatarY = -panelHeight / 2 + 140;

    // Adicionar avatar com tamanho adequado
    const avatar = this.add
      .image(0, avatarY, role.avatar)
      .setScale(0.4) // Reduzido para 0.4 de 0.5
      .setOrigin(0.5);

    // Adicionar brilho ao redor do avatar
    const avatarGlow = this.add.graphics();
    avatarGlow.fillStyle(role.color, 0.3);
    avatarGlow.fillCircle(0, avatarY, 50); // Reduzido para 50 de 60

    // Aumentar o espaço entre o avatar e o texto de características
    const featuresStartY = avatarY + 100; // Mais espaço entre avatar e características
    const features = role.features.map((point, index) => {
      return this.add
        .text(-panelWidth / 2 + 30, featuresStartY + index * 30, point, {
          fontSize: "16px",
          fontFamily: this.fontFamily,
          fill: "#CCCCCC",
          wordWrap: { width: panelWidth - 60 },
        })
        .setOrigin(0, 0.5);
    });

    // Botão de seleção na parte inferior
    const selectButton = this.createSelectButton(
      0,
      panelHeight / 2 - 40,
      "SELECIONAR",
      () => {
        this.selectRole(role.key);
      },
      role.color
    );

    // Adicionar tudo ao container
    panelContainer.add([panelShadow, panelBg, headerBg, title, avatarGlow, avatar, ...features, selectButton]);

    // Tornar o painel clicável (alternativa ao botão)
    panelContainer.setInteractive(new Phaser.Geom.Rectangle(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight), Phaser.Geom.Rectangle.Contains);

    // Armazenar dados do papel no container para referência fácil
    panelContainer.setData("roleData", role);

    // Efeitos de hover no painel
    panelContainer.on("pointerover", () => {
      // Destacar o painel
      panelBg.clear();
      panelBg.fillStyle(this.colors.darkGlass, 0.95);
      panelBg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);
      panelBg.lineStyle(3, role.color, 1);
      panelBg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);

      // Parar tween anterior se existir
      const panelId = `panel_${role.key}`;
      if (this.activeTweens[panelId]) {
        this.activeTweens[panelId].stop();
      }

      // Animar painel
      this.activeTweens[panelId] = this.tweens.add({
        targets: panelContainer,
        scaleX: 1.03,
        scaleY: 1.03,
        duration: 200,
      });

      // Animar avatar
      this.tweens.add({
        targets: avatarGlow,
        alpha: 0.5,
        duration: 200,
      });

      // Exibir descrição no painel informativo
      this.showRoleDescription(role.description, role.color);

      // Som de hover (se disponível)
      this.playSoundSafely("hover_sound", { volume: 0.2 });
    });

    // Modificar o comportamento do evento pointerout para verificar
    // se o mouse realmente saiu do painel ou apenas entrou em um elemento filho
    panelContainer.on("pointerout", function (pointer) {
      // Verificar se o mouse saiu realmente do painel ou apenas está sobre um elemento filho
      const panelBounds = this.getBounds();

      // Se o pointer ainda está dentro dos limites do painel, não fazer nada
      if (pointer.x >= panelBounds.left && pointer.x <= panelBounds.right && pointer.y >= panelBounds.top && pointer.y <= panelBounds.bottom) {
        return;
      }

      // Se realmente saiu do painel, executar ações de saída
      panelBg.clear();
      panelBg.fillStyle(this.scene.colors.darkGlass, 0.9);
      panelBg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);
      panelBg.lineStyle(3, role.color, 0.8);
      panelBg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);

      // Parar tween anterior se existir
      const panelId = `panel_${role.key}`;
      if (this.scene.activeTweens[panelId]) {
        this.scene.activeTweens[panelId].stop();
      }

      // Retornar escala ao normal
      this.scene.activeTweens[panelId] = this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
      });

      // Retornar brilho do avatar ao normal
      this.scene.tweens.add({
        targets: avatarGlow,
        alpha: 0.3,
        duration: 200,
      });

      // Esconder descrição específica e mostrar mensagem padrão
      this.scene.showDefaultHighlightMessage();
    });

    panelContainer.on("pointerdown", () => {
      this.selectRole(role.key);
    });

    return panelContainer;
  };

  /**
   * Cria o botão de seleção
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função de callback
   * @param {number} color - Cor do botão
   * @returns {Phaser.GameObjects.Container} - Container do botão
   */
  chooseRole.prototype.createSelectButton = function (x, y, text, callback, color) {
    // Container para o botão
    const buttonContainer = this.add.container(x, y);

    // Gerar ID único para o botão
    const buttonId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    buttonContainer.setData("buttonId", buttonId);

    // Fundo do botão
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(color, 0.9);
    buttonBg.fillRoundedRect(-100, -20, 200, 40, 10);

    buttonBg.lineStyle(2, 0xffffff, 0.8);
    buttonBg.strokeRoundedRect(-100, -20, 200, 40, 10);

    // Texto do botão
    const buttonText = this.add
      .text(0, 0, text, {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    buttonContainer.add([buttonBg, buttonText]);

    // Interatividade
    buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-100, -20, 200, 40), Phaser.Geom.Rectangle.Contains);

    // Modificar os eventos de pointerover e pointerout para evitar
    // que o movimento do mouse sobre o botão afete a descrição do painel
    buttonContainer.on("pointerover", (event) => {
      buttonBg.clear();
      buttonBg.fillStyle(color, 1);
      buttonBg.fillRoundedRect(-100, -20, 200, 40, 10);

      buttonBg.lineStyle(2, 0xffffff, 1);
      buttonBg.strokeRoundedRect(-100, -20, 200, 40, 10);

      // Parar tweens anteriores se existirem
      if (this.activeTweens[buttonId]) {
        this.activeTweens[buttonId].stop();
      }

      // Criar e armazenar novo tween
      this.activeTweens[buttonId] = this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });

      // Importante: Prevenir que o evento afete o painel pai
      // mantendo a descrição do papel visível
      if (event.stopPropagation) {
        event.stopPropagation();
      }

      // Recuperar dados do papel do container pai
      const parentPanel = buttonContainer.parentContainer;
      if (parentPanel && parentPanel.getData("roleData")) {
        const roleData = parentPanel.getData("roleData");
        // Manter a descrição do papel visível
        this.showRoleDescription(roleData.description, roleData.color);
      }
    });

    buttonContainer.on("pointerout", (event) => {
      buttonBg.clear();
      buttonBg.fillStyle(color, 0.9);
      buttonBg.fillRoundedRect(-100, -20, 200, 40, 10);

      buttonBg.lineStyle(2, 0xffffff, 0.8);
      buttonBg.strokeRoundedRect(-100, -20, 200, 40, 10);

      // Parar tweens anteriores se existirem
      if (this.activeTweens[buttonId]) {
        this.activeTweens[buttonId].stop();
      }

      // Criar e armazenar novo tween
      this.activeTweens[buttonId] = this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });

      // Importante: Prevenir que o evento afete o painel pai
      // mantendo a descrição do papel visível
      if (event.stopPropagation) {
        event.stopPropagation();
      }

      // Recuperar dados do papel do container pai
      const parentPanel = buttonContainer.parentContainer;
      if (parentPanel && parentPanel.getData("roleData")) {
        const roleData = parentPanel.getData("roleData");
        // Manter a descrição do papel visível quando sai do botão
        this.showRoleDescription(roleData.description, roleData.color);
      }
    });

    buttonContainer.on("pointerdown", (event) => {
      // Parar tween anterior se existir
      if (this.activeTweens[buttonId]) {
        this.activeTweens[buttonId].stop();
      }

      // Criar e armazenar novo tween
      this.activeTweens[buttonId] = this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: callback,
      });

      // Registrar que o clique foi no botão para evitar processamento duplo
      if (event.data) {
        event.data.wasOnButton = true;
      }

      // Evitar a propagação do evento para o container pai
      if (event.stopPropagation) {
        event.stopPropagation();
      }
    });

    return buttonContainer;
  };

  /**
   * Mostra a descrição de um papel no painel informativo
   * @param {string} description - Descrição do papel
   * @param {number} color - Cor associada ao papel
   */
  chooseRole.prototype.showRoleDescription = function (description, color) {
    // Verificar se infoText existe
    if (!this.infoText) return;

    // Atualizar texto
    this.infoText.setText(description);

    // Remover animação atual
    this.tweens.killTweensOf(this.infoContainer);

    // Destacar container com a cor do papel
    const boxBg = this.infoContainer.getAt(0);
    if (boxBg) {
      boxBg.clear();
      boxBg.fillStyle(color, 0.3);
      boxBg.fillRoundedRect((-this.screenWidth * 0.7) / 2, -25, this.screenWidth * 0.7, 50, 10);

      boxBg.lineStyle(2, color, 0.6);
      boxBg.strokeRoundedRect((-this.screenWidth * 0.7) / 2, -25, this.screenWidth * 0.7, 50, 10);
    }

    // Nova animação sutil
    this.tweens.add({
      targets: this.infoContainer,
      y: this.infoContainer.y - 5,
      duration: 200,
      yoyo: true,
      repeat: 0,
    });

    // Verificar se há um tooltip ativo e destruí-lo
    this.hideTooltip();
  };

  /**
   * Restaura a mensagem padrão no painel informativo
   */
  chooseRole.prototype.showDefaultHighlightMessage = function () {
    // Verificar se infoText existe
    if (!this.infoText) return;

    // Texto padrão
    this.infoText.setText("Na versão demo, ambos os papéis seguem o mesmo caminho de missões.");

    // Remover animação atual
    this.tweens.killTweensOf(this.infoContainer);

    // Voltar para o estilo padrão
    const boxBg = this.infoContainer.getAt(0);
    if (boxBg) {
      boxBg.clear();
      boxBg.fillStyle(this.colors.primary, 0.2);
      boxBg.fillRoundedRect((-this.screenWidth * 0.7) / 2, -25, this.screenWidth * 0.7, 50, 10);

      boxBg.lineStyle(2, this.colors.secondary, 0.4);
      boxBg.strokeRoundedRect((-this.screenWidth * 0.7) / 2, -25, this.screenWidth * 0.7, 50, 10);
    }

    // Restaurar animação de destaque
    this.tweens.add({
      targets: this.infoContainer,
      alpha: { from: 0.7, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
  };

  /**
   * Seleciona um papel e avança para a próxima cena
   * @param {string} role - Chave do papel selecionado
   */
  chooseRole.prototype.selectRole = function (role) {
    console.log(`Papel selecionado: ${role}`);

    // Evitar seleção múltipla durante a transição
    if (this.selectedRole) return;

    this.selectedRole = role;

    // Destacar visualmente o painel selecionado
    this.rolePanels.forEach((panel) => {
      const panelRole = panel.list[3].text === "PROFESSOR" ? "professor" : "student";

      if (panelRole === role) {
        // Painel selecionado - destacar
        // Parar tween anterior se existir
        const panelId = `panel_${panelRole}`;
        if (this.activeTweens[panelId]) {
          this.activeTweens[panelId].stop();
        }

        // Criar e armazenar novo tween
        this.activeTweens[panelId] = this.tweens.add({
          targets: panel,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 300,
          ease: "Back.easeOut",
        });

        // Substituir o efeito de partículas por um flash simples
        try {
          // Criar um flash sobre o painel selecionado
          const flash = this.add.graphics();
          flash.fillStyle(0xffffff, 0.3);
          flash.fillRect(panel.x - 175, panel.y - 240, 350, 480);

          // Animar o flash
          this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy(),
          });
        } catch (e) {
          console.warn("Erro ao criar efeito de seleção:", e);
        }
      } else {
        // Painéis não selecionados - escurecer
        // Parar tween anterior se existir
        const panelId = `panel_${panelRole}`;
        if (this.activeTweens[panelId]) {
          this.activeTweens[panelId].stop();
        }

        // Criar e armazenar novo tween
        this.activeTweens[panelId] = this.tweens.add({
          targets: panel,
          scaleX: 0.9,
          scaleY: 0.9,
          alpha: 0.5,
          duration: 300,
        });
      }
    });

    // Armazenar a escolha
    try {
      if (window.saveManager) {
        window.saveManager.data.selectedRole = role;
        window.saveManager.save();
      }
    } catch (e) {
      console.warn("Erro ao salvar a escolha do papel:", e);
    }

    // Som de confirmação
    this.playSoundSafely("confirm_sound", { volume: 0.7 });

    // Efeito de transição
    this.cameras.main.fadeOut(800);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("conversation");
    });
  };

  /**
   * Retorna ao menu principal
   */
  chooseRole.prototype.returnToMainMenu = function () {
    // Efeito de transição
    this.cameras.main.fadeOut(500);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("mainMenu");
    });
  };

  console.log("✅ Definições de Papéis carregadas");
})();
