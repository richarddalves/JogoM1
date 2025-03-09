/**
 * Missão Escolar - Alerta na Escola
 * @class schoolMission
 * @extends Phaser.Scene
 * @description Missão onde o jogador deve investigar o problema do professor que quer criar um grupo de WhatsApp com alunos
 */

// Função para carregar scripts dinamicamente
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
  const schoolMissionModules = ["map.js", "player.js", "interface.js", "dialogs.js", "interactions.js", "tasks.js"];

  const schoolMissionPath = "src/js/scenes/schoolMission/";
  let loadedCount = 0;

  schoolMissionModules.forEach((module) => {
    loadScript(schoolMissionPath + module, function () {
      loadedCount++;
      if (loadedCount === schoolMissionModules.length) {
        console.log("✅ Todos os módulos da Missão Escolar carregados com sucesso!");

        // Certificar-se de que a cena é registrada quando todos os módulos são carregados
        if (window.game && window.schoolMission && !window.game.scene.getScene("schoolMission")) {
          window.game.scene.add("schoolMission", window.schoolMission, false);
          console.log("✅ Cena schoolMission adicionada ao jogo explicitamente");
        }
      }
    });
  });
})();

class schoolMission extends Phaser.Scene {
  constructor() {
    super({ key: "schoolMission" });

    // Configurações iniciais
    this.player = null;
    this.npcs = {};
    this.dialogActive = false;
    this.currentTask = 0;
    this.missionComplete = false;
    this.playerSpeed = 200;
    this.fadeSpeed = 400; // ms

    // Armazenar referências a elementos de UI e mapas
    this.mapElements = {};
    this.uiElements = {};

    // Referências a camadas de colisão e interação
    this.collisionLayer = null;
    this.interactionLayer = null;
    this.objectsLayer = null;

    // Estilo para texto e UI
    this.fontFamily = "'Chakra Petch', 'OldSchoolAdventures', sans-serif";

    // Cores para UI
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
   * Inicializa a cena com dados externos
   * @param {Object} data - Dados passados para a cena
   */
  init(data) {
    console.log("🏫 Inicializando Missão Escolar");
    // Guarda os dados passados para a cena, se houver
    this.sceneData = data || {};

    // Inicializa flags
    this.dialogActive = false;
    this.isPaused = false;
    this.missionComplete = false;
  }

  /**
   * Pré-carrega todos os recursos necessários para a cena
   */
  preload() {
    console.log("🏫 Pré-carregando recursos da Missão Escolar");
    // Mostrar tela de carregamento
    this.createLoadingScreen();

    // Carregar imagens de fundo
    this.load.image("school_bg", "assets/images/backgrounds/fundoMiniGame1.png");
    this.load.image("school_fallback", "assets/images/mapa.jpeg"); // Usar mapa.jpeg como fallback principal

    // Carregar spritesheet do personagem com configuração adequada
    this.load.spritesheet("player_character", "assets/images/characters/sprites/bonecoPadrao.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Carregar sprites dos NPCs
    this.load.image("teacher", "assets/images/homemcabelopreto.png");
    this.load.image("student", "assets/images/mulherjogo.png.png");

    // Carregar assets de UI
    this.load.image("dialog_box", "assets/images/ui/caixadialogo.png");
    this.load.image("button", "assets/images/ui/botao_retangular.png");
    this.load.image("phone_icon", "assets/images/ui/celularasset.png");
    this.load.image("task_complete", "assets/images/ui/correto.png");
    this.load.image("task_incomplete", "assets/images/ui/incorreto.png");

    // Carregar sons com tratamento de erro para prevenir problemas
    try {
      this.load.audio("dialog_sound", "assets/sounds/click.mp3");
      this.load.audio("click_sound", "assets/sounds/click.mp3");
      this.load.audio("success_sound", "assets/sounds/select.mp3");
    } catch (e) {
      console.warn("⚠️ Alguns arquivos de áudio não foram encontrados.", e);
    }

    // Carregar fontes seguras para fallback
    this.fontFamily = "'Chakra Petch', 'OldSchoolAdventures', sans-serif";
  }

  /**
   * Cria tela de carregamento
   */
  createLoadingScreen() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Overlay escuro
    const bg = this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setAlpha(0.7);

    // Texto de carregamento
    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "CARREGANDO MISSÃO ESCOLAR", {
        fontFamily: this.fontFamily,
        fontSize: "26px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Barra de progresso
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);

    const progressBar = this.add.graphics();

    // Atualizar barra de progresso
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x0d84ff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 5, 300 * value, 20);
    });

    // Limpar tela quando o carregamento for completo
    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      bg.destroy();
      console.log("🏫 Carregamento da Missão Escolar concluído");
    });
  }

  /**
   * Cria todos os elementos necessários para a cena
   */
  create() {
    console.log("🏫 Criando elementos da Missão Escolar");
    // Obter dimensões da tela
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Criar mapa e ambiente
    this.createEnvironment(width, height);

    // Criar jogador
    this.createPlayer();

    // Configurar câmera para seguir o jogador
    this.configureCamera();

    // Criar NPCs
    this.createNPCs();

    // Criar interface do usuário
    this.createUI(width, height);

    // Criar HUD do agente
    this.createAgentHUD();

    // Configurar tarefas da missão
    this.setupTasks();

    // Iniciar diálogo introdutório
    this.time.delayedCall(500, () => {
      this.showMissionIntro();
    });

    // Configurar eventos de teclado
    this.setupKeyboardEvents();

    // Criar fade in da cena
    this.cameras.main.fadeIn(this.fadeSpeed);

    console.log("🏫 Missão Escolar inicializada com sucesso!");
  }

  /**
   * Configura eventos de teclado
   */
  setupKeyboardEvents() {
    // Tecla ESC para pausar/menu
    this.input.keyboard.on("keydown-ESC", () => {
      if (!this.dialogActive) {
        this.togglePauseMenu();
      } else {
        // Se houver diálogo ativo, ignora
      }
    });

    // Tecla E para interagir
    this.input.keyboard.on("keydown-E", () => {
      if (!this.dialogActive && !this.isPaused) {
        this.checkForInteractions();
      }
    });

    // Tecla SPACE para avançar diálogos
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.dialogActive) {
        this.advanceDialog();
      }
    });
  }

  /**
   * Método de atualização chamado a cada frame
   * @param {number} time - Tempo atual
   * @param {number} delta - Tempo desde o último frame
   */
  update(time, delta) {
    // Atualizar movimento do jogador
    if (this.player && !this.dialogActive && !this.isPaused) {
      this.updatePlayerMovement();
    }

    // Verificar proximidade com NPCs para mostrar dicas de interação
    if (this.player && !this.dialogActive && !this.isPaused) {
      this.checkNPCProximity();
    }

    // Atualizar indicadores de tarefas
    if (this.uiElements && this.uiElements.taskListContainer) {
      this.updateTaskIndicators();
    }
  }

  /**
   * Navega para a central de missões
   */
  goToMissionHub() {
    // Fade out
    this.cameras.main.fadeOut(this.fadeSpeed);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      try {
        this.scene.start("missionsHub", {
          returnFromMission: true,
          missionId: "school_alert",
          completed: this.missionComplete,
        });
      } catch (e) {
        console.error("Erro ao navegar para central de missões:", e);
        this.scene.start("mainMenu");
      }
    });
  }

  /**
   * Completa a missão e mostra tela de conclusão
   */
  completeMission() {
    this.missionComplete = true;

    // Chamar finalização que será implementada em tasks.js
    this.showMissionCompleteScreen();
  }
}

// Tornar a classe disponível globalmente
window.schoolMission = schoolMission;

// Registrar a cena no jogo se o jogo já estiver inicializado
if (window.game && !window.game.scene.getScene("schoolMission")) {
  try {
    window.game.scene.add("schoolMission", schoolMission, false);
    console.log("✅ Cena schoolMission adicionada ao jogo no carregamento inicial");
  } catch (e) {
    console.error("❌ Erro ao adicionar cena schoolMission:", e);
  }
}

console.log("🏫 Módulo schoolMission carregado");
