"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMPO DE MUNICÍPIO — autocomplete com validação REAL (29/07)
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasce da validação tela a tela da `/apresentacao`: a saída "fora de BH"
 * pedia a cidade em campo livre, e campo livre em lista de espera geográfica
 * captura "sp", "minha cidade", "Uberlandiaa" — lixo que não agrega e não dá
 * pra contar depois. O valor dessa fila é o AGREGADO ("40 pessoas em
 * Contagem"), então o dado precisa ser canônico.
 *
 * ─── FONTE ─────────────────────────────────────────────────────────────────
 * IBGE / Localidades (`servicodados.ibge.gov.br/api/v1/localidades/municipios`),
 * a base oficial dos 5.570 municípios — a mesma casa do CONCLA, que já é nossa
 * fonte de CNAE. **Congelada em arquivo local** (`/dados/municipios.json`,
 * ~190KB) de propósito: a demo roda em reunião, e depender de rede pra um
 * autocomplete é convite pra falhar na hora errada. Regerar quando mudar o
 * mapa municipal (é raro; a última alteração relevante foi em 2013).
 *
 * ⚠️ NÃO confundir com as consultas de `pesquisa/integracoes-apis/` — aquilo é
 * consulta de documento (CNPJ/CPF/certidão) e tem regra própria de autoridade.
 * Isto é só uma lista de nomes.
 *
 * ─── A REGRA: SÓ VALE O QUE FOI ESCOLHIDO DA LISTA ────────────────────────
 * Digitar não seleciona. Enquanto a pessoa não toca numa sugestão, o valor
 * volta vazio pro pai — é isso que faz o campo ser validador e não decoração.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** [nome, UF sigla, UF nome] — formato enxuto do arquivo gerado. */
type Municipio = [string, string, string];

/** Tira acento e caixa: quem digita "sao paulo" tem que achar "São Paulo". */
function normalizar(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

let cache: Municipio[] | null = null;

export function CampoMunicipio({
  rotulo,
  placeholder,
  valor,
  onSelecionar,
}: {
  rotulo: string;
  placeholder: string;
  /**
   * Valor canônico vindo de fora (ex: o "Preencher automático" da demo).
   * Quando preenchido, o campo entra no estado ESCOLHIDO — senão o autofill
   * marcaria o formulário como válido com o campo visualmente vazio.
   */
  valor?: string;
  /** Recebe o rótulo canônico ("Uberlândia - Minas Gerais") ou "" se inválido. */
  onSelecionar: (valor: string) => void;
}) {
  const [lista, setLista] = useState<Municipio[]>(cache ?? []);
  const [texto, setTexto] = useState(valor ?? "");
  const [escolhido, setEscolhido] = useState<Municipio | null>(null);
  const [aberto, setAberto] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Sincroniza com o valor externo (padrão "ajustar estado quando a prop
  // muda", feito no render pra não pintar um frame dessincronizado).
  const [valorAnterior, setValorAnterior] = useState(valor);
  if (valor !== valorAnterior) {
    setValorAnterior(valor);
    if (valor) {
      setTexto(valor);
      // Marca como válido: veio de fora já canônico.
      const [nome, uf] = valor.split(" - ");
      setEscolhido([nome, "", uf ?? ""]);
      setAberto(false);
    }
  }

  // Carrega sob demanda e guarda em módulo: a lista é imutável na sessão, não
  // faz sentido baixar de novo a cada montagem do campo.
  useEffect(() => {
    if (cache) return;
    let vivo = true;
    fetch("/dados/municipios.json")
      .then((r) => r.json())
      .then((d: Municipio[]) => {
        cache = d;
        if (vivo) setLista(d);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  // Fecha ao clicar fora — senão a lista fica pairando sobre o resto do form.
  useEffect(() => {
    function fora(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  const busca = normalizar(texto);
  /**
   * Ordena por RELEVÂNCIA, não alfabética: quem começa com o que foi digitado
   * vem primeiro. Sem isso "Uberl" mostraria antes qualquer município que
   * contenha o trecho no meio do nome, e a sugestão óbvia ficaria escondida.
   */
  const sugestoes =
    busca.length < 2
      ? []
      : lista
          .filter((m) => normalizar(m[0]).includes(busca))
          .sort((a, b) => {
            const pa = normalizar(a[0]).startsWith(busca) ? 0 : 1;
            const pb = normalizar(b[0]).startsWith(busca) ? 0 : 1;
            return pa - pb;
          })
          .slice(0, 6);

  function escolher(m: Municipio) {
    setEscolhido(m);
    setTexto(`${m[0]} - ${m[2]}`);
    setAberto(false);
    onSelecionar(`${m[0]} - ${m[2]}`);
  }

  function digitar(v: string) {
    setTexto(v);
    setAberto(true);
    // Editar depois de escolher INVALIDA a escolha: senão dava pra selecionar
    // "Uberlândia" e emendar " do Norte", enviando um município inexistente.
    if (escolhido) {
      setEscolhido(null);
      onSelecionar("");
    }
  }

  const semResultado = busca.length >= 2 && sugestoes.length === 0 && !escolhido;

  return (
    <div ref={boxRef} className="relative">
      <span className="text-caption font-semibold text-text-primary">{rotulo}</span>
      <div className="relative mt-1.5">
        <input
          value={texto}
          onChange={(e) => digitar(e.target.value)}
          onFocus={() => setAberto(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full min-h-12 rounded-md border bg-surface-card px-3 pr-9 text-body
                     text-text-primary placeholder:text-text-muted focus:outline-none
                     ${
                       escolhido
                         ? "border-state-success"
                         : semResultado
                           ? "border-state-danger"
                           : "border-border-hairline focus:border-border-focus"
                     }`}
        />
        {escolhido && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-state-success-text">
            <CheckMini />
          </span>
        )}
      </div>

      {/* Feedback de estado. O erro só aparece depois de 2 letras sem match —
          punir a cada tecla enquanto a pessoa ainda digita seria UX-16 ao
          contrário (microcopy que pune, não ensina). */}
      {semResultado && (
        <p className="mt-1 text-micro text-state-danger-text">
          Não achamos essa cidade. Escolha uma da lista.
        </p>
      )}

      {aberto && sugestoes.length > 0 && !escolhido && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border-hairline bg-surface-card shadow-lg">
          {sugestoes.map((m) => (
            <li key={`${m[0]}-${m[1]}`}>
              <button
                type="button"
                onClick={() => escolher(m)}
                className="flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-alt"
              >
                <span className="text-body text-text-primary">{m[0]}</span>
                <span className="shrink-0 text-caption text-text-tertiary">{m[2]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CheckMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}
