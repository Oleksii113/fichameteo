import { useMemo, useState } from "react";
import cities from "./data/cities.js";
import SearchCity from "./components/SearchCity.jsx";
import CityList from "./components/CityList.jsx";

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

    const filteredCities = useMemo(() => {
        const normalized = normalizeText(query);

        if (!normalized) return cities;

        return cities.filter((city) =>
            normalizeText(city.name).includes(normalized),
        );
    }, [query]);

    const selectedCity = cities.find((city) => city.id === selectedCityId);

    return (
        <div className="weather-app">
            <header className="weather-hero">
                <h1>Wether Dashboard</h1>
                <p>Consulta rapidamente o estado do tempo por cidade.</p>
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
                    <article className="panel">
                        <h2>Cidade selecionada</h2>
                        <p>{selectedCity?.name ?? "Sem cidade selecionada"}</p>
                        <p>
                            Os dados detalhados serão carregados no proximo
                            passo.
                        </p>
                    </article>
                </section>
            </div>
        </div>
    );
}

export default App;