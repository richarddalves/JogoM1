/**
 * Funções relacionadas ao efeito de máquina de escrever para diálogos
 */
(function () {
  /**
   * Configura as animações iniciais da cena
   */
  conversation.prototype.setupAnimations = function () {
    // Animar cursor de digitação
    this.typingAnimation = this.tweens.add({
      targets: this.typingIndicator,
      alpha: { from: 1, to: 0 },
      duration: 500,
      repeat: -1,
      yoyo: true,
      paused: true,
    });
  };

  /**
   * Anima a exibição gradual do texto (efeito máquina de escrever)
   * @param {string} text - O texto completo a ser exibido
   */
  conversation.prototype.typewriterEffect = function (text) {
    // Verificar se o texto é válido
    if (!text || typeof text !== "string") {
      text = "..."; // Substitui por texto padrão se não for válido
    }

    // Verificar se dialogText existe
    if (!this.dialogText) return;

    this.isTyping = true;
    this.dialogText.setText("");

    if (this.continueIndicator) {
      this.continueIndicator.setVisible(false);
    }

    // Posicionar o cursor de digitação
    if (this.typingIndicator) {
      this.typingIndicator.setPosition(this.dialogText.x, this.dialogText.y);
      this.typingIndicator.setVisible(true);

      if (this.typingAnimation) {
        this.typingAnimation.play();
      }
    }

    // Função para calcular a posição do cursor corretamente
    const updateCursorPosition = () => {
      if (!this.typingIndicator || !this.dialogText) return;

      // Calcular a posição com base no texto atual
      const currentText = this.dialogText.text;

      // Criar um texto temporário para medir
      const tempText = this.add.text(0, 0, currentText, this.dialogText.style);
      const textWidth = tempText.width;

      // Obter a linha atual (conta quebras de linha)
      const lines = currentText.split("\n");
      const currentLine = lines[lines.length - 1];

      // Calcular a posição Y com base no número de linhas
      const lineHeight = tempText.height / Math.max(1, lines.length);
      const posY = this.dialogText.y + (lines.length - 1) * lineHeight;

      // Posicionar na última linha, após o último caractere
      let posX;
      if (lines.length > 1) {
        // Se houver múltiplas linhas, medir apenas a última
        tempText.setText(currentLine);
        posX = this.dialogText.x + tempText.width;
      } else {
        // Caso contrário, usar o texto completo
        posX = this.dialogText.x + textWidth;
      }

      // Atualizar posição do cursor
      this.typingIndicator.setPosition(posX, posY);

      // Remover o texto temporário
      tempText.destroy();
    };

    let currentChar = 0;
    const fullText = text;

    // Limpar timer anterior se existir
    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
    }

    // Função para adicionar caracteres gradualmente
    const typeChar = () => {
      if (currentChar < fullText.length) {
        // Adicionar próximo caractere
        this.dialogText.setText(this.dialogText.text + fullText.charAt(currentChar));
        currentChar++;

        // Atualizar posição do cursor
        updateCursorPosition();

        // Velocidade variável para pausas naturais
        let delay = this.textSpeed;

        // Pausas mais longas para pontuação
        const currentCharacter = fullText.charAt(currentChar - 1);
        if ([".", "!", "?"].includes(currentCharacter)) {
          delay = 300;
        } else if ([",", ";", ":"].includes(currentCharacter)) {
          delay = 150;
        }

        // Continuar digitando
        this.typewriterTimer = this.time.delayedCall(delay, typeChar);
      } else {
        // Finalizar efeito
        if (this.typingIndicator) {
          this.typingIndicator.setVisible(false);
        }

        if (this.typingAnimation) {
          this.typingAnimation.pause();
        }

        this.isTyping = false;

        // Mostrar indicador de "continuar" e destaque do botão continuar
        if (this.continueIndicator && this.nextButton && this.nextButton.container) {
          // Limpar gráficos anteriores
          this.continueIndicator.clear();

          // Obter posição e dimensões do botão "Continuar"
          const btnWidth = this.nextButton.options.width;
          const btnHeight = this.nextButton.options.height;
          const btnX = this.nextButton.container.x;
          const btnY = this.nextButton.container.y;

          // Desenhar o destaque ao redor do botão "Continuar"
          // Cor interna semitransparente
          this.continueIndicator.fillStyle(0x0d489f, 0.3);
          this.continueIndicator.fillRoundedRect(btnX - btnWidth / 2 - 5, btnY - btnHeight / 2 - 5, btnWidth + 10, btnHeight + 10, 12);

          // Adicionar borda com cor diferente
          this.continueIndicator.lineStyle(2, 0x3fa7cd, 0.8);
          this.continueIndicator.strokeRoundedRect(btnX - btnWidth / 2 - 5, btnY - btnHeight / 2 - 5, btnWidth + 10, btnHeight + 10, 12);

          this.continueIndicator.setVisible(true);

          // Animar com efeito de pulso
          this.tweens.add({
            targets: this.continueIndicator,
            alpha: { from: 0.8, to: 0.4 },
            duration: 800,
            yoyo: true,
            repeat: -1,
          });
        }
      }
    };

    // Iniciar efeito
    this.typewriterTimer = this.time.delayedCall(200, typeChar);
  };

  /**
   * Pula o efeito de digitação e mostra o texto completo
   */
  conversation.prototype.skipTypewriterEffect = function () {
    if (!this.isTyping) return;

    // Parar o timer de digitação
    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
    }

    // Mostrar o texto completo
    const currentDialog = this.dialogs[this.dialogIndex];
    if (currentDialog && currentDialog.text && this.dialogText) {
      this.dialogText.setText(currentDialog.text);
    }

    // Esconder cursor e mostrar indicador de "continuar"
    if (this.typingIndicator) {
      this.typingIndicator.setVisible(false);
    }

    if (this.typingAnimation) {
      this.typingAnimation.pause();
    }

    this.isTyping = false;

    if (this.continueIndicator && this.nextButton && this.nextButton.container) {
      // Limpar gráficos anteriores
      this.continueIndicator.clear();

      // Obter posição e dimensões do botão "Continuar"
      const btnWidth = this.nextButton.options.width;
      const btnHeight = this.nextButton.options.height;
      const btnX = this.nextButton.container.x;
      const btnY = this.nextButton.container.y;

      // Desenhar o destaque ao redor do botão "Continuar"
      // Cor interna semitransparente
      this.continueIndicator.fillStyle(0x0d489f, 0.3);
      this.continueIndicator.fillRoundedRect(btnX - btnWidth / 2 - 5, btnY - btnHeight / 2 - 5, btnWidth + 10, btnHeight + 10, 12);

      // Adicionar borda com cor diferente
      this.continueIndicator.lineStyle(2, 0x3fa7cd, 0.8);
      this.continueIndicator.strokeRoundedRect(btnX - btnWidth / 2 - 5, btnY - btnHeight / 2 - 5, btnWidth + 10, btnHeight + 10, 12);

      this.continueIndicator.setVisible(true);
      this.continueIndicator.setAlpha(0);

      // Animar aparecimento com efeito de pulso
      this.tweens.add({
        targets: this.continueIndicator,
        alpha: 0.8,
        duration: 300,
        ease: "Back.easeOut",
        onComplete: () => {
          this.tweens.add({
            targets: this.continueIndicator,
            alpha: { from: 0.8, to: 0.4 },
            duration: 800,
            yoyo: true,
            repeat: -1,
          });
        },
      });
    }
  };

  console.log("✅ Efeito de Digitação carregado");
})();
