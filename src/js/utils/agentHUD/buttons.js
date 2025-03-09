/**
 * Funções relacionadas aos botões da HUD do Agente
 */
(function () {
  /**
   * Cria um botão estilizado compatível com a HUD
   * @param {number} x - Posição X do botão
   * @param {number} y - Posição Y do botão
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função de callback quando clicado
   * @param {number} width - Largura do botão
   * @param {number} height - Altura do botão
   * @returns {Phaser.GameObjects.Container} - Container do botão
   * @private
   */
  AgentHUD.prototype.createStylizedButton = function (x, y, text, callback, width = 200, height = 40) {
    const buttonContainer = this.scene.add.container(x, y);

    // Sombra
    const buttonShadow = this.scene.add.graphics();
    this.drawRoundedRect(buttonShadow, -width / 2 + 2, -height / 2 + 2, width, height, 6, 0x000000, null, 0, 0.5);
    buttonContainer.add(buttonShadow);

    // Fundo do botão
    const buttonBg = this.scene.add.graphics();
    this.drawRoundedRect(buttonBg, -width / 2, -height / 2, width, height, 6, this.style.colors.primary, this.style.colors.secondary, 2, 1);
    buttonContainer.add(buttonBg);

    // Gradiente/brilho (simulado com uma linha mais clara)
    const highlight = this.scene.add.graphics();
    highlight.fillStyle(0xffffff, 0.2);
    highlight.fillRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, height / 3, { tl: 4, tr: 4, bl: 0, br: 0 });
    buttonContainer.add(highlight);

    // Texto do botão
    const buttonText = this.scene.add
      .text(0, 0, text, {
        fontSize: "16px",
        fontFamily: this.style.fonts.main.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    buttonContainer.add(buttonText);

    // Adicionar interatividade
    buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    // Eventos de hover e clique
    buttonContainer.on("pointerover", () => {
      buttonBg.clear();
      this.drawRoundedRect(buttonBg, -width / 2, -height / 2, width, height, 6, this.style.colors.secondary, this.style.colors.primary, 2, 1);

      this.scene.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });
    });

    buttonContainer.on("pointerout", () => {
      buttonBg.clear();
      this.drawRoundedRect(buttonBg, -width / 2, -height / 2, width, height, 6, this.style.colors.primary, this.style.colors.secondary, 2, 1);

      this.scene.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    buttonContainer.on("pointerdown", () => {
      this.scene.tweens.add({
        targets: buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });
    });

    return buttonContainer;
  };

  /**
   * Abre a central de missões
   * @public
   */
  AgentHUD.prototype.openMissionsHub = function () {
    // Verificar se a cena missionsHub existe
    try {
      const missionsHubKey = "missionsHub";
      const sceneExists = this.checkSceneExists(missionsHubKey);

      if (!sceneExists) {
        this.showNotification({
          message: "Central de Missões não disponível no momento",
          type: "warning",
          duration: 3000,
        });

        // Fechar o painel mesmo assim
        this.toggleExpanded(false);
        return;
      }

      // Salvar a cena atual para retornar depois
      if (window.game) {
        try {
          const activeScene = this.scene.scene.key;
          localStorage.setItem("previousScene", activeScene);
        } catch (e) {
          console.warn("Não foi possível salvar a cena atual:", e);
        }
      }

      // Fechar o painel da HUD
      this.toggleExpanded(false);

      // Fade out e transição
      this.scene.cameras.main.fadeOut(500);
      this.scene.cameras.main.once("camerafadeoutcomplete", () => {
        try {
          this.scene.scene.start(missionsHubKey);
        } catch (e) {
          console.error("Erro ao abrir a central de missões:", e);
          // Fallback: tenta iniciar a cena do menu principal
          try {
            this.scene.scene.start("mainMenu");
          } catch (err) {
            console.error("Não foi possível voltar ao menu principal:", err);
          }
        }
      });
    } catch (e) {
      console.error("❌ Erro ao abrir a central de missões:", e);

      // Notificar o jogador sobre o erro
      this.showNotification({
        message: "Erro ao abrir a Central de Missões",
        type: "error",
        duration: 3000,
      });

      // Fechar o painel da HUD
      this.toggleExpanded(false);
    }
  };

  /**
   * Verifica se uma cena existe no jogo
   * @param {string} key - Chave da cena
   * @returns {boolean} - Se a cena existe
   * @private
   */
  AgentHUD.prototype.checkSceneExists = function (key) {
    try {
      // Método 1: Verificar se a cena está no gerenciador de cenas
      if (this.scene.scene.get(key)) {
        return true;
      }

      // Método 2: Verificar se a classe existe globalmente
      if (window[key]) {
        return true;
      }

      return false;
    } catch (e) {
      console.warn(`❌ Erro ao verificar se a cena ${key} existe:`, e);
      return false;
    }
  };

  /**
   * Adiciona pontos ao jogador com uma animação e notificação
   * @param {number} points - Quantidade de pontos a adicionar
   * @param {string} reason - Razão pela qual os pontos foram adicionados
   * @returns {Object} - Resultado da operação de adicionar pontos
   * @public
   */
  AgentHUD.prototype.addPoints = function (points, reason = "") {
    if (!window.saveManager) {
      console.warn("SaveManager não está disponível para adicionar pontos");
      return { newPoints: 0, levelUp: false, level: "Desconhecido" };
    }

    try {
      // Adicionar pontos via SaveManager
      const result = window.saveManager.addPoints(points);

      // Obter posição da HUD para animação
      const hudPos = this.isExpanded
        ? { x: 160, y: 120 } // Centro do painel expandido
        : { x: 25, y: 25 }; // Centro do ícone recolhido

      // Criar um texto flutuante para mostrar os pontos
      const floatingPoints = this.scene.add
        .text(this.container.x + hudPos.x, this.container.y + hudPos.y, `+${points}`, {
          fontSize: "24px",
          fontFamily: this.style.fonts.main.fontFamily,
          fontWeight: "bold",
          fill: "#FFFF00",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(2000);

      // Animar os pontos flutuantes
      this.scene.tweens.add({
        targets: floatingPoints,
        y: floatingPoints.y - 80,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 1500,
        ease: "Power2",
        onComplete: () => {
          floatingPoints.destroy();
        },
      });

      // Adicionar a mensagem à fila de notificações
      let message = `+${points} pontos`;
      if (reason) message += ` - ${reason}`;

      this.showNotification({
        message: message,
        type: "points",
        duration: 2000,
      });

      // Se subiu de nível, mostrar uma notificação especial
      if (result.levelUp) {
        this.showNotification({
          message: `Parabéns! Novo nível: ${result.level}`,
          type: "levelUp",
          duration: 3000,
        });
      }

      // Atualizar a HUD
      this.updateHUDInfo();

      return result;
    } catch (e) {
      console.error("❌ Erro ao adicionar pontos:", e);
      return { newPoints: 0, levelUp: false, level: "Erro" };
    }
  };

  console.log("✅ Botões da HUD carregados");
})();
