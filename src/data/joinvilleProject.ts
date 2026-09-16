import { CityStation } from '../types';

export const JOINVILLE_STATIONS: CityStation[] = [
  {
    id: 'estacao_itaum',
    name: 'Estação Sul - Itaum / Guanabara',
    zone: 'Zona Sul Residencial e Comercial',
    line: 'vlt_passageiros',
    distanceKm: 0.0,
    accessibilityFeatures: [
      'Piso tátil direcional e de alerta em 100% da área da plataforma',
      'Rampa de acesso suave com inclinação de 5.5% com corrimãos duplos',
      'Portas de plataforma com sincronismo de abertura e vão zero (gap filler mecânico)',
      'Totens interativos com leitura sonora em português e Libras por inteligência de vídeo'
    ],
    elderlyFeatures: [
      'Bancos ergonômicos com assento elevado a 48cm e apoios laterais para facilitar o levantar',
      'Área de convivência com arborização e quiosque de hidratação e aferição de pressão arterial',
      'Iluminação quente (3000K) sem reflexos ofuscantes nos caminhos pedonais'
    ],
    studentFeatures: [
      'Estação de empréstimo de bicicletas integradas ao cartão único de transporte estudantil',
      'Tomadas de recarga USB e USB-C nos assentos cobertos',
      'Painel digital com horários de ônibus alimentadores em tempo real'
    ],
    urbanIntegration: 'Terminal intermodal conectando linhas de ônibus dos bairros Itaum, Guanabara, Petrópolis e Fátima com a Linha 1 do VLT.',
    xPosition: 120,
    yPosition: 440
  },
  {
    id: 'estacao_central',
    name: 'Estação Central Histórica (Bucarein)',
    zone: 'Centro Histórico & Polo Cultural Ferroviário',
    line: 'intermodal',
    distanceKm: 3.2,
    accessibilityFeatures: [
      'Elevadores panorâmicos de vidro com sintetizador de voz e botões em alto-relevo e Braille',
      'Passarela estaiada acessível sobre os pátios de manobra com piso emborrachado antiderrapante',
      'Balcões de atendimento rebaixados para usuários de cadeira de rodas e pessoas de baixa estatura',
      'Sanitários unissex universais com barras articuladas e alarme de emergência em cordão'
    ],
    elderlyFeatures: [
      'Espaço da Memória Ferroviária com climatização amena e cadeiras de descanso acolchoadas',
      'Sinalização com fontes ampliadas de alto contraste (amarelo sobre preto fosco)',
      'Apoio de monitores presenciais treinados em gerontologia e atendimento humanizado'
    ],
    studentFeatures: [
      'Auditório comunitário para oficinas culturais, palestras e feiras científicas',
      'Wi-Fi 6 público gratuito de alta velocidade com pontos de estudo em mesas compartilhadas',
      'Livraria e cafeteria com desconto via carteirinha de estudante'
    ],
    urbanIntegration: 'Preservação tombada da histórica Estação de Joinville de 1906, integrando museu vivo do transporte com o moderno VLT e a linha cargueira segregada.',
    xPosition: 280,
    yPosition: 350
  },
  {
    id: 'estacao_centro_catedral',
    name: 'Estação Centro / Catedral & Praça da Bandeira',
    zone: 'Centro Comercial, Financeiro e Administrativo',
    line: 'vlt_passageiros',
    distanceKm: 5.4,
    accessibilityFeatures: [
      'Faixa de pedestres elevada (traffic calming) nivelada com a calçada em todos os cruzamentos',
      'Semáforos inteligentes com botoeira tátil, contagem regressiva e sinal sonoro modulado',
      'Rua de circulação prioritária pedonal sem degraus ou desníveis repentinos',
      'Piso drenante que elimina poças d’água e reduz risco de quedas em dias de chuva'
    ],
    elderlyFeatures: [
      'Ponto de apoio à terceira idade com farmácia popular integrada e espaço de descanso sombreado por jacarandás',
      'Tempo de travessia do semáforo estendido em 40% com sensor automático de presença',
      'Bancos com encosto confortável posicionados a cada 60 metros nos calçadões do Centro'
    ],
    studentFeatures: [
      'Conexão com os polos de bibliotecas, conservatório de dança e centros cívicos',
      'Pontos de encontro abertos com iluminação fotovoltaica autônoma',
      'Ciclovia bidirecional protegida ligando a Praça da Bandeira até a Beira-Rio'
    ],
    urbanIntegration: 'Coração econômico de Joinville. VLT circula com tração em nível de solo e recarga rápida por pantógrafo nas paradas (sem fios aéreos agressivos no centro histórico).',
    xPosition: 420,
    yPosition: 290
  },
  {
    id: 'estacao_america',
    name: 'Estação América / Beira-Rio',
    zone: 'Bairro Residencial Nobre, Saúde e Esporte',
    line: 'vlt_passageiros',
    distanceKm: 7.8,
    accessibilityFeatures: [
      'Acesso direto ao Parque Linear do Rio Cachoeira com pistas totalmente planas e táteis',
      'Plataforma com teto de vidro e sombreamento solar térmico',
      'Totens com botão SOS direto para a central de tráfego e atendimento de emergência médica',
      'Sinalização podotátil contínua até os centros hospitalares e clínicas do bairro América'
    ],
    elderlyFeatures: [
      'Academia ao ar livre adaptada com equipamentos de baixo impacto articular para a terceira idade',
      'Caminhos ajardinados com flores aromáticas estimulantes de memória e relaxamento',
      'Ponto de embarque e desembarque de vans acessíveis e táxis especiais'
    ],
    studentFeatures: [
      'Pista de caminhada, corrida e patins conectada aos corredores universitários',
      'Espaço verde para grupos de estudos ao ar livre e workshops ambientais',
      'Aluguel de patinetes elétricos regulados com velocidade controlada para segurança'
    ],
    urbanIntegration: 'Interligação sustentável com o Parque Zoobotânico, Centreventos Cau Hansen e o complexo da Escola do Teatro Bolshoi.',
    xPosition: 560,
    yPosition: 230
  },
  {
    id: 'estacao_universitaria',
    name: 'Estação Campus Universitário (Univille & UDESC)',
    zone: 'Polo Universitário e Tecnológico (Zona Norte)',
    line: 'vlt_passageiros',
    distanceKm: 11.5,
    accessibilityFeatures: [
      'Passarela elevada coberta que conecta a plataforma aos prédios das faculdades sem descer ao asfalto',
      'Mapas táteis tridimensionais do campus universitário com legendas em Braille e áudio-guia NFC',
      'Vagões com áreas exclusivas para cão-guia, cadeiras de rodas motorizadas e triciclos adaptados',
      'Botoeiras de chamada de emergência em altura acessível (80 a 100 cm)'
    ],
    elderlyFeatures: [
      'Acesso facilitado ao programa Universidade Aberta à Terceira Idade (UATI)',
      'Microônibus elétrico circular interno com piso baixo para levar os alunos seniores aos blocos de aula',
      'Espaço intergeracional de mentoria onde idosos compartilham vivências com os universitários'
    ],
    studentFeatures: [
      'Capacidade de transporte de até 4.500 estudantes por hora em horários de entrada e saída de aulas',
      'Hub de inovação aberta integrado à estação com mesas para notebooks e bancadas de prototipagem',
      'Terminal seguro e monitorado 24 horas com iluminação inteligente e câmeras de alta resolução'
    ],
    urbanIntegration: 'Elimina mais de 3.000 viagens diárias de automóveis e motocicletas na Av. Santos Dumont, reduzindo acidentes e poluição atmosférica em Joinville.',
    xPosition: 710,
    yPosition: 150
  },
  {
    id: 'estacao_aeroporto_industrial',
    name: 'Estação Aeroporto Lauro Carneiro de Loyola / Perini Park',
    zone: 'Distrito Industrial Norte & Conexão Aérea',
    line: 'intermodal',
    distanceKm: 15.2,
    accessibilityFeatures: [
      'Integração direta com o saguão de check-in do aeroporto com esteiras rolantes planas',
      'Carrinhos de assistência motorizada para transporte de bagagens e pessoas com mobilidade reduzida',
      'Painéis em multilinguagem (Português, Alemão - tradição de Joinville, Inglês e Libras)'
    ],
    elderlyFeatures: [
      'Sala VIP com atendimento preferencial, poltronas ortopédicas reclináveis e acompanhamento até a aeronave',
      'Serviço gratuito de transporte de bagagens assistido por monitores dedicados'
    ],
    studentFeatures: [
      'Conexão direta ao Ágora Tech Park e condomínio industrial para estágios, pesquisas e hackathons',
      'Tarifa integrada universitária com conexão metropolitana'
    ],
    urbanIntegration: 'Extremidade norte da Linha 1 de VLT, unindo alta tecnologia, logística aérea executiva e parques industriais sustentáveis.',
    xPosition: 840,
    yPosition: 90
  }
];

export const FREIGHT_RAILWAY_DATA = {
  lineName: 'Corredor Ferroviário de Cargas Joinville - Porto de São Francisco do Sul',
  gauge: 'Bitola Métrica (1.000 mm) com trechos em bitola mista (1.600 mm)',
  lengthKm: 42.6,
  annualTonnageMillionTons: 18.5,
  cargoTypes: [
    'Produtos metalmecânicos de alta precisão (Joinville como maior polo industrial de SC)',
    'Compressores e motores elétricos (Embraco / Nidec / WEG)',
    'Peças e componentes automotivos e fundição pesada (Tupy)',
    'Contêineres refrigerados e carga geral para exportação marítima',
    'Grãos e insumos agrícolas do interior catarinense com destino aos navios'
  ],
  urbanSafetyMeasures: [
    'Vedação total da faixa de domínio com barreiras acústicas vegetadas de alta densidade',
    'Eliminação de passagens de nível críticas no centro com trincheiras e viadutos ferroviários elevados',
    'Velocidade controlada por sinalização automática ERTMS / CBTC em trechos perimetrais urbanos (máx. 35 km/h)',
    'Horários de manobra pesada concentrados no período noturno para preservar a circulação pedonal diurna'
  ]
};

export const ACCESSIBILITY_GUIDELINES_JOINVILLE = {
  nbr9050Compliance: [
    'Rampas com inclinação calculada pela fórmula i = (h × 100) / c, mantendo patamares a cada 50 metros com inclinação máxima de 6% para idosos',
    'Pisos táteis cromodiferenciados (amarelo de alta refletância) com saliências tronco-cônicas de alerta em inícios de degraus, travessias e obstáculos suspensos',
    'Vão de embarque (plataforma-vagão) limitado a no máximo 20 mm na horizontal e 10 mm na vertical através de rampas retráteis automáticas (gap fillers)',
    'Corrimãos contínuos em duas alturas: 92 cm e 70 cm do piso acabado, prolongando-se 30 cm além do final dos lances'
  ],
  smartCityInnovations: [
    'Sensores ópticos LiDAR nas portas do trem que impedem o fechamento caso detectem bengalas, cadeiras de rodas ou passo lento de idosos',
    'Pavimentação com concreto poroso reciclado que drena instantaneamente as chuvas frequentes de Joinville ("Cidade da Chuva")',
    'Postes de iluminação pública multifuncionais com botão de pânico para emergências, antenas 5G e carregadores de cadeiras de rodas elétricas',
    'Aplicativo municipal com rota 100% livre de barreiras e navegação por voz para deficientes visuais e auditivos'
  ],
  seniorCareInnovations: [
    'Espaços Saúde Ativa 60+ nas estações com técnicos de enfermagem para aferição de pressão arterial, glicemia e oxigenação preventiva',
    'Bancos biomecânicos a 48 cm do solo com apoios de braço centrais que proporcionam alavanca e reduzem esforço articular nos joelhos em 45%',
    'Piso amortecedor de impacto articular (camada resiliente sob o granilite) que suaviza o impacto da caminhada nas pernas e coluna',
    'Semáforos inteligentes com tempo de travessia estendido em até +50% via radar que detecta pedestres com passo reduzido ou bengalas',
    'Sistema sonoro de frequências médias (500 Hz a 1.500 Hz) calibrado para compensar a presbiacusia (perda auditiva da idade) sem estridência',
    'Micro-shuttles elétricos gratuitos conectando as plataformas ferroviárias aos Centros de Convivência do Idoso (CCI) de Joinville'
  ]
};

export const CLEAN_STEAM_TECHNOLOGY = {
  title: 'Tecnologia de Vapor Sustentável & Limpo (Green Hydrogen & Biomethane Eco-Steam)',
  concept: 'Preservação da história ferroviária com emissão zero: transformação da queima fóssil de carvão em queima limpa de Hidrogênio Verde (H2) e Biometano Agroecológico.',
  chemicalReaction: '2 H₂ (Hidrogênio Verde) + O₂ (Oxigênio do Ar) → 2 H₂O (Vapor de Água Puro) + Energia Térmica',
  emissionsProfile: {
    particulateMatterPM25: '0,0 g/km (Eliminação total de fuligem e cinzas)',
    carbonDioxideCO2: '0,0 kg/km (Ciclo neutro / queima limpa de H2)',
    sulfurDioxideSOx: '0,0 g/km (Livre de enxofre fóssil)',
    exhaustSteamNature: '100% Vapor de Água (H2O) purificado e condensável que auxilia na umidificação do microclima urbano'
  },
  technicalComponents: [
    {
      name: 'Queimador Catalítico de Hidrogênio Verde & Biometano',
      description: 'Substitui a fornalha de carvão fóssil por injetores térmicos catalíticos de alta eficiência que aquecem a caldeira de forma uniforme e silenciosa.'
    },
    {
      name: 'Tender Criogênico com Tanques de H2 Comprimido (350 bar)',
      description: 'Vagão de apoio equipado com cilindros compostos de fibra de carbono tipo IV e isolamento térmico de ponta para armazenamento seguro de hidrogênio e água desmineralizada.'
    },
    {
      name: 'Condensador de Circuito Fechado & Reaproveitamento H2O',
      description: 'Recupera até 65% do vapor de água expelido pelos cilindros, filtrando e reenviando ao tanque de alimentação da caldeira, economizando recursos hídricos.'
    },
    {
      name: 'Manutenção do Charme Mecânico e Som Tradicional',
      description: 'A tração mecânica por pistões, bielas Walschaerts, rodas motrizes de ferro fundido, apito e sopro de vapor continuam idênticos ao patrimônio histórico original.'
    }
  ]
};
