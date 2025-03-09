/**
 * Funções relacionadas ao dispositivo do agente na cena de conversação
 */
(function () {
  /**
   * Cria o dispositivo do agente (tablet/celular) com efeito aprimorado
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  conversation.prototype.createAgentDevice = function (width, height) {
    // Container para o dispositivo
    this.deviceContainer = this.add.container(0, 0);

    // Criar o dispositivo - Aumentando a escala do dispositivo
    this.agentDevice = this.add
      .image(width - 70, 70, "device")
      .setOrigin(0.5)
      .setScale(this.uiScale * 1.5) // Aumentado ainda mais
      .setInteractive()
      .setVisible(false)
      .setAlpha(0);

    // Efeito de brilho com tamanho aumentado
    const deviceGlow = this.add.graphics();
    deviceGlow.fillStyle(0x39f5e2, 0.3);
    deviceGlow.fillCircle(width - 70, 70, 55); // Aumentado
    deviceGlow.setVisible(false);

    // Segundo efeito de brilho para animação
    const deviceGlow2 = this.add.graphics();
    deviceGlow2.fillStyle(0x39f5e2, 0.2);
    deviceGlow2.fillCircle(width - 70, 70, 65); // Maior que o primeiro
    deviceGlow2.setVisible(false);

    // Texto indicativo melhorado
    const deviceLabel = this.add
      .text(width - 70, 130, "LGPD", {
        fontSize: "20px", // Aumentado
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setAlpha(0);

    // Adicionar todos ao container
    this.deviceContainer.add([deviceGlow2, deviceGlow, this.agentDevice, deviceLabel]);

    // Eventos para interação do dispositivo
    this.agentDevice.on("pointerdown", () => {
      // Efeito de feedback ao clicar
      this.tweens.add({
        targets: this.agentDevice,
        scaleX: this.uiScale * 1.4,
        scaleY: this.uiScale * 1.4,
        duration: 100,
        yoyo: true,
        ease: "Back.easeOut",
      });

      // Feedback visual adicional
      const clickEffect = this.add.graphics();
      clickEffect.fillStyle(0x39f5e2, 0.5);
      clickEffect.fillCircle(width - 70, 70, 60);
      this.deviceContainer.add(clickEffect);

      this.tweens.add({
        targets: clickEffect,
        alpha: 0,
        scale: 1.5,
        duration: 500,
        onComplete: () => clickEffect.destroy(),
      });

      if (window.game) {
        try {
          if (typeof registrarCenaAtual === "function") {
            registrarCenaAtual();
          }
        } catch (e) {
          console.warn("Função registrarCenaAtual não disponível:", e);
        }
      }
      if (typeof window.openPhone === "function") {
        window.openPhone();
      }
    });

    this.agentDevice.on("pointerover", () => {
      // Efeito de hover
      this.tweens.add({
        targets: this.agentDevice,
        scale: this.uiScale * 1.6, // Maior ao passar o mouse
        duration: 200,
        ease: "Back.easeOut",
      });

      // Aumentar brilho ao passar o mouse
      if (deviceGlow.visible) {
        this.tweens.add({
          targets: [deviceGlow, deviceGlow2],
          alpha: 0.7,
          scale: 1.2,
          duration: 200,
        });
      }

      deviceLabel.setAlpha(1);
    });

    this.agentDevice.on("pointerout", () => {
      // Retornar ao tamanho normal
      this.tweens.add({
        targets: this.agentDevice,
        scale: this.uiScale * 1.5, // Tamanho normal
        duration: 200,
        ease: "Power1",
      });

      // Reduzir brilho ao sair com o mouse
      if (deviceGlow.visible) {
        this.tweens.add({
          targets: [deviceGlow, deviceGlow2],
          alpha: { deviceGlow: 0.3, deviceGlow2: 0.2 },
          scale: 1,
          duration: 200,
        });
      }

      deviceLabel.setAlpha(0.7);
    });

    // Referências para animação
    this.deviceElements = {
      device: this.agentDevice,
      glow: deviceGlow,
      glow2: deviceGlow2,
      label: deviceLabel,
    };
  };

  /**
   * Mostra o dispositivo do agente com animação aprimorada
   */
  conversation.prototype.showAgentDevice = function () {
    const { device, glow, glow2, label } = this.deviceElements;

    // Verificar se os elementos existem
    if (!device || !glow || !label) return;

    // Criar efeito de brilho expansivo
    const createExpandingGlow = () => {
      const expandGlow = this.add.graphics();
      const x = device.x;
      const y = device.y;

      expandGlow.fillStyle(0x39f5e2, 0.5);
      expandGlow.fillCircle(x, y, 10);

      this.tweens.add({
        targets: expandGlow,
        alpha: { from: 0.5, to: 0 },
        scale: { from: 1, to: 3 },
        duration: 1200,
        onComplete: () => expandGlow.destroy(),
      });
    };

    // Executar efeito de brilho expansivo 3 vezes com intervalo
    createExpandingGlow();
    this.time.delayedCall(300, createExpandingGlow);
    this.time.delayedCall(600, createExpandingGlow);

    // Tornar visível
    device.setVisible(true);
    glow.setVisible(true);
    glow2.setVisible(true);
    label.setVisible(true);

    // Animar entrada com destaque maior
    this.tweens.add({
      targets: [device, label],
      alpha: { from: 0, to: 1 },
      duration: 800,
      ease: "Back.easeOut",
    });

    // Efeito de atenção mais dramático
    this.tweens.add({
      targets: device,
      scale: { from: this.uiScale * 1.8, to: this.uiScale * 1.5 },
      duration: 1200,
      ease: "Elastic.easeOut",
      onComplete: () => {
        // Pulso suave contínuo para manter a atenção
        this.tweens.add({
          targets: device,
          scale: this.uiScale * 1.55,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      },
    });

    // Efeito persistente para os glows
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.3, to: 0.5 },
      scale: { from: 1, to: 1.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: glow2,
      alpha: { from: 0.2, to: 0.4 },
      scale: { from: 1, to: 1.3 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      delay: 500, // Iniciar com atraso para criar efeito pulsante alternado
    });

    // Texto pulsante para chamar atenção
    this.tweens.add({
      targets: label,
      alpha: { from: 0.7, to: 1 },
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Adicionar dica visual de como acessar
    const hint = this.add
      .text(device.x, device.y + 100, "CLIQUE PARA ACESSAR", {
        fontSize: "12px",
        fontFamily: this.fontFamily,
        fill: "#39f5e2",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.deviceContainer.add(hint);

    // Animar dica
    this.tweens.add({
      targets: hint,
      alpha: { from: 0, to: 1 },
      y: { from: device.y + 100, to: device.y + 90 },
      duration: 1000,
      delay: 1000,
      ease: "Back.easeOut",
    });

    // Manter piscando
    this.tweens.add({
      targets: hint,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      delay: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  };

  console.log("✅ Gerenciador de Dispositivo carregado");
})();
