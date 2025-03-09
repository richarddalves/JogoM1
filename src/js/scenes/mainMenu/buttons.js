/**
 * Funções de botões e interações do menu principal
 */
(function () {
  /**
   * Configura a música de fundo
   */
  mainMenu.prototype.setupBackgroundMusic = function () {
    if (this.soundEnabled) {
      try {
        // Verificar se o arquivo de música existe no cache antes de tentar reproduzir
        if (this.cache.audio.exists("menu_music")) {
          this.bgMusic = this.sound.add("menu_music", {
            volume: 0.5,
            loop: true,
          });
          this.bgMusic.play();
        }
      } catch (e) {
        console.warn("Não foi possível iniciar a música de fundo:", e);
      }
    }
  };

  /**
   * Função auxiliar para tocar som com tratamento para arquivos ausentes
   * @param {string} key - Chave do som
   * @param {Object} config - Configuração do som
   * @returns {Phaser.Sound.BaseSound} - O som ou null
   */
  mainMenu.prototype.playSoundSafely = function (key, config = { volume: 0.5 }) {
    if (this.soundEnabled && this.sound && this.sound.get) {
      try {
        // Verificar se o som existe antes de tentar reproduzi-lo
        const soundExists = this.cache.audio.exists(key);
        if (soundExists) {
          return this.sound.play(key, config);
        }
      } catch (e) {
        // Silenciosamente falhar se o som não estiver disponível
        console.log(`Som ${key} não encontrado ou não pôde ser reproduzido.`);
      }
    }
    return null;
  };

  /**
   * Cria os botões do menu
   */
  mainMenu.prototype.createMenuButtons = function () {
    // Definição dos botões principais
    const buttonData = [
      { text: "JOGAR", icon: "play_button", callback: () => this.startGame(false) },
      { text: "CONTINUAR", icon: "play_button", callback: () => this.startGame(true), enabled: false },
      { text: "CONFIGURAÇÕES", icon: "settings_button", callback: () => this.openSettings() },
      { text: "ACESSIBILIDADE", icon: "info_button", callback: () => this.openAccessibility() },
    ];

    // Posição inicial
    let buttonY = 0;

    // Criar cada botão
    this.menuButtons = buttonData.map((button, index) => {
      const buttonContainer = this.createStyledButton(0, buttonY, button.text, button.callback, button.icon);

      // Referência para o botão continuar (para ativar/desativar depois)
      if (button.text === "CONTINUAR") {
        this.continueButton = buttonContainer;
        buttonContainer.setAlpha(0.5);
      }

      // Atualizar posição para o próximo botão
      buttonY += this.buttonSpacing;

      // Adicionar ao container
      this.menuContainer.add(buttonContainer);

      return buttonContainer;
    });
  };

  /**
   * Cria um botão estilizado
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função de callback
   * @param {string} icon - Nome da imagem do ícone
   * @returns {Phaser.GameObjects.Container} - Container do botão
   */
  mainMenu.prototype.createStyledButton = function (x, y, text, callback, icon = null) {
    const buttonContainer = this.add.container(x, y);

    // Dimensões do botão
    const buttonWidth = 250;
    const buttonHeight = 60;

    // Sombra do botão
    const buttonShadow = this.add.graphics();
    buttonShadow.fillStyle(0x000000, 0.4);
    buttonShadow.fillRoundedRect(-buttonWidth / 2 + 4, -buttonHeight / 2 + 4, buttonWidth, buttonHeight, 8);

    // Fundo do botão
    const buttonBg = this.add.image(0, 0, "button_bg").setDisplaySize(buttonWidth, buttonHeight);

    // Brilho/glow em torno do botão
    const buttonGlow = this.add.graphics();
    buttonGlow.fillStyle(this.colors.primary, 0.3);
    buttonGlow.fillRoundedRect(-buttonWidth / 2 - 5, -buttonHeight / 2 - 5, buttonWidth + 10, buttonHeight + 10, 12);
    buttonGlow.setVisible(false);

    // Ícone (se fornecido)
    let buttonIcon = null;
    if (icon) {
      try {
        // Aumentar o tamanho dos ícones
        buttonIcon = this.add
          .image(-buttonWidth / 2 + 30, 0, icon)
          .setScale(1.0)
          .setOrigin(0.5);
      } catch (e) {
        console.warn(`⚠️ Não foi possível carregar o ícone '${icon}':`, e);
      }
    }

    // Texto do botão
    const buttonText = this.add
      .text(icon ? -buttonWidth / 2 + 70 : 0, 0, text, {
        fontSize: "22px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(icon ? 0 : 0.5, 0.5);

    // Adicionar elementos ao container
    buttonContainer.add([buttonShadow, buttonGlow, buttonBg]);
    if (buttonIcon) buttonContainer.add(buttonIcon);
    buttonContainer.add(buttonText);

    // Adicionar interatividade
    buttonBg.setInteractive({ useHandCursor: true });

    // Efeitos de hover e clique
    buttonBg.on("pointerover", () => {
      buttonGlow.setVisible(true);
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });

      // Som de hover (se disponível e habilitado)
      this.playSoundSafely("hover_sound", { volume: 0.2 });
    });

    buttonBg.on("pointerout", () => {
      buttonGlow.setVisible(false);
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    buttonBg.on("pointerdown", () => {
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          // Som de clique (se disponível e habilitado)
          this.playSoundSafely("click_sound", { volume: 0.5 });

          if (callback) callback();
        },
      });
    });

    return buttonContainer;
  };

  /**
   * Cria botões para redes sociais
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  mainMenu.prototype.createSocialButtons = function (width, height) {
    // Container para botões sociais
    const socialContainer = this.add.container(width - 50, 50);

    // Criar uma grade de botões circulares
    const socialItems = [
      { symbol: "❓", tooltip: "Ajuda", callback: () => this.showHelp() },
      { symbol: "ℹ️", tooltip: "Sobre", callback: () => this.showAbout() },
    ];

    let yPos = 0;

    // Criar botões em containers independentes
    socialItems.forEach((item, index) => {
      // Container para o botão individual
      const buttonContainer = this.add.container(0, yPos);

      // Círculo de fundo
      const circleBg = this.add.graphics();
      circleBg.fillStyle(this.colors.primary, 0.8);
      circleBg.fillCircle(0, 0, 20);
      circleBg.lineStyle(2, this.colors.secondary, 1);
      circleBg.strokeCircle(0, 0, 20);

      // Texto/símbolo
      const symbol = this.add
        .text(0, 0, item.symbol, {
          fontSize: "18px",
          fontFamily: this.fontFamily,
        })
        .setOrigin(0.5);

      // Adicionar ao container do botão
      buttonContainer.add([circleBg, symbol]);

      // Tornar o container interativo
      buttonContainer.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains);

      // Efeitos de hover
      buttonContainer.on("pointerover", () => {
        circleBg.clear();
        circleBg.fillStyle(this.colors.secondary, 0.8);
        circleBg.fillCircle(0, 0, 22);
        circleBg.lineStyle(2, this.colors.primary, 1);
        circleBg.strokeCircle(0, 0, 22);

        this.tweens.add({
          targets: buttonContainer,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 100,
        });

        // Mostrar tooltip
        this.showTooltip(item.tooltip, width - 130, 40 + yPos);
      });

      buttonContainer.on("pointerout", () => {
        circleBg.clear();
        circleBg.fillStyle(this.colors.primary, 0.8);
        circleBg.fillCircle(0, 0, 20);
        circleBg.lineStyle(2, this.colors.secondary, 1);
        circleBg.strokeCircle(0, 0, 20);

        this.tweens.add({
          targets: buttonContainer,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
        });

        // Esconder tooltip
        this.hideTooltip();
      });

      buttonContainer.on("pointerdown", () => {
        if (item.callback) item.callback();
      });

      // Adicionar ao container principal
      socialContainer.add(buttonContainer);

      // Incrementar posição Y
      yPos += 50;
    });
  };

  /**
   * Anima os elementos na entrada da cena
   */
  mainMenu.prototype.animateElements = function () {
    // Animar título
    this.tweens.add({
      targets: this.titleContainer,
      y: this.titleY + 10,
      duration: 2000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Animar botões (entrada sequencial)
    this.menuButtons.forEach((button, index) => {
      button.x = -300; // Começar fora da tela

      this.tweens.add({
        targets: button,
        x: 0,
        ease: "Back.out",
        duration: 600,
        delay: 200 + index * 150,
      });
    });
  };

  /**
   * Verifica se existem dados salvos para habilitar o botão "Continuar"
   */
  mainMenu.prototype.checkSavedGame = function () {
    // Verificar se o SaveManager existe e tem dados salvos
    if (window.saveManager) {
      try {
        const hasSavedGame = localStorage.getItem("dpoHeroSave") !== null;

        // Ativar/desativar botão de continuar
        if (this.continueButton) {
          if (hasSavedGame) {
            this.continueButton.setAlpha(1);

            // Destacar o botão para chamar atenção
            this.tweens.add({
              targets: this.continueButton,
              scaleX: 1.05,
              scaleY: 1.05,
              duration: 800,
              yoyo: true,
              repeat: 2,
            });
          } else {
            this.continueButton.setAlpha(0.5);
          }
        }
      } catch (e) {
        console.warn("Erro ao verificar dados salvos:", e);
      }
    }
  };

  /**
   * Inicia o jogo (novo ou continuar)
   * @param {boolean} continueGame - Se deve continuar um jogo salvo
   */
  mainMenu.prototype.startGame = function (continueGame = false) {
    // Se for continuar mas não tiver save, iniciar novo jogo
    if (continueGame) {
      try {
        const hasSavedGame = localStorage.getItem("dpoHeroSave") !== null;
        if (!hasSavedGame) {
          continueGame = false;
        }
      } catch (e) {
        console.warn("Erro ao verificar dados salvos:", e);
        continueGame = false;
      }
    }

    // Efeito de fade out antes da transição
    this.cameras.main.fadeOut(800, 0, 0, 0);

    // Parar música do menu (se estiver tocando)
    if (this.bgMusic && this.bgMusic.isPlaying) {
      this.tweens.add({
        targets: this.bgMusic,
        volume: 0,
        duration: 800,
        onComplete: () => {
          this.bgMusic.stop();
        },
      });
    }

    // Callback após fade out
    this.cameras.main.once("camerafadeoutcomplete", () => {
      if (continueGame) {
        // Continuar jogo: ir para o hub de missões
        this.scene.start("missionsHub");
      } else {
        // Novo jogo: ir para a seleção de papel ou diretamente para conversa de introdução
        if (this.scene.get("chooseRole")) {
          this.scene.start("chooseRole");
        } else {
          this.scene.start("conversation");
        }
      }
    });
  };

  console.log("✅ Menu Buttons Module loaded");
})();
