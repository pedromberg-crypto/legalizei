---
tipo: historico
status: vivo
data: 2026-09-01
fonte: "Rua Satélite 42 (transcrição + summary) — Downloads/Rua Satélite 42-transcript.txt e -Summary.md. Simulação de DBE + Integrador com 2 sócios, ao vivo."
deriva_de: [2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo.md, ../execucao/dados-coletados-abertura-ate-viabilidade.md]
tags: [reuniao, produto, societario, dbe, contrato-padrao, decisao, pendente-validacao]
---

# 🤝 Rua Satélite 42 — quem administra a empresa (01/09/2026)

> Simulação prática: constituição de uma ME com **2 sócios**, rodada de verdade no DBE e no Integrador, com o contrato padrão gerado e lido na tela. A pergunta de fundo era societária ("assinatura isolada × conjunta"), e a resposta virou **um campo só no C3**.
>
> A cadeia inteira do raciocínio está aqui porque o campo, sozinho, não se explica: quem olhar só a tela vai achar que é uma pergunta a mais, e a decisão foi justamente **não** empilhar perguntas.

## 🎯 A decisão, em uma linha

No C3, depois dos dados do sócio, **uma pergunta**: *"Quem vai administrar a empresa?"* — **só o titular** × **titular + o(s) sócio(s) marcado(s)**. Nada além disso.

## 🧠 Por que exatamente essa pergunta, e não outra

### 1. Quem inicia o cadastro já é o administrador. Isso não se pergunta.
Quem preenche o app é o **representante perante a Receita Federal** no DBE, e o sistema puxa a qualificação dele automaticamente a partir daí. Não existe "indicar outra pessoa": se quem vai administrar é o sócio, é o sócio que abre o app e conduz a abertura. Permitir indicar terceiro criaria um processo cujo dono não é o dono da conta.

### 2. A resposta muda UMA coisa no processo: a qualificação de cada sócio.
- Sócio marcado como administrador → entra no DBE como **49 - Sócio-Administrador** e sai na cláusula de administração do contrato.
- Sócio não marcado → entra como **22 - Sócio**, aparece no quadro societário, participa dos resultados, e não assina pela empresa.

Os dois caminhos **passam liso** (registro automático). Foi testado na simulação, não deduzido.

### 3. 🔴 "Assinatura isolada × conjunta" NÃO vira pergunta. E isso é decisão.
O contrato **padrão** da Junta não tem campo pra forma de assinatura. Pra informar isso seria preciso inserir cláusula própria — e **qualquer inserção tira o processo do padrão e manda pra análise humana**. É a mesma família do achado de 31/08 (anexo/procuração derruba a elegibilidade ao Registro Automático): o que a gente ganha em precisão jurídica, perde em dias de espera, pra todo mundo.

### 4. O que o contrato padrão de fato diz (cláusula 8ª, lida no documento real)
A administração cabe a ambos os administradores, **cada um** com representação ativa e passiva da sociedade, judicial e extrajudicial, podendo praticar **todos os atos compreendidos no objeto social** e usar o nome empresarial. A assinatura conjunta (ou autorização do outro sócio) é exigida só em atos **extraordinários**: onerar ou alienar bens imóveis da sociedade, e assumir obrigações em favor de cotistas ou terceiros. Vedado o uso do nome empresarial em atividades estranhas ao interesse social.

Ou seja: **2 administradores não significa "tudo com as duas assinaturas"** — o medo mais citado (o banco) não está no texto do contrato; é política de cada instituição.

🟡 **Confiança:** a leitura foi feita sobre o contrato real gerado na simulação, com apoio de IA pra interpretar a cláusula. **Falta ratificar com a contadora** e testar na prática em banco. Não tratar como fato fechado até isso voltar.

### 5. A régua do MVP: 2 cenários lisos cobrem ~95%
Quem quiser 2 administradores **com assinatura isolada declarada** cai fora do padrão (alteração contratual, análise humana). Esse caso **não trava a esteira**: o app segue até a cobrança e o atendimento humano resolve depois. A decisão explícita foi *não* parar o robô por causa da exceção.

### 6. UX: a consequência aparece na hora da escolha, não antes
O risco levantado foi transformar o final do dossiê em aula de direito societário e perder a pessoa. Por isso: pergunta binária, micro-explicação **só da opção escolhida**, na língua da vida real (banco, DETRAN, cartório) — nunca as duas explicações ao mesmo tempo.

## 🐛 Achado operacional novo (fora do tema)

**CPF com MEI ativo impede a emissão do DBE.** A 1ª transmissão da simulação foi rejeitada por isso; o teste só andou trocando o CPF. Hoje o cliente descobriria isso **depois de pagar**, no meio do processo. É a mesma checagem de regularidade que o E9 já promete na copy: dá pra pegar antes do dinheiro. Registrado em `PREENCHIDOS_API` como 🔴 não implementado.

## 🔁 Confirmações (já sabíamos, agora com testemunha ocular)

- Dados vindos da viabilidade chegam **importados** no DBE (nome empresarial, natureza jurídica, nome fantasia, CNAEs, objeto social, endereço da PJ, porte ME, dados do contador) — o RPA pula essas telas de conferência.
- A soma das participações precisa bater **exatamente** com o capital social (R$10.000 → 5.000 + 5.000 na simulação).
- Código de serviço do contrato no Integrador: **20-62** (mesmo 2062 da natureza jurídica).
- O RPA consegue detectar pendência do portal (CEP ou e-mail faltando) por mapeamento de tela ou leitura do código-fonte.

## ✅ O que foi construído a partir daqui (mesmo dia)

- `SociosView` (C3) ganhou o bloco "Quem vai administrar a empresa?", **só no caminho abrir** (na migração a empresa já existe e a administração já está no contrato dela).
- Titular aparece travado como administrador; com 1 sócio extra a pergunta é binária; com 2+ extras abre seleção de quais administram.
- CTA travado enquanto a pergunta não for respondida: sem ela o RPA não sabe qual qualificação mandar.
- `flow-data.mjs`: campo novo no C3 + 4 regras internas (qualificação 49×22, forma de assinatura não enviada, representante = quem inicia, telas de conferência puladas) + 1 de API (CPF com MEI ativo).

## 🔜 Pendências que ficaram

| # | O que | Dono |
|---|---|---|
| 🟡 1 | Ratificar com a contadora se declarar assinatura isolada realmente tira o contrato do padrão | contábil |
| 🟡 2 | Validar o contrato padrão com banco (abertura de conta com 2 administradores) | operacional |
| 🔴 3 | Checagem de MEI ativo no CPF antes do pagamento | dev |

## Links
- [[2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo]] — a gravação que originou a série
- [[dados-coletados-abertura-ate-viabilidade]] — doc gerado com as regras internas
- [[handoff-dev-2026-09-01-constituicao-me]] — contrato de dados pro dev
- [[decisoes-marca]] — ADR, linhas de 01/09
