/**
 * Módulo para gerenciar a conclusão da missão na cena inicial
 * @module cenaInicial/completion
 */

/**
 * Completa a missão e mostra tela de conclusão
 */
function completeMission() {
  // Criar painel de missão completa
  const width = this.cameras.main.width;
  const height = this.cameras.main.height;

  // Parar movimento do personagem
  this.player.setVelocity(0, 0);

  // Criar overlay escuro
  const overlay = this.add.graphics().fillStyle(0x000000, 0.8).fillRect(this.cameras.main.scrollX, this.cameras.main.scrollY, width, height);

  // Determinar se UIComponents está disponível
  if (typeof UIComponents !== "undefined") {
    // Criar painel de conclusão
    const completionPanel = UIComponents.createPanel(this, width / 2 + this.cameras.main.scrollX, height / 2 + this.cameras.main.scrollY, width * 0.8, height * 0.6, {
      backgroundColor: 0x0d468a,
      borderColor: 0x00ffff,
      borderWidth: 4,
    });
  }

  // Título
  const completionTitle = this.add
    .text(width / 2 + this.cameras.main.scrollX, height / 2 - 150 + this.cameras.main.scrollY, "MISSÃO CONCLUÍDA!", {
      fontSize: "32px",
      fontFamily: "OldSchoolAdventures",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 4,
    })
    .setOrigin(0.5);

  // Mensagem
  const completionMessage = this.add
    .text(width / 2 + this.cameras.main.scrollX, height / 2 - 80 + this.cameras.main.scrollY, `Excelente trabalho, DPO Hero!\n\n` + `Você identificou e corrigiu todas as violações de dados\n` + `na escola, protegendo as informações pessoais dos alunos.\n\n` + `A diretora implementará suas recomendações de segurança.`, {
      fontSize: "22px",
      fontFamily: "OldSchoolAdventures",
      fill: "#FFFFFF",
      align: "center",
      wordWrap: { width: width * 0.7 },
    })
    .setOrigin(0.5);

  // Bônus de conclusão
  if (window.saveManager) {
    window.saveManager.completeMission("classroom");

    // Pontos bônus pela conclusão
    if (this.agentHUD) {
      this.agentHUD.addPoints(50, "Missão completa: Escola de Dados");
    }
  }

  // Botões
  if (typeof UIComponents !== "undefined") {
    const missionHubButton = UIComponents.createButton(this, width / 2 - 150 + this.cameras.main.scrollX, height / 2 + 100 + this.cameras.main.scrollY, "MISSÕES", () => this.goToMissionHub(), {
      width: 200,
      height: 60,
    });

    const continueButton = UIComponents.createButton(this, width / 2 + 150 + this.cameras.main.scrollX, height / 2 + 100 + this.cameras.main.scrollY, "CONTINUAR", () => this.goToNextMission(), {
      width: 200,
      height: 60,
      backgroundColor: 0x4caf50,
    });
  } else {
    // Fallback para botões simples se UIComponents não estiver disponível
    this.createSimpleButton(width / 2 - 150 + this.cameras.main.scrollX, height / 2 + 100 + this.cameras.main.scrollY, "MISSÕES", () => this.goToMissionHub());
    this.createSimpleButton(width / 2 + 150 + this.cameras.main.scrollX, height / 2 + 100 + this.cameras.main.scrollY, "CONTINUAR", () => this.goToNextMission());
  }
}

// Exportando as funções para uso em outros módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    completeMission,
  };
}
