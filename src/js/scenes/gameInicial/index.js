/**
 * Mini-game de identificação de dados pessoais e sensíveis
 * @class gameInicial
 * @extends Phaser.Scene
 * @description O primeiro mini-game do jogador, onde ele aprende a identificar dados sensíveis
 */

// Função para carregar scripts dinamicamente (isolada em um IIFE)
(function () {
  function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback || function () {};
    script.onerror = function (e) {
      console.error(`❌ Erro ao carregar script: ${url}`, e);
    };
    document.head.appendChild(script);
  }

  // Carregar scripts de módulos da cena
  const gameInicialModules = ["questions.js", "interface.js", "feedback.js", "completion.js"];

  const gameInicialPath = "src/js/scenes/gameInicial/";
  let loadedCount = 0;
  let errorCount = 0;

  gameInicialModules.forEach((module) => {
    loadScript(gameInicialPath + module, function () {
      loadedCount++;
      if (loadedCount === gameInicialModules.length) {
        console.log("✅ Todos os módulos de Game Inicial carregados com sucesso!");
      }
    });
  });
})();

class gameInicial extends Phaser.Scene {
  constructor() {
    super({ key: "gameInicial" });

    // Configurações iniciais
    this.currentQuestionIndex = 0;
    this.playerPoints = 0; // Novo: armazena pontos do jogador no jogo atual
    this.correctCount = 0; // Novo: conta respostas corretas
    this.maxScore = 0;
    this.questionAnswered = false;
    this.gameStarted = false;
    this.fadeSpeed = 400; // ms

    // Cores e estilos
    this.colors = {
      primary: 0x0d84ff, // Azul principal
      secondary: 0x39f5e2, // Ciano secundário
      positive: 0x4caf50, // Verde para acertos
      negative: 0xff3a3a, // Vermelho para erros
      warning: 0xffc107, // Amarelo para avisos
      dark: 0x1a1a2e, // Fundo escuro
      light: 0xffffff, // Texto claro
      panelBg: 0x111927, // Fundo de painéis
    };
  }

  /**
   * Pré-carrega os recursos necessários para o mini-game
   */
  preload() {
    // Carregar imagens
    this.load.image("game_bg", "assets/images/backgrounds/fundoMiniGame1.png");
    this.load.image("card_bg", "assets/images/ui/botao_retangular.png");
    this.load.image("correct_icon", "assets/images/ui/correto.png");
    this.load.image("wrong_icon", "assets/images/ui/incorreto.png");
    this.load.image("yes_button", "assets/images/ui/botaoverde.png");
    this.load.image("no_button", "assets/images/ui/botaovermelho.png");
    this.load.image("next_arrow", "assets/images/ui/botaoverde.png");
    this.load.image("data_icon", "assets/images/ui/celularasset.png");

    // Carregar sons (com tratamento de erro para evitar problemas se os arquivos não existirem)
    try {
      this.load.audio("correct_sound", "assets/sounds/correct.mp3");
      this.load.audio("wrong_sound", "assets/sounds/wrong.mp3");
      this.load.audio("button_click", "assets/sounds/click.mp3");
      this.load.audio("success_sound", "assets/sounds/success.mp3");
      this.load.audio("hover", "assets/sounds/hover.mp3");
      this.load.audio("click", "assets/sounds/click.mp3");
      this.load.audio("select", "assets/sounds/select.mp3");
    } catch (e) {
      console.warn("Alguns arquivos de áudio não foram encontrados:", e);
    }

    // Carregar fontes web seguras para fallback
    this.fontFamily = "'Chakra Petch', 'OldSchoolAdventures', sans-serif";

    // Verificar se há progresso salvo
    this.checkSavedProgress();
  }

  /**
   * Verifica se há progresso salvo de uma sessão anterior
   */
  checkSavedProgress() {
    try {
      const savedProgress = localStorage.getItem("gameInicialProgress");
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        console.log("Encontrado progresso salvo:", progress);

        // Será usado posteriormente na criação para perguntar se o jogador quer continuar
        this.hasSavedProgress = true;
        this.savedProgress = progress;
      }
    } catch (e) {
      console.warn("Erro ao verificar progresso salvo:", e);
    }
  }

  /**
   * Cria todos os elementos do mini-game
   */
  create() {
    // Obter dimensões da tela
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Configurar sistema responsivo
    this.setupResponsiveDesign(width, height);

    // Criar ambiente visual
    this.createEnvironment(width, height);

    // Criar HUD do agente - verificar se existe primeiro
    this.createAgentHUD();

    // Criar interface do jogo
    this.createGameInterface(width, height);

    // Configurar perguntas e conteúdo do jogo
    this.setupQuestions();

    // Iniciar o jogo com uma introdução
    this.startGameIntro();

    // Configurar eventos de redimensionamento
    this.scale.on("resize", this.resize, this);

    // Adicionar fade in inicial
    this.cameras.main.fadeIn(this.fadeSpeed, 0, 0, 0);

    // Configurar teclas de atalho
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.questionAnswered && this.feedbackPanel.visible) {
        this.nextQuestion();
      }
    });
  }

  /**
   * Método para redimensionar a cena quando a janela muda de tamanho
   * @param {Phaser.Scale.ScaleManager} gameSize - Informações de redimensionamento
   */
  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Atualizar dimensões armazenadas
    this.screenWidth = width;
    this.screenHeight = height;
    this.centerX = width / 2;
    this.centerY = height / 2;

    // Recalcular escala
    this.uiScale = Math.min(width / 1280, height / 720);

    // Reposicionar e redimensionar elementos
    if (this.background) {
      this.background.setDisplaySize(width, height);
      this.background.setPosition(width / 2, height / 2);
    }

    if (this.overlay) {
      this.overlay.clear();
      this.overlay.fillStyle(0x000022, 0.7);
      this.overlay.fillRect(0, 0, width, height);
    }

    // Recriar a interface se necessário - implementar método seguro
    try {
      // Se interface já foi criada, recriar
      if (this.gameContainer) {
        // Guardar estado atual
        const currentState = {
          questionIndex: this.currentQuestionIndex,
          answered: this.questionAnswered,
          feedbackVisible: this.feedbackPanel ? this.feedbackPanel.visible : false,
          gameStarted: this.gameStarted,
        };

        // Limpar elementos existentes
        this.gameContainer.destroy();

        // Recriar interface
        this.createGameInterface(width, height);

        // Restaurar estado
        this.currentQuestionIndex = currentState.questionIndex;
        this.questionAnswered = currentState.answered;

        if (currentState.gameStarted) {
          if (currentState.feedbackVisible) {
            // Mostrar feedback novamente
            const question = this.questions[this.currentQuestionIndex];
            const isCorrect = question && question.hasSensitiveData === this.lastAnswer;

            this.questionPanel.setVisible(false);
            this.buttonContainer.setVisible(false);
            this.feedbackPanel.setVisible(true);

            if (question) {
              this.prepareFeedback(isCorrect, question);
            }
          } else {
            // Mostrar questão atual
            this.showQuestion();
          }
        } else {
          // Re-iniciar a introdução
          this.startGameIntro();
        }
      }
    } catch (e) {
      console.error("Erro ao redimensionar:", e);
      // Tentar simplesmente recomeçar a cena no caso de erro grave
      this.scene.restart();
    }
  }

  /**
   * Método de atualização chamado a cada frame
   * @param {number} time - Tempo atual
   * @param {number} delta - Tempo desde o último frame
   */
  update(time, delta) {
    // Atualização contínua (se necessário)
    // Por exemplo, poderia animar elementos baseados no tempo
  }
}

// Tornar a classe disponível globalmente
window.gameInicial = gameInicial;
