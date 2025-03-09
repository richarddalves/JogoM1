/**
 * Configuração e inicialização do jogo
 * MODIFICADO: Adicionando a nova cena jardimMission
 */

// Função para registrar a cena atual no localStorage
function registrarCenaAtual() {
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
function voltarParaCenaAnterior() {
  if (!window.game) return;

  const cenaAnterior = localStorage.getItem("cenaAnterior") || "mainMenu";
  window.game.scene.start(cenaAnterior);
}

// Tornar as funções de navegação acessíveis globalmente
window.registrarCenaAtual = registrarCenaAtual;
window.voltarParaCenaAnterior = voltarParaCenaAnterior;

// Verificamos se todas as cenas principais estão carregadas antes de iniciar o jogo
function checkAndInitializeGame() {
  if (window.mainMenu) {
    // Configuração do jogo
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#000000",
      scene: [window.mainMenu],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    // Inicialização do jogo
    window.game = new Phaser.Game(config);
    console.log("🎮 Game core inicializado com a cena inicial");

    // Adicionar as outras cenas à medida que forem carregadas
    function addSceneIfLoaded(sceneClass, sceneName) {
      if (window[sceneClass] && window.game && !window.game.scene.getScene(sceneName)) {
        window.game.scene.add(sceneName, window[sceneClass], false);
        console.log(`✅ Cena ${sceneName} adicionada ao jogo`);
      }
    }

    // Verificar cenas periodicamente
    const checkScenes = setInterval(() => {
      addSceneIfLoaded("conversation", "conversation");
      addSceneIfLoaded("gameInicial", "gameInicial");
      addSceneIfLoaded("cenaInicial", "cenaInicial");
      addSceneIfLoaded("chooseRole", "chooseRole");
      addSceneIfLoaded("missionsHub", "missionsHub");
      addSceneIfLoaded("schoolMission", "schoolMission");
      // MODIFICADO: Adicionar a nova cena jardimMission
      addSceneIfLoaded("jardimMission", "jardimMission");

      // Se todas as cenas forem carregadas, parar de verificar
      // MODIFICADO: Incluir jardimMission na verificação
      if (window.conversation && window.gameInicial && window.cenaInicial && window.chooseRole && window.missionsHub && window.schoolMission && window.jardimMission) {
        clearInterval(checkScenes);
        console.log("✅ Todas as cenas foram carregadas e adicionadas ao jogo");
      }
    }, 300);
  } else {
    // Se a cena mainMenu ainda não estiver pronta, tentamos novamente em breve
    setTimeout(checkAndInitializeGame, 100);
  }
}

// Inicia a verificação
checkAndInitializeGame();

console.log("🎮 Game core iniciando carregamento");
