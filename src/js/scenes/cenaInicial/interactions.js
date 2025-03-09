/**
 * Módulo para gerenciar as interações na cenaInicial
 * @module cenaInicial/interactions
 */

/**
 * Cria os elementos interativos na cena
 */
function createInteractiveElements() {
  // Grupo para elementos interativos
  this.interactiveElements = this.physics.add.group();

  // Área de "vazamento de dados"
  const dataBreachX = this.physics.world.bounds.width * 0.75;
  const dataBreachY = this.physics.world.bounds.height * 0.3;

  this.dataBreach = this.interactiveElements.create(dataBreachX, dataBreachY, "data_breach");
  this.dataBreach.setScale(0.2);
  this.dataBreach.setData("type", "data_breach");
  this.dataBreach.setData("interacted", false);

  // Computador com dados expostos
  const computerX = this.physics.world.bounds.width * 0.25;
  const computerY = this.physics.world.bounds.height * 0.6;

  this.computer = this.interactiveElements.create(computerX, computerY, "mission_item");
  this.computer.setScale(0.2);
  this.computer.setData("type", "computer");
  this.computer.setData("interacted", false);

  // Documento confidencial
  const documentX = this.physics.world.bounds.width * 0.6;
  const documentY = this.physics.world.bounds.height * 0.7;

  this.document = this.interactiveElements.create(documentX, documentY, "mission_item");
  this.document.setScale(0.2);
  this.document.setData("type", "document");
  this.document.setData("interacted", false);

  // Indicadores visuais de interação
  this.interactionIndicators = {};
  this.interactiveElements.getChildren().forEach((element) => {
    const indicator = this.add
      .image(element.x, element.y - 40, "interaction_icon")
      .setScale(0.15)
      .setVisible(false);

    this.interactionIndicators[element.getData("type")] = indicator;

    // Adicionar animação pulsante
    this.tweens.add({
      targets: indicator,
      scaleX: 0.18,
      scaleY: 0.18,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  });
}

/**
 * Mostra a introdução da missão
 */
function showMissionIntro() {
  if (typeof UIComponents !== "undefined") {
    const dialogBubble = UIComponents.createDialogBubble(this, this.cameras.main.width / 2, 100, "Missão: Escola de Dados\n\nIdentifique e solucione os problemas de proteção de dados na escola. Localize vazamentos e corrija políticas inadequadas.", {
      width: 500,
      autoSize: true,
      pointerDirection: "bottom",
      timeout: 8000,
    });
  } else {
    // Fallback se UIComponents não estiver disponível
    const text = this.add
      .text(this.cameras.main.width / 2, 100, "Missão: Escola de Dados\n\nIdentifique e solucione os problemas de proteção de dados na escola.", {
        fontSize: "18px",
        fontFamily: "Arial",
        fill: "#FFFFFF",
        backgroundColor: "#333333",
        padding: { x: 15, y: 10 },
        align: "center",
      })
      .setOrigin(0.5);

    // Auto-destruir após 8 segundos
    this.time.delayedCall(8000, () => {
      text.destroy();
    });
  }
}

/**
 * Gerencia a interação com os elementos
 */
function handleInteraction() {
  // Verificar se o jogador está próximo de algum elemento interativo
  let interactedElement = null;
  const interactionDistance = 100; // Distância para interação

  this.interactiveElements.getChildren().forEach((element) => {
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, element.x, element.y);

    if (distance < interactionDistance && !element.getData("interacted")) {
      interactedElement = element;
    }
  });

  // Se houver um elemento próximo, interagir com ele
  if (interactedElement) {
    const elementType = interactedElement.getData("type");

    switch (elementType) {
      case "data_breach":
        this.startDataBreachMinigame(interactedElement);
        break;
      case "computer":
        this.inspectComputer(interactedElement);
        break;
      case "document":
        this.collectDocument(interactedElement);
        break;
    }

    // Marcar como interagido
    interactedElement.setData("interacted", true);
    this.interactionIndicators[elementType].setVisible(false);

    // Verificar se todas as interações foram concluídas
    this.checkMissionCompletion();
  }
}

/**
 * Inicia o mini-game de vazamento de dados
 * @param {Phaser.GameObjects.Sprite} element - O elemento interativo
 */
function startDataBreachMinigame(element) {
  // Aqui implementaríamos o mini-game de conter vazamento de dados
  // Para simplicidade, apenas mostramos uma mensagem e damos pontos
  if (typeof UIComponents !== "undefined") {
    const dialogBubble = UIComponents.createDialogBubble(this, element.x, element.y - 80, "Você identificou um vazamento de dados sensíveis de alunos! Dados de saúde estavam expostos em um sistema sem proteção adequada.", {
      width: 300,
      autoSize: true,
      timeout: 5000,
    });
  }

  // Adicionar pontos pela descoberta
  if (this.agentHUD) {
    this.agentHUD.addPoints(25, "Vazamento identificado");
  }

  // Animar elemento
  this.tweens.add({
    targets: element,
    alpha: 0,
    y: element.y - 50,
    duration: 1000,
    onComplete: () => element.destroy(),
  });
}

/**
 * Inspeciona o computador
 * @param {Phaser.GameObjects.Sprite} element - O elemento interativo
 */
function inspectComputer(element) {
  if (typeof UIComponents !== "undefined") {
    const dialogBubble = UIComponents.createDialogBubble(this, element.x, element.y - 80, "Este computador tinha senhas de alunos salvas em um arquivo de texto! Você aplicou a política de proteção de credenciais da LGPD.", {
      width: 300,
      autoSize: true,
      timeout: 5000,
    });
  }

  // Adicionar pontos
  if (this.agentHUD) {
    this.agentHUD.addPoints(20, "Problema de senha resolvido");
  }

  // Animar elemento
  this.tweens.add({
    targets: element,
    alpha: 0,
    y: element.y - 50,
    duration: 1000,
    onComplete: () => element.destroy(),
  });
}

/**
 * Coleta o documento
 * @param {Phaser.GameObjects.Sprite} element - O elemento interativo
 */
function collectDocument(element) {
  if (typeof UIComponents !== "undefined") {
    const dialogBubble = UIComponents.createDialogBubble(this, element.x, element.y - 80, "Você encontrou uma lista impressa com dados médicos de alunos deixada em local público! Documento seguro e política de mesa limpa implementada.", {
      width: 300,
      autoSize: true,
      timeout: 5000,
    });
  }

  // Adicionar pontos
  if (this.agentHUD) {
    this.agentHUD.addPoints(15, "Documento seguro");
  }

  // Animar elemento
  this.tweens.add({
    targets: element,
    alpha: 0,
    y: element.y - 50,
    duration: 1000,
    onComplete: () => element.destroy(),
  });
}

/**
 * Verifica se a missão está completa
 */
function checkMissionCompletion() {
  // Verificar se todos os elementos foram interagidos
  const allInteracted = this.interactiveElements.getChildren().every((element) => element.getData("interacted"));

  if (allInteracted) {
    // Missão concluída!
    this.time.delayedCall(2000, () => {
      this.completeMission();
    });
  }
}

/**
 * Verifica a proximidade com elementos interativos
 */
function checkInteractionProximity() {
  const interactionDistance = 100;

  this.interactiveElements.getChildren().forEach((element) => {
    if (!element.getData("interacted")) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, element.x, element.y);

      const indicator = this.interactionIndicators[element.getData("type")];

      if (distance < interactionDistance) {
        if (indicator && !indicator.visible) {
          indicator.setVisible(true);

          // Mostrar dica de interação
          if (typeof UIComponents !== "undefined") {
            UIComponents.showNotification(this, "Pressione E para interagir", {
              duration: 2000,
            });
          }
        }

        // Atualizar posição do indicador
        if (indicator) {
          indicator.setPosition(element.x, element.y - 40);
        }
      } else if (indicator) {
        indicator.setVisible(false);
      }
    }
  });
}

// Exportando as funções para uso em outros módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createInteractiveElements,
    showMissionIntro,
    handleInteraction,
    startDataBreachMinigame,
    inspectComputer,
    collectDocument,
    checkMissionCompletion,
    checkInteractionProximity,
  };
}
