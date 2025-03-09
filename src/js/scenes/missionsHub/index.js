/**
 * Central de Missões - Hub principal para seleção de missões
 * @class missionsHub
 * @extends Phaser.Scene
 * @description Permite ao jogador visualizar e selecionar missões disponíveis
 */

// Função para carregar scripts dinamicamente
(function () {
  function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onerror = function () {
      console.error(`❌ Erro ao carregar: ${url}`);
    };
    script.onload = callback || function () {};
    document.head.appendChild(script);
  }

  // Carregar scripts de módulos da cena
  const missionsHubModules = ["interface.js", "missions.js", "navigation.js"];

  const missionsHubPath = "src/js/scenes/missionsHub/";
  let loadedCount = 0;

  missionsHubModules.forEach((module) => {
    loadScript(missionsHubPath + module, function () {
      loadedCount++;
      if (loadedCount === missionsHubModules.length) {
        console.log("✅ Todos os módulos do Hub de Missões carregados com sucesso!");
      }
    });
  });
})();

class missionsHub extends Phaser.Scene {
  constructor() {
    super({ key: "missionsHub" });

    // Configurações iniciais
    this.missionIndex = 0;
    this.totalMissions = 0;
    this.unlockedMissions = 0;
    this.playerProgress = {
      completedMissions: [],
      currentPoints: 0,
      level: 1,
    };

    // Referências para elementos de UI
    this.uiElements = {};
    this.activeButtons = {};
    this.missionCards = [];

    // Flag para evitar carregamentos duplicados
    this.isTransitioning = false;
  }

  /**
   * Inicializa a cena com dados externos
   * @param {Object} data - Dados passados para a cena
   */
  init(data) {
    // Resetar o estado de transição para evitar bloqueios
    this.isTransitioning = false;

    // Verificar se estamos retornando de uma missão
    if (data && data.missionComplete) {
      // Aguardar carregamento completo antes de processar
      this.events.once("create", () => {
        this.handleMissionReturn(data);
      });
    }
  }

  /**
   * Pré-carrega todos os recursos necessários para a cena
   */
  preload() {
    // Carregar imagens de fundo e UI
    this.load.image("hub_bg", "assets/images/backgrounds/fundoHUB.png");
    this.load.image("mission_card", "assets/images/ui/painel_retangular.png");
    this.load.image("button", "assets/images/ui/botao_retangular.png");
    this.load.image("button_green", "assets/images/ui/botaoverde.png");
    this.load.image("button_red", "assets/images/ui/botaovermelho.png");
    this.load.image("icon_complete", "assets/images/ui/correto.png");
    this.load.image("icon_locked", "assets/images/ui/cadeado_fechado.png");

    // Carregar sons
    this.load.audio("select", "assets/sounds/select.mp3");
    this.load.audio("hover", "assets/sounds/hover.mp3");
    this.load.audio("click", "assets/sounds/click.mp3");

    // Fontes seguras para fallback
    this.fontFamily = "'Chakra Petch', 'OldSchoolAdventures', sans-serif";
  }

  /**
   * Cria todos os elementos necessários para a cena
   */
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Sistema de responsividade
    this.setupResponsiveDesign(width, height);

    // Adicionar fundo
    this.createBackground(width, height);

    // Carregar dados do jogador (de um sistema de salvamento)
    this.loadPlayerData();

    // Configurar as missões disponíveis
    this.setupMissions();

    // Criar interface de navegação e seleção de missões
    this.createInterface(width, height);

    // Mostrar missões iniciais
    this.displayMissions();

    // Adicionar eventos de navegação
    this.setupNavigationEvents();

    // Fade in na cena
    this.cameras.main.fadeIn(800, 0, 0, 0);

    // Emitir evento de criação completa
    this.events.emit("create");
  }

  /**
   * Método de atualização chamado a cada frame
   * @param {number} time - Tempo atual
   * @param {number} delta - Tempo desde o último frame
   */
  update(time, delta) {
    // Atualizar elementos animados se necessário
  }

  /**
   * Configura o sistema responsivo para adaptar a cena a diferentes tamanhos de tela
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  setupResponsiveDesign(width, height) {
    this.scale.on("resize", this.resize, this);

    // Calcular escalas com base na resolução
    this.uiScale = Math.min(width / 1280, height / 720);

    // Armazenar dimensões para usar em outros métodos
    this.screenWidth = width;
    this.screenHeight = height;
  }

  /**
   * Redimensiona e reposiciona os elementos quando a tela muda de tamanho
   * @param {any} gameSize - O novo tamanho do jogo
   */
  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Atualizar dimensões armazenadas
    this.screenWidth = width;
    this.screenHeight = height;

    // Recalcular escalas
    this.uiScale = Math.min(width / 1280, height / 720);

    // Redimensionar fundo
    if (this.background) {
      this.background.setDisplaySize(width, height);
      this.background.setPosition(width / 2, height / 2);
    }

    // Recriar interface e reposicionar elementos
    this.recreateInterface(width, height);
  }

  /**
   * Cria o fundo da cena
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  createBackground(width, height) {
    // Fundo principal
    this.background = this.add
      .image(width / 2, height / 2, "hub_bg")
      .setDisplaySize(width, height)
      .setAlpha(0.9);

    // Adicionar overlay gradiente para melhorar contraste
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000022, 0.5);
    overlay.fillRect(0, 0, width, height);

    // Grade digital futurista
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

    // Efeito de vinheta
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.6);
    vignette.fillRect(0, 0, width, height);

    // Criar um "buraco" no centro usando uma máscara para o efeito de vinheta
    const mask = this.add.graphics();
    for (let r = Math.min(width, height) * 0.5; r > 0; r -= 10) {
      const alpha = 1 - r / (Math.min(width, height) * 0.5);
      mask.fillStyle(0xffffff, alpha);
      mask.fillCircle(width / 2, height / 2, r);
    }

    // Aplicar máscara para criar o efeito de vinheta
    vignette.setMask(new Phaser.Display.Masks.GeometryMask(this, mask));
    mask.setVisible(false);
  }

  /**
   * Carrega dados do jogador (salvos localmente ou em servidor)
   */
  loadPlayerData() {
    try {
      // Verificar se há dados salvos no localStorage
      const savedData = localStorage.getItem("dpoHeroProgress");
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        // Verificar se os dados são válidos e atualizá-los
        if (parsedData && parsedData.completedMissions) {
          this.playerProgress = parsedData;
        }
      }

      console.log("✅ Dados do jogador carregados com sucesso");
    } catch (error) {
      console.error("❌ Erro ao carregar dados do jogador:", error);
      // Usar dados padrão em caso de erro
      this.playerProgress = {
        completedMissions: [],
        currentPoints: 0,
        level: 1,
      };
    }
  }
}

// Tornar a classe disponível globalmente
window.missionsHub = missionsHub;
