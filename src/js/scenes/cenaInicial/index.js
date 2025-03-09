/**
 * Cena de exploração onde o jogador controla o personagem
 */
class cenaInicial extends Phaser.Scene {
  constructor() {
    super({ key: "cenaInicial" });
  }

  preload() {
    // Carregar imagens de fundo
    this.load.image("scenario", "assets/images/backgrounds/fundocenaini.png");

    // Carregar sprites do personagem
    // Direção direita/esquerda
    this.load.image("character_right_idle", "assets/images/characters/bonecodir0.png");
    this.load.image("character_right_1", "assets/images/characters/bonecodir1.png");
    this.load.image("character_right_2", "assets/images/characters/bonecodir2.png");
    this.load.image("character_right_3", "assets/images/characters/bonecodir3.png");
    this.load.image("character_right_4", "assets/images/characters/bonecodir4.png");
    this.load.image("character_right_5", "assets/images/characters/bonecodir5.png");
    this.load.image("character_right_6", "assets/images/characters/bonecodir6.png");

    // Direção para baixo
    this.load.image("character_down_idle", "assets/images/characters/bonecobax0.png");
    this.load.image("character_down_1", "assets/images/characters/bonecobax1.png");
    this.load.image("character_down_2", "assets/images/characters/bonecobax2.png");
    this.load.image("character_down_3", "assets/images/characters/bonecobax3.png");
    this.load.image("character_down_4", "assets/images/characters/bonecobax4.png");
    this.load.image("character_down_5", "assets/images/characters/bonecobax5.png");
    this.load.image("character_down_6", "assets/images/characters/bonecobax6.png");

    // Direção para cima
    this.load.image("character_up_idle", "assets/images/characters/bonecocim0.png");
    this.load.image("character_up_1", "assets/images/characters/bonecocim1.png");
    this.load.image("character_up_2", "assets/images/characters/bonecocim2.png");
    this.load.image("character_up_3", "assets/images/characters/bonecocim3.png");
    this.load.image("character_up_4", "assets/images/characters/bonecocim4.png");
    this.load.image("character_up_5", "assets/images/characters/bonecocim5.png");
    this.load.image("character_up_6", "assets/images/characters/bonecocim6.png");

    // Interface e elementos interativos
    this.load.image("interaction_icon", "assets/images/ui/botaoverde.png");
    this.load.image("dialog_bg", "assets/images/ui/caixadialogo.png");

    // Recursos para mini-desafios
    this.load.image("data_breach", "assets/images/ui/botaovermelho.png");
    this.load.image("mission_item", "assets/images/ui/celularasset.png");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Configurar o mapa de jogo mais amplo que a tela
    const mapWidth = width * 2;
    const mapHeight = height * 2;

    // Criar o ambiente
    this.createEnvironment(mapWidth, mapHeight);

    // Criar o jogador no centro do mapa
    this.createPlayer(mapWidth, mapHeight);

    // Configurar controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Configurar câmera para seguir o personagem
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    // Definir a velocidade de movimento
    this.playerSpeed = 270;

    // Direção para animações
    this.lastDirection = "down";

    // Criar HUD do agente
    this.createAgentHUD();

    // Criar elementos interativos
    this.createInteractiveElements();

    // Mensagem de boas-vindas/objetivo
    this.time.delayedCall(1000, () => {
      this.showMissionIntro();
    });

    // Configurar input para interações
    this.input.keyboard.on("keydown-E", () => this.handleInteraction());

    // Exibir ajuda para interação
    if (typeof UIComponents !== "undefined") {
      UIComponents.showNotification(this, "Use as setas para mover o agente e pressione E para interagir", {
        duration: 5000,
      });
    }
  }

  createEnvironment(mapWidth, mapHeight) {
    // Importar função do módulo environment
    const { createEnvironment } = require("./environment.js");
    createEnvironment.call(this, mapWidth, mapHeight);
  }

  createPlayer(mapWidth, mapHeight) {
    // Importar função do módulo player
    const { createPlayer, createPlayerAnimations } = require("./player.js");

    this.player = createPlayer.call(this, mapWidth, mapHeight);
    createPlayerAnimations.call(this);
  }

  createAgentHUD() {
    try {
      // Verificar se a classe AgentHUD existe
      if (typeof AgentHUD !== "undefined") {
        this.agentHUD = new AgentHUD(this);
      } else {
        console.warn("AgentHUD não está definido. A HUD não será criada.");
      }
    } catch (e) {
      console.error("Erro ao criar AgentHUD:", e);
    }
  }

  createInteractiveElements() {
    // Importar função do módulo interactions
    const { createInteractiveElements } = require("./interactions.js");
    createInteractiveElements.call(this);
  }

  showMissionIntro() {
    // Importar função do módulo dialog
    const { showMissionIntro } = require("./interactions.js");
    showMissionIntro.call(this);
  }

  handleInteraction() {
    // Importar função do módulo interactions
    const { handleInteraction } = require("./interactions.js");
    handleInteraction.call(this);
  }

  checkMissionCompletion() {
    // Importar função do módulo interactions
    const { checkMissionCompletion } = require("./interactions.js");
    checkMissionCompletion.call(this);
  }

  completeMission() {
    // Importar função do módulo completion
    const { completeMission } = require("./completion.js");
    completeMission.call(this);
  }

  createSimpleButton(x, y, text, callback) {
    // Função de fallback para criar botões simples
    const button = this.add
      .text(x, y, text, {
        fontSize: "24px",
        fontFamily: "Arial",
        fill: "#FFFFFF",
        backgroundColor: "#0d84ff",
        padding: { x: 15, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    button.on("pointerdown", callback);

    return button;
  }

  goToMissionHub() {
    // Transição para o hub de missões
    this.cameras.main.fadeOut(500);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("missionsHub");
    });
  }

  goToNextMission() {
    // Indicar que o jogo demo chegou ao fim
    this.cameras.main.fadeOut(500);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("missionsHub");

      // Aviso de versão demo
      this.time.delayedCall(500, () => {
        if (typeof UIComponents !== "undefined") {
          UIComponents.showNotification(this.scene.get("missionsHub"), "Você completou todas as missões disponíveis na versão demo!", {
            duration: 5000,
            backgroundColor: 0xf57c00,
          });
        }
      });
    });
  }

  update() {
    // Movimento do jogador
    this.handlePlayerMovement();

    // Verificar proximidade para interações
    this.checkInteractionProximity();
  }

  handlePlayerMovement() {
    // Importar função do módulo player
    const { handlePlayerMovement } = require("./player.js");
    handlePlayerMovement.call(this);
  }

  checkInteractionProximity() {
    // Importar função do módulo interactions
    const { checkInteractionProximity } = require("./interactions.js");
    checkInteractionProximity.call(this);
  }
}

// Necessário para o sistema modular
if (typeof module !== "undefined" && module.exports) {
  module.exports = cenaInicial;
}

// Manter a classe disponível globalmente para compatibilidade
window.cenaInicial = cenaInicial;
