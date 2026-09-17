/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADO por `produto/_flow/gerar-mapa.mjs` — NÃO EDITAR À MÃO.
 * ═══════════════════════════════════════════════════════════════════════════
 * Alimenta a tela `/conferencia` (referência do dev): cada tela do caminho
 * Abrir, na ordem de preenchimento, com os campos etiquetados por origem.
 * Mexeu em `flow-data.mjs`? Roda o gerador e esta lista acompanha.
 */
export type OrigemCampo = "usuario" | "automatico" | "api";

export interface CampoConferencia {
  nome: string;
  /** Codigo do select no sistema do governo, quando existe (ex.: "49", "2062"). */
  codigo: string;
  valor: string;
  origem: OrigemCampo;
  porque: string;
  status: string;
  /** So nos campos orfaos (card RPA): a tela citada no `contexto` da fonte. */
  contexto?: string;
}

export interface TelaConferencia {
  id: string;
  titulo: string;
  rota: string | null;
  campos: CampoConferencia[];
}

export const CONFERENCIA: TelaConferencia[] = [
  {
    "id": "E3_3",
    "titulo": "E3.3 · Seus dados (nome · e-mail · telefone)",
    "rota": "/dados",
    "campos": [
      {
        "nome": "Nome completo",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "e-mail",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "telefone",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "consentimento de privacidade (implícito, ao continuar)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "E3_2",
    "titulo": "E3.2 · MEI × ME (variante Abrir)",
    "rota": "/entrada?intencao=abrir",
    "campos": [
      {
        "nome": "Regime autodeclarado (MEI ou ME)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "E3_4",
    "titulo": "E3.4 · Endereço + categoria (os 2 gates)",
    "rota": "/endereco",
    "campos": [
      {
        "nome": "Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$49/mês) OU cidade pra fila de espera",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "categoria de atividade (1 das 15 categorias, `pesquisa/cnae-matriz/taxonomia-pills-n4.md`, v2 27/08 -- 90 CNAEs certeza) OU atividade regulamentada (≤12 opções) pra quem não se encontrou",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "Logradouro, bairro, município e UF (da empresa)",
        "codigo": "",
        "valor": "derivados do CEP digitado",
        "origem": "api",
        "porque": "A pessoa digita só CEP e número; o resto do endereço vem da consulta. Precisa de fallback: CEP inexistente, API fora do ar e endereço sem logradouro (zona rural) são casos reais, e nenhum deles pode travar o gate de BH.",
        "status": "🟡 mock hoje (`buscarCep`), API real pendente"
      }
    ]
  },
  {
    "id": "E5T",
    "titulo": "Triagem quantos sócios?",
    "rota": "/gate?etapa=triagem",
    "campos": [
      {
        "nome": "Quantidade de sócios (1 / 2 / 3 / 4)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "quem administra a empresa (só o titular × titular + sócios) quando há sócio",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "é a 1ª empresa que abre? (opcional)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "sócio que não se encaixa no card informativo (opcional, texto livre via 'Falar com o time')",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "E5F",
    "titulo": "Faixa de faturamento",
    "rota": "/gate?etapa=faixa",
    "campos": [
      {
        "nome": "Faixa de faturamento mensal (4 faixas até R$30 mil, o teto do ME) ou valor exato, se souber",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "E6",
    "titulo": "E6 · Criar conta",
    "rota": "/conta",
    "campos": [
      {
        "nome": "Nome",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "CPF",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "telefone",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "e-mail",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "senha",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "código de verificação de 8 dígitos (mock)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "E6_1",
    "titulo": "E6.1 · Confirmar código",
    "rota": "/conta?etapa=codigo",
    "campos": [
      {
        "nome": "Código de verificação de 8 dígitos (`DIGITOS_CODIGO`), enviado pro e-mail e pro telefone digitados no E6",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "E6_2",
    "titulo": "E6.2 · CPF não confere (nome divergente)",
    "rota": "/conta?cpf=nome",
    "campos": [
      {
        "nome": "Retorno da Receita: nome civil × nome digitado",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "situação cadastral",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "E9",
    "titulo": "E9 · Pagamento + contrato (variante Abrir)",
    "rota": "/pagamento",
    "campos": [
      {
        "nome": "CPF (cobrança + elegibilidade)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "método de pagamento (cartão/Pix/boleto)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "aceite do contrato de serviço (checkbox)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "cartão: número + nome impresso + validade + CVV",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "titular do cartão: nome + CPF + e-mail + telefone (pré-preenchidos, editáveis)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "endereço da fatura: CEP + número + complemento (pré-preenchidos do E3.4, editáveis)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "IP do dispositivo de quem paga (`remoteIp`)",
        "codigo": "",
        "valor": "capturado na requisição do pagamento",
        "origem": "automatico",
        "porque": "Obrigatório na criação de cobrança por cartão no Asaas, e a doc é explícita: é o IP do DISPOSITIVO do pagador, não o do nosso servidor. Mandar o IP do servidor passa no schema e derruba a análise antifraude, que é o pior tipo de bug (silencioso e só visível na taxa de recusa).",
        "status": "🔴 não implementado — depende da integração Asaas"
      },
      {
        "nome": "Tipo de cobrança enviado ao Asaas (`billingType`)",
        "codigo": "",
        "valor": "CREDIT_CARD · PIX · BOLETO (o que a pessoa escolheu)",
        "origem": "automatico",
        "porque": "Débito NÃO entra: o enum de criação de cobrança do Asaas aceita BOLETO, CREDIT_CARD, PIX e UNDEFINED (DEBIT_CARD só aparece em resposta). Pra débito a doc manda redirecionar pro `invoiceUrl`, o que significaria tirar a pessoa do nosso app no meio do pagamento.",
        "status": "🔴 não implementado — depende da integração Asaas"
      },
      {
        "nome": "CPF com MEI ativo (impedimento de DBE)",
        "codigo": "",
        "valor": "consulta antes de gerar o DBE",
        "origem": "api",
        "porque": "Na simulação da Rua Satélite 42 a transmissão do DBE foi REJEITADA porque o CPF do titular já tinha MEI ativo. Hoje o cliente descobriria isso depois de pagar, no meio do processo. É o mesmo endpoint da checagem de regularidade que o E9 já promete: dá pra pegar antes do dinheiro.",
        "status": "🔴 não implementado — achado novo de 01/09"
      },
      {
        "nome": "Situação do CPF na Receita Federal",
        "codigo": "",
        "valor": "consulta no ato do pagamento",
        "origem": "api",
        "porque": "A copy do E9 já diz 'a gente confere na Receita se ele está regular pra abrir empresa'. Enquanto a consulta não existir, isso é promessa sem lastro: CPF irregular só apareceria como recusa da Junta, semanas depois.",
        "status": "🔴 não implementado — hoje a tela só promete a checagem"
      }
    ]
  },
  {
    "id": "C0_0",
    "titulo": "C0.0 · Sua atividade (chegada, antes de descrever)",
    "rota": "/dossie/atividade?vazia=1",
    "campos": [
      {
        "nome": "Descrição da atividade (texto livre)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "categoria já vem preenchida do E3.4",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "C0",
    "titulo": "C0 · Sua atividade (descreve + pills)",
    "rota": "/dossie/atividade",
    "campos": [
      {
        "nome": "Descrição da atividade (texto livre) → CNAE principal (derivado por IA)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "OU o código já sabido (atalho 28/07, mesma engine)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "categoria já vem pré-selecionada do E3.4",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "\"Atividade exercida no local?\" (principal e secundárias)",
        "codigo": "",
        "valor": "Não (sempre)",
        "origem": "automatico",
        "porque": "Marcar Não em TODAS as atividades é o que habilita a opção \"Escritório/sede administrativa\" — se qualquer uma virasse Sim, a Prefeitura entenderia como comércio/loja física, errado pro nosso perfil",
        "status": "🟢 travado"
      },
      {
        "nome": "CNAE principal sugerido pela descrição da atividade",
        "codigo": "",
        "valor": "IA cruza o texto livre + a categoria escolhida no E3.4",
        "origem": "api",
        "porque": "É o único campo do flow em que a máquina PROPÕE e a pessoa confirma. O veredito não pode responder 'não atendemos' (a categoria já filtrou isso antes do pagamento), então o fallback de erro é pedir mais descrição, nunca fechar a porta.",
        "status": "🟡 mock hoje (`mapear()`), motor real pendente"
      }
    ]
  },
  {
    "id": "C5",
    "titulo": "C5 · CNAE secundários",
    "rota": "/dossie/cnae-secundarios",
    "campos": [
      {
        "nome": "CNAEs secundários (seleção múltipla + busca, opcional, até 15)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "C1",
    "titulo": "C1 · Seus dados",
    "rota": "/dossie/socio",
    "campos": [
      {
        "nome": "CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "RG + órgão emissor (digitação manual)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "data de nascimento",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "nacionalidade (pré-preenchida \"Brasileira\")",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "estado civil (+ regime de bens se casado)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "Representante perante a Receita Federal (DBE)",
        "codigo": "",
        "valor": "sempre quem iniciou o cadastro no app",
        "origem": "automatico",
        "porque": "Não é escolha e não é pergunta: quem preenche é o representante, e o DBE puxa a qualificação a partir disso. Se quem vai administrar é outra pessoa, é ela que precisa abrir a conta e conduzir a abertura — permitir 'indicar outro' criaria um caso em que o dono da conta não é o dono do processo.",
        "status": "🟢 travado 01/09"
      },
      {
        "nome": "Profissão (titular E qualquer sócio)",
        "codigo": "",
        "valor": "\"Empresário\"",
        "origem": "automatico",
        "porque": "Campo obrigatório no Integrador (Dados do Sócio/Administrador) pra qualquer sócio — nunca varia por atividade, então não gera dúvida útil pro cliente. Preenchido igual pra titular e sócio extra",
        "status": "🟢 travado, validado 31/08 pelo Pedro"
      },
      {
        "nome": "Qualificação do representante (JUCEMG/DBE)",
        "codigo": "49",
        "valor": "\"49 - Sócio-Administrador\"",
        "origem": "automatico",
        "porque": "Sempre o mesmo código no DBE (Identificação do Representante) — não existe outra qualificação possível pra quem está constituindo a própria empresa",
        "status": "🟢 travado"
      },
      {
        "nome": "Regime de bens — tradução do rótulo pro valor da JUCEMG",
        "codigo": "",
        "valor": "\"Separação total de bens\" (nosso rótulo) → \"Separação Convencional de Bens\" (valor da Junta)",
        "origem": "automatico",
        "porque": "O dropdown real do Integrador (tela 103) tem 5 regimes; o app oferece 4, por decisão do Pedro em 01/09 (\"esse quinto, casamento acima de 70 anos, não faz sentido pra gente\"). Falta a Separação Obrigatória, que é imposta por lei e não escolhida. Consequência aceita: quem estiver nesse regime marca \"Separação total\" e o contrato sai com a qualificação errada — caso raro, sem tela, resolvido no atendimento se aparecer",
        "status": "🟡 travado 01/09, com lacuna conhecida e aceita"
      },
      {
        "nome": "Logradouro, bairro, município e UF (endereço pessoal do titular)",
        "codigo": "",
        "valor": "derivados do CEP digitado",
        "origem": "api",
        "porque": "Mesma consulta do endereço da empresa, outro campo — é a ficha do Representante no DBE.",
        "status": "🟡 mock hoje (`buscarCep`), API real pendente"
      }
    ]
  },
  {
    "id": "C2",
    "titulo": "C2 · Vínculo INSS",
    "rota": "/dossie/vinculo",
    "campos": [
      {
        "nome": "Já contribui INSS por fora? (sim/não)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "C3",
    "titulo": "C3 · Sócios?",
    "rota": "/dossie/socios",
    "campos": [
      {
        "nome": "Confirma se terá mais sócios (sem reperguntar quantidade/tipo)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "se houver, de cada sócio extra: nome completo + CPF + % de participação + data de nascimento + nacionalidade + RG + órgão emissor + estado civil (+ regime de bens se casado) + endereço (CEP com autofill + número + complemento)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "quem administra a empresa: com 1 sócio é sim/não no singular (\"Eu e o Carlos\"), com 2+ vira LISTA de nomes com check por sócio (dá pra ter sócio administrador e sócio que é só sócio)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "Qualificação de cada sócio no DBE (49 × 22)",
        "codigo": "49 - Sócio-Administrador · 22 - Sócio",
        "valor": "derivada da resposta do C3 (quem administra)",
        "origem": "automatico",
        "porque": "É a ÚNICA coisa que a pergunta nova do C3 muda no processo: sócio marcado como administrador vai ao DBE com 49 e sai na cláusula de administração do contrato; sócio não marcado vai com 22 e só aparece no quadro societário. O titular é sempre 49 — quem inicia o cadastro é o representante perante a Receita, e o sistema puxa a qualificação dele sozinho.",
        "status": "🟢 travado 01/09 (Rua Satélite 42, simulação de DBE ao vivo)"
      },
      {
        "nome": "Valor da participação de cada sócio (R$) e quantidade de quotas",
        "codigo": "",
        "valor": "% informado × R$10.000 (o valor em R$ é também o nº de quotas, porque a quota é R$1)",
        "origem": "automatico",
        "porque": "O app pergunta PERCENTUAL; os órgãos pedem VALOR EM REAIS (DBE tela 65: R$10.000,00 pro sócio único; QSA tela 70) e o Integrador pede o valor nominal da quota, R$1,00 (tela 95). A conversão existia na prática e não estava escrita. Como o passo do campo é 0,5%, o menor incremento dá 50 quotas exatas: nenhum percentual selecionável gera fração de quota, então não há arredondamento a tratar. ⚠️ Isso quebra se o capital deixar de ser R$10.000 ou o passo mudar",
        "status": "🟢 travado, documentado 01/09"
      },
      {
        "nome": "Logradouro, bairro, município e UF (endereço do sócio extra)",
        "codigo": "",
        "valor": "derivados do CEP digitado",
        "origem": "api",
        "porque": "Idem, por sócio. Entra na qualificação do contrato (art. 997 CC) e na ficha do sócio no DBE.",
        "status": "🟡 mock hoje (`buscarCep`), API real pendente"
      }
    ]
  },
  {
    "id": "C3_3",
    "titulo": "C3.3 · CPF de sócio não confere",
    "rota": "/dossie/socios?divergencia=1",
    "campos": [
      {
        "nome": "Retorno da Receita por sócio: nome civil × nome digitado",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "situação cadastral",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      }
    ]
  },
  {
    "id": "C4",
    "titulo": "C4 · Dados da empresa",
    "rota": "/dossie/empresa",
    "campos": [
      {
        "nome": "Índice cadastral do IPTU (único campo do cliente)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "CEP + número + complemento + tipo de imóvel + residência aparecem TRAVADOS, vindos do E3.4",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "Forma de atuação (JUCEMG)",
        "codigo": "",
        "valor": "\"Atividade Desenvolvida Fora do Estabelecimento\"",
        "origem": "automatico",
        "porque": "🔴 Estava documentado como \"Internet\" — ERRADO, valor decidido em 26/08 por raciocínio, antes de existir gravação. Os prints mostram \"Atividade Desenvolvida Fora do Estabelecimento\" marcada 2x, em 2 sistemas (tela 14 Viabilidade, tela 48 DBE), e a tela 48 exibe as 8 opções do campo com \"Internet\" entre elas, NÃO marcada: são opções distintas da mesma lista, não sinônimos. 3ª correção desta mesma família (as outras 2: \"Sede\"→Produtiva e metragem). Segue valendo enquanto o escopo for serviço 100% remoto",
        "status": "🟢 travado, corrigido 01/09"
      },
      {
        "nome": "Tipo de unidade (JUCEMG)",
        "codigo": "",
        "valor": "\"Produtiva\"",
        "origem": "automatico",
        "porque": "🔴 Estava documentado como \"Sede\" — ERRADO. Prints reais (Viabilidade e Integrador) confirmam \"Produtiva\": Sede/Filial nem aparece como opção fixa relevante pra uma constituição nova. Toda abertura nova (matriz) usa Produtiva",
        "status": "🟢 travado, corrigido 31/08"
      },
      {
        "nome": "Metragem (m² do imóvel + m² da operação)",
        "codigo": "",
        "valor": "20 m² (fixo)",
        "origem": "automatico",
        "porque": "🔴 Estava \"não implementado, sem decisão\" — RESOLVIDO. Print real da Viabilidade mostra Área Total e Área Utilizada sempre preenchidas com 20,00 — mesmo valor usado em toda a gravação, virou padrão",
        "status": "🟢 travado, resolvido 31/08"
      },
      {
        "nome": "Capital social",
        "codigo": "",
        "valor": "R$ 10.000,00 (fixo)",
        "origem": "automatico",
        "porque": "🔴 ATÉ 31/08 era campo editável (chips R$1k/5k/10k + valor livre) — a reunião Rua Satélite 38-40 decidiu travar em R$10.000 pra prestador de serviço. Deixou de ser pergunta: o app mostra o valor, não pede mais",
        "status": "🔒 travado, validado 31/08 pelo Pedro"
      },
      {
        "nome": "Valor nominal de cotas",
        "codigo": "",
        "valor": "R$ 1,00",
        "origem": "automatico",
        "porque": "Campo do Integrador (Dados da Matriz) sempre preenchido como R$1,00 — o capital social é dividido em quotas de R$1, nunca outro valor nominal",
        "status": "🟢 travado"
      },
      {
        "nome": "Acesso ao endereço",
        "codigo": "",
        "valor": "\"Pedestre\"",
        "origem": "automatico",
        "porque": "Campo da Prefeitura de BH (Dados Adicionais), sempre Pedestre pro nosso perfil de prestador de serviço remoto — nunca veículo leve/pesado",
        "status": "🟢 travado"
      },
      {
        "nome": "\"Atividade é inócua ou virtual?\"",
        "codigo": "",
        "valor": "Sim (sempre)",
        "origem": "automatico",
        "porque": "Pergunta do Licenciamento (Corpo de Bombeiros): atividade sem circulação de pessoas no local, sempre verdade pro nosso perfil 100% remoto/administrativo",
        "status": "🟢 travado"
      },
      {
        "nome": "\"Edificação nova?\" (regulação urbana, Prefeitura de BH)",
        "codigo": "",
        "valor": "Não (sempre)",
        "origem": "automatico",
        "porque": "3ª pergunta do Questionário de Regulação Urbana (tela 16), na MESMA tela que já produziu o indeferimento real. As outras 2 (apartamento, sócio reside) a gente já capta; esta não existia em nenhuma fonte. Fica interna e não vira pergunta porque \"edificação nova\" tem sentido técnico na Prefeitura (imóvel recém-construído, questão de habite-se) que o cliente não sabe responder — perguntar convida erro confiante, que é pior modo de falhar que errar sempre igual num caso raro. Risco residual: cliente em prédio novo sem habite-se cai em exigência. Validado por Pedro 01/09; confirmar com a especialista",
        "status": "🟡 travado 01/09, é SUPOSIÇÃO — fila-Izabela"
      },
      {
        "nome": "Capital Totalmente Integralizado em Moeda Corrente?",
        "codigo": "",
        "valor": "Sim (sempre)",
        "origem": "automatico",
        "porque": "Cláusula do Contrato Núcleo — o capital social (R$10.000, também travado) já entra integralizado, sem parcelamento",
        "status": "🟢 travado"
      },
      {
        "nome": "Tipo de endereço (JUCEMG) — endereço fiscal Legalizai",
        "codigo": "",
        "valor": "\"Endereço virtual\" (fixo)",
        "origem": "automatico",
        "porque": "Confirmado na gravação real (RS38): quando a empresa usa o endereço fiscal da Legalizai (não o do cliente), o valor sempre enviado à JUCEMG é \"Endereço virtual\" — nunca aparece como opção pro usuário, só se aplica ao caminho endereço-próprio (\"proprio\"/\"coworking\")",
        "status": "🟢 travado, validado 31/08 pelo Pedro"
      }
    ]
  },
  {
    "id": "C7",
    "titulo": "C7 · Nome / razão social",
    "rota": "/dossie/nome",
    "campos": [
      {
        "nome": "3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "objeto social (gerado automaticamente, travado)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "nome fantasia (opcional)",
        "codigo": "",
        "valor": "",
        "origem": "usuario",
        "porque": "",
        "status": ""
      },
      {
        "nome": "Data de assinatura da declaração / início das atividades",
        "codigo": "",
        "valor": "dia do preenchimento (nunca retroativa)",
        "origem": "automatico",
        "porque": "Integrador não aceita data retroativa — sempre o dia em que o RPA roda o processo, pros dois campos (mesma data)",
        "status": "🟢 travado"
      }
    ]
  },
  {
    "id": "RPA",
    "titulo": "Fora de tela · preenchido no processo (RPA)",
    "rota": null,
    "campos": [
      {
        "nome": "Forma de assinatura (isolada × conjunta)",
        "codigo": "",
        "valor": "NÃO enviada — o contrato padrão não tem esse campo",
        "origem": "automatico",
        "porque": "🔴 Regra dura: inserir cláusula de assinatura tira o processo do contrato PADRÃO e manda pra análise humana (mesma família do achado da procuração, 31/08). O contrato padrão gerado não fala em forma de assinatura, e a cláusula 8ª do modelo dá a cada administrador representação ativa e passiva pra praticar todos os atos do objeto social; a assinatura de todos só é exigida em atos extraordinários (onerar/alienar imóvel da sociedade, obrigações em favor de cotistas ou terceiros). 🟡 Leitura conferida por IA sobre o contrato real da simulação; falta ratificação da contadora e teste em banco.",
        "status": "🟢 travado 01/09, com o contrato real na tela",
        "contexto": "Pós-C7 · Geração do contrato (RPA/Integrador)"
      },
      {
        "nome": "Telas de conferência do DBE (dados vindos da viabilidade)",
        "codigo": "",
        "valor": "puladas pelo RPA — nome empresarial, natureza, nome fantasia, CNAEs, objeto social, endereço da PJ, porte ME e dados do contador vêm importados",
        "origem": "automatico",
        "porque": "Tudo isso já foi decidido na viabilidade e chega preenchido: reconferir campo a campo só gastaria tempo de robô.",
        "status": "🟢 observado na simulação 01/09",
        "contexto": "Pós-C7 · DBE (RPA)"
      },
      {
        "nome": "Tipo de evento (Viabilidade JUCEMG)",
        "codigo": "101",
        "valor": "Inscrição de primeiro estabelecimento (Matriz)",
        "origem": "automatico",
        "porque": "Toda constituição nossa é matriz nascendo: não existe caso de filial nem de alteração no escopo do MVP. É a 1ª escolha da tela de Nova Viabilidade, e errar aqui manda o processo pra outro rito inteiro.",
        "status": "🟢 travado, visto na gravação (print 2)",
        "contexto": "Pós-C7 · Viabilidade (RPA/JUCEMG)"
      },
      {
        "nome": "Código do ato (Integrador · Novo FCN)",
        "codigo": "090",
        "valor": "Constituição",
        "origem": "automatico",
        "porque": "Par do evento 101 do outro lado do processo: no Integrador o que identifica o rito é o código do ato, não o nome.",
        "status": "🟢 travado, visto na gravação (RS39)",
        "contexto": "Pós-C7 · Integrador (RPA)"
      },
      {
        "nome": "Evento de enquadramento (JUCEMG)",
        "codigo": "315",
        "valor": "Enquadramento de Microempresa",
        "origem": "automatico",
        "porque": "É o evento que faz a empresa nascer JÁ enquadrada como ME, no mesmo processo. Sem ele a empresa nasce sem enquadramento e o cliente precisaria de um 2º ato (e de uma 2ª taxa) — e é este evento que faz a guia da Junta custar R$281,08, porque a conferência cobra 2 atos.",
        "status": "🟢 travado, visto na gravação (RS39)",
        "contexto": "Pós-C7 · Integrador (RPA)"
      },
      {
        "nome": "Telefone enviado aos órgãos — SEM o 9º dígito (8 dígitos)",
        "codigo": "",
        "valor": "o telefone captado com 9 dígitos é enviado ao DBE/Integrador sem o 9 inicial do celular",
        "origem": "automatico",
        "porque": "Regra dita pela Izabela na gravação (ata, item 13) e confirmada nos prints (tela 51: telefone 94054307, 8 dígitos). Decisão do Pedro: **a captação continua com o 9 normal** — pedir telefone sem o 9 pro cliente seria estranho e daria erro de digitação. Quem tira o dígito é o robô, na hora de preencher o formulário oficial. Fica aqui porque é transformação de dado nossa, invisível pro cliente, e o dev precisa dela escrita",
        "status": "🟢 travado 01/09 (Pedro) — regra de RPA, não de tela",
        "contexto": "RPA · envio ao DBE/Integrador (a captação no E6 não muda)"
      },
      {
        "nome": "Sociedade de Propósito Específico?",
        "codigo": "",
        "valor": "Não (sempre)",
        "origem": "automatico",
        "porque": "Cláusula do Contrato Núcleo — nenhuma empresa do nosso escopo (ME prestador de serviço comum) é SPE. Campo do contrato, não pergunta ao cliente",
        "status": "🟢 travado",
        "contexto": "C6 · Natureza jurídica"
      },
      {
        "nome": "Tipo de contrato (Integrador)",
        "codigo": "",
        "valor": "Padrão · 15 cláusulas obrigatórias (sem anexo, sem cláusula extra)",
        "origem": "automatico",
        "porque": "🔴 ACHADO-CHAVE (31/08): incluir anexo/procuração/cláusula extra no processo DERRUBA a elegibilidade ao Registro Automático (aviso visto ao vivo no print da JUCEMG) — por isso a opção de 15 cláusulas sem anexo é a única que usamos, nunca a de 7 cláusulas nem o contrato personalizado (upload)",
        "status": "🟢 travado",
        "contexto": "Pós-C7 · Geração do contrato (RPA/Integrador)"
      },
      {
        "nome": "Testemunhas (Contrato Núcleo)",
        "codigo": "",
        "valor": "Nenhuma (sempre)",
        "origem": "automatico",
        "porque": "Contrato padrão de 15 cláusulas não exige testemunha — campo sempre vazio, nunca preenchido",
        "status": "🟢 travado",
        "contexto": "Pós-C7 · Geração do contrato (RPA/Integrador)"
      },
      {
        "nome": "E-mail e telefone de contato (DBE/Integrador)",
        "codigo": "",
        "valor": "sempre o nosso (Legalizai), nunca o do cliente",
        "origem": "automatico",
        "porque": "Evita que boletim de ocorrência (BO) ou notificação oficial da Receita/Junta chegue direto pro cliente por e-mail — a gente centraliza e repassa o que for relevante",
        "status": "🟢 travado",
        "contexto": "DBE/Integrador · Dados para Contato"
      },
      {
        "nome": "Endereço de correspondência",
        "codigo": "",
        "valor": "sempre igual ao do estabelecimento",
        "origem": "automatico",
        "porque": "Checkbox \"igual ao do Estabelecimento\" sempre marcado — nenhum caso do nosso escopo precisa de endereço de correspondência diferente",
        "status": "🟢 travado",
        "contexto": "DBE/Integrador · Dados para Contato"
      },
      {
        "nome": "Natureza jurídica (SLU × LTDA)",
        "codigo": "2062 (Viabilidade/Integrador) · 206-2 (DBE)",
        "valor": "SLU se sem sócio · LTDA se com sócio (automático, sem pergunta)",
        "origem": "automatico",
        "porque": "🔴 ATÉ 31/08 era pergunta ao cliente (recomendação editável, Leonan 24/08) — a reunião Rua Satélite 38-40 decidiu tirar a pergunta de vez: a regra (sem sócio→SLU, com sócio→LTDA) não tem exceção real no nosso escopo, então virou decisão de backend nos dois casos. Tela e rota `/dossie/natureza` removidas do app",
        "status": "🟢 travado, validado 31/08 pelo Pedro",
        "contexto": "C6 · Natureza jurídica (REMOVIDA 31/08)"
      },
      {
        "nome": "Requerente (emissão do DAE)",
        "codigo": "",
        "valor": "sempre o titular (sócio-administrador)",
        "origem": "automatico",
        "porque": "Quem solicita a taxa no Integrador é sempre a pessoa que está constituindo a empresa — não existe cenário de \"outro requerente\" no nosso fluxo",
        "status": "🟢 travado",
        "contexto": "Pós-C7 · Emissão do DAE (RPA)"
      },
      {
        "nome": "Situação do protocolo na JUCEMG / Receita (viabilidade, DBE, registro)",
        "codigo": "",
        "valor": "polling do protocolo",
        "origem": "api",
        "porque": "Todo o status pós-dossiê depende disso: é o que move as etapas, dispara a recusa de nome (A3.1) e libera a assinatura. Sem polling, a tela é um enfeite bonito que nunca muda de estado.",
        "status": "🔴 não implementado — a timeline hoje é mock",
        "contexto": "A3 · Status"
      }
    ]
  }
];
