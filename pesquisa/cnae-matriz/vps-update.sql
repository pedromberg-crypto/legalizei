-- 1. Cria a tabela de sinônimos
CREATE TABLE IF NOT EXISTS fatos.cnae_sinonimos (
    termo TEXT PRIMARY KEY,
    cnae_codigo TEXT NOT NULL
);

-- (O ideal é importar o JSON aqui, mas como é pequeno, podemos inserir os valores direto para facilitar o seed)
INSERT INTO fatos.cnae_sinonimos (termo, cnae_codigo) VALUES
('psicologo', '8650003'),
('psicóloga', '8650003'),
('psicologia', '8650003'),
('personal trainer', '9313100'),
('personal', '9313100')
ON CONFLICT (termo) DO UPDATE SET cnae_codigo = EXCLUDED.cnae_codigo;

-- 2. Atualiza a função de busca
CREATE OR REPLACE FUNCTION fatos.consultar_cnae(p_busca TEXT)
RETURNS TABLE (
    codigo TEXT,
    titulo_amigavel TEXT,
    titulo_oficial TEXT,
    termos_de_busca TEXT,
    anexo TEXT,
    fator_r TEXT,
    atende_me TEXT,
    motivo_nao_atende TEXT,
    score NUMERIC
) AS $$
DECLARE
    v_busca_limpa TEXT;
    v_alias_codigo TEXT;
BEGIN
    -- Limpa a busca (minúscula, sem acentos)
    v_busca_limpa := lower(unaccent(p_busca));

    -- 1. Tenta achar o alias exato
    SELECT cnae_codigo INTO v_alias_codigo 
    FROM fatos.cnae_sinonimos 
    WHERE v_busca_limpa ~ ('\b' || termo || '\b')
    LIMIT 1;

    IF v_alias_codigo IS NOT NULL THEN
        RETURN QUERY
        SELECT 
            c.codigo, c.titulo_amigavel, c.titulo_oficial, c.termos_de_busca, 
            c.anexo, c.fator_r, c.atende_me, c.motivo_nao_atende,
            1.00::NUMERIC AS score
        FROM fatos.cnae c
        WHERE c.codigo = v_alias_codigo;
        RETURN;
    END IF;

    -- 2. Se não achou alias, usa a busca híbrida (pg_trgm no título + to_tsvector nas atividades)
    RETURN QUERY
    SELECT 
        c.codigo, c.titulo_amigavel, c.titulo_oficial, c.termos_de_busca, 
        c.anexo, c.fator_r, c.atende_me, c.motivo_nao_atende,
        greatest(
            similarity(c.titulo_amigavel, p_busca),
            (ts_rank(to_tsvector('portuguese', coalesce(c.termos_de_busca, '')), plainto_tsquery('portuguese', p_busca)) * 0.3)::REAL
        )::NUMERIC AS score
    FROM fatos.cnae c
    WHERE p_busca <% coalesce(c.titulo_amigavel, c.titulo_oficial)
       OR to_tsvector('portuguese', coalesce(c.termos_de_busca, '')) @@ plainto_tsquery('portuguese', p_busca)
    ORDER BY score DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;
