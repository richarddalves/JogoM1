/**
 * Implementação das melhorias para a missão do jardim
 * Este arquivo concentra as alterações necessárias para integrar todas as melhorias
 * nos componentes do mapa, jogador, diálogos e interface.
 */

// Modificação da cena principal para integrar todas as melhorias
(function () {
  /**
   * Configura a fonte padrão para toda a aplicação
   */
  const configureFonts = function () {
    try {
      // Adicionar fonte padrão como uma variável global para facilitar o acesso
      if (!window.defaultFont) {
        window.defaultFont = "'Chakra Petch', sans-serif";
      }
    } catch (e) {
      console.warn("⚠️ Não foi possível configurar a fonte padrão:", e.message);
    }
  };

  /**
   * Modifica as cores padrão para uso em toda a aplicação
   */
  const configureColors = function () {
    // Cores padrão para toda a aplicação
    window.uiColors = {
      primary: 0x0d84ff, // Azul principal
      secondary: 0x39f5e2, // Ciano secundário
      accent: 0xff3a3a, // Vermelho para alertas
      positive: 0x4caf50, // Verde para positivo
      warning: 0xffc107, // Amarelo para avisos
      dark: 0x0a1a2f, // Fundo escuro (azul muito escuro)
      light: 0xffffff, // Texto claro
    };
  };

  /**
   * Adiciona utilitários de desenho para elementos de UI
   */
  const addDrawingUtilities = function () {
    // Adicionar funções úteis para desenhar elementos visuais
    if (!window.drawRoundedRect) {
      window.drawRoundedRect = function (graphics, x, y, width, height, radius, fillColor, strokeColor = null, strokeWidth = 0, alpha = 1) {
        graphics.fillStyle(fillColor, alpha);
        graphics.fillRoundedRect(x, y, width, height, radius);

        if (strokeColor !== null) {
          graphics.lineStyle(strokeWidth, strokeColor, alpha);
          graphics.strokeRoundedRect(x, y, width, height, radius);
        }
      };
    }

    // Função para desenhar gradientes
    if (!window.drawGradient) {
      window.drawGradient = function (graphics, x, y, width, height, colors, vertical = true) {
        // Criar gradiente
        let gradient;

        if (vertical) {
          gradient = graphics.createLinearGradient(0, y, 0, y + height);
        } else {
          gradient = graphics.createLinearGradient(x, 0, x + width, 0);
        }

        // Adicionar paradas de cor
        colors.forEach((color) => {
          gradient.addColorStop(color.stop, color.color);
        });

        // Aplicar gradiente
        graphics.fillStyle(gradient);
        graphics.fillRect(x, y, width, height);
      };
    }

    // Função para desenhar botão cyberpunk
    if (!window.drawCyberButton) {
      window.drawCyberButton = function (graphics, x, y, width, height, options = {}) {
        // Opções padrão
        const defaults = {
          fillColor: 0x0d84ff,
          strokeColor: 0x39f5e2,
          strokeWidth: 2,
          cornerRadius: 10,
          glowEffect: false,
        };

        // Mesclar opções
        const settings = { ...defaults, ...options };

        // Desenhar fundo
        graphics.fillStyle(settings.fillColor, 1);
        graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, settings.cornerRadius);

        // Desenhar borda
        graphics.lineStyle(settings.strokeWidth, settings.strokeColor, 1);
        graphics.strokeRoundedRect(x - width / 2, y - height / 2, width, height, settings.cornerRadius);

        // Adicionar detalhes angulares
        graphics.lineStyle(Math.max(1, settings.strokeWidth - 1), settings.strokeColor, 0.7);
        graphics.beginPath();
        graphics.moveTo(x - width / 2, y - height / 4);
        graphics.lineTo(x - width / 2 + 10, y - height / 4);
        graphics.moveTo(x - width / 2, y + height / 4);
        graphics.lineTo(x - width / 2 + 10, y + height / 4);
        graphics.moveTo(x + width / 2, y - height / 4);
        graphics.lineTo(x + width / 2 - 10, y - height / 4);
        graphics.moveTo(x + width / 2, y + height / 4);
        graphics.lineTo(x + width / 2 - 10, y + height / 4);
        graphics.strokePath();

        // Adicionar brilho no topo se solicitado
        if (settings.glowEffect) {
          graphics.fillStyle(0xffffff, 0.3);
          graphics.fillRoundedRect(x - width / 2 + 5, y - height / 2 + 5, width - 10, height / 4, {
            tl: settings.cornerRadius - 2,
            tr: settings.cornerRadius - 2,
            bl: 0,
            br: 0,
          });
        }
      };
    }

    // Função para desenhar painel cyberpunk
    if (!window.drawCyberPanel) {
      window.drawCyberPanel = function (graphics, x, y, width, height, options = {}) {
        // Opções padrão
        const defaults = {
          fillColor: 0x0a1a2f,
          strokeColor: 0x0d84ff,
          cornerRadius: 15,
          alpha: 0.9,
          header: false,
          headerHeight: 40,
          headerColor: 0x0d84ff,
          topLight: false,
          topLightColor: 0x39f5e2,
          shadow: false,
        };

        // Mesclar opções
        const settings = { ...defaults, ...options };

        // Desenhar sombra se solicitado
        if (settings.shadow) {
          graphics.fillStyle(0x000000, 0.5);
          graphics.fillRoundedRect(x - width / 2 + 5, y - height / 2 + 5, width, height, settings.cornerRadius);
        }

        // Desenhar fundo
        graphics.fillStyle(settings.fillColor, settings.alpha);
        graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, settings.cornerRadius);

        // Desenhar borda
        graphics.lineStyle(3, settings.strokeColor, settings.alpha);
        graphics.strokeRoundedRect(x - width / 2, y - height / 2, width, height, settings.cornerRadius);

        // Adicionar detalhes angulares
        graphics.lineStyle(2, settings.topLightColor || settings.strokeColor, settings.alpha * 0.7);
        graphics.beginPath();
        graphics.moveTo(x - width / 2, y - height / 2 + 30);
        graphics.lineTo(x - width / 2 + 20, y - height / 2 + 30);
        graphics.moveTo(x - width / 2, y - height / 2 + 60);
        graphics.lineTo(x - width / 2 + 20, y - height / 2 + 60);
        graphics.moveTo(x + width / 2, y - height / 2 + 30);
        graphics.lineTo(x + width / 2 - 20, y - height / 2 + 30);
        graphics.moveTo(x + width / 2, y - height / 2 + 60);
        graphics.lineTo(x + width / 2 - 20, y - height / 2 + 60);
        graphics.strokePath();

        // Detalhes inferiores
        graphics.beginPath();
        graphics.moveTo(x - width / 2, y + height / 2 - 30);
        graphics.lineTo(x - width / 2 + 20, y + height / 2 - 30);
        graphics.moveTo(x - width / 2, y + height / 2 - 60);
        graphics.lineTo(x - width / 2 + 20, y + height / 2 - 60);
        graphics.moveTo(x + width / 2, y + height / 2 - 30);
        graphics.lineTo(x + width / 2 - 20, y + height / 2 - 30);
        graphics.moveTo(x + width / 2, y + height / 2 - 60);
        graphics.lineTo(x + width / 2 - 20, y + height / 2 - 60);
        graphics.strokePath();

        // Adicionar cabeçalho se solicitado
        if (settings.header) {
          // Fundo do cabeçalho
          graphics.fillStyle(settings.headerColor, settings.alpha);

          // Cabeçalho com cantos arredondados apenas no topo
          const headerRadius = {
            tl: settings.cornerRadius,
            tr: settings.cornerRadius,
            bl: 0,
            br: 0,
          };

          graphics.fillRoundedRect(x - width / 2, y - height / 2, width, settings.headerHeight, headerRadius);
        }

        // Adicionar brilho no topo se solicitado
        if (settings.topLight) {
          graphics.fillStyle(settings.topLightColor || 0xffffff, 0.2);
          graphics.fillRect(x - width / 2 + settings.cornerRadius, y - height / 2 + 3, width - settings.cornerRadius * 2, 2);
        }
      };
    }

    // Função para desenhar barra de progresso
    if (!window.drawProgressBar) {
      window.drawProgressBar = function (graphics, x, y, width, height, value, options = {}) {
        // Opções padrão
        const defaults = {
          bgColor: 0x333333,
          fillColor: 0x0d84ff,
          gradientColor: 0x39f5e2,
          borderColor: 0x444444,
          cornerRadius: 5,
          borderWidth: 2,
          gradient: true,
        };

        // Mesclar opções
        const settings = { ...defaults, ...options };

        // Desenhar fundo
        if (settings.bgColor !== 0x000000) {
          graphics.fillStyle(settings.bgColor, 1);
          graphics.fillRoundedRect(x, y, width, height, settings.cornerRadius);
        }

        // Calcular largura do preenchimento
        const fillWidth = width * value;

        if (fillWidth > 0) {
          // Desenhar preenchimento com ou sem gradiente
          if (settings.gradient && settings.gradientColor) {
            // Criar gradiente
            const gradient = graphics.createLinearGradient(x, 0, x + fillWidth, 0);
            gradient.addColorStop(0, settings.fillColor);
            gradient.addColorStop(1, settings.gradientColor);

            graphics.fillStyle(gradient);
          } else {
            graphics.fillStyle(settings.fillColor, 1);
          }

          // Desenhar preenchimento com cantos arredondados
          if (fillWidth >= width) {
            // Se preenchimento completo, usar cantos arredondados completos
            graphics.fillRoundedRect(x, y, fillWidth, height, settings.cornerRadius);
          } else {
            // Se preenchimento parcial, usar cantos arredondados apenas à esquerda
            graphics.fillRoundedRect(x, y, fillWidth, height, {
              tl: settings.cornerRadius,
              bl: settings.cornerRadius,
              tr: 0,
              br: 0,
            });
          }
        }

        // Desenhar borda
        if (settings.borderColor !== null) {
          graphics.lineStyle(settings.borderWidth, settings.borderColor, 1);
          graphics.strokeRoundedRect(x, y, width, height, settings.cornerRadius);
        }
      };
    }

    // Função para desenhar scanlines (efeito visual)
    if (!window.drawScanlines) {
      window.drawScanlines = function (graphics, x, y, width, height, options = {}) {
        // Opções padrão
        const defaults = {
          color: 0xffffff,
          alpha: 0.1,
          spacing: 4,
          speed: 0,
        };

        // Mesclar opções
        const settings = { ...defaults, ...options };

        // Desenhar linhas horizontais
        graphics.lineStyle(1, settings.color, settings.alpha);

        for (let py = 0; py < height; py += settings.spacing) {
          graphics.beginPath();
          graphics.moveTo(x, y + py);
          graphics.lineTo(x + width, y + py);
          graphics.strokePath();
        }
      };
    }
  };

  /**
   * Verifica se o mapa Tiled foi carregado corretamente
   */
  const checkMapLoading = function (scene) {
    // Verificar se o mapa existe
    if (!scene.map) {
      console.warn("⚠️ Mapa não carregado corretamente!");

      // Tentar carregar novamente
      try {
        scene.map = scene.make.tilemap({ key: "jardim-map" });

        if (scene.map) {
          console.log("✅ Mapa recarregado com sucesso!");
        } else {
          throw new Error("Falha ao recarregar mapa");
        }
      } catch (e) {
        console.error("❌ Falha permanente no carregamento do mapa:", e);
        // Criar mapa fallback
        scene.createEnhancedFallbackMap();
      }
    }
  };

  /**
   * Redimensiona o mapa para ocupar mais espaço
   */
  const enhanceMapScale = function (scene) {
    // Aumentar escala do mapa se ele for pequeno demais
    if (scene.map && scene.map.widthInPixels < scene.cameras.main.width * 1.5) {
      try {
        // Aumentar escala para cada camada
        Object.keys(scene.layers).forEach((key) => {
          if (scene.layers[key] && scene.layers[key].setScale) {
            scene.layers[key].setScale(1.5, 1.5);
            console.log(`↕️ Escala da camada ${key} aumentada para 1.5x`);
          }
        });

        // Ajustar os limites do mundo físico
        const newWidth = scene.map.widthInPixels * 1.5;
        const newHeight = scene.map.heightInPixels * 1.5;
        scene.physics.world.setBounds(0, 0, newWidth, newHeight);

        console.log(`📐 Limites do mundo físico ajustados para ${newWidth}x${newHeight}`);
      } catch (e) {
        console.warn("⚠️ Não foi possível redimensionar o mapa:", e);
      }
    }
  };

  /**
   * Ajusta a câmera para uma melhor visualização
   */
  const enhanceCamera = function (scene) {
    // Verificar se a câmera e o jogador estão definidos
    if (!scene.cameras.main || !scene.player || !scene.player.sprite) return;

    try {
      // Ajustar zoom para uma visão mais ampla
      scene.cameras.main.setZoom(0.8);

      // Suavizar movimento da câmera
      scene.cameras.main.setLerp(0.1, 0.1);

      // Adicionar efeito de fade in na entrada da cena
      scene.cameras.main.fadeIn(800, 0, 0, 0);

      console.log("📷 Câmera aprimorada aplicada");
    } catch (e) {
      console.warn("⚠️ Erro ao ajustar câmera:", e);
    }
  };

  /**
   * Verifica e corrige elementos essenciais que podem estar faltando
   */
  const ensureEssentialElements = function (scene) {
    // Verificar se as cores estão definidas
    if (!scene.colors) {
      scene.colors = window.uiColors || {
        primary: 0x0d84ff,
        secondary: 0x39f5e2,
        accent: 0xff3a3a,
        positive: 0x4caf50,
        warning: 0xffc107,
        dark: 0x0a1a2f,
        light: 0xffffff,
      };
    }

    // Verificar se a fonte está definida
    if (!scene.fontFamily) {
      scene.fontFamily = window.defaultFont || "'Chakra Petch', sans-serif";
    }

    // Verificar se o container de UI existe
    if (!scene.uiContainer) {
      scene.uiContainer = scene.add.container(0, 0);
      scene.uiContainer.setDepth(100);
      scene.uiContainer.setScrollFactor(0);
    }

    // Verificar se o sistema de diálogo existe
    if (!scene.dialog) {
      scene.dialog = {
        active: false,
        currentLine: 0,
        lines: [],
        speaker: null,
        typing: false,
        typingSpeed: 30,
        callback: null,
        typewriterEffect: null,
      };
    }
  };

  /**
   * Melhora a interação entre jogador e objetos
   */
  const enhanceInteractions = function (scene) {
    // Verificar se o jogador e os objetos interativos existem
    if (!scene.player || !scene.interactPoints) return;

    try {
      // Aumentar o raio de interação para melhor experiência
      if (scene.player.interactionRadius < 100) {
        scene.player.interactionRadius = 100;
        console.log("👌 Raio de interação aumentado para 100");
      }

      // Verificar se todos os pontos interativos têm mensagem
      scene.interactPoints.forEach((point) => {
        if (!point.properties) {
          point.properties = [];
        }

        // Adicionar mensagem padrão se não existir
        if (!point.properties.find((p) => p.name === "message")) {
          point.properties.push({
            name: "message",
            value: `Um objeto interessante no jardim da escola: ${point.name || "objeto"}`,
          });
        }
      });
    } catch (e) {
      console.warn("⚠️ Erro ao aprimorar interações:", e);
    }
  };

  /**
   * Integra todas as melhorias nos hooks principais do Phaser
   */
  const integrateAllImprovements = function () {
    // Salvar a referência original do método create
    const originalCreate = jardimMission.prototype.create;

    // Sobrescrever o método create para aplicar nossas melhorias
    jardimMission.prototype.create = function (data) {
      // Primeiro configurar fontes e cores globais
      configureFonts();
      configureColors();
      addDrawingUtilities();

      // Chamar o método original para criar a cena base
      originalCreate.call(this, data);

      // Aplicar nossas melhorias após a criação da cena
      checkMapLoading(this);
      enhanceMapScale(this);
      enhanceCamera(this);
      ensureEssentialElements(this);
      enhanceInteractions(this);

      // Salvar automaticamente o progresso a cada 5 minutos
      this.time.addEvent({
        delay: 300000, // 5 minutos
        callback: () => {
          this.saveProgress();
        },
        callbackScope: this,
        loop: true,
      });

      console.log("✨ Todas as melhorias integradas com sucesso!");
    };

    // Salvar a referência original do método update
    const originalUpdate = jardimMission.prototype.update;

    // Sobrescrever o método update para melhorar a performance
    jardimMission.prototype.update = function (time, delta) {
      // Chamar o método original
      originalUpdate.call(this, time, delta);

      // Verificar e atualizar elementos do minimapa, se existirem
      this.updateMinimapElements();
    };

    // Adicionar novo método para atualizar elementos do minimapa
    jardimMission.prototype.updateMinimapElements = function () {
      // Atualizar indicador do jogador no minimapa
      if (this.minimapPlayerIndicator && this.player && this.player.sprite) {
        // O minimapPlayerIndicator pode ser atualizado aqui se necessário,
        // mas geralmente a câmera do minimapa já segue o jogador automaticamente

        // Podemos atualizar a rotação com base na direção
        let angle = 0;

        switch (this.player.direction) {
          case "up":
            angle = 0;
            break;
          case "right":
            angle = 90;
            break;
          case "down":
            angle = 180;
            break;
          case "left":
            angle = 270;
            break;
        }

        if (this.minimapPlayerIndicator.setRotation) {
          this.minimapPlayerIndicator.setRotation(Phaser.Math.DegToRad(angle));
        }
      }

      // Atualizar indicador do professor no minimapa
      if (this.minimapProfessorIndicator && this.professor && this.professor.sprite) {
        this.minimapProfessorIndicator.setPosition(this.professor.sprite.x, this.professor.sprite.y);
      }
    };
  };

  // Integrar todas as melhorias
  integrateAllImprovements();

  console.log("🔄 Módulo de integração de melhorias carregado com sucesso!");
})();
