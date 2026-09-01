/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Canais de contato — fonte única
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — o link de dúvida do E3.2 ("Tirar dúvida no WhatsApp")
 * deixou de ser mensagem morta e passou a ABRIR o WhatsApp. O número fica
 * aqui, num lugar só, porque ele vai aparecer em mais telas (portal já cita
 * WhatsApp em 4 lugares sem link nenhum).
 *
 * 🔴 NÚMERO PLACEHOLDER — trocar pelo número real da Legalizai quando existir
 * (linha comercial/atendimento, decisão Pedro/Mauro). O formato é o do wa.me:
 * código do país + DDD + número, só dígitos.
 */
export const WHATSAPP_NUMERO = "5531999999999";

/** Monta o deep-link do WhatsApp com a mensagem já preenchida. */
export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}
