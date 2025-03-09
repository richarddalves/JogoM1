/**
 * Funções utilitárias para navegação entre cenas
 */

// Função para registrar a cena atual no localStorage
export function registrarCenaAtual() {
  if (!window.game) return;

  try {
    const cenasAtivas = window.game.scene.getScenes(true);
    if (cenasAtivas.length > 0) {
      const cenaAtual = cenasAtivas[0].scene.key;
      localStorage.setItem("cenaAnterior", cenaAtual);
    }
  } catch (e) {
    console.error("Erro ao registrar cena atual:", e);
  }
}

// Função para voltar à cena anterior
export function voltarParaCenaAnterior() {
  if (!window.game) return;

  const cenaAnterior = localStorage.getItem("cenaAnterior") || "mainMenu";
  window.game.scene.start(cenaAnterior);
}
