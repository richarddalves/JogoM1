/**
 * Interface do agente que exibe status, missões e recursos do jogador
 * @class AgentHUD
 * @description Cria e gerencia a HUD do jogador, exibindo informações vitais do jogo como nível, pontuação e missões
 */

// Função para carregar scripts dinamicamente
(function () {
  function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback || function () {};
    document.head.appendChild(script);
  }

  // Carregar scripts de módulos da HUD
  const agentHUDModules = ["buttons.js", "hudElements.js", "notifications.js"];

  const agentHUDPath = "src/js/utils/agentHUD/";
  let loadedCount = 0;

  agentHUDModules.forEach((module) => {
    loadScript(agentHUDPath + module, function () {
      loadedCount++;
      if (loadedCount === agentHUDModules.length) {
        console.log("✅ Todos os módulos da AgentHUD carregados com sucesso!");
      }
    });
  });
})();

class AgentHUD {
  /**
   * Cria uma nova instância da HUD do Agente
   * @param {Phaser.Scene} scene - A cena atual do jogo
   */
  constructor(scene) {
    this.scene = scene;
    this.isVisible = true;
    this.isExpanded = false;
    this.container = null;
    this.hudComponents = {};
    this.notificationQueue = [];
    this.isProcessingNotification = false;
    this.animations = [];

    // Configurações de estilo
    this.style = {
      colors: {
        primary: 0x0d84ff, // Azul principal
        secondary: 0x39f5e2, // Ciano secundário
        accent: 0xff3a3a, // Vermelho para alertas
        positive: 0x4caf50, // Verde para positivo
        warning: 0xffc107, // Amarelo para avisos
        dark: 0x1a1a2e, // Fundo escuro
        light: 0xffffff, // Texto claro
      },
      fonts: {
        main: {
          fontFamily: "OldSchoolAdventures",
          fontSize: "16px",
          color: "#FFFFFF",
        },
        title: {
          fontFamily: "OldSchoolAdventures",
          fontSize: "20px",
          color: "#FFFFFF",
        },
        small: {
          fontFamily: "OldSchoolAdventures",
          fontSize: "14px",
          color: "#CCCCCC",
        },
      },
      animation: {
        duration: 400,
        easing: "Sine.easeInOut",
      },
    };

    // Criar os elementos da HUD
    this.createHUD();

    // Configurar teclas de atalho
    this.setupKeyListeners();
  }

  /**
   * Cria todos os elementos visuais da HUD
   * @private
   */
  createHUD() {
    // Verificar se a scene é válida
    if (!this.scene || !this.scene.add) {
      console.error("❌ Cena inválida fornecida para AgentHUD");
      return;
    }

    // Criar container principal com profundidade alta para ficar sobre outros elementos
    this.container = this.scene.add.container(10, 10);
    this.container.setDepth(1000);

    // Criar a visualização recolhida (apenas ícone)
    this.createCollapsedView();

    // Criar a visualização expandida (painel completo)
    this.createExpandedView();

    // Inicializar na visualização recolhida
    this.toggleExpanded(false);

    // Atualizar informações
    this.updateHUDInfo();
  }

  /**
   * Configura os ouvintes de teclado para atalhos da HUD
   * @private
   */
  setupKeyListeners() {
    // Verificar se o Phaser está disponível
    if (!this.scene || !this.scene.input || !this.scene.input.keyboard) {
      return;
    }

    // Alternar visibilidade com a tecla H
    this.scene.input.keyboard.on("keydown-H", () => {
      this.toggleVisibility();
    });

    // Alternar expansão com a tecla J
    this.scene.input.keyboard.on("keydown-J", () => {
      if (this.isVisible) {
        this.toggleExpanded(!this.isExpanded);
      }
    });
  }

  /**
   * Alterna a visibilidade da HUD
   * @public
   */
  toggleVisibility() {
    this.isVisible = !this.isVisible;

    if (this.isVisible) {
      // Animação de entrada
      this.container.setAlpha(0);
      this.container.setVisible(true);
      this.scene.tweens.add({
        targets: this.container,
        alpha: 1,
        duration: 200,
        ease: "Sine.easeOut",
        onComplete: () => {
          this.updateHUDInfo();
        },
      });
    } else {
      // Animação de saída
      this.scene.tweens.add({
        targets: this.container,
        alpha: 0,
        duration: 200,
        ease: "Sine.easeIn",
        onComplete: () => {
          this.container.setVisible(false);
        },
      });
    }
  }

  /**
   * Atualiza a HUD (chamado no método update da cena)
   * @public
   */
  update(time, delta) {
    // Atualização dinâmica de componentes
    // (Implementar conforme necessário, por exemplo animações que dependem do tempo)
  }

  /**
   * Versão interna segura da função drawRoundedRect
   * Fallback para fillRect normal se a função falhar
   */
  drawRoundedRect(graphics, x, y, width, height, radius, fillColor, strokeColor = null, strokeWidth = 0, alpha = 1) {
    try {
      // Verificar se a função global existe
      if (typeof window.drawRoundedRect === "function") {
        window.drawRoundedRect(graphics, x, y, width, height, radius, fillColor, strokeColor, strokeWidth, alpha);
      } else {
        // Fallback simples se a função não existir
        graphics.fillStyle(fillColor, alpha);
        graphics.fillRect(x, y, width, height);

        if (strokeColor !== null) {
          graphics.lineStyle(strokeWidth, strokeColor, alpha);
          graphics.strokeRect(x, y, width, height);
        }
      }
    } catch (e) {
      // Fallback em caso de erro
      console.warn("❌ Erro ao desenhar retângulo arredondado, usando fallback:", e);

      graphics.fillStyle(fillColor, alpha);
      graphics.fillRect(x, y, width, height);

      if (strokeColor !== null) {
        graphics.lineStyle(strokeWidth, strokeColor, alpha);
        graphics.strokeRect(x, y, width, height);
      }
    }
  }
}

// Tornar a classe disponível globalmente
window.AgentHUD = AgentHUD;
