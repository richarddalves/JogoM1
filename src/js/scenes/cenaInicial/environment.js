/**
 * Módulo para gerenciar o ambiente e cenário da cena inicial
 * @module cenaInicial/environment
 */

/**
 * Cria o ambiente da cena
 * @param {number} mapWidth - Largura do mapa
 * @param {number} mapHeight - Altura do mapa
 */
function createEnvironment(mapWidth, mapHeight) {
  // Adicionar fundo
  this.background = this.add.image(mapWidth / 2, mapHeight / 2, "scenario").setDisplaySize(mapWidth, mapHeight);

  // Adicionar limites de câmera
  this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
}

// Exportando as funções para uso em outros módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createEnvironment,
  };
}
