/**
 * ⚠️ ANDAIME TEMPORARIO, NAO E TIPAGEM DE VERDADE.
 *
 * Este repo nao tem `pg` nem `@types/pg` instalados, e a maquina onde o router
 * foi escrito nao tem PostgreSQL. Este stub existe por um motivo so: permitir
 * rodar `tsc --noEmit` e provar que o codigo do roteador compila, em vez de
 * entregar TypeScript que ninguem verificou.
 *
 * 🔴 APAGAR no primeiro `npm i pg @types/pg`. Manter os dois faz o typecheck
 * passar contra uma assinatura inventada, que e pior que nao ter typecheck.
 *
 * Verificado em 2026-09-20: `tsc -p tsconfig.check.json` sai com EXIT=0 e zero
 * erro nos quatro arquivos do roteador.
 */
declare module 'pg' {
  export interface QueryResult<R = any> { rows: R[] }
  export class PoolClient {
    query<R = any>(text: string, values?: any[]): Promise<QueryResult<R>>
    release(): void
  }
  export class Pool {
    constructor(config?: { connectionString?: string; max?: number })
    query<R = any>(text: string, values?: any[]): Promise<QueryResult<R>>
    connect(): Promise<PoolClient>
  }
}
