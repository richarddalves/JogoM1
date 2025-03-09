/**
 * Funções relacionadas ao mapa e ambiente da Missão Escolar
 */
(function () {
  /**
   * Cria o ambiente da escola
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createEnvironment = function (width, height) {
    console.log("🗺️ Iniciando criação do ambiente da escola");

    // Usar diretamente o mapa de fallback
    this.createFallbackMap(width, height);

    // Armazenar informação sobre o tipo de mapa
    this.mapElements.useTilemap = false;
  };

  /**
   * Cria um mapa alternativo de fallback
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createFallbackMap = function (width, height) {
    console.log("🔄 Criando mapa de fallback alternativo");

    // Usar imagem de mapa.jpeg como fundo principal
    if (this.textures.exists("school_fallback")) {
      this.mapElements.background = this.add
        .image(width / 2, height / 2, "school_fallback")
        .setDisplaySize(width, height * 0.9) // Reduzir altura para deixar espaço para UI
        .setDepth(0);
      console.log("✅ Usando imagem 'school_fallback' como mapa");
    } else {
      // Fallback do fallback (caso a imagem mapa.jpeg não seja encontrada)
      this.mapElements.background = this.add
        .image(width / 2, height / 2, "school_bg")
        .setDisplaySize(width, height * 0.9)
        .setDepth(0);
      console.log("⚠️ Usando imagem 'school_bg' como fallback de emergência");
    }

    // Overlay para melhorar contraste (opcional, reduzindo opacidade)
    this.mapElements.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.1).setOrigin(0).setDepth(1);

    // Definir áreas de colisão básicas (paredes)
    this.createBasicColliders(width, height);

    // Definir áreas interativas básicas
    this.createBasicInteractions(width, height);

    // Definir limites do mundo
    this.physics.world.setBounds(20, 20, width - 40, height - 40);

    console.log("✅ Mapa de fallback criado com sucesso");
  };

  /**
   * Cria colisores básicos para o mapa de fallback
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createBasicColliders = function (width, height) {
    // Array para armazenar os colisores
    this.mapElements.fallbackColliders = [];

    // Paredes externas (contorno) - reduzindo a espessura
    const wallThickness = 20;

    // Parede superior
    const topWall = this.add.rectangle(0, 0, width, wallThickness, 0xff0000, 0).setOrigin(0).setVisible(false);

    // Parede inferior
    const bottomWall = this.add
      .rectangle(0, height - wallThickness, width, wallThickness, 0xff0000, 0)
      .setOrigin(0)
      .setVisible(false);

    // Parede esquerda
    const leftWall = this.add.rectangle(0, 0, wallThickness, height, 0xff0000, 0).setOrigin(0).setVisible(false);

    // Parede direita
    const rightWall = this.add
      .rectangle(width - wallThickness, 0, wallThickness, height, 0xff0000, 0)
      .setOrigin(0)
      .setVisible(false);

    // Adicionar física às paredes
    [topWall, bottomWall, leftWall, rightWall].forEach((wall) => {
      this.physics.add.existing(wall, true); // true = estático
      this.mapElements.fallbackColliders.push(wall);
    });

    // Criar elementos interiores da escola - mais compactos e organizados
    // Sala de professores (top-left) - reduzindo para melhor jogabilidade
    const teacherRoom = this.add
      .rectangle(width * 0.18, height * 0.18, width * 0.25, height * 0.15, 0x0000ff, 0)
      .setOrigin(0.5)
      .setVisible(false);

    // Sala de aula (top-right)
    const classroom = this.add
      .rectangle(width * 0.82, height * 0.18, width * 0.25, height * 0.15, 0x0000ff, 0)
      .setOrigin(0.5)
      .setVisible(false);

    // Secretaria (bottom-left)
    const office = this.add
      .rectangle(width * 0.18, height * 0.82, width * 0.25, height * 0.15, 0x0000ff, 0)
      .setOrigin(0.5)
      .setVisible(false);

    // Biblioteca (bottom-right)
    const library = this.add
      .rectangle(width * 0.82, height * 0.82, width * 0.25, height * 0.15, 0x0000ff, 0)
      .setOrigin(0.5)
      .setVisible(false);

    // Adicionar colisões para as salas
    [teacherRoom, classroom, office, library].forEach((room) => {
      this.physics.add.existing(room, true);
      this.mapElements.fallbackColliders.push(room);
    });

    // Definir pontos de spawn importantes
    this.mapElements.spawnPoint = { x: width / 2, y: height * 0.65 };

    // Locais para NPCs (em posições melhores que não coincidam com objetos)
    this.mapElements.npcSpawns = {
      teacher: {
        x: width * 0.3,
        y: height * 0.3,
        name: "Professor Carlos",
      },
      student: {
        x: width * 0.7,
        y: height * 0.3,
        name: "Aluna Clara",
      },
    };

    // Salvar referências para interações
    this.mapElements.fallbackRooms = {
      teacherRoom,
      classroom,
      office,
      library,
    };

    console.log("✅ Criados colisores e layout básico da escola");
  };

  /**
   * Cria interações básicas para o mapa de fallback
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  schoolMission.prototype.createBasicInteractions = function (width, height) {
    // Certifique-se de que o array de interações existe
    this.mapElements.interactionZones = [];

    // Zona para sala dos professores
    this.createInteractionZone(width * 0.1, height * 0.15, width * 0.3, height * 0.2, { id: "teacher_room", name: "Sala dos Professores", type: "area" });

    // Zona para sala de aula
    this.createInteractionZone(width * 0.6, height * 0.15, width * 0.3, height * 0.2, { id: "classroom", name: "Sala de Aula", type: "area" });

    // Painel de avisos (centro superior)
    this.createInteractionZone(width * 0.45, height * 0.3, width * 0.1, height * 0.1, { id: "notice_board", name: "Painel de Avisos", type: "interaction" });

    // Política de uso de telefones
    this.createInteractionZone(width * 0.2, height * 0.6, width * 0.15, height * 0.1, { id: "phone_policy", name: "Política de Uso de Celulares", type: "interaction" });

    // Política de proteção de dados
    this.createInteractionZone(width * 0.8, height * 0.6, width * 0.15, height * 0.1, { id: "data_protection", name: "Política de Proteção de Dados", type: "interaction" });

    console.log("✅ Áreas de interação básicas criadas");
  };

  /**
   * Cria uma zona de interação
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {number} width - Largura
   * @param {number} height - Altura
   * @param {Object} props - Propriedades da interação
   */
  schoolMission.prototype.createInteractionZone = function (x, y, width, height, props) {
    const zone = this.add.zone(x, y, width, height).setOrigin(0).setDepth(5);

    // Adicionar ao physics para detecção de colisão
    this.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);

    // Armazenar propriedades para uso na interação
    zone.setData("properties", props);

    // Visualização da zona (modo debug) - mais visível para testes, menos visível em produção
    const debugVisual = this.add.rectangle(x, y, width, height, 0x00ff00, 0.1).setOrigin(0).setDepth(1).setAlpha(0.2);

    // Texto de identificação para debug
    if (props && props.name) {
      const label = this.add
        .text(x + width / 2, y + height / 2, props.name, {
          font: "14px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 5, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(2)
        .setAlpha(0.7);
    }

    // Adicionar à lista de zonas interativas
    this.mapElements.interactionZones.push(zone);
  };

  /**
   * Configura a câmera para seguir o jogador
   */
  schoolMission.prototype.configureCamera = function () {
    if (!this.player) return;

    // Fazer a câmera seguir o jogador
    this.cameras.main.startFollow(this.player, true);

    // Configurar limites da câmera para evitar que ela saia do mapa
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.cameras.main.setBounds(0, 0, width, height);

    // Ajustar o zoom para um valor apropriado
    this.cameras.main.setZoom(1);

    console.log("✅ Câmera configurada para seguir o jogador");
  };

  /**
   * Converte array de propriedades do Tiled para objeto
   * @param {Array} properties - Array de propriedades do Tiled
   * @returns {Object} - Objeto com as propriedades
   */
  schoolMission.prototype.convertProperties = function (properties) {
    if (!properties || !Array.isArray(properties)) return {};

    return properties.reduce((result, prop) => {
      result[prop.name] = prop.value;
      return result;
    }, {});
  };

  console.log("✅ Módulo de Mapa da Missão Escolar carregado");
})();
