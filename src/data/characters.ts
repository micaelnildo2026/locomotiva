import { Character, Mission } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'dona_helena',
    name: 'Dona Helena Silveira',
    role: 'Líder Comunitária e Historiadora Ferroviária',
    archetype: 'Terceira Idade',
    age: 76,
    avatarColor: '#ea580c', // Warm amber/orange
    avatarIcon: 'UserCheck',
    biography: 'Nascida no bairro Bucarein, filha de um antigo foguista da Estrada de Ferro Santa Catarina. Hoje participa ativamente dos conselhos municipais da terceira idade em Joinville, lutando por calçadas seguras, estações com bancos confortáveis e transporte suave.',
    accessibilityNeeds: [
      'Bancos com apoio de braço a cada 60 metros para descanso seguro',
      'Tempo estendido para embarque e desembarque nos vagões sem empurrões',
      'Calçadas niveladas sem lajotas soltas para prevenir quedas'
    ],
    feedbackForCity: '"Quando eu era menina, o apito da locomotiva marcava a hora do almoço em Joinville. Ver essa nova ferrovia acessível trazendo meus netos e permitindo que nós, idosos, possamos passear com dignidade e segurança é a realização de um sonho."',
    initialDialogId: 'dh_inicio',
    dialogs: {
      'dh_inicio': {
        id: 'dh_inicio',
        speaker: 'Dona Helena',
        text: 'Bom dia, jovem maquinista! Que emoção ver essa locomotiva brilhando nos trilhos de Joinville. Hoje nós temos o baile dos aposentados no centro histórico. Como está o trem para a viagem?',
        characterMood: 'feliz',
        choices: [
          {
            text: 'Está em perfeitas condições, Dona Helena! O sistema de suspensão e freios foi regulado para a máxima suavidade.',
            nextDialogId: 'dh_conforto'
          },
          {
            text: 'Como a senhora avalia a acessibilidade das novas estações de Joinville para a terceira idade?',
            nextDialogId: 'dh_acessibilidade'
          }
        ]
      },
      'dh_conforto': {
        id: 'dh_conforto',
        speaker: 'Dona Helena',
        text: 'Isso é música para os meus ouvidos! Nós da terceira idade sofremos muito quando o trem dá aqueles solavancos bruscos na saída ou na freada. Se você conduzir com calma e parar suavemente na plataforma, eu mesma te convido para tomar um café com cuca de banana!',
        characterMood: 'entusiasmada',
        choices: [
          {
            text: 'Aceito a missão! Vou conduzir a composição sem nenhum tranco até a Estação Central.',
            nextDialogId: 'dh_missao_aceita',
            acceptedMissionId: 'missao_helena_conforto'
          },
          {
            text: 'Conte-me um pouco sobre as lembranças do apito da maria-fumaça em Joinville.',
            nextDialogId: 'dh_memoria'
          }
        ]
      },
      'dh_acessibilidade': {
        id: 'dh_acessibilidade',
        speaker: 'Dona Helena',
        text: 'Ficou maravilhosa! Os degraus sumiram, as rampas são bem suaves e aqueles banquinhos com encosto na sombra das árvores me deixam esperar o trem descansando as pernas. Parabéns aos engenheiros que pensaram em nós!',
        characterMood: 'feliz',
        choices: [
          {
            text: 'Vamos fazer essa viagem inaugural com todo o carinho que a senhora merece!',
            nextDialogId: 'dh_missao_aceita',
            acceptedMissionId: 'missao_helena_conforto'
          }
        ]
      },
      'dh_memoria': {
        id: 'dh_memoria',
        speaker: 'Dona Helena',
        text: 'Meu pai chegava com o rosto marcado de fuligem, mas com um orgulho no peito de estar movendo o progresso de Santa Catarina. O apito ecoava até a Serra Dona Francisca! Toque o apito para nós lembrarmos daquela época bonita.',
        characterMood: 'reflexiva',
        choices: [
          {
            text: 'Vou apitar agora mesmo em homenagem ao seu pai e a todos os ferroviários!',
            nextDialogId: 'dh_missao_aceita',
            acceptedMissionId: 'missao_helena_conforto'
          }
        ]
      },
      'dh_missao_aceita': {
        id: 'dh_missao_aceita',
        speaker: 'Dona Helena',
        text: 'Muito obrigada, querido! Estou no vagão de passageiros observando. Lembre-se: aceleração progressiva, curvas em velocidade segura e parada serena!',
        characterMood: 'feliz',
        choices: []
      }
    }
  },
  {
    id: 'tiago_pcd',
    name: 'Tiago Ramos',
    role: 'Arquiteto Especialista em Acessibilidade e Paratleta',
    archetype: 'Pessoa com Deficiência (PCD)',
    age: 28,
    avatarColor: '#2563eb', // Rich blue
    avatarIcon: 'ShieldAlert',
    biography: 'Usuário de cadeira de rodas ativa há 8 anos após um acidente. Formou-se em Arquitetura e Urbanismo e hoje lidera vistorias de desenho universal e auditorias da norma NBR 9050 para os modais de transporte público de Santa Catarina.',
    accessibilityNeeds: [
      'Vão horizontal entre a plataforma e o trem menor que 20 mm (gap filler ativado)',
      'Desnível vertical estritamente zero para não travar as rodinhas dianteiras da cadeira',
      'Portas com largura útil mínima de 90 cm e sinalização podotátil contínua'
    ],
    feedbackForCity: '"Acessibilidade não é favor nem benefício exclusivo: é direito humano e eficiência urbana. Quando uma cidade é acessível para um cadeirante ou uma pessoa cega, ela se torna mais segura, confortável e prática para toda a população de Joinville."',
    initialDialogId: 'tiago_inicio',
    dialogs: {
      'tiago_inicio': {
        id: 'tiago_inicio',
        speaker: 'Tiago Ramos',
        text: 'E aí, piloto! Estou no comando técnico da comissão de validação de acessibilidade da malha de Joinville. Estamos testando o sistema embarcado de nivelamento da locomotiva e dos vagões VLT.',
        characterMood: 'atenta',
        choices: [
          {
            text: 'Qual é o teste mais crítico que você vai realizar hoje na parada das estações?',
            nextDialogId: 'tiago_teste_vao'
          },
          {
            text: 'Como foi projetado o desenho universal das novas estações de Joinville?',
            nextDialogId: 'tiago_desenho_universal'
          }
        ]
      },
      'tiago_teste_vao': {
        id: 'tiago_teste_vao',
        speaker: 'Tiago Ramos',
        text: 'O chamado "Gap Zero". Quando o trem encosta na plataforma, o maquinista precisa alinhar com tolerância de no máximo 15 cm da marca amarela. As pestanas retráteis automáticas cobrem o espaço, e o piso fica perfeitamente contínuo!',
        characterMood: 'tecnica',
        choices: [
          {
            text: 'Vou realizar a parada milimétrica para você testar o embarque autônomo sem nenhuma barreira.',
            nextDialogId: 'tiago_missao_aceita',
            acceptedMissionId: 'missao_tiago_alinhamento'
          },
          {
            text: 'E se a cadeira for motorizada e pesada?',
            nextDialogId: 'tiago_motorizada'
          }
        ]
      },
      'tiago_motorizada': {
        id: 'tiago_motorizada',
        speaker: 'Tiago Ramos',
        text: 'Excelente pergunta! As rampas e o piso suportam até 350 kg concentrados. Além disso, temos piso antiderrapante e fixadores magnéticos no piso do vagão para viagens com estabilidade total.',
        characterMood: 'feliz',
        choices: [
          {
            text: 'Incrível engenharia! Vamos para o teste prático na próxima parada.',
            nextDialogId: 'tiago_missao_aceita',
            acceptedMissionId: 'missao_tiago_alinhamento'
          }
        ]
      },
      'tiago_desenho_universal': {
        id: 'tiago_desenho_universal',
        speaker: 'Tiago Ramos',
        text: 'Eliminamos todas as barreiras arquitetônicas: piso tátil direcional e de alerta NBR 9050, mapas táteis com voz, portas de 1 metro e semáforos com sinal sonoro. É Joinville na vanguarda do Brasil.',
        characterMood: 'entusiasmada',
        choices: [
          {
            text: 'Vamos juntos validar essa estação! Desafio aceito.',
            nextDialogId: 'tiago_missao_aceita',
            acceptedMissionId: 'missao_tiago_alinhamento'
          }
        ]
      },
      'tiago_missao_aceita': {
        id: 'tiago_missao_aceita',
        speaker: 'Tiago Ramos',
        text: 'Pronto! Meu sensor de bordo está ativado. Pare exatamente dentro do marcador da Estação Centro ou Universitária com menos de 0,5m de desvio. Confio em você!',
        characterMood: 'atenta',
        choices: []
      }
    }
  },
  {
    id: 'beatriz_estudante',
    name: 'Beatriz Becker',
    role: 'Graduanda de Engenharia Mecânica na UDESC Joinville',
    archetype: 'Jovem Universitário',
    age: 20,
    avatarColor: '#16a34a', // Emerald green
    avatarIcon: 'GraduationCap',
    biography: 'Mora na Zona Sul e estuda no campus da UDESC no Bom Retiro. Desenvolve iniciação científica sobre eficiência de tração elétrica-vapor e modelagem CAD no FreeCAD. Depende diariamente do transporte ferroviário para não perder as aulas de cálculo e termodinâmica.',
    accessibilityNeeds: [
      'Pontualidade estrita nos horários de pico para início das aulas universitárias',
      'Estações de recarga de celular/laptop e ciclovia integrada para bicicleta',
      'Tarifa integrada e vagão espaçoso para transporte de maquetes e protótipos acadêmicos'
    ],
    feedbackForCity: '"Antes do VLT e da ferrovia modernizada, eu perdia quase duas horas no trânsito engarrafado da Av. Santos Dumont. Hoje chego em 18 minutos no campus, posso revisar os artigos no trem com Wi-Fi livre e ainda levo minha bike!"',
    initialDialogId: 'bia_inicio',
    dialogs: {
      'bia_inicio': {
        id: 'bia_inicio',
        speaker: 'Beatriz Becker',
        text: 'Oi, comandante! Estou indo apresentar meu trabalho de Termodinâmica Aplicada na UDESC em 15 minutos! Essa locomotiva é um espetáculo de máquina térmica!',
        characterMood: 'entusiasmada',
        choices: [
          {
            text: 'Você também estuda os modelos 3D no FreeCAD e a mecânica da caldeira?',
            nextDialogId: 'bia_engenharia'
          },
          {
            text: 'Precisa chegar a tempo na estação universitária? Vamos cumprir a tabela de horários!',
            nextDialogId: 'bia_pontualidade'
          }
        ]
      },
      'bia_engenharia': {
        id: 'bia_engenharia',
        speaker: 'Beatriz Becker',
        text: 'Sim! Modelei o mecanismo Walschaerts no FreeCAD usando a bancada Part Design. O rendimento térmico do ciclo de Rankine com superaquecedor é fantástico. Se você mantiver o corte da reversão em 25% na reta, economiza vapor e corre muito mais!',
        characterMood: 'tecnica',
        choices: [
          {
            text: 'Dica de ouro de futura engenheira! Vou aplicar essa técnica de condução agora mesmo.',
            nextDialogId: 'bia_missao_aceita',
            acceptedMissionId: 'missao_bia_pontualidade'
          }
        ]
      },
      'bia_pontualidade': {
        id: 'bia_pontualidade',
        speaker: 'Beatriz Becker',
        text: 'Se chegarmos na Estação Campus Universitário dentro da janela de horário, ganho nota dez na apresentação pontual e mostro a eficiência da nossa ferrovia para todos os professores!',
        characterMood: 'feliz',
        choices: [
          {
            text: 'Pode contar comigo, Beatriz! Vamos acelerar com segurança e chegar com folga.',
            nextDialogId: 'bia_missao_aceita',
            acceptedMissionId: 'missao_bia_pontualidade'
          }
        ]
      },
      'bia_missao_aceita': {
        id: 'bia_missao_aceita',
        speaker: 'Beatriz Becker',
        text: 'Valeu demais! Estou de olho no cronômetro da UDESC. Mantenha velocidade constante acima de 40 km/h no trecho livre!',
        characterMood: 'feliz',
        choices: []
      }
    }
  },
  {
    id: 'mestre_rodolfo',
    name: 'Mestre Rodolfo Krause',
    role: 'Maquinista Instrutor e Especialista em Tração Ferroviária',
    archetype: 'Maquinista Instrutor',
    age: 62,
    avatarColor: '#4f46e5', // Deep indigo
    avatarIcon: 'Wrench',
    biography: 'Mais de 38 anos de experiência na condução de trens pelas serras do Sul do Brasil. Conhece cada parafuso, cada barulho do vapor e cada curva do relevo de Joinville. Treina a nova geração de operadores para conduzir com precisão cirúrgica.',
    accessibilityNeeds: [
      'Ergonomia de comandos e visão desimpedida da via permanente',
      'Instrumentação legível em qualquer condição climática (neblina e chuva intensa de Joinville)',
      'Comunicação direta com o Centro de Controle Operacional (CCO)'
    ],
    feedbackForCity: '"Trilho é a artéria de uma cidade forte. Quando você une a força da indústria pesada com a mobilidade humana acolhedora, você constrói o futuro sem esquecer a nossa história."',
    initialDialogId: 'rodolfo_inicio',
    dialogs: {
      'rodolfo_inicio': {
        id: 'rodolfo_inicio',
        speaker: 'Mestre Rodolfo',
        text: 'Atenção ao posto de comando, maquinista! Conduzir uma locomotiva de 80 toneladas não é apenas acelerar: é entender a pressão da caldeira, a inércia da composição e o atrito roda-trilho.',
        characterMood: 'atenta',
        choices: [
          {
            text: 'Quais são os cuidados essenciais com a pressão da caldeira e a água do tender?',
            nextDialogId: 'rodolfo_caldeira'
          },
          {
            text: 'Como operar os freios pneumáticos Westinghouse sem travar as rodas?',
            nextDialogId: 'rodolfo_freios'
          }
        ]
      },
      'rodolfo_caldeira': {
        id: 'rodolfo_caldeira',
        speaker: 'Mestre Rodolfo',
        text: 'Mantenha a pressão entre 13 e 15 bar. Se passar de 16, as válvulas de alívio Coale abrem para segurança. Jamais deixe o nível de água baixar do visor tubular reflexivo, ou o plug fusível de chumbo da fornalha derrete!',
        characterMood: 'tecnica',
        choices: [
          {
            text: 'Entendido, mestre! Vou monitorar o manômetro e dosar o injetor de água.',
            nextDialogId: 'rodolfo_missao_aceita',
            acceptedMissionId: 'missao_rodolfo_caldeira'
          }
        ]
      },
      'rodolfo_freios': {
        id: 'rodolfo_freios',
        speaker: 'Mestre Rodolfo',
        text: 'Aplique o freio de serviço reduzindo a linha geral de 5 bar para 4,2 bar com antecedência. Deixe o peso do trem assentar nas sapatas. Frear em cima da hora com emergência estraga os rodeiros e assusta os passageiros idosos!',
        characterMood: 'atenta',
        choices: [
          {
            text: 'Vou aplicar frenagem gradual e testar a precisão das sapatas agora.',
            nextDialogId: 'rodolfo_missao_aceita',
            acceptedMissionId: 'missao_rodolfo_caldeira'
          }
        ]
      },
      'rodolfo_missao_aceita': {
        id: 'rodolfo_missao_aceita',
        speaker: 'Mestre Rodolfo',
        text: 'Muito bem! Mantenha a pressão da caldeira estável em 14 bar durante todo o percurso e prove que tem alma de verdadeiro maquinista.',
        characterMood: 'feliz',
        choices: []
      }
    }
  }
];

export const MISSIONS_LIST: Mission[] = [
  {
    id: 'missao_helena_conforto',
    title: 'Viagem de Veludo para a Terceira Idade',
    giver: 'Dona Helena Silveira',
    description: 'Conduza os passageiros idosos de volta ao baile da Estação Central sem solavancos bruscos de aceleração ou desaceleração.',
    targetStationId: 'estacao_central',
    objective: 'Mantenha o índice de solavanco (Jolt) abaixo do limite de conforto e estacione suavemente.',
    scoreBonus: 500,
    completed: false,
    requirements: {
      maxComfortJolt: 1.2,
      alignToleranceMeters: 0.8,
      targetArrivalTimeSeconds: 180,
      maxBoilerPressureBar: 16.0
    }
  },
  {
    id: 'missao_tiago_alinhamento',
    title: 'Auditoria de Acessibilidade & Vão Zero',
    giver: 'Tiago Ramos (PCD)',
    description: 'Alinhe a locomotiva e os vagões com precisão milimétrica na Estação Centro/Catedral para ativação perfeita do gap filler.',
    targetStationId: 'estacao_centro_catedral',
    objective: 'Pare o trem com desvio menor que 0,4 metro da marcação podotátil da plataforma.',
    scoreBonus: 650,
    completed: false,
    requirements: {
      maxComfortJolt: 1.8,
      alignToleranceMeters: 0.4,
      targetArrivalTimeSeconds: 150,
      maxBoilerPressureBar: 16.0
    }
  },
  {
    id: 'missao_bia_pontualidade',
    title: 'Expresso Universitário: Rumo à UDESC',
    giver: 'Beatriz Becker (Estudante)',
    description: 'Transporte centenas de jovens universitários até o campus da Univille e UDESC dentro da janela pontual das 19h00.',
    targetStationId: 'estacao_universitaria',
    objective: 'Mantenha velocidade de cruzeiro eficiente e chegue ao campus em menos de 120 segundos.',
    scoreBonus: 750,
    completed: false,
    requirements: {
      maxComfortJolt: 2.2,
      alignToleranceMeters: 1.0,
      targetArrivalTimeSeconds: 120,
      maxBoilerPressureBar: 16.0
    }
  },
  {
    id: 'missao_rodolfo_caldeira',
    title: 'Domínio Térmico: Prova do Mestre Maquinista',
    giver: 'Mestre Rodolfo',
    description: 'Mantenha a pressão da caldeira na faixa nobre de rendimento (13.5 a 15.0 bar) sem desperdiçar vapor nas válvulas de escape.',
    targetStationId: 'estacao_aeroporto_industrial',
    objective: 'Conserve pressão ideal de 14 bar e complete o trajeto até o distrito industrial.',
    scoreBonus: 900,
    completed: false,
    requirements: {
      maxComfortJolt: 2.0,
      alignToleranceMeters: 0.7,
      targetArrivalTimeSeconds: 200,
      maxBoilerPressureBar: 15.5
    }
  }
];
