"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AgendarAssinaturaView } from "@/components/wizard-cauda";
import { compromissoDaQuery, queryDoCompromisso } from "@/lib/compromisso";
import { sociosExtras } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A3.H1 / A3.H4 — MARCAR A ASSINATURA COM O CONSULTOR · rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AgendarAssinaturaView`).
 * Esta page é o wrapper: liga a navegação real.
 *
 * 🆕 04/09 (decisão do Pedro) — A ROTA ASSISTIDA.
 *
 * No lançamento, o app conduz sozinho até a guia da Junta ser paga (A3′). Da
 * assinatura em diante quem assume é gente da casa, por WhatsApp: é a faixa do
 * processo com CAPTCHA, 2FA, nível de conta GOV.BR que a gente não consegue
 * ler, código que expira em 10 minutos e o contador assinando junto na
 * segunda. O racional completo do corte está em `components/consultor.tsx`.
 *
 * ─── POR QUE AGENDAR EM VEZ DE "FALE CONOSCO" ─────────────────────────────
 * A assinatura precisa de SINCRONIA (o código vale 10 minutos, os dois têm que
 * estar juntos). "Manda mensagem e espera" quebra dos dois lados: a pessoa não
 * sabe quando vem, e o consultor liga no vazio. Marcar hora resolve os dois.
 *
 * ─── 🆕 05/09 (pedido do Pedro) — A MESMA TELA MARCA AS DUAS ASSINATURAS ───
 * `?rodada=2` é a que GERA O CNPJ, com o contador assinando junto. Ela exige a
 * mesma sincronia da primeira (mesmo código de 10 minutos, agora com um
 * terceiro no ato), então ganha o mesmo ciclo completo: passagem → marcar →
 * status com hora marcada. Variante, não tela nova — mesmo padrão do `A4″`.
 *
 * ─── 🔄 05/09 (auditoria) — O QUE VIAJA NA URL ────────────────────────────
 * Antes: `?agendado=Hoje às 15:00`, uma FRASE. Agora: as partes do compromisso
 * (`lib/compromisso`), que é o que permite abrir no dia certo, pré-selecionar
 * a hora e devolver o status intacto se a pessoa desistir. O voltar daqui é o
 * STATUS — a mesma tela de onde ela veio, que segue sendo a fonte de verdade
 * da jornada mesmo com o WhatsApp no meio.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AgendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /* Compromisso na URL = a pessoa veio REMARCAR, não marcar a primeira vez. A
     tela inteira muda de tom com isso (título, subtítulo, dia e hora já
     selecionados), e o voltar precisa dele pra devolver o status como estava. */
  const atual = compromissoDaQuery(searchParams);
  const rodada = searchParams.get("rodada") === "2" ? 2 : 1;
  /**
   * 🆕 05/09 (achado do Pedro) — `?socios=2` = a empresa tem sócio (contagem, mesma convenção do C3), e o
   * contrato social é assinado por TODOS eles (art. 997/999 CC). Muda a tela
   * inteira: o horário passa a ser dos dois, entra o bloco "Quem assina" e a
   * tela promete avisar o sócio ao confirmar.
   *
   * 🚧 Mock (RF-01): só o FLAG viaja na URL; o nome vem do mock do outro lado.
   * Nome é dado pessoal, e dado pessoal não anda em querystring — mesma regra
   * que tirou nome/CPF/telefone da URL.
   *
   * 🔒 05/09 — RATIFICADO pelo Ademar, e o sentido MUDA por rodada: na 1ª
   * todos os sócios assinam; na 2ª (Receita) assinam só o contador e o sócio
   * representante. Por isso o nome vale nas duas — na 2ª ele serve pra dizer
   * que o sócio NÃO precisa estar, o que evita a pessoa alinhar dois horários
   * de novo. Quem decide o sentido é a `rodada`, dentro da view.
   */
  const qtdSocios = Number(searchParams.get("socios")) || 1;
  const socios = sociosExtras(qtdSocios).map((x) => x.nome);

  /**
   * O status de onde ela veio, reconstruído.
   *
   * 🐛→🔒 05/09 (auditoria) — ERA AQUI QUE O COMPROMISSO SE PERDIA. O voltar
   * recolocava só a frase (`&agendado=`), então quem desistia de remarcar caía
   * num status que dizia "Você tem hora marcada" no hero, na etapa e no CTA, e
   * mostrava o cartão de APRESENTAÇÃO no lugar do cartão da hora. Agora ele
   * devolve o compromisso inteiro, que é o que a pessoa tinha ao chegar.
   */
  const status = (c = atual) => {
    const q = new URLSearchParams("fase=junta&guia=paga&rota=assistida");
    if (rodada === 2) q.set("assinatura", "1");
    /* 🆕 05/09 — a contagem de sócios volta junto. Sem isso o status caía no
       mock (`TEM_SOCIO`) e acertava por sorte: bastaria o mock virar `false`
       pra ida e volta discordarem sobre quantas pessoas assinam. */
    /* 🐛 05/09 — só devolvia a contagem quando havia sócio; no caso solo o
       status voltava sem ela e caía no mock. Ela volta sempre. */
    q.set("socios", String(qtdSocios));
    if (c)
      for (const [k, v] of new URLSearchParams(queryDoCompromisso(c)))
        q.set(k, v);
    return `/aguardando?${q.toString()}`;
  };

  return (
    <AgendarAssinaturaView
      atual={atual}
      rodada={rodada}
      socios={socios}
      onVoltar={() => router.push(status())}
      /* 🚧 Mock (RF-01): sem estado real entre telas, o compromisso volta pelo
         querystring, em partes. No produto real isso vem do servidor. */
      onConfirmar={(c) => router.push(status(c))}
    />
  );
}
