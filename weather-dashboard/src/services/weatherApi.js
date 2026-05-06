/**
 * Objetivo deste snippet:
 * 1) Centralizar toda a comunicação com a API Open-Meteo.
 * 2) Isolar transformação de dados para o App ficar mais limpo.
 * 3) Expor funções simples para consumir no componente principal.
 *
 * Leitura linha a linha:
 * - Constantes e builders de URL.
 * - Transformação da resposta da API.
 * - Funções async exportadas para uso no App.
 */

// Endpoint base da Open-Meteo (não inclui query params).
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Constrói a URL completa para coordenadas específicas.
function buildForecastUrl({ latitude, longitude }) {
    // URLSearchParams ajuda a serializar query params com segurança.
    const params = new URLSearchParams({
        // Latitude convertida para string para entrar na query.
        latitude: String(latitude),
        // Longitude convertida para string para entrar na query.
        longitude: String(longitude),
        // Campos atuais que queremos receber da API.
        current:
            "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
        // Campos diários para os 7 dias.
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
        // Número de dias de previsão.
        forecast_days: "7",
        // Fuso horário automático para a localização consultada.
        timezone: "auto",
    });

    // Junta endpoint base + parâmetros serializados.
    return `${BASE_URL}?${params.toString()}`;
}

// Converte o formato "raw" da API para um formato previsível da app.
function mapForecastResponse(rawData) {
    // Estrutura do estado atual, com nomes amigáveis para o frontend.
    const current = {
        temperature: rawData.current.temperature_2m,
        apparentTemperature: rawData.current.apparent_temperature,
        humidity: rawData.current.relative_humidity_2m,
        windSpeed: rawData.current.wind_speed_10m,
        weatherCode: rawData.current.weather_code,
    };

    // Estrutura diária: um objeto por dia (data + métricas).
    const days = rawData.daily.time.map((date, index) => ({
        date,
        min: rawData.daily.temperature_2m_min[index],
        max: rawData.daily.temperature_2m_max[index],
        precipitationProb: rawData.daily.precipitation_probability_max[index],
        windSpeedMax: rawData.daily.wind_speed_10m_max[index],
        weatherCode: rawData.daily.weather_code[index],
    }));

    // A função devolve exatamente o formato esperado pelos componentes.
    return { current, days };
}

// Faz fetch por coordenadas e devolve dados já mapeados.
export async function fetchForecastByCoords({ latitude, longitude }) {
    // Constrói a URL final com os parâmetros necessários.
    const url = buildForecastUrl({ latitude, longitude });
    // Faz o pedido HTTP à Open-Meteo.
    const response = await fetch(url);

    // Se a resposta não for 2xx, lança erro com status para debug.
    if (!response.ok) {
        throw new Error(
            `Falha ao obter dados meteorológicos (${response.status})`,
        );
    }

    // Converte resposta JSON para objeto JavaScript.
    const json = await response.json();
    // Mapeia o formato externo para o formato interno da app.
    return mapForecastResponse(json);
}

// Busca dados meteorológicos para uma cidade da lista local.
export async function fetchCityWeather(city) {
    // Reutiliza a função por coordenadas para evitar duplicação.
    const data = await fetchForecastByCoords({
        latitude: city.latitude,
        longitude: city.longitude,
    });

    // Devolve payload completo com cidade + metadados de fetch.
    return {
        city,
        current: data.current,
        days: data.days,
        fetchedAt: new Date().toISOString(),
    };
}

// Faz fetch em paralelo para um conjunto de cidades.
export async function fetchComparison(cities) {
    // Cada cidade gera uma promise de fetch individual.
    const promises = cities.map((city) => fetchCityWeather(city));
    // Aguarda todas as promises; falha se alguma falhar.
    return Promise.all(promises);
}