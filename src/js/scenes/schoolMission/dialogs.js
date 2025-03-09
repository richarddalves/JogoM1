/**
 * Funções relacionadas ao sistema de diálogo da Missão Escolar
 */
(function () {
  /**
   * Inicia um diálogo com um NPC
   * @param {string} npcId - ID do NPC
   */
  schoolMission.prototype.startDialogWithNPC = function (npcId) {
    // Verificar se o jogador está em diálogo
    if (this.dialogActive) return;

    // Marcar como diálogo ativo
    this.dialogActive = true;

    // Parar movimento do jogador
    if (this.player) {
      this.player.setVelocity(0, 0);
    }

    // Obter os diálogos correspondentes ao NPC
    const dialogData = this.getDialogDataForNPC(npcId);

    if (!dialogData) {
      console.warn(`⚠️ Não há diálogos definidos para o NPC: ${npcId}`);
      this.showNotification("Não há nada para conversar com esta pessoa agora.", "warning");
      this.dialogActive = false;
      return;
    }

    // Configurar o gerenciador de diálogo
    this.currentDialog = {
      npcId: npcId,
      data: dialogData,
      index: 0,
      choices: null,
      selectedChoice: -1,
      typewriterEffect: null,
    };

    // Mostrar o diálogo
    this.showDialogPanel();
    this.displayCurrentDialogLine();
  };

  /**
   * Obtém os dados de diálogo para um NPC específico
   * @param {string} npcId - ID do NPC
   * @returns {Array} - Array de linhas de diálogo
   */
  schoolMission.prototype.getDialogDataForNPC = function (npcId) {
    // Verificar a tarefa atual para determinar o diálogo correto
    const currentTaskId = this.getCurrentTaskId();

    // Diálogos específicos para cada NPC e fase da missão
    const dialogs = {
      // Diálogos do professor
      teacher: {
        // Quando o jogador encontra o professor pela primeira vez
        initial: [
          { speaker: "Professor Carlos", text: "Olá! Você deve ser o novo agente da AGPD que a direção mencionou. Bem-vindo à nossa escola." },
          { speaker: "Você", text: "Obrigado, Professor Carlos. Fui informado que você tem uma questão sobre compartilhamento de informações." },
          { speaker: "Professor Carlos", text: "Sim, exatamente! Estou pensando em criar um grupo de WhatsApp com meus alunos para compartilhar avisos sobre a aula e materiais complementares." },
          { speaker: "Professor Carlos", text: "Seria tão mais prático do que usar o sistema oficial da escola, que é lento e complicado. O que você acha?" },
          {
            speaker: "Você",
            text: "Entendo sua preocupação com praticidade. Antes de dar uma opinião, gostaria de saber:",
            choices: [
              { text: "Os alunos são todos maiores de idade?", nextIndex: 5 },
              { text: "Como você planeja obter os números de telefone?", nextIndex: 8 },
              { text: "O que acha de usar a plataforma oficial da escola?", nextIndex: 11 },
            ],
          },
        ],
        // Resposta à pergunta sobre idade dos alunos
        age_question: [
          { speaker: "Professor Carlos", text: "Não, a maioria tem entre 15 e 17 anos. São alunos do Ensino Médio." },
          { speaker: "Você", text: "Isso é um ponto importante. A LGPD tem regras específicas para dados de menores de idade." },
          {
            speaker: "Você",
            text: "Quer fazer mais alguma pergunta ou podemos discutir as alternativas?",
            choices: [
              { text: "Como você planeja obter os números de telefone?", nextIndex: 8 },
              { text: "O que acha de usar a plataforma oficial da escola?", nextIndex: 11 },
              { text: "Vamos discutir as alternativas", nextIndex: 14 },
            ],
          },
        ],
        // Resposta à pergunta sobre obtenção dos números
        numbers_question: [
          { speaker: "Professor Carlos", text: "Pensei em pedir que cada aluno me passasse seu número durante a aula, ou talvez pegar na secretaria." },
          { speaker: "Você", text: "Entendo. Mas sabia que números de telefone são considerados dados pessoais e precisam de consentimento para uso?" },
          {
            speaker: "Você",
            text: "Quer fazer mais alguma pergunta ou podemos discutir as alternativas?",
            choices: [
              { text: "Os alunos são todos maiores de idade?", nextIndex: 5 },
              { text: "O que acha de usar a plataforma oficial da escola?", nextIndex: 11 },
              { text: "Vamos discutir as alternativas", nextIndex: 14 },
            ],
          },
        ],
        // Resposta sobre a plataforma oficial
        platform_question: [
          { speaker: "Professor Carlos", text: "A plataforma da escola funciona, mas é lenta e poucos alunos acessam regularmente. Por isso pensei no WhatsApp, que todos já usam." },
          { speaker: "Você", text: "Entendo a frustração com sistemas menos intuitivos, mas as plataformas oficiais geralmente já estão em conformidade com as leis de proteção de dados." },
          {
            speaker: "Você",
            text: "Gostaria de fazer mais alguma pergunta ou podemos discutir as alternativas?",
            choices: [
              { text: "Os alunos são todos maiores de idade?", nextIndex: 5 },
              { text: "Como você planeja obter os números de telefone?", nextIndex: 8 },
              { text: "Vamos discutir as alternativas", nextIndex: 14 },
            ],
          },
        ],
        // Discussão de alternativas
        alternatives: [
          { speaker: "Você", text: "Professor Carlos, existem alguns problemas com a ideia do grupo de WhatsApp:" },
          { speaker: "Você", text: "1. Os alunos são menores de idade, o que exige consentimento dos pais para coletar e processar seus dados pessoais." },
          { speaker: "Você", text: "2. Números de telefone são dados pessoais e não podem ser compartilhados sem autorização adequada." },
          { speaker: "Você", text: "3. Plataformas não oficiais não garantem a proteção necessária para dados educacionais." },
          { speaker: "Professor Carlos", text: "Não imaginei que seria tão complicado. Então como posso me comunicar melhor com meus alunos?" },
          {
            speaker: "Você",
            text: "Tenho algumas sugestões para você:",
            choices: [
              { text: "Use a plataforma oficial da escola", nextIndex: 20 },
              { text: "Crie o grupo, mas obtenha autorização formal dos pais", nextIndex: 23 },
              { text: "Abandone a ideia do grupo completamente", nextIndex: 26 },
            ],
          },
        ],
        // Solução 1: Usar plataforma oficial
        solution_official: [
          { speaker: "Você", text: "Recomendo usar a plataforma oficial da escola. Ela já tem todas as aprovações necessárias e os dados dos alunos já estão lá de forma segura." },
          { speaker: "Você", text: "Podemos verificar com o departamento de TI se há formas de torná-la mais acessível, talvez com notificações por e-mail ou um aplicativo dedicado." },
          { speaker: "Professor Carlos", text: "Faz sentido. Vou conversar com o pessoal da TI e ver se conseguimos melhorar a experiência para os alunos." },
          { speaker: "Professor Carlos", text: "Agradeço muito sua orientação! Não queria causar problemas de privacidade para meus alunos." },
          { speaker: "Você", text: "Disponha! Estamos aqui para ajudar a encontrar soluções que funcionem para todos e protejam os dados dos estudantes." },
          {
            speaker: "Você",
            text: "Missão cumprida! A solução escolhida protege adequadamente os dados dos alunos.",
            actions: ["completeMission"],
          },
        ],
        // Solução 2: Obter autorização formal
        solution_authorization: [
          { speaker: "Você", text: "Você pode criar o grupo, mas precisará obter autorização formal e por escrito dos pais ou responsáveis de cada aluno." },
          { speaker: "Você", text: "Isso envolverá criar um formulário explicando como os números serão usados, quem terá acesso e qual o propósito do grupo." },
          { speaker: "Professor Carlos", text: "Parece bastante burocrático... e se algum pai não autorizar?" },
          { speaker: "Você", text: "Nesse caso, você precisará oferecer uma alternativa para esses alunos, o que pode acabar criando dois sistemas paralelos de comunicação." },
          { speaker: "Professor Carlos", text: "Entendo. Talvez seja melhor usar a plataforma da escola mesmo, já que todos os alunos têm acesso garantido." },
          { speaker: "Você", text: "Acho que essa é uma decisão sábia. A plataforma oficial é a opção mais segura e inclusiva." },
          {
            speaker: "Você",
            text: "Missão cumprida! A solução escolhida protege adequadamente os dados dos alunos.",
            actions: ["completeMission"],
          },
        ],
        // Solução 3: Abandonar a ideia
        solution_abandon: [
          { speaker: "Você", text: "Considerando todas as complicações legais, seria melhor abandonar a ideia do grupo de WhatsApp e focar em melhorar o uso da plataforma oficial." },
          { speaker: "Professor Carlos", text: "Tão drástico assim? Não há nenhuma alternativa?" },
          { speaker: "Você", text: "Há alternativas, como obter consentimento formal dos pais, mas isso criaria uma carga administrativa significativa." },
          { speaker: "Professor Carlos", text: "Entendo... Vou pensar em como podemos melhorar o uso da plataforma da escola então." },
          { speaker: "Você", text: "Essa provavelmente é a opção mais segura em termos de conformidade com a LGPD." },
          {
            speaker: "Você",
            text: "Missão cumprida! A solução escolhida protege adequadamente os dados dos alunos.",
            actions: ["completeMission"],
          },
        ],
        // Diálogo após a missão concluída
        mission_complete: [
          { speaker: "Professor Carlos", text: "Olá novamente! Já implementamos as melhorias na plataforma oficial e está funcionando muito melhor agora." },
          { speaker: "Professor Carlos", text: "Os alunos estão mais engajados e não precisamos nos preocupar com questões de privacidade. Obrigado pela orientação!" },
          { speaker: "Você", text: "Fico feliz em ouvir isso! Bom trabalho encontrando uma solução que funciona para todos." },
        ],
      },

      // Diálogos da aluna
      student: {
        // Diálogo inicial
        initial: [
          { speaker: "Clara", text: "Oi! Você é a pessoa da proteção de dados, né? Os professores comentaram que você viria." },
          { speaker: "Você", text: "Isso mesmo. Estou aqui para investigar algumas questões sobre compartilhamento de dados. Você é...?" },
          { speaker: "Clara", text: "Me chamo Clara, sou representante de turma. O Professor Carlos mencionou algo sobre criar um grupo de WhatsApp para a turma." },
          { speaker: "Clara", text: "Alguns colegas estão preocupados com a ideia... não sei se queremos compartilhar nossos números com todo mundo." },
          {
            speaker: "Você",
            text: "Entendo a preocupação. Poderia me dizer mais sobre isso?",
            choices: [
              { text: "O que exatamente preocupa vocês?", nextIndex: 5 },
              { text: "Vocês já conversaram com o professor?", nextIndex: 8 },
              { text: "Vocês usam a plataforma oficial da escola?", nextIndex: 11 },
            ],
          },
        ],
        // Resposta sobre preocupações
        concerns: [
          { speaker: "Clara", text: "Alguns de nós não queremos que nossos números pessoais sejam visíveis para todos os colegas." },
          { speaker: "Clara", text: "E alguns pais também ficaram preocupados quando souberam, acham que não deveríamos usar WhatsApp para coisas da escola." },
          {
            speaker: "Você",
            text: "São preocupações válidas. Alguma outra questão que gostaria de compartilhar?",
            choices: [
              { text: "Vocês já conversaram com o professor?", nextIndex: 8 },
              { text: "Vocês usam a plataforma oficial da escola?", nextIndex: 11 },
              { text: "Entendi o suficiente, obrigado", nextIndex: 14 },
            ],
          },
        ],
        // Resposta sobre conversa com o professor
        talked_to_teacher: [
          { speaker: "Clara", text: "Ainda não diretamente. O Professor Carlos é legal, mas às vezes fica muito empolgado com ideias novas de tecnologia." },
          { speaker: "Clara", text: "Não queríamos desanimá-lo, mas também não estamos confortáveis com a ideia do grupo." },
          {
            speaker: "Você",
            text: "Compreendo. Alguma outra coisa que gostaria de me dizer?",
            choices: [
              { text: "O que exatamente preocupa vocês?", nextIndex: 5 },
              { text: "Vocês usam a plataforma oficial da escola?", nextIndex: 11 },
              { text: "Entendi o suficiente, obrigado", nextIndex: 14 },
            ],
          },
        ],
        // Resposta sobre plataforma oficial
        official_platform: [
          { speaker: "Clara", text: "Sim, mas é bem chata de usar. A interface é confusa e demora para carregar no celular." },
          { speaker: "Clara", text: "Entendo porque o professor quer usar o WhatsApp, seria mais rápido, mas... não sei se é o certo." },
          {
            speaker: "Você",
            text: "Faz sentido. Mais alguma coisa que gostaria de compartilhar?",
            choices: [
              { text: "O que exatamente preocupa vocês?", nextIndex: 5 },
              { text: "Vocês já conversaram com o professor?", nextIndex: 8 },
              { text: "Entendi o suficiente, obrigado", nextIndex: 14 },
            ],
          },
        ],
        // Conclusão do diálogo
        conclusion: [
          { speaker: "Você", text: "Obrigado pelas informações, Clara. Vou conversar com o Professor Carlos sobre essas questões." },
          { speaker: "Você", text: "É importante encontrar uma solução que respeite a privacidade de vocês e também facilite a comunicação." },
          { speaker: "Clara", text: "Legal! Espero que dê pra resolver isso. Seria bom ter uma forma melhor de receber os materiais e avisos." },
          {
            speaker: "Você",
            text: "Vou trabalhar nisso. Se tiver mais alguma preocupação, me avise.",
            actions: ["updateTask", "task2"],
          },
        ],
        // Diálogo após falar com o professor
        after_teacher: [
          { speaker: "Clara", text: "E aí, já falou com o Professor Carlos? O que ele achou?" },
          { speaker: "Você", text: "Sim, conversamos. Expliquei as questões de privacidade envolvidas e as preocupações de vocês." },
          { speaker: "Você", text: "Ele entendeu a situação e vai focar em melhorar o uso da plataforma oficial, que é mais segura." },
          { speaker: "Clara", text: "Ufa, que bom! Espero que consigam deixar a plataforma mais legal de usar." },
          { speaker: "Você", text: "Esse é o plano. Às vezes a solução mais segura não é a mais conveniente inicialmente, mas vale a pena no longo prazo." },
          { speaker: "Clara", text: "Faz sentido. Obrigada por ajudar com isso!" },
        ],
        // Diálogo após a missão concluída
        mission_complete: [
          { speaker: "Clara", text: "Ei, parece que o sistema da escola está bem melhor agora! Fizeram várias atualizações." },
          { speaker: "Clara", text: "O Professor Carlos está conseguindo compartilhar os materiais lá, e até adicionaram notificações por e-mail." },
          { speaker: "Você", text: "Que ótimo! Parece que encontramos uma solução que funciona para todos e protege a privacidade de vocês." },
          { speaker: "Clara", text: "Sim! Valeu mesmo pela ajuda!" },
        ],
      },
    };

    // Determinar qual conjunto de diálogos retornar com base no NPC e estado da tarefa
    if (this.missionComplete) {
      // Se a missão estiver completa, mostrar diálogo pós-missão
      return dialogs[npcId] ? dialogs[npcId]["mission_complete"] : null;
    }

    // Verificar estado específico para cada NPC
    if (npcId === "teacher") {
      // Para o professor
      if (currentTaskId === "talk_to_teacher") {
        return dialogs.teacher.initial;
      } else if (this.dialogState && this.dialogState.teacherDialogSection) {
        // Usar seção específica se houver estado salvo
        return dialogs.teacher[this.dialogState.teacherDialogSection];
      }

      // Default para o professor
      return dialogs.teacher.initial;
    } else if (npcId === "student") {
      // Para a estudante
      if (this.taskCompleted("talk_to_teacher")) {
        return dialogs.student.after_teacher;
      } else {
        return dialogs.student.initial;
      }
    }

    // Fallback: retornar null se não houver diálogo disponível
    return null;
  };

  /**
   * Mostra o painel de diálogo
   */
  schoolMission.prototype.showDialogPanel = function () {
    if (!this.uiElements.dialogContainer) return;

    // Mostrar o container
    this.uiElements.dialogContainer.setVisible(true);
    this.uiElements.dialogContainer.setAlpha(0);

    // Animar entrada
    this.tweens.add({
      targets: this.uiElements.dialogContainer,
      alpha: 1,
      y: { from: this.cameras.main.height - 100, to: this.cameras.main.height - 150 },
      duration: 300,
      ease: "Back.easeOut",
    });
  };

  /**
   * Esconde o painel de diálogo
   */
  schoolMission.prototype.hideDialogPanel = function () {
    if (!this.uiElements.dialogContainer) return;

    // Animar saída
    this.tweens.add({
      targets: this.uiElements.dialogContainer,
      alpha: 0,
      y: this.cameras.main.height - 100,
      duration: 300,
      ease: "Back.easeIn",
      onComplete: () => {
        this.uiElements.dialogContainer.setVisible(false);

        // Limpar as opções de diálogo
        if (this.uiElements.optionsContainer) {
          this.uiElements.optionsContainer.removeAll(true);
        }

        // Resetar estado de diálogo
        this.dialogActive = false;
        this.currentDialog = null;
      },
    });
  };

  /**
   * Exibe a linha atual do diálogo
   */
  schoolMission.prototype.displayCurrentDialogLine = function () {
    if (!this.currentDialog || !this.uiElements.dialogContainer) return;

    // Obter a linha atual
    const lineIndex = this.currentDialog.index;
    const dialogData = this.currentDialog.data;

    // Verificar se há linhas disponíveis
    if (!dialogData || lineIndex >= dialogData.length) {
      this.hideDialogPanel();
      return;
    }

    // Obter informações da linha atual
    const line = dialogData[lineIndex];

    // Atualizar nome do falante
    if (this.uiElements.nameText) {
      this.uiElements.nameText.setText(line.speaker || "");
    }

    // Aplicar efeito de typewriter ao texto
    if (this.uiElements.dialogText) {
      // Parar efeito anterior se existir
      if (this.currentDialog.typewriterEffect) {
        // Tentar finalizar o efeito anterior
        try {
          this.currentDialog.typewriterEffect.skip();
        } catch (e) {
          console.warn("Erro ao finalizar efeito de typewriter:", e);
        }
      }

      // Limpar texto atual
      this.uiElements.dialogText.setText("");

      // Aplicar novo efeito de digitação
      this.currentDialog.typewriterEffect = this.createTypewriterEffect(
        this.uiElements.dialogText,
        line.text || "",
        30 // velocidade
      );
    }

    // Se houver escolhas, mostrar as opções
    if (line.choices && line.choices.length > 0) {
      this.showDialogChoices(line.choices);
      this.currentDialog.choices = line.choices;

      // Ocultar indicador de continuar
      if (this.uiElements.continueIndicator) {
        this.uiElements.continueIndicator.setVisible(false);
      }
    } else {
      // Limpar escolhas anteriores
      if (this.uiElements.optionsContainer) {
        this.uiElements.optionsContainer.removeAll(true);
      }
      this.currentDialog.choices = null;

      // Mostrar indicador de continuar
      if (this.uiElements.continueIndicator) {
        this.uiElements.continueIndicator.setVisible(true);
      }
    }

    // Executar ações associadas à linha
    if (line.actions) {
      this.executeDialogActions(line.actions);
    }
  };

  /**
   * Cria efeito de digitação para texto
   * @param {Phaser.GameObjects.Text} textObject - Objeto de texto
   * @param {string} fullText - Texto completo
   * @param {number} speed - Velocidade da digitação (ms por caractere)
   * @returns {Object} - Controlador do efeito
   */
  schoolMission.prototype.createTypewriterEffect = function (textObject, fullText, speed = 30) {
    // Referência para acesso no temporizador
    const scene = this;

    // Placar atual
    let index = 0;

    // Limpar texto inicialmente
    textObject.setText("");

    // Função para adicionar próximo caractere
    const typeNextChar = function () {
      if (index < fullText.length) {
        // Adicionar próximo caractere
        textObject.setText(textObject.text + fullText[index]);

        // Incrementar índice
        index++;

        // Som de digitação (a cada 3 caracteres para não ser muito repetitivo)
        if (index % 3 === 0 && scene.sound.get("dialog_sound")) {
          scene.sound.play("dialog_sound", { volume: 0.1 });
        }

        // Definir pausa para próximo caractere
        let delay = speed;

        // Pausa mais longa após pontuação
        if (index > 0) {
          const char = fullText[index - 1];
          if ([".", "!", "?"].includes(char)) {
            delay = 300;
          } else if ([",", ";", ":"].includes(char)) {
            delay = 150;
          }
        }

        // Programar próximo caractere
        scene.time.delayedCall(delay, typeNextChar);
      }
    };

    // Iniciar digitação
    typeNextChar();

    // Retornar objeto com métodos para controle
    return {
      skip: function () {
        // Mostrar texto completo imediatamente
        textObject.setText(fullText);
        index = fullText.length;
      },
    };
  };

  /**
   * Mostra opções de escolha para o diálogo
   * @param {Array} choices - Array de opções
   */
  schoolMission.prototype.showDialogChoices = function (choices) {
    if (!choices || !this.uiElements.optionsContainer) return;

    // Limpar opções anteriores
    this.uiElements.optionsContainer.removeAll(true);

    // Criar botões para cada opção
    choices.forEach((choice, index) => {
      // Calcular posição vertical
      const y = index * 40 - (choices.length - 1) * 20;

      // Criar botão
      const button = this.createDialogChoiceButton(0, y, choice.text, index, () => {
        this.selectDialogChoice(index);
      });

      // Adicionar ao container
      this.uiElements.optionsContainer.add(button);
    });
  };

  /**
   * Cria botão de opção de diálogo
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {string} text - Texto da opção
   * @param {number} index - Índice da opção
   * @param {Function} callback - Função a chamar quando selecionado
   * @returns {Phaser.GameObjects.Container} - Container do botão
   */
  schoolMission.prototype.createDialogChoiceButton = function (x, y, text, index, callback) {
    // Container para o botão
    const buttonContainer = this.add.container(x, y);

    // Fundo do botão
    const buttonBg = this.add.graphics();

    // Dimensionar com base no texto
    const buttonText = this.add
      .text(0, 0, text, {
        fontFamily: this.fontFamily,
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Calcular largura do botão (com margem)
    const width = buttonText.width + 40;
    const height = buttonText.height + 16;

    // Desenhar fundo
    buttonBg.fillStyle(0x0d84ff, 0.7);
    buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);

    // Adicionar borda
    buttonBg.lineStyle(2, 0x39f5e2, 0.9);
    buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

    // Adicionar elementos ao container
    buttonContainer.add([buttonBg, buttonText]);

    // Tornar interativo
    buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    // Eventos de interação
    buttonContainer.on("pointerover", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x39f5e2, 0.8);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      buttonBg.lineStyle(2, 0xffffff, 1);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

      buttonText.setColor("#000000");
    });

    buttonContainer.on("pointerout", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x0d84ff, 0.7);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      buttonBg.lineStyle(2, 0x39f5e2, 0.9);
      buttonBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

      buttonText.setColor("#ffffff");
    });

    buttonContainer.on("pointerdown", () => {
      // Efeito de clique
      this.tweens.add({
        targets: buttonContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });

      // Som de clique
      if (this.sound.get("click_sound")) {
        this.sound.play("click_sound", { volume: 0.5 });
      }
    });

    return buttonContainer;
  };

  /**
   * Processa a seleção de uma opção de diálogo
   * @param {number} choiceIndex - Índice da opção selecionada
   */
  schoolMission.prototype.selectDialogChoice = function (choiceIndex) {
    if (!this.currentDialog || !this.currentDialog.choices) return;

    // Obter a escolha selecionada
    const choice = this.currentDialog.choices[choiceIndex];
    if (!choice) return;

    // Salvar a seleção
    this.currentDialog.selectedChoice = choiceIndex;

    // Para o professor, salvar a seção de diálogo com base na escolha
    if (this.currentDialog.npcId === "teacher") {
      this.dialogState = this.dialogState || {};

      // Determinar a seção baseada na escolha
      if (this.currentDialog.index === 4) {
        // Primeira pergunta ao professor
        if (choiceIndex === 0) {
          this.dialogState.teacherDialogSection = "age_question";
        } else if (choiceIndex === 1) {
          this.dialogState.teacherDialogSection = "numbers_question";
        } else if (choiceIndex === 2) {
          this.dialogState.teacherDialogSection = "platform_question";
        }
      } else if (choice.text.includes("Use a plataforma oficial")) {
        this.dialogState.teacherDialogSection = "solution_official";
      } else if (choice.text.includes("Crie o grupo, mas obtenha")) {
        this.dialogState.teacherDialogSection = "solution_authorization";
      } else if (choice.text.includes("Abandone a ideia")) {
        this.dialogState.teacherDialogSection = "solution_abandon";
      } else if (choice.text.includes("Vamos discutir")) {
        this.dialogState.teacherDialogSection = "alternatives";
      }
    }

    // Limpar as opções
    if (this.uiElements.optionsContainer) {
      this.uiElements.optionsContainer.removeAll(true);
    }

    // Mostrar indicador de continuar
    if (this.uiElements.continueIndicator) {
      this.uiElements.continueIndicator.setVisible(true);
    }

    // Avançar para o índice especificado pela escolha ou próximo
    if (choice.nextIndex !== undefined) {
      this.currentDialog.index = choice.nextIndex;
    } else {
      this.currentDialog.index++;
    }

    // Mostrar próxima linha
    this.displayCurrentDialogLine();
  };

  /**
   * Avança para a próxima linha do diálogo
   */
  schoolMission.prototype.advanceDialog = function () {
    if (!this.currentDialog) return;

    // Se houver efeito de digitação em andamento, completar imediatamente
    if (this.currentDialog.typewriterEffect) {
      // Verificar se o texto está completo
      const currentLine = this.currentDialog.data[this.currentDialog.index];
      const currentText = this.uiElements.dialogText.text;

      if (currentText.length < currentLine.text.length) {
        // Completar o texto
        this.currentDialog.typewriterEffect.skip();
        return;
      }
    }

    // Se houver escolhas pendentes, não avançar
    if (this.currentDialog.choices) {
      return;
    }

    // Avançar para a próxima linha
    this.currentDialog.index++;

    // Verificar se chegou ao fim do diálogo
    if (this.currentDialog.index >= this.currentDialog.data.length) {
      // Finalizar diálogo
      this.hideDialogPanel();
      return;
    }

    // Exibir próxima linha
    this.displayCurrentDialogLine();
  };

  /**
   * Executa ações especificadas em uma linha de diálogo
   * @param {Array} actions - Array de ações a executar
   */
  schoolMission.prototype.executeDialogActions = function (actions) {
    if (!actions || !Array.isArray(actions)) return;

    // Processar cada ação
    actions.forEach((action) => {
      if (typeof action === "string") {
        switch (action) {
          case "completeMission":
            // Marcar missão como concluída
            this.time.delayedCall(1000, () => {
              this.completeMission();
            });
            break;

          case "updateTask":
            // Atualizar tarefa atual
            this.completeCurrentTask();
            break;

          default:
            if (action.startsWith("task")) {
              // Marcar tarefa específica como concluída
              const taskId = action;
              this.completeTask(taskId);
            }
            break;
        }
      }
    });
  };

  console.log("✅ Módulo de Diálogos da Missão Escolar carregado");
})();
