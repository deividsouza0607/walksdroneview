// Quantidade de vídeos
const TOTAL_VIDEOS = 3;

// Carrega os votos ao abrir a página
function carregarVotos() {

    let totalGeral = 0;
    let maior = -1;
    let vencedor = 0;

    // Remove destaque anterior
    document.querySelectorAll(".video").forEach(card => {
        card.classList.remove("vencedor");
    });

    for (let i = 1; i <= TOTAL_VIDEOS; i++) {

        const votos = Number(localStorage.getItem("video" + i) || 0);

        const span = document.getElementById("votos" + i);

        if (span) {
            span.textContent = votos;
        }

        totalGeral += votos;

        if (votos > maior) {
            maior = votos;
            vencedor = i;
        }

    }

    // Atualiza total geral
    const total = document.getElementById("totalGeral");

    if (total) {
        total.textContent = totalGeral;
    }

    // Destaca o vídeo mais votado
    const cards = document.querySelectorAll(".video");

    if (cards[vencedor - 1]) {
        cards[vencedor - 1].classList.add("vencedor");
    }

    // Se já votou, desabilita os botões
    if (localStorage.getItem("jaVotou")) {

        document.querySelectorAll(".video button").forEach(btn => {

            btn.disabled = true;
            btn.innerHTML = "✔ Obrigado pelo voto";

        });

    }

}

// Registrar voto
function votar(id) {

    if (localStorage.getItem("jaVotou")) {

        alert("Você já votou nesta votação.");

        return;

    }

    let votos = Number(localStorage.getItem("video" + id) || 0);

    votos++;

    localStorage.setItem("video" + id, votos);

    localStorage.setItem("jaVotou", "sim");

    carregarVotos();

}

// Executa ao abrir a página
carregarVotos();