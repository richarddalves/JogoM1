/**
 * Módulo de diálogos para a missão do jardim (COMPLETAMENTE REFORMULADO)
 */
(function () {
  /**
   * Inicia um diálogo
   * @param {Array} lines - Linhas de diálogo
   * @param {string} speaker - Nome do falante
   * @param {Function} callback - Função chamada ao finalizar
   */
  jardimMission.prototype.startDialog = function (lines, speaker, callback) {
    // Verificar se há linhas de diálogo
    if (!lines || lines.length === 0) {
      if (callback) callback();
      return;
    }

    // Inicializar objeto de diálogo se não existir
    if (!this.dialog) {
      this.dialog = {
        active: false,
        lines: [],
        currentLine: 0,
        speaker: null,
        callback: null,
        typing: false,
        typewriterEffect: null,
      };
    }

    // Verificar se dialogContainer existe
    if (!this.dialogContainer) {
      console.log("Criando sistema de diálogo que não foi inicializado");
      this.createEnhancedDialogSystem();
    }

    // Configurar diálogo
    this.dialog.active = true;
    this.dialog.lines = lines;
    this.dialog.currentLine = 0;
    this.dialog.speaker = speaker;
    this.dialog.callback = callback;
    this.dialog.typing = false;

    // Mostrar container de diálogo com animação
    this.showDialogContainer();

    // Ajustar avatar e nome do falante
    this.updateDialogSpeaker(speaker);

    // Mostrar primeira linha
    this.showDialogLine();

    // Configurar eventos de input
    this.configureDialogInput();

    // Mostrar indicador visual de como prosseguir
    this.showDialogHint();

    // Desativar temporariamente outros elementos de interface
    this.temporarilyDisableUI();
  };

  /**
   * Mostra o container de diálogo com animação
   */
  jardimMission.prototype.showDialogContainer = function () {
    if (!this.dialogContainer) {
      console.warn("Container de diálogo não inicializado");
      return;
    }

    this.dialogContainer.setVisible(true);
    this.dialogContainer.setAlpha(0);
    this.dialogContainer.y += 50; // Começa deslocado para baixo

    // Animar entrada
    this.tweens.add({
      targets: this.dialogContainer,
      alpha: 1,
      y: "-=50",
      duration: 400,
      ease: "Back.easeOut",
    });
  };

  /**
   * Atualiza o falante do diálogo com efeitos visuais
   * @param {string} speaker - Nome do falante
   */
  jardimMission.prototype.updateDialogSpeaker = function (speaker) {
    // Verificar se componentes existem
    if (!this.dialogAvatar || !this.dialogName) {
      console.warn("Componentes de diálogo não inicializados");
      return;
    }

    // Avatar e nome baseados no falante
    let avatarKey, avatarFrame, nameColor;

    if (speaker === "Professor Silva") {
      avatarKey = "professor";
      avatarFrame = 0;
      nameColor = "#39f5e2";
    } else {
      // Avatar padrão para outros falantes
      avatarKey = "personagem";
      avatarFrame = 18;
      nameColor = "#FFFFFF";
    }

    // Atualizar avatar com animação
    this.dialogAvatar.setAlpha(0);
    this.dialogAvatar.setScale(0.8);
    this.dialogAvatar.setTexture(avatarKey, avatarFrame);

    this.tweens.add({
      targets: this.dialogAvatar,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    // Atualizar nome com animação
    this.dialogName.setAlpha(0);
    this.dialogName.setText(speaker || "Você");
    this.dialogName.setColor(nameColor);

    this.tweens.add({
      targets: this.dialogName,
      alpha: 1,
      duration: 300,
    });
  };

  /**
   * Configura os inputs para avançar no diálogo
   */
  jardimMission.prototype.configureDialogInput = function () {
    // Verificar se dialogContainer existe
    if (!this.dialogContainer) {
      console.warn("Container de diálogo não inicializado");
      return;
    }

    // Remover eventos anteriores
    this.input.keyboard.off("keydown-SPACE");
    this.dialogContainer.removeAllListeners("pointerdown");

    // Adicionar evento de teclado (espaço)
    this.input.keyboard.on(
      "keydown-SPACE",
      () => {
        this.advanceDialog();
      },
      this
    );

    // Adicionar evento de clique no container de diálogo
    this.dialogContainer.setInteractive();
    this.dialogContainer.on(
      "pointerdown",
      () => {
        this.advanceDialog();
      },
      this
    );
  };

  /**
   * Mostra a linha atual do diálogo
   */
  jardimMission.prototype.showDialogLine = function () {
    // Verificar se dialogText existe
    if (!this.dialogText) {
      console.warn("Texto de diálogo não inicializado");
      return;
    }

    // Verificar se ainda há linhas
    if (this.dialog.currentLine >= this.dialog.lines.length) {
      this.endDialog();
      return;
    }

    // Obter linha atual
    const line = this.dialog.lines[this.dialog.currentLine];

    // Verificar se é uma linha com escolhas
    if (line.choices) {
      this.showDialogChoices(line);
    } else {
      // Linha normal de diálogo
      const text = line.text || line;

      // Limpar texto anterior
      this.dialogText.setText("");

      // Aplicar efeito de digitação aprimorado
      this.dialog.typing = true;
      this.typewriterEffect(this.dialogText, text, () => {
        this.dialog.typing = false;

        // Mostrar indicador de continuar após a digitação terminar
        this.highlightContinueIndicator();
      });
    }
  };

  /**
   * Destaca o indicador de continuar
   */
  jardimMission.prototype.highlightContinueIndicator = function () {
    // Verificar se dialogContinue existe
    if (!this.dialogContinue) {
      console.warn("Indicador de continuar não inicializado");
      return;
    }

    // Garantir que o indicador está visível
    this.dialogContinue.setAlpha(1);

    // Adicionar animação de pulsação para chamar atenção
    this.tweens.add({
      targets: this.dialogContinue,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });
  };

  /**
   * Mostra escolhas de diálogo com estilo aprimorado
   * @param {Object} line - Linha de diálogo com escolhas
   */
  jardimMission.prototype.showDialogChoices = function (line) {
    // Verificar se dialogText existe
    if (!this.dialogText) {
      console.warn("Texto de diálogo não inicializado");
      return;
    }

    // Desativar inputs padrão durante as escolhas
    this.input.keyboard.off("keydown-SPACE");
    this.dialogContainer.off("pointerdown");

    // Limpar texto
    this.dialogText.setText("");

    // Mostrar texto da pergunta com efeito de digitação
    if (line.text) {
      this.typewriterEffect(this.dialogText, line.text, () => {
        // Mostrar as escolhas após a pergunta ser digitada completamente
        this.showChoiceButtons(line.choices);
      });
    } else {
      // Se não houver texto de pergunta, mostrar escolhas imediatamente
      this.showChoiceButtons(line.choices);
    }
  };

  /**
   * Mostra os botões de escolha com estilo moderno
   * @param {Array} choices - Array de opções de escolha
   */
  jardimMission.prototype.showChoiceButtons = function (choices) {
    // Verificar se uiContainer existe
    if (!this.uiContainer) {
      console.warn("Container UI não inicializado");
      return;
    }

    // Container para as escolhas
    const choicesContainer = this.add.container(0, 0);
    choicesContainer.setDepth(160);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const spacing = 70; // Espaçamento aumentado entre as escolhas

    // Adicionar título de "Escolha uma opção" acima dos botões
    const choiceTitle = this.add
      .text(width / 2, height - 70 - choices.length * spacing - 40, "ESCOLHA UMA OPÇÃO:", {
        fontFamily: this.fontFamily || "'Chakra Petch', sans-serif",
        fontSize: "22px",
        color: this.colors.secondary,
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      })
      .setOrigin(0.5);

    choicesContainer.add(choiceTitle);

    // Adicionar efeito de entrada para o título
    choiceTitle.setAlpha(0);
    choiceTitle.setScale(0.8);

    this.tweens.add({
      targets: choiceTitle,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    // Posicionar e criar botões de escolha em sequência com delay
    choices.forEach((choice, index) => {
      const y = height - 70 - (choices.length - 1 - index) * spacing;

      // Criar botão moderno com efeitos
      const button = this.createModernChoiceButton(width / 2, y, choice.text, () => {
        // Processar escolha
        if (choice.onSelect) {
          choice.onSelect();
        }

        // Limpar escolhas com animação
        this.tweens.add({
          targets: choicesContainer,
          alpha: 0,
          y: "+=50",
          duration: 300,
          ease: "Back.easeIn",
          onComplete: () => {
            choicesContainer.destroy();
          },
        });

        // Avançar para a próxima linha ou para uma linha específica
        if (choice.nextLine !== undefined) {
          this.dialog.currentLine = choice.nextLine;
        } else {
          this.dialog.currentLine++;
        }

        // Reconfigurar inputs
        this.configureDialogInput();

        // Mostrar próxima linha
        this.showDialogLine();
      });

      // Adicionar atraso sequencial para cada botão aparecer
      button.setAlpha(0);
      button.setY(button.y + 30);

      this.tweens.add({
        targets: button,
        alpha: 1,
        y: "-=30",
        duration: 300,
        delay: 100 * index,
        ease: "Back.easeOut",
      });

      choicesContainer.add(button);
    });

    // Adicionar à UI
    this.uiContainer.add(choicesContainer);

    // Guardar referência à container de escolhas
    this.dialog.choicesContainer = choicesContainer;
  };

  /**
   * Cria um botão de escolha moderno com efeitos visuais
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função a ser chamada quando clicado
   * @returns {Phaser.GameObjects.Container} Container do botão
   */
  jardimMission.prototype.createModernChoiceButton = function (x, y, text, callback) {
    // Container para o botão
    const buttonContainer = this.add.container(x, y);

    // Fundo do botão com gradiente
    const buttonBg = this.add.graphics();

    // Dimensões do botão (maiores para acomodar textos longos)
    const width = 450;
    const height = 60;
    const cornerRadius = 15;

    // Desenhar fundo do botão com borda
    buttonBg.fillStyle(this.colors.primary, 0.9);
    buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

    buttonBg.lineStyle(3, this.colors.secondary, 1);
    buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

    // Adicionar efeito de gradiente/brilho no topo
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.3);
    highlight.fillRoundedRect(-width / 2 + 5, -height / 2 + 5, width - 10, height / 3, { tl: cornerRadius - 2, tr: cornerRadius - 2, bl: 0, br: 0 });

    // Texto do botão (usando wordWrap para textos longos)
    const buttonText = this.add
      .text(0, 0, text, {
        fontFamily: this.fontFamily || "'Chakra Petch', sans-serif",
        fontSize: "20px",
        fontWeight: "bold",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
        wordWrap: { width: width - 40 },
      })
      .setOrigin(0.5);

    // Adicionar componentes ao container
    buttonContainer.add([buttonBg, highlight, buttonText]);

    // Interatividade
    buttonContainer.setSize(width, height);
    buttonContainer.setInteractive({ useHandCursor: true });

    // Eventos de hover
    buttonContainer.on("pointerover", () => {
      // Efeito de hover
      buttonBg.clear();
      buttonBg.fillStyle(this.colors.secondary, 0.9);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

      buttonBg.lineStyle(3, this.colors.primary, 1);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

      buttonText.setColor("#000000");
      buttonText.setStroke("#FFFFFF", 2);

      // Efeito de escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: "Sine.easeOut",
      });

      // Adicionar ícone de seleção
      if (!buttonContainer.selectionIcon) {
        const icon = this.add
          .text(-width / 2 + 30, 0, "➤", {
            fontSize: "24px",
            color: "#000000",
          })
          .setOrigin(0.5);

        buttonContainer.add(icon);
        buttonContainer.selectionIcon = icon;

        // Animar entrada do ícone
        icon.setAlpha(0);
        icon.setX(icon.x - 10);

        this.tweens.add({
          targets: icon,
          alpha: 1,
          x: "+=10",
          duration: 200,
        });
      }
    });

    buttonContainer.on("pointerout", () => {
      // Restaurar aparência normal
      buttonBg.clear();
      buttonBg.fillStyle(this.colors.primary, 0.9);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

      buttonBg.lineStyle(3, this.colors.secondary, 1);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

      buttonText.setColor("#FFFFFF");
      buttonText.setStroke("#000000", 2);

      // Restaurar escala
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Sine.easeIn",
      });

      // Remover ícone de seleção
      if (buttonContainer.selectionIcon) {
        this.tweens.add({
          targets: buttonContainer.selectionIcon,
          alpha: 0,
          x: "-=10",
          duration: 200,
          onComplete: () => {
            buttonContainer.selectionIcon.destroy();
            buttonContainer.selectionIcon = null;
          },
        });
      }
    });

    buttonContainer.on("pointerdown", () => {
      // Efeito de click
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });
    });

    return buttonContainer;
  };

  /**
   * Avança para a próxima linha de diálogo
   */
  jardimMission.prototype.advanceDialog = function () {
    // Se estiver digitando, acelerar para o final
    if (this.dialog.typing) {
      // Se houver um efeito de digitação em andamento, pular para o final
      if (this.dialog.typewriterEffect) {
        this.dialog.typewriterEffect.skip();
      }
      return;
    }

    // Avançar para a próxima linha com animação
    this.animateDialogTransition(() => {
      this.dialog.currentLine++;
      this.showDialogLine();
    });
  };

  /**
   * Anima a transição entre linhas de diálogo
   */
  jardimMission.prototype.animateDialogTransition = function (callback) {
    // Verificar se dialogText existe
    if (!this.dialogText) {
      console.warn("Texto de diálogo não inicializado");
      if (callback) callback();
      return;
    }

    // Animar saída do texto atual
    this.tweens.add({
      targets: this.dialogText,
      alpha: 0,
      x: "+=20",
      duration: 200,
      onComplete: () => {
        // Resetar posição
        this.dialogText.setX(this.dialogText.x - 20);

        // Executar callback
        if (callback) callback();

        // Animar entrada do próximo texto
        this.tweens.add({
          targets: this.dialogText,
          alpha: 1,
          duration: 200,
        });
      },
    });
  };

  /**
   * Finaliza o diálogo atual
   */
  jardimMission.prototype.endDialog = function () {
    // Verificar se dialogContainer existe
    if (!this.dialogContainer) {
      console.warn("Container de diálogo não inicializado");
      return;
    }

    // Limpar estado do diálogo
    this.dialog.active = false;
    this.dialog.lines = [];
    this.dialog.currentLine = 0;
    this.dialog.typing = false;

    // Animar esconder o container de diálogo
    this.tweens.add({
      targets: this.dialogContainer,
      alpha: 0,
      y: "+=50",
      duration: 400,
      ease: "Back.easeIn",
      onComplete: () => {
        // Esconder container
        this.dialogContainer.setVisible(false);

        // Reativar elementos de UI
        this.reenableUI();

        // Chamar callback
        if (this.dialog.callback) {
          this.dialog.callback();
        }
      },
    });

    // Remover eventos de input
    this.input.keyboard.off("keydown-SPACE");
    this.dialogContainer.off("pointerdown");
  };

  /**
   * Desativa temporariamente elementos de UI durante o diálogo
   */
  jardimMission.prototype.temporarilyDisableUI = function () {
    // Guarda quais elementos estavam visíveis
    this.uiPreviousState = {
      objectiveBgVisible: this.objectiveBg ? this.objectiveBg.visible : false,
      helpBgVisible: this.helpBg ? this.helpBg.visible : false,
      menuBgVisible: this.menuBg ? this.menuBg.visible : false,
    };

    // Torna-os invisíveis com animação
    const uiElements = [this.objectiveBg, this.objectiveIcon, this.objectiveText, this.helpBg, this.helpIcon, this.menuBg, this.menuIcon].filter((el) => el && el.visible);

    if (uiElements.length > 0) {
      this.tweens.add({
        targets: uiElements,
        alpha: 0.3,
        duration: 300,
      });
    }
  };

  /**
   * Reativa elementos de UI após o diálogo
   */
  jardimMission.prototype.reenableUI = function () {
    // Restaura a visibilidade dos elementos
    const uiElements = [this.objectiveBg, this.objectiveIcon, this.objectiveText, this.helpBg, this.helpIcon, this.menuBg, this.menuIcon].filter((el) => el);

    if (uiElements.length > 0) {
      this.tweens.add({
        targets: uiElements,
        alpha: 1,
        duration: 300,
      });
    }
  };

  /**
   * Aplica efeito de digitação em um texto com melhorias visuais
   * @param {Phaser.GameObjects.Text} textObject - Objeto de texto
   * @param {string} fullText - Texto completo
   * @param {Function} callback - Função chamada ao finalizar
   */
  jardimMission.prototype.typewriterEffect = function (textObject, fullText, callback) {
    // Verificar se textObject existe
    if (!textObject) {
      console.warn("Objeto de texto para efeito de digitação não inicializado");
      if (callback) callback();
      return;
    }

    // Limpar texto inicial
    textObject.setText("");

    // Preparar caracteres
    const chars = fullText.split("");
    let index = 0;
    let timer;

    // Configurações de digitação
    const baseSpeed = 30; // ms por caractere
    const punctuationDelays = {
      ".": 300,
      "!": 300,
      "?": 300,
      ",": 150,
      ";": 150,
      ":": 150,
    };

    // Destacar visualmente o container de texto durante a digitação
    if (this.dialog.textHighlight) {
      this.dialog.textHighlight.destroy();
    }

    // Verificar se dialogContainer existe
    if (!this.dialogContainer) {
      console.warn("Container de diálogo não inicializado para efeito de digitação");
      if (callback) callback();
      return;
    }

    // Criar um cursor piscante
    const cursor = this.add.text(textObject.x + 5, textObject.y, "|", {
      fontSize: textObject.style.fontSize,
      color: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 1,
    });
    cursor.setOrigin(0, 0.5);
    this.dialogContainer.add(cursor);

    // Animar cursor
    this.tweens.add({
      targets: cursor,
      alpha: 0,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    // Função para adicionar próximo caractere
    const addNextChar = () => {
      if (index < chars.length) {
        // Adicionar caractere
        textObject.setText(textObject.text + chars[index]);

        // Atualizar posição do cursor
        cursor.setX(textObject.x + textObject.width + 5);

        // Incrementar índice
        index++;

        // Determinar velocidade com base no caractere
        let delay = baseSpeed;

        // Pausas mais longas para pontuação
        const currentChar = chars[index - 1];
        if (punctuationDelays[currentChar]) {
          delay = punctuationDelays[currentChar];
        }

        // Aplicar variação natural de velocidade (±10ms)
        delay += Math.random() * 20 - 10;

        // Agendar próximo caractere
        timer = this.time.delayedCall(delay, addNextChar);
      } else {
        // Finalizado - remover cursor
        cursor.destroy();

        // Callback
        if (callback) callback();
      }
    };

    // Iniciar efeito
    timer = this.time.delayedCall(100, addNextChar);

    // Retornar controlador
    return (this.dialog.typewriterEffect = {
      skip: () => {
        // Limpar timer se existir
        if (timer) {
          timer.remove();
        }

        // Mostrar texto completo
        textObject.setText(fullText);

        // Remover cursor
        cursor.destroy();

        // Chamar callback
        if (callback) callback();
      },
    });
  };

  /**
   * Mostra uma dica visual de como interagir com diálogos
   */
  jardimMission.prototype.showDialogHint = function () {
    // Verificar se uiContainer existe
    if (!this.uiContainer) {
      console.warn("Container UI não inicializado");
      return;
    }

    // Adicionar uma dica visual sobre como continuar
    const hint = this.add.container(this.cameras.main.width / 2, this.cameras.main.height - 260);
    hint.setDepth(160);

    // Fundo semi-transparente
    const hintBg = this.add.graphics();
    hintBg.fillStyle(0x000000, 0.6);
    hintBg.fillRoundedRect(-200, -20, 400, 40, 10);

    // Texto da dica
    const hintText = this.add
      .text(0, 0, "ESPAÇO ou CLIQUE para continuar o diálogo", {
        fontFamily: this.fontFamily || "'Chakra Petch', sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    hint.add([hintBg, hintText]);

    // Adicionar à UI
    this.uiContainer.add(hint);

    // Animar entrada
    hint.setAlpha(0);
    hint.setScale(0.8);

    this.tweens.add({
      targets: hint,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    // Guardar referência para remover depois
    this.dialog.hint = hint;

    // Remover após alguns segundos
    this.time.delayedCall(4000, () => {
      if (this.dialog.hint) {
        this.tweens.add({
          targets: this.dialog.hint,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            if (this.dialog.hint) {
              this.dialog.hint.destroy();
              this.dialog.hint = null;
            }
          },
        });
      }
    });
  };

  /**
   * Obtém diálogo inicial do professor
   */
  jardimMission.prototype.getProfessorInitialDialog = function () {
    return [
      { text: "Olá! Você deve ser o novo agente da AGPD, certo? Bem-vindo à nossa escola!" },
      { text: "Que bom que você veio. Estou pensando em implementar uma nova forma de comunicação com os alunos." },
      { text: "Quero criar um grupo de WhatsApp com todos os alunos da minha turma para compartilhar materiais e informações sobre as aulas." },
      { text: "O que você acha da ideia? Já até comecei a coletar os números de celular de alguns alunos." },
      {
        text: "Você parece hesitante. Há algum problema com minha ideia?",
        choices: [
          {
            text: "Sim, professor. Existem algumas preocupações com relação à proteção de dados.",
            onSelect: () => {
              // Esta é a resposta correta
              this.showNotification("Resposta correta! Você identificou o problema de privacidade.", "success");
            },
          },
          {
            text: "Não vejo problema nenhum, professor. Parece uma ótima ideia!",
            onSelect: () => {
              // Esta é a resposta incorreta
              this.showNotification("Atenção! Esta não é a resposta mais adequada para a proteção de dados.", "warning");
            },
          },
        ],
      },
      { text: "Proteção de dados? Não entendo. É só um grupo para facilitar a comunicação com os alunos..." },
      { text: "Pode me explicar melhor quais são essas preocupações?" },
    ];
  };

  /**
   * Obtém diálogo de explicação do professor
   */
  jardimMission.prototype.getProfessorExplanationDialog = function () {
    return [
      { text: "Estou interessado em entender melhor essas preocupações sobre proteção de dados que você mencionou." },
      { text: "Eu só quero facilitar a comunicação com meus alunos. O que exatamente pode ser um problema?" },
      {
        choices: [
          {
            text: "Os alunos são menores de idade e é preciso ter consentimento dos responsáveis.",
            onSelect: () => {
              this.showNotification("Excelente ponto! Menores precisam de consentimento parental.", "success");
            },
          },
        ],
      },
      {
        choices: [
          {
            text: "Números de celular são dados pessoais e não podem ser compartilhados sem consentimento.",
            onSelect: () => {
              this.showNotification("Correto! Dados de contato são informações pessoais protegidas.", "success");
            },
          },
        ],
      },
      {
        choices: [
          {
            text: "O uso de plataformas não oficiais para comunicação escolar pode infringir regulamentações.",
            onSelect: () => {
              this.showNotification("Muito bem! Plataformas aprovadas são essenciais para comunicação escolar.", "success");
            },
          },
        ],
      },
      { text: "Ah, agora estou entendendo! Então eu não posso simplesmente criar um grupo de WhatsApp com os alunos..." },
      { text: "Não tinha pensado na questão dos alunos serem menores de idade. Realmente precisaria do consentimento dos pais." },
      { text: "E também não considerei que os números de telefone são dados pessoais. Não deveria coletar essa informação sem um propósito claro e consentimento." },
      { text: "Quanto às plataformas oficiais, a escola até tem um ambiente virtual de aprendizagem aprovado pelo Ministério da Educação que poderíamos usar." },
      { text: "Acho que vou falar com a coordenação sobre usar essa plataforma oficial em vez de criar um grupo no WhatsApp." },
      { text: "Obrigado por me alertar sobre essas questões! Você realmente entende bastante sobre proteção de dados." },
    ];
  };

  /**
   * Obtém diálogo após conclusão da missão
   */
  jardimMission.prototype.getProfessorCompletedDialog = function () {
    return [{ text: "Olá novamente! Já falei com a coordenação sobre usar a plataforma oficial da escola." }, { text: "Eles adoraram a ideia e vão implementar para todas as turmas! Assim respeitamos a LGPD e mantemos uma comunicação eficiente." }, { text: "Obrigado mais uma vez pela orientação. É importante termos profissionais como você para nos ajudar com essas questões." }, { text: "Se precisar de mais alguma coisa, estarei por aqui no jardim. Tenha um bom dia!" }];
  };

  /**
   * Obtém diálogo padrão do professor
   */
  jardimMission.prototype.getProfessorDefaultDialog = function () {
    return [{ text: "Olá! Está gostando da nossa escola?" }, { text: "O jardim é um ótimo lugar para os alunos relaxarem entre as aulas." }, { text: "Se precisar de alguma informação, é só perguntar." }];
  };

  console.log("✅ Módulo de Diálogos aprimorado carregado");
})();
