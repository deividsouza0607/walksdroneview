const cidades = [
    { nome: "Urubici", lat: -28.015, lon: -49.592 },
    { nome: "São Joaquim", lat: -28.293, lon: -49.932 },
    { nome: "Bom Jardim", lat: -28.337, lon: -49.637 },
    
    { nome: "Abdon Batista", lat: -27.612, lon: -51.024 },
    { nome: "Cerrito", lat: -27.661, lon: -50.573 }
];

const container = document.getElementById("container");
const atualizacao = document.getElementById("atualizacao");

// Ícone conforme temperatura
function getIcon(temp) {
    if (temp <= 5) return "❄️";
    if (temp <= 15) return "🌥️";
    if (temp <= 25) return "☀️";
    return "🔥";
}

// Sensação térmica simulada
function sensacao(temp) {
    return Math.round(temp - 1 + Math.random() * 2);
}

async function carregarClima() {

    if (!container) {
        console.error("Elemento #container não encontrado.");
        return;
    }

    container.innerHTML = "<p>Carregando clima...</p>";

    try {

        const resultados = await Promise.all(

            cidades.map(async (cidade) => {

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${cidade.lat}&longitude=${cidade.lon}&current=temperature_2m`;

                const resposta = await fetch(url);

                if (!resposta.ok) {
                    throw new Error(`Erro ao consultar ${cidade.nome}`);
                }

                const data = await resposta.json();

                return {
                    nome: cidade.nome,
                    temp: data.current.temperature_2m
                };
            })

        );

        container.innerHTML = "";

        const menor = Math.min(...resultados.map(c => c.temp));
        const maior = Math.max(...resultados.map(c => c.temp));

        resultados.forEach(cidade => {

            const card = document.createElement("div");

            let classe = "card";

            if (cidade.temp === menor) classe += " cold";
            if (cidade.temp === maior) classe += " hot";

            card.className = classe;

            card.innerHTML = `
                <div class="city">${cidade.nome}</div>
                <div class="icon">${getIcon(cidade.temp)}</div>
                <div class="temp">${Math.round(cidade.temp)}°C</div>
                <div class="feels-like">
                    Sensação: ${sensacao(cidade.temp)}°C
                </div>
            `;

            container.appendChild(card);

        });

        if (atualizacao) {
            atualizacao.textContent =
                "Atualizado: " +
                new Date().toLocaleTimeString("pt-BR");
        }

    } catch (erro) {

        console.error(erro);

        container.innerHTML = `
            <div class="erro-clima">
                ❌ Não foi possível carregar os dados do clima.
            </div>
        `;

        if (atualizacao) {
            atualizacao.textContent = "Falha na atualização.";
        }
    }
}

// Inicializa quando a página carregar
document.addEventListener("DOMContentLoaded", () => {

    carregarClima();

    // Atualiza automaticamente a cada 10 minutos
    setInterval(carregarClima, 400000);

});