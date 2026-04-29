/**
 * Objetivo deste snippet:
 * 1) Mostrar a versão completa desta fase do projeto.
 * 2) Preservar a ordem recomendada: imports -> helpers -> lógica -> export.
 * 3) Permitir cópia direta sem faltar peças de integração.
 *
 * Como ler este bloco:
 * - Começa nos imports (dependências).
 * - Depois valida funções auxiliares e estado.
 * - Só no fim analisa o render/retorno e o export default.
 */
function SearchCity({ query, onChange }) {
    return (
        <div className="search-city">
            <label className="search-city__label" htmlFor="city-search">
                Pesquisar cidade
            </label>
            <input
                id="city-search"
                className="search-city__input"
                type="text"
                placeholder="Ex.: Lisboa"
                value={query}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}

export default SearchCity;