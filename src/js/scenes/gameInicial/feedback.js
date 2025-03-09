/**
 * Módulo de feedback para o mini-game de identificação de dados pessoais e sensíveis
 */
(function () {
  /**
   * Cria o painel de feedback
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  gameInicial.prototype.createFeedbackPanel = function (width, height) {
    // Dimensões e posição do painel
    const panelWidth = width * 0.8;
    const panelHeight = height * 0.38; // Aumentado para melhor espaçamento
    const panelX = width / 2;
    const panelY = height / 2 - 30;

    // Container do painel
    this.feedbackPanel = this.add.container(0, 0);
    this.gameContainer.add(this.feedbackPanel);

    // Efeito de brilho externo
    const outerGlow = this.add.graphics();
    outerGlow.lineStyle(6, this.colors.secondary, 0.2);
    outerGlow.strokeRoundedRect(panelX - panelWidth / 2 - 5, panelY - panelHeight / 2 - 5, panelWidth + 10, panelHeight + 10, 20);
    this.feedbackPanel.add(outerGlow);

    // Animar o brilho externo
    this.tweens.add({
      targets: outerGlow,
      alpha: { from: 0.2, to: 0.5 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });

    // Fundo do painel com efeito de profundidade
    const panelShadow = this.add
      .graphics()
      .fillStyle(0x000000, 0.5)
      .fillRoundedRect(panelX - panelWidth / 2 + 10, panelY - panelHeight / 2 + 10, panelWidth, panelHeight, 16);

    this.feedbackPanel.add(panelShadow);

    // Fundo do painel de feedback com gradiente
    const feedbackBg = this.add.graphics();

    // Criar gradiente simulado
    for (let i = 0; i < 4; i++) {
      const alpha = 0.9 - i * 0.05;
      feedbackBg.fillStyle(this.colors.dark, alpha);
      feedbackBg.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2 + (i * panelHeight) / 4, panelWidth, panelHeight / 4, i === 0 ? { tl: 16, tr: 16, bl: 0, br: 0 } : i === 3 ? { tl: 0, tr: 0, bl: 16, br: 16 } : 0);
    }

    this.feedbackPanel.add(feedbackBg);

    // Borda do painel variável (muda com resposta certa/errada)
    this.feedbackBorder = this.add.graphics();
    this.feedbackPanel.add(this.feedbackBorder);

    // Efeito de escaneamento/linhas
    const scanlines = this.add.graphics();
    scanlines.lineStyle(1, 0x39f5e2, 0.05);

    // Linhas horizontais
    for (let y = panelY - panelHeight / 2; y < panelY + panelHeight / 2; y += 4) {
      scanlines.beginPath();
      scanlines.moveTo(panelX - panelWidth / 2 + 5, y);
      scanlines.lineTo(panelX + panelWidth / 2 - 5, y);
      scanlines.strokePath();
    }

    this.feedbackPanel.add(scanlines);

    // Ícones de feedback estilizados
    this.correctIcon = this.add
      .image(panelX, panelY - panelHeight / 2 + 60, "correct_icon")
      .setScale(0.5)
      .setVisible(false);

    this.wrongIcon = this.add
      .image(panelX, panelY - panelHeight / 2 + 60, "wrong_icon")
      .setScale(0.5)
      .setVisible(false);

    // Adicionar efeito de brilho em torno dos ícones
    this.correctIconGlow = this.add.graphics();
    this.correctIconGlow.fillStyle(0x4caf50, 0.3);
    this.correctIconGlow.fillCircle(panelX, panelY - panelHeight / 2 + 60, 40);
    this.correctIconGlow.setVisible(false);

    this.wrongIconGlow = this.add.graphics();
    this.wrongIconGlow.fillStyle(0xff3a3a, 0.3);
    this.wrongIconGlow.fillCircle(panelX, panelY - panelHeight / 2 + 60, 40);
    this.wrongIconGlow.setVisible(false);

    this.feedbackPanel.add([this.correctIconGlow, this.wrongIconGlow, this.correctIcon, this.wrongIcon]);

    // Texto de feedback com estilo melhorado
    this.feedbackTitle = this.add
      .text(panelX, panelY - 30, "", {
        fontSize: "28px",
        fontFamily: this.fontFamily,
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Plano de fundo para o texto de explicação
    const explanationBg = this.add.graphics();
    explanationBg.fillStyle(0x111111, 0.3);
    explanationBg.fillRoundedRect(panelX - panelWidth / 2 + 30, panelY + 10, panelWidth - 60, panelHeight / 2 - 20, 8);
    this.feedbackPanel.add(explanationBg);

    this.feedbackText = this.add
      .text(panelX, panelY + 20, "", {
        fontSize: "16px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
        wordWrap: { width: panelWidth - 80 },
        lineSpacing: 6,
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0);

    this.feedbackPanel.add([this.feedbackTitle, this.feedbackText]);

    // Botão para próxima pergunta com estilo aprimorado
    this.nextButton = this.createCyberButton(panelX, panelY + panelHeight / 2 - 30, "PRÓXIMA QUESTÃO", () => this.nextQuestion(), {
      width: 240,
      height: 50,
      fontSize: 18,
      primaryColor: this.colors.primary,
      secondaryColor: this.colors.secondary,
      icon: "➡️",
    });

    this.feedbackPanel.add(this.nextButton);

    // Inicialmente oculto
    this.feedbackPanel.setVisible(false);
  };

  /**
   * Prepara o feedback para a resposta
   * @param {boolean} isCorrect - Se a resposta está correta
   * @param {Object} question - A questão atual
   */
  gameInicial.prototype.prepareFeedback = function (isCorrect, question) {
    // Mostrar ícone e glow apropriados
    this.correctIcon.setVisible(isCorrect);
    this.correctIconGlow.setVisible(isCorrect);
    this.wrongIcon.setVisible(!isCorrect);
    this.wrongIconGlow.setVisible(!isCorrect);

    // Animar o glow do ícone
    if (isCorrect) {
      this.tweens.add({
        targets: this.correctIconGlow,
        alpha: { from: 0.3, to: 0.6 },
        scale: { from: 1, to: 1.2 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
      });

      // Animar o ícone
      this.tweens.add({
        targets: this.correctIcon,
        scale: { from: 0.5, to: 0.55 },
        angle: { from: -5, to: 5 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.tweens.add({
        targets: this.wrongIconGlow,
        alpha: { from: 0.3, to: 0.6 },
        scale: { from: 1, to: 1.2 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
      });

      // Animar o ícone
      this.tweens.add({
        targets: this.wrongIcon,
        scale: { from: 0.5, to: 0.55 },
        angle: { from: -5, to: 5 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    }

    // Configurar a borda do painel de feedback
    this.feedbackBorder.clear();
    const borderColor = isCorrect ? this.colors.positive : this.colors.negative;

    // Desenhar a borda
    const width = this.screenWidth;
    const height = this.screenHeight;
    const panelWidth = width * 0.8;
    const panelHeight = height * 0.38;
    const panelX = width / 2;
    const panelY = height / 2 - 30;

    this.feedbackBorder.lineStyle(3, borderColor, 1);
    this.feedbackBorder.strokeRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 16);

    // Adicionar detalhes decorativos à borda
    this.feedbackBorder.lineStyle(2, borderColor, 0.7);

    // Linhas angulares nos cantos (estilo tech/cyber)
    this.feedbackBorder.beginPath();
    this.feedbackBorder.moveTo(panelX - panelWidth / 2 + 5, panelY - panelHeight / 2 + 5);
    this.feedbackBorder.lineTo(panelX - panelWidth / 2 + 25, panelY - panelHeight / 2 + 5);
    this.feedbackBorder.lineTo(panelX - panelWidth / 2 + 25, panelY - panelHeight / 2 + 25);
    this.feedbackBorder.strokePath();

    this.feedbackBorder.beginPath();
    this.feedbackBorder.moveTo(panelX + panelWidth / 2 - 5, panelY - panelHeight / 2 + 5);
    this.feedbackBorder.lineTo(panelX + panelWidth / 2 - 25, panelY - panelHeight / 2 + 5);
    this.feedbackBorder.lineTo(panelX + panelWidth / 2 - 25, panelY - panelHeight / 2 + 25);
    this.feedbackBorder.strokePath();

    this.feedbackBorder.beginPath();
    this.feedbackBorder.moveTo(panelX - panelWidth / 2 + 5, panelY + panelHeight / 2 - 5);
    this.feedbackBorder.lineTo(panelX - panelWidth / 2 + 25, panelY + panelHeight / 2 - 5);
    this.feedbackBorder.lineTo(panelX - panelWidth / 2 + 25, panelY + panelHeight / 2 - 25);
    this.feedbackBorder.strokePath();

    this.feedbackBorder.beginPath();
    this.feedbackBorder.moveTo(panelX + panelWidth / 2 - 5, panelY + panelHeight / 2 - 5);
    this.feedbackBorder.lineTo(panelX + panelWidth / 2 - 25, panelY + panelHeight / 2 - 5);
    this.feedbackBorder.lineTo(panelX + panelWidth / 2 - 25, panelY + panelHeight / 2 - 25);
    this.feedbackBorder.strokePath();

    // Texto de feedback
    this.feedbackTitle.setText(isCorrect ? "CORRETO!" : "INCORRETO!");
    this.feedbackTitle.setColor(isCorrect ? "#4CAF50" : "#FF5252");

    // Adicionar partículas de feedback para tornar mais vívido
    try {
      const particles = this.add.particles("data_icon");

      // Configurações com base no resultado
      const particleConfig = {
        x: panelX,
        y: panelY - panelHeight / 2 + 60,
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.1, end: 0 },
        blendMode: "ADD",
        lifespan: 1000,
        quantity: 5,
        frequency: 100,
        tint: isCorrect ? 0x4caf50 : 0xff5252,
      };

      // Criar emitter
      const feedbackEmitter = particles.createEmitter(particleConfig);

      // Parar após alguns instantes
      this.time.delayedCall(1500, () => {
        feedbackEmitter.stop();
        this.time.delayedCall(1000, () => {
          particles.destroy();
        });
      });

      this.feedbackPanel.add(particles);
    } catch (e) {
      console.warn("Não foi possível criar sistema de partículas:", e);
    }

    // Melhorar texto de explicação
    const explanationText = question.explanation;

    // Verificar se a resposta contém dados sensíveis para adicionar formatação mais clara
    let formattedExplanation = explanationText;
    if (question.hasSensitiveData) {
      // Destacar quais são os dados sensíveis na explicação
      formattedExplanation = explanationText.replace(/(religi[ãoões]|saúde|raça|etnia|opini[ãoões] política|vida sexual|genética|biometria|dados de crian[çc]as|adolescentes)/gi, (match) => `[${match}]`);
    }

    this.feedbackText.setText(formattedExplanation);

    // Animar a entrada do texto
    this.typewriterEffect(this.feedbackText, formattedExplanation);
  };

  /**
   * Cria um efeito de digitação para o texto
   * @param {Phaser.GameObjects.Text} textObject - Objeto de texto
   * @param {string} fullText - Texto completo
   */
  gameInicial.prototype.typewriterEffect = function (textObject, fullText) {
    // Limpar o texto inicial
    textObject.setText("");

    // Dividir o texto em caracteres
    const characters = fullText.split("");
    let index = 0;

    // Guarda a referência do temporizador
    let timer;

    // Função para adicionar um caractere
    const addNextChar = () => {
      if (index < characters.length) {
        textObject.setText(textObject.text + characters[index]);
        index++;

        // Velocidade variável - pauses para pontuação
        let delay = 25;
        const currentChar = characters[index - 1];

        if ([".", "!", "?"].includes(currentChar)) {
          delay = 250;
        } else if ([",", ";", ":"].includes(currentChar)) {
          delay = 150;
        }

        // Som de digitação (se disponível)
        if (this.sound.get("select") && index % 5 === 0) {
          this.sound.play("select", { volume: 0.1 });
        }

        timer = this.time.delayedCall(delay, addNextChar);
      }
    };

    // Iniciar a digitação
    timer = this.time.delayedCall(200, addNextChar);

    // Permitir que o jogador pule a animação clicando no texto
    textObject.setInteractive();
    textObject.once("pointerdown", () => {
      if (timer) timer.remove();
      textObject.setText(fullText);
    });
  };

  /**
   * Faz a transição da questão para o feedback
   */
  gameInicial.prototype.transitionToFeedback = function () {
    // Ocultar botões de resposta
    this.tweens.add({
      targets: this.buttonContainer,
      alpha: 0,
      y: this.buttonContainer.y + 50,
      duration: 300,
      ease: "Power2",
      onComplete: () => {
        this.buttonContainer.setVisible(false);
      },
    });

    // Fade out do painel de questão
    this.tweens.add({
      targets: this.questionPanel,
      alpha: 0,
      scale: 0.95,
      duration: 300,
      ease: "Power2",
      onComplete: () => {
        this.questionPanel.setVisible(false);
        this.questionPanel.setAlpha(1);
        this.questionPanel.setScale(1);

        // Mostrar painel de feedback com animação
        this.feedbackPanel.setVisible(true);
        this.feedbackPanel.setAlpha(0);
        this.feedbackPanel.setScale(0.95);

        this.tweens.add({
          targets: this.feedbackPanel,
          alpha: 1,
          scale: 1,
          duration: 400,
          ease: "Back.easeOut",
        });
      },
    });
  };

  console.log("✅ Módulo de Feedback carregado");
})();
