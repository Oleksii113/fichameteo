import { useEffect, useState } from "react";
import cities from "./data/cities.js";
import SearchCity from "./components/SearchCity.jsx";
import CityList from "./components/CityList.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import ForecastList from "./components/ForecastList.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import { fetchCityWeather } from "./services/weatherApi.js";

function normalizeText(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function App() {
    const [selectedCityId, setSelectedCityId] = useState("lisboa");
    const [query, setQuery] = useState("");
    const [weatherByCity, setWeatherByCity] = useState({});
    const [mainLoading, setMainLoading] = useState(false);
    const [mainError, setMainError] = useState("");

    const filteredCities = useMemo(() => {
        const normalized = normalizeText(query);

        if (!normalized) return cities;

        return cities.filter((city) =>
            normalizeText(city.name).includes(normalized),
        );
    }, [query]);

    const selectedCity = cities.find((city) => city.id === selectedCityId);
    const selectedWeather = weatherByCity[selectedCityId] ?? null;

    useEffect(() => {
        let ignore = false;

        async function loadSelectedCityWeather() {
            if (!selectedCity) return;
            setMainLoading(true);
            setMainError("");

            try {
                const weatherData = await fetchCityWeather(selectedCity);
                if (ignore) return;

                setWeatherByCity((prev) => ({
                    ...prev,
                    [selectedCity.id]: weatherData,
                }));
            } catch (fetchError) {
                if (!ignore) {
                    setMainError(
                        fetchError.message ||
                            "Não foi possível carregar os dados desta cidade.",
                    );
                }
            } finally {
                if (!ignore) {
                    setMainLoading(false);
                }
            }
        }

        loadSelectedCityWeather();

        return () => {
            ignore = true;
        };
    }, [selectedCityId]);

    async function handleRetry() {
        if (!selectedCity) return;

        setMainLoading(true);
        setMainError("");

        try {
            const weatherData = await fetchCityWeather(selectedCity);
            setWeatherByCity((prev) => ({
                ...prev,
                [selectedCity.id]: weatherData,
            }));
        } catch (fetchError) {
            setMainError(
                fetchError.message ||
                    "Não foi possível carregar os dados desta cidade.",
            );
        } finally {
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
                    <SearchCity query={query} onChange={setQuery} />

                    {filteredCities.length === 0 ? (
                        <p className="empty-state">
                            Nenhuma cidade encontrada. Ajusta a pesquisa.
                        </p>
                    ) : (
                        <CityList
                            cities={filteredCities}
                            selectedCityId={selectedCityId}
                            onSelectCity={setSelectedCityId}
                        />
                    )}
                </aside>

                <section className="weather-main">
                    {mainLoading && (
                        <LoadingState label="A carregar dados da cidade selecionada..." />
                    )}
                    {!mainLoading && mainError && (
                        <ErrorState message={mainError} onRetry={handleRetry} />
                    )}
                    {!mainLoading && !mainError && selectedWeather && (
                        <>
                            <WeatherCard
                                cityName={selectedWeather.city.name}
                                current={selectedWeather.current}
                            />
                            <ForecastList days={selectedWeather.days} />
                        </>
                    )}
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

export default App;