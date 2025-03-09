/**
 * Módulo para gerenciar o jogador na cena inicial
 * @module cenaInicial/player
 */

/**
 * Cria o jogador na cena
 * @param {number} mapWidth - Largura do mapa
 * @param {number} mapHeight - Altura do mapa
 * @returns {Phaser.Physics.Arcade.Sprite} - O sprite do jogador
 */
function createPlayer(mapWidth, mapHeight) {
  // Criar o jogador no centro do mapa
  const player = this.physics.add.sprite(mapWidth / 2, mapHeight / 2, "character_down_idle");
  player.setCollideWorldBounds(true);
  player.setScale(1.7);

  return player;
}

/**
 * Cria as animações do jogador
 */
function createPlayerAnimations() {
  // Animação para andar para a direita
  this.anims.create({
    key: "walk-right",
    frames: [{ key: "character_right_1" }, { key: "character_right_2" }, { key: "character_right_3" }, { key: "character_right_4" }, { key: "character_right_5" }, { key: "character_right_6" }],
    frameRate: 10,
    repeat: -1,
  });

  // Animação para andar para a esquerda
  this.anims.create({
    key: "walk-left",
    frames: [{ key: "character_right_1" }, { key: "character_right_2" }, { key: "character_right_3" }, { key: "character_right_4" }, { key: "character_right_5" }, { key: "character_right_6" }],
    frameRate: 10,
    repeat: -1,
  });

  // Animação para andar para baixo
  this.anims.create({
    key: "walk-down",
    frames: [{ key: "character_down_1" }, { key: "character_down_2" }, { key: "character_down_3" }, { key: "character_down_4" }, { key: "character_down_5" }, { key: "character_down_6" }],
    frameRate: 10,
    repeat: -1,
  });

  // Animação para andar para cima
  this.anims.create({
    key: "walk-up",
    frames: [{ key: "character_up_1" }, { key: "character_up_2" }, { key: "character_up_3" }, { key: "character_up_4" }, { key: "character_up_5" }, { key: "character_up_6" }],
    frameRate: 10,
    repeat: -1,
  });

  // Animações do estado parado
  this.anims.create({
    key: "idle-down",
    frames: [{ key: "character_down_idle" }],
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "idle-up",
    frames: [{ key: "character_up_idle" }],
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "idle-side",
    frames: [{ key: "character_right_idle" }],
    frameRate: 10,
    repeat: -1,
  });
}

/**
 * Gerencia o movimento do jogador com base nas teclas pressionadas
 */
function handlePlayerMovement() {
  // Resetar velocidade
  this.player.setVelocity(0);

  let moving = false;

  // Movimento horizontal
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-this.playerSpeed);
    this.player.setFlipX(true);
    this.player.play("walk-left", true);
    this.lastDirection = "side";
    moving = true;
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(this.playerSpeed);
    this.player.setFlipX(false);
    this.player.play("walk-right", true);
    this.lastDirection = "side";
    moving = true;
  }

  // Movimento vertical
  if (this.cursors.up.isDown) {
    this.player.setVelocityY(-this.playerSpeed);

    // Só trocar a animação se não estiver se movendo horizontalmente
    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.player.play("walk-up", true);
      this.lastDirection = "up";
    }

    moving = true;
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(this.playerSpeed);

    // Só trocar a animação se não estiver se movendo horizontalmente
    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.player.play("walk-down", true);
      this.lastDirection = "down";
    }

    moving = true;
  }

  // Animação parada
  if (!moving) {
    if (this.lastDirection === "down") {
      this.player.play("idle-down", true);
    } else if (this.lastDirection === "up") {
      this.player.play("idle-up", true);
    } else {
      this.player.play("idle-side", true);
    }
  }

  // Normalizar movimento diagonal
  if (moving && (this.cursors.up.isDown || this.cursors.down.isDown) && (this.cursors.left.isDown || this.cursors.right.isDown)) {
    // Ajustar velocidade para evitar movimento mais rápido na diagonal
    this.player.setVelocity(this.player.body.velocity.x * 0.7071, this.player.body.velocity.y * 0.7071);
  }
}

// Exportando as funções para uso em outros módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createPlayer,
    createPlayerAnimations,
    handlePlayerMovement,
  };
}
