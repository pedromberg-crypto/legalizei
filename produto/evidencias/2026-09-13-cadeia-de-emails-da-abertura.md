---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-13
assunto: persona-zero
tags: [produto, persona-zero, evidencia, abertura, email, seguranca]
---

# 📨 A cadeia de e-mails da abertura — 10/12 a 15/12/2025

**Fonte:** `pedromberg@gmail.com`, vista de impressão do Gmail (texto completo), 13/09/2026.
**Método:** cada e-mail lido **100%**, do mais antigo para o mais novo, conforme pedido do Pedro.
**Escopo desta nota:** os 8 primeiros da cadeia. Os ~11 restantes (23/12 a 20/01) seguem na fila.

---

## 🔴 DUAS CORREÇÕES DO QUE EU AFIRMEI HOJE DE MANHÃ

### 1. A líder ENTREGOU documentos — só não o contrato social

Eu tinha registrado *"44 e-mails no marcador, **zero anexos**, em 9 meses"* e concluído que a líder nunca entrega documento nenhum. **Errado.** O chamado 26994688 (15/12/2025) traz, literalmente:

```
Anexo(s)
IM...pdf
ALVARÁ DE LOCALIZAÇÃO E FUNCIONAMENTO.pdf
```

**Por que a busca falhou:** os e-mails de chamado vêm do **Zendesk** (`support@contabilizei.zendesk.com`) e não recebem o marcador "Contabilizei", que só pega os remetentes `@contabilizei.com.br`. O `has:attachment` dentro do marcador foi um recorte cego.

✅ **O que continua verdadeiro:** o **contrato social** não foi entregue — nem por e-mail, nem no portal. Confirmado em duas buscas independentes.
🔧 **O que muda:** a tese de produto deixa de ser *"eles não entregam nada"* e passa a ser a real, que é melhor: **eles entregam por e-mail, avulso, sem lugar fixo.** Inscrição Municipal e Alvará chegaram como anexo de um ticket de suporte — o cliente que apagar o e-mail perde o documento. **A nossa proposta não é "entregar", é "ter casa".**

⚠️ **Lição de método:** o recorte da busca virou a conclusão. Buscar dentro de um marcador que eu não montei, e concluir ausência a partir disso, foi o mesmo erro da conta errada de Gmail — duas vezes no mesmo dia.

### 2. Não há segundo certificado — e a copy deles se contradiz em 30 minutos

| E-mail | Hora | O que diz |
|---|---|---|
| Sua empresa está sendo criada | 11/12 **11:49** | *"criação da sua assinatura digital, através da **emissão do certificado digital do seu CPF**"* |
| Criação da sua assinatura digital | 11/12 **12:19** | *"Ter uma conta no portal **GOV.BR** é fundamental… sua conta no GOV.BR deve ter o **nível Ouro**"* |
| Hora de assinar os documentos | 12/12 **08:28** | *"você vai precisar da sua conta no portal GOV.BR, com nível **Prata ou Ouro**"* |

✅ Ratifica o Pedro: é **gov.br**, não certificado. 🐛 E são **três versões da mesma instrução em 21 horas** — uma fala em certificado de CPF, outra exige Ouro, a terceira aceita Prata. O cliente que seguir a primeira compra um certificado que não precisa.

---

## 🔴 O ACHADO GRAVE: pediram para DESABILITAR o 2FA do gov.br

Chamado 26994688, 15/12/2025, seção LICENCIAMENTO, texto literal:

> *"Por exercer atividades consideradas de baixo ou médio risco, precisamos acessar o portal Licenciador com o certificado da sua empresa. […] Porém, para que isso ocorra, **é imprescindível que desabilite a verificação em duas etapas através do gov.br!**"*

E o cliente fez: há um e-mail do próprio governo em **22/12/2025 17:04** — *"gov.br: Verificação em duas etapas desabilitada"*.

🐛 **É pedir ao cliente que baixe a segurança da conta que dá acesso a toda a vida civil dele** (Receita, INSS, CNH, título, FGTS), para que o escritório consiga operar um portal. Não é malícia — é limitação operacional resolvida no lugar errado, empurrando o risco para o cliente.

🔑 **Vira decisão nossa, e é uma que dá para vencer com folga.** O acesso ao Licenciador tem que sair de **procuração ou certificado da empresa**, nunca de rebaixar a conta pessoal do sócio. Se não houver caminho técnico, a resposta honesta é *"esse passo exige você presente"*, não *"desligue sua segurança"*.

⚠️ **Pendência:** confirmar se o 2FA foi reativado depois. Um e-mail de 22/12 16:37 diz *"gov.br: Ação de segurança necessária na sua conta"* e outro de 22/12 17:04 confirma a desativação. **Não achei registro de reativação.**

---

## 📋 Os documentos gerados no nome do CNPJ, e quando

Resposta direta à pergunta do Pedro. Até 15/12/2025 (3 dias após o CNPJ):

| Documento | Quando | Como chegou |
|---|---|---|
| **Cartão CNPJ** | 12/12/2025 | prometido por e-mail ("Enviaremos o cartão CNPJ") |
| **Inscrição Municipal (IM)** | até 15/12/2025 | 📎 **`IM...pdf`** anexo ao chamado 26994688 |
| **Alvará de Localização e Funcionamento** | até 15/12/2025 | 📎 **`ALVARÁ DE LOCALIZAÇÃO E FUNCIONAMENTO.pdf`** anexo ao mesmo chamado |
| **Deferimento do Simples Nacional** | **12/12/2025** | citado no texto, sem documento |
| **Contrato social** | 12/12/2025 (ato 31217298589) | 🔴 **nunca entregue** |
| **e-CNPJ A1** | 22/12/2025 | via AC SAFEWEB, parceira |

🔑 **O Alvará foi emitido mesmo com a atividade DISPENSADA de alvará.** O Cartão CNPJ do Pedro marca `(Dispensada *)` no CNAE, sob a Res. CGSIM 51/2019 — e ainda assim a prefeitura de BH emitiu um Alvará de Localização e Funcionamento. Dispensa de licença **não é** dispensa de inscrição/alvará municipal. ⚠️ Nosso flow trata "alvará dispensado" como fim do assunto. **Não é.**

---

## ⏱️ A cronologia real, hora a hora

| Data / hora | Evento | Fonte |
|---|---|---|
| **10/12 11:05** | Boleto de contratação disponível — linha digitável termina em `...0000013900` = **R$ 139,00** | e-mail `naoresponda@` |
| **10/12 16:24** | Chamado 26968878 aberto por humano (Operação-Cadastro), com manual e lista de documentos | Zendesk |
| **10/12 16:49** | Redefinição de senha da plataforma | `sistema@` |
| **10/12 18:13** | Pesquisa de satisfação do chamado (automática, ecoa o ticket inteiro) | Zendesk |
| **11/12 11:49** | *"Recebemos o cadastro"* + os 7 campos para conferir | `abertura@` |
| **11/12 12:19** | *"seu pedido de abertura foi **aprovado na prefeitura**"* — **30 minutos depois** | `abertura@` |
| **12/12 08:28** | *"Hora de assinar"* — **Passo 3 de 6** | `abertura@` |
| **12/12** | **CNPJ emitido** · **Simples Nacional deferido no mesmo dia** | Cartão CNPJ + chamado 26994688 |
| **15/12 08:10** | IM emitida + Alvará + orientação sobre taxas e licenciamento | Zendesk, chamado 26994688 |
| **22/12 16:33→16:49** | Certificado e-CNPJ emitido (AC SAFEWEB, 16 minutos) | AC SAFEWEB |
| **22/12 17:04** | 🔴 2FA do gov.br desabilitado | `naoresponda-contasg@` |

⚖️ **Ratifica a velocidade que o Pedro afirmou:** *"a consulta de viabilidade… deferimento em apenas 40 segundos… uma pessoa atenta pode constituir a empresa em 24h em BH."* Aqui foram **30 minutos** do cadastro à aprovação na prefeitura, e **~21 horas** do cadastro ao CNPJ.

---

## 🧾 Outros achados operacionais

**Os documentos de assinatura vão por WhatsApp, não pela plataforma.** *"Em breve, nosso time vai entrar em contato com você por WhatsApp para te enviar os documentos e explicar como fazer a assinatura."* 🏢 O momento mais crítico e mais formal da abertura sai do produto e vira conversa.

**A esteira muda de nome entre dois e-mails consecutivos.** Em 11/12 os passos 4-6 são *Emissão do CNPJ · Configuração do certificado e conta bancária · Inscrição Municipal*. Em 12/12 viram *Organização das informações financeiras · Emissão do CNPJ e regularização da prefeitura · Configuração do emissor de notas e enquadramento tributário*. 🐛 Duas esteiras diferentes, mesma jornada, 21 horas de intervalo.

**Os 4 campos que eles dizem precisar definir no cadastro** (chamado 26968878): *"Razão Social, **Capital Social**, Natureza e Enquadramento tributário."* Confirma que capital social **é decisão de cadastro**, não valor fixo de sistema — reforça a decisão pendente do nosso R$10.000.

**Documentos que o cliente precisa ter em mãos:** foto do **IPTU** do endereço · **RG ou CNH** · **Carteira Profissional** se atividade regulamentada · o nome pretendido para razão social e fantasia.

**Taxa municipal de BH:** *"a prefeitura de Belo Horizonte realiza a cobrança da Taxa de Funcionamento (**TFLF/TFS**)… o próprio órgão municipal se encarrega da liberação da guia, que pode ocorrer **em até 90 dias**."* ⚠️ Guia que aparece sozinha, até 3 meses depois, sem o app controlar o prazo.

**Habilitar o emissor de notas leva 5 a 10 dias úteis**, *"a depender de cada município"*.

**O certificado é voucher gratuito nos planos Padrão e Experts** — *"é só responder essa mensagem para receber o voucher"*. 🏢 Não é automático: depende do cliente pedir.

**Cadastro mora em subdomínio separado:** `cadastro.contabilizei.com.br/cadastro/`, fora do `app.contabilizei.com.br`. Terceiro app deles (com `painel-de-controle` e `sistema`).

⚠️ **Divergência de CRC:** o e-mail de senha assina *"Contabilizei Contabilidade Online, Alameda Dr. Carlos de Carvalho, 603, Curitiba — CRC: PR-007940/O-0"*, enquanto o contrato lido em 10/09 traz *"CONTABILIZEI CONTABILIDADE LTDA, CRC/PR 010346/O-2"*, e a procuração dá o endereço Rua Nunes Machado, 68. **Três endereços e dois CRCs** para a mesma marca. Não concluí nada — fica anotado.

## ⏳ O que falta ler (11 e-mails)

23/12 ative o certificado digital · 23/12 Cobre Seu Cliente · 25/12 rotina do CNPJ · 02/01 chamado 27126269 *"Abertura: Emissão Dispensas - finalizado"* · 02/01 feedback · 08/01 fatura · 17/01 e 19/01 DARF Unificado · 19/01 chamado 27282421 *"VOCÊ POSSUI TAXA(S) DO MUNICÍPIO A VENCER"* · 19/01 impostos na plataforma · 20/01 Taxa de Fiscalização de Estabelecimentos.

## Links
[[constituicao]] · [[2026-09-13-email-abertura-11-12-confirmacao-de-dados]] · [[2026-09-13-certificado-16-minutos-e-o-contrato-que-nunca-chegou]] · [[2026-09-13-ecac-procuracao-e-caixa-postal]] · [[HOME]]
