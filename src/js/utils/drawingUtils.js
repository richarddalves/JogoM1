/**
 * Biblioteca de funções auxiliares para desenho de elementos visuais
 * @module DrawingUtils
 * @description Contém funções para criar formas e efeitos visuais no jogo
 */

/**
 * Desenha um retângulo com cantos arredondados
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {number} x - Posição X do retângulo
 * @param {number} y - Posição Y do retângulo
 * @param {number} width - Largura do retângulo
 * @param {number} height - Altura do retângulo
 * @param {number|Object} radius - Raio dos cantos ou objeto com raios específicos para cada canto
 * @param {number} fillColor - Cor de preenchimento
 * @param {number|null} strokeColor - Cor da borda (null para sem borda)
 * @param {number} strokeWidth - Largura da borda
 * @param {number} alpha - Transparência (0-1)
 */
function drawRoundedRect(graphics, x, y, width, height, radius, fillColor, strokeColor = null, strokeWidth = 0, alpha = 1) {
  // Validação de parâmetros
  if (!graphics || !graphics.fillStyle) {
    console.error("❌ Objeto graphics inválido fornecido para drawRoundedRect");
    return;
  }

  if (width <= 0 || height <= 0) {
    console.warn("⚠️ Tentativa de desenhar retângulo com dimensões inválidas:", width, height);
    return;
  }

  // Processar configuração de raio para cada canto
  let radiusTL, radiusTR, radiusBL, radiusBR;

  if (typeof radius === "object") {
    radiusTL = radius.tl || 0;
    radiusTR = radius.tr || 0;
    radiusBL = radius.bl || 0;
    radiusBR = radius.br || 0;
  } else {
    radiusTL = radiusTR = radiusBL = radiusBR = radius || 0;
  }

  // Limitar raios para evitar problemas visuais
  const maxRadius = Math.min(width / 2, height / 2);
  radiusTL = Math.min(radiusTL, maxRadius);
  radiusTR = Math.min(radiusTR, maxRadius);
  radiusBL = Math.min(radiusBL, maxRadius);
  radiusBR = Math.min(radiusBR, maxRadius);

  try {
    // Definir estilo de preenchimento
    graphics.fillStyle(fillColor, alpha);

    // Definir estilo de contorno, se necessário
    if (strokeColor !== null) {
      graphics.lineStyle(strokeWidth, strokeColor, alpha);
    }

    // Iniciar caminho
    graphics.beginPath();

    // Canto superior esquerdo
    graphics.moveTo(x + radiusTL, y);

    // Lado superior
    graphics.lineTo(x + width - radiusTR, y);

    // Canto superior direito
    if (radiusTR > 0) {
      graphics.arc(x + width - radiusTR, y + radiusTR, radiusTR, -Math.PI / 2, 0);
    } else {
      graphics.lineTo(x + width, y);
    }

    // Lado direito
    graphics.lineTo(x + width, y + height - radiusBR);

    // Canto inferior direito
    if (radiusBR > 0) {
      graphics.arc(x + width - radiusBR, y + height - radiusBR, radiusBR, 0, Math.PI / 2);
    } else {
      graphics.lineTo(x + width, y + height);
    }

    // Lado inferior
    graphics.lineTo(x + radiusBL, y + height);

    // Canto inferior esquerdo
    if (radiusBL > 0) {
      graphics.arc(x + radiusBL, y + height - radiusBL, radiusBL, Math.PI / 2, Math.PI);
    } else {
      graphics.lineTo(x, y + height);
    }

    // Lado esquerdo
    graphics.lineTo(x, y + radiusTL);

    // Canto superior esquerdo
    if (radiusTL > 0) {
      graphics.arc(x + radiusTL, y + radiusTL, radiusTL, Math.PI, -Math.PI / 2);
    } else {
      graphics.lineTo(x, y);
    }

    // Fechar caminho
    graphics.closePath();

    // Desenhar preenchimento
    graphics.fillPath();

    // Desenhar contorno, se necessário
    if (strokeColor !== null) {
      graphics.strokePath();
    }
  } catch (error) {
    console.error("❌ Erro ao desenhar retângulo arredondado:", error);
  }
}

/**
 * Desenha um botão com estilo futurista/cibernético
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {number} x - Posição X do botão
 * @param {number} y - Posição Y do botão
 * @param {number} width - Largura do botão
 * @param {number} height - Altura do botão
 * @param {Object} options - Opções de estilo do botão
 * @param {number} options.fillColor - Cor de preenchimento
 * @param {number} options.strokeColor - Cor da borda
 * @param {number} options.strokeWidth - Largura da borda
 * @param {number} options.cornerRadius - Raio dos cantos
 * @param {number} options.alpha - Transparência
 * @param {boolean} options.glowEffect - Se deve adicionar efeito de brilho
 * @param {number} options.glowColor - Cor do efeito de brilho
 * @param {boolean} options.gradientFill - Se deve usar preenchimento em gradiente
 * @param {number} options.gradientColor - Cor secundária para o gradiente
 */
function drawCyberButton(graphics, x, y, width, height, options = {}) {
  // Configurações padrão
  const defaults = {
    fillColor: 0x0d84ff,
    strokeColor: 0x39f5e2,
    strokeWidth: 2,
    cornerRadius: 8,
    alpha: 1,
    glowEffect: true,
    glowColor: 0x39f5e2,
    gradientFill: true,
    gradientColor: 0x2165c5,
  };

  // Mesclar com opções fornecidas
  const config = { ...defaults, ...options };

  try {
    // Se tem efeito de brilho, desenhar primeiro
    if (config.glowEffect) {
      graphics.fillStyle(config.glowColor, 0.3);
      drawRoundedRect(graphics, x - width / 2 - 5, y - height / 2 - 5, width + 10, height + 10, config.cornerRadius + 3, config.glowColor, null, 0, 0.3);
    }

    // Desenhar o botão principal
    if (config.gradientFill) {
      // Criar um gradiente para preenchimento
      const fillColorTop = config.fillColor;
      const fillColorBottom = config.gradientColor;

      const grd = graphics.createLinearGradient(x - width / 2, y - height / 2, x - width / 2, y + height / 2);

      grd.addColorStop(0, fillColorTop);
      grd.addColorStop(1, fillColorBottom);

      // Preencher com gradiente
      graphics.fillStyle(0xffffff, config.alpha);
      graphics.fillGradientStyle(fillColorTop, fillColorTop, fillColorBottom, fillColorBottom, config.alpha, config.alpha, config.alpha, config.alpha);
    } else {
      // Preencher com cor sólida
      graphics.fillStyle(config.fillColor, config.alpha);
    }

    // Contorno
    graphics.lineStyle(config.strokeWidth, config.strokeColor, config.alpha);

    // Desenhar forma principal
    drawRoundedRect(graphics, x - width / 2, y - height / 2, width, height, config.cornerRadius, config.fillColor, config.strokeColor, config.strokeWidth, config.alpha);

    // Adicionar efeito de destaque no topo
    graphics.fillStyle(0xffffff, 0.2);
    drawRoundedRect(graphics, x - width / 2 + 3, y - height / 2 + 3, width - 6, height / 3, { tl: config.cornerRadius - 1, tr: config.cornerRadius - 1, bl: 0, br: 0 }, 0xffffff, null, 0, 0.2);
  } catch (error) {
    console.error("❌ Erro ao desenhar botão cibernético:", error);
  }
}

/**
 * Desenha um painel/card com estilo futurista
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {number} x - Posição X do painel
 * @param {number} y - Posição Y do painel
 * @param {number} width - Largura do painel
 * @param {number} height - Altura do painel
 * @param {Object} options - Opções de estilo do painel
 * @param {number} options.fillColor - Cor de preenchimento
 * @param {number} options.strokeColor - Cor da borda
 * @param {number} options.cornerRadius - Raio dos cantos
 * @param {number} options.alpha - Transparência
 * @param {boolean} options.header - Se deve adicionar cabeçalho
 * @param {number} options.headerHeight - Altura do cabeçalho
 * @param {number} options.headerColor - Cor do cabeçalho
 * @param {boolean} options.topLight - Se deve adicionar luz no topo
 * @param {number} options.topLightColor - Cor da luz no topo
 * @param {boolean} options.shadow - Se deve adicionar sombra
 */
function drawCyberPanel(graphics, x, y, width, height, options = {}) {
  // Configurações padrão
  const defaults = {
    fillColor: 0x111927,
    strokeColor: 0x39f5e2,
    strokeWidth: 2,
    cornerRadius: 10,
    alpha: 0.9,
    header: false,
    headerHeight: 40,
    headerColor: 0x0d84ff,
    topLight: true,
    topLightColor: 0x39f5e2,
    shadow: true,
  };

  // Mesclar com opções fornecidas
  const config = { ...defaults, ...options };

  try {
    // Desenhar sombra
    if (config.shadow) {
      drawRoundedRect(graphics, x - width / 2 + 8, y - height / 2 + 8, width, height, config.cornerRadius, 0x000000, null, 0, 0.5);
    }

    // Desenhar painel principal
    drawRoundedRect(graphics, x - width / 2, y - height / 2, width, height, config.cornerRadius, config.fillColor, config.strokeColor, config.strokeWidth, config.alpha);

    // Adicionar cabeçalho se configurado
    if (config.header) {
      const headerRadius = {
        tl: config.cornerRadius,
        tr: config.cornerRadius,
        bl: 0,
        br: 0,
      };

      drawRoundedRect(graphics, x - width / 2, y - height / 2, width, config.headerHeight, headerRadius, config.headerColor, null, 0, config.alpha);
    }

    // Adicionar luz no topo se configurado
    if (config.topLight) {
      graphics.fillStyle(config.topLightColor, 0.5);
      graphics.fillRect(x - width / 3, y - height / 2 - 2, width / 1.5, 4);

      // Adicionar brilho
      graphics.fillStyle(config.topLightColor, 0.2);
      graphics.fillRect(x - width / 2.5, y - height / 2 - 4, width / 1.25, 8);
    }
  } catch (error) {
    console.error("❌ Erro ao desenhar painel cibernético:", error);
  }
}

/**
 * Desenha um círculo com efeito de brilho
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {number} x - Posição X do círculo
 * @param {number} y - Posição Y do círculo
 * @param {number} radius - Raio do círculo
 * @param {Object} options - Opções de estilo do círculo
 * @param {number} options.fillColor - Cor de preenchimento
 * @param {number} options.strokeColor - Cor da borda
 * @param {number} options.strokeWidth - Largura da borda
 * @param {number} options.alpha - Transparência
 * @param {boolean} options.glow - Se deve adicionar efeito de brilho
 * @param {number} options.glowColor - Cor do efeito de brilho
 * @param {number} options.glowStrength - Intensidade do brilho (0-1)
 * @param {number} options.glowRadius - Raio do efeito de brilho
 */
function drawGlowCircle(graphics, x, y, radius, options = {}) {
  // Configurações padrão
  const defaults = {
    fillColor: 0x0d84ff,
    strokeColor: 0x39f5e2,
    strokeWidth: 2,
    alpha: 1,
    glow: true,
    glowColor: 0x39f5e2,
    glowStrength: 0.4,
    glowRadius: 1.5,
  };

  // Mesclar com opções fornecidas
  const config = { ...defaults, ...options };

  try {
    // Desenhar efeito de brilho
    if (config.glow) {
      // Camadas de brilho com opacidade decrescente
      for (let i = radius * config.glowRadius; i > radius; i -= 3) {
        const opacity = config.glowStrength * (1 - (i - radius) / (radius * config.glowRadius));
        graphics.fillStyle(config.glowColor, opacity);
        graphics.fillCircle(x, y, i);
      }
    }

    // Desenhar círculo principal
    graphics.fillStyle(config.fillColor, config.alpha);
    graphics.fillCircle(x, y, radius);

    // Adicionar contorno
    if (config.strokeWidth > 0) {
      graphics.lineStyle(config.strokeWidth, config.strokeColor, config.alpha);
      graphics.strokeCircle(x, y, radius);
    }

    // Adicionar reflexo (efeito de destaque superior)
    graphics.fillStyle(0xffffff, 0.3);
    graphics.fillEllipse(x - radius * 0.2, y - radius * 0.2, radius * 0.7, radius * 0.4);
  } catch (error) {
    console.error("❌ Erro ao desenhar círculo com brilho:", error);
  }
}

/**
 * Desenha uma barra de progresso estilizada
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {number} x - Posição X da barra
 * @param {number} y - Posição Y da barra
 * @param {number} width - Largura da barra
 * @param {number} height - Altura da barra
 * @param {number} progress - Progresso da barra (0-1)
 * @param {Object} options - Opções de estilo da barra
 * @param {number} options.bgColor - Cor de fundo
 * @param {number} options.fillColor - Cor de preenchimento
 * @param {number} options.borderColor - Cor da borda
 * @param {number} options.cornerRadius - Raio dos cantos
 * @param {boolean} options.gradient - Se deve usar gradiente para o preenchimento
 * @param {number} options.gradientColor - Cor secundária para o gradiente
 */
function drawProgressBar(graphics, x, y, width, height, progress, options = {}) {
  // Validar progresso
  progress = Math.max(0, Math.min(1, progress));

  // Configurações padrão
  const defaults = {
    bgColor: 0x333333,
    fillColor: 0x0d84ff,
    borderColor: 0x39f5e2,
    cornerRadius: 5,
    gradient: true,
    gradientColor: 0x39f5e2,
  };

  // Mesclar com opções fornecidas
  const config = { ...defaults, ...options };

  try {
    // Desenhar fundo da barra
    drawRoundedRect(graphics, x, y, width, height, config.cornerRadius, config.bgColor, config.borderColor, 2, 0.8);

    // Calcular largura do preenchimento
    const fillWidth = width * progress;

    if (fillWidth > 0) {
      // Definir estilo de preenchimento
      if (config.gradient) {
        graphics.fillGradientStyle(config.fillColor, config.fillColor, config.gradientColor, config.gradientColor, 1, 1, 1, 1);
      } else {
        graphics.fillStyle(config.fillColor, 1);
      }

      // Desenhar preenchimento
      // Usar cantos arredondados com base na completude
      const fillRadius = {
        tl: config.cornerRadius,
        tr: progress >= 0.99 ? config.cornerRadius : 0,
        bl: config.cornerRadius,
        br: progress >= 0.99 ? config.cornerRadius : 0,
      };

      drawRoundedRect(graphics, x, y, fillWidth, height, fillRadius, config.fillColor);

      // Adicionar efeito de brilho
      graphics.fillStyle(0xffffff, 0.3);
      graphics.fillRect(x, y + height * 0.15, fillWidth, height * 0.25);
    }
  } catch (error) {
    console.error("❌ Erro ao desenhar barra de progresso:", error);
  }
}

/**
 * Desenha uma linha com efeito de brilho
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {number} x1 - X inicial
 * @param {number} y1 - Y inicial
 * @param {number} x2 - X final
 * @param {number} y2 - Y final
 * @param {Object} options - Opções de estilo da linha
 * @param {number} options.color - Cor da linha
 * @param {number} options.width - Largura da linha
 * @param {boolean} options.glow - Se deve adicionar efeito de brilho
 * @param {number} options.glowColor - Cor do efeito de brilho
 * @param {number} options.glowStrength - Intensidade do brilho (0-1)
 * @param {boolean} options.dashed - Se a linha deve ser tracejada
 */
function drawGlowLine(graphics, x1, y1, x2, y2, options = {}) {
  // Configurações padrão
  const defaults = {
    color: 0x39f5e2,
    width: 2,
    alpha: 1,
    glow: true,
    glowColor: 0x39f5e2,
    glowStrength: 0.5,
    dashed: false,
  };

  // Mesclar com opções fornecidas
  const config = { ...defaults, ...options };

  try {
    // Desenhar efeito de brilho
    if (config.glow) {
      // Linha externa para brilho
      graphics.lineStyle(config.width + 4, config.glowColor, config.glowStrength * 0.3);
      graphics.beginPath();
      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);
      graphics.strokePath();

      // Linha intermediária para brilho
      graphics.lineStyle(config.width + 2, config.glowColor, config.glowStrength * 0.6);
      graphics.beginPath();
      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);
      graphics.strokePath();
    }

    // Definir estilo de linha principal
    graphics.lineStyle(config.width, config.color, config.alpha);

    // Desenhar linha principal
    if (config.dashed) {
      // Calcular o comprimento da linha para dimensionar os tracejados
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Determinar o número de segmentos com base no comprimento
      const numSegments = Math.ceil(distance / 15); // Um segmento a cada ~15px

      if (numSegments > 1) {
        // Calcular incrementos para cada segmento
        const segmentLength = distance / numSegments;
        const dashLength = segmentLength * 0.6; // Comprimento do traço (60% do segmento)

        const incrementX = dx / distance;
        const incrementY = dy / distance;

        // Desenhar segmentos tracejados
        for (let i = 0; i < numSegments; i += 2) {
          const startX = x1 + i * segmentLength * incrementX;
          const startY = y1 + i * segmentLength * incrementY;

          const endX = startX + dashLength * incrementX;
          const endY = startY + dashLength * incrementY;

          // Limitar ao fim da linha
          const finalEndX = Math.abs(endX - x1) > Math.abs(dx) ? x2 : endX;
          const finalEndY = Math.abs(endY - y1) > Math.abs(dy) ? y2 : endY;

          graphics.beginPath();
          graphics.moveTo(startX, startY);
          graphics.lineTo(finalEndX, finalEndY);
          graphics.strokePath();
        }
      } else {
        // Linha muito curta, desenhar contínua
        graphics.beginPath();
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.strokePath();
      }
    } else {
      // Linha contínua
      graphics.beginPath();
      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);
      graphics.strokePath();
    }
  } catch (error) {
    console.error("❌ Erro ao desenhar linha com brilho:", error);
  }
}

/**
 * Desenha um polígono baseado em pontos
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {Array} points - Array de pontos no formato [{x, y}, ...]
 * @param {Object} options - Opções de estilo do polígono
 * @param {number} options.fillColor - Cor de preenchimento
 * @param {number} options.strokeColor - Cor da borda
 * @param {number} options.strokeWidth - Largura da borda
 * @param {number} options.alpha - Transparência
 * @param {boolean} options.close - Se deve fechar o polígono
 */
function drawPolygon(graphics, points, options = {}) {
  // Validar pontos
  if (!Array.isArray(points) || points.length < 2) {
    console.error("❌ Pontos inválidos para desenhar polígono");
    return;
  }

  // Configurações padrão
  const defaults = {
    fillColor: 0x0d84ff,
    strokeColor: 0x39f5e2,
    strokeWidth: 2,
    alpha: 0.5,
    close: true,
  };

  // Mesclar com opções fornecidas
  const config = { ...defaults, ...options };

  try {
    // Definir estilos
    graphics.fillStyle(config.fillColor, config.alpha);
    graphics.lineStyle(config.strokeWidth, config.strokeColor, config.alpha);

    // Iniciar caminho
    graphics.beginPath();

    // Mover para o primeiro ponto
    graphics.moveTo(points[0].x, points[0].y);

    // Desenhar linhas para cada ponto
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }

    // Fechar o polígono se necessário
    if (config.close) {
      graphics.closePath();
    }

    // Preencher
    graphics.fillPath();

    // Contorno
    graphics.strokePath();
  } catch (error) {
    console.error("❌ Erro ao desenhar polígono:", error);
  }
}

/**
 * Desenha efeito de scanline (linhas horizontais) para visual cyberpunk
 * @param {Phaser.GameObjects.Graphics} graphics - Objeto gráfico para desenhar
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {number} width - Largura
 * @param {number} height - Altura
 * @param {Object} options - Opções de estilo
 * @param {number} options.color - Cor das linhas
 * @param {number} options.alpha - Transparência
 * @param {number} options.gap - Espaçamento entre linhas
 */
function drawScanlines(graphics, x, y, width, height, options = {}) {
  // Configurações padrão
  const defaults = {
    color: 0x39f5e2,
    alpha: 0.2,
    gap: 4,
  };

  // Mesclar com opções fornecidas
  const config = { ...defaults, ...options };

  try {
    graphics.fillStyle(config.color, config.alpha);

    for (let lineY = y; lineY < y + height; lineY += config.gap) {
      graphics.fillRect(x, lineY, width, 1);
    }
  } catch (error) {
    console.error("❌ Erro ao desenhar efeito scanline:", error);
  }
}

// Tornar as funções disponíveis globalmente
window.drawRoundedRect = drawRoundedRect;
window.drawCyberButton = drawCyberButton;
window.drawCyberPanel = drawCyberPanel;
window.drawGlowCircle = drawGlowCircle;
window.drawProgressBar = drawProgressBar;
window.drawGlowLine = drawGlowLine;
window.drawPolygon = drawPolygon;
window.drawScanlines = drawScanlines;

// Também exportar como módulo
const DrawingUtils = {
  drawRoundedRect,
  drawCyberButton,
  drawCyberPanel,
  drawGlowCircle,
  drawProgressBar,
  drawGlowLine,
  drawPolygon,
  drawScanlines,
};

// Registro para debugging
console.log("🎨 DrawingUtils carregado com sucesso!");
