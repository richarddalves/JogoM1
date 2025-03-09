/**
 * Módulo de perguntas para o mini-game de identificação de dados pessoais e sensíveis
 */
(function () {
  /**
   * Configura as perguntas do jogo
   */
  gameInicial.prototype.setupQuestions = function () {
    // Inicializar pontuação do jogo atual
    this.playerPoints = 0;
    this.correctCount = 0;

    // Definir perguntas com dados detalhados e explicações
    this.questions = [
      {
        text: "Um estudante de 18 anos se inscreve em um curso online gratuito e fornece os seguintes dados:\n\nNome completo\nIdade\nE-mail pessoal\nCidade onde mora",
        hasSensitiveData: false,
        explanation: "Estes são dados pessoais comuns, não sensíveis. Embora identifiquem uma pessoa, não são informações que possam gerar discriminação ou risco elevado conforme a LGPD.",
        points: 10,
      },
      {
        text: "Uma jovem de 22 anos se candidata a uma vaga de emprego em um site de recrutamento e preenche um formulário com:\n\nNome completo\nEndereço residencial\nTelefone\nReligião\nHistórico profissional",
        hasSensitiveData: true,
        explanation: "Este formulário contém dados sensíveis! A religião é considerada um dado sensível pela LGPD, pois pode levar à discriminação. Empresas só devem solicitar essa informação com justificativa específica e legítima.",
        points: 15,
      },
      {
        text: "Um adolescente de 16 anos cria uma conta em um aplicativo de exercícios físicos e informa:\n\nNome\nIdade\nAltura e peso\nFrequência cardíaca média\nHistórico de doenças na família",
        hasSensitiveData: true,
        explanation: "Dados de saúde como frequência cardíaca e histórico médico familiar são considerados sensíveis pela LGPD. Além disso, sendo menor de idade, o adolescente precisa de consentimento dos pais ou responsáveis.",
        points: 15,
      },
      {
        text: "Durante o cadastro em uma loja online, um cliente de 25 anos fornece:\n\nNome completo\nCPF\nEndereço para entrega\nNúmero do cartão de crédito\nData de nascimento",
        hasSensitiveData: false,
        explanation: "Apesar de serem dados que exigem proteção rigorosa, dados financeiros como número de cartão de crédito não são classificados como sensíveis pela LGPD, mas sim como dados pessoais com necessidade de proteção adicional.",
        points: 15,
      },
      {
        text: "Para participar de um sorteio online, um jovem de 14 anos preenche um formulário com:\n\nNome\nIdade\nCPF\nCEP\nEndereço\nTelefone\nOpinião política",
        hasSensitiveData: true,
        explanation: "Este formulário contém dados sensíveis por dois motivos: (1) opinião política é um dado sensível e (2) há coleta de dados pessoais de um menor de idade sem consentimento parental verificado, o que viola a LGPD.",
        points: 20,
      },
    ];

    // Calcular pontuação máxima possível
    this.maxScore = this.questions.reduce((total, q) => total + q.points, 0);
  };

  /**
   * Mostra a questão atual
   */
  gameInicial.prototype.showQuestion = function () {
    // Verificar se ainda há questões
    if (this.currentQuestionIndex >= this.questions.length) {
      this.completeGame();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];

    // Exibir o texto da questão com animação
    this.questionText.setText(question.text);
    this.questionText.setAlpha(0);

    // Atualizar contador de questões
    this.questionCounter.setText(`Questão ${this.currentQuestionIndex + 1}/${this.questions.length}`);

    // Resetar visibilidade dos elementos
    this.questionPanel.setVisible(true);
    this.feedbackPanel.setVisible(false);
    this.buttonContainer.setVisible(true);
    this.yesButton.setVisible(true);
    this.noButton.setVisible(true);

    // Atualizar a barra de progresso
    this.updateProgressBar(this.currentQuestionIndex / this.questions.length);

    // Animar entrada da questão
    this.tweens.add({
      targets: this.questionText,
      alpha: 1,
      y: { from: this.questionText.y - 20, to: this.questionText.y },
      duration: 500,
      ease: "Power2",
    });

    // Animar entrada dos botões
    this.buttonContainer.setAlpha(0);
    this.buttonContainer.setY(this.buttonContainer.y + 20);

    this.tweens.add({
      targets: this.buttonContainer,
      alpha: 1,
      y: this.buttonContainer.y - 20,
      duration: 500,
      delay: 200,
      ease: "Power2",
    });

    // Resetar o estado de resposta
    this.questionAnswered = false;
  };

  /**
   * Verifica a resposta do jogador
   * @param {boolean} userAnswer - Resposta do jogador
   */
  gameInicial.prototype.checkAnswer = function (userAnswer) {
    if (this.questionAnswered) return;

    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = userAnswer === question.hasSensitiveData;

    // Marcar como respondida
    this.questionAnswered = true;

    // Preparar feedback
    this.prepareFeedback(isCorrect, question);

    // Animação de transição
    this.transitionToFeedback();

    // Registrar pontos no sistema interno do minigame
    if (isCorrect) {
      // Adicionar pontos ao acumulador interno
      this.playerPoints += question.points;
      this.correctCount++;

      // Adicionar pontos via HUD
      try {
        if (this.agentHUD) {
          this.agentHUD.addPoints(question.points, "Resposta correta - Identificação de dados");
        }
      } catch (e) {
        console.warn("Erro ao adicionar pontos:", e);
      }

      // Som de sucesso
      if (this.sound.get("correct_sound")) {
        this.sound.play("correct_sound", { volume: 0.5 });
      }
    } else {
      // Som de erro
      if (this.sound.get("wrong_sound")) {
        this.sound.play("wrong_sound", { volume: 0.5 });
      }
    }

    // Atualizar o progresso no localStorage para acompanhamento
    this.saveGameProgress();
  };

  /**
   * Salva o progresso atual do jogador no jogo
   */
  gameInicial.prototype.saveGameProgress = function () {
    try {
      let gameProgress = {
        currentIndex: this.currentQuestionIndex,
        points: this.playerPoints,
        correctAnswers: this.correctCount,
        maxScore: this.maxScore,
        totalQuestions: this.questions.length,
      };

      localStorage.setItem("gameInicialProgress", JSON.stringify(gameProgress));
      console.log("✅ Progresso do jogo salvo:", gameProgress);
    } catch (e) {
      console.warn("❌ Erro ao salvar progresso do jogo:", e);
    }
  };

  /**
   * Avança para a próxima questão
   */
  gameInicial.prototype.nextQuestion = function () {
    // Animação de saída do feedback
    this.tweens.add({
      targets: this.feedbackPanel,
      alpha: 0,
      scale: 0.95,
      duration: 300,
      ease: "Power2",
      onComplete: () => {
        this.feedbackPanel.setVisible(false);
        this.feedbackPanel.setAlpha(1);
        this.feedbackPanel.setScale(1);

        // Avançar para a próxima questão
        this.currentQuestionIndex++;

        // Mostrar os botões novamente
        this.buttonContainer.setY(this.buttonContainer.y - 50);
        this.buttonContainer.setVisible(true);

        this.tweens.add({
          targets: this.buttonContainer,
          alpha: 1,
          y: this.buttonContainer.y,
          duration: 300,
          ease: "Power2",
        });

        // Mostrar próxima questão
        this.showQuestion();
      },
    });
  };

  console.log("✅ Módulo de Perguntas carregado");
})();
