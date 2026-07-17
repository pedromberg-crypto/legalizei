---
tipo: derivado
status: rascunho
data: 2026-07-16
assunto: taxonomia-pills-n4
deriva_de: [limpeza-260-servico]
gerado_por: pesquisa/cnae-matriz/taxonomia-pills.js
tags: [cnae, ux, n4, pills, rascunho]
---

# 🏷️ Taxonomia de pills do N4

> ⚠️ **NOTA DERIVADA. Não editar na mão.** Sai de `node pesquisa/cnae-matriz/taxonomia-pills.js --nota`.

## ⚠️ Confiança desta lista

As **124 subclasses** aqui embaixo **não são lista validada**. São as que sobreviveram à classificação de 16/07 sem serem refutadas ([[limpeza-260-servico]]). **Nenhum contador olhou.** A taxonomia herda exatamente essa confiança.

**Serve pra:** testar o mecanismo da pill no N4. **Não serve pra:** prometer cobertura a cliente.

## Por que pill não é seção do IBGE

Ninguém se apresenta dizendo *"trabalho com Atividades Administrativas E Serviços Complementares"*. UX-05: linguagem humana ANTES do código. A seção serviu pra classificar; ela não serve pra falar.

## As pills

| Pill | CNAEs | Exemplo que ela oferece |
|---|---|---|
| **Tecnologia** | 8 | *"Desenvolvo sistemas e aplicativos sob encomenda"* |
| **Design e audiovisual** | 16 | *"Crio logo e identidade visual de marca"* |
| **Marketing e publicidade** | 8 | *"Cuido das redes sociais de uns cinco clientes"* |
| **Comunicação e mídia** | 7 | *"Escrevo e edito conteúdo para revista e jornal"* |
| **Consultoria e apoio a empresas** | 19 | *"Dou consultoria de gestão para dono de pequena empresa"* |
| **Educação e cursos** | 10 | *"Dou aula particular de inglês online"* |
| **Beleza, bem-estar e pets** | 10 | *"Atendo em salão de beleza e faço unha"* |
| **Eventos, cultura e esporte** | 23 | *"Organizo festa e evento corporativo"* |
| **Limpeza, manutenção e reparos** | 23 | *"Faço limpeza em prédio e em condomínio"* |
| | **124** | |

## 🔎 Leitura honesta

**9 pills é mais do que eu embarcaria.** A Contabilizei tem 13 e é um dropdown, que rola. Pill é chip, ocupa área. Num vidro de 430pt, 9 pills = 3 a 4 fileiras, e elas comem justamente a caixa de texto que acabou de crescer pra ser superfície de escrita.

**Onde o corte dói menos, se for pra cortar:**

1. **Fundir `Comunicação e mídia` (7) em `Marketing e publicidade`** → 15. Editora de livro fica torta lá dentro, mas é a fusão mais barata.
2. **`Eventos, cultura e esporte` (23) e `Limpeza, manutenção e reparos` (23) são sacos**. Cobrem muito CNAE e pouca identidade: quem faz reboque não se reconhece na mesma pill de quem faz paisagismo. Se der pra medir demanda, provavelmente quebram ou encolhem.
3. **A pill não precisa cobrir os 124.** A caixa de texto é o escape, e é melhor que o *"Minha atividade não está na lista"* do líder. Cobrir a DEMANDA (5 ou 6 áreas de quem de fato aparece) vale mais que cobrir a LISTA.

⚠️ **Não temos dado de demanda.** A ordem acima é palpite meu, não medição.

---

## Composição

### Tecnologia (8)

> Exemplo: *"Desenvolvo sistemas e aplicativos sob encomenda"*

| CNAE | Descrição |
|---|---|
| `6201-5/01` | DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA |
| `6201-5/02` | WEB DESIGN |
| `6202-3/00` | DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR CUSTOMIZÁVEIS |
| `6203-1/00` | DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR NÃO CUSTOMIZÁVEIS |
| `6204-0/00` | CONSULTORIA EM TECNOLOGIA DA INFORMAÇÃO |
| `6209-1/00` | SUPORTE TÉCNICO, MANUTENÇÃO E OUTROS SERVIÇOS EM TECNOLOGIA DA INFORMAÇÃO |
| `6311-9/00` | TRATAMENTO DE DADOS, PROVEDORES DE SERVIÇOS DE APLICAÇÃO E SERVIÇOS DE HOSPEDAGEM NA INTERNET |
| `6319-4/00` | PORTAIS, PROVEDORES DE CONTEÚDO E OUTROS SERVIÇOS DE INFORMAÇÃO NA INTERNET |

### Design e audiovisual (16)

> Exemplo: *"Crio logo e identidade visual de marca"*

| CNAE | Descrição |
|---|---|
| `5911-1/01` | ESTÚDIOS CINEMATOGRÁFICOS |
| `5911-1/02` | PRODUÇÃO DE FILMES PARA PUBLICIDADE |
| `5911-1/99` | ATIVIDADES DE PRODUÇÃO CINEMATOGRÁFICA, DE VÍDEOS E DE PROGRAMAS DE TELEVISÃO NÃO ESPECIFICADAS ANTERIORMENTE |
| `5912-0/01` | SERVIÇOS DE DUBLAGEM |
| `5912-0/02` | SERVIÇOS DE MIXAGEM SONORA EM PRODUÇÃO AUDIOVISUAL |
| `5912-0/99` | ATIVIDADES DE PÓS PRODUÇÃO CINEMATOGRÁFICA, DE VÍDEOS E DE PROGRAMAS DE TELEVISÃO NÃO ESPECIFICADAS ANTERIORMENTE |
| `5913-8/00` | DISTRIBUIÇÃO CINEMATOGRÁFICA, DE VÍDEO E DE PROGRAMAS DE TELEVISÃO |
| `5920-1/00` | ATIVIDADES DE GRAVAÇÃO DE SOM E DE EDIÇÃO DE MÚSICA |
| `7410-2/02` | DESIGN DE INTERIORES |
| `7410-2/03` | DESIGN DE PRODUTO |
| `7410-2/99` | ATIVIDADES DE DESIGN NÃO ESPECIFICADAS ANTERIORMENTE |
| `7420-0/01` | ATIVIDADES DE PRODUÇÃO DE FOTOGRAFIAS, EXCETO AÉREA E SUBMARINA |
| `7420-0/02` | ATIVIDADES DE PRODUÇÃO DE FOTOGRAFIAS AÉREAS E SUBMARINAS |
| `7420-0/03` | LABORATÓRIOS FOTOGRÁFICOS |
| `7420-0/04` | FILMAGEM DE FESTAS E EVENTOS |
| `7420-0/05` | SERVIÇOS DE MICROFILMAGEM |

### Marketing e publicidade (8)

> Exemplo: *"Cuido das redes sociais de uns cinco clientes"*

| CNAE | Descrição |
|---|---|
| `7311-4/00` | AGÊNCIAS DE PUBLICIDADE |
| `7312-2/00` | AGENCIAMENTO DE ESPAÇOS PARA PUBLICIDADE, EXCETO EM VEÍCULOS DE COMUNICAÇÃO |
| `7319-0/01` | CRIAÇÃO ESTANDES PARA FEIRAS E EXPOSIÇÕES |
| `7319-0/02` | PROMOÇÃO DE VENDAS |
| `7319-0/03` | MARKETING DIRETO |
| `7319-0/04` | CONSULTORIA EM PUBLICIDADE |
| `7319-0/99` | OUTRAS ATIVIDADES DE PUBLICIDADE NÃO ESPECIFICADAS ANTERIORMENTE |
| `7320-3/00` | PESQUISAS DE MERCADO E DE OPINIÃO PÚBLICA |

### Comunicação e mídia (7)

> Exemplo: *"Escrevo e edito conteúdo para revista e jornal"*

| CNAE | Descrição |
|---|---|
| `5811-5/00` | EDIÇÃO DE LIVROS |
| `5812-3/01` | EDIÇÃO DE JORNAIS DIÁRIOS |
| `5812-3/02` | EDIÇÃO DE JORNAIS NÃO DIÁRIOS |
| `5813-1/00` | EDIÇÃO DE REVISTAS |
| `5819-1/00` | EDIÇÃO DE CADASTROS, LISTAS E DE OUTROS PRODUTOS GRÁFICOS |
| `6391-7/00` | AGÊNCIAS DE NOTÍCIAS |
| `6399-2/00` | OUTRAS ATIVIDADES DE PRESTAÇÃO DE SERVIÇOS DE INFORMAÇÃO NÃO ESPECIFICADAS ANTERIORMENTE |

### Consultoria e apoio a empresas (19)

> Exemplo: *"Dou consultoria de gestão para dono de pequena empresa"*

| CNAE | Descrição |
|---|---|
| `7020-4/00` | ATIVIDADES DE CONSULTORIA EM GESTÃO EMPRESARIAL, EXCETO CONSULTORIA TÉCNICA ESPECÍFICA |
| `7210-0/00` | PESQUISA E DESENVOLVIMENTO EXPERIMENTAL EM CIÊNCIAS FÍSICAS E NATURAIS |
| `7220-7/00` | PESQUISA E DESENVOLVIMENTO EXPERIMENTAL EM CIÊNCIAS SOCIAIS E HUMANAS |
| `7490-1/01` | SERVIÇOS DE TRADUÇÃO, INTERPRETAÇÃO E SIMILARES |
| `7490-1/04` | ATIVIDADES DE INTERMEDIAÇÃO E AGENCIAMENTO DE SERVIÇOS E NEGÓCIOS EM GERAL, EXCETO IMOBILIÁRIOS |
| `7490-1/05` | AGENCIAMENTO DE PROFISSIONAIS PARA ATIVIDADES ESPORTIVAS, CULTURAIS E ARTÍSTICAS |
| `7490-1/99` | OUTRAS ATIVIDADES PROFISSIONAIS, CIENTÍFICAS E TÉCNICAS NÃO ESPECIFICADAS ANTERIORMENTE |
| `7723-3/00` | ALUGUEL DE OBJETOS DO VESTUÁRIO, JÓIAS E ACESSÓRIOS |
| `7733-1/00` | ALUGUEL DE MÁQUINAS E EQUIPAMENTOS PARA ESCRITÓRIOS |
| `8211-3/00` | SERVIÇOS COMBINADOS DE ESCRITÓRIO E APOIO ADMINISTRATIVO |
| `8219-9/01` | FOTOCÓPIAS |
| `8219-9/99` | PREPARAÇÃO DE DOCUMENTOS E SERVIÇOS ESPECIALIZADOS DE APOIO ADMINISTRATIVO NÃO ESPECIFICADOS ANTERIORMENTE |
| `8220-2/00` | ATIVIDADES DE TELEATENDIMENTO |
| `8291-1/00` | ATIVIDADES DE COBRANÇAS E INFORMAÇÕES CADASTRAIS |
| `8299-7/02` | EMISSÃO DE VALES ALIMENTAÇÃO, VALES TRANSPORTE E SIMILARES |
| `8299-7/03` | SERVIÇOS DE GRAVAÇÃO DE CARIMBOS, EXCETO CONFECÇÃO |
| `8299-7/05` | SERVIÇOS DE LEVANTAMENTO DE FUNDOS SOB CONTRATO |
| `8299-7/07` | SALAS DE ACESSO À INTERNET |
| `8299-7/99` | OUTRAS ATIVIDADES DE SERVIÇOS PRESTADOS PRINCIPALMENTE ÀS EMPRESAS NÃO ESPECIFICADAS ANTERIORMENTE |

### Educação e cursos (10)

> Exemplo: *"Dou aula particular de inglês online"*

| CNAE | Descrição |
|---|---|
| `8550-3/02` | ATIVIDADES DE APOIO À EDUCAÇÃO, EXCETO CAIXAS ESCOLARES |
| `8592-9/01` | ENSINO DE DANÇA |
| `8592-9/02` | ENSINO DE ARTES CÊNICAS, EXCETO DANÇA |
| `8592-9/03` | ENSINO DE MÚSICA |
| `8592-9/99` | ENSINO DE ARTE E CULTURA NÃO ESPECIFICADO ANTERIORMENTE |
| `8593-7/00` | ENSINO DE IDIOMAS |
| `8599-6/03` | TREINAMENTO EM INFORMÁTICA |
| `8599-6/04` | TREINAMENTO EM DESENVOLVIMENTO PROFISSIONAL E GERENCIAL |
| `8599-6/05` | CURSOS PREPARATÓRIOS PARA CONCURSOS |
| `8599-6/99` | OUTRAS ATIVIDADES DE ENSINO NÃO ESPECIFICADAS ANTERIORMENTE |

### Beleza, bem-estar e pets (10)

> Exemplo: *"Atendo em salão de beleza e faço unha"*

| CNAE | Descrição |
|---|---|
| `9601-7/01` | LAVANDERIAS |
| `9601-7/02` | TINTURARIAS |
| `9601-7/03` | TOALHEIROS |
| `9602-5/01` | CABELEIREIROS, MANICURE E PEDICURE |
| `9602-5/02` | ATIVIDADES DE ESTÉTICA E OUTROS SERVIÇOS DE CUIDADOS COM A BELEZA |
| `9609-2/02` | AGÊNCIAS MATRIMONIAIS |
| `9609-2/04` | EXPLORAÇÃO DE MÁQUINAS DE SERVIÇOS PESSOAIS ACIONADAS POR MOEDA |
| `9609-2/07` | ALOJAMENTO DE ANIMAIS DOMÉSTICOS |
| `9609-2/08` | HIGIENE E EMBELEZAMENTO DE ANIMAIS DOMÉSTICOS |
| `9609-2/99` | OUTRAS ATIVIDADES DE SERVIÇOS PESSOAIS NÃO ESPECIFICADAS ANTERIORMENTE |

### Eventos, cultura e esporte (23)

> Exemplo: *"Organizo festa e evento corporativo"*

| CNAE | Descrição |
|---|---|
| `7911-2/00` | AGÊNCIAS DE VIAGENS |
| `7912-1/00` | OPERADORES TURÍSTICOS |
| `7990-2/00` | SERVIÇOS DE RESERVAS E OUTROS SERVIÇOS DE TURISMO NÃO ESPECIFICADOS ANTERIORMENTE |
| `8230-0/01` | SERVIÇOS DE ORGANIZAÇÃO DE FEIRAS, CONGRESSOS, EXPOSIÇÕES E FESTAS |
| `8230-0/02` | CASAS DE FESTAS E EVENTOS |
| `9001-9/01` | PRODUÇÃO TEATRAL |
| `9001-9/02` | PRODUÇÃO MUSICAL |
| `9001-9/03` | PRODUÇÃO DE ESPETÁCULOS DE DANÇA |
| `9001-9/04` | PRODUÇÃO DE ESPETÁCULOS CIRCENSES, DE MARIONETES E SIMILARES |
| `9001-9/06` | ATIVIDADES DE SONORIZAÇÃO E DE ILUMINAÇÃO |
| `9001-9/99` | ARTES CÊNICAS, ESPETÁCULOS E ATIVIDADES COMPLEMENTARES NÃO ESPECIFICADAS ANTERIORMENTE |
| `9002-7/01` | ATIVIDADES DE ARTISTAS PLÁSTICOS, JORNALISTAS INDEPENDENTES E ESCRITORES |
| `9002-7/02` | RESTAURAÇÃO DE OBRAS DE ARTE |
| `9003-5/00` | GESTÃO DE ESPAÇOS PARA ARTES CÊNICAS, ESPETÁCULOS E OUTRAS ATIVIDADES ARTÍSTICAS |
| `9311-5/00` | GESTÃO DE INSTALAÇÕES DE ESPORTES |
| `9313-1/00` | ATIVIDADES DE CONDICIONAMENTO FÍSICO |
| `9319-1/01` | PRODUÇÃO E PROMOÇÃO DE EVENTOS ESPORTIVOS |
| `9319-1/99` | OUTRAS ATIVIDADES ESPORTIVAS NÃO ESPECIFICADAS ANTERIORMENTE |
| `9329-8/01` | DISCOTECAS, DANCETERIAS, SALÕES DE DANÇA E SIMILARES |
| `9329-8/02` | EXPLORAÇÃO DE BOLICHES |
| `9329-8/03` | EXPLORAÇÃO DE JOGOS DE SINUCA, BILHAR E SIMILARES |
| `9329-8/04` | EXPLORAÇÃO DE JOGOS ELETRÔNICOS RECREATIVOS |
| `9329-8/99` | OUTRAS ATIVIDADES DE RECREAÇÃO E LAZER NÃO ESPECIFICADAS ANTERIORMENTE |

### Limpeza, manutenção e reparos (23)

> Exemplo: *"Faço limpeza em prédio e em condomínio"*

| CNAE | Descrição |
|---|---|
| `3600-6/02` | DISTRIBUIÇÃO DE ÁGUA POR CAMINHÕES |
| `3702-9/00` | ATIVIDADES RELACIONADAS A ESGOTO, EXCETO A GESTÃO DE REDES |
| `3811-4/00` | COLETA DE RESÍDUOS NÃO PERIGOSOS |
| `3821-1/00` | TRATAMENTO E DISPOSIÇÃO DE RESÍDUOS NÃO PERIGOSOS |
| `5223-1/00` | ESTACIONAMENTO DE VEÍCULOS |
| `5229-0/01` | SERVIÇOS DE APOIO AO TRANSPORTE POR TÁXI, INCLUSIVE CENTRAIS DE CHAMADA |
| `5229-0/02` | SERVIÇOS DE REBOQUE DE VEÍCULOS |
| `5229-0/99` | OUTRAS ATIVIDADES AUXILIARES DOS TRANSPORTES TERRESTRES NÃO ESPECIFICADAS ANTERIORMENTE |
| `8111-7/00` | SERVIÇOS COMBINADOS PARA APOIO A EDIFÍCIOS, EXCETO CONDOMÍNIOS PREDIAIS |
| `8121-4/00` | LIMPEZA EM PRÉDIOS E EM DOMICÍLIOS |
| `8122-2/00` | IMUNIZAÇÃO E CONTROLE DE PRAGAS URBANAS |
| `8129-0/00` | ATIVIDADES DE LIMPEZA NÃO ESPECIFICADAS ANTERIORMENTE |
| `8130-3/00` | ATIVIDADES PAISAGÍSTICAS |
| `9511-8/00` | REPARAÇÃO E MANUTENÇÃO DE COMPUTADORES E DE EQUIPAMENTOS PERIFÉRICOS |
| `9512-6/00` | REPARAÇÃO E MANUTENÇÃO DE EQUIPAMENTOS DE COMUNICAÇÃO |
| `9521-5/00` | REPARAÇÃO E MANUTENÇÃO DE EQUIPAMENTOS ELETROELETRÔNICOS DE USO PESSOAL E DOMÉSTICO |
| `9529-1/01` | REPARAÇÃO DE CALÇADOS, DE BOLSAS E ARTIGOS DE VIAGEM |
| `9529-1/02` | CHAVEIROS |
| `9529-1/03` | REPARAÇÃO DE RELÓGIOS |
| `9529-1/04` | REPARAÇÃO DE BICICLETAS, TRICICLOS E OUTROS VEÍCULOS NÃO MOTORIZADOS |
| `9529-1/05` | REPARAÇÃO DE ARTIGOS DO MOBILIÁRIO |
| `9529-1/06` | REPARAÇÃO DE JÓIAS |
| `9529-1/99` | REPARAÇÃO E MANUTENÇÃO DE OUTROS OBJETOS E EQUIPAMENTOS PESSOAIS E DOMÉSTICOS NÃO ESPECIFICADOS ANTERIORMENTE |
