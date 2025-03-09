/**
 * Módulo do jogador para a missão do jardim (MELHORADO)
 */
(function () {
  /**
   * Cria e configura o jogador
   */
  jardimMission.prototype.createPlayer = function () {
    console.log("👤 Criando jogador...");

    try {
      // Determinar posição inicial do jogador
      let startX = 100;
      let startY = 100;

      // Usar ponto de spawn do mapa se disponível
      if (this.spawnPoints && this.spawnPoints.player) {
        startX = this.spawnPoints.player.x;
        startY = this.spawnPoints.player.y;
        console.log(`📍 Usando ponto de spawn do player: (${startX}, ${startY})`);
      } else {
        console.log(`📍 Usando coordenadas padrão: (${startX}, ${startY})`);
      }

      // Criar sprite do jogador com tamanho apropriado
      const playerSprite = this.physics.add.sprite(startX, startY, "personagem", 18);

      // Ajustar tamanho do sprite para ser bem visível
      playerSprite.setScale(2.0);

      // Configurar física do jogador de forma adequada
      playerSprite.setSize(30, 30); // Hitbox menor que o sprite
      playerSprite.setOffset(17, 34); // Centralizar hitbox
      playerSprite.setCollideWorldBounds(true);
      playerSprite.setDepth(5); // Depth entre objetos e objetos altos

      // Para debug: mostrar o corpo físico
      if (this.debugMode) {
        this.physics.world.createDebugGraphic();
      }

      // Configurar animações do jogador
      this.createPlayerAnimations();

      // Criar objeto do jogador
      this.player = {
        sprite: playerSprite,
        speed: 300, // Velocidade aumentada para movimento mais responsivo
        direction: "down",
        isMoving: false,
        isInteracting: false,
        canMove: true,
        interactionRadius: 100, // Raio de interação aumentado
        lastInteraction: 0, // Timestamp da última interação
        interactionCooldown: 500, // Tempo de espera entre interações
        update: (time, delta) => this.updatePlayer(time, delta),
      };

      // Criar círculo de interação visual
      this.player.interactionCircle = this.add.circle(startX, startY, this.player.interactionRadius, 0xffffff, 0.1);
      this.player.interactionCircle.setVisible(this.debugMode);

      // Criar indicador de tecla de interação mais visível e atrativo
      this.createInteractionIndicator();

      // Adicionar efeito de sombra ao jogador
      this.addPlayerShadow();

      // Adicionar efeito de brilho/highlight quando possível interagir
      this.createPlayerHighlight();

      // Adicionar aura de movimento do personagem
      this.createPlayerAura();

      console.log("✅ Jogador criado com sucesso!");
      return true;
    } catch (e) {
      console.error("❌ Erro ao criar o jogador:", e.message);
      return false;
    }
  };

  /**
   * Adiciona sombra ao jogador
   */
  jardimMission.prototype.addPlayerShadow = function () {
    if (!this.player || !this.player.sprite) return;

    // Criar sombra como uma elipse
    this.player.shadow = this.add.ellipse(this.player.sprite.x, this.player.sprite.y + 30, 40, 20, 0x000000, 0.3);

    // Colocar a sombra abaixo do jogador
    this.player.shadow.setDepth(4);

    // Suavizar a sombra com tween
    this.tweens.add({
      targets: this.player.shadow,
      scaleX: 1.1,
      scaleY: 1.1,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 1500,
      ease: "Sine.easeInOut",
    });
  };

  /**
   * Cria um indicador de interação visualmente atraente
   */
  jardimMission.prototype.createInteractionIndicator = function () {
    if (!this.player || !this.player.sprite) return;

    // Container para o indicador
    const container = this.add.container(this.player.sprite.x, this.player.sprite.y - 80);
    container.setDepth(20);

    // Fundo do botão com estilo moderno
    const bg = this.add.graphics();
    bg.fillStyle(this.colors.primary, 1);
    bg.fillRoundedRect(-25, -25, 50, 50, 15);

    // Borda para destaque
    bg.lineStyle(3, this.colors.secondary, 1);
    bg.strokeRoundedRect(-25, -25, 50, 50, 15);

    // Letra E com estilo especial
    const keyText = this.add
      .text(0, 0, "E", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "28px",
        fontWeight: "bold",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Brilho interno
    const glow = this.add.graphics();
    glow.fillStyle(0xffffff, 0.2);
    glow.fillRoundedRect(-20, -20, 40, 10, 5);

    // Adicionar ao container
    container.add([bg, glow, keyText]);

    // Configurar animação de pulso
    this.tweens.add({
      targets: container,
      scaleX: 1.1,
      scaleY: 1.1,
      yoyo: true,
      repeat: -1,
      duration: 800,
      ease: "Sine.easeInOut",
    });

    // Configurar animação de flutuação
    this.tweens.add({
      targets: container,
      y: "-=10",
      yoyo: true,
      repeat: -1,
      duration: 1200,
      ease: "Sine.easeInOut",
    });

    // Inicialmente invisível
    container.setVisible(false);

    // Salvar referência
    this.player.interactionIndicator = container;
  };

  /**
   * Cria o efeito de destaque do jogador para interações
   */
  jardimMission.prototype.createPlayerHighlight = function () {
    if (!this.player || !this.player.sprite) return;

    // Criar círculo de destaque ao redor do jogador
    this.player.highlight = this.add.graphics();
    this.player.highlight.setDepth(4.5); // Entre o jogador e sua sombra

    // Desenhar círculo de destaque com gradiente
    this.player.highlight.lineStyle(3, this.colors.secondary, 0.7);
    this.player.highlight.strokeCircle(0, 0, 35);

    // Colocar o highlight na posição do jogador
    this.player.highlight.x = this.player.sprite.x;
    this.player.highlight.y = this.player.sprite.y;

    // Inicialmente invisível
    this.player.highlight.setVisible(false);

    // Configurar efeito de pulso para quando estiver ativo
    this.player.highlightTween = this.tweens.add({
      targets: this.player.highlight,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.4,
      yoyo: true,
      repeat: -1,
      duration: 800,
      ease: "Sine.easeInOut",
      paused: true,
    });
  };

  /**
   * Cria efeito de aura para o jogador
   * ATUALIZADO para Phaser 3.60
   */
  jardimMission.prototype.createPlayerAura = function () {
    if (!this.player || !this.player.sprite) return;

    try {
      // Usar o novo sistema de partículas do Phaser 3.60
      const particles = this.add.particles({
        key: "task-icon",
        follow: this.player.sprite,
        scale: { start: 0.15, end: 0.05 },
        alpha: { start: 0.3, end: 0 },
        speed: 5,
        lifespan: 400,
        frequency: 100,
        quantity: 1,
        blendMode: "ADD",
        tint: this.colors.secondary,
      });

      // Salvar referência
      this.player.aura = particles;

      // Inicialmente pausado
      particles.stop();
    } catch (e) {
      console.warn("⚠️ Não foi possível criar aura do jogador:", e.message);
    }
  };

  /**
   * Cria as animações do jogador
   */
  jardimMission.prototype.createPlayerAnimations = function () {
    console.log("🎬 Criando animações do jogador...");

    try {
      // Verificar se as animações já existem
      if (this.anims.exists("player-down")) {
        console.log("ℹ️ Animações do jogador já existem");
        return;
      }

      // Verificar a imagem antes de criar animações
      const texture = this.textures.get("personagem");
      if (!texture || texture.key === "__MISSING") {
        console.error("❌ Textura do personagem não encontrada!");
        return;
      }

      console.log(`📊 Informações da textura: ${texture.width}x${texture.height}, frames: ${texture.frameTotal}`);

      // Animação para cima (frames 0-8)
      this.anims.create({
        key: "player-up",
        frames: this.anims.generateFrameNumbers("personagem", { start: 0, end: 8 }),
        frameRate: 15, // Aumentado para movimento mais suave
        repeat: -1,
      });

      // Animação para esquerda (frames 9-17)
      this.anims.create({
        key: "player-left",
        frames: this.anims.generateFrameNumbers("personagem", { start: 9, end: 17 }),
        frameRate: 15,
        repeat: -1,
      });

      // Animação para baixo (frames 18-26)
      this.anims.create({
        key: "player-down",
        frames: this.anims.generateFrameNumbers("personagem", { start: 18, end: 26 }),
        frameRate: 15,
        repeat: -1,
      });

      // Animação para direita (frames 27-35)
      this.anims.create({
        key: "player-right",
        frames: this.anims.generateFrameNumbers("personagem", { start: 27, end: 35 }),
        frameRate: 15,
        repeat: -1,
      });

      // Frames estáticos para quando o jogador está parado
      this.anims.create({
        key: "player-idle-up",
        frames: [{ key: "personagem", frame: 0 }],
        frameRate: 1,
      });

      this.anims.create({
        key: "player-idle-left",
        frames: [{ key: "personagem", frame: 9 }],
        frameRate: 1,
      });

      this.anims.create({
        key: "player-idle-down",
        frames: [{ key: "personagem", frame: 18 }],
        frameRate: 1,
      });

      this.anims.create({
        key: "player-idle-right",
        frames: [{ key: "personagem", frame: 27 }],
        frameRate: 1,
      });

      console.log("✅ Animações do jogador criadas com sucesso!");
    } catch (e) {
      console.error("❌ Erro ao criar animações do jogador:", e.message);
    }
  };

  /**
   * Atualiza o estado do jogador a cada frame
   */
  jardimMission.prototype.updatePlayer = function (time, delta) {
    if (!this.player || !this.player.sprite) return;

    // Verificar se o jogador pode se mover
    if (!this.player.canMove) {
      // Se não pode se mover, parar o sprite
      this.player.sprite.setVelocity(0, 0);
      this.player.isMoving = false;
      this.updatePlayerAnimation();

      // Parar efeito de aura
      if (this.player.aura) {
        this.player.aura.stop();
      }

      // Atualizar posição dos elementos visuais
      this.updatePlayerVisualElements();
      return;
    }

    // Processar movimento baseado nas teclas pressionadas (WASD e setas)
    let velocityX = 0;
    let velocityY = 0;
    const previousDirection = this.player.direction;
    let directionChanged = false;

    // Verificar movimento vertical (WASD e setas)
    if (this.keys.up.isDown || this.keys.upArrow.isDown) {
      velocityY = -this.player.speed;
      this.player.direction = "up";
      directionChanged = previousDirection !== "up";
    } else if (this.keys.down.isDown || this.keys.downArrow.isDown) {
      velocityY = this.player.speed;
      this.player.direction = "down";
      directionChanged = previousDirection !== "down";
    }

    // Verificar movimento horizontal (WASD e setas)
    if (this.keys.left.isDown || this.keys.leftArrow.isDown) {
      velocityX = -this.player.speed;
      this.player.direction = "left";
      directionChanged = previousDirection !== "left";
    } else if (this.keys.right.isDown || this.keys.rightArrow.isDown) {
      velocityX = this.player.speed;
      this.player.direction = "right";
      directionChanged = previousDirection !== "right";
    }

    // Normalizar velocidade para movimento diagonal
    if (velocityX !== 0 && velocityY !== 0) {
      const factor = Math.sqrt(0.5);
      velocityX *= factor;
      velocityY *= factor;
    }

    // Aplicar velocidade ao sprite
    this.player.sprite.setVelocity(velocityX, velocityY);

    // Atualizar estado de movimento
    const isNowMoving = velocityX !== 0 || velocityY !== 0;
    const movementChanged = isNowMoving !== this.player.isMoving;
    this.player.isMoving = isNowMoving;

    // Atualizar animação do jogador
    this.updatePlayerAnimation();

    // Ativar/desativar efeito de aura baseado no movimento
    if (this.player.aura) {
      if (isNowMoving) {
        this.player.aura.start();
      } else {
        this.player.aura.stop();
      }
    }

    // Verificar interação com tecla E
    if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
      this.tryInteract(time);
    }

    // Atualizar posição dos elementos visuais do jogador
    this.updatePlayerVisualElements();
  };

  /**
   * Atualiza a posição dos elementos visuais do jogador
   */
  jardimMission.prototype.updatePlayerVisualElements = function () {
    if (!this.player || !this.player.sprite) return;

    // Posição atual do jogador
    const x = this.player.sprite.x;
    const y = this.player.sprite.y;

    // Atualizar sombra
    if (this.player.shadow) {
      this.player.shadow.setPosition(x, y + 30);
    }

    // Atualizar círculo de interação
    if (this.player.interactionCircle) {
      this.player.interactionCircle.setPosition(x, y);
    }

    // Atualizar indicador de interação
    if (this.player.interactionIndicator) {
      this.player.interactionIndicator.setPosition(x, y - 80);
    }

    // Atualizar highlight
    if (this.player.highlight) {
      this.player.highlight.x = x;
      this.player.highlight.y = y;
    }

    // Atualizar nameTag se existir
    if (this.player.nameTag) {
      this.player.nameTag.setPosition(x, y - 50);
    }
  };

  /**
   * Atualiza a animação do jogador com base no movimento e direção
   */
  jardimMission.prototype.updatePlayerAnimation = function () {
    if (!this.player || !this.player.sprite) return;

    // Determinar qual animação usar
    const direction = this.player.direction;
    const isMoving = this.player.isMoving;

    try {
      // Animação baseada na direção e se está em movimento
      if (isMoving) {
        this.player.sprite.anims.play(`player-${direction}`, true);
      } else {
        this.player.sprite.anims.play(`player-idle-${direction}`, true);
      }
    } catch (e) {
      console.warn(`⚠️ Erro ao atualizar animação: ${e.message}`);
    }
  };

  /**
   * Tenta interagir com objetos próximos
   */
  jardimMission.prototype.tryInteract = function (time) {
    if (!this.player || !this.player.sprite) return;

    // Verificar cooldown de interação
    if (time - this.player.lastInteraction < this.player.interactionCooldown) {
      return;
    }

    // Atualizar último tempo de interação
    this.player.lastInteraction = time;

    // Verificar se há algum objeto ou NPC próximo para interagir
    const interactiveObject = this.findNearestInteractiveObject();

    if (interactiveObject) {
      // Executar a interação
      this.handleInteraction(interactiveObject);

      // Efeito visual de interação
      this.showEnhancedInteractionEffect(this.player.sprite.x, this.player.sprite.y);
    } else {
      // Não há nada para interagir
      this.showEnhancedNoInteractionEffect();
    }
  };

  /**
   * Encontra o objeto interativo mais próximo
   */
  jardimMission.prototype.findNearestInteractiveObject = function () {
    if (!this.player || !this.player.sprite) return null;

    // Variáveis para armazenar o objeto mais próximo
    let closestObject = null;
    let closestDistance = this.player.interactionRadius;

    // Coordenadas do jogador
    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;

    // Verificar NPCs - Professor tem prioridade em caso de proximidade
    if (this.professor && this.professor.sprite) {
      const distance = Phaser.Math.Distance.Between(playerX, playerY, this.professor.sprite.x, this.professor.sprite.y);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestObject = { type: "npc", id: "professor", sprite: this.professor.sprite };
      }
    }

    // Verificar pontos de interação no mapa
    this.interactPoints.forEach((point) => {
      const distance = Phaser.Math.Distance.Between(playerX, playerY, point.x, point.y);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestObject = { type: "object", id: point.name, data: point };
      }
    });

    return closestObject;
  };

  /**
   * Executa a interação com o objeto especificado
   */
  jardimMission.prototype.handleInteraction = function (interactiveObject) {
    console.log("🤝 Interagindo com:", interactiveObject);

    // Diferenciar tipo de interação
    if (interactiveObject.type === "npc") {
      // Interação com NPC
      if (interactiveObject.id === "professor") {
        this.startProfessorDialog();
      }
    } else if (interactiveObject.type === "object") {
      // Interação com objeto do mapa
      const objectName = interactiveObject.id;

      // Buscar dados do objeto
      const objectData = interactiveObject.data;
      const message = this.getObjectInteractionMessage(objectData);

      // Mostrar mensagem de interação
      this.showObjectInteractionMessage(message);
    }
  };

  /**
   * Obtém a mensagem de interação para um objeto
   */
  jardimMission.prototype.getObjectInteractionMessage = function (objectData) {
    // Verificar se o objeto tem uma propriedade 'message'
    if (objectData && objectData.properties) {
      const messageProp = objectData.properties.find((prop) => prop.name === "message");
      if (messageProp) {
        return messageProp.value;
      }
    }

    // Mensagens padrão baseadas no nome do objeto
    const defaultMessages = {
      fountain: "Uma fonte no centro do jardim. A água cristalina cria um ambiente relaxante e agradável.",
      bench: "Um banco confortável para descansar e apreciar a natureza ao redor.",
      tree: "Uma árvore frondosa que fornece uma sombra agradável nos dias quentes.",
      flowers: "Um canteiro de flores coloridas que trazem vida e alegria ao jardim.",
      sign: 'Uma placa que indica: "Jardim da Escola - Um espaço de aprendizado e conexão com a natureza."',
      trash: "Uma lixeira sustentável com divisória para reciclagem. Cada pequeno gesto ajuda o meio ambiente!",
      statue: "Uma estátua comemorativa que honra a história da instituição.",
      garden: "Um pequeno jardim de ervas aromáticas cultivado pelos alunos para projetos de ciências.",
    };

    return defaultMessages[objectData.name] || "Um objeto interessante no jardim da escola.";
  };

  /**
   * Mostra uma mensagem de interação com objeto
   */
  jardimMission.prototype.showObjectInteractionMessage = function (message) {
    // Criar ou reutilizar balão de diálogo para mensagem
    this.showSimpleDialog(message);
  };

  /**
   * Mostra um efeito visual melhorado quando o jogador interage com algo
   */
  jardimMission.prototype.showEnhancedInteractionEffect = function (x, y) {
    // Efeito de círculo expandindo com cores vibrantes
    const circle = this.add.circle(x, y, 20, this.colors.secondary, 0.5);
    circle.setDepth(15);

    // Animação do círculo
    this.tweens.add({
      targets: circle,
      radius: 80,
      alpha: 0,
      duration: 600,
      ease: "Cubic.Out",
      onComplete: () => {
        circle.destroy();
      },
    });

    // Efeito de linhas irradiando
    const linesCount = 8;
    const lines = [];

    for (let i = 0; i < linesCount; i++) {
      const angle = ((Math.PI * 2) / linesCount) * i;
      const line = this.add.line(x, y, 0, 0, Math.cos(angle) * 30, Math.sin(angle) * 30, this.colors.primary, 0.7);
      line.setLineWidth(3);
      line.setDepth(15);
      lines.push(line);

      // Animar cada linha
      this.tweens.add({
        targets: line,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 500,
        ease: "Power2.out",
        onComplete: () => {
          line.destroy();
        },
      });
    }

    // Adicionar partículas para tornar o efeito mais visível
    try {
      // Usar novo sistema de partículas do Phaser 3.60
      const particles = this.add.particles({
        key: "task-icon",
        x: x,
        y: y,
        speed: { min: 50, max: 150 },
        scale: { start: 0.1, end: 0 },
        alpha: { start: 0.7, end: 0 },
        lifespan: 800,
        quantity: 15,
        blendMode: "ADD",
        emitting: false, // Configurar para emitir uma vez
      });

      // Emitir partículas uma vez
      particles.start();

      // Remover após um tempo
      this.time.delayedCall(1000, () => {
        particles.destroy();
      });
    } catch (e) {
      console.warn("⚠️ Não foi possível criar partículas de interação:", e.message);
    }

    // Destaque temporário do jogador
    if (this.player && this.player.highlight) {
      this.player.highlight.setVisible(true);
      this.player.highlightTween.resume();

      // Desativar após um tempo
      this.time.delayedCall(800, () => {
        this.player.highlightTween.pause();
        this.player.highlight.setVisible(false);
      });
    }
  };

  /**
   * Mostra um efeito visual melhorado quando não há nada para interagir
   */
  jardimMission.prototype.showEnhancedNoInteractionEffect = function () {
    if (!this.player || !this.player.sprite) return;

    // Container para melhor organização
    const container = this.add.container(this.player.sprite.x, this.player.sprite.y - 100);
    container.setDepth(20);

    // Fundo do aviso com estilo moderno
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRoundedRect(-150, -25, 300, 50, 15);

    // Borda estilizada
    bg.lineStyle(3, this.colors.warning, 0.8);
    bg.strokeRoundedRect(-150, -25, 300, 50, 15);

    // Texto com ícone
    const text = this.add
      .text(0, 0, "⚠️ Nada para interagir aqui", {
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: "20px",
        color: "#FFC107",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5);

    // Adicionar ao container
    container.add([bg, text]);

    // Animar entrada
    container.setScale(0.5);
    container.setAlpha(0);

    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Manter visível por um tempo
        this.time.delayedCall(1500, () => {
          // Animar saída
          this.tweens.add({
            targets: container,
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 0,
            y: "-=50",
            duration: 400,
            ease: "Back.easeIn",
            onComplete: () => {
              container.destroy();
            },
          });
        });
      },
    });

    // Efeito de "X" onde o jogador tentou interagir
    const x1 = this.add.line(this.player.sprite.x, this.player.sprite.y, -15, -15, 15, 15, 0xff5555, 0.8);
    x1.setLineWidth(4);
    x1.setDepth(15);

    const x2 = this.add.line(this.player.sprite.x, this.player.sprite.y, 15, -15, -15, 15, 0xff5555, 0.8);
    x2.setLineWidth(4);
    x2.setDepth(15);

    // Animar linhas do X
    this.tweens.add({
      targets: [x1, x2],
      alpha: 0,
      duration: 800,
      delay: 600,
      onComplete: () => {
        x1.destroy();
        x2.destroy();
      },
    });
  };

  /**
   * Verifica proximidade com objetos interativos para atualizar indicadores
   */
  jardimMission.prototype.checkInteractions = function () {
    if (!this.player || !this.player.sprite) return;

    // Verificar se há objeto interativo próximo
    const nearestObject = this.findNearestInteractiveObject();
    const hasNearbyObject = !!nearestObject;
    const isInDialog = this.dialog && this.dialog.active;

    // Atualizar visualização do indicador de interação
    if (this.player.interactionIndicator) {
      // Mostrar indicador apenas se há objeto próximo e não está em diálogo
      const shouldShow = hasNearbyObject && !isInDialog;

      // Se o estado mudou, animar a transição
      if (shouldShow !== this.player.interactionIndicator.visible) {
        if (shouldShow) {
          // Animar entrada
          this.player.interactionIndicator.setAlpha(0);
          this.player.interactionIndicator.setScale(0.5);
          this.player.interactionIndicator.setVisible(true);

          this.tweens.add({
            targets: this.player.interactionIndicator,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: "Back.easeOut",
          });
        } else {
          // Animar saída
          this.tweens.add({
            targets: this.player.interactionIndicator,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 200,
            ease: "Back.easeIn",
            onComplete: () => {
              this.player.interactionIndicator.setVisible(false);
            },
          });
        }
      }
    }

    // Atualizar efeito de destaque do jogador
    if (this.player.highlight && !isInDialog) {
      const shouldHighlight = hasNearbyObject;

      if (shouldHighlight !== this.player.highlight.visible) {
        if (shouldHighlight) {
          // Ativar highlight com fade in
          this.player.highlight.setAlpha(0);
          this.player.highlight.setVisible(true);
          this.player.highlightTween.resume();

          this.tweens.add({
            targets: this.player.highlight,
            alpha: 1,
            duration: 300,
          });
        } else {
          // Desativar highlight com fade out
          this.tweens.add({
            targets: this.player.highlight,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.player.highlight.setVisible(false);
              this.player.highlightTween.pause();
            },
          });
        }
      }
    }

    // Mostrar/ocultar círculo de interação
    if (this.player.interactionCircle) {
      this.player.interactionCircle.setVisible(this.debugMode);
    }

    // Se tivermos um objeto próximo, mostrar dica específica do objeto
    if (hasNearbyObject && !isInDialog) {
      let objectName = "";

      if (nearestObject.type === "npc") {
        objectName = "com o Professor";
      } else if (nearestObject.type === "object") {
        // Capitalizar primeira letra
        const name = nearestObject.id;
        objectName = `com ${name.charAt(0).toUpperCase() + name.slice(1)}`;
      }

      // Mostrar dica apenas ocasionalmente
      if (Math.random() < 0.01) {
        this.showInteractionHint(`Pressione E para interagir ${objectName}`);
      }
    }
  };

  /**
   * Limita o movimento do jogador (usado durante diálogos, etc)
   */
  jardimMission.prototype.disablePlayerMovement = function () {
    if (!this.player) return;

    this.player.canMove = false;
    this.player.sprite.setVelocity(0, 0);
    this.player.isMoving = false;

    // Atualizar para animação parada
    this.updatePlayerAnimation();

    // Ocultar indicadores de interação
    if (this.player.interactionIndicator) {
      this.tweens.add({
        targets: this.player.interactionIndicator,
        alpha: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 200,
        ease: "Back.easeIn",
        onComplete: () => {
          this.player.interactionIndicator.setVisible(false);
        },
      });
    }

    // Ocultar highlight
    if (this.player.highlight) {
      this.tweens.add({
        targets: this.player.highlight,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.player.highlight.setVisible(false);
          this.player.highlightTween.pause();
        },
      });
    }

    // Desativar aura
    if (this.player.aura) {
      this.player.aura.stop();
    }
  };

  /**
   * Reativa o movimento do jogador
   */
  jardimMission.prototype.enablePlayerMovement = function () {
    if (!this.player) return;

    // Ativar movimento com fade in suave
    this.player.sprite.setAlpha(0.8);

    this.tweens.add({
      targets: this.player.sprite,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        this.player.canMove = true;
      },
    });
  };

  console.log("✅ Módulo do Player aprimorado carregado");
})();
