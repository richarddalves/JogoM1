/**
 * Funções relacionadas às notificações da HUD do Agente
 */
(function () {
  /**
   * Mostra uma notificação na tela
   * @param {Object} config - Configuração da notificação
   * @param {string} config.message - Mensagem a ser exibida
   * @param {string} config.type - Tipo de notificação (default, points, levelUp, warning, error)
   * @param {number} config.duration - Duração da notificação em ms
   * @public
   */
  AgentHUD.prototype.showNotification = function (config) {
    // Adicionar à fila de notificações
    this.notificationQueue.push(config);

    // Processar a fila se não estiver ocupado
    if (!this.isProcessingNotification) {
      this.processNextNotification();
    }
  };

  /**
   * Processa a próxima notificação na fila
   * @private
   */
  AgentHUD.prototype.processNextNotification = function () {
    if (this.notificationQueue.length === 0) {
      this.isProcessingNotification = false;
      return;
    }

    this.isProcessingNotification = true;
    const config = this.notificationQueue.shift();

    // Determinar estilo com base no tipo
    let backgroundColor, textColor;
    switch (config.type) {
      case "points":
        backgroundColor = this.style.colors.primary;
        textColor = "#FFFFFF";
        break;
      case "levelUp":
        backgroundColor = this.style.colors.warning;
        textColor = "#000000";
        break;
      case "warning":
        backgroundColor = 0xffa500;
        textColor = "#000000";
        break;
      case "error":
        backgroundColor = this.style.colors.accent;
        textColor = "#FFFFFF";
        break;
      default:
        backgroundColor = 0x333333;
        textColor = "#FFFFFF";
    }

    // Criar o container de notificação
    const notification = this.scene.add.container(this.scene.cameras.main.width / 2, 50).setDepth(3000);

    // Fundo da notificação
    const notifBg = this.scene.add.graphics();
    const padding = 15;
    const fontSize = config.type === "levelUp" ? 20 : 16;

    // Texto da notificação
    const notifText = this.scene.add
      .text(0, 0, config.message, {
        fontSize: `${fontSize}px`,
        fontFamily: this.style.fonts.main.fontFamily,
        fill: textColor,
        align: "center",
      })
      .setOrigin(0.5);

    // Calcular tamanho do fundo baseado no texto
    const bgWidth = notifText.width + padding * 2;
    const bgHeight = notifText.height + padding * 2;

    // Desenhar fundo com tamanho apropriado
    this.drawRoundedRect(notifBg, -bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 10, backgroundColor, 0xffffff, 2, 0.9);

    // Adicionar ao container
    notification.add([notifBg, notifText]);

    // Inicialmente invisível
    notification.setAlpha(0);
    notification.y = -50;

    // Animação de entrada
    this.scene.tweens.add({
      targets: notification,
      y: 50,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Esperar a duração da notificação
        this.scene.time.delayedCall(config.duration || 2000, () => {
          // Animação de saída
          this.scene.tweens.add({
            targets: notification,
            y: -50,
            alpha: 0,
            duration: 300,
            ease: "Back.easeIn",
            onComplete: () => {
              notification.destroy();
              // Processar a próxima notificação
              this.processNextNotification();
            },
          });
        });
      },
    });
  };

  console.log("✅ Sistema de Notificações carregado");
})();
