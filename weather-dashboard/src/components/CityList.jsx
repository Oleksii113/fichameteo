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
function CityList({ cities, selectedCityId, onSelectCity }) {
    return (
        <ul className="city-list">
            {cities.map((city) => (
                <li key={city.id}>
                    <button
                        type="button"
                        className={`city-list__button ${
                            city.id === selectedCityId ? "active" : ""
                        }`}
                        onClick={() => onSelectCity(city.id)}
                    >
                        {city.name}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default CityList;