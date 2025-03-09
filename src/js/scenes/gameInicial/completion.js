/**
 * Módulo de conclusão para o mini-game de identificação de dados pessoais e sensíveis
 * (MODIFICADO: Redireciona para a nova cena jardimMission)
 */
(function () {
  /**
   * Finaliza o jogo e mostra a tela de resultados
   */
  gameInicial.prototype.completeGame = function () {
    // Ocultar elementos do jogo
    this.questionPanel.setVisible(false);
    this.feedbackPanel.setVisible(false);
    this.buttonContainer.setVisible(false);

    // Obter pontuação real baseada nas respostas corretas do jogador
    // CORREÇÃO: Usar a pontuação acumulada durante o jogo em vez de usar o saveManager
    const totalPoints = this.playerPoints;
    const correctAnswers = this.correctCount;

    console.log(`Jogo concluído com ${totalPoints}/${this.maxScore} pontos e ${correctAnswers}/${this.questions.length} respostas corretas`);

    // Criar tela de resultados
    this.createCompletionScreen(totalPoints, correctAnswers);
  };

  /**
   * Cria a tela de conclusão do jogo
   * @param {number} totalPoints - Total de pontos obtidos
   * @param {number} correctAnswers - Número de respostas corretas
   */
  gameInicial.prototype.createCompletionScreen = function (totalPoints, correctAnswers) {
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Container para a tela de conclusão
    const completionContainer = this.add.container(0, 0);

    // Overlay escuro para foco
    const overlay = this.add.graphics().fillStyle(0x000000, 0.8).fillRect(0, 0, width, height);

    completionContainer.add(overlay);

    // Painel de conclusão - MELHORADO: Visual mais moderno e atraente
    const panelWidth = width * 0.8;
    const panelHeight = height * 0.7;

    // Adicionar efeito de brilho ao redor do painel principal
    const panelGlow = this.add
      .graphics()
      .fillStyle(0x00ffff, 0.1)
      .fillRoundedRect(width / 2 - panelWidth / 2 - 10, height / 2 - panelHeight / 2 - 10, panelWidth + 20, panelHeight + 20, 25);

    completionContainer.add(panelGlow);

    // Efeito de sombra para profundidade
    const panelShadow = this.add
      .graphics()
      .fillStyle(0x000000, 0.5)
      .fillRoundedRect(width / 2 - panelWidth / 2 + 10, height / 2 - panelHeight / 2 + 10, panelWidth, panelHeight, 20);

    completionContainer.add(panelShadow);

    // Fundo do painel com gradiente
    const panelBg = this.add.graphics();

    // Fundo com gradiente (simulado com várias camadas)
    for (let i = 0; i < 5; i++) {
      const alpha = 0.9 - i * 0.05;
      const color = Phaser.Display.Color.ValueToColor(0x0d468a);
      const darkerColor = Phaser.Display.Color.ValueToColor(0x052d5e);
      const lerpColor = Phaser.Display.Color.Interpolate.ColorWithColor(color, darkerColor, 5, i);
      const rgbColor = Phaser.Display.Color.GetColor(lerpColor.r, lerpColor.g, lerpColor.b);

      panelBg.fillStyle(rgbColor, alpha);
      panelBg.fillRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2 + (i * panelHeight) / 5, panelWidth, panelHeight / 5, i === 0 ? { tl: 20, tr: 20, bl: 0, br: 0 } : i === 4 ? { tl: 0, tr: 0, bl: 20, br: 20 } : 0);
    }

    // Borda com efeito animado
    panelBg.lineStyle(4, 0x00ffff, 1);
    panelBg.strokeRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 20);

    completionContainer.add(panelBg);

    // Efeito de grade digital (cyberpunk)
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x00ffff, 0.2);

    // Linhas horizontais
    for (let y = height / 2 - panelHeight / 2; y < height / 2 + panelHeight / 2; y += 20) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(width / 2 - panelWidth / 2, y);
      gridGraphics.lineTo(width / 2 + panelWidth / 2, y);
      gridGraphics.strokePath();
    }

    // Linhas verticais
    for (let x = width / 2 - panelWidth / 2; x < width / 2 + panelWidth / 2; x += 20) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, height / 2 - panelHeight / 2);
      gridGraphics.lineTo(x, height / 2 + panelHeight / 2);
      gridGraphics.strokePath();
    }

    completionContainer.add(gridGraphics);

    // Título de conclusão com estilo mais atrativo
    const completionTitle = this.add
      .text(width / 2, height / 2 - panelHeight / 2 + 60, "TREINAMENTO CONCLUÍDO!", {
        fontSize: "36px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    completionContainer.add(completionTitle);

    // Adicionar brilho ao título
    const titleGlow = this.add
      .graphics()
      .fillStyle(0x00ffff, 0.3)
      .fillRoundedRect(width / 2 - 250, height / 2 - panelHeight / 2 + 40, 500, 40, 10);

    completionContainer.add(titleGlow);
    completionContainer.moveDown(titleGlow);

    // Animar o brilho
    this.tweens.add({
      targets: titleGlow,
      alpha: { from: 0.3, to: 0.6 },
      width: { from: 500, to: 520 },
      x: { from: width / 2 - 250, to: width / 2 - 260 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Pontuação e estatísticas com visual melhorado
    const scoreText = this.add
      .text(width / 2, height / 2 - 50, `Pontuação: ${totalPoints}/${this.maxScore} pontos\n` + `Respostas corretas: ${correctAnswers}/${this.questions.length}`, {
        fontSize: "24px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    completionContainer.add(scoreText);

    // Medalha/distintivo com base no desempenho - MELHORADO: Visual mais bonito e interativo
    const performance = totalPoints / this.maxScore;
    let medalColor, medalText, medalGlowColor;

    if (performance >= 0.9) {
      medalColor = 0xffd700; // Ouro
      medalGlowColor = 0xffec80;
      medalText = "EXCELENTE";
    } else if (performance >= 0.7) {
      medalColor = 0xc0c0c0; // Prata
      medalGlowColor = 0xe0e0e0;
      medalText = "MUITO BOM";
    } else if (performance >= 0.5) {
      medalColor = 0xcd7f32; // Bronze
      medalGlowColor = 0xe8b27d;
      medalText = "BOM";
    } else {
      medalColor = 0x666666; // Básico
      medalGlowColor = 0x999999;
      medalText = "CONCLUÍDO";
    }

    // Criar distintivo de conclusão melhorado
    const badgeContainer = this.add.container(width / 2, height / 2 + 40);

    // Adicionar glow sob o distintivo
    const badgeGlow = this.add.graphics().fillStyle(medalGlowColor, 0.3).fillCircle(0, 0, 70);
    badgeContainer.add(badgeGlow);

    // Animação do glow
    this.tweens.add({
      targets: badgeGlow,
      alpha: { from: 0.3, to: 0.6 },
      scale: { from: 1, to: 1.1 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });

    const badgeOuter = this.add.graphics().fillStyle(medalColor, 0.3).fillCircle(0, 0, 60);
    const badgeMiddle = this.add.graphics().fillStyle(medalColor, 0.5).fillCircle(0, 0, 52);
    const badgeInner = this.add.graphics().fillStyle(medalColor, 0.8).fillCircle(0, 0, 45);

    // Bordas refinadas
    badgeInner.lineStyle(3, 0xffffff, 0.8);
    badgeInner.strokeCircle(0, 0, 45);

    badgeOuter.lineStyle(1, medalColor, 1);
    badgeOuter.strokeCircle(0, 0, 60);

    // Ícone com efeito de brilho
    const badgeIcon = this.add.image(0, 0, "data_icon").setScale(0.4).setTint(0xffffff);

    // Texto de classificação com estilo melhorado
    const badgeRank = this.add
      .text(0, 70, medalText, {
        fontSize: "20px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    badgeContainer.add([badgeOuter, badgeMiddle, badgeInner, badgeIcon, badgeRank]);
    completionContainer.add(badgeContainer);

    // Animar distintivo
    this.tweens.add({
      targets: badgeContainer,
      y: badgeContainer.y - 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Animar rotação sutil do ícone
    this.tweens.add({
      targets: badgeIcon,
      angle: { from: -5, to: 5 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Mensagem de conclusão com estilo melhorado
    const completionMessage = this.add
      .text(width / 2, height / 2 + 140, `Parabéns, DPO Hero!\n\n` + `Você completou o treinamento básico sobre identificação\n` + `de dados pessoais e sensíveis. Esta habilidade será\n` + `fundamental para suas missões de proteção de dados.`, {
        fontSize: "18px",
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        align: "center",
        lineSpacing: 8,
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    completionContainer.add(completionMessage);

    // Completar missão - CORRIGIDO: Salvar o progresso real obtido pelo jogador
    try {
      // Salvar diretamente no localStorage para manter a consistência com o missionsHub
      let playerProgress = {
        completedMissions: ["training"],
        currentPoints: totalPoints, // CORREÇÃO: Usar pontos reais
        level: 1,
      };

      // Verificar se já existem dados salvos
      const savedData = localStorage.getItem("dpoHeroProgress");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData && Array.isArray(parsedData.completedMissions)) {
            // Adicionar a missão atual se ainda não estiver na lista
            if (!parsedData.completedMissions.includes("training")) {
              parsedData.completedMissions.push("training");
              // Adicionar pontos da missão
              parsedData.currentPoints += totalPoints;
            }
            playerProgress = parsedData;
          }
        } catch (parseError) {
          console.error("Erro ao processar dados salvos:", parseError);
        }
      }

      // Salvar dados atualizados
      localStorage.setItem("dpoHeroProgress", JSON.stringify(playerProgress));
      console.log("✅ Missão 'training' completada e salva com sucesso!");

      // Ainda manter compatibilidade com saveManager se ele existir
      if (window.saveManager) {
        window.saveManager.completeMission("training");

        // Pontos bônus pela conclusão
        if (this.agentHUD) {
          this.agentHUD.addPoints(50, "Missão completa: Treinamento Básico");
        }
      }
    } catch (e) {
      console.error("❌ Erro ao salvar progresso da missão:", e);
    }

    // Botões finais com estilo melhorado
    const missionHubButton = this.createStyledButton(width / 2 - 150, height / 2 + panelHeight / 2 - 60, "MISSÕES", () => this.goToMissionHub(), {
      width: 160,
      height: 50,
      fontSize: 18,
      primaryColor: this.colors.primary,
      secondaryColor: this.colors.secondary,
      iconPosition: "left",
      icon: "🏠",
    });

    const continueButton = this.createStyledButton(width / 2 + 150, height / 2 + panelHeight / 2 - 60, "CONTINUAR", () => this.goToNextMission(), {
      width: 160,
      height: 50,
      fontSize: 18,
      primaryColor: this.colors.positive,
      secondaryColor: 0x00dd00,
      iconPosition: "right",
      icon: "➡️",
    });

    completionContainer.add([missionHubButton, continueButton]);

    // Animar entrada do painel de conclusão
    completionContainer.setAlpha(0);
    completionContainer.setScale(0.9);

    this.tweens.add({
      targets: completionContainer,
      alpha: 1,
      scale: 1,
      duration: 700,
      ease: "Back.easeOut",
    });

    // Partículas de celebração
    try {
      const particles = this.add.particles("data_icon");

      // Emitter de confete
      const confettiEmitter = particles.createEmitter({
        x: { min: width * 0.3, max: width * 0.7 },
        y: height * 0.1,
        speed: { min: 200, max: 400 },
        angle: { min: 80, max: 100 },
        scale: { start: 0.05, end: 0 },
        alpha: { start: 0.8, end: 0 },
        lifespan: 3000,
        gravityY: 300,
        tint: [0x00ffff, 0xffff00, 0xff00ff, 0x00ff00],
        quantity: 2,
        frequency: 100,
        blendMode: "ADD",
        emitCallback: function (particle) {
          // Randomizar rotação
          particle.angle = Phaser.Math.Between(0, 360);
        },
      });

      // Parar após alguns segundos
      this.time.delayedCall(3000, () => {
        confettiEmitter.stop();
      });

      completionContainer.add(particles);
    } catch (e) {
      console.warn("Não foi possível criar sistema de partículas:", e);
    }

    // Som de sucesso/concluído
    if (this.sound.get("success_sound")) {
      this.sound.play("success_sound", { volume: 0.7 });
    }

    // Limpeza de dados temporários
    localStorage.removeItem("gameInicialProgress");
  };

  /**
   * Navega para a central de missões
   */
  gameInicial.prototype.goToMissionHub = function () {
    // Fade out
    this.cameras.main.fadeOut(this.fadeSpeed);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      try {
        // CORREÇÃO: Passar dados de missão completa para o hub
        this.scene.start("missionsHub", {
          missionComplete: true,
          missionId: "training",
          completed: true,
          score: (this.playerPoints / this.maxScore) * 100, // Porcentagem de acertos
        });
      } catch (e) {
        console.error("Erro ao navegar para central de missões:", e);
        this.scene.start("mainMenu");
      }
    });
  };

  /**
   * Navega para a próxima missão
   * MODIFICADO: Agora redireciona para jardimMission em vez de schoolMission
   */
  gameInicial.prototype.goToNextMission = function () {
    // Fade out
    this.cameras.main.fadeOut(this.fadeSpeed);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      try {
        // MODIFICADO: Mudando para a nova cena jardimMission em vez de schoolMission
        this.scene.start("jardimMission", {
          fromGameInicial: true,
          score: (this.playerPoints / this.maxScore) * 100,
        });
      } catch (e) {
        console.error("Erro ao navegar para próxima missão:", e);
        // Em caso de erro, voltar para o hub de missões que sabemos que funciona
        this.scene.start("missionsHub", {
          missionComplete: true,
          missionId: "training",
          completed: true,
          score: (this.playerPoints / this.maxScore) * 100,
        });
      }
    });
  };

  /**
   * Cria um botão estilizado com ícone e efeitos visuais melhorados
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto do botão
   * @param {Function} callback - Função de callback
   * @param {Object} options - Opções de estilo
   * @returns {Phaser.GameObjects.Container} - Container do botão
   */
  gameInicial.prototype.createStyledButton = function (x, y, text, callback, options = {}) {
    // Mesclar opções padrão com as fornecidas
    const defaultOptions = {
      width: 200,
      height: 50,
      fontSize: 18,
      primaryColor: this.colors.primary,
      secondaryColor: this.colors.secondary,
      cornerRadius: 10,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      shadowAlpha: 0.5,
      icon: null,
      iconPosition: "left", // 'left' ou 'right'
      iconScale: 1,
      glowEffect: true,
    };

    const config = { ...defaultOptions, ...options };

    // Container principal
    const container = this.add.container(x, y);

    // Sombra
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, config.shadowAlpha);
    shadow.fillRoundedRect(-config.width / 2 + config.shadowOffsetX, -config.height / 2 + config.shadowOffsetY, config.width, config.height, config.cornerRadius);
    container.add(shadow);

    // Fundo do botão com gradiente (simulado)
    const bg = this.add.graphics();

    // Desenhar fundo
    bg.fillStyle(config.primaryColor, 1);
    bg.fillRoundedRect(-config.width / 2, -config.height / 2, config.width, config.height, config.cornerRadius);

    // Adicionar brilho superior
    bg.fillStyle(0xffffff, 0.3);
    bg.fillRoundedRect(-config.width / 2 + 4, -config.height / 2 + 4, config.width - 8, config.height / 3, { tl: config.cornerRadius - 2, tr: config.cornerRadius - 2, bl: 0, br: 0 });

    // Borda
    bg.lineStyle(2, config.secondaryColor, 1);
    bg.strokeRoundedRect(-config.width / 2, -config.height / 2, config.width, config.height, config.cornerRadius);

    container.add(bg);

    // Adicionar ícone se fornecido
    let iconX = 0;
    let textOffset = 0;

    if (config.icon) {
      // Calcular posição do ícone
      if (config.iconPosition === "left") {
        iconX = -config.width / 2 + 30;
        textOffset = 15;
      } else {
        // right
        iconX = config.width / 2 - 30;
        textOffset = -15;
      }

      // Adicionar emoji ou ícone
      const icon = this.add
        .text(iconX, 0, config.icon, {
          fontSize: `${config.fontSize * 1.2}px`,
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      container.add(icon);
    }

    // Texto do botão
    const buttonText = this.add
      .text(textOffset, 0, text, {
        fontSize: `${config.fontSize}px`,
        fontFamily: this.fontFamily,
        fill: "#FFFFFF",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    container.add(buttonText);

    // Efeito de brilho (glow) animado
    if (config.glowEffect) {
      const glow = this.add.graphics();
      glow.lineStyle(4, config.secondaryColor, 0.5);
      glow.strokeRoundedRect(-config.width / 2 - 4, -config.height / 2 - 4, config.width + 8, config.height + 8, config.cornerRadius + 2);

      container.add(glow);

      // Animação do glow
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.5, to: 0.2 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
      });
    }

    // Interatividade
    container.setInteractive(new Phaser.Geom.Rectangle(-config.width / 2, -config.height / 2, config.width, config.height), Phaser.Geom.Rectangle.Contains);

    // Estados do botão
    container.on("pointerover", () => {
      bg.clear();

      // Redesenhar com cor hover
      bg.fillStyle(config.secondaryColor, 1);
      bg.fillRoundedRect(-config.width / 2, -config.height / 2, config.width, config.height, config.cornerRadius);

      bg.fillStyle(0xffffff, 0.3);
      bg.fillRoundedRect(-config.width / 2 + 4, -config.height / 2 + 4, config.width - 8, config.height / 3, { tl: config.cornerRadius - 2, tr: config.cornerRadius - 2, bl: 0, br: 0 });

      bg.lineStyle(2, config.primaryColor, 1);
      bg.strokeRoundedRect(-config.width / 2, -config.height / 2, config.width, config.height, config.cornerRadius);

      // Efeito de escala
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });

      // Cor do texto
      buttonText.setStyle({ fill: "#FFFFFF" });

      // Som de hover
      if (this.sound.get("hover")) {
        this.sound.play("hover", { volume: 0.3 });
      }
    });

    container.on("pointerout", () => {
      bg.clear();

      // Redesenhar com cor normal
      bg.fillStyle(config.primaryColor, 1);
      bg.fillRoundedRect(-config.width / 2, -config.height / 2, config.width, config.height, config.cornerRadius);

      bg.fillStyle(0xffffff, 0.3);
      bg.fillRoundedRect(-config.width / 2 + 4, -config.height / 2 + 4, config.width - 8, config.height / 3, { tl: config.cornerRadius - 2, tr: config.cornerRadius - 2, bl: 0, br: 0 });

      bg.lineStyle(2, config.secondaryColor, 1);
      bg.strokeRoundedRect(-config.width / 2, -config.height / 2, config.width, config.height, config.cornerRadius);

      // Restaurar escala
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });

      // Cor do texto
      buttonText.setStyle({
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
      });
    });

    container.on("pointerdown", () => {
      // Efeito de pressionar
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          // Chamar callback
          if (callback) callback();
        },
      });

      // Som de clique
      if (this.sound.get("click")) {
        this.sound.play("click", { volume: 0.5 });
      }
    });

    return container;
  };

  console.log("✅ Módulo de Conclusão Modificado - Redirecionamento para jardimMission");
})();
