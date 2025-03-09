/**
 * Funções relacionadas aos personagens da cena de conversação
 */
(function () {
  /**
   * Cria os personagens da cena
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  conversation.prototype.createCharacters = function (width, height) {
    // Criar container para os personagens
    this.charactersContainer = this.add.container(0, 0);

    // Agente jogador (à esquerda)
    this.agentCharacter = this.add
      .image(width * 0.25, height * 0.48, "agent")
      .setOrigin(0.5)
      .setScale(this.charScale * 1.4)
      .setAlpha(0); // Inicialmente invisível
    this.charactersContainer.add(this.agentCharacter);

    // Agente instrutor (à direita)
    this.tutorCharacter = this.add
      .image(width * 0.75, height * 0.5, "tutor")
      .setOrigin(0.5)
      .setScale(this.charScale * 1.4) // Ligeiramente maior
      .setAlpha(0); // Inicialmente invisível
    this.charactersContainer.add(this.tutorCharacter);

    // Adicionar aura simples ao redor do instrutor (sem círculos)
    const tutorAura = this.add.graphics();
    tutorAura.fillStyle(0x39f5e2, 0.15);
    tutorAura.fillCircle(width * 0.75, height * 0.5, 100 * this.charScale);
    this.charactersContainer.add(tutorAura);

    // Animar a aura com efeitos mais suaves
    this.tweens.add({
      targets: tutorAura,
      alpha: { from: 0.15, to: 0.25 },
      scale: { from: 1, to: 1.05 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  };

  /**
   * Mostra o personagem especificado e oculta o outro com animação aprimorada
   * @param {string} character - O personagem a ser mostrado ("agent" ou "tutor")
   */
  conversation.prototype.showCharacter = function (character) {
    // Verificar se os personagens existem
    if (!this.agentCharacter || !this.tutorCharacter) return;

    // Desanimar personagem anterior com transição mais suave
    if (this.currentCharacter && this.currentCharacter !== character) {
      const prevChar = this.currentCharacter === "agent" ? this.agentCharacter : this.tutorCharacter;
      this.tweens.add({
        targets: prevChar,
        alpha: 0.3, // Mais transparente para dar destaque ao falante
        scale: this.charScale * 0.9,
        duration: 500,
        ease: "Power2",
      });
    }

    // Animar novo personagem com efeito mais dinâmico
    const activeChar = character === "agent" ? this.agentCharacter : this.tutorCharacter;

    // Primeiro pulso de destaque
    this.tweens.add({
      targets: activeChar,
      alpha: { from: activeChar.alpha, to: 1 },
      scale: { from: activeChar.scale, to: character === "agent" ? this.charScale * 1.05 : this.charScale * 1.15 },
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Retornar ao tamanho normal com bounce suave
        this.tweens.add({
          targets: activeChar,
          scale: character === "agent" ? this.charScale * 1.4 : this.charScale * 1.4,
          duration: 200,
          ease: "Sine.easeInOut",
        });
      },
    });

    // Se o personagem está aparecendo pela primeira vez
    if (activeChar.alpha < 0.5) {
      // Efeito de entrada mais dramático
      activeChar.setScale(character === "agent" ? this.charScale * 0.8 : this.charScale * 0.9);

      this.tweens.add({
        targets: activeChar,
        alpha: { from: 0, to: 1 },
        scale: character === "agent" ? this.charScale * 1.4 : this.charScale * 1.4,
        duration: 800,
        ease: "Back.easeOut",
        onComplete: () => {
          // Pequeno efeito de bounce
          this.tweens.add({
            targets: activeChar,
            scale: { from: activeChar.scale, to: activeChar.scale * 1.03 },
            duration: 150,
            yoyo: true,
            ease: "Sine.easeInOut",
          });
        },
      });
    }

    // Armazenar personagem atual
    this.currentCharacter = character;
  };

  console.log("✅ Personagens de Conversação carregados");
})();
