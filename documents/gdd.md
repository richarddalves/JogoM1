<img  src="../assets/logointeli.png">

  

  

# GDD - Game Design Document - Módulo 1 - Inteli

  

  

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final_**

  

  

## Nome do Grupo

  

  

#### Eduardo Khaled, Filipe Nunes, George Kapelius, Lívia Negrini, Nathalia Figueredo, Rafael Campos e Richard Alves.

  

  

## Sumário

  

  

[1. Introdução](#c1)

  

  

[2. Visão Geral do Jogo](#c2)

  

  

[3. Game Design](#c3)

  

  

[4. Desenvolvimento do jogo](#c4)

  

  

[5. Casos de Teste](#c5)

  

  

[6. Conclusões e trabalhos futuros](#c6)

  

  

[7. Referências](#c7)

  

  

[Anexos](#c8)

  

  

<br>

  

# <a name="c1"></a>1. Introdução (sprints 1 a 4)

  

  
  
  

  

## 1.1. Plano Estratégico do Projeto

### 1.1.1. Contexto da indústria (sprint 2)

A indústria de jogos educacionais cresce rapidamente com a demanda por ensino interativo. Vários players como Arkos, Kahoot, GoConqr e Educaland, unem aprendizado e entretenimento em plataformas de licenciamento ou acesso freemium. Tecnologias imersivas, como realidade virtual e aumentada, despontam como tendência. Apesar das oportunidades, o mercado é competitivo e requer inovação contínua. O Google for Education, por exemplo, atua globalmente com recursos online para escolas e educadores, fornecendo recursos em nuvem e fomentando experiências pedagógicas inovadoras. Para se destacar, é essencial suprir as necessidades em evolução do setor e oferecer formatos educativos eficazes e experiências interativas.

#### 1.1.1.1. Modelo de 5 Forças de Porter (sprint 2)

A análise das 5 Forças de Porter é uma ferramenta estratégica fundamental para compreender a dinâmica competitiva de um mercado e identificar os fatores que influenciam a rentabilidade das empresas dentro de um setor. No contexto das plataformas educacionais digitais, essa análise permite uma visão aprofundada dos desafios e oportunidades que as organizações enfrentam, desde a entrada de novos concorrentes até o poder de barganha de fornecedores e clientes. Nesta seção, exploraremos como as cinco forças - ameaça de novos entrantes, ameaça de substitutos, poder de barganha dos fornecedores, poder de barganha dos clientes e rivalidade entre concorrentes - impactam o mercado de plataformas educacionais digitais e como o Google for education pode se posicionar estrategicamente para prosperar em um ambiente altamente competitivo e em constante evolução.

##### **a) Ameaça de Novos Entrantes**

O mercado de plataformas educacionais digitais tem experimentado um crescimento significativo nos últimos anos. Dados indicam que o mercado global de e-learning foi avaliado em US$ 315 bilhões em 2021, com projeções de alcançar mais de US$ 1 trilhão até 2028 [4][13]. Na América Latina, o mercado de e-learning atingiu US$ 9 bilhões em 2023, com expectativa de chegar a US$ 16 bilhões até 2026, apresentando uma taxa de crescimento anual composta (CAGR) de 22% [6]. No Brasil, o setor de edtechs (startups de tecnologia educacional) destaca-se como o principal mercado na região, concentrando quase 70% do total de edtechs da América Latina, além de aproximadamente 80% do volume de investimentos e 76,7% das rodadas de financiamento [12].

Apesar do crescimento robusto, a entrada de novos concorrentes no mercado de plataformas educacionais digitais enfrenta barreiras significativas. Empresas estabelecidas, como o Google for Education, possuem vantagens competitivas substanciais, incluindo reconhecimento de marca, infraestrutura robusta e parcerias consolidadas com instituições de ensino [1][9]. Além disso, a conformidade com regulamentações locais e internacionais sobre privacidade e proteção de dados, como a LGPD no Brasil, representa um desafio considerável para novos entrantes [3]. A necessidade de investimentos substanciais em tecnologia, marketing e desenvolvimento de conteúdo também eleva as barreiras de entrada.

Entretanto, a inovação contínua, especialmente em áreas como inteligência artificial aplicada à educação, pode oferecer oportunidades para novos participantes que consigam apresentar propostas de valor diferenciadas e atender às demandas específicas de nichos de mercado.

##### **b) Ameaça de Produtos ou Serviços Substitutos**

O setor educacional contemporâneo oferece uma variedade de alternativas às plataformas digitais integradas, abrangendo desde métodos tradicionais de ensino presencial até recursos tecnológicos diversos. Ferramentas de comunicação e colaboração, como Microsoft Teams e Zoom, têm sido amplamente utilizadas para viabilizar aulas remotas e reuniões educacionais [3][9], especialmente em contextos onde a interação em tempo real é essencial. Essas ferramentas permitem que instituições de ensino conduzam atividades educacionais sem a necessidade de plataformas educacionais dedicadas, oferecendo funcionalidades como videoconferências, compartilhamento de tela e gravação de aulas.

Além disso, redes sociais e aplicativos de mensagens instantâneas, como WhatsApp e Facebook, têm sido empregados para complementar ou, em alguns casos, substituir plataformas educacionais formais, facilitando a comunicação entre professores e alunos e a disseminação de materiais didáticos. A facilidade de uso e a familiaridade dos usuários com essas ferramentas contribuem para sua adoção em contextos educacionais. Entretanto, a utilização dessas alternativas pode apresentar desafios relacionados à padronização dos processos educacionais, à segurança dos dados e à ausência de funcionalidades específicas para gestão acadêmica.

Para mitigar a ameaça representada por esses substitutos, o Google for Education deve destacar seus diferenciais, como a integração de diversas ferramentas em uma única plataforma, a conformidade com normas de segurança e privacidade e a oferta de recursos específicos para o ambiente educacional, que facilitam tanto o processo de ensino quanto o de aprendizagem.

##### **c) Poder de Barganha dos Fornecedores**

No mercado de plataformas educacionais digitais, o poder de barganha dos fornecedores é influenciado por diversos fatores que podem afetar a dinâmica competitiva e a capacidade das empresas de manterem suas operações de forma eficiente [7].

_Dependência de Fornecedores de Infraestrutura Tecnológica_


As plataformas educacionais digitais dependem significativamente de fornecedores de infraestrutura tecnológica, como serviços de computação em nuvem e análise de dados (por exemplo, AWS ou Azure). Empresas que utilizam majoritariamente serviços de gigantes como Microsoft Azure e Amazon Web Services podem enfrentar desafios nas negociações, uma vez que esses fornecedores detêm considerável controle sobre os termos de oferta e custos [7]. Essa dependência pode limitar a flexibilidade das plataformas educacionais em ajustar suas operações ou negociar melhores condições contratuais.

_Custos de Troca Elevados_


A mudança de fornecedores de tecnologia pode acarretar custos significativos devido à complexidade envolvida na migração de sistemas, treinamento de equipes e integração de novos serviços. Estudos indicam que os custos associados à transição para novos fornecedores de TI podem ser substanciais, fortalecendo o poder de barganha dos fornecedores atuais e criando barreiras para a diversificação ou substituição desses parceiros [7]. Essa situação pode levar as plataformas educacionais a manterem relações duradouras com seus fornecedores, mesmo diante de condições menos favoráveis.

_Conformidade com Regulamentações_ 


Os fornecedores desempenham um papel crucial na assistência às plataformas educacionais para o cumprimento de regulamentações rigorosas relacionadas à privacidade e proteção de dados, como a Lei Geral de Proteção de Dados (LGPD) no Brasil [3]. As penalidades por não conformidade podem ser severas, o que aumenta a dependência das plataformas em relação a fornecedores que possuam as competências necessárias para assegurar a conformidade regulatória. Essa dependência pode ampliar o poder de barganha dos fornecedores, especialmente daqueles especializados em segurança e compliance.

_Parcerias Exclusivas e Dependência_ 


Parcerias exclusivas com fornecedores-chave podem intensificar a dependência das plataformas educacionais, conferindo aos fornecedores maior influência sobre preços e condições de serviço. A formação de acordos estratégicos de alto valor pode criar uma relação de dependência que dificulta a negociação de termos mais favoráveis ou a busca por alternativas no mercado [1]. Essa dinâmica reforça o poder de barganha dos fornecedores, especialmente quando oferecem serviços ou produtos altamente especializados e críticos para a operação das plataformas.

_Concorrência entre Fornecedores_


Apesar das dependências mencionadas, a presença de múltiplos fornecedores no mercado global de plataformas de e-learning pode moderar o poder de barganha individual de cada fornecedor [4][13]. A disponibilidade de alternativas permite que as plataformas negociem melhores termos ou considerem a substituição de fornecedores que não atendam às suas expectativas de custo, qualidade ou inovação. No entanto, essa capacidade de negociação é limitada quando os fornecedores detêm tecnologias proprietárias ou oferecem serviços altamente diferenciados.



O poder de barganha dos fornecedores no mercado de plataformas educacionais digitais é determinado por uma combinação de dependência tecnológica, custos de transição, necessidade de conformidade regulatória e estrutura de parcerias estabelecidas [7]. Para mitigar os riscos associados a esse poder de barganha, as plataformas podem buscar diversificar seus fornecedores, investir em soluções internas quando viável e negociar contratos que ofereçam maior flexibilidade e proteção contra aumentos inesperados de custos ou alterações nos termos de serviço.

##### **d) Poder de Barganha dos Clientes**

No mercado de plataformas educacionais digitais, os clientes — que incluem instituições de ensino, empresas e estudantes individuais — possuem um poder de barganha significativo. Esse poder é influenciado por diversos fatores, como a disponibilidade de alternativas, a sensibilidade ao preço e a capacidade de negociação dos compradores.

_Disponibilidade de Alternativas_ 


A presença de múltiplas plataformas educacionais digitais, como Coursera, Udemy e Khan Academy, oferece aos clientes uma variedade de opções para atender às suas necessidades educacionais. Por exemplo, a Udemy disponibiliza mais de 130.000 cursos em diversas áreas, proporcionando aos consumidores uma ampla gama de escolhas. Essa diversidade aumenta o poder de barganha dos clientes, pois eles podem comparar ofertas e selecionar a que melhor se adapta às suas exigências e orçamento [10].

_Sensibilidade ao Preço_


A sensibilidade ao preço é um fator determinante no poder de barganha dos clientes. Em um mercado competitivo, os consumidores tendem a buscar soluções que ofereçam o melhor custo-benefício. De acordo com dados da Rock Content [10], clientes com alto poder de barganha podem pressionar os vendedores a reduzirem preços ou a aumentarem a qualidade dos produtos e serviços oferecidos. Essa pressão força as empresas a ajustarem suas estratégias de precificação e qualidade para manter a competitividade e a satisfação do cliente.

_Capacidade de Negociação dos Compradores_


Grandes instituições educacionais e corporativas frequentemente realizam compras em volume, o que lhes confere maior poder de negociação. Segundo análise da DCF Modeling sobre a Pearson PLC, distritos escolares e instituições de ensino superior representam volumes de compra anual de US$ 4,2 bilhões e US$ 3,7 bilhões, respectivamente, proporcionando-lhes alta alavancagem nas negociações [5]. Essa capacidade permite que esses clientes obtenham condições mais favoráveis, como descontos, personalizações e termos contratuais vantajosos.

_Custos de Troca_


Embora existam diversas opções no mercado, os custos associados à mudança de uma plataforma para outra podem influenciar o poder de barganha dos clientes. Fatores como a curva de aprendizado para utilizar uma nova plataforma, a migração de dados e a integração com sistemas existentes podem representar barreiras para a troca [10]. No entanto, plataformas que oferecem processos de transição simplificados e suporte dedicado podem reduzir esses custos, facilitando a mudança e, consequentemente, aumentando o poder de barganha dos clientes.





O poder de barganha dos clientes no setor de plataformas educacionais digitais é fortalecido pela ampla disponibilidade de alternativas, sensibilidade ao preço, capacidade de negociação e considerações sobre os custos de troca [7][10]. Para manter a competitividade, as empresas devem focar na diferenciação de seus produtos, oferecer preços competitivos, garantir alta qualidade e proporcionar excelente suporte ao cliente, atendendo às expectativas e necessidades específicas de seus públicos-alvo.

##### **e) Rivalidade entre os Concorrentes Existentes**

O mercado de plataformas educacionais digitais caracteriza-se por uma intensa rivalidade entre os concorrentes, impulsionada pela crescente demanda por soluções de aprendizagem online e pelo avanço tecnológico [1][7][10]. Empresas estabelecidas, como Coursera, Udemy e Khan Academy, competem diretamente com o Google for Education, oferecendo uma ampla gama de cursos e recursos educacionais. Por exemplo, a Coursera reportou, em 2022, uma receita anual de US$ 522,2 milhões, enquanto a Udemy alcançou US$ 518,7 milhões no mesmo período (Modelo de Fluxo de Caixa) [5].

_Fatores que Intensificam a Rivalidade_


- Número de Concorrentes: A presença de múltiplos players no mercado aumenta a competição por participação de mercado.  
- Crescimento do Setor: O mercado de plataformas de aprendizado online está em expansão, com taxas de crescimento significativas, o que atrai novos entrantes e intensifica a concorrência [4][13].  
- Custos Fixos Elevados: Empresas investem consideravelmente em infraestrutura tecnológica e desenvolvimento de conteúdo, o que exige uma base ampla de usuários para diluir os custos e alcançar rentabilidade.  
- Diferenciação de Produtos: A oferta de funcionalidades exclusivas, parcerias com instituições renomadas e a qualidade do conteúdo são fatores-chave para se destacar no mercado [1][9].

_Estratégias Competitivas_

- Inovação Contínua: Investimentos em pesquisa e desenvolvimento para aprimorar a experiência do usuário e incorporar novas tecnologias, como inteligência artificial e realidade aumentada [7].  
- Parcerias Estratégicas: Colaborações com universidades e instituições educacionais para ampliar a oferta de cursos e certificações reconhecidas [1].  
- Modelos de Precificação Flexíveis: Oferecer planos de assinatura, cursos avulsos e conteúdos gratuitos para atender a diferentes perfis de usuários [10].


A rivalidade no mercado de plataformas educacionais digitais é acentuada por diversos fatores, incluindo o número de concorrentes, o crescimento do setor e a necessidade de diferenciação. Para se destacar, as empresas devem investir em inovação, estabelecer parcerias estratégicas e oferecer modelos de precificação que atendam às necessidades dos usuários.

### 1.1.2. Análise SWOT (sprint 2)

Análise SWOT do Google for Education no setor de jogos educacionais:

_Forças_: Forte integração com escolas através do Google Classroom, infraestrutura de nuvem robusta e reconhecimento da marca.

_Fraquezas_: Dependência de conectividade à internet e dificuldade em adaptar conteúdos a currículos regionais.

Oportunidades: Crescente demanda por gamificação na educação, crescimento do ensino híbrido e remoto, e expansão com tecnologias emergentes como IA e realidade aumentada.

_Ameaças_: Alta concorrência com players como Kahoot e GoConqr, além de preocupações crescentes com a privacidade e segurança dos dados dos usuários.



  

  

### 1.1.3. Missão / Visão / Valores (sprint 2)

  

  

Missão: Democratizar o acesso à educação de qualidade, oferecendo ferramentas digitais que capacitam alunos e educadores a alcançarem seu potencial máximo.

Visão: Ser a principal plataforma global de aprendizado inclusivo e inovador, preparando a próxima geração para os desafios do futuro.

Valores: Acessibilidade, Inclusão, Inovação e Compromisso com o impacto positivo na educação.

  

  

### 1.1.4. Proposta de Valor (sprint 4)

  

  

*Posicione aqui o canvas de proposta de valor. Descreva os aspectos essenciais para a criação de valor da ideia do produto com o objetivo de ajudar a entender melhor a realidade do cliente e entregar uma solução que está alinhado com o que ele espera.*

  

  

### 1.1.5. Descrição da Solução Desenvolvida (sprint 4)

  

  

*Descreva brevemente a solução desenvolvida para o parceiro de negócios. Descreva os aspectos essenciais para a criação de valor da ideia do produto com o objetivo de ajudar a entender melhor a realidade do cliente e entregar uma solução que está alinhado com o que ele espera. Observe a seção 2 e verifique que ali é possível trazer mais detalhes, portanto seja objetivo aqui. Atualize esta descrição até a entrega final, conforme desenvolvimento.*

  

  

### 1.1.6. Matriz de Riscos (sprint 4)

  

  

*Registre na matriz os riscos identificados no projeto, visando avaliar situações que possam representar ameaças e oportunidades, bem como os impactos relevantes sobre o projeto. Apresente os riscos, ressaltando, para cada um, impactos e probabilidades com plano de ação e respostas.*

  

  

### 1.1.7. Objetivos, Metas e Indicadores (sprint 4)

  

  

*Definição de metas SMART (específicas, mensuráveis, alcançáveis, relevantes e temporais) para seu projeto, com indicadores claros para mensuração*

  

  

## 1.2. Requisitos do Projeto (sprints 1 e 2)


Esta seção apresenta os requisitos essenciais para o desenvolvimento do jogo, garantindo uma experiência interativa, acessível e educativa. Os requisitos estão organizados em funcionalidades que vão desde a criação da tela inicial até a implementação de sistemas de pontuação e acessibilidade. Cada requisito detalha os sub-requisitos e as tarefas necessárias para sua implementação, assegurando que o jogo proporciona uma navegação intuitiva, desafios progressivos e suporte ao usuário com base nos princípios da LGPD.






Requisito






R01 - Desenvolver tela de início


_Sub-requisitos:_
- Criar botão de jogar
- Criar botão de configuração
- Criar botão de informações
- Criar botão de sair

 
_Tarefas:_
- Elaboração o design da tela inicial
- Inserir logo na tela
- Implementar design da tela inicial




R02 - Criar cenários diferentes e complexos


_Tarefas:_
- Elaborar os designs dos cenários
- Implementar os cenários de cada missão
- Definir o posicionamento e transição entre cenários


R03 - Criar novo mapa:



_Sub-Requisitos:_
- Mapear os locais principais
- Fazer o mapa no Tilled

 
_Tarefas:_
- Encontrar os assets
- Estruturar todo o mapa em camadas




R04- Implementar Mini Games:


_Tarefas:_
- Estruturar minigames
- Fazer o design de cada minigame
- Programar os Mini Games




R05 - Definir critérios de dificuldade conforme avanço no jogo


_Tarefas:_
- Implementar a lógica de progressão entre os níveis, do mais fácil ao mais difícil.


R06 - Criar suporte ao usuário e dicas



_Sub-requisitos:_
- Criar botão em formato de livro no canto superior direito da tela

  
_Tarefas:_
- Produzir os “10 mandamentos” com as diretrizes da LGPD
- Fornecer dicas ao longo do jogo






R07 - Estruturar navegação intuitiva entre os módulos e cenários


_Sub-requisitos:_
- Incluir vetor de direção para auxiliar navegação
  
_Tarefas:_
- Elaborar a integração de cenas, com ordem das missões e seus cenários




R08 - Interação mapa-jogador


_Sub-Requisitos:_
- Mapa com objetos colidíveis
- Camadas no mapa (exemplo escadas)
- Mapa acompanhar a movimentação do personagem (jogo de câmera)

  
_Tarefas:_
- Desenvolver interface
- Design do novo mapa
- Incluir Limitações




R09 - Implementar feedback automático


_Tarefas:_
- Criar a design para exibição do feedback
- Elaborar cada feedback fornecendo explicações sobre as respostas do jogadores a cada missão
- Incluir referências das respostas corretas




R10 - Implementar tela para escolher personagem


_Sub-requisitos:_
- Criar opção de escolher personagens diversos (cores de pele, cabelo e roupas)
- Criar opção de inserir o nome
- Criar botão de continuar

  
_Tarefas:_
- Elaborar os designs
- Fazer os personagens






R11 -Criar os NPC´s:


_Sub-Requisitos:_
- Desenvovler NPC's para designar as funções e atividades que o player deverá realizar.

  
_Tarefa:_
- Idealizar suas funções dentro da história
- Devolver o Design
- Implementar na programação






R12 - Implementar sistema de pontuação


_Sub-requisitos:_
- Incluir barra de progresso com número de missões cumpridas nas telas do jogo

  
_Tarefa:_
- Programar lógica de pontuação




R13 - Implementar tela com feedback final sobre o desempenho do jogador


_Sub-requisitos:_
- Exibir pontuação final e feedback

  
_Tarefas:_
- Criar a design para a tela final






R14 - Desenvolver design responsivo


_Tarefas:_
- Fazer responsividade para outros dispositivos. (desktops, smartphones).






R15- Recursos Complementares:


_Sub-requisitos:_
- Barra de evolução do jogo
- Barra de Missões

  
_Tarefas:_
- Criar o Design da Barra de evolução dentro do jogo
- Criar barra para receber os alertas de cada missão




R16 - Garantir acessibilidade 


_Sub-requisitos:_
- Configurar botão de acessibilidade, implementando funcionalidade de leitor de tela, pessoas com deficiência visual e ou dificuldades motoras


_Tarefas:_
- Implementar ferramentas de adaptação da interface




A implementação desses requisitos garantirá um jogo dinâmico, acessível e alinhado aos princípios da LGPD, proporcionando aos jogadores uma experiência envolvente e educativa. O desenvolvimento segue um planejamento estruturado para cobrir desde o design das telas até a lógica de progressão e feedback automático, assegurando uma jornada interativa e informativa.

  

## 1.3. Público-alvo do Projeto (sprint 2)

  
O jogo é voltado para estudantes do ensino fundamental I e II, com idades entre 9 e 17 anos, especialmente aqueles de escolas públicas, que muitas vezes têm menos acesso a materiais educativos sobre segurança digital e proteção de dados. Esses alunos, imersos em um mundo cada vez mais digital, utilizam redes sociais, aplicativos e plataformas online sem necessariamente compreender os riscos envolvidos, tornando essencial a introdução de conceitos da LGPD de forma acessível e interativa.


O jogo possui uma linguagem simples e de fácil entendimento, uma vez que é direcionado a crianças que, muitas vezes, não possuem uma boa base financeira e familiar. Essa falta de recursos pode dificultar o acesso à educação de qualidade, reduzindo as oportunidades de aprendizado dessas crianças, além de impactar seu julgamento de valores e seu senso de certo e errado.


Além disso, o jogo também se destina a professores, que podem utilizá-lo como uma ferramenta pedagógica para aprimorar suas metodologias de ensino e aprender formas eficazes de abordar o tema com seus alunos. Como educadores, eles desempenham um papel crucial na conscientização sobre privacidade e segurança digital, ajudando a preparar os estudantes para um uso mais responsável da tecnologia no cotidiano.


Outro objetivo é conscientizar professores e alunos sobre a maneira correta de agir em situações que envolvam a imagem ou informações pessoais de terceiros.



# <a name="c2"></a>2. Visão Geral do Jogo (sprint 2)

  

  

## 2.1. Objetivos do Jogo (sprint 2)

  

 O DPO Hero é um jogo com intuitos acadêmicos que coloca o jogador no papel de um agente da Agência Global de Proteção de Dados (AGPD), responsável por garantir a segurança digital e a privacidade das pessoas. Através de missões e mini games, os jogadores aprendem os princípios da Lei Geral de Proteção de Dados (LGPD), enfrentando dilemas reais que as pessoas estão sujeitas a sofrer em seu dia a dia. Além disso, ao final do jogo, a partir do desempenho nos minigames e missões o usuário verá o quanto a cidade ficou protegida por meio de um sistema de pontuação.



Estamos criando esse jogo com o princípio de ensinar a Lei Geral de Proteção de Dados (LGPD) de forma interativa para professores e alunos. No jogo abordamos práticas de privacidade, segurança digital, direitos e deveres em relação aos dados pessoais.



Buscamos conseguir conscientizar as pessoas sobre os riscos presentes de compartilhar dados sensíveis, como você sempre está sujeito a esse tipo de risco tanto em ambientes escolares quanto fora e quais são as leis que temos que tentar impedir que esse tipo de situação ocorra.




  

  

## 2.2. Características do Jogo (sprint 2)

  

  

### 2.2.1. Gênero do Jogo (sprint 2)

  

  
O jogo terá elementos de arcade, modo história e um aspecto educativo.


  

  

### 2.2.2. Plataforma do Jogo (sprint 2)

  

  

Será acessível via plataforma web, compatível com diversos navegadores.

  

  


  

  

### 2.2.3. Número de jogadores (sprint 2)

  

  



O jogo será desenvolvido para um único jogador.


  

  

### 2.2.4. Títulos semelhantes e inspirações (sprint 2)

  

  

Interland e robbery bob.

  

  

### 2.2.5. Tempo estimado de jogo (sprint 5)

  

  

*Ex. O jogo pode ser concluído em 3 horas passando por todas as fases.*

  

  

*Ex. cada partida dura até 15 minutos*

  

  

# <a name="c3"></a>3. Game Design (sprints 2 e 3)

  

  

## 3.1. Enredo do Jogo (sprints 2 e 3)

  

  

Nosso personagem principal, o Agente H, é um novo agente contratado pela Agência Global de Proteção de Dados (AGPD). Sua missão é resolver problemas relacionados à LGPD dentro de Data City, enfrentando desafios em escolas, empresas e outros ambientes. À medida que as missões são concluídas e conforme o desempenho do jogador, a cidade é salva, e o nível de perigo diminui — evidenciado por uma barra de desempenho na parte superior da tela.

Primeiramente, ele conversa com um agente experiente, que lhe explica os fundamentos da LGPD e entrega um "celular" com os "10 mandamentos" da legislação. Esse dispositivo permitirá que ele consulte as diretrizes sempre que necessário e receba notificações sobre suas missões. Após esse encontro, o jogador é direcionado a um minigame inspirado no jogo Papers, Please, onde aprenderá a diferenciar dados sensíveis de dados pessoais.

Seu primeiro conflito surge logo após essa fase de aprendizagem, quando ele recebe um alerta sobre um risco de vazamento de dados em uma escola. O jogador é então direcionado ao mapa do jogo e, ao chegar ao local, encontra um problema envolvendo um professor que deseja criar um grupo com seus alunos. Para solucionar a questão, será necessário completar um minigame específico.

A missão seguinte ocorre durante um passeio escolar. Um professor publica no Instagram uma foto da turma, e uma aluna, que não gosta de ser exposta em redes sociais, fica extremamente envergonhada. O Agente H orienta o professor sobre como agir em situações como essa, precisando completar mais um minigame para resolver a situação.

Na missão seguinte, ele se infiltra em uma empresa suspeita de utilizar o ambiente para roubar dados sensíveis. O Agente H deve investigar e, dentro de um minigame, o jogador precisa corrigir diversas falhas de segurança no sistema da cidade.

O jogo, então, se encerra com uma perspectiva de conscientização, reforçando a importância da proteção de dados após todas as situações de perigo enfrentadas.




  

  

## 3.2. Personagens (sprints 2 e 3)

  

  

### 3.2.1. Controláveis

  
Em qualquer grande aventura, os heróis são tão importantes quanto os desafios que enfrentam. Nesta seção, você conhecerá o personagem controlável e sua história. 

<div align="center">
  <sub>Uma das opções dos personagens principais</sub><br>
  <img src="../assets/imagens/homemcabelopreto.png" width="20%" 
  alt="Título"><br>
</div>

Esse é o Agente H., ele é um jovem recruta que acabou de ingressar na Agência Global de Proteção de Dados. Na sua jornada do herói, ele recebe um chamado de um Agente Experiente para resolver problemas de uma cidade. Ele está aprendendo sobre a LGPD, por isso sempre anda com um celular com todos os mandamentos (diretrizes). Os jogadores poderão escolher entre cinco personagens distintos para vivenciar a jornada desse herói, com diferentes características. Planejamos ter personagens mulheres, negros(as), indígenas e cadeirantes.



  <div align="center"><br>
  <img width="40%" alt="personagens" src="https://github.com/user-attachments/assets/30092c91-1dd7-433a-8acf-2b2db618cf60" />
  <br><sub>Imagem: Personagens desenvolvidos</sub>
  </div>


### 3.2.2. Non-Playable Characters (NPC)

  
 

Além do protagonista, diversos personagens desempenham papéis fundamentais na construção da narrativa e da experiência do jogo. Nesta seção, serão apresentados os principais coadjuvantes e antagonistas que interagem com o jogador, fornecendo orientações, desafios e dilemas relacionados à LGPD. Cada um deles contribui para tornar a jornada mais imersiva e educativa.

_Cientista_
O mentor do protagonista é responsável por orientar os novos agentes da AGPD, seu nome é Agente P. Ele fornece informações sobre as missões, dá dicas sobre a LGPD e apresenta novos desafios ao jogador.

<div align="center">
  <sub>Imagem do cientista que é o mentor do princial</sub><br>
  <img src="../assets/imagens/cientistacientista.png" width="10%" 
  alt="Cientista"><br>
  
</div>

_Professora da Escola_
O primeiro NPC com quem o jogador interage em uma missão. Ele enfrenta dificuldades para entender os limites da privacidade de alunos e precisa da orientação do agente da AGPD.

<div align="center">
  <sub>Imagem da Professora que vaza os dados</sub><br>
  <img src="../assets/imagens/mulherjogo.png.png" width="10%" 
  alt="Professora"><br>
</div>


_Funcionário da Empresa_
Um suspeito de envolvimento com o vazamento de dados corporativos. O jogador deve investigar se ele realmente está violando a LGPD ou se é apenas um mal-entendido.


<div align="center">
  <sub>Imagem do funcionário da Empresa que rouba dados</sub><br>
  <img src="../assets/imagens/funcionario.png" width="20%" 
  alt="Funcionário"><br>
  
</div>


Os personagens apresentados enriquecem a trama e garantem uma experiência envolvente para o jogador. Seja auxiliando na jornada do Agente H. ou criando obstáculos que desafiam seus conhecimentos sobre a LGPD, cada NPC desempenha um papel essencial na dinâmica do jogo. Com essa diversidade de interações, o aprendizado se torna mais instigante e conectado à realidade da proteção de dados.

### 3.2.3. Diversidade e Representatividade dos Personagens

  

  

O Brasil é um país de grande diversidade racial, de gênero e de condições físicas, e um jogo voltado para a conscientização sobre proteção de dados deve se preocupar com a representatividade para engajar melhor seu público. Escolher personagens que representam diferentes grupos sociais amplia a identificação dos jogadores com a narrativa, aumentando o impacto educacional do jogo. 

A sociedade brasileira é marcada por desigualdades históricas e desafios relacionados à inclusão. Pessoas negras ainda enfrentam dificuldades de acesso a oportunidades em diversos setores, incluindo tecnologia e segurança digital. Mulheres, especialmente em áreas de tecnologia e segurança da informação, ainda são sub-representadas e frequentemente enfrentam barreiras estruturais. Pessoas com deficiência, como cadeirantes, também lidam com obstáculos para a inclusão social e digital, seja por falta de acessibilidade ou por preconceitos.

As personagens do game foram desenvolvidas de forma a se alinhar ao público-alvo definido na Seção 1.3, composto por jovens e adultos que lidam diariamente com dados e têm perfis diversos. O Agente H., como protagonista, representa um jovem em fase de aprendizado, o que facilita a identificação dos jogadores que estão começando a entender a LGPD. O Agente P. assume o papel de mentor, reforçando a importância da orientação no processo educativo, enquanto NPCs como a professora da escola e o funcionário da empresa trazem dilemas reais enfrentados na sociedade brasileira sobre privacidade e proteção de dados.

As situações refletem ameaças concretas, como vazamento de dados e falta de conscientização, temas altamente relevantes no Brasil, onde casos de uso indevido de informações pessoais são recorrentes. Por exemplo, uma pesquisa do Security Leaders aponta que 30% dos  dos 7 mil entrevistados já tiveram seus dados vazados. Dessa forma, a presença dos personagens comuns sendo responsáveis por essas ações cria uma ponte entre o universo do jogo e a realidade, tornando o aprendizado mais contextualizado e aplicável.

Ao apresentar personagens que refletem esses grupos, o jogo não apenas reconhece essa diversidade, mas também contribui para a normalização da presença de pessoas negras, mulheres e pessoas com deficiência em espaços de tecnologia e segurança digital.

Espera-se que a escolha desses personagens gere um impacto educativo significativo, sensibilizando os jogadores sobre a importância da proteção de dados e incentivando a aplicação da LGPD no dia a dia. Além disso, a inclusão de figuras comuns, como professores e funcionários de empresas, aproxima o conteúdo da vivência do público, tornando a experiência mais imersiva e relevante.

O impacto esperado dessa abordagem é proporcionar maior identificação por parte dos jogadores e reforçar a mensagem de que a proteção de dados é um tema relevante para todos, independentemente da formação ou trajetória profissional.


  

  

## 3.3. Mundo do jogo (sprints 2 e 3)

  

  

### 3.3.1. Locações Principais e/ou Mapas (sprints 2 e 3)

  

  

O jogo se passa em diferentes cenários que representam situações reais de proteção de dados e segurança digital. Cada local traz desafios específicos, abordando a Lei Geral de Proteção de Dados (LGPD) de forma interativa.

| Localização  | No enredo      | Idade | Imagens      |
|---- |-----------|------ |--------------|
| Agência Global de Proteção de Dados (AGPD)| Base inicial do protagonista, onde ele recebe orientações sobre a LGPD e seu primeiro desafio.     | Ambiente futurístico industrial, relativamente escuro, com painéis tecnológicos espalhados pelo local. A área jogável será relativamente pequena, já que a agência será apenas usado no começo do jogo, então criando uma região controlada para o jogador acostumar com os controles do jogo.    |  <div align="center"> <sub></sub><br><img src="../assets/empresa.jpeg" width="100%" alt="agencia"><br></div>   | 
| Mapa   | Local onde o personagem vai transitar entre os locais de cada desafio/fase      | Cidade pequena, cortada ao meio por um rio, e com o exterior sendo um grande parque. Muitos prédios, casas, e todos os locais do jogo.   | <div align="center"> <sub></sub><br><img src="../assets/mapa.jpeg" width="100%" alt="mapa"><br></div> |
| Escola   | Ambiente educacional onde ocorrem desafios sobre compartilhamento indevido de informações e proteção de dados dos alunos.     |Tem um layout de uma escola comum, a parte jogável inclui 4 salas de aulas relativamente parecidas. Tem uma escada que sobe para um andar superior. Aqui estarão os  alunos e professores.   | <div align="center"> <sub></sub><br><img src="../assets/escola.jpeg" width="100%" alt="escola"><br></div>| 
| Sala dos Professores   | Local onde há um debate sobre postagens de fotos dos alunos nas redes sociais sem consentimento.    |  Localizado no andar superior do colégio, sendo uma pequena área extremamente luxioso comparado ao resto do colégio relativamente humilde. Aqui estarão os professores.  |  <div align="center"> <sub></sub><br><img src="../assets/rascunho_sala_dos_professores.jpeg" width="100%" alt="sala dos professores"><br></div>   | 
| Parque | Local onde acontecerá o passei da escola e o personagem enfrentará o desafio sobre consentimento na utilização de dados.| Região inteiramente natural, com apenas alguns elementos criados pelo homem. Será uma floresta com muitas árvores, pedras e grama com algumas pequenas casas humildes.  | <div align="center"> <sub></sub><br><img src="../assets/rascunho_parque.jpeg" width="100%" alt="parque"><br></div> | 
| Empresa | O protagonista tenta proteger os dados das pessoas que estão sendo roubados por uma empresa| Ambiente moderno, com painéis tecnológicos espalhados pelo local e vários computadores. | <div align="center"> <sub></sub><br><img src="../assets/empresa (2).jpeg" width="100%" alt="empresa"><br></div> | 









As localizações do jogo foram projetadas para criar uma experiência imersiva e didática, refletindo cenários do cotidiano onde desafios relacionados à proteção de dados podem ocorrer. Desde a Agência Global de Proteção de Dados, que serve como ponto de partida para o aprendizado, até ambientes como escolas, empresas e residências, cada espaço contribui para a narrativa e reforça a importância da LGPD no dia a dia.

  

  

### 3.3.2. Navegação pelo mundo (sprints 2 e 3)

  

  

Movimentação dos Personagens e Acesso às Fases
O jogador se movimenta entre os cenários de acordo com a progressão da história. O acesso às fases ocorre conforme avanço nas missões e resolução dos desafios propostos. Abaixo está um resumo das fases e como elas são acessadas:


  
| Capítulo |Nome |Descrição | Localização | Acesso |
|----------|------|--------|------------|---------|
| 1 | Identificação de Dados Sensíveis | Introdução ao jogo com minigame de classificação de dados. | Agência Secreta de Segurança de Dados | O jogador inicia automaticamente nesta fase.|
|2| Alerta na Escola | Exploração da escola e interação com personagens para resolver problema de grupo de alunos. | Escola |Desbloqueado após concluir o minigame do Capítulo 1.|
|3 | Passeio com a Escola| O professor publica fotos sem consentimento. O jogador participa de quizzes para resolver a situação.|Diversos pontos da cidade|Desbloqueado após concluir o Capítulo 2.|
|4 |Rede Suspeita Coletando Dados| O jogador se infiltra em uma empresa para recuperar dados roubados nos cadastros. |Empresa de Tecnologia| Desbloqueado após concluir o Capítulo 3.|





Mecânica de Progressão e Feedback:


- O jogador será guiado por um vetor que indicará o caminho para a próxima fase.
- Após cada fase, ele receberá um feedback sobre seu desempenho e o impacto das suas decisões na segurança da cidade.
- Sem segunda chance nos minigames: O desempenho do jogador em cada minigame afeta diretamente o estado final da cidade. Para melhorar sua pontuação, ele precisará jogar novamente desde o início, corrigindo erros anteriores.


Finalização do Jogo:


- Ao final, será exibido um resumo geral, indicando o quanto a cidade foi salva com base no desempenho do jogador em todas as fases.














  

### 3.3.3. Condições climáticas e temporais (sprints 2 e 3)

  

Embora não seja um fator principal no jogo, podem ser incluídas variações climáticas para aumentar a imersão, como:



- Escola: Dia ensolarado, representando um ambiente tranquilo para aprendizado.
- Empresa Suspeita: Clima chuvoso e escuro, aumentando a tensão da missão de infiltração.
- Computador de Casa: Ambiente noturno, refletindo o perigo da navegação na internet sem segurança.

- O tempo no jogo é linear, com eventos que se desenrolam conforme o jogador avança nos desafios.


  

### 3.3.4. Concept Art (sprint 2)

  

  

Nesta seção, apresentamos a Concept Art que guiou a criação do jogo, revelando o processo criativo por trás dos cenários e personagens que compõem esse universo do jogo.




A imagem 1, logo abaixo, foi nosso primeira tentativa de idealização das telas no figma. Ápos esse desenvolvimento tivemos a ideia de trabalahr mais na logo e no nome para que trouxesse mais o conceito que queríamos para o jogo.
<div align="center"> <sub></sub><br><img src="../assets/conceptArtInicial.png" width="40%" alt=" primeira tela inicial"><br><sup>Imagem 1: Representa a primeria ideia da tela inicial do jogo </sup></div> 





Logo em seguida, desenvolvemos a tela da conversa (Imagem 2). Aprovamos essa estrutura e optamos por manter o mesmo design, fundo e conceito.
<div align="center"><sub></sub><br><img src="../assets/conceptArtConv.png" width="40%" alt="conversa"><br><sup>Imagem 2: Conversa entre o protagosnista e o mentor </sup></div> 






No primeiro minigame, queríamos trazer o conceito do jogo Papers, Please, onde o jogador aprova ou rejeita documentos. No entanto, em vez de um carimbo, optamos por botões para criar um ambiente mais moderno, como mostrado na Imagem 3 abaixo.
<div align="center"> <sub></sub><br><img src="../assets/conceptArtMesa.png" width="40%" alt="minigame"><br><sup>Imagem 3: Idealização do minigame e sua dinâmica de botões</sup></div> 








Nesta versão (Imagem 4), tentamos um conceito mais realista, mas percebemos que se distanciava do estilo pixelado do jogo. Por isso, mantivemos a ideia original, porém refinamos o design para algo mais pixelado e com mais atenção aos detalhes.
<div align="center"> <sub></sub><br><img src="../assets/conceptArtMinigame1.png" width="40%" alt="minigame"><br><sup>Imagem 4: Segunda versão de tela do MiniGame 1 </sup></div>






A Imgem 5 representa nossa primeira tentativa de design dos personagens na plataforma Pisxel, onde exploramos diferentes estilos, proporções e cores para definir a identidade visual do jogo. Testamos variações de roupas, expressões e detalhes para garantir que os personagens se encaixassem no universo pixelado e transmitissem suas personalidades de forma autêntica.
<div align="center"> <sub></sub><br><img src="../assets/conceptArtPersonagem.jpeg" width="20%" alt="personagem"><br><sup>Imagem 5: primeiras versões de desenho dos personagens </sup></div> 






Abaixo, outra versão de nossos momentos de criação e experimentação na construção dos conceitos desejados.
<div align="center"> <sub></sub><br><img src="../assets/conceptArtPersonagem2.jpeg" width="20%" alt="escola"><br><sup>Imagem 6: primeiras versões de desenho dos personagens </sup></div> 


  

  

### 3.3.5. Trilha sonora (sprint 3)

  

  

*Descreva a trilha sonora do jogo, indicando quais músicas serão utilizadas no mundo e nas fases. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.*

  

  

*Exemplo de tabela*

  

\# | titulo | ocorrência | autoria

  

--- | --- | --- | ---

  

1 | tema de abertura | tela de início | própria

  

2 | tema de combate | cena de combate com inimigos comuns | Hans Zimmer

  

3 | ...

  

  

## 3.4. Inventário e Bestiário (sprint 3)

  

  

### 3.4.1. Inventário

  

  

*\<opcional\> Caso seu jogo utilize itens ou poderes para os personagens obterem, descreva-os aqui, indicando títulos, imagens, meios de obtenção e funções no jogo. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.*

  

  

*Exemplo de tabela*

  

\# | item | | como obter | função | efeito sonoro

  

--- | --- | --- | --- | --- | ---

  

1 | moeda | <img  src="../assets/coin.png"> | há muitas espalhadas em todas as fases | acumula dinheiro para comprar outros itens | som de moeda

  

2 | madeira | <img  src="../assets/wood.png"> | há muitas espalhadas em todas as fases | acumula madeira para construir casas | som de madeiras

  

3 | ...

  

  

### 3.4.2. Bestiário

  

  

*\<opcional\> Caso seu jogo tenha inimigos, descreva-os aqui, indicando nomes, imagens, momentos de aparição, funções e impactos no jogo. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.*

  

  

*Exemplo de tabela*

  

\# | inimigo | | ocorrências | função | impacto | efeito sonoro

  

--- | --- | --- | --- | --- | --- | ---

  

1 | robô terrestre | <img  src="../assets/inimigo2.PNG"> | a partir da fase 1 | ataca o personagem vindo pelo chão em sua direção, com velocidade constante, atirando parafusos | se encostar no inimigo ou no parafuso arremessado, o personagem perde 1 ponto de vida | sons de tiros e engrenagens girando

  

2 | robô voador | <img  src="../assets/inimigo1.PNG"> | a partir da fase 2 | ataca o personagem vindo pelo ar, fazendo movimento em 'V' quando se aproxima | se encostar, o personagem perde 3 pontos de vida | som de hélice

  

3 | ...

  

  

## 3.5. Gameflow (Diagrama de cenas) (sprint 2)

O GameFlow é uma abordagem que busca tornar a experiência do jogador mais envolvente, equilibrando desafios e habilidades para manter o engajamento e a motivação ao longo do jogo. Nesta seção, apresentamos o diagrama de cenas, que ilustra como a jornada do jogador se desenrola, garantindo uma progressão fluida e intuitiva. <br> <br>
  
<img src="../assets/Frame1.svg" alt="Diagrama Interativo" style="width: 100%; max-width: 800px;">
  
Para uma melhor visualização do diagrama acesse esse link: [https://www.figma.com/design/X6d5da1dK285KJoKQo7t3N/Untitled?node-id=0-1&p=f&t=E4nfZSYzfqf1H5Ia-0](https://www.figma.com/design/X6d5da1dK285KJoKQo7t3N/Untitled?node-id=0-1&p=f&t=E4nfZSYzfqf1H5Ia-0)
  

## 3.6. Regras do jogo (sprint 3)

  

  

*Descreva aqui as regras do seu jogo: objetivos/desafios, meios para se conseguir alcançar*

  

  

*Ex. O jogador deve pilotar o carro e conseguir terminar a corrida dentro de um minuto sem bater em nenhum obstáculo.*

  

  

*Ex. O jogador deve concluir a fase dentro do tempo, para obter uma estrela. Se além disso ele coletar todas as moedas, ganha mais uma estrela. E se além disso ele coletar os três medalhões espalhados, ganha mais uma estrela, totalizando três. Ao final do jogo, obtendo três estrelas em todas as fases, desbloqueia o mundo secreto.*

  

  

## 3.7. Mecânicas do jogo (sprint 3)

  

  

*Descreva aqui as formas de controle e interação que o jogador tem sobre o jogo: quais os comandos disponíveis, quais combinações de comandos, e quais as ações consequentes desses comandos. Utilize listas ou tabelas para organizar esta seção.*

  

  

*Ex. Em um jogo de plataforma 2D para desktop, o jogador pode usar as teclas WASD para mecânicas de andar, mirar para cima, agachar, e as teclas JKL para atacar, correr, arremesar etc.*

  

  

*Ex. Em um jogo de puzzle para celular, o jogador pode tocar e arrastar sobre uma peça para movê-la sobre o tabuleiro, ou fazer um toque simples para rotacioná-la*

  

  

## 3.8. Implementação Matemática de Animação/Movimento (sprint 3)

  

  

*Descreva aqui a função que implementa a movimentação/animação de personagens ou elementos gráficos no seu jogo. Sua função deve se basear em alguma formulação matemática (e.g. fórmula de aceleração). A explicação do funcionamento desta função deve conter notação matemática formal de fórmulas/equações. Se necessário, crie subseções para sua descrição.*

  

  

# <a name="c4"></a>4. Desenvolvimento do Jogo

  

  

## 4.1. Desenvolvimento preliminar do jogo (sprint 1)

  

  

Este documento apresenta o processo de desenvolvimento preliminar da primeira versão do jogo, abordando os principais elementos entregues em termos de código e jogabilidade. Também serão destacadas as dificuldades encontradas e os próximos passos para aprimoramento.

Com o objetivo de trabalhar no requisito 1, começamos o desenvolvimento da tela inicial. O código principal foi estruturado em JavaScript utilizando o framework Phaser. Durante os testes iniciais e o processo de aprendizagem, a primeira versão do jogo era bastante básica, contando apenas com uma interface de apoio, no entanto, funcional.

O jogo apresentava um fundo preto, alguns botões e duas telas. A primeira exibia o nome do projeto, DPO Hero, junto com os botões "Jogar", "Configurações" e "Informações".

<div align="center">
  <sub></sub><br>
  <img src="../assets/1.jpg" width="40%" 
  alt="Título"><br>
  <sup>Imagem 1: Primeiro teste para cosntrução da imagem principal</sup>
</div>





Apenas o botão "Jogar" estava funcional, permitindo ao usuário avançar para a próxima tela, onde era possível escolher entre os papéis de aluno ou professor. Representado na imagem a seguir:
 
<div align="center">
  <sub></sub><br>
  <img src="../assets/2.jpg" width="40%" 
  alt="Título"><br>
  <sup>Imagem 2: Tela que seria para escolher papel</sup>
</div>



  

Contudo, optamos por remover essa seleção na versão seguinte, pois decidimos unificar a experiência, sem diferenciação de mecânicas entre professores e alunos. Agora, ao clicar em "Jogar", o usuário é direcionado a tela de introdução ao jogo, apresentando a narrativa e contendo uma caixa de diálogo.


Após a estruturação das telas principais, construímos o design no figma, e implementamos um fundo visualmente mais agradável, botões estilizados e uma logo, tornando a interface mais intuitiva e atraente para o público-alvo.


<div align="center">
  <sub></sub><br>
  <img src="../assets/4.jpg" width="40%" 
  alt="Título"><br>
  <sup>Imagem 4: Nova versão da tela inicial</sup>
</div>  



  

Com o objetivo de começar a desenvolver o requisito 2, nosso próximo passo foi criar novos cenários. Aprimoramos a segunda tela com o design de dois personagens e um fundo referente a uma organização de segurança. Além disso, implementamos botões de voltar para o menu no canto superior esquerdo, e de “Continuar” e “Voltar” na caixa de diálogo.

  
<div align="center">
  <sub></sub><br>
  <img src="../assets/5.png" width="40%" 
  alt="Título"><br>
  <sup>Imagem 5: Primeira fala do diálogo</sup>
</div> 


Configuramos o botão "Voltar" para que ele aparecesse só a partir da segunda fala no diálogo:

<div align="center"><br><img width="40%" alt="image" src="https://github.com/user-attachments/assets/e34b6ee7-9790-403e-9e3c-cdadb6b75f55" /></br><sup>Imagem 6: terceira fala</sup></div>


  

Por último, começamos a desenvolver um mapa da cidade no Tiled e testar a programação do personagem andando.


<div align="center">
  <sub></sub><br>
  <img src="../assets/d.png" width="40%" 
  alt="Título"><br>
  <sup>Imagem 7: Mapa</sup>
</div> 
  



  
  

(versão 1 do mapa)

  

O que fizemos?

Primeiro, carregamos os elementos visuais da cena, incluindo o fundo e os sprites do personagem em diferentes direções. Criamos animações para quando ele anda para os lados, para cima e para baixo, além de animações de >idle< para quando ele estiver parado.

Depois, implementamos o sistema de movimentação com as setas do teclado. O personagem se move suavemente na direção pressionada e, ao soltar a tecla, volta para a pose de >idle< correspondente.

Dessa forma, o personagem pode andar para qualquer lado usando as setas, e se nenhuma tecla for pressionada, ele entra na posição de espera (idle).

As atualizações futuras seriam adicionar colisões para impedir que o personagem atravesse paredes ou objetos, ajustar a velocidade conforme o terreno, incluir efeitos sonoros ao se movimentar ou ao colidir com objetos e criar NPCs ou interações com elementos do cenário. Essa cena é um passo importante para tornar o jogo mais dinâmico e imersivo. Agora que o personagem pode se mover, podemos começar a pensar em como inserir desafios e objetivos dentro desse ambiente.

  
Desafios encontrados:

- Idealizar uma interface na qual o design fosse atraente tanto para crianças de 9 anos, quanto para jovens de 17 e professores. Não sendo nem infantil, nem séria demais.

- Inicialmente, entender como desenvolver o código para todas as funcionalidades que gostaríamos.

- Dificuldade no desenvolvimento dos SpriteSheets em pixels.

- A integração do mapa criado no Tiled com o Phaser pode ter apresentado desafios, como carregamento incorreto de camadas ou problemas de colisão.

- Saindo um pouco da parte computacional, levando em consideração a experiência do usuário, tivemos uma dificuldade de criar um design e narrativa de jogo envolvente e coesa.

- _Enfrentamos uma grande dificuldade na responsividade._ _Nos dois computadores em que o jogo foi desenvolvido, todos os botões e a logo estavam normais. No entanto, um dia antes da Sprint Review, ao abrir o jogo nos computadores dos demais colegas, identificamos problemas no posicionamento dos botões._ _Infelizmente, ainda não encontramos uma solução, mas esse será um ponto totalmente prioritário para a próxima sprint._



Dessa forma, a primeira versão do jogo implementa as mecânicas básicas planejadas, incluindo:

- Página inicial com três botões, sendo o de “Jogar” o único ativo e funcional, atendendo o requisito 1.

- Cena introdutória de apresentação da narrativa com diálogo entre dois personagens, refletindo o requisito 2 ao implementar novos cenários.

- Movimentação do personagem com mapa desenvolvido no Tiled

  
  
  
  
  

  
  
  

## 4.2. Desenvolvimento básico do jogo (sprint 2)


Nesta segunda sprint, avançamos significativamente no desenvolvimento da versão básica do jogo, implementando um minigame e expandindo os cenários. O foco principal desta fase foi estruturar a lógica do minigame e realizar os primeiros testes para validar seu funcionamento.


Para começar, realizamos ajustes e aprimoramentos nas cenas programadas na sprint anterior. Na tela inicial, adicionamos um novo nome e a logo do jogo, tornando a interface mais coerente com a identidade visual do projeto.





<div align="center"><br><img width="900" alt="image" src="https://github.com/user-attachments/assets/87a7bf26-d3ca-450f-9181-08b9743bac5c" /></br><sub>Imagem 1</sub></div>





Na cena de diálogos, implementamos um ícone no canto superior direito da tela que, ao ser clicado, exibe uma aba contendo os "10 Mandamentos da LGPD", servindo como material de apoio para o jogador.





<div align="center"><br><img width="900" alt="image" src="https://github.com/user-attachments/assets/da153dc7-b928-4f15-91da-786a68f6f3ba" /></br><sub>Imagem 2</sub></div>


Abaixo, apresentamos a tela referente aos 10 mandamentos:





<div align="center"><br><img width="944" alt="image" src="https://github.com/user-attachments/assets/0fb0d612-1787-466c-8f92-df526239bb37" /> </br><sub>"Imagem 3"</sub></div>




Nessa tela, incrementamos uma dinâmica que ao clicar no nome do mandamento abre uma explicação sobre o tópico, ilustrado pela imagem abaixo:





<div align="center"><br><img width="947" alt="image" src="https://github.com/user-attachments/assets/5ab23744-c65c-4177-8b5a-7d5b6baa3acf" /></br><sub>"Imagem4"</sub></div>




Além disso, na parte inferior dessa tela, adicionamos um botão "Voltar" que direciona para a tela anterior.





<div align="center"><br><img width="943" alt="image" src="https://github.com/user-attachments/assets/7a189497-a359-459f-9600-f81be2bd04c1" /></br><sub>Imagem 5</sub></div>




Nesta sprint, decidimos concentrar nossos esforços na implementação do primeiro minigame do jogo. Para isso, criamos diferentes modelos de tela no Figma, explorando possibilidades para o cenário do minigame. Após análises e testes, selecionamos a melhor opção e a adicionamos como background (Imagem 4).


Em seguida, configuramos dois botões principais:
- Botão Verde (Aprovado): Para situações que seguem as diretrizes da LGPD.
- Botão Vermelho (Negado): Para situações que violam a LGPD.




<div align="center"><br><img width="957" alt="image" src="https://github.com/user-attachments/assets/4a099d6c-39e1-4c32-bbb1-b4cd884176c7" /></br><sub>Imagem 6</sub></div>





O jogo funciona da seguinte maneira: o jogador se depara com diversas situações envolvendo a coleta de dados. Para cada cenário apresentado, ele deve analisar e decidir se a prática está em conformidade com a LGPD, selecionando "Aprovado" ou "Negado".

Um dos principais desafios desta sprint foi desenvolver uma lógica eficiente para esse processo, garantindo que cada situação tivesse uma resposta correta previamente definida. Com base nessa escolha, o jogador recebe um feedback imediato:

- Feedback Positivo: Caso escolha a opção correta.
- Feedback Negativo: Caso selecione a opção errada.
  
Para melhorar a usabilidade, implementamos uma mecânica que desativa os botões sempre que a caixa de feedback aparece, impedindo novas interações enquanto a resposta está sendo exibida. Além disso, adicionamos um botão de "Avançar", permitindo que o jogador prossiga para a próxima pergunta (Imagem 7).




<div align="center"><br><img width="956" alt="image" src="https://github.com/user-attachments/assets/ef73aea3-8e77-41d6-97a8-62a870bd9fc5" /></br><sub>Imagem 7</sub></div>






Após os testes iniciais, refinamos ainda mais a experiência do minigame. Alteramos os feedbacks para torná-los mais específicos para cada resposta e substituímos o botão de "Avançar" por ícones mais intuitivos, facilitando a navegação.




<div align="center">
  <br>
    <img width="958" alt="image" src="https://github.com/user-attachments/assets/8814ac6b-cc5c-431c-86b7-89325e2d1c42" />
</br>
  <sub>Imagem 8</sub>
</div>





Ao finalizar o miniGame, o jogador é direcionado para o mapa da cidade, que desenhamos no Tilled, servindo como um hub para a progressão dentro do jogo



<div align="center"><br><img width="821" alt="image" src="https://github.com/user-attachments/assets/dd0fa851-6a50-448e-b4f7-45e56ac25558" /> </br><sub>Imagem 9</sub></div>


**Próximos Passos**

Para a próxima sprint, nosso foco será aprimorar a experiência do jogador por meio da padronização do design dos minigames, a implementação de colisões e a integração mais fluida entre as cenas. Os principais objetivos incluem:

- Padronização do Design dos Minigames: Criar um conjunto de diretrizes visuais e de usabilidade para garantir que todos os minigames tenham uma identidade coesa dentro do jogo. Isso envolve a uniformização de cores, fontes, botões e estilos de feedbacks.
- Adição de Colisões: Implementar um sistema de colisão que permita interações mais dinâmicas no mapa. Isso garantirá, por exemplo, que o jogador possa colidir com objetos específicos, como portas e NPCs, acionando eventos dentro do jogo.
- Integração entre Cenas: Criar transições automáticas para que, ao se aproximar de locais importantes, como a escola, o personagem possa entrar automaticamente na cena correspondente. Esse sistema também será aplicado a outros ambientes do jogo, proporcionando uma navegação mais fluida.
- Aprimoramento da Progressão no Jogo: Ajustar a lógica de transição entre fases e minigames, garantindo que a progressão do jogador seja registrada corretamente e influencie a experiência de forma coerente.

Com essas melhorias, daremos mais consistência ao jogo, tornando a navegação mais intuitiva e a experiência do usuário mais imersiva. 

Com o avanço desta sprint, consolidamos a estrutura do primeiro minigame e aprimoramos elementos visuais e interativos do jogo. A implementação dos feedbacks mais específicos e a otimização da usabilidade reforçaram a imersão do jogador na experiência educativa sobre a LGPD. Os testes realizados foram fundamentais para refinar a jogabilidade e garantir um funcionamento intuitivo. Com isso, seguimos para a próxima fase do desenvolvimento com uma base sólida, prontos para expandir os desafios e aprofundar ainda mais a experiência do usuário.


  

## 4.3. Desenvolvimento intermediário do jogo (sprint 3)

  

  

*Descreva e ilustre aqui o desenvolvimento da versão intermediária do jogo, explicando brevemente o que foi entregue em termos de código e jogo. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e próximos passos.*

  

  

## 4.4. Desenvolvimento final do MVP (sprint 4)

  

  

*Descreva e ilustre aqui o desenvolvimento da versão final do jogo, explicando brevemente o que foi entregue em termos de MVP. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e planos futuros.*

  

  

## 4.5. Revisão do MVP (sprint 5)

  

  

*Descreva e ilustre aqui o desenvolvimento dos refinamentos e revisões da versão final do jogo, explicando brevemente o que foi entregue em termos de MVP. Utilize prints de tela para ilustrar.*

  

  

# <a name="c5"></a>5. Testes

  

  

## 5.1. Casos de Teste (sprints 2 a 4)

  

| Pré-condição| Descrição do Teste | Pós-condição |
|------------|-------------------|----------------|
|Posicionar o jogo na tela de abertura | Iniciar o jogo desde seu início | O jogo deve iniciar da fase 1|
|Entrar na cena de diálogo inicial| Clicar no menu| O jogo deve voltar ao menu|
|Entrar na cena de diálogo inicial| Clicar em "Continuar" e passar as falas até o final | Mudar de cena para o minigame
|Entrar na cena de diálogo inicial| Clicar em "Voltar"| Voltar para a fala anterior do personagem|
|Testar o minigame 1 de perguntas sobre dados |Escolher respostas corretas e incorretas |O jogo deve os feedbacks adequados|
| Posicionar o personagem em um mapa com múltiplas missões | Navegar entre diferentes áreas do mapa |O personagem deve conseguir trafegar livremente entre áreas acessíveis|
|Posicionar o personagem em frente a um NPC que dá uma missão |Interagir com o NPC para aceitar a missão | A missão deve ser iniciada|
|Concluir o minigame| Avançar para a próxima fase|O jogo deve mostrar o alerta  direcionando para a próxima localização de desafio|
|Tentar sair do jogo no meio de uma missão |Pressionar a opção de sair|O jogo deve exibir uma mensagem de confirmação para evitar saída acidental|
|Personagem posicionado em frente a um computador no jogo | Tentar acessar um site suspeito dentro do jogo | O jogo deve exibir um alerta educacional sobre segurança digital|

























  



  

  

## 5.2. Testes de jogabilidade (playtests) (sprint 4)

  

  

### 5.2.1 Registros de testes

  

  

*Descreva nesta seção as sessões de teste/entrevista com diferentes jogadores. Registre cada teste conforme o template a seguir.*

  

  

Nome | João Jonas (use nomes fictícios)

  

--- | ---

  

Já possuía experiência prévia com games? | sim, é um jogador casual

  

Conseguiu iniciar o jogo? | sim

  

Entendeu as regras e mecânicas do jogo? | entendeu as regras, mas sobre as mecânicas, apenas as essenciais, não explorou os comandos complexos

  

Conseguiu progredir no jogo? | sim, sem dificuldades

  

Apresentou dificuldades? | Não, conseguiu jogar com facilidade e afirmou ser fácil

  

Que nota deu ao jogo? | 9.0

  

O que gostou no jogo? | Gostou de como o jogo vai ficando mais difícil ao longo do tempo sem deixar de ser divertido

  

O que poderia melhorar no jogo? | A responsividade do personagem aos controles, disse que havia um pouco de atraso desde o momento do comando até a resposta do personagem

  

  

### 5.2.2 Melhorias

  

  

*Descreva nesta seção um plano de melhorias sobre o jogo, com base nos resultados dos testes de jogabilidade*

  

  

# <a name="c6"></a>6. Conclusões e trabalhos futuros (sprint 5)

  

  

*Escreva de que formas a solução do jogo atingiu os objetivos descritos na seção 1 deste documento. Indique pontos fortes e pontos a melhorar de maneira geral.*

  

  

*Relacione os pontos de melhorias evidenciados nos testes com plano de ações para serem implementadas no jogo. O grupo não precisa implementá-las, pode deixar registrado aqui o plano para futuros desenvolvimentos.*

  

  

*Relacione também quaisquer ideias que o grupo tenha para melhorias futuras*

  

  

# <a name="c7"></a>7. Referências (sprint 5)

  


(1) ALVES, Lynn; LOPES, David (Org.). Educação e plataformas digitais: popularizando saberes, potencialidades e controvérsias. Salvador: EDUFBA, 2024. Disponível em: https://repositorio.ufba.br/handle/ri/39372. Acesso em: 27 fev. 2025. <br>

(2) ÁRVORE. Games na educação: por que usar e exemplos práticos. 2025. Disponível em: https://www.arvore.com.br/blog/games-na-educacao. Acesso em: 24 fev. 2025. <br>

(3) CÂMARA DOS DEPUTADOS. EP#89 - Plataformização da Educação e o ataque à soberania digital. 2024. Disponível em: https://www.camara.leg.br/radio/programas/1106337-ep87-plataformizacao-da-educacao-e-o-ataque-a-soberania-digital/. Acesso em: 27 fev. 2025. <br>

(4) COMUNIDADE MEU GURU. O Mercado Global de E-learning. 2025. Disponível em: https://comunidade.meuguru.com/elearning/?utm_source=chatgpt.com. Acesso em: 27 fev. 2025. <br>

(5) DCF MODELING. Quais são as cinco forças de Porter de Pearson PLC (PSO)? 2025. Disponível em: https://dcfmodeling.com/pt/products/pso-porters-five-forces-analysis. Acesso em: 27 fev. 2025. <br>

(6) ECOMMERCE BRASIL. Mercado de E-learning na América Latina. 2025. Disponível em: https://www.ecommercebrasil.com.br/noticias/e-learning-america-latina-deve-alcancar-us-16-bilhoes-ate-2026-estudo-pagseguro?utm_source=chatgpt.com. Acesso em: 27 fev. 2025. <br>

(7) LUCIDCHART. As cinco forças de Porter e o posicionamento estratégico. 2025. Disponível em: https://www.lucidchart.com/blog/pt/5-forcas-de-porter-planejamento-estrategico. Acesso em: 24 fev. 2025. <br>

(8) MORDOR INTELLIGENCE. Mercado de Brinquedos e Jogos – Análise da Indústria e Tendências. 2025. Disponível em: https://www.mordorintelligence.com/pt/industry-reports/toys-and-games-market. Acesso em: 24 fev. 2025. <br>

(9) OUTRAS PALAVRAS. Os tentáculos das plataformas sobre a Educação. 2022. Disponível em: https://outraspalavras.net/trabalhoeprecariado/os-tentaculos-das-plataformas-sobre-a-educacao/. Acesso em: 27 fev. 2025. <br>

(10) ROCK CONTENT. As 5 forças de Porter: o que são, para que servem e como aplicar? 2025. Disponível em: https://rockcontent.com/br/blog/5-forcas-de-porter/. Acesso em: 27 fev. 2025. <br>

(11) SEBRAE. Mercado de games: tendências e oportunidades. 2025. Disponível em: https://sebrae.com.br/sites/PortalSebrae/artigos/mercado-de-games-tendencias-e-oportunidades%2C767cf253be2a6810VgnVCM1000001b00320aRCRD. Acesso em: 24 fev. 2025. <br>

(12) STARTUPS. Panorama das Edtechs no Brasil. 2025. Disponível em: https://startups.com.br/pesquisas/brasil-lidera-mercado-latam-de-edtechs-e-movimenta-us-475m-em-10-anos/?utm_source=chatgpt.com. Acesso em: 27 fev. 2025. <br>

(13) VERIFIED MARKET REPORTS. Tamanho do mercado, tendências e previsão do mercado da plataforma de e-learning. 2025. Disponível em: https://www.verifiedmarketreports.com/pt/product/e-learning-platform-market/. Acesso em: 27 fev. 2025. <br>

(14) YIREN DIGITAL LTD. Quais são as cinco forças de Porter da Yiren Digital Ltd. (YRD). 2025. Disponível em: https://dcf.fm/pt/products/yrd-porters-five-forces-analysis. Acesso em: 27 fev. 2025. <br>

# <a name="c8"></a>Anexos

  

  

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
