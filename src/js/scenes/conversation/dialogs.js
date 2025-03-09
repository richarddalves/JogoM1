/**
 * Funções relacionadas aos diálogos da cena de conversação
 */
(function () {
  /**
   * Configura os diálogos da cena
   */
  conversation.prototype.setupDialogs = function () {
    this.dialogs = [
      {
        speaker: "Agente P.",
        text: "Bem-vindo à Agência Global de Proteção de Dados, recruta. Você foi selecionado por suas habilidades excepcionais e seu comprometimento com a privacidade digital.",
        character: "tutor",
        emotion: "neutral",
      },
      {
        speaker: "Agente P.",
        text: "A partir de hoje, você não é mais um civil comum. Seu codinome agora é DPO Hero - Oficial de Proteção de Dados.",
        character: "tutor",
        emotion: "proud",
      },
      {
        speaker: "DPO Hero",
        text: "É uma honra fazer parte desta agência. Estou pronto para proteger os dados dos cidadãos.",
        character: "agent",
        emotion: "determined",
      },
      {
        speaker: "Agente P.",
        text: "A situação é grave. A cada dia, milhões de pessoas têm suas informações expostas sem consentimento. Precisamos agir rapidamente.",
        character: "tutor",
        emotion: "serious",
      },
      {
        speaker: "Agente P.",
        text: "Nossa missão é garantir que a Lei Geral de Proteção de Dados seja respeitada em todos os lugares, assegurando a privacidade e os direitos fundamentais de cada cidadão.",
        character: "tutor",
        emotion: "determined",
      },
      {
        speaker: "Agente P.",
        text: "No canto superior da sua interface, você terá acesso ao seu dispositivo AGPD com os 10 mandamentos da LGPD. Este será seu guia essencial para todas as missões.",
        character: "tutor",
        emotion: "instructive",
        showDevice: true,
      },
      {
        speaker: "Agente P.",
        text: "Este dispositivo permite consultar a qualquer momento as principais diretrizes da Lei Geral de Proteção de Dados. Você deve memorizá-las, pois serão fundamentais para suas operações.",
        character: "tutor",
        emotion: "neutral",
      },
      {
        speaker: "DPO Hero",
        text: "Entendido. Estarei sempre atento para garantir que os dados pessoais sejam tratados com a devida proteção e respeito às normas da LGPD.",
        character: "agent",
        emotion: "confident",
      },
      {
        speaker: "Agente P.",
        text: "Excelente! Antes de enviá-lo à sua primeira missão, precisamos testar seus conhecimentos sobre conceitos fundamentais da proteção de dados.",
        character: "tutor",
        emotion: "pleased",
      },
      {
        speaker: "Agente P.",
        text: "Prepare-se para o treinamento inicial, DPO Hero. O futuro da privacidade digital está em suas mãos! Boa sorte, agente.",
        character: "tutor",
        emotion: "encouraging",
        final: true,
      },
    ];
  };

  /**
   * Configura controles de teclado para melhorar acessibilidade
   */
  conversation.prototype.setupKeyboardControls = function () {
    // Tecla espaço ou Enter para avançar o diálogo
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    spaceKey.on("down", () => {
      if (this.isTyping) {
        this.skipTypewriterEffect();
      } else {
        this.nextDialog();
      }
    });

    enterKey.on("down", () => {
      if (this.isTyping) {
        this.skipTypewriterEffect();
      } else {
        this.nextDialog();
      }
    });

    // Setas para navegação entre diálogos (apenas quando não estiver digitando)
    const rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    const leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    rightKey.on("down", () => {
      if (!this.isTyping) {
        this.nextDialog();
      }
    });

    leftKey.on("down", () => {
      if (!this.isTyping && this.dialogIndex > 0) {
        this.prevDialog();
      }
    });

    // Tecla P para acessar o dispositivo dos 10 mandamentos
    const pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    pKey.on("down", () => {
      if (this.deviceElements && this.deviceElements.device && this.deviceElements.device.visible) {
        // Simular clique no dispositivo
        if (typeof window.openPhone === "function") {
          window.openPhone();
        }
      }
    });
  };

  /**
   * Atualiza o diálogo atual
   */
  conversation.prototype.updateDialog = function () {
    // Verificar se ainda há questões
    if (this.dialogIndex >= this.dialogs.length) return;

    const currentDialog = this.dialogs[this.dialogIndex];

    // Atualizar nome do falante
    if (this.speakerName) {
      this.speakerName.setText(currentDialog.speaker);
    }

    // Limpar texto atual
    if (this.dialogText) {
      this.dialogText.setText("");
    }

    // Esconder destaque do botão
    if (this.continueBtnHighlight) {
      this.continueBtnHighlight.clear();
      this.continueBtnHighlight.setVisible(false);
    }

    // Mostrar o personagem correto e animar sua entrada
    this.showCharacter(currentDialog.character);

    // Iniciar efeito de digitação para o texto
    this.typewriterEffect(currentDialog.text);

    // Mostrar dispositivo do agente se necessário
    if (currentDialog.showDevice) {
      this.showAgentDevice();
    }

    // Atualizar visibilidade dos botões
    if (this.prevButton && this.prevButton.container) {
      this.prevButton.container.setVisible(this.dialogIndex > 0);
    }

    // Ocultar o indicador "continue" durante a digitação
    if (this.continueIndicator) {
      this.continueIndicator.setVisible(false);
    }
  };

  /**
   * Avança para o próximo diálogo com transições visuais aprimoradas
   */
  conversation.prototype.nextDialog = function () {
    // Se estiver digitando, mostrar o texto completo
    if (this.isTyping) {
      this.skipTypewriterEffect();
      return;
    }

    // Esconder destaque do botão continuar
    if (this.continueBtnHighlight) {
      this.continueBtnHighlight.clear();
      this.continueBtnHighlight.setVisible(false);
    }

    // Avançar para o próximo diálogo
    if (this.dialogIndex < this.dialogs.length - 1) {
      // Efeito visual de transição (agora focado no botão de continuar)
      if (this.nextButton && this.nextButton.container) {
        const btnBounds = this.nextButton.container.getBounds();

        // Criar o flash em volta do botão continuar
        const flash = this.add.graphics();
        flash.fillStyle(0xffffff, 0.3);
        flash.fillRoundedRect(btnBounds.x - 5, btnBounds.y - 5, btnBounds.width + 10, btnBounds.height + 10, 12);

        this.tweens.add({
          targets: flash,
          alpha: 0,
          duration: 300,
          onComplete: () => flash.destroy(),
        });
      }

      // Efeito de transição para o próximo diálogo
      this.dialogText.setAlpha(1);

      this.tweens.add({
        targets: this.dialogText,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.dialogIndex++;
          this.updateDialog();

          // Fade in do novo texto
          this.dialogText.setAlpha(0);
          this.tweens.add({
            targets: this.dialogText,
            alpha: 1,
            duration: 200,
          });
        },
      });

      // Se houver um nome de falante, animar a transição
      if (this.speakerName) {
        this.tweens.add({
          targets: this.speakerName,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            this.tweens.add({
              targets: this.speakerName,
              alpha: 1,
              duration: 200,
            });
          },
        });
      }
    } else {
      // Completar diálogo e iniciar o jogo com efeito de transição mais elaborado
      this.completeIntroduction();
    }
  };

  /**
   * Volta para o diálogo anterior
   */
  conversation.prototype.prevDialog = function () {
    if (this.dialogIndex > 0) {
      // Esconder destaque do botão continuar
      if (this.continueBtnHighlight) {
        this.continueBtnHighlight.clear();
        this.continueBtnHighlight.setVisible(false);
      }

      // Efeito visual de transição (agora focado no botão voltar)
      if (this.prevButton && this.prevButton.container) {
        const btnBounds = this.prevButton.container.getBounds();

        // Criar o flash em volta do botão voltar
        const flash = this.add.graphics();
        flash.fillStyle(0xffffff, 0.3);
        flash.fillRoundedRect(btnBounds.x - 5, btnBounds.y - 5, btnBounds.width + 10, btnBounds.height + 10, 12);

        this.tweens.add({
          targets: flash,
          alpha: 0,
          duration: 300,
          onComplete: () => flash.destroy(),
        });
      }

      // Animar transição
      this.tweens.add({
        targets: this.dialogText,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.dialogIndex--;
          this.updateDialog();

          // Fade in do novo texto
          this.dialogText.setAlpha(0);
          this.tweens.add({
            targets: this.dialogText,
            alpha: 1,
            duration: 200,
          });
        },
      });

      // Se houver um nome de falante, animar a transição
      if (this.speakerName) {
        this.tweens.add({
          targets: this.speakerName,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            this.tweens.add({
              targets: this.speakerName,
              alpha: 1,
              duration: 200,
            });
          },
        });
      }
    }
  };

  /**
   * Finaliza a introdução e passa para a próxima cena com transição aprimorada
   */
  conversation.prototype.completeIntroduction = function () {
    // Fade out de todos os elementos com timing escalonado
    this.tweens.add({
      targets: [this.dialogContainer, this.deviceContainer],
      alpha: 0,
      duration: 800,
      ease: "Power2",
    });

    // Pequeno atraso antes de animar os personagens
    this.time.delayedCall(300, () => {
      this.tweens.add({
        targets: this.charactersContainer,
        alpha: 0,
        duration: 800,
        ease: "Power2",
      });
    });

    // Flash de luz para efeito dramático antes da transição
    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 0);
    flash.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    this.tweens.add({
      targets: flash,
      fillAlpha: { from: 0, to: 0.3 },
      duration: 300,
      delay: 700,
      yoyo: true,
      onComplete: () => {
        flash.destroy();

        // Fade out da cena
        this.cameras.main.fadeOut(800, 0, 0, 0);
      },
    });

    // Transição para a próxima cena
    this.time.delayedCall(1800, () => {
      this.scene.start("gameInicial");
    });
  };

  console.log("✅ Diálogos de Conversação carregados");
})();
