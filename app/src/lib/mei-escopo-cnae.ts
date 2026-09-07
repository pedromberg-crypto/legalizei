/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O ESCOPO DOS CNAEs QUE AS OCUPAÇÕES DE MEI MAPEIAM.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. GERADO a partir de `pesquisa/cnae-matriz/cnae-matriz.json` (campos
 * `descricao` e `atividades`, fonte IBGE), filtrado pelos CNAEs que aparecem
 * em `OCUPACOES` (`lib/mei.ts`). **Não editar à mão**: se a matriz mudar,
 * regerar por `_sistema/gerar-escopo-cnae-mei.py`.
 *
 * ─── 🔴 LEIA ISTO ANTES DE USAR ESTE ARQUIVO ────────────────────────────────
 * Este é o escopo do **CNAE**, e o MEI NÃO pode exercer tudo o que ele abrange.
 *
 * Solução de Consulta Cosit nº 27/2021: existe um **limite externo** (o escopo
 * do CNAE, que é o que está aqui) e um **limite interno** (o conceito estrito
 * da ocupação nomeada no Anexo XI). Se o CNAE cobre 5 atividades e o Anexo XI
 * só nomeou 1 como ocupação, as outras 4 estão PROIBIDAS pro MEI.
 *
 * Por isso todo lugar que renderiza `cobre` é obrigado a rotular a lista como
 * sendo **do CNAE** e a mostrar o aviso do limite interno junto. Decisão do
 * Pedro (07/09): mostrar o escopo real, rotulado, vale mais do que esconder —
 * desde que a ressalva venha grudada. Sem o rótulo, a lista vira uma promessa
 * que a Receita não honra.
 *
 * ─── SOBRE O TEXTO ──────────────────────────────────────────────────────────
 * O IBGE guarda tudo em MAIÚSCULAS e com a ordem invertida pra ordenação
 * alfabética ("AUTOMÓVEIS COM MOTORISTA; LOCAÇÃO DE"). O gerador desinverte e
 * devolve pro caixa normal: maiúscula em bloco grita na tela e se lê pior.
 * Teto de 6 itens por CNAE, senão o sheet vira parede de texto.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EscopoCnae {
  /** O nome oficial do CNAE (IBGE). */
  descricao: string;
  /** O que o CNAE abrange. ⚠️ NÃO é o que o MEI pode fazer. */
  cobre: string[];
}

export const ESCOPO_CNAE: Record<string, EscopoCnae> = {
  "5590-6/01": {
    descricao: "Albergues, exceto assistenciais",
    cobre: ["Serviço de alojamento albergue (exceto assistencial)", "Serviço de alojamento em albergues não assistenciais", "Serviços de alojamento em hostel"],
  },
  "5590-6/03": {
    descricao: "Pensões(alojamento)",
    cobre: ["Serviço de alojamento pensão com serviço de alimentação", "Serviço de alojamento pensão sem serviço de alimentação", "Hospedagem pensão", "Serviço de alojamento pensão"],
  },
  "5811-5/00": {
    descricao: "Edição de livros",
    cobre: ["Edição de livros digitais, virtuais (e-books)", "Edição de apostilas", "Edição de atlas", "Produção de audiolivros (audiobooks)", "Edição de dicionários", "Gestão de direitos autorais de obras literárias"],
  },
  "5812-3/01": {
    descricao: "Edição de jornais diários",
    cobre: ["Edição de jornais eletrônicos diários", "Edição de jornais impressos diários", "Edição de jornais na internet diários", "Edição de jornais publicitários diários"],
  },
  "5812-3/02": {
    descricao: "Edição de jornais não diários",
    cobre: ["Edição de jornais eletrônicos não diários", "Edição de jornais impressos não diários", "Edição de jornais na internet não diários", "Edição de jornais publicitários não diários"],
  },
  "5813-1/00": {
    descricao: "Edição de revistas",
    cobre: ["Edição de publicações periódicas", "Edição de revistas de conteúdo técnico ou geral", "Edição de revistas de programação de televisão", "Edição de revistas eletrônicas", "Edição de revistas na internet", "Venda de espaços para publicidade em revistas"],
  },
  "5819-1/00": {
    descricao: "Edição de cadastros, listas e de outros produtos gráficos",
    cobre: ["Edição de cadastros on-line", "Edição de cadastros para mala direta", "Edição de calendários", "Edição de cartões de felicitações", "Edição de cartões postais", "Edição de estatísticas e outras informações para divulgação na internet"],
  },
  "5912-0/01": {
    descricao: "Serviços de dublagem",
    cobre: ["Dublagem de filmes cinematográficos", "Serviços de dublagem de filmes", "Dublagem de programas de televisão", "Dublagem de vídeos"],
  },
  "7319-0/02": {
    descricao: "Promoção de vendas",
    cobre: ["Serviços de demonstração de produtos em pontos de venda", "Serviços de distribuição de folhetos", "Serviços de distribuição de material promocional", "Atividade de distribuição de material publicitário", "Atividade de fullfilment", "Serviços de panfletagem"],
  },
  "7420-0/01": {
    descricao: "Atividades de produção de fotografias, exceto aérea e submarina",
    cobre: ["Atelier fotográfico", "Serviços de cobertura fotográfica para jornais, revistas e eventos", "Estúdio fotográfico", "Serviços de fotógrafo de imprensa", "Produção por fotógrafos independentes", "Produção fotográfica para festas e outros eventos"],
  },
  "7420-0/03": {
    descricao: "Laboratórios fotográficos",
    cobre: ["Montagem de diapositivos", "Laboratório fotográfico", "Serviços de montagem de slides", "Serviços de revelação de fotos", "Serviços de edição de fotografias, exceto para serviços gráficos de pré-impressão", "Filmes fotográficos; atividades de revelação, impressão, ampliação de"],
  },
  "7420-0/04": {
    descricao: "Filmagem de festas e eventos",
    cobre: ["Produção de vídeo para festas e eventos", "Serviços de filmagem de eventos culturais", "Serviços de filmagem de eventos", "Serviços de filmagem de festas", "Gravação de vídeos para festas e eventos"],
  },
  "7721-7/00": {
    descricao: "Aluguel de equipamentos recreativos e esportivos",
    cobre: ["Aluguel de tobogã, pula-pula, escorregador, sem exploração", "Aluguel de, locação de barcos de lazer, canoas, barcos à vela, sem tripulação", "Aluguel de, locação de bicicletas", "Aluguel de, locação de brinquedos não eletrônicos", "Aluguel de, locação de cadeiras de praia, guarda-sóis", "Locação de equipamentos de ginástica"],
  },
  "7722-5/00": {
    descricao: "Aluguel de fitas de vídeo, dvds e similares",
    cobre: ["Aluguel de, locação de blu-ray", "Aluguel de, locação de cartuchos de vídeo game", "Aluguel de, locação de cd", "Aluguel de, locação de cds", "Aluguel de, locação de discos", "Aluguel de, locação de dvds"],
  },
  "7723-3/00": {
    descricao: "Aluguel de objetos do vestuário, jóias e acessórios",
    cobre: ["Aluguel de, locação de acessórios do vestuário", "Aluguel de, locação de acessórios para noivas", "Aluguel de, locação de artigos do vestuário", "Aluguel de, locação de calçados", "Aluguel de, locação de enxoval", "Aluguel de, locação de fantasias"],
  },
  "7729-2/01": {
    descricao: "Aluguel de aparelhos de jogos eletrônicos",
    cobre: ["Aluguel de, locação de aparelhos de jogos eletrônicos", "Aluguel de, locação de aparelhos de videogames", "Aluguel de, locação de brinquedos eletrônicos", "Aluguel de, locação de consoles de jogos eletrônicos", "Aluguel de, locação de fliperamas"],
  },
  "7729-2/02": {
    descricao: "Instrumentos musicais aluguel de móveis, utensílios e aparelhos de uso doméstico e pessoal",
    cobre: ["Aluguel de aparelhos de dvd", "Aluguel de, locação de aparelhos eletrodomésticos", "Aluguel de aparelhos eletroeletrônicos", "Aluguel de ar condicionado", "Aluguel de, locação de cadeiras", "Aluguel de geladeira, freezer"],
  },
  "7729-2/03": {
    descricao: "Aluguel de material médico",
    cobre: ["Aluguel de, locação de cadeiras de roda", "Aluguel de, locação de camas hospitalares", "Aluguel de inaladores", "Aluguel de, locação de material médico", "Aluguel de, locação de muletas"],
  },
  "7729-2/99": {
    descricao: "Aluguel de outros objetos pessoais e domésticos não especificados anteriormente",
    cobre: ["Essas e andores, locação de, aluguel de", "Aluguel de, locação de livros e revistas", "Aluguel de peruca", "Aluguel de, locação de plantas e flores", "Aluguel de árvores e outras decorações de natal"],
  },
  "7733-1/00": {
    descricao: "Aluguel de máquinas e equipamentos para escritórios",
    cobre: ["Aluguel de caixas registradoras", "Aluguel de calculadoras eletrônicas", "Aluguel, locação de celular", "Computadores; aluguel de, locação de, leasing operacional de", "Aluguel de data-show", "Aluguel de, locação de equipamento telefônico"],
  },
  "8219-9/01": {
    descricao: "Fotocópias",
    cobre: ["Loja copiadora", "Serviço de cópia fotostática", "Serviço de cópia heliográfica", "Serviços de cópia xerográfica", "Digitalização para reprodução de cópias", "Digitalização para reprodução de fotos"],
  },
  "8219-9/99": {
    descricao: "Preparação de documentos e serviços especializados de apoio administrativo não especificados anteriormente",
    cobre: ["Serviço de assessoria para solicitação de vistos, passaportes e outros documentos de viagem", "Redação de cartas e resumos", "Serviços de elaboração de cartões de visita, crachás", "Serviço de conferência de textos digitados por terceiros", "Serviço de datilografia", "Serviços de digitação de faturas, documentos, carnês"],
  },
  "8230-0/01": {
    descricao: "Serviços de organização de feiras, congressos, exposições e festas",
    cobre: ["Exposição de animais em feiras", "Atividades de gestão de espaço para exposição, para uso de terceiros", "Serviço de organização de festas familiares", "Serviço de organização de festas infantis", "Serviço de organização de festas", "Serviço de organização de formaturas"],
  },
  "8291-1/00": {
    descricao: "Atividades de cobranças e informações cadastrais",
    cobre: ["Serviços de análise de cadastro para aprovação de crédito", "Serviços de análise e aprovação de crédito", "Gestão de cadastro para recepção de informações de adimplemento", "Atividades de cobrança de faturas e dívidas de clientes", "Atividades de compilação de informações sobre histórico de crédito de pessoas para empresas clientes", "Serviços de consulta de informações cadastrais"],
  },
  "8292-0/00": {
    descricao: "Envasamento e empacotamento sob contrato",
    cobre: ["Serviços de acondicionamento de produtos sólidos/líquidos por conta de terceiros", "Serviços de acondicionamento, fracionamento e empacotamento de arroz, algodão e fumo, fora da unidade agrícola e não complementar ao cultivo", "Serviços de acondicionamento, fracionamento e empacotamento de produtos agrícolas para terceiros, sem transformação, fora da unidade agrícola e não complementar ao cultivo", "Embaladora de produtos sólidos/líquidos por conta de terceiros", "Serviço de embalagem e etiquetagem de produtos por conta de terceiros", "Embalamento de produtos sólidos/líquidos por conta de terceiros"],
  },
  "8299-7/03": {
    descricao: "Serviços de gravação de carimbos, exceto confecção",
    cobre: ["Serviço de gravação de carimbos"],
  },
  "8299-7/07": {
    descricao: "Salas de acesso à internet",
    cobre: ["Sala de acesso à internet combinado com fax , digitação, escaneamento, etc", "Acesso à internet mediante o uso de computadores e periféricos", "Sala de acesso à internet para apoio administrativo ou escritório", "Disponibilização de computadores e periféricos para uso temporário predominante para apoio administrativo ou escritório", "Lan house com acesso à internet predominante para apoio administrativo ou escritório", "Posto telefônico"],
  },
  "8592-9/02": {
    descricao: "Ensino de artes cênicas, exceto dança",
    cobre: ["Ensino de teatro (exceto de nível superior e técnico)", "Curso de impostação de voz para práticas de artes cênicas", "Instrutores independentes de artes cênicas", "Ensino de técnicas de direção e montagem de espetáculos teatrais"],
  },
  "8592-9/03": {
    descricao: "Ensino de música",
    cobre: ["Atividade de aulas de música", "Conservatório de música, exceto de graduação educacional", "Curso, ensino de música, exceto ensino superior"],
  },
  "8592-9/99": {
    descricao: "Ensino de arte e cultura não especificado anteriormente",
    cobre: ["Curso, ensino de artesanato", "Curso, ensino de escultura", "Curso, ensino de pintura"],
  },
  "8593-7/00": {
    descricao: "Ensino de idiomas",
    cobre: ["Atividades de aplicação de exames de proficiência para língua estrangeira", "Curso, ensino de espanhol", "Curso, ensino de francês", "Curso, ensino de idiomas", "Curso, ensino de inglês", "Curso, ensino de italiano"],
  },
  "8599-6/03": {
    descricao: "Treinamento em informática",
    cobre: ["Aulas de informática", "Curso, ensino de computador", "Curso, ensino de informática", "Curso, ensino de microcomputador", "Ensino de tecnologias da informação e acesso à internet"],
  },
  "8599-6/04": {
    descricao: "Treinamento em desenvolvimento profissional e gerencial",
    cobre: ["Serviços de capacitação profissional e gerencial", "Curso de aperfeiçoamento jurídico", "Curso de aperfeiçoamento profissional", "Presencial e à distância curso de aprendizagem e treinamento gerencial", "Curso de comissárias", "Curso de treinamento profissional, gerencial com acesso à internet"],
  },
  "8599-6/05": {
    descricao: "Cursos preparatórios para concursos",
    cobre: ["Escola preparatória para concursos", "Curso preparatório para concursos públicos", "Curso preparatório para o exame nacional de ensino médio (enem)", "Curso, ensino de pré-vestibular", "Curso, ensino de vestibular"],
  },
  "9001-9/01": {
    descricao: "Produção teatral",
    cobre: ["Atividades de artes cênicas teatrais independentes", "Atividade de ator independente", "Companhia de teatro", "Atividade de companhia teatral", "Evento cultural teatral", "Atividade de grupo, conjunto teatral"],
  },
  "9001-9/02": {
    descricao: "Produção musical",
    cobre: ["Produção de arranjo musical", "Atividades de artes cênicas musicais independentes", "Atividades de autoria de músicas", "Atividade de banda musical", "Atividades de cantor, interprete musical", "Atividade de companhias musicais"],
  },
  "9002-7/02": {
    descricao: "Restauração de obras de arte",
    cobre: ["Restauração de objetos de arte", "Serviços de restauração de esculturas", "Serviços de restauração de obras de arte", "Restauração de obras e imagens sacras", "Serviços de restauração de quadros"],
  },
  "9329-8/03": {
    descricao: "Exploração de jogos de sinuca, bilhar e similares",
    cobre: ["Salão de, exploração de bilhar", "Salão de, exploração de sinuca"],
  },
  "9329-8/04": {
    descricao: "Exploração de jogos eletrônicos recreativos",
    cobre: ["Acesso à internet para jogos em rede", "Cyber café com predominancia de exploração de jogos eletrônicos e acesso à internet", "Serviços de exploração de jogos no computador", "Exploração de jogo de fliperama", "Exploração de jogos eletrônicos", "Lan house com acesso à internet predominantemente para jogos em rede"],
  },
  "9511-8/00": {
    descricao: "Reparação e manutenção de computadores e de equipamentos periféricos",
    cobre: ["Manutenção de, reparação de aparelhos de informática", "Serviços de assistência técnica em computadores", "Serviços de assistência técnica em equipamentos de informática", "Serviços de assistência técnica em microcomputadores", "Manutenção de, reparação de caixas eletrônicos de bancos", "Conserto de, reparo de computadores"],
  },
  "9512-6/00": {
    descricao: "Reparação e manutenção de equipamentos de comunicação",
    cobre: ["Reparação de, manutenção de aparelho telefônico de uso público", "Reparação de, manutenção de aparelho telefônico", "Reparação de, manutenção de celular, telefone", "Reparação e manutenção de câmeras de televisão e de vídeo de uso profissional", "Equipamentos de centrais telefonicas, manutenção e reparação executada por unidade especializada", "Reparação de, manutenção de equipamentos de comunicação"],
  },
  "9521-5/00": {
    descricao: "Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico",
    cobre: ["Manutenção de, reparação de, conserto de alarmes de uso doméstico", "Manutenção de, reparação de, conserto de alarmes residenciais", "Manutenção e reparação de antenas e seus receptores para uso individual e coletivo", "Reparação e manutenção de aparelho de reprodução e gravação de cds e dvds", "Manutenção de, reparação de, conserto de aparelhos de refrigeração domésticos", "Manutenção de, reparação de, conserto de aparelhos de som e vídeo"],
  },
  "9529-1/01": {
    descricao: "Reparação de calçados, de bolsas e artigos de viagem",
    cobre: ["Reparação de, conserto de artigos de viagem", "Reparação de, conserto de bolsas", "Renovação, reparação, conserto de calçados de qualquer material", "Renovadora de calçados", "Sapateiro", "Renovação, reparação, conserto de sapatos"],
  },
  "9529-1/02": {
    descricao: "Chaveiros",
    cobre: ["Reparação de, conserto de cadeados", "Chaveiro", "Oficina de cópia de chaves", "Reparação de, conserto de fechaduras"],
  },
  "9529-1/03": {
    descricao: "Reparação de relógios",
    cobre: ["Conserto de, reparação de artigos de relojoaria", "Reparação e manutenção de cronômetros", "Reparação de, conserto de relógios"],
  },
  "9529-1/04": {
    descricao: "Reparação de bicicletas, triciclos e outros veículos não motorizados",
    cobre: ["Reparação e manutenção bicicleta elétrica", "Reparação e manutenção cadeira de roda não motorizada", "Conserto, reparação, manutenção de bicicletas", "Instalação de acessórios bicicletas", "Oficina de bicicletas", "Serviços de pintura de bicicletas, triciclos e de outros veículos recreativos"],
  },
  "9529-1/05": {
    descricao: "Reparação de artigos do mobiliário",
    cobre: ["Conserto de, reparação de armários", "Reparação de, conserto de artigos de madeira", "Reparação de, conserto de artigos de tapeçaria", "Estofamento de artigos do mobiliário", "Reparação de, conserto de artigos do mobiliário", "Reparação de, conserto de cortinas"],
  },
  "9529-1/06": {
    descricao: "Reparação de jóias",
    cobre: ["Serviços de gravação em jóias", "Reparação, conserto de jóias"],
  },
  "9529-1/99": {
    descricao: "Reparação e manutenção de outros objetos e equipamentos pessoais e domésticos não especificados anteriormente",
    cobre: ["Recuperação, reparação, conserto de acessórios do vestuário", "Afiador de artigos de cutelaria", "Amolador de artigos de cutelaria", "Atividade de amolador de facas", "Reparação de, conserto de artigos de borracha", "Reparação de, conserto de artigos de cutelaria"],
  },
  "9602-5/01": {
    descricao: "Cabeleireiros, manicure e pedicure",
    cobre: ["Serviços de alisamento, permanente de cabelo", "Barbearia", "Salão de barbeiro", "Serviços de cabeleireiro", "Serviços de calista", "Coiffure"],
  },
};

/** O escopo de um CNAE, ou `null` se ele não está no recorte. */
export function escopoDe(cnae: string): EscopoCnae | null {
  return ESCOPO_CNAE[cnae] ?? null;
}
