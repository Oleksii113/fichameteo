import { useEffect, useMemo, useState } from "react";
// Lista local de cidades fixas.
import cities from "./data/cities.js";
// Componente de input controlado para pesquisa.
import SearchCity from "./components/SearchCity.jsx";
// Componente para listar/selecionar cidades.
import CityList from "./components/CityList.jsx";
// Componente com estado atual do tempo.
import WeatherCard from "./components/WeatherCard.jsx";
// Componente com previsão dos próximos dias.
import ForecastList from "./components/ForecastList.jsx";
// Componente visual de carregamento.
import LoadingState from "./components/LoadingState.jsx";
// Componente visual de erro com botão retry.
import ErrorState from "./components/ErrorState.jsx";
// Serviço que faz fetch dos dados de uma cidade.
import { fetchCityWeather } from "./services/weatherApi.js";

// Normaliza texto para pesquisa sem acentos/maiúsculas.
function normalizeText(value) {
    return value
        .normalize("NFD") // separa caracteres e acentos
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase() // ignora maiúsculas/minúsculas
        .trim(); // remove espaços extra
}

function App() {
    // Cidade selecionada inicialmente.
    const [selectedCityId, setSelectedCityId] = useState("lisboa");
    // Texto atual da pesquisa.
    const [query, setQuery] = useState("");
    // Cache de dados meteorológicos por id da cidade.
    const [weatherByCity, setWeatherByCity] = useState({});
    // Estado de loading do painel principal.
    const [mainLoading, setMainLoading] = useState(false);
    // Estado de erro do painel principal.
    const [mainError, setMainError] = useState("");

    // Filtra cidades com base na pesquisa normalizada.
    const filteredCities = useMemo(() => {
        const normalized = normalizeText(query);
        if (!normalized) return cities;

        return cities.filter((city) =>
            normalizeText(city.name).includes(normalized),
        );
    }, [query]);

    // Encontra o objeto cidade correspondente ao id selecionado.
    const selectedCity = cities.find((city) => city.id === selectedCityId);
    // Lê dados meteorológicos já carregados dessa cidade.
    const selectedWeather = weatherByCity[selectedCityId] ?? null;

    // Sempre que a cidade selecionada muda, faz fetch dessa cidade.
    useEffect(() => {
        // Flag para impedir setState depois de unmount/troca rápida.
        let ignore = false;

        async function loadSelectedCityWeather() {
            // Segurança: se não houver cidade válida, não faz pedido.
            if (!selectedCity) return;

            // Inicia loading e limpa erro anterior.
            setMainLoading(true);
            setMainError("");

            try {
                // Pede dados à API.
                const weatherData = await fetchCityWeather(selectedCity);
                // Se efeito já foi limpo, ignora resposta tardia.
                if (ignore) return;

                // Guarda dados na cache por city.id.
                setWeatherByCity((prev) => ({
                    ...prev,
                    [selectedCity.id]: weatherData,
                }));
            } catch (fetchError) {
                // Só atualiza erro se o efeito ainda estiver ativo.
                if (!ignore) {
                    setMainError(
                        fetchError.message ||
                            "Não foi possível carregar os dados desta cidade.",
                    );
                }
            } finally {
                // Fecha loading, exceto se já foi limpo.
                if (!ignore) {
                    setMainLoading(false);
                }
            }
        }

        // Dispara o carregamento inicial/reativo.
        loadSelectedCityWeather();

        // Cleanup do efeito: marca chamadas antigas como inválidas.
        return () => {
            ignore = true;
        };
    }, [selectedCityId]);

    // Retry manual quando utilizador clica "Tentar novamente".
    async function handleRetry() {
        // Segurança: sem cidade selecionada não há retry.
        if (!selectedCity) return;

        // Estado inicial do retry.
        setMainLoading(true);
        setMainError("");

        try {
            // Tenta novamente buscar dados da cidade atual.
            const weatherData = await fetchCityWeather(selectedCity);
            // Atualiza cache com resultado recente.
            setWeatherByCity((prev) => ({
                ...prev,
                [selectedCity.id]: weatherData,
            }));
        } catch (fetchError) {
            // Mostra mensagem específica ou fallback pedagógico.
            setMainError(
                fetchError.message ||
                    "Não foi possível carregar os dados desta cidade.",
            );
        } finally {
            // Finaliza loading independentemente de sucesso/erro.
            setMainLoading(false);
        }
    }

    return (
        <div className="weather-app">
            <header className="weather-hero">
                <h1>Weather Dashboard</h1>
                <p>
                    Condições atuais e previsão semanal para cidades de
                    Portugal.
                </p>
            </header>

            <div className="weather-grid">
                <aside className="panel">
                    {/* Input de pesquisa controlado pelo estado query. */}
                    <SearchCity query={query} onChange={setQuery} />

                    {/* Se não houver resultados, mostra estado vazio. */}
                    {filteredCities.length === 0 ? (
                        <p className="empty-state">
                            Nenhuma cidade encontrada. Ajusta a pesquisa.
                        </p>
                    ) : (
                        // Caso contrário, mostra lista filtrada de cidades.
                        <CityList
                            cities={filteredCities}
                            selectedCityId={selectedCityId}
                            onSelectCity={setSelectedCityId}
                        />
                    )}
                </aside>

                <section className="weather-main">
                    {/* Prioridade 1: loading principal. */}
                    {mainLoading && (
                        <LoadingState label="A carregar dados da cidade selecionada..." />
                    )}
                    {/* Prioridade 2: erro principal. */}
                    {!mainLoading && mainError && (
                        <ErrorState message={mainError} onRetry={handleRetry} />
                    )}
                    {/* Prioridade 3: sucesso com dados. */}
                    {!mainLoading && !mainError && selectedWeather && (
                        <>
                            <WeatherCard
                                cityName={selectedWeather.city.name}
                                current={selectedWeather.current}
                            />
                            <ForecastList days={selectedWeather.days} />
                        </>
                    )}
                    {/* Prioridade 4: sem dados disponíveis ainda. */}
                    {!mainLoading && !mainError && !selectedWeather && (
                        <p className="empty-state">
                            Sem dados disponíveis para esta cidade.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}

// Exporta App para ser consumido em main.jsx.
export default App;