/**
 * Funções relacionadas ao jogador na Missão Escolar
 */
(function () {
  /**
   * Cria o personagem do jogador
   */
  schoolMission.prototype.createPlayer = function () {
    try {
      // Obter coordenadas do ponto de spawn (ou usar o centro da tela como fallback)
      const spawnX = this.mapElements.spawnPoint ? this.mapElements.spawnPoint.x : this.cameras.main.width / 2;
      const spawnY = this.mapElements.spawnPoint ? this.mapElements.spawnPoint.y : this.cameras.main.height / 2;

      // Criar sprite do jogador
      this.player = this.physics.add.sprite(spawnX, spawnY, "player_character");
      this.player.setCollideWorldBounds(true);
      this.player.setDepth(10); // Garantir que fique acima do mapa

      // Configurar hitbox do jogador
      this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.5);
      this.player.body.setOffset(this.player.width * 0.15, this.player.height * 0.5);

      // Criar animações do jogador
      this.createPlayerAnimations();

      // Adicionar colisão com o mapa
      if (this.collisionLayer) {
        this.physics.add.collider(this.player, this.collisionLayer);
      }

      // Se estiver usando o mapa de fallback, adicionar colisão com os colisores básicos
      if (this.mapElements.fallbackColliders) {
        this.mapElements.fallbackColliders.forEach((collider) => {
          this.physics.add.collider(this.player, collider);
        });
      }

      // Adicionar zona de interação em volta do jogador
      this.createPlayerInteractionZone();

      console.log("✅ Jogador criado com sucesso");
    } catch (e) {
      console.error("❌ Erro ao criar jogador:", e);
    }
  };

  /**
   * Cria animações para o jogador
   */
  schoolMission.prototype.createPlayerAnimations = function () {
    try {
      // Verificar se o spritesheet do jogador foi carregado corretamente
      if (!this.textures.exists("player_character")) {
        console.warn("⚠️ Spritesheet do jogador não encontrado");
        return;
      }

      // Criar animações baseadas no spritesheet disponível
      // Movimento para baixo (frames 0-6)
      this.anims.create({
        key: "player-down",
        frames: this.anims.generateFrameNumbers("player_character", { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1,
      });

      // Movimento para cima (frames 7-13)
      this.anims.create({
        key: "player-up",
        frames: this.anims.generateFrameNumbers("player_character", { start: 7, end: 13 }),
        frameRate: 10,
        repeat: -1,
      });

      // Movimento para a direita (frames 14-20)
      this.anims.create({
        key: "player-right",
        frames: this.anims.generateFrameNumbers("player_character", { start: 14, end: 20 }),
        frameRate: 10,
        repeat: -1,
      });

      // Movimento para a esquerda - espelhar os frames da direita
      this.anims.create({
        key: "player-left",
        frames: this.anims.generateFrameNumbers("player_character", { start: 14, end: 20 }),
        frameRate: 10,
        repeat: -1,
      });

      // Espelhar a animação para a esquerda
      this.player.flipX = false;

      // Animações de idle (parado) - usando o primeiro frame de cada direção
      this.anims.create({
        key: "player-idle-down",
        frames: [{ key: "player_character", frame: 0 }],
        frameRate: 10,
      });

      this.anims.create({
        key: "player-idle-up",
        frames: [{ key: "player_character", frame: 7 }],
        frameRate: 10,
      });

      this.anims.create({
        key: "player-idle-right",
        frames: [{ key: "player_character", frame: 14 }],
        frameRate: 10,
      });

      this.anims.create({
        key: "player-idle-left",
        frames: [{ key: "player_character", frame: 14 }],
        frameRate: 10,
      });

      console.log("✅ Animações do jogador criadas com sucesso");
    } catch (e) {
      console.error("❌ Erro ao criar animações do jogador:", e);

      // Em caso de erro nas animações, tentar criar um fallback simples
      try {
        // Animação de fallback
        this.anims.create({
          key: "player-fallback",
          frames: this.anims.generateFrameNumbers("player_character", { start: 0, end: 0 }),
          frameRate: 10,
        });

        // Definir animações de fallback para todas as direções
        this.anims.create({
          key: "player-down",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        this.anims.create({
          key: "player-up",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        this.anims.create({
          key: "player-left",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        this.anims.create({
          key: "player-right",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        this.anims.create({
          key: "player-idle-down",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        this.anims.create({
          key: "player-idle-up",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        this.anims.create({
          key: "player-idle-left",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        this.anims.create({
          key: "player-idle-right",
          frames: [{ key: "player_character", frame: 0 }],
          frameRate: 10,
        });

        console.log("✅ Animações de fallback do jogador criadas");
      } catch (e2) {
        console.error("❌ Erro ao criar animação de fallback:", e2);
      }
    }
  };

  /**
   * Cria zona de interação em volta do jogador
   */
  schoolMission.prototype.createPlayerInteractionZone = function () {
    if (!this.player) return;

    // Criar uma zona de interação em volta do jogador
    const zoneSize = 40; // Tamanho da zona de interação

    this.playerInteractionZone = this.add.zone(this.player.x, this.player.y, zoneSize, zoneSize).setOrigin(0.5);

    // Adicionar física à zona
    this.physics.world.enable(this.playerInteractionZone);

    // Atualizar a posição da zona quando o jogador se move
    this.player.on("animationupdate", () => {
      this.playerInteractionZone.x = this.player.x;
      this.playerInteractionZone.y = this.player.y;
    });

    // Se o jogador parar, atualizar a posição da zona uma última vez
    this.player.on("animationcomplete", () => {
      this.playerInteractionZone.x = this.player.x;
      this.playerInteractionZone.y = this.player.y;
    });
  };

  /**
   * Atualiza movimento do jogador
   */
  schoolMission.prototype.updatePlayerMovement = function () {
    if (!this.player || this.dialogActive || this.isPaused) {
      // Para o jogador se estiver em diálogo ou pausado
      if (this.player) {
        this.player.setVelocity(0);
      }
      return;
    }

    // Obter teclas de movimento
    const cursors = this.input.keyboard.createCursorKeys();
    const wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Calcular velocidade
    let velocityX = 0;
    let velocityY = 0;

    // Movimento horizontal
    if (cursors.left.isDown || wasd.left.isDown) {
      velocityX = -this.playerSpeed;
      // Virar o sprite para a esquerda se estiver usando a animação de direita
      this.player.flipX = true;
    } else if (cursors.right.isDown || wasd.right.isDown) {
      velocityX = this.playerSpeed;
      // Resetar a orientação horizontal
      this.player.flipX = false;
    }

    // Movimento vertical
    if (cursors.up.isDown || wasd.up.isDown) {
      velocityY = -this.playerSpeed;
    } else if (cursors.down.isDown || wasd.down.isDown) {
      velocityY = this.playerSpeed;
    }

    // Normalizar movimento diagonal
    if (velocityX !== 0 && velocityY !== 0) {
      const normalizer = Math.sqrt(2) / 2;
      velocityX *= normalizer;
      velocityY *= normalizer;
    }

    // Aplicar velocidade
    this.player.setVelocity(velocityX, velocityY);

    // Atualizar animação baseada na direção
    this.updatePlayerAnimation(velocityX, velocityY);

    // Atualizar zona de interação para seguir o jogador
    if (this.playerInteractionZone) {
      this.playerInteractionZone.x = this.player.x;
      this.playerInteractionZone.y = this.player.y;
    }
  };

  /**
   * Atualiza animação do jogador baseada na velocidade
   * @param {number} velocityX - Velocidade horizontal
   * @param {number} velocityY - Velocidade vertical
   */
  schoolMission.prototype.updatePlayerAnimation = function (velocityX, velocityY) {
    if (!this.player) return;

    // Determinar a direção predominante
    let anim = "player-idle-down"; // Animação padrão

    // Se houver movimento
    if (velocityX !== 0 || velocityY !== 0) {
      // Determinar direção predominante
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        // Movimento horizontal predominante
        anim = velocityX < 0 ? "player-left" : "player-right";
      } else {
        // Movimento vertical predominante
        anim = velocityY < 0 ? "player-up" : "player-down";
      }
    } else {
      // Idle baseado na última direção
      const currentAnim = this.player.anims.currentAnim;

      if (currentAnim) {
        const key = currentAnim.key;

        // Determinar a animação de idle baseada na animação atual
        if (key.includes("left")) {
          anim = "player-idle-left";
        } else if (key.includes("right")) {
          anim = "player-idle-right";
        } else if (key.includes("up")) {
          anim = "player-idle-up";
        } else {
          anim = "player-idle-down";
        }
      }
    }

    // Verificar se é preciso mudar a animação e se a animação existe
    if (this.anims.exists(anim)) {
      if (this.player.anims.currentAnim && this.player.anims.currentAnim.key !== anim) {
        this.player.play(anim, true);
      } else if (!this.player.anims.currentAnim) {
        // Se não houver animação atual, iniciar a nova
        this.player.play(anim, true);
      }
    } else {
      // Se a animação não existir, usar fallback
      if (this.anims.exists("player-fallback")) {
        this.player.play("player-fallback", true);
      }
    }
  };

  /**
   * Verifica interações próximas ao jogador
   */
  schoolMission.prototype.checkForInteractions = function () {
    if (!this.player || !this.playerInteractionZone) return;

    // Verificar sobreposição com NPCs
    let interactedWithNPC = false;

    // Verificar interação com NPCs
    Object.keys(this.npcs).forEach((npcKey) => {
      const npc = this.npcs[npcKey];

      if (npc && this.physics.overlap(this.playerInteractionZone, npc)) {
        // Interagir com o NPC
        this.startDialogWithNPC(npcKey);
        interactedWithNPC = true;
      }
    });

    // Se não interagiu com NPC, verificar outras interações
    if (!interactedWithNPC && this.mapElements.interactionZones) {
      this.mapElements.interactionZones.forEach((zone) => {
        if (this.physics.overlap(this.playerInteractionZone, zone)) {
          // Obter propriedades da zona
          const props = zone.getData("properties");

          // Executar interação baseada no tipo
          this.handleZoneInteraction(props);
        }
      });
    }
  };

  /**
   * Processa interação com uma zona
   * @param {Object} props - Propriedades da zona
   */
  schoolMission.prototype.handleZoneInteraction = function (props) {
    if (!props) return;

    // Identificar tipo de interação
    const interactionId = props.id || "";
    const interactionType = props.type || "";

    // Informar interface para mostrar feedback
    this.showInteractionFeedback(interactionId, props);

    // Verificar se esta interação progride as tarefas da missão
    this.checkTaskProgressFromInteraction(interactionId);
  };

  /**
   * Verifica proximidade com NPCs para mostrar dicas visuais
   */
  schoolMission.prototype.checkNPCProximity = function () {
    if (!this.player || !this.playerInteractionZone || this.dialogActive) return;

    let nearNPC = false;

    // Verificar todos os NPCs
    if (this.npcs) {
      Object.keys(this.npcs).forEach((npcKey) => {
        const npc = this.npcs[npcKey];

        if (npc && this.physics.overlap(this.playerInteractionZone, npc)) {
          // Mostrar dica visual de interação se estiver próximo
          if (!npc.getData("showingInteractionHint")) {
            this.showNPCInteractionHint(npc);
            npc.setData("showingInteractionHint", true);
          }
          nearNPC = true;
        } else if (npc && npc.getData("showingInteractionHint")) {
          // Remover dica se não estiver mais próximo
          this.hideNPCInteractionHint(npc);
          npc.setData("showingInteractionHint", false);
        }
      });
    }

    // Atualizar cursor se estiver próximo de um NPC
    this.updateCursorStyle(nearNPC);
  };

  /**
   * Mostra dica visual de interação acima de um NPC
   * @param {Phaser.GameObjects.Sprite} npc - Sprite do NPC
   */
  schoolMission.prototype.showNPCInteractionHint = function (npc) {
    // Criar ícone de interação (tecla E)
    const hint = this.add
      .text(npc.x, npc.y - npc.height / 2 - 20, "E", {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        backgroundColor: "#0d84ff",
        color: "#ffffff",
        padding: {
          x: 8,
          y: 4,
        },
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Animação de flutuação
    this.tweens.add({
      targets: hint,
      y: hint.y - 5,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Vincular a dica ao NPC
    npc.setData("interactionHint", hint);
  };

  /**
   * Esconde dica visual de interação de um NPC
   * @param {Phaser.GameObjects.Sprite} npc - Sprite do NPC
   */
  schoolMission.prototype.hideNPCInteractionHint = function (npc) {
    const hint = npc.getData("interactionHint");

    if (hint) {
      // Remover animações
      this.tweens.killTweensOf(hint);

      // Animar desaparecimento
      this.tweens.add({
        targets: hint,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          hint.destroy();
          npc.setData("interactionHint", null);
        },
      });
    }
  };

  /**
   * Atualiza o estilo do cursor baseado na proximidade com elementos interativos
   * @param {boolean} isInteractive - Se está próximo de algo interativo
   */
  schoolMission.prototype.updateCursorStyle = function (isInteractive) {
    if (isInteractive) {
      this.input.setDefaultCursor("pointer");
    } else {
      this.input.setDefaultCursor("default");
    }
  };

  console.log("✅ Módulo de Jogador da Missão Escolar carregado");
})();
