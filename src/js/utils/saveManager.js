/**
 * Sistema de salvamento e gerenciamento de dados do jogador
 * @class SaveManager
 * @description Gerencia o progresso, pontuações, níveis e outras informações do jogador
 */
class SaveManager {
  /**
   * Cria uma instância do SaveManager
   * @constructor
   */
  constructor() {
    // Chave para armazenamento local
    this.saveKey = "dpoHeroSave";

    // Versão do formato de dados (para compatibilidade futura)
    this.dataVersion = "1.0.0";

    // Data padrão para inicialização
    this.defaultData = {
      // Informações do jogador
      playerName: "Agente",
      points: 0,
      level: "Novato",
      badges: [],
      completedMissions: [],
      selectedRole: null,
      lastPlayed: null,

      // Configurações
      settings: {
        soundVolume: 0.7,
        musicVolume: 0.5,
        fullscreen: false,
        difficulty: "normal",
        language: "pt-BR",
        accessibility: {
          highContrast: false,
          largeText: false,
          reduceMotion: false,
        },
      },

      // Valores calculados (serão definidos após carregamento)
      maxPoints: 0,
      progress: 0,
      rank: 0,

      // Metadados
      dataVersion: this.dataVersion,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };

    // Dados carregados (ou inicializados)
    this.data = { ...this.defaultData };

    // Define os níveis, pontos necessários e ícones
    this.levelThresholds = [
      { name: "Novato", points: 0, icon: "badge_novice", description: "Iniciando a jornada na proteção de dados" },
      { name: "Agente Júnior", points: 100, icon: "badge_junior", description: "Primeiros passos na aplicação da LGPD" },
      { name: "Agente Pleno", points: 300, icon: "badge_agent", description: "Conhecimento sólido dos princípios de proteção" },
      { name: "Agente Sênior", points: 600, icon: "badge_senior", description: "Especialista em identificar e resolver violações" },
      { name: "Especialista", points: 1000, icon: "badge_expert", description: "Autoridade em proteção de dados pessoais" },
      { name: "Diretor de Proteção", points: 1500, icon: "badge_director", description: "Líder na implementação de políticas de proteção" },
    ];

    // Inicializar o sistema
    this.initialize();
  }

  /**
   * Inicializa o SaveManager, carregando dados salvos se existirem
   * @private
   */
  initialize() {
    try {
      // Tentar carregar dados salvos
      const savedData = localStorage.getItem(this.saveKey);

      if (savedData) {
        // Tentar fazer o parse dos dados
        const parsedData = JSON.parse(savedData);

        // Verificar a versão dos dados para compatibilidade
        if (parsedData.dataVersion && this.isCompatibleVersion(parsedData.dataVersion)) {
          // Mesclar dados salvos com defaults (para garantir que novos campos estejam presentes)
          this.data = this.mergeDataWithDefaults(parsedData);
          console.log("📁 Dados carregados com sucesso!");
        } else {
          // Dados de versão incompatível - migrar ou reiniciar
          console.warn("⚠️ Versão de dados incompatível, iniciando nova sessão.");
          this.data = { ...this.defaultData };
          this.data.created = new Date().toISOString();
        }
      } else {
        console.log("📁 Nenhum save encontrado, iniciando nova sessão.");
      }

      // Sempre atualizar o timestamp de modificação
      this.data.modified = new Date().toISOString();

      // Atualizar nível com base nos pontos
      this.updateLevel();

      // Primeiro salvamento para garantir consistência
      this.save();
    } catch (error) {
      // Lidar com erros de carregamento
      console.error("❌ Erro ao inicializar SaveManager:", error);

      // Iniciar com dados padrão em caso de erro
      this.data = { ...this.defaultData };
      this.data.created = new Date().toISOString();
      this.data.modified = new Date().toISOString();

      // Tentar salvar os dados padrão
      try {
        this.save();
      } catch (saveError) {
        console.error("❌ Não foi possível salvar os dados padrão:", saveError);
      }
    }
  }

  /**
   * Verifica se a versão dos dados é compatível
   * @param {string} version - Versão dos dados carregados
   * @returns {boolean} - Se é compatível
   * @private
   */
  isCompatibleVersion(version) {
    // Implementação simples de verificação de versão
    // Na versão atual, consideramos compatível a mesma versão principal
    const currentMajor = this.dataVersion.split(".")[0];
    const loadedMajor = version.split(".")[0];

    return currentMajor === loadedMajor;
  }

  /**
   * Mescla dados carregados com os padrões para garantir campos completos
   * @param {Object} loadedData - Dados carregados do localStorage
   * @returns {Object} - Dados mesclados
   * @private
   */
  mergeDataWithDefaults(loadedData) {
    // Função recursiva para mesclar objetos aninhados
    const deepMerge = (target, source) => {
      const output = { ...target };

      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (source[key] !== null && typeof source[key] === "object" && !Array.isArray(source[key])) {
            // Para objetos aninhados, mesclar recursivamente
            if (target[key]) {
              output[key] = deepMerge(target[key], source[key]);
            } else {
              output[key] = { ...source[key] };
            }
          } else {
            // Para valores simples ou arrays, usar o valor carregado
            output[key] = source[key];
          }
        }
      }

      return output;
    };

    // Mesclar dados carregados com os padrões
    return deepMerge(this.defaultData, loadedData);
  }

  /**
   * Salva os dados atuais no localStorage
   * @returns {boolean} - Se o salvamento foi bem-sucedido
   * @public
   */
  save() {
    try {
      // Atualizar o timestamp de modificação
      this.data.modified = new Date().toISOString();

      // Serializar e salvar
      localStorage.setItem(this.saveKey, JSON.stringify(this.data));

      console.log("💾 Jogo salvo com sucesso!");
      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar jogo:", error);

      // Tentar notificar o usuário
      this.showSaveError();

      return false;
    }
  }

  /**
   * Mostra uma mensagem de erro de salvamento, se possível
   * @private
   */
  showSaveError() {
    try {
      // Verificar se o Phaser está disponível
      if (window.game && window.game.scene && window.game.scene.scenes) {
        // Encontrar a cena ativa
        const activeScene = window.game.scene.scenes.find((scene) => scene.scene.isActive());

        if (activeScene && activeScene.add) {
          // Usar UI nativa do Phaser para mostrar uma mensagem
          const width = activeScene.cameras.main.width;
          const height = activeScene.cameras.main.height;

          const errorBg = activeScene.add
            .graphics()
            .fillStyle(0xff0000, 0.7)
            .fillRect(width / 2 - 200, 20, 400, 40);

          const errorText = activeScene.add
            .text(width / 2, 40, "⚠️ Erro ao salvar progresso! Verifique o espaço de armazenamento.", {
              fontSize: "14px",
              fill: "#ffffff",
              align: "center",
            })
            .setOrigin(0.5);

          // Remover após alguns segundos
          activeScene.time.delayedCall(5000, () => {
            errorBg.destroy();
            errorText.destroy();
          });
        }
      }
    } catch (e) {
      // Não faz nada - já estamos em um handler de erro
    }
  }

  /**
   * Reseta todos os dados para os valores padrão
   * @returns {boolean} - Se a operação foi bem-sucedida
   * @public
   */
  reset() {
    try {
      // Remover dados salvos
      localStorage.removeItem(this.saveKey);

      // Restaurar para os valores padrão
      this.data = { ...this.defaultData };
      this.data.created = new Date().toISOString();
      this.data.modified = new Date().toISOString();

      // Atualizar nível
      this.updateLevel();

      // Salvar o estado inicial
      this.save();

      console.log("🔄 Dados do jogo resetados com sucesso!");
      return true;
    } catch (error) {
      console.error("❌ Erro ao resetar jogo:", error);
      return false;
    }
  }

  /**
   * Exporta os dados atuais como uma string JSON
   * @returns {string} - String JSON com os dados
   * @public
   */
  exportData() {
    try {
      return JSON.stringify(this.data);
    } catch (error) {
      console.error("❌ Erro ao exportar dados:", error);
      return null;
    }
  }

  /**
   * Importa dados a partir de uma string JSON
   * @param {string} jsonData - String JSON com os dados
   * @returns {boolean} - Se a importação foi bem-sucedida
   * @public
   */
  importData(jsonData) {
    try {
      // Fazer o parse dos dados
      const importedData = JSON.parse(jsonData);

      // Verificar se tem a estrutura mínima esperada
      if (!importedData || typeof importedData !== "object") {
        console.error("❌ Formato de dados inválido para importação");
        return false;
      }

      // Verificar compatibilidade de versão
      if (importedData.dataVersion && this.isCompatibleVersion(importedData.dataVersion)) {
        // Mesclar com os padrões para garantir campos completos
        this.data = this.mergeDataWithDefaults(importedData);

        // Atualizar nível
        this.updateLevel();

        // Salvar os dados importados
        this.save();

        console.log("📥 Dados importados com sucesso!");
        return true;
      } else {
        console.error("❌ Versão de dados incompatível para importação");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao importar dados:", error);
      return false;
    }
  }

  /**
   * Adiciona pontos ao jogador
   * @param {number} points - Quantidade de pontos a adicionar
   * @param {string} [source] - Fonte dos pontos (opcional, para tracking)
   * @returns {Object} - Informações sobre o resultado
   * @public
   */
  addPoints(points, source = "generic") {
    // Verificar se é um número válido
    if (isNaN(points) || points <= 0) {
      console.warn("⚠️ Tentativa de adicionar pontos inválidos:", points);
      return {
        newPoints: this.data.points,
        levelUp: false,
        level: this.data.level,
      };
    }

    // Salvar os pontos antigos e o nível para verificar mudanças
    const oldPoints = this.data.points;
    const oldLevel = this.data.level;

    // Adicionar os pontos
    this.data.points += points;

    // Registrar o evento de pontos (para análise futura)
    this.logPointsEvent(points, source);

    // Atualizar o nível com base nos novos pontos
    this.updateLevel();

    // Verificar se houve avanço de nível
    const levelUp = oldLevel !== this.data.level;

    // Se subiu de nível, registrar a conquista
    if (levelUp) {
      this.logLevelUpEvent(oldLevel, this.data.level);
    }

    // Salvar o progresso
    this.save();

    // Retornar as informações sobre o resultado
    return {
      newPoints: this.data.points,
      pointsAdded: points,
      oldPoints: oldPoints,
      levelUp: levelUp,
      level: this.data.level,
    };
  }

  /**
   * Registra um evento de ganho de pontos
   * @param {number} points - Pontos ganhos
   * @param {string} source - Fonte dos pontos
   * @private
   */
  logPointsEvent(points, source) {
    // Inicializar o array de log se não existir
    if (!this.data.pointsLog) {
      this.data.pointsLog = [];
    }

    // Adicionar o evento ao log
    this.data.pointsLog.push({
      timestamp: new Date().toISOString(),
      points: points,
      source: source,
      totalPoints: this.data.points,
    });

    // Limitar o tamanho do log para evitar crescimento excessivo
    if (this.data.pointsLog.length > 100) {
      this.data.pointsLog.shift(); // Remove o evento mais antigo
    }
  }

  /**
   * Registra um evento de avanço de nível
   * @param {string} oldLevel - Nível anterior
   * @param {string} newLevel - Novo nível
   * @private
   */
  logLevelUpEvent(oldLevel, newLevel) {
    // Inicializar o array de log se não existir
    if (!this.data.levelLog) {
      this.data.levelLog = [];
    }

    // Adicionar o evento ao log
    this.data.levelLog.push({
      timestamp: new Date().toISOString(),
      oldLevel: oldLevel,
      newLevel: newLevel,
      points: this.data.points,
    });
  }

  /**
   * Atualiza o nível do jogador com base nos pontos atuais
   * @returns {boolean} - Se houve mudança de nível
   * @private
   */
  updateLevel() {
    const previousLevel = this.data.level;

    // Encontrar o nível adequado com base nos pontos
    for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
      if (this.data.points >= this.levelThresholds[i].points) {
        this.data.level = this.levelThresholds[i].name;
        this.data.rank = i;

        // Calcular progresso para o próximo nível
        if (i < this.levelThresholds.length - 1) {
          const currentThreshold = this.levelThresholds[i].points;
          const nextThreshold = this.levelThresholds[i + 1].points;
          this.data.maxPoints = nextThreshold;
          this.data.progress = (this.data.points - currentThreshold) / (nextThreshold - currentThreshold);
        } else {
          // Já está no nível máximo
          this.data.progress = 1;
          this.data.maxPoints = this.levelThresholds[i].points;
        }

        break;
      }
    }

    return previousLevel !== this.data.level;
  }

  /**
   * Verifica se o jogador acabou de subir de nível
   * @returns {boolean} - Se o jogador acabou de subir de nível
   * @public
   */
  checkLevelUp() {
    // Verificar para cada nível
    for (let i = 0; i < this.levelThresholds.length; i++) {
      const threshold = this.levelThresholds[i];

      // Se acabou de atingir este limite exato
      if (this.data.points === threshold.points && this.data.level === threshold.name) {
        return true;
      }
    }

    return false;
  }

  /**
   * Marca uma missão como concluída
   * @param {string} missionId - ID da missão
   * @param {Object} [stats] - Estatísticas opcionais da conclusão
   * @returns {boolean} - Se a operação foi bem-sucedida
   * @public
   */
  completeMission(missionId, stats = {}) {
    try {
      // Verificar se a missão já foi concluída
      if (!this.data.completedMissions.includes(missionId)) {
        // Adicionar à lista de missões concluídas
        this.data.completedMissions.push(missionId);

        // Registrar estatísticas da missão
        if (!this.data.missionStats) {
          this.data.missionStats = {};
        }

        this.data.missionStats[missionId] = {
          completedAt: new Date().toISOString(),
          ...stats,
        };

        // Salvar o progresso
        this.save();

        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Erro ao completar missão ${missionId}:`, error);
      return false;
    }
  }

  /**
   * Verifica se uma missão foi concluída
   * @param {string} missionId - ID da missão
   * @returns {boolean} - Se a missão foi concluída
   * @public
   */
  isMissionCompleted(missionId) {
    try {
      return this.data.completedMissions.includes(missionId);
    } catch (error) {
      console.error(`❌ Erro ao verificar status da missão ${missionId}:`, error);
      return false;
    }
  }

  /**
   * Adiciona um emblema/conquista ao jogador
   * @param {string} badgeId - ID do emblema
   * @param {Object} [details] - Detalhes opcionais sobre a conquista
   * @returns {boolean} - Se a operação foi bem-sucedida
   * @public
   */
  addBadge(badgeId, details = {}) {
    try {
      // Verificar se o emblema já foi obtido
      if (!this.data.badges.includes(badgeId)) {
        // Adicionar à lista de emblemas
        this.data.badges.push(badgeId);

        // Registrar detalhes do emblema
        if (!this.data.badgeDetails) {
          this.data.badgeDetails = {};
        }

        this.data.badgeDetails[badgeId] = {
          earnedAt: new Date().toISOString(),
          ...details,
        };

        // Salvar o progresso
        this.save();

        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Erro ao adicionar emblema ${badgeId}:`, error);
      return false;
    }
  }

  /**
   * Verifica se o jogador possui um emblema
   * @param {string} badgeId - ID do emblema
   * @returns {boolean} - Se o jogador possui o emblema
   * @public
   */
  hasBadge(badgeId) {
    try {
      return this.data.badges.includes(badgeId);
    } catch (error) {
      console.error(`❌ Erro ao verificar emblema ${badgeId}:`, error);
      return false;
    }
  }

  /**
   * Atualiza as configurações do jogo
   * @param {Object} newSettings - Novas configurações (serão mescladas com as existentes)
   * @returns {boolean} - Se a operação foi bem-sucedida
   * @public
   */
  updateSettings(newSettings) {
    try {
      // Mesclar as novas configurações com as existentes
      this.data.settings = {
        ...this.data.settings,
        ...newSettings,
      };

      // Para configurações de acessibilidade, manter a estrutura aninhada
      if (newSettings.accessibility) {
        this.data.settings.accessibility = {
          ...this.data.settings.accessibility,
          ...newSettings.accessibility,
        };
      }

      // Salvar as configurações
      this.save();

      return true;
    } catch (error) {
      console.error("❌ Erro ao atualizar configurações:", error);
      return false;
    }
  }

  /**
   * Obtém os emblemas do jogador com detalhes
   * @returns {Array} - Lista de emblemas com detalhes
   * @public
   */
  getBadgesWithDetails() {
    const badgeDetails = [];

    try {
      // Para cada ID de emblema
      for (const badgeId of this.data.badges) {
        // Obter detalhes do emblema (se existirem)
        const details = this.data.badgeDetails && this.data.badgeDetails[badgeId] ? this.data.badgeDetails[badgeId] : {};

        // Adicionar à lista
        badgeDetails.push({
          id: badgeId,
          ...details,
        });
      }
    } catch (error) {
      console.error("❌ Erro ao obter detalhes de emblemas:", error);
    }

    return badgeDetails;
  }

  /**
   * Obtém as missões concluídas com detalhes
   * @returns {Array} - Lista de missões concluídas com detalhes
   * @public
   */
  getCompletedMissionsWithDetails() {
    const missionDetails = [];

    try {
      // Para cada ID de missão concluída
      for (const missionId of this.data.completedMissions) {
        // Obter estatísticas da missão (se existirem)
        const stats = this.data.missionStats && this.data.missionStats[missionId] ? this.data.missionStats[missionId] : {};

        // Adicionar à lista
        missionDetails.push({
          id: missionId,
          ...stats,
        });
      }
    } catch (error) {
      console.error("❌ Erro ao obter detalhes de missões:", error);
    }

    return missionDetails;
  }

  /**
   * Obtém informações sobre o próximo nível
   * @returns {Object|null} - Informações do próximo nível ou null se estiver no nível máximo
   * @public
   */
  getNextLevelInfo() {
    try {
      const currentRank = this.data.rank;

      if (currentRank < this.levelThresholds.length - 1) {
        const nextLevel = this.levelThresholds[currentRank + 1];

        return {
          name: nextLevel.name,
          pointsNeeded: nextLevel.points - this.data.points,
          pointsTotal: nextLevel.points,
          icon: nextLevel.icon,
          description: nextLevel.description,
        };
      }

      return null; // Já está no nível máximo
    } catch (error) {
      console.error("❌ Erro ao obter informações do próximo nível:", error);
      return null;
    }
  }

  /**
   * Obtém informações sobre o nível atual
   * @returns {Object} - Informações do nível atual
   * @public
   */
  getCurrentLevelInfo() {
    try {
      const currentRank = this.data.rank;
      const currentLevel = this.levelThresholds[currentRank];

      return {
        name: currentLevel.name,
        rank: currentRank,
        points: currentLevel.points,
        icon: currentLevel.icon,
        description: currentLevel.description,
      };
    } catch (error) {
      console.error("❌ Erro ao obter informações do nível atual:", error);

      // Retornar informações básicas em caso de erro
      return {
        name: this.data.level,
        rank: this.data.rank || 0,
        points: 0,
        icon: "badge_novice",
        description: "Nível inicial",
      };
    }
  }

  /**
   * Obtém o progresso total do jogador
   * @returns {Object} - Estatísticas de progresso
   * @public
   */
  getProgressStats() {
    try {
      // Calcular porcentagens
      const totalMissions = 10; // Número total de missões no jogo (ajuste conforme necessário)
      const completedMissions = this.data.completedMissions.length;
      const missionCompletion = (completedMissions / totalMissions) * 100;

      const totalLevels = this.levelThresholds.length;
      const currentRank = this.data.rank;
      const levelCompletion = ((currentRank + 1) / totalLevels) * 100;

      // Estimar progresso geral (média ponderada)
      const overallProgress = missionCompletion * 0.7 + levelCompletion * 0.3;

      return {
        points: this.data.points,
        level: this.data.level,
        rank: this.data.rank,
        levelProgress: this.data.progress,
        completedMissions: completedMissions,
        totalMissions: totalMissions,
        missionCompletion: missionCompletion,
        levelCompletion: levelCompletion,
        overallProgress: overallProgress,
        badges: this.data.badges.length,
      };
    } catch (error) {
      console.error("❌ Erro ao obter estatísticas de progresso:", error);

      // Retornar dados básicos em caso de erro
      return {
        points: this.data.points,
        level: this.data.level,
        completedMissions: this.data.completedMissions.length,
        overallProgress: 0,
      };
    }
  }

  // ===== GETTERS PARA ACESSAR PROPRIEDADES =====
  /**
   * Obtém o nome do jogador
   * @returns {string} - Nome do jogador
   * @public
   */
  getPlayerName() {
    return this.data.playerName;
  }

  /**
   * Obtém os pontos atuais do jogador
   * @returns {number} - Pontos
   * @public
   */
  getPoints() {
    return this.data.points;
  }

  /**
   * Obtém o nível atual do jogador
   * @returns {string} - Nível
   * @public
   */
  getLevel() {
    return this.data.level;
  }

  /**
   * Obtém o progresso para o próximo nível (0-1)
   * @returns {number} - Progresso
   * @public
   */
  getProgress() {
    return this.data.progress;
  }

  /**
   * Obtém os emblemas do jogador
   * @returns {Array} - Lista de IDs de emblemas
   * @public
   */
  getBadges() {
    return [...this.data.badges];
  }

  /**
   * Obtém o rank numérico do jogador
   * @returns {number} - Rank
   * @public
   */
  getRank() {
    return this.data.rank;
  }

  /**
   * Obtém as configurações do jogo
   * @returns {Object} - Configurações
   * @public
   */
  getSettings() {
    return { ...this.data.settings };
  }

  /**
   * Obtém o papel selecionado pelo jogador
   * @returns {string|null} - Papel selecionado
   * @public
   */
  getSelectedRole() {
    return this.data.selectedRole;
  }

  /**
   * Define o papel selecionado pelo jogador
   * @param {string} role - Papel selecionado
   * @returns {boolean} - Se a operação foi bem-sucedida
   * @public
   */
  setSelectedRole(role) {
    try {
      this.data.selectedRole = role;
      this.save();
      return true;
    } catch (error) {
      console.error("❌ Erro ao definir papel selecionado:", error);
      return false;
    }
  }

  /**
   * Define o nome do jogador
   * @param {string} name - Nome do jogador
   * @returns {boolean} - Se a operação foi bem-sucedida
   * @public
   */
  setPlayerName(name) {
    try {
      if (name && name.trim() !== "") {
        this.data.playerName = name.trim();
        this.save();
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Erro ao definir nome do jogador:", error);
      return false;
    }
  }
}

// Criar instância global
try {
  // Verificar se já existe para evitar recriação
  if (!window.saveManager) {
    window.saveManager = new SaveManager();
    console.log("SaveManager inicializado e disponível globalmente como window.saveManager");
  }
} catch (error) {
  console.error("❌ Erro ao criar instância global do SaveManager:", error);
}
