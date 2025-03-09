/**
 * Funções de ambiente visual do menu principal
 */
(function () {
  /**
   * Cria o ambiente visual do menu
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  mainMenu.prototype.createEnvironment = function (width, height) {
    // Adicionar fundo
    this.background = this.add.image(width / 2, height / 2, "menu_bg").setDisplaySize(width, height);

    // Adicionar overlay gradiente para melhorar contraste e legibilidade
    const overlay = this.add.graphics();
    overlay.fillGradientStyle(0x000022, 0x000022, 0x000022, 0x000022, 0.1, 0.1, 0.7, 0.7);
    overlay.fillRect(0, 0, width, height);

    // Efeito de vinheta
    const vignette = this.add.graphics();
    const vignetteColors = [
      { r: 0, g: 0, b: 0, a: 0.7 },
      { r: 0, g: 0, b: 0, a: 0 },
    ];

    vignette.fillGradientStyle(Phaser.Display.Color.GetColor(vignetteColors[0].r, vignetteColors[0].g, vignetteColors[0].b), Phaser.Display.Color.GetColor(vignetteColors[0].r, vignetteColors[0].g, vignetteColors[0].b), Phaser.Display.Color.GetColor(vignetteColors[1].r, vignetteColors[1].g, vignetteColors[1].b), Phaser.Display.Color.GetColor(vignetteColors[1].r, vignetteColors[1].g, vignetteColors[1].b), vignetteColors[0].a, vignetteColors[0].a, vignetteColors[1].a, vignetteColors[1].a);
    vignette.fillRect(0, 0, width, height);

    // Adicionar grade digital para efeito futurista
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, this.colors.primary, 0.1);

    // Linhas horizontais
    for (let y = 0; y < height; y += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(width, y);
      gridGraphics.strokePath();
    }

    // Linhas verticais
    for (let x = 0; x < width; x += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, height);
      gridGraphics.strokePath();
    }
  };

  console.log("✅ Menu Environment Module loaded");
})();
