/**
 * Módulo de mapa para a missão do jardim (MELHORADO)
 */
(function () {
  /**
   * Cria e configura o mapa do jardim
   */
  jardimMission.prototype.createMap = function () {
    console.log("🗺️ Criando mapa do jardim");

    try {
      // Criar background com textura para representar grama e garantir que toda a tela seja coberta
      this.createEnhancedBackground();

      // Criar mapa a partir do JSON do Tiled
      this.map = this.make.tilemap({ key: "jardim-map" });

      if (!this.map) {
        throw new Error("Não foi possível carregar o tilemap 'jardim-map'");
      }

      console.log(`📐 Dimensões do mapa carregado: ${this.map.width}x${this.map.height} tiles (${this.map.widthInPixels}x${this.map.heightInPixels} pixels)`);

      // CORREÇÃO: Mapear tilesets com nomes corretos
      // Verificar se os tilesets estão realmente presentes no mapa
      const mapTilesets = [];
      if (this.map.tilesets && this.map.tilesets.length > 0) {
        this.map.tilesets.forEach((tileset) => {
          mapTilesets.push(tileset.name);
        });
        console.log("📦 Tilesets presentes no mapa:", mapTilesets.join(", "));
      }

      // Mapear todos os tilesets necessários com seus nomes exatos
      const tilesetMapping = [
        { name: "grass", key: "grass-tiles" },
        { name: "water", key: "water-tiles" },
        // CORREÇÃO: Verificar se "assets_objetos" está no mapa e usar o nome correto
        { name: "objects", key: "objects-tiles" },
        { name: "assets_objetos", key: "objects-tiles" },
        { name: "final_assets", key: "final-assets" },
        { name: "teste_assets", key: "teste-assets" },
        { name: "samplemap", key: "sample-map" },
      ];

      // Carregar tilesets e registrar quais foram bem-sucedidos
      const loadedTilesets = {};
      tilesetMapping.forEach((ts) => {
        try {
          // Verificar se o tileset existe no mapa antes de tentar carregá-lo
          if (mapTilesets.includes(ts.name)) {
            const tileset = this.map.addTilesetImage(ts.name, ts.key);
            if (tileset) {
              loadedTilesets[ts.name] = tileset;
              console.log(`✅ Tileset carregado: ${ts.name}`);
            } else {
              console.warn(`⚠️ Não foi possível carregar o tileset: ${ts.name}`);
            }
          } else {
            console.log(`ℹ️ Tileset ${ts.name} não está presente no mapa, ignorando`);
          }
        } catch (e) {
          console.warn(`⚠️ Erro ao carregar tileset ${ts.name}:`, e.message);
        }
      });

      // Array com todos os tilesets disponíveis
      const allTilesets = Object.values(loadedTilesets);

      if (allTilesets.length === 0) {
        throw new Error("❌ Nenhum tileset válido encontrado!");
      }

      // Buscar todos os nomes de camadas disponíveis no mapa
      const layerNames = [];
      this.map.layers.forEach((layer) => {
        layerNames.push(layer.name);
      });

      console.log("📋 Camadas disponíveis no mapa:", layerNames);

      // Criar cada camada disponível no mapa
      layerNames.forEach((layerName) => {
        // Pular camadas de objetos e spawn points que não são camadas de tiles
        if (layerName.toLowerCase().includes("object") || layerName.toLowerCase().includes("spawn") || layerName.toLowerCase().includes("collision")) {
          console.log(`ℹ️ Pulando camada especial: ${layerName}`);
          return;
        }

        try {
          console.log(`🔨 Criando camada: ${layerName}`);
          const layer = this.map.createLayer(layerName, allTilesets);

          if (layer) {
            // Normalizar o nome da camada para referência
            const normalizedName = layerName.toLowerCase().replace(/\s+/g, "_");
            this.layers[normalizedName] = layer;

            // Configurações específicas para cada tipo de camada
            if (layerName.toLowerCase().includes("top") || layerName.toLowerCase().includes("above")) {
              layer.setDepth(10); // Acima do jogador
              console.log(`🔝 Camada ${layerName} definida como camada superior`);
            }

            // Se for uma camada de colisão marcada como não visível
            if (layerName.toLowerCase().includes("collision")) {
              layer.setCollisionByExclusion([-1]);
              layer.setVisible(false);
              console.log(`🔒 Configurada colisão para camada: ${layerName}`);
            }
          } else {
            console.warn(`⚠️ Não foi possível criar a camada: ${layerName}`);
          }
        } catch (e) {
          console.error(`❌ Erro ao criar camada ${layerName}:`, e.message);
        }
      });

      // Também tentar criar uma camada de colisão específica
      try {
        const collisionLayer = this.map.getObjectLayer("Collision") || this.map.getObjectLayer("collision") || this.map.getObjectLayer("CollisionLayer");

        if (collisionLayer) {
          console.log("✅ Camada de colisão encontrada como object layer");
          // Processar objetos de colisão se existirem
          this.processCollisionObjects(collisionLayer);
        } else {
          // Tentar encontrar uma camada de tiles para colisão
          const collisionTileLayer = this.map.layers.find((layer) => layer.name.toLowerCase().includes("collision"));

          if (collisionTileLayer) {
            const layer = this.map.createLayer(collisionTileLayer.name, allTilesets);
            if (layer) {
              this.layers.collision = layer;
              layer.setCollisionByExclusion([-1]);
              layer.setVisible(false);
              console.log("✅ Camada de colisão encontrada como tile layer");
            }
          } else {
            console.log("⚠️ Nenhuma camada de colisão encontrada, criando colisão em todas as camadas de objetos");

            // Configurar colisão em todas as camadas de objetos e decorações
            Object.keys(this.layers).forEach((key) => {
              if (key.includes("object") || key.includes("wall") || key.includes("decoration")) {
                this.layers[key].setCollisionByExclusion([-1]);
                console.log(`🔒 Configurada colisão para camada: ${key}`);
              }
            });
          }
        }
      } catch (e) {
        console.warn("⚠️ Erro ao processar camadas de colisão:", e.message);
      }

      // Extrair pontos de spawn e objetos interativos do mapa
      this.extractMapObjects();

      // Definir limites do mundo baseado no tamanho do mapa
      // MELHORADO: Aumentar o tamanho do mapa em 50% para mais espaço
      const mapWidth = this.map.widthInPixels * 1.5;
      const mapHeight = this.map.heightInPixels * 1.5;

      // Aumentar as dimensões do mundo
      this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

      // Configurar profundidade das camadas para aparência correta
      this.setLayerDepths();

      // Adicionar elementos decorativos para enriquecer o mapa
      this.addDecorativeElements();

      console.log(`📐 Bounds do mundo físico expandido: ${mapWidth}x${mapHeight}`);
      console.log("✅ Mapa carregado e aprimorado com sucesso!");
    } catch (error) {
      console.error("❌ Erro crítico ao criar o mapa:", error);
      // Criar uma camada básica como fallback se houver erro
      this.createEnhancedFallbackMap();
    }
  };

  /**
   * Extrai objetos, camadas de spawn e pontos de interação do mapa
   */
  jardimMission.prototype.extractMapObjects = function () {
    console.log("🗺️ Extraindo objetos do mapa...");

    // Inicializar arrays para armazenar diferentes tipos de objetos
    this.spawnPoints = {};
    this.npcSpawnPoints = {};
    this.interactPoints = [];

    try {
      // Processar camada de objetos se existir
      if (this.map && this.map.objects && this.map.objects.length > 0) {
        const objectLayers = this.map.objects;

        objectLayers.forEach((layer) => {
          if (!layer || !layer.objects) return;

          console.log(`📍 Processando camada de objetos: ${layer.name}`);

          layer.objects.forEach((object) => {
            // Processar com base no tipo de objeto
            if (object.type === "spawn") {
              // Ponto de spawn do jogador
              if (object.name === "player") {
                this.spawnPoints.player = {
                  x: object.x,
                  y: object.y,
                };
                console.log(`👤 Ponto de spawn do jogador encontrado: (${object.x}, ${object.y})`);
              }
              // Pontos de spawn de NPCs
              else if (object.name === "professor") {
                this.npcSpawnPoints.professor = {
                  x: object.x,
                  y: object.y,
                };
                console.log(`👨‍🏫 Ponto de spawn do professor encontrado: (${object.x}, ${object.y})`);
              }
            }
            // Pontos de interação (objetos com os quais o jogador pode interagir)
            else if (object.type === "interact" || object.name.includes("interact")) {
              this.interactPoints.push({
                x: object.x,
                y: object.y,
                width: object.width || 32,
                height: object.height || 32,
                name: object.name,
                properties: object.properties || [],
              });
              console.log(`🔍 Ponto de interação encontrado: ${object.name}`);
            }
          });
        });
      } else {
        // Se não houver camadas de objetos, configurar valores padrão
        console.log("⚠️ Nenhuma camada de objetos encontrada no mapa. Usando posições padrão.");
        this.setupDefaultObjectPositions();
      }

      // Se não encontrou pontos de interação no mapa, inicializar array vazio
      if (!this.interactPoints || this.interactPoints.length === 0) {
        console.log("⚠️ Nenhum ponto de interação encontrado. Inicializando array vazio.");
        this.interactPoints = [];
        // Adicionar alguns pontos de interação padrão
        this.addDefaultInteractionPoints();
      }

      console.log("✅ Objetos do mapa extraídos com sucesso!");
    } catch (e) {
      console.error("❌ Erro ao extrair objetos do mapa:", e);

      // Inicializar valores padrão em caso de erro
      this.setupDefaultObjectPositions();
    }
  };

  /**
   * Configura posições padrão para objetos quando o mapa não tem esses dados
   */
  jardimMission.prototype.setupDefaultObjectPositions = function () {
    // Definir pontos de spawn em posições estratégicas
    const centerX = 2000;
    const centerY = 2000;

    this.spawnPoints = {
      player: {
        x: centerX - 150,
        y: centerY - 150,
      },
    };

    this.npcSpawnPoints = {
      professor: {
        x: centerX + 100,
        y: centerY - 50,
      },
    };

    // Adicionar pontos de interação padrão
    this.interactPoints = [];
    this.addDefaultInteractionPoints();
  };

  /**
   * Adiciona pontos de interação padrão quando o mapa não tem esses dados
   */
  jardimMission.prototype.addDefaultInteractionPoints = function () {
    const centerX = 2000;
    const centerY = 2000;

    // Adicionar pontos de interação interessantes
    this.interactPoints.push(
      {
        x: centerX,
        y: centerY,
        width: 100,
        height: 100,
        name: "fountain",
        properties: [{ name: "message", value: "Uma bela fonte no centro do jardim. A água emite um som relaxante." }],
      },
      {
        x: centerX - 250,
        y: centerY + 150,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco para descansar e apreciar a beleza do jardim." }],
      },
      {
        x: centerX + 250,
        y: centerY + 150,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco feito de madeira reciclada. Sustentabilidade é importante." }],
      },
      {
        x: centerX - 300,
        y: centerY - 200,
        width: 80,
        height: 80,
        name: "statue",
        properties: [{ name: "message", value: "Uma estátua em homenagem aos fundadores da escola." }],
      },
      {
        x: centerX + 350,
        y: centerY - 250,
        width: 120,
        height: 80,
        name: "garden",
        properties: [{ name: "message", value: "Um pequeno jardim de ervas cultivado pelos alunos da escola." }],
      }
    );

    // Adicionar mais alguns bancos e lixeiras pelo mapa
    this.interactPoints.push(
      {
        x: 1218,
        y: 1082,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco de madeira polida. Confortável para sentar e ler um livro." }],
      },
      {
        x: 1383,
        y: 3322,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco à sombra de uma árvore. Lugar perfeito para relaxar." }],
      },
      {
        x: 2573,
        y: 245,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco com vista para o lago. Muitos alunos vêm aqui para estudar." }],
      },
      {
        x: 3365,
        y: 877,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco sob um toldo decorado. Protege do sol e da chuva." }],
      },
      {
        x: 1035,
        y: 2918,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco próximo ao caminho principal. Ponto de encontro comum entre os estudantes." }],
      },
      {
        x: 2183,
        y: 2122,
        width: 40,
        height: 40,
        name: "trash",
        properties: [{ name: "message", value: "Uma lixeira com símbolos de reciclagem. Há três compartimentos separados." }],
      },
      {
        x: 3278,
        y: 1285,
        width: 40,
        height: 40,
        name: "trash",
        properties: [{ name: "message", value: "Uma lixeira próxima aos bebedouros. Mantenha o jardim limpo!" }],
      },
      {
        x: 1383,
        y: 1446,
        width: 40,
        height: 40,
        name: "trash",
        properties: [{ name: "message", value: "Uma lixeira decorada pelos alunos do clube de arte com mensagens sobre sustentabilidade." }],
      },
      {
        x: 1987,
        y: 1957,
        width: 100,
        height: 100,
        name: "fountain",
        properties: [{ name: "message", value: "Uma fonte decorada com simbolos educacionais. A água forma padrões fascinantes." }],
      }
    );

    // Adicionar objetos interativos próximos à posição inicial do jogador
    const playerX = this.spawnPoints && this.spawnPoints.player ? this.spawnPoints.player.x : 100;
    const playerY = this.spawnPoints && this.spawnPoints.player ? this.spawnPoints.player.y : 100;

    this.interactPoints.push(
      {
        x: playerX + 150,
        y: playerY + 150,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco perto da entrada do jardim. Um ótimo lugar para começar sua exploração." }],
      },
      {
        x: playerX - 100,
        y: playerY + 200,
        width: 40,
        height: 40,
        name: "trash",
        properties: [{ name: "message", value: "Uma lixeira bem localizada. Importante manter a escola limpa!" }],
      },
      {
        x: playerX + 250,
        y: playerY - 50,
        width: 80,
        height: 80,
        name: "tree",
        properties: [{ name: "message", value: "Uma árvore frondosa que fornece sombra agradável. Plantada pelos alunos há 10 anos." }],
      },
      // Adicionar bancos e lixeiras na vizinhança do jogador
      {
        x: playerX + 108,
        y: playerY + 375,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco de madeira amarela. A tinta já está um pouco desgastada pelo tempo." }],
      },
      {
        x: playerX + 263,
        y: playerY + 501,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco de concreto. Simples mas resistente." }],
      },
      {
        x: playerX + 740,
        y: playerY + 478,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco decorado com mosaicos coloridos, feitos pelos alunos da turma de artes." }],
      },
      {
        x: playerX + 506,
        y: playerY + 227,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco de metal com detalhes modernos." }],
      },
      {
        x: playerX + 528,
        y: playerY + 270,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco antigo, provavelmente dos primeiros anos da escola." }],
      },
      {
        x: playerX + 602,
        y: playerY + 243,
        width: 40,
        height: 40,
        name: "trash",
        properties: [{ name: "message", value: "Uma lixeira recentemente instalada. Parte do projeto de sustentabilidade da escola." }],
      },
      {
        x: playerX + 863,
        y: playerY + 726,
        width: 40,
        height: 40,
        name: "trash",
        properties: [{ name: "message", value: "Uma lixeira com separação para materiais recicláveis." }],
      },
      {
        x: playerX + 1127,
        y: playerY + 224,
        width: 40,
        height: 40,
        name: "trash",
        properties: [{ name: "message", value: "Uma lixeira com arte pintada pelos alunos do ensino fundamental." }],
      },
      {
        x: playerX + 689,
        y: playerY + 405,
        width: 100,
        height: 100,
        name: "fountain",
        properties: [{ name: "message", value: "Uma fonte pequena. O som da água cria um ambiente tranquilo para estudo." }],
      }
    );
  };

  /**
   * Processa objetos de colisão de uma camada
   * @param {Phaser.Tilemaps.ObjectLayer} layer - Camada de objetos com colisões
   */
  jardimMission.prototype.processCollisionObjects = function (layer) {
    if (!layer || !layer.objects) return;

    console.log(`🔧 Processando ${layer.objects.length} objetos de colisão...`);

    // Criar grupo para objetos de colisão
    this.collisionObjects = this.physics.add.staticGroup();

    // Processar cada objeto
    layer.objects.forEach((object) => {
      try {
        // Retângulo de colisão padrão
        if (!object.rectangle && !object.polygon && !object.ellipse) {
          const rect = this.add.rectangle(object.x + object.width / 2, object.y + object.height / 2, object.width, object.height);
          this.physics.add.existing(rect, true);
          this.collisionObjects.add(rect);
        }
        // Formas especiais podem ser implementadas conforme necessário
      } catch (e) {
        console.warn(`⚠️ Erro ao processar objeto de colisão: ${e.message}`);
      }
    });

    console.log(`✅ ${this.collisionObjects.countActive()} objetos de colisão processados`);
  };

  /**
   * Cria um background melhorado com texturas e efeitos
   */
  jardimMission.prototype.createEnhancedBackground = function () {
    // Tamanho da tela expandido para garantir cobertura
    const width = Math.max(this.cameras.main.width * 3, 6000);
    const height = Math.max(this.cameras.main.height * 3, 6000);

    // Criar um background para o céu (cor única)
    const skyBg = this.add.graphics();
    skyBg.fillStyle(0x87ceeb, 1); // Azul claro para o céu
    skyBg.fillRect(0, 0, width, height * 0.4);
    skyBg.setDepth(-12);

    // Criar um background para o gramado
    const grassBg = this.add.graphics();
    grassBg.fillStyle(0x73b85c, 1); // Verde para a grama
    grassBg.fillRect(0, height * 0.4, width, height * 0.6);
    grassBg.setDepth(-11);

    // Adicionar textura para simular grama
    try {
      // Criar uma textura de ruído para dar mais realismo ao fundo
      const noiseTexture = this.textures.createCanvas("enhanced-grass", 400, 400);
      if (noiseTexture) {
        const context = noiseTexture.getContext();

        // Desenhar textura base
        context.fillStyle = "#5d9c47";
        context.fillRect(0, 0, 400, 400);

        // Adicionar variações para simular tufos de grama
        for (let x = 0; x < 400; x += 4) {
          for (let y = 0; y < 400; y += 4) {
            const value = Math.floor(Math.random() * 40);
            const size = Math.floor(Math.random() * 4) + 1;

            if (Math.random() > 0.85) {
              context.fillStyle = `rgba(${120 + value}, ${180 + value}, ${100 + value}, 0.5)`;
              context.fillRect(x, y, size, size);
            }
          }
        }

        // Adicionar alguns detalhes como flores pequenas espalhadas
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * 400;
          const y = Math.random() * 400;
          const size = Math.random() * 3 + 1;

          // Desenhar flor com centro amarelo e pétalas coloridas
          if (Math.random() > 0.5) {
            context.fillStyle = "rgba(255, 255, 255, 0.7)"; // Flor branca
          } else {
            context.fillStyle = "rgba(255, 220, 180, 0.7)"; // Flor amarelada
          }

          context.beginPath();
          context.arc(x, y, size, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = "rgba(240, 240, 100, 0.9)";
          context.beginPath();
          context.arc(x, y, size / 2, 0, Math.PI * 2);
          context.fill();
        }

        noiseTexture.refresh();

        // Aplicar a textura como tileSprite
        const grass = this.add.tileSprite(0, height * 0.4, width, height * 0.6, "enhanced-grass");
        grass.setOrigin(0, 0);
        grass.setDepth(-10);
        grass.setAlpha(0.6); // Semitransparente para misturar com o gradiente

        // Adicionar nuvens no céu
        this.addClouds();
      }
    } catch (e) {
      console.warn("⚠️ Não foi possível criar textura de fundo aprimorada:", e.message);
    }

    console.log("✅ Background aprimorado criado para uma experiência visual superior");
  };

  /**
   * Adiciona nuvens animadas ao céu
   */
  jardimMission.prototype.addClouds = function () {
    // Tamanho da tela expandido
    const width = Math.max(this.cameras.main.width * 3, 6000);
    const height = Math.max(this.cameras.main.height * 3, 6000);

    // Criar textura para as nuvens
    try {
      const cloudTexture = this.textures.createCanvas("cloud-texture", 200, 100);
      const ctx = cloudTexture.getContext();

      // Função para desenhar uma nuvem simples
      const drawCloud = (x, y, scale) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

        // Desenhar vários círculos para formar a nuvem
        const circles = [
          { x: x, y: y, r: 25 * scale },
          { x: x + 20 * scale, y: y - 10 * scale, r: 30 * scale },
          { x: x + 40 * scale, y: y, r: 25 * scale },
          { x: x + 60 * scale, y: y - 5 * scale, r: 20 * scale },
          { x: x + 15 * scale, y: y + 10 * scale, r: 20 * scale },
          { x: x + 45 * scale, y: y + 5 * scale, r: 25 * scale },
        ];

        circles.forEach((circle) => {
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      // Desenhar algumas nuvens na textura
      drawCloud(30, 30, 1);
      drawCloud(100, 50, 0.8);

      cloudTexture.refresh();

      // Adicionar várias nuvens com diferentes velocidades e tamanhos
      const numberOfClouds = 12;
      this.clouds = [];

      for (let i = 0; i < numberOfClouds; i++) {
        const cloudX = Math.random() * width;
        const cloudY = Math.random() * (height * 0.3);
        const scale = 0.5 + Math.random() * 2;
        const alpha = 0.6 + Math.random() * 0.4;
        const cloud = this.add.image(cloudX, cloudY, "cloud-texture");

        cloud.setScale(scale);
        cloud.setAlpha(alpha);
        cloud.setDepth(-11);

        // Guardar dados para animação
        this.clouds.push({
          sprite: cloud,
          speed: 0.2 + Math.random() * 0.5,
          initialX: cloudX,
        });
      }

      // Evento para mover as nuvens
      this.time.addEvent({
        delay: 100,
        callback: this.updateClouds,
        callbackScope: this,
        loop: true,
      });
    } catch (e) {
      console.warn("⚠️ Não foi possível criar nuvens:", e.message);
    }
  };

  /**
   * Atualiza a posição das nuvens
   */
  jardimMission.prototype.updateClouds = function () {
    if (!this.clouds) return;

    const width = Math.max(this.cameras.main.width * 3, 6000);

    this.clouds.forEach((cloud) => {
      // Mover a nuvem
      cloud.sprite.x += cloud.speed;

      // Se a nuvem sair da tela, reposicionar
      if (cloud.sprite.x > width + 200) {
        cloud.sprite.x = -200;
      }
    });
  };

  /**
   * Preenche um gradiente em um objeto graphics
   * Versão corrigida para compatibilidade com o Phaser
   */
  jardimMission.prototype.fillGradient = function (graphics, x, y, width, height, stops) {
    // O método createLinearGradient não está disponível diretamente no Graphics do Phaser
    // Vamos usar uma abordagem alternativa com cores sólidas sobrepostas

    // Usar a primeira cor como cor base
    if (stops && stops.length > 0) {
      // Desenhar o fundo com a primeira cor
      graphics.fillStyle(stops[0].color, 1);
      graphics.fillRect(x, y, width, height);

      // Se houver mais de uma cor, criar um efeito visual de gradiente
      if (stops.length > 1) {
        // Para dar um efeito de gradiente, podemos criar faixas de cores
        // com transparência variável
        const numBands = 10; // Quanto maior, mais suave o gradiente
        const bandHeight = height / numBands;

        // Calcular a cor final (última parada do gradiente)
        const finalColor = stops[stops.length - 1].color;

        // Desenhar bandas horizontais com opacidade crescente
        for (let i = 0; i < numBands; i++) {
          const alpha = i / numBands; // Aumenta de 0 a quase 1
          graphics.fillStyle(finalColor, alpha * 0.7);
          graphics.fillRect(x, y + bandHeight * i, width, bandHeight);
        }
      }
    } else {
      // Fallback para cor preta se não houver paradas
      graphics.fillStyle(0x000000, 1);
      graphics.fillRect(x, y, width, height);
    }
  };

  /**
   * Configurar profundidade das camadas para que a cena tenha a aparência correta
   */
  jardimMission.prototype.setLayerDepths = function () {
    // Definir profundidade para cada camada do mapa
    try {
      if (!this.layers) return;

      // Profundidade base para as camadas
      const baseDepth = 1;
      let currentDepth = baseDepth;

      // Processar camadas na ordem correta
      const layerOrder = [
        // Camadas de baixo para cima
        "ground",
        "water",
        "path",
        "flores",
        "grama",
        "arvores",
        "decoracoes",
        "obj",
      ];

      // Ordenar camadas primeiro por ordem predefinida, depois as demais
      const orderedLayers = [];

      // Primeiro adicionar as camadas na ordem específica
      layerOrder.forEach((layerName) => {
        Object.keys(this.layers).forEach((key) => {
          if (key.includes(layerName) && this.layers[key] && typeof this.layers[key].setDepth === "function") {
            orderedLayers.push({ key, priority: layerOrder.indexOf(layerName) });
          }
        });
      });

      // Depois adicionar quaisquer outras camadas não especificadas
      Object.keys(this.layers).forEach((key) => {
        if (!orderedLayers.some((item) => item.key === key) && this.layers[key] && typeof this.layers[key].setDepth === "function") {
          orderedLayers.push({ key, priority: 999 }); // Prioridade baixa para camadas não reconhecidas
        }
      });

      // Ordenar por prioridade
      orderedLayers.sort((a, b) => a.priority - b.priority);

      // Configurar profundidade
      orderedLayers.forEach((item, index) => {
        this.layers[item.key].setDepth(baseDepth + index);
        console.log(`🔄 Camada ${item.key} configurada com profundidade ${baseDepth + index}`);
      });

      console.log("✅ Profundidades das camadas configuradas com sucesso!");
    } catch (e) {
      console.warn("⚠️ Erro ao configurar profundidade das camadas:", e);
    }
  };

  /**
   * Adiciona elementos decorativos ao mapa para enriquecê-lo
   */
  jardimMission.prototype.addDecorativeElements = function () {
    // Verificar se o mapa existe
    if (!this.map) return;

    // Contêiner para elementos decorativos
    this.decorElements = this.add.container(0, 0);
    this.decorElements.setDepth(3); // Entre o chão e os objetos

    const mapWidth = this.map.widthInPixels;
    const mapHeight = this.map.heightInPixels;

    // Adicionar árvores aleatórias ao redor do mapa
    this.addTrees(mapWidth, mapHeight);

    // Adicionar flores e arbustos
    this.addPlants(mapWidth, mapHeight);

    // Adicionar detalhes como bancos, pequenos objetos
    this.addFurniture(mapWidth, mapHeight);

    // Adicionar efeitos de partículas para folhas caindo
    this.addFallingLeaves();
  };

  /**
   * Adiciona árvores decorativas ao mapa
   */
  jardimMission.prototype.addTrees = function (mapWidth, mapHeight) {
    // Criar árvores simples usando gráficos Phaser
    for (let i = 0; i < 20; i++) {
      // Posição pseudo-aleatória mas evitando o centro do mapa onde ficam os personagens
      let x, y, distance;
      let attempts = 0;
      const maxAttempts = 20;

      do {
        x = Phaser.Math.Between(50, mapWidth - 50);
        y = Phaser.Math.Between(50, mapHeight - 50);

        // Calcular distância ao ponto central do mapa
        const centerX = mapWidth / 2;
        const centerY = mapHeight / 2;
        distance = Phaser.Math.Distance.Between(x, y, centerX, centerY);
        attempts++;
      } while (distance < 150 && attempts < maxAttempts);

      // Se tentamos muitas vezes, só seguir adiante com a última posição
      if (distance >= 150 || attempts >= maxAttempts) {
        this.createTree(x, y);
      }
    }
  };

  /**
   * Cria uma árvore em determinada posição
   */
  jardimMission.prototype.createTree = function (x, y) {
    // Container para a árvore
    const treeContainer = this.add.container(x, y);

    // Tronco
    const trunk = this.add.graphics();
    trunk.fillStyle(0x8b4513);
    trunk.fillRect(-10, -10, 20, 50);

    // Copa (folhagem)
    const foliage = this.add.graphics();
    foliage.fillStyle(0x228b22);

    // Desenhar copa em camadas para parecer mais realista
    foliage.fillCircle(0, -40, 40);
    foliage.fillCircle(15, -50, 30);
    foliage.fillCircle(-15, -55, 25);
    foliage.fillCircle(0, -65, 35);

    // Sombra da árvore
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillEllipse(0, 35, 60, 20);

    // Adicionar partes à árvore
    treeContainer.add([shadow, trunk, foliage]);

    // Adicionar ao container de decorações
    this.decorElements.add(treeContainer);

    // Configurar colisão para a árvore
    const treeHitbox = this.physics.add.existing(this.add.rectangle(x, y + 20, 30, 20), true);
    treeHitbox.body.immovable = true;

    // Adicionar ao grupo de colisão se existir
    if (this.collisionGroup) {
      this.collisionGroup.add(treeHitbox);
    }

    return treeContainer;
  };

  /**
   * Adiciona plantas (flores, arbustos) ao mapa
   */
  jardimMission.prototype.addPlants = function (mapWidth, mapHeight) {
    // Criar grupos de flores em locais aleatórios
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(50, mapWidth - 50);
      const y = Phaser.Math.Between(50, mapHeight - 50);

      // Criar grupo de flores
      const flowerGroup = this.add.container(x, y);

      // Número de flores no grupo
      const flowerCount = Phaser.Math.Between(3, 7);

      // Cores possíveis para as flores
      const flowerColors = [0xffff00, 0xff5555, 0xff55ff, 0xffffff, 0x55ffff];

      for (let j = 0; j < flowerCount; j++) {
        // Posição relativa da flor dentro do grupo
        const fx = Phaser.Math.Between(-20, 20);
        const fy = Phaser.Math.Between(-20, 20);

        // Cor aleatória
        const colorIdx = Phaser.Math.Between(0, flowerColors.length - 1);

        // Criar flor
        const flower = this.add.graphics();

        // Caule
        flower.fillStyle(0x228b22);
        flower.fillRect(fx - 1, fy, 2, 15);

        // Pétalas
        flower.fillStyle(flowerColors[colorIdx]);
        flower.fillCircle(fx - 5, fy - 5, 4);
        flower.fillCircle(fx + 5, fy - 5, 4);
        flower.fillCircle(fx - 5, fy + 5, 4);
        flower.fillCircle(fx + 5, fy + 5, 4);

        // Centro
        flower.fillStyle(0xffff00);
        flower.fillCircle(fx, fy, 3);

        flowerGroup.add(flower);
      }

      // Adicionar ao container de decorações
      this.decorElements.add(flowerGroup);
    }

    // Adicionar alguns arbustos
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(50, mapWidth - 50);
      const y = Phaser.Math.Between(50, mapHeight - 50);

      // Criar arbusto
      const bush = this.add.graphics();
      bush.fillStyle(0x006400);

      // Desenhar arbusto com vários círculos
      const bushSize = Phaser.Math.Between(10, 25);
      for (let j = 0; j < 5; j++) {
        const bx = Phaser.Math.Between(-bushSize, bushSize);
        const by = Phaser.Math.Between(-bushSize, bushSize);
        const size = Phaser.Math.Between(bushSize - 5, bushSize + 5);
        bush.fillCircle(bx, by, size);
      }

      bush.x = x;
      bush.y = y;

      // Adicionar ao container de decorações
      this.decorElements.add(bush);
    }
  };

  /**
   * Adiciona mobiliário urbano (bancos, lixeiras, etc)
   */
  jardimMission.prototype.addFurniture = function (mapWidth, mapHeight) {
    // Adicionar alguns bancos
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, mapWidth - 100);
      const y = Phaser.Math.Between(100, mapHeight - 100);

      this.createBench(x, y);
    }

    // Adicionar algumas lixeiras
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(100, mapWidth - 100);
      const y = Phaser.Math.Between(100, mapHeight - 100);

      this.createTrashCan(x, y);
    }

    // Criar um chafariz/fonte no centro
    const fountainX = mapWidth / 2 + Phaser.Math.Between(-50, 50);
    const fountainY = mapHeight / 2 + Phaser.Math.Between(-50, 50);
    this.createFountain(fountainX, fountainY);
  };

  /**
   * Cria um banco no jardim
   */
  jardimMission.prototype.createBench = function (x, y) {
    // Container para o banco
    const benchContainer = this.add.container(x, y);

    // Desenhar o banco
    const bench = this.add.graphics();

    // Suportes (pés)
    bench.fillStyle(0x8b4513);
    bench.fillRect(-30, 0, 10, 15);
    bench.fillRect(20, 0, 10, 15);

    // Assento
    bench.fillStyle(0xa0522d);
    bench.fillRect(-35, -10, 70, 10);

    // Encosto
    bench.fillStyle(0xa0522d);
    bench.fillRect(-35, -40, 70, 10);
    bench.fillStyle(0x8b4513);
    bench.fillRect(-30, -30, 10, 20);
    bench.fillRect(20, -30, 10, 20);

    benchContainer.add(bench);

    // Adicionar ao container de decorações
    this.decorElements.add(benchContainer);

    // Configurar colisão para o banco
    const benchHitbox = this.physics.add.existing(this.add.rectangle(x, y, 70, 20), true);
    benchHitbox.body.immovable = true;

    // Adicionar ao grupo de colisão se existir
    if (this.collisionGroup) {
      this.collisionGroup.add(benchHitbox);
    }

    // Adicionar este banco como ponto de interação
    this.interactPoints.push({
      x: x,
      y: y,
      width: 70,
      height: 20,
      name: "bench",
      properties: [{ name: "message", value: "Um banco confortável para descansar e apreciar o jardim." }],
    });

    return benchContainer;
  };

  /**
   * Cria uma lixeira
   */
  jardimMission.prototype.createTrashCan = function (x, y) {
    // Container para a lixeira
    const trashContainer = this.add.container(x, y);

    // Desenhar a lixeira
    const trash = this.add.graphics();

    // Corpo da lixeira
    trash.fillStyle(0x444444);
    trash.fillRect(-15, -30, 30, 40);

    // Tampa
    trash.fillStyle(0x222222);
    trash.fillRect(-15, -35, 30, 5);

    // Abertura
    trash.fillStyle(0x000000);
    trash.fillRect(-10, -33, 20, 2);

    trashContainer.add(trash);

    // Adicionar ao container de decorações
    this.decorElements.add(trashContainer);

    // Configurar colisão para a lixeira
    const trashHitbox = this.physics.add.existing(this.add.rectangle(x, y - 15, 30, 30), true);
    trashHitbox.body.immovable = true;

    // Adicionar ao grupo de colisão se existir
    if (this.collisionGroup) {
      this.collisionGroup.add(trashHitbox);
    }

    // Adicionar como ponto de interação
    this.interactPoints.push({
      x: x,
      y: y,
      width: 30,
      height: 30,
      name: "trash",
      properties: [{ name: "message", value: "Uma lixeira. Importante manter o jardim limpo!" }],
    });

    return trashContainer;
  };

  /**
   * Cria um chafariz decorativo
   */
  jardimMission.prototype.createFountain = function (x, y) {
    // Container para o chafariz
    const fountainContainer = this.add.container(x, y);

    // Desenhar o chafariz
    const fountain = this.add.graphics();

    // Base circular grande
    fountain.fillStyle(0x888888);
    fountain.fillCircle(0, 0, 60);

    // Borda da base
    fountain.lineStyle(4, 0x666666);
    fountain.strokeCircle(0, 0, 60);

    // Água
    fountain.fillStyle(0x4488ff);
    fountain.fillCircle(0, 0, 50);

    // Pilar central
    fountain.fillStyle(0x888888);
    fountain.fillCircle(0, 0, 15);

    // Efeito de círculos na água
    fountain.lineStyle(1, 0xffffff, 0.5);
    fountain.strokeCircle(0, 0, 25);
    fountain.strokeCircle(0, 0, 35);
    fountain.strokeCircle(0, 0, 45);

    fountainContainer.add(fountain);

    // Adicionar partículas de água
    this.addWaterParticles(x, y);

    // Adicionar ao container de decorações
    this.decorElements.add(fountainContainer);

    // Configurar colisão para o chafariz
    const fountainHitbox = this.physics.add.existing(this.add.circle(x, y, 60), true);
    fountainHitbox.body.immovable = true;

    // Adicionar ao grupo de colisão se existir
    if (this.collisionGroup) {
      this.collisionGroup.add(fountainHitbox);
    }

    // Adicionar como ponto de interação
    this.interactPoints.push({
      x: x,
      y: y,
      width: 120,
      height: 120,
      name: "fountain",
      properties: [{ name: "message", value: "Um belo chafariz no centro do jardim. A água cria um ambiente relaxante." }],
    });

    return fountainContainer;
  };

  /**
   * Adiciona efeito de partículas de água ao chafariz
   * ATUALIZADO para Phaser 3.60
   */
  jardimMission.prototype.addWaterParticles = function (x, y) {
    try {
      // Usar novo sistema de partículas do Phaser 3.60
      const particles = this.add.particles({
        key: "task-icon",
        x: x,
        y: y,
        emitZone: {
          type: "random",
          source: new Phaser.Geom.Circle(0, 0, 30),
        },
        speed: { min: 10, max: 60 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.05, end: 0 },
        alpha: { start: 0.5, end: 0 },
        lifespan: 1000,
        frequency: 100,
        quantity: 2,
        blendMode: "ADD",
      });

      this.decorElements.add(particles);
    } catch (e) {
      console.warn("⚠️ Não foi possível criar partículas de água:", e.message);
    }
  };

  /**
   * Adiciona efeito de folhas caindo
   * ATUALIZADO para Phaser 3.60
   */
  jardimMission.prototype.addFallingLeaves = function () {
    try {
      // Criar textura para folha
      const leafTexture = this.textures.createCanvas("leaf-texture", 20, 20);
      const ctx = leafTexture.getContext();

      // Desenhar uma folha simples
      ctx.fillStyle = "#228B22";
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.quadraticCurveTo(0, 5, 10, 10);
      ctx.quadraticCurveTo(20, 5, 10, 0);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(10, 20);
      ctx.strokeStyle = "#228B22";
      ctx.lineWidth = 1;
      ctx.stroke();

      leafTexture.refresh();

      // Usar novo sistema de partículas do Phaser 3.60
      const particles = this.add.particles({
        key: "leaf-texture",
        x: { min: 0, max: this.cameras.main.width * 3 },
        y: 0,
        lifespan: 5000,
        speedY: { min: 20, max: 50 },
        speedX: { min: -20, max: 20 },
        angle: { min: 0, max: 360 },
        rotate: { min: 0, max: 360 },
        scale: { min: 0.5, max: 1.5 },
        quantity: 1,
        frequency: 3000,
        alpha: { start: 0.8, end: 0.1 },
      });

      this.decorElements.add(particles);
    } catch (e) {
      console.warn("⚠️ Não foi possível criar efeito de folhas caindo:", e.message);
    }
  };

  /**
   * Cria um mapa fallback aprimorado em caso de erro no carregamento do mapa principal
   */
  jardimMission.prototype.createEnhancedFallbackMap = function () {
    console.warn("⚠️ Criando mapa fallback aprimorado devido a erros no mapa original");

    // Criar um mapa fallback mais interessante e maior
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const mapWidth = Math.max(width * 3, 4000);
    const mapHeight = Math.max(height * 3, 4000);

    // Limpar camadas existentes
    this.layers = {};

    // Adicionar fundo de céu
    const skyBg = this.add.graphics();
    const skyGradient = [
      { stop: 0, color: 0x87ceeb }, // Azul claro no topo
      { stop: 1, color: 0xc2e6f8 }, // Azul mais claro embaixo
    ];

    this.fillGradient(skyBg, 0, 0, mapWidth, mapHeight * 0.4, skyGradient);
    skyBg.setDepth(-12);

    // Adicionar fundo de grama
    const groundGraphics = this.add.graphics();
    const grassGradient = [
      { stop: 0, color: 0x73b85c }, // Verde mais claro no topo
      { stop: 1, color: 0x528f3d }, // Verde mais escuro embaixo
    ];

    this.fillGradient(groundGraphics, 0, mapHeight * 0.4, mapWidth, mapHeight * 0.6, grassGradient);
    groundGraphics.setDepth(-11);

    // Salvar uma referência para poder aplicar colisão
    this.layers.ground = {
      setDepth: function (depth) {
        groundGraphics.setDepth(depth);
      },
    };

    // Adicionar elementos de caminhos
    this.createEnhancedPaths(mapWidth, mapHeight);

    // Definir pontos de spawn estratégicos
    this.setupEnhancedSpawnPoints(mapWidth, mapHeight);

    // Adicionar detalhes decorativos
    this.addFallbackDecorations(mapWidth, mapHeight);

    // Definir limites do mundo
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    console.log(`📐 Mapa fallback aprimorado criado com dimensões ${mapWidth}x${mapHeight}`);
  };

  /**
   * Cria caminhos aprimorados para o mapa fallback
   */
  jardimMission.prototype.createEnhancedPaths = function (mapWidth, mapHeight) {
    // Container para caminhos
    const pathsContainer = this.add.container(0, 0);
    pathsContainer.setDepth(1);

    // Gráficos para os caminhos
    const pathGraphics = this.add.graphics();

    // Cores para o caminho
    const pathFillColor = 0xd2b48c; // Tom de marrom claro
    const pathStrokeColor = 0xaa9977; // Borda mais escura

    // Caminho principal em formato de cruz com bordas arredondadas
    const pathWidth = 80;

    // Primeiro desenhar a borda
    pathGraphics.fillStyle(pathStrokeColor, 1);

    // Caminho horizontal
    pathGraphics.fillRect(100, mapHeight / 2 - pathWidth / 2 - 5, mapWidth - 200, pathWidth + 10);

    // Caminho vertical
    pathGraphics.fillRect(mapWidth / 2 - pathWidth / 2 - 5, 100, pathWidth + 10, mapHeight - 200);

    // Agora desenhar o preenchimento
    pathGraphics.fillStyle(pathFillColor, 1);

    // Caminho horizontal
    pathGraphics.fillRect(100, mapHeight / 2 - pathWidth / 2, mapWidth - 200, pathWidth);

    // Caminho vertical
    pathGraphics.fillRect(mapWidth / 2 - pathWidth / 2, 100, pathWidth, mapHeight - 200);

    // Criar círculo central (praça)
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;
    const centerRadius = 200;

    // Borda da praça
    pathGraphics.fillStyle(pathStrokeColor, 1);
    pathGraphics.fillCircle(centerX, centerY, centerRadius + 5);

    // Interior da praça
    pathGraphics.fillStyle(pathFillColor, 1);
    pathGraphics.fillCircle(centerX, centerY, centerRadius);

    // Adicionar textura ao caminho
    this.addPathTexture(mapWidth, mapHeight, pathGraphics);

    // Adicionar caminhos secundários serpenteantes
    this.addSecondaryPaths(mapWidth, mapHeight, pathGraphics, centerX, centerY);

    pathsContainer.add(pathGraphics);

    // Salvar referência
    this.layers.paths = {
      setDepth: function (depth) {
        pathsContainer.setDepth(depth);
      },
    };
  };

  /**
   * Adiciona textura ao caminho para parecer mais real
   */
  jardimMission.prototype.addPathTexture = function (mapWidth, mapHeight, pathGraphics) {
    try {
      // Criar textura para os caminhos
      const pathTexture = this.textures.createCanvas("path-texture", 100, 100);
      const ctx = pathTexture.getContext();

      // Cor base
      ctx.fillStyle = "#D2B48C";
      ctx.fillRect(0, 0, 100, 100);

      // Adicionar padrão de pedras
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 5 + 2;

        ctx.fillStyle = `rgba(${150 + Math.random() * 30}, ${130 + Math.random() * 30}, ${100 + Math.random() * 30}, 0.3)`;
        ctx.beginPath();

        // Pedras irregulares
        if (Math.random() > 0.5) {
          // Pedra oval
          ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
        } else {
          // Pedra poligonal
          ctx.beginPath();
          const sides = Math.floor(Math.random() * 3) + 3; // 3-5 lados
          const angleStep = (Math.PI * 2) / sides;

          for (let j = 0; j < sides; j++) {
            const angle = j * angleStep;
            const pointX = x + Math.cos(angle) * size;
            const pointY = y + Math.sin(angle) * size;

            if (j === 0) {
              ctx.moveTo(pointX, pointY);
            } else {
              ctx.lineTo(pointX, pointY);
            }
          }
        }

        ctx.fill();
      }

      // Adicionar algumas linhas para simular juntas entre pedras
      ctx.strokeStyle = "rgba(100, 90, 80, 0.2)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < 20; i++) {
        const x1 = Math.random() * 100;
        const y1 = Math.random() * 100;
        const x2 = x1 + (Math.random() * 20 - 10);
        const y2 = y1 + (Math.random() * 20 - 10);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      pathTexture.refresh();

      // Aplicar textura como tileSprite nos caminhos
      const pathsTexture = this.add.tileSprite(0, 0, mapWidth, mapHeight, "path-texture");
      pathsTexture.setOrigin(0, 0);
      pathsTexture.setDepth(0.5);

      // Criar máscara usando os caminhos
      const pathMask = this.make.graphics({});

      // Duplicar os mesmos caminhos para a máscara
      pathMask.fillStyle(0xffffff);

      // Caminho horizontal
      pathMask.fillRect(100, mapHeight / 2 - 40, mapWidth - 200, 80);

      // Caminho vertical
      pathMask.fillRect(mapWidth / 2 - 40, 100, 80, mapHeight - 200);

      // Círculo central
      pathMask.fillCircle(mapWidth / 2, mapHeight / 2, 200);

      // Aplicar máscara à textura
      const mask = pathMask.createGeometryMask();
      pathsTexture.setMask(mask);
    } catch (e) {
      console.warn("⚠️ Não foi possível criar textura para os caminhos:", e.message);
    }
  };

  /**
   * Adiciona caminhos secundários serpenteantes
   */
  jardimMission.prototype.addSecondaryPaths = function (mapWidth, mapHeight, pathGraphics, centerX, centerY) {
    // Cores para os caminhos secundários
    const secondaryPathColor = 0xc2a078; // Mais escuro que o caminho principal

    // Adicionar alguns caminhos serpenteantes saindo do centro
    const directions = [
      { angle: Math.PI * 0.25, length: 500 }, // Nordeste
      { angle: Math.PI * 0.75, length: 400 }, // Noroeste
      { angle: Math.PI * 1.25, length: 450 }, // Sudoeste
      { angle: Math.PI * 1.75, length: 550 }, // Sudeste
    ];

    directions.forEach((dir) => {
      // Criar pontos de controle para o caminho curvo
      const startX = centerX + Math.cos(dir.angle) * 200; // Começa na borda do círculo central
      const startY = centerY + Math.sin(dir.angle) * 200;

      const endX = startX + Math.cos(dir.angle) * dir.length;
      const endY = startY + Math.sin(dir.angle) * dir.length;

      // Pontos de controle para curvas
      const ctrlPoints = [];
      const segmentCount = 5;

      for (let i = 0; i <= segmentCount; i++) {
        const t = i / segmentCount;
        const pathX = startX + (endX - startX) * t;
        const pathY = startY + (endY - startY) * t;

        // Adicionar alguma variação aleatória, exceto nos pontos inicial e final
        const variation = i > 0 && i < segmentCount ? Math.random() * 80 - 40 : 0;

        // Perpendicular à direção do caminho para variação lateral
        const perpAngle = dir.angle + Math.PI / 2;
        const varX = pathX + Math.cos(perpAngle) * variation;
        const varY = pathY + Math.sin(perpAngle) * variation;

        ctrlPoints.push({ x: varX, y: varY });
      }

      // Desenhar caminho secundário
      const pathWidth = 40; // Mais estreito que o caminho principal

      pathGraphics.fillStyle(secondaryPathColor, 1);

      // Conectar os pontos com segmentos
      for (let i = 0; i < ctrlPoints.length - 1; i++) {
        const start = ctrlPoints[i];
        const end = ctrlPoints[i + 1];

        // Direção do segmento
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);

        // Pontos perpendiculares para largura do caminho
        const perpAngle = angle + Math.PI / 2;
        const halfWidth = pathWidth / 2;

        // Calcular os 4 pontos do segmento retangular
        const p1x = start.x + Math.cos(perpAngle) * halfWidth;
        const p1y = start.y + Math.sin(perpAngle) * halfWidth;

        const p2x = start.x - Math.cos(perpAngle) * halfWidth;
        const p2y = start.y - Math.sin(perpAngle) * halfWidth;

        const p3x = end.x - Math.cos(perpAngle) * halfWidth;
        const p3y = end.y - Math.sin(perpAngle) * halfWidth;

        const p4x = end.x + Math.cos(perpAngle) * halfWidth;
        const p4y = end.y + Math.sin(perpAngle) * halfWidth;

        // Desenhar o segmento como um polígono
        pathGraphics.beginPath();
        pathGraphics.moveTo(p1x, p1y);
        pathGraphics.lineTo(p2x, p2y);
        pathGraphics.lineTo(p3x, p3y);
        pathGraphics.lineTo(p4x, p4y);
        pathGraphics.closePath();
        pathGraphics.fillPath();
      }
    });
  };

  /**
   * Configura pontos de spawn estratégicos para o mapa fallback
   */
  jardimMission.prototype.setupEnhancedSpawnPoints = function (mapWidth, mapHeight) {
    // Definir pontos de spawn em posições estratégicas
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;

    this.spawnPoints = {
      player: {
        x: centerX - 150,
        y: centerY - 150,
      },
    };

    this.npcSpawnPoints = {
      professor: {
        x: centerX + 100,
        y: centerY - 50,
      },
    };

    // Adicionar pontos de interação interessantes
    this.interactPoints = [
      {
        x: centerX,
        y: centerY,
        width: 100,
        height: 100,
        name: "fountain",
        properties: [{ name: "message", value: "Uma bela fonte no centro do jardim. A água emite um som relaxante." }],
      },
      {
        x: centerX - 250,
        y: centerY + 150,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco para descansar e apreciar a beleza do jardim." }],
      },
      {
        x: centerX + 250,
        y: centerY + 150,
        width: 80,
        height: 40,
        name: "bench",
        properties: [{ name: "message", value: "Um banco feito de madeira reciclada. Sustentabilidade é importante." }],
      },
      {
        x: centerX - 300,
        y: centerY - 200,
        width: 80,
        height: 80,
        name: "statue",
        properties: [{ name: "message", value: "Uma estátua em homenagem aos fundadores da escola." }],
      },
      {
        x: centerX + 350,
        y: centerY - 250,
        width: 120,
        height: 80,
        name: "garden",
        properties: [{ name: "message", value: "Um pequeno jardim de ervas cultivado pelos alunos da escola." }],
      },
    ];
  };

  /**
   * Adiciona decorações para o mapa fallback
   */
  jardimMission.prototype.addFallbackDecorations = function (mapWidth, mapHeight) {
    // Container para decorações
    this.decorElements = this.add.container(0, 0);
    this.decorElements.setDepth(3);

    // Criar árvores, bancos, etc.
    this.addTrees(mapWidth, mapHeight);
    this.addPlants(mapWidth, mapHeight);
    this.addFurniture(mapWidth, mapHeight);

    // Adicionar algumas estátuas
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;

    // Criar estátua decorativa
    this.createStatue(centerX - 300, centerY - 200);

    // Criar efeitos de partículas e ambiente
    this.addFallingLeaves();
  };

  /**
   * Cria uma estátua decorativa
   */
  jardimMission.prototype.createStatue = function (x, y) {
    // Container para a estátua
    const statueContainer = this.add.container(x, y);

    // Desenhar a estátua
    const statue = this.add.graphics();

    // Base da estátua
    statue.fillStyle(0x888888);
    statue.fillRect(-25, 0, 50, 15);

    // Figura na estátua (simplificada)
    statue.fillStyle(0x999999);
    statue.fillRect(-15, -50, 30, 50);

    // Cabeça
    statue.fillStyle(0x999999);
    statue.fillCircle(0, -60, 10);

    statueContainer.add(statue);

    // Adicionar ao container de decorações
    this.decorElements.add(statueContainer);

    // Configurar colisão para a estátua
    const statueHitbox = this.physics.add.existing(this.add.rectangle(x, y - 25, 50, 50), true);
    statueHitbox.body.immovable = true;

    // Adicionar ao grupo de colisão se existir
    if (this.collisionGroup) {
      this.collisionGroup.add(statueHitbox);
    }

    return statueContainer;
  };

  console.log("✅ Módulo de Mapa aprimorado carregado");
})();
