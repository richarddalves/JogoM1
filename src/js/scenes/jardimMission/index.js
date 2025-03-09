/**
 * Cena da Missão no Jardim da Escola (REVISÃO PROFUNDA)
 * @class jardimMission
 * @extends Phaser.Scene
 * @description Implementa o cenário do Capítulo 2 - Alerta na Escola
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
  const jardimMissionModules = ["map.js", "player.js", "interface.js", "interactions.js", "dialogs.js", "tasks.js"];

  const jardimMissionPath = "src/js/scenes/jardimMission/";
  let loadedCount = 0;
  let errorCount = 0;

  jardimMissionModules.forEach((module) => {
    loadScript(jardimMissionPath + module, function () {
      loadedCount++;
      if (loadedCount === jardimMissionModules.length) {
        console.log("✅ Todos os módulos de Jardim Mission carregados com sucesso!");
      }
    });
  });
})();

class jardimMission extends Phaser.Scene {
  constructor() {
    super({ key: "jardimMission" });

    // Propriedades da cena
    this.player = null;
    this.professor = null;
    this.map = null;
    this.layers = {};
    this.colliders = [];
    this.interactiveObjects = [];
    this.cameraBounds = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    // Configurações da missão
    this.missionCompleted = false;
    this.professorTalkedTo = false;
    this.missionStarted = false;
    this.currentTask = 0;
    this.taskCompleted = false;

    // Configurações visuais
    this.colors = {
      primary: 0x0d84ff, // Azul principal
      secondary: 0x39f5e2, // Ciano secundário
      accent: 0xff3a3a, // Vermelho para alertas
      positive: 0x4caf50, // Verde para positivo
      warning: 0xffc107, // Amarelo para avisos
      dark: 0x1a1a2e, // Fundo escuro
      light: 0xffffff, // Texto claro
    };

    // Configuração de sons
    this.sounds = {
      footsteps: null,
      ambient: null,
      dialog: null,
      success: null,
      notification: null,
    };

    // Configuração das teclas
    this.keys = null;

    // Fade speed
    this.fadeSpeed = 500;

    // Debug mode
    this.debugMode = false;

    // Inicializar objeto de diálogo
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

  /**
   * Pré-carrega os recursos necessários para a cena
   */
  preload() {
    console.log("🔄 Pré-carregando jardimMission...");

    // Mostrar tela de carregamento
    this.createLoadingScreen();

    try {
      // Carregar mapa Tiled
      this.load.tilemapTiledJSON("jardim-map", "assets/maps/mapaJardim/jardim.json");

      // Carregar tilesets
      this.load.image("grass-tiles", "assets/maps/mapaJardim/grass.png");
      this.load.image("water-tiles", "assets/maps/mapaJardim/water.png");
      this.load.image("objects-tiles", "assets/maps/mapaJardim/assets_objetos.png");
      this.load.image("final-assets", "assets/maps/mapaJardim/final_assets.png");
      this.load.image("teste-assets", "assets/maps/mapaJardim/teste_assets.png");
      this.load.image("sample-map", "assets/maps/mapaJardim/samplemap.png");

      // CORRIGIDO: Carregar spritesheet do personagem com dimensões corretas
      this.load.spritesheet("personagem", "assets/images/characters/sprites/personagemTeste.png", {
        frameWidth: 64,
        frameHeight: 64,
      });

      // REVISADO: Carregar professor como imagem simples, não spritesheet
      this.load.image("professor", "assets/images/characters/professorTeste.png");

      // Carregar elementos de UI
      this.load.image("dialog-box", "assets/images/ui/caixadialogo.png");
      this.load.image("panel-bg", "assets/images/ui/painel_retangular.png");
      this.load.image("button-green", "assets/images/ui/botaoverde.png");
      this.load.image("button-red", "assets/images/ui/botaovermelho.png");
      this.load.image("task-icon", "assets/images/ui/celularasset.png");
      this.load.image("correct-icon", "assets/images/ui/correto.png");
      this.load.image("wrong-icon", "assets/images/ui/incorreto.png");
    } catch (e) {
      console.error("❌ Erro durante o preload:", e);
    }
  }

  /**
   * Cria a tela de carregamento
   */
  createLoadingScreen() {
    // Obter dimensões da tela
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fundo da tela de carregamento
    const loadingBg = this.add.graphics();
    loadingBg.fillStyle(this.colors.dark, 0.8);
    loadingBg.fillRect(0, 0, width, height);

    // Texto de carregamento
    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "CARREGANDO MISSÃO DO JARDIM", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "32px", // REVISADO: Aumentado o tamanho do texto
        color: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Barra de progresso - contorno
    const progressBarBg = this.add.graphics();
    progressBarBg.lineStyle(4, this.colors.primary, 1); // REVISADO: Aumentei a largura da linha
    progressBarBg.strokeRect(width / 2 - 200, height / 2 - 20, 400, 40); // REVISADO: Aumentei o tamanho

    // Barra de progresso - preenchimento
    const progressBar = this.add.graphics();

    // Indicador de porcentagem
    const percentText = this.add
      .text(width / 2, height / 2 + 60, "0%", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "24px", // REVISADO: Aumentado o tamanho do texto
        color: "#FFFFFF",
      })
      .setOrigin(0.5);

    // Dica de gameplay
    const tipText = this.add
      .text(width / 2, height / 2 + 120, "Dica: Você deve encontrar o professor para conversar\nsobre o grupo de WhatsApp", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "20px", // REVISADO: Aumentado o tamanho do texto
        color: "#39f5e2",
        fontStyle: "italic",
        align: "center",
      })
      .setOrigin(0.5);

    // Atualizar a barra de progresso
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(this.colors.secondary, 1);
      progressBar.fillRect(width / 2 - 195, height / 2 - 15, 390 * value, 30);
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    // Limpar a tela de carregamento quando finalizar
    this.load.on("complete", () => {
      progressBar.destroy();
      progressBarBg.destroy();
      loadingText.destroy();
      percentText.destroy();
      tipText.destroy();
      loadingBg.destroy();
    });
  }

  /**
   * Cria todos os elementos da cena
   */
  create(data) {
    console.log("💾 Iniciando cena jardimMission");

    try {
      // Obter dimensões da tela
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      console.log(`📏 Dimensões da tela: ${width}x${height}`);

      // Configurar teclas de controle
      this.setupControls();

      // Criar o mapa
      this.createMap();

      // Criar o jogador
      this.createPlayer();

      // Criar NPCs e objetos interativos
      this.createNPCs();

      // Configurar colisões
      this.setupCollisions();

      // Configurar câmera para seguir o jogador
      this.setupCamera();

      // Criar HUD e UI
      this.createUI();

      // Configurar eventos
      this.setupEvents();

      // Animar entrada na cena
      this.fadeInScene();

      // Verificar dados passados de outras cenas
      this.processSceneData(data);

      // Mostrar notificação inicial
      this.showTaskNotification("Encontre o professor no jardim da escola");

      // Ativar modo debug se necessário
      if (this.debugMode) {
        this.enableDebugMode();
      }

      // REVISADO: Adicionar informação de controles na tela
      this.showControlsInfo();

      console.log("✅ Cena jardimMission criada com sucesso!");
    } catch (e) {
      console.error("❌ Erro crítico ao criar cena:", e);
      this.showErrorScreen("Erro ao carregar cena. Tente novamente.");
    }
  }

  /**
   * Configura colisões entre jogador, NPCs e camadas do mapa
   */
  setupCollisions() {
    console.log("🔧 Configurando colisões...");

    try {
      // Verificar se o jogador e as camadas de colisão existem
      if (!this.player || !this.player.sprite) {
        console.warn("⚠️ Jogador não encontrado para configurar colisões.");
        return;
      }

      // Adicionar colisão com as bordas do mundo
      this.player.sprite.setCollideWorldBounds(true);

      // Configurar colisão com camadas do mapa
      if (this.layers) {
        // Verificar cada camada que precisa de colisão
        Object.keys(this.layers).forEach((key) => {
          if (key.includes("collision") || key.includes("obj") || key.includes("wall") || key.includes("decoration")) {
            if (this.layers[key] && typeof this.layers[key].setCollisionByExclusion === "function") {
              // Configurar colisão excluindo tiles -1 (vazio)
              this.layers[key].setCollisionByExclusion([-1]);

              // Adicionar colisão entre jogador e esta camada
              this.physics.add.collider(this.player.sprite, this.layers[key]);

              console.log(`✅ Colisão configurada entre jogador e camada ${key}`);
            }
          }
        });
      }

      // Configurar colisão com objetos de colisão específicos
      if (this.collisionObjects) {
        this.physics.add.collider(this.player.sprite, this.collisionObjects);
        console.log(`✅ Colisão configurada entre jogador e objetos de colisão`);
      }

      // Configurar colisão com NPCs
      if (this.professor && this.professor.sprite) {
        this.physics.add.collider(this.player.sprite, this.professor.sprite);
        console.log(`✅ Colisão configurada entre jogador e professor`);
      }

      console.log("✅ Colisões configuradas com sucesso!");
    } catch (e) {
      console.error("❌ Erro ao configurar colisões:", e);
    }
  }

  /**
   * Mostra uma tela de erro quando ocorrem problemas críticos
   */
  showErrorScreen(message) {
    // Criar fundo escuro
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const errorBg = this.add.graphics();
    errorBg.fillStyle(0x000000, 0.9);
    errorBg.fillRect(0, 0, width, height);

    // Mensagem de erro
    const errorText = this.add
      .text(width / 2, height / 2, "ERRO CRÍTICO", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "36px",
        color: "#FF0000",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    // Detalhes do erro
    const errorDetails = this.add
      .text(width / 2, height / 2 + 60, message, {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "24px",
        color: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    // Botão para voltar ao hub de missões
    const returnButton = this.add
      .text(width / 2, height / 2 + 140, "VOLTAR AO HUB DE MISSÕES", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "24px",
        color: "#FFFFFF",
        backgroundColor: "#0D84FF",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5);

    returnButton.setInteractive();
    returnButton.on("pointerdown", () => {
      this.scene.start("missionsHub");
    });
  }

  /**
   * Mostra informações de controle na tela
   */
  showControlsInfo() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // REVISADO: Criar painel com instruções de controle
    const controlsPanel = this.add.container(width / 2, height - 100);
    controlsPanel.setDepth(1000);
    controlsPanel.setScrollFactor(0);

    // Fundo do painel
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x000000, 0.7);
    panelBg.fillRoundedRect(-300, -40, 600, 80, 10);
    panelBg.lineStyle(2, this.colors.secondary, 0.8);
    panelBg.strokeRoundedRect(-300, -40, 600, 80, 10);

    // Texto de controles
    const controlsText = this.add
      .text(0, 0, "CONTROLES: Setas ou WASD = Mover | E = Interagir | ESC = Menu | ESPAÇO = Avançar diálogo", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    controlsPanel.add([panelBg, controlsText]);

    // Animar entrada do painel
    controlsPanel.setAlpha(0);
    controlsPanel.y = height + 50;

    this.tweens.add({
      targets: controlsPanel,
      y: height - 50,
      alpha: 1,
      duration: 800,
      ease: "Back.easeOut",
      delay: 1000,
    });

    // Ocultar após alguns segundos
    this.time.delayedCall(8000, () => {
      this.tweens.add({
        targets: controlsPanel,
        y: height + 50,
        alpha: 0,
        duration: 800,
        ease: "Back.easeIn",
      });
    });
  }

  /**
   * Habilita o modo de depuração
   */
  enableDebugMode() {
    // Criar mapa de colisão
    this.debugGraphics = this.add.graphics();

    if (this.map && this.layers.collision) {
      this.map.renderDebug(
        this.debugGraphics,
        {
          tileColor: null,
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128),
          faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        },
        this.layers.collision
      );
    }

    // Exibir limites de debug para físicas
    this.physics.world.createDebugGraphic();

    // Adicionar painel de informações
    this.debugPanel = this.add.text(10, 10, "Debug Info", {
      fontSize: "16px",
      fill: "#FFFFFF",
      backgroundColor: "#000000",
    });
    this.debugPanel.setScrollFactor(0);
    this.debugPanel.setDepth(9999);

    // Atualizar informações de debug a cada frame
    this.events.on("update", () => {
      if (this.player && this.player.sprite) {
        this.debugPanel.setText(`Position: (${Math.floor(this.player.sprite.x)}, ${Math.floor(this.player.sprite.y)})\n` + `Camera: (${Math.floor(this.cameras.main.scrollX)}, ${Math.floor(this.cameras.main.scrollY)})\n` + `FPS: ${Math.floor(this.game.loop.actualFps)}`);
      }
    });
  }

  /**
   * Configura as teclas de controle do jogador
   */
  setupControls() {
    console.log("🎮 Configurando controles...");

    // REVISADO: Adicionadas setas como alternativa a WASD
    this.keys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      // Setas adicionadas como alternativa
      upArrow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      downArrow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      leftArrow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      rightArrow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      // Outros controles
      interact: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      menu: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
      hud: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    console.log("✅ Controles configurados!");
  }

  /**
   * Processa dados passados de outras cenas
   */
  processSceneData(data) {
    console.log("📊 Dados recebidos:", data);

    if (data && data.fromGameInicial) {
      // Se veio do jogo inicial, mostrar mensagem de transição
      this.showTaskNotification("Novo Objetivo: Encontre o professor no jardim da escola");
    }
  }

  /**
   * Redimensiona elementos da cena quando a janela é redimensionada
   */
  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    console.log(`🔄 Redimensionando para ${width}x${height}`);

    try {
      // Atualizar posição da câmera
      if (this.cameras.main && this.player) {
        this.cameras.main.startFollow(this.player.sprite);
      }

      // REVISADO: Recriar UI quando a tela for redimensionada
      if (this.uiContainer) {
        // Destruir UI existente
        this.uiContainer.destroy();

        // Recriar UI
        this.createUI();
      }
    } catch (e) {
      console.error("❌ Erro ao redimensionar:", e);
    }
  }

  /**
   * Anima a entrada na cena com fade
   */
  fadeInScene() {
    this.cameras.main.fadeIn(this.fadeSpeed, 0, 0, 0);
  }

  /**
   * Configura a câmera para seguir o jogador
   */
  setupCamera() {
    if (!this.player || !this.player.sprite) {
      console.warn("⚠️ Jogador não disponível para configurar câmera");
      return;
    }

    // Configurar a câmera principal para seguir o jogador
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);

    // Definir limites da câmera baseados no tamanho do mapa
    if (this.map) {
      camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      console.log(`📸 Câmera configurada com limites: ${this.map.widthInPixels}x${this.map.heightInPixels}`);
    } else {
      console.warn("⚠️ Mapa não disponível, não foi possível definir limites da câmera");
    }

    // Adicionar efeito de zoom suave
    camera.setZoom(1); // Iniciar com zoom normal

    console.log("✅ Câmera configurada com sucesso!");
  }

  /**
   * Método de atualização chamado a cada frame
   */
  update(time, delta) {
    try {
      // Atualizar jogador se existir
      if (this.player) {
        this.player.update(time, delta);
      }

      // Atualizar NPCs e interações
      this.updateNPCs(time, delta);

      // Atualizar UI
      this.updateUI(time, delta);

      // Verificar interações com objetos próximos
      this.checkInteractions();

      // Atualizar tarefas da missão
      this.updateTasks(time, delta);

      // Atualizar HUD do agente se existir
      if (this.agentHUD) {
        this.agentHUD.update(time, delta);
      }
    } catch (e) {
      console.error("❌ Erro no método update:", e);
    }
  }
}

// Tornar a classe disponível globalmente
window.jardimMission = jardimMission;
