/**
 * Funções relacionadas à interface da cena de conversação
 */
(function () {
  /**
   * Configura o sistema responsivo para adaptar a cena a diferentes tamanhos de tela
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  conversation.prototype.setupResponsiveDesign = function (width, height) {
    this.scale.on("resize", this.resize, this);

    // Calcular escalas com base na resolução
    this.uiScale = Math.min(width / 1280, height / 720);
    this.charScale = Math.min(width / 1920, height / 1080) * this.characterScale;
    this.charScale *= 1.4;

    // Armazenar dimensões para usar em outros métodos
    this.screenWidth = width;
    this.screenHeight = height;
  };

  /**
   * Cria o ambiente de fundo
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  conversation.prototype.createEnvironment = function (width, height) {
    // Fundo principal
    this.background = this.add
      .image(width / 2, height / 2, "dialog_bg")
      .setDisplaySize(width, height)
      .setAlpha(0.95);

    // Adicionar overlay gradiente para melhorar contraste
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000022, 0.4);
    overlay.fillRect(0, 0, width, height);

    // Grade digital futurista para dar efeito de ambiente tech
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x0d84ff, 0.15);

    // Linhas horizontais
    for (let y = 0; y < height; y += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(width, y);
      gridGraphics.strokePath();
    }

    // Linhas verticais
    for (let x = 0; x < width; x += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, height);
      gridGraphics.strokePath();
    }

    // Efeito de scanlines para visual cyberpunk (linhas horizontais finas)
    const scanlines = this.add.graphics();
    scanlines.fillStyle(0xffffff, 0.02);

    for (let y = 0; y < height; y += 2) {
      scanlines.fillRect(0, y, width, 1);
    }

    // Efeito de vinheta
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.6);
    vignette.fillRect(0, 0, width, height);

    // Criar um "buraco" no centro usando uma máscara para o efeito de vinheta
    const mask = this.add.graphics();
    // Usar um gradiente radial simulado manualmente com camadas de opacidade decrescente
    for (let r = Math.min(width, height) * 0.5; r > 0; r -= 10) {
      const alpha = 1 - r / (Math.min(width, height) * 0.5);
      mask.fillStyle(0xffffff, alpha);
      mask.fillCircle(width / 2, height / 2, r);
    }

    // Aplicar máscara para criar o efeito de vinheta
    vignette.setMask(new Phaser.Display.Masks.GeometryMask(this, mask));
    mask.setVisible(false);
  };

  /**
   * Cria a interface de diálogo com estilo aprimorado
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  conversation.prototype.createDialogInterface = function (width, height) {
    // Criar container para a interface de diálogo
    this.dialogContainer = this.add.container(0, 0);

    // Dimensões da caixa de diálogo
    const dialogBoxHeight = height * 0.25;
    const dialogBoxWidth = width * 0.8;
    const dialogY = height - dialogBoxHeight / 2 - 50;

    // Criar caixa de diálogo usando gráficos
    this.dialogBox = this.add.graphics();
    this.dialogBox.fillStyle(0x111927, 0.9);
    this.dialogBox.fillRoundedRect(width / 2 - dialogBoxWidth / 2, dialogY - dialogBoxHeight / 2, dialogBoxWidth, dialogBoxHeight, 16);

    // Borda da caixa de diálogo
    this.dialogBox.lineStyle(3, 0x0d84ff, 1);
    this.dialogBox.strokeRoundedRect(width / 2 - dialogBoxWidth / 2, dialogY - dialogBoxHeight / 2, dialogBoxWidth, dialogBoxHeight, 16);

    // Adicionar efeito de brilho na borda
    const dialogGlow = this.add.graphics();
    dialogGlow.fillStyle(0x0d84ff, 0.2);
    dialogGlow.fillRoundedRect(width / 2 - dialogBoxWidth / 2 - 5, dialogY - dialogBoxHeight / 2 - 5, dialogBoxWidth + 10, dialogBoxHeight + 10, 20);

    // Adicionar ao container
    this.dialogContainer.add(dialogGlow);
    this.dialogContainer.add(this.dialogBox);

    // Container para o nome do personagem para melhor posicionamento
    const speakerContainer = this.add.container(width / 2 - dialogBoxWidth / 2 + 90, dialogY - dialogBoxHeight / 2 - 15);

    // Fundo do nome com visual aprimorado - AGORA É UM QUADRADO PERFEITO
    const speakerBg = this.add.graphics();
    speakerBg.fillStyle(0x0d84ff, 0.9);
    speakerBg.fillRoundedRect(-90, -20, 180, 40, { tl: 16, tr: 16, bl: 0, br: 0 });

    // Borda superior brilhante para destacar
    speakerBg.lineStyle(2, 0x39f5e2, 0.8);
    speakerBg.beginPath();
    speakerBg.moveTo(-90 + 5, -20);
    speakerBg.lineTo(90 - 5, -20);
    speakerBg.strokePath();

    speakerContainer.add(speakerBg);

    // Texto do nome do falante
    this.speakerName = this.add
      .text(0, 0, "", {
        fontSize: "20px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    speakerContainer.add(this.speakerName);
    this.dialogContainer.add(speakerContainer);

    // Texto de diálogo
    this.dialogText = this.add.text(width / 2 - dialogBoxWidth / 2 + 40, dialogY - dialogBoxHeight / 4, "", {
      fontSize: "20px",
      fontFamily: this.fontFamily,
      fill: "#FFFFFF",
      wordWrap: { width: dialogBoxWidth - 80 },
      lineSpacing: 8,
    });
    this.dialogContainer.add(this.dialogText);

    // Indicador de digitação (cursor piscando)
    this.typingIndicator = this.add.graphics();
    this.typingIndicator.fillStyle(0xffffff, 1);
    this.typingIndicator.fillRect(0, 0, 8, 20);
    this.typingIndicator.setVisible(false);
    this.dialogContainer.add(this.typingIndicator);

    // Adicionar botões de navegação completamente redesenhados
    this.createNavigationButtons(width, dialogY, dialogBoxHeight);

    // Criar o indicador de "continuar" como um graphics object em vez de imagem
    this.continueIndicator = this.add.graphics();
    this.continueIndicator.setVisible(false);
    this.dialogContainer.add(this.continueIndicator);

    // Criação do efeito de destaque para o botão continuar
    this.continueBtnHighlight = this.add.graphics();
    this.continueBtnHighlight.setVisible(false);
    this.dialogContainer.add(this.continueBtnHighlight);
  };

  /**
   * Cria botões de navegação com design completamente novo
   * @param {number} width - Largura da tela
   * @param {number} dialogY - Posição Y da caixa de diálogo
   * @param {number} dialogBoxHeight - Altura da caixa de diálogo
   */
  conversation.prototype.createNavigationButtons = function (width, dialogY, dialogBoxHeight) {
    // Container para os botões
    this.buttonsContainer = this.add.container(0, 0);
    this.dialogContainer.add(this.buttonsContainer);

    // Configurações compartilhadas
    const buttonConfig = {
      width: 150,
      height: 40,
      fontSize: 18,
      y: dialogY + dialogBoxHeight / 2 - 30,
    };

    // Criar botão VOLTAR
    this.prevButton = this.createModernButton(width / 2 - 150, buttonConfig.y, "VOLTAR", () => this.prevDialog(), {
      width: buttonConfig.width,
      height: buttonConfig.height,
      fontSize: buttonConfig.fontSize,
      color: "#FFFFFF",
      primaryColor: 0x0d84ff,
      secondaryColor: 0x39f5e2,
      stroke: 0x39f5e2,
    });

    // Adicionar ao container
    this.buttonsContainer.add(this.prevButton.container);

    // Criar botão CONTINUAR
    this.nextButton = this.createModernButton(width / 2 + 150, buttonConfig.y, "CONTINUAR", () => this.nextDialog(), {
      width: buttonConfig.width,
      height: buttonConfig.height,
      fontSize: buttonConfig.fontSize,
      color: "#FFFFFF",
      primaryColor: 0x0d84ff,
      secondaryColor: 0x39f5e2,
      stroke: 0x39f5e2,
    });

    // Adicionar ao container
    this.buttonsContainer.add(this.nextButton.container);

    // Iniciar com o botão "Voltar" invisível
    this.prevButton.container.setVisible(false);
  };

  /**
   * Cria um botão com design moderno e efeitos
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função a chamar quando clicado
   * @param {Object} config - Configurações do botão
   * @returns {Object} - Objeto com componentes do botão
   */
  conversation.prototype.createModernButton = function (x, y, text, callback, config = {}) {
    // Valores padrão
    const options = {
      width: 200,
      height: 50,
      fontSize: 18,
      color: "#FFFFFF",
      primaryColor: 0x0d84ff, // Cor principal
      secondaryColor: 0x39f5e2, // Cor secundária
      stroke: 0x39f5e2, // Cor da borda
      shadowColor: 0x000000, // Cor da sombra
      ...config,
    };

    // Container principal
    const container = this.add.container(x, y);

    // Sombra
    const shadow = this.add.graphics();
    shadow.fillStyle(options.shadowColor, 0.4);
    shadow.fillRoundedRect(-options.width / 2 + 3, -options.height / 2 + 3, options.width, options.height, 10);
    container.add(shadow);

    // Background do botão
    const background = this.add.graphics();
    background.fillStyle(options.primaryColor, 1);
    background.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);

    // Borda
    background.lineStyle(2, options.stroke, 1);
    background.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);

    container.add(background);

    // Efeito de destaque na parte superior
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.3);
    highlight.fillRoundedRect(-options.width / 2 + 4, -options.height / 2 + 4, options.width - 8, options.height / 3, { tl: 8, tr: 8, bl: 0, br: 0 });
    container.add(highlight);

    // Texto
    const buttonText = this.add
      .text(0, 0, text, {
        fontSize: `${options.fontSize}px`,
        fontFamily: this.fontFamily,
        fill: options.color,
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    container.add(buttonText);

    // Linha de brilho na parte inferior
    const bottomGlow = this.add.graphics();
    bottomGlow.lineStyle(2, options.secondaryColor, 0.5);
    bottomGlow.beginPath();
    bottomGlow.moveTo(-options.width / 2 + 10, options.height / 2 - 3);
    bottomGlow.lineTo(options.width / 2 - 10, options.height / 2 - 3);
    bottomGlow.strokePath();
    container.add(bottomGlow);

    // Tornar o botão interativo
    container.setInteractive(new Phaser.Geom.Rectangle(-options.width / 2, -options.height / 2, options.width, options.height), Phaser.Geom.Rectangle.Contains);

    // Estado do botão
    const buttonState = {
      isOver: false,
      isDown: false,
      originalScale: 1,
    };

    // Eventos do mouse
    container.on("pointerover", () => {
      buttonState.isOver = true;
      this.updateButtonVisual(container, background, buttonText, options, buttonState);
    });

    container.on("pointerout", () => {
      buttonState.isOver = false;
      buttonState.isDown = false;
      this.updateButtonVisual(container, background, buttonText, options, buttonState);
    });

    container.on("pointerdown", () => {
      buttonState.isDown = true;
      this.updateButtonVisual(container, background, buttonText, options, buttonState);
    });

    container.on("pointerup", () => {
      if (buttonState.isDown && buttonState.isOver) {
        // Adicionar efeito de clique
        this.tweens.add({
          targets: container,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 50,
          yoyo: true,
          onComplete: () => {
            // Chamar callback
            if (callback) callback();

            // Restaurar estado após o clique
            buttonState.isDown = false;
            this.updateButtonVisual(container, background, buttonText, options, buttonState);
          },
        });
      } else {
        buttonState.isDown = false;
        this.updateButtonVisual(container, background, buttonText, options, buttonState);
      }
    });

    // Retornar componentes do botão para acesso posterior
    return {
      container,
      background,
      text: buttonText,
      state: buttonState,
      options,
    };
  };

  /**
   * Atualiza o visual do botão com base no estado
   * @param {Phaser.GameObjects.Container} container - Container do botão
   * @param {Phaser.GameObjects.Graphics} background - Fundo do botão
   * @param {Phaser.GameObjects.Text} text - Texto do botão
   * @param {Object} options - Configurações do botão
   * @param {Object} state - Estado atual do botão
   */
  conversation.prototype.updateButtonVisual = function (container, background, text, options, state) {
    // Limpar gráficos
    background.clear();

    if (state.isDown) {
      // Estado pressionado
      background.fillStyle(options.secondaryColor, 1);
      text.setColor("#111111"); // Texto escuro para contraste
    } else if (state.isOver) {
      // Estado hover
      background.fillStyle(0x24a2ff, 1); // Azul mais brilhante
      text.setColor("#FFFFFF");

      // Escalar suavemente para cima
      if (container.scaleX === 1) {
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100,
          ease: "Power1",
        });
      }
    } else {
      // Estado normal
      background.fillStyle(options.primaryColor, 1);
      text.setColor("#FFFFFF");

      // Retornar à escala normal
      if (container.scaleX !== 1) {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          ease: "Power1",
        });
      }
    }

    // Redesenhar o fundo
    background.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);

    // Redesenhar a borda
    background.lineStyle(2, options.stroke, 1);
    background.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 10);
  };

  /**
   * Recria a interface de diálogo quando a tela é redimensionada
   * @param {number} width - Nova largura
   * @param {number} height - Nova altura
   */
  conversation.prototype.recreateDialogInterface = function (width, height) {
    try {
      // Verificar se o dialogContainer existe
      if (!this.dialogContainer) return;

      // Salvar o estado atual para restaurar depois
      const currentDialogText = this.dialogText ? this.dialogText.text : "";
      const currentSpeakerName = this.speakerName ? this.speakerName.text : "";

      // Remover elementos antigos com segurança
      this.dialogContainer.removeAll(true);

      // Criar nova interface de diálogo
      this.createDialogInterface(width, height);

      // Restaurar textos
      if (this.dialogText && currentDialogText) {
        this.dialogText.setText(currentDialogText);
      }

      if (this.speakerName && currentSpeakerName) {
        this.speakerName.setText(currentSpeakerName);
      }

      // Atualizar visibilidade dos botões
      if (this.prevButton && this.prevButton.container) {
        this.prevButton.container.setVisible(this.dialogIndex > 0);
      }

      // Atualizar visibilidade do indicador de continuar
      if (this.continueIndicator) {
        this.continueIndicator.setVisible(!this.isTyping);

        // Se não estamos digitando, mostrar também o destaque do botão
        if (!this.isTyping && this.nextButton && this.nextButton.container) {
          // Redesenhar o indicador de continuar (a caixa azul)
          this.continueIndicator.clear();

          const btnWidth = this.nextButton.options.width;
          const btnHeight = this.nextButton.options.height;
          const btnX = this.nextButton.container.x;
          const btnY = this.nextButton.container.y;

          this.continueIndicator.fillStyle(0x0d489f, 0.3);
          this.continueIndicator.fillRoundedRect(btnX - btnWidth / 2 - 5, btnY - btnHeight / 2 - 5, btnWidth + 10, btnHeight + 10, 12);

          this.continueIndicator.lineStyle(2, 0x3fa7cd, 0.8);
          this.continueIndicator.strokeRoundedRect(btnX - btnWidth / 2 - 5, btnY - btnHeight / 2 - 5, btnWidth + 10, btnHeight + 10, 12);

          this.continueIndicator.setVisible(true);
        }
      }

      // Atualizar animação do cursor de digitação
      this.setupAnimations();
    } catch (error) {
      console.error("Erro ao recriar interface de diálogo:", error);
    }
  };

  /**
   * Verifica se o clique foi em um botão para evitar avanço acidental do diálogo
   * @param {Phaser.Input.Pointer} pointer - O ponteiro (mouse/touch) atual
   * @returns {boolean} - Verdadeiro se o clique foi em um botão
   */
  conversation.prototype.isClickingButton = function (pointer) {
    if (!this.nextButton || !this.nextButton.container) return false;

    const nextBounds = this.nextButton.container.getBounds();

    if (this.prevButton && this.prevButton.container && this.prevButton.container.visible) {
      const prevBounds = this.prevButton.container.getBounds();
      if (Phaser.Geom.Rectangle.Contains(prevBounds, pointer.x, pointer.y)) {
        return true;
      }
    }

    return Phaser.Geom.Rectangle.Contains(nextBounds, pointer.x, pointer.y);
  };

  console.log("✅ Interface de Conversação carregada");
})();
