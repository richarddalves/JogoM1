/**
 * Tela de seleção de papel/função no jogo
 * @class chooseRole
 * @extends Phaser.Scene
 * @description Permite ao jogador escolher seu papel no jogo (professor ou aluno)
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

  // Carregar scripts de módulos da cena
  const chooseRoleModules = ["interface.js", "animations.js", "roleDefinitions.js"];

  const chooseRolePath = "src/js/scenes/chooseRole/";
  let loadedCount = 0;

  chooseRoleModules.forEach((module) => {
    loadScript(chooseRolePath + module, function () {
      loadedCount++;
      if (loadedCount === chooseRoleModules.length) {
        console.log("✅ Todos os módulos de Escolha de Papel carregados com sucesso!");
      }
    });
  });
})();

class chooseRole extends Phaser.Scene {
  constructor() {
    super({ key: "chooseRole" });

    // Configurações
    this.selectedRole = null;
    this.soundEnabled = true;

    // Cores e estilos
    this.colors = {
      primary: 0x0d84ff, // Azul principal
      secondary: 0x39f5e2, // Ciano secundário
      accent: 0xff3a3a, // Vermelho para alertas
      dark: 0x0a192f, // Fundo escuro
      darkGlass: 0x1a1a2e, // Fundo com transparência
    };

    // Armazenar referências para tweens ativos
    this.activeTweens = {};
  }

  /**
   * Pré-carrega os recursos necessários para a cena
   */
  preload() {
    // Carregar imagens
    this.load.image("select_bg", "assets/images/backgrounds/fundooriginal.png");
    this.load.image("panel_bg", "assets/images/ui/painel_retangular.png");
    this.load.image("role_icon", "assets/images/ui/botaoverde.png");
    this.load.image("lock_icon", "assets/images/ui/botaovermelho.png");
    this.load.image("badge_icon", "assets/images/ui/caixadialogo.png");

    // Personagens/Avatares
    this.load.image("teacher_avatar", "assets/images/cientistacientista.png");
    this.load.image("student_avatar", "assets/images/homemcabelopreto.png");

    // Verificar e carregar sons
    const soundPaths = [
      { key: "select_sound", path: "assets/sounds/select.mp3" },
      { key: "hover_sound", path: "assets/sounds/hover.mp3" },
      { key: "confirm_sound", path: "assets/sounds/confirm.mp3" },
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

    // Criar ambiente visual
    this.createEnvironment(width, height);

    // Criar elementos de interface
    this.createInterface(width, height);

    // Criar opções de seleção
    this.createRoleOptions(width, height);

    // Fade in inicial
    this.cameras.main.fadeIn(800, 0, 0, 0);
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
      this.overlay.fillStyle(0x1e1e1e, 0.7);
      this.overlay.fillRect(0, 0, width, height);
    }

    // Reposicionar título
    if (this.titleContainer) {
      this.titleContainer.setPosition(width / 2, height * 0.15);
    }

    // Reposicionar opções
    if (this.optionsContainer) {
      this.optionsContainer.setPosition(width / 2, height / 2);
    }

    // Reposicionar botão de voltar
    if (this.backButton) {
      this.backButton.setPosition(width / 2, height * 0.92);
    }

    // Reposicionar caixa de informações
    if (this.infoContainer) {
      this.infoContainer.setPosition(width / 2, height * 0.85);

      // Atualizar tamanho da caixa
      const boxBg = this.infoContainer.getAt(0);
      if (boxBg) {
        boxBg.clear();
        boxBg.fillStyle(this.colors.primary, 0.2);
        boxBg.fillRoundedRect((-width * 0.7) / 2, -25, width * 0.7, 50, 10);

        boxBg.lineStyle(2, this.colors.secondary, 0.4);
        boxBg.strokeRoundedRect((-width * 0.7) / 2, -25, width * 0.7, 50, 10);
      }
    }
  }
}

// Tornar a classe disponível globalmente
window.chooseRole = chooseRole;
