/**
 * Menu Principal do Jogo DPO Hero
 * @class mainMenu
 * @extends Phaser.Scene
 * @description Tela inicial do jogo com animações e opções interativas
 */

// Função para carregar scripts dinamicamente (isolada em um IIFE)
(function () {
  function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback || function () {};
    document.head.appendChild(script);
  }

  // Carregar scripts de módulos do menu
  const mainMenuModules = ["environment.js", "interface.js", "buttons.js", "modals.js"];

  const mainMenuPath = "src/js/scenes/mainMenu/";
  let loadedCount = 0;

  mainMenuModules.forEach((module) => {
    loadScript(mainMenuPath + module, function () {
      loadedCount++;
      if (loadedCount === mainMenuModules.length) {
        console.log("✅ Todos os módulos do Menu Principal carregados com sucesso!");
      }
    });
  });
})();

class mainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "mainMenu" });

    // Configurações
    this.buttonSpacing = 80;
    this.titleY = 140;
    this.soundEnabled = true;

    // Cores
    this.colors = {
      primary: 0x0d84ff, // Azul principal
      secondary: 0x39f5e2, // Ciano secundário
      accent: 0xff3a3a, // Vermelho para alertas
      dark: 0x0a192f, // Fundo escuro
      darkGlass: 0x0a192f, // Fundo semi-transparente
    };
  }

  /**
   * Pré-carrega os recursos necessários para a cena
   */
  preload() {
    // Carregar imagens
    this.load.image("menu_bg", "assets/images/backgrounds/fundooriginal.png");
    this.load.image("logo", "assets/images/backgrounds/MainMenuTitulo.png");
    this.load.image("button_bg", "assets/images/ui/botao_retangular.png");
    this.load.image("hero_icon", "assets/images/ui/celularasset.png");
    this.load.image("play_button", "assets/images/ui/botaoplay.png");
    this.load.image("settings_button", "assets/images/ui/botaocfg.png");
    this.load.image("info_button", "assets/images/ui/botaoinfo.png");

    // Verificar e carregar sons apenas se existirem
    const soundPaths = [
      { key: "click_sound", path: "assets/sounds/click.mp3" },
      { key: "hover_sound", path: "assets/sounds/hover.mp3" },
      { key: "menu_music", path: "assets/sounds/menu_music.mp3" },
    ];

    for (const sound of soundPaths) {
      this.load.once("fileerror-audio-" + sound.key, () => {
        console.warn(`Som ${sound.key} não encontrado, continuando sem ele.`);
        this.soundEnabled = false;
      });
      this.load.audio(sound.key, sound.path);
    }

    // Carregar fontes web seguras para fallback
    this.fontFamily = "'Chakra Petch', 'OldSchoolAdventures', sans-serif";
    this.titleFontFamily = "'Press Start 2P', 'OldSchoolAdventures', monospace";
  }

  /**
   * Cria todos os elementos da cena
   */
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Configurar sistema responsivo
    this.setupResponsiveDesign(width, height);

    // Iniciar música de fundo (se disponível)
    this.setupBackgroundMusic();

    // Criar ambiente visual
    this.createEnvironment(width, height);

    // Criar elementos de interface
    this.createInterface(width, height);

    // Animar elementos na entrada
    this.animateElements();

    // Verificar dados salvos para continuar jogo
    this.checkSavedGame();

    // Mostrar dica inicial
    this.showTip("Bem-vindo ao DPO Hero! Proteja os dados pessoais e combata as ameaças à privacidade.");

    // Fade in inicial
    this.cameras.main.fadeIn(1000, 0, 0, 0);
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

    // Reposicionar título
    if (this.titleContainer) {
      this.titleContainer.setPosition(width / 2, this.titleY);
    }

    // Reposicionar menu
    if (this.menuContainer) {
      this.menuContainer.setPosition(width / 2, height / 2);
    }

    // Reposicionar rodapé
    if (this.versionText) {
      this.versionText.setPosition(width - 20, height - 20);
    }
  }

  /**
   * Método de atualização chamado a cada frame
   * @param {number} time - Tempo atual
   * @param {number} delta - Tempo desde o último frame
   */
  update(time, delta) {
    // Update contínuo da cena
    this.updateTime = time;
  }
}

// Tornar a classe disponível globalmente
window.mainMenu = mainMenu;
