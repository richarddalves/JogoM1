/**
 * Cena de diálogo inicial com o agente instrutor
 * @class conversation
 * @extends Phaser.Scene
 * @description Apresenta o diálogo de introdução entre o agente instrutor e o jogador
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
  const conversationModules = ["dialogs.js", "characters.js", "interface.js", "typewriter.js", "deviceManager.js"];

  const conversationPath = "src/js/scenes/conversation/";
  let loadedCount = 0;

  conversationModules.forEach((module) => {
    loadScript(conversationPath + module, function () {
      loadedCount++;
      if (loadedCount === conversationModules.length) {
        console.log("✅ Todos os módulos de Conversação carregados com sucesso!");
      }
    });
  });
})();

class conversation extends Phaser.Scene {
  constructor() {
    super({ key: "conversation" });

    // Configurações iniciais
    this.characterScale = 0.8;
    this.dialogIndex = 0;
    this.textSpeed = 22; // ms por caractere para efeito de digitação
    this.isTyping = false;
    this.soundEnabled = false; // Desabilitando sons

    // Container para botões ativos
    this.activeButtons = {};
  }

  /**
   * Pré-carrega todos os recursos necessários para a cena
   */
  preload() {
    // Carregar imagens
    this.load.image("dialog_bg", "assets/images/backgrounds/fundoconversation.png");
    this.load.image("dialog_box", "assets/images/ui/caixadialogo.png");
    this.load.image("agent", "assets/images/homemcabelopreto.png");
    this.load.image("tutor", "assets/images/cientistacientista.png");
    this.load.image("device", "assets/images/ui/celularasset.png");
    this.load.image("button", "assets/images/ui/botao_retangular.png");
    this.load.image("arrow", "assets/images/ui/botao_avancar.png");

    // Carregar fontes web seguras que serão usadas como fallback
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

    // Adicionar fundo futurista
    this.createEnvironment(width, height);

    // Criar personagens
    this.createCharacters(width, height);

    // Criar interface de diálogo
    this.createDialogInterface(width, height);

    // Criar interface do dispositivo do agente (tablet/celular)
    this.createAgentDevice(width, height);

    // Configurar diálogos
    this.setupDialogs();

    // Inicializar animações e efeitos
    this.setupAnimations();

    // Iniciar o primeiro diálogo
    this.updateDialog();

    // Adicionar evento de clique em qualquer lugar para avançar diálogo
    this.input.on("pointerdown", (pointer) => {
      // Verificar se não clicou nos botões
      if (this.isTyping) {
        // Se estiver digitando, mostra o texto completo imediatamente
        this.skipTypewriterEffect();
      } else if (!this.isClickingButton(pointer)) {
        this.nextDialog();
      }
    });

    // Adicionar teclas para navegação pelo teclado
    this.setupKeyboardControls();

    // Fade in na cena
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  /**
   * Método de atualização chamado a cada frame
   * @param {number} time - Tempo atual
   * @param {number} delta - Tempo desde o último frame
   */
  update(time, delta) {
    // Adicionar lógica de atualização, se necessário
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
    this.charScale = Math.min(width / 1920, height / 1080) * this.characterScale;
    this.charScale *= 1.4;

    // Redimensionar fundo
    if (this.background) {
      this.background.setDisplaySize(width, height);
      this.background.setPosition(width / 2, height / 2);
    }

    // Reposicionar personagens
    if (this.agentCharacter && this.tutorCharacter) {
      this.agentCharacter.setPosition(width * 0.25, height * 0.55);
      this.agentCharacter.setScale(this.charScale * 1.3);

      this.tutorCharacter.setPosition(width * 0.75, height * 0.5);
      this.tutorCharacter.setScale(this.charScale * 1.4);
    }

    // Atualizar posição do dispositivo
    if (this.agentDevice) {
      this.agentDevice.setPosition(width - 70, 70);
      this.agentDevice.setScale(this.uiScale * 1.5);

      // Atualizar brilho e label
      if (this.deviceElements && this.deviceElements.glow) {
        const glow = this.deviceElements.glow;
        glow.clear();
        glow.fillStyle(0x39f5e2, 0.3);
        glow.fillCircle(width - 70, 70, 55);

        const glow2 = this.deviceElements.glow2;
        if (glow2) {
          glow2.clear();
          glow2.fillStyle(0x39f5e2, 0.2);
          glow2.fillCircle(width - 70, 70, 65);
        }
      }

      if (this.deviceElements && this.deviceElements.label) {
        this.deviceElements.label.setPosition(width - 70, 130);
      }
    }

    // Reconstruir interface de diálogo com verificações de segurança
    this.recreateDialogInterface(width, height);
  }
}

// Tornar a classe disponível globalmente
window.conversation = conversation;
