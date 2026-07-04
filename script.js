const visorTempo = document.getElementById('visor-tempo');
const btnPlayPause = document.getElementById('btn-play-pause');
const iconePlayPause = document.getElementById('icone-play-pause');
const textoPlayPause = document.getElementById('texto-play-pause');
const listaConquistas = document.getElementById('lista-conquistas');
const msgVazia = document.getElementById('msg-vazia');
const contadorEstrelas = document.getElementById('contador-estrelas');

let tempoDecorrido = 0;
let idIntervalo = null;
let rodando = false;
let estrelasGanhas = 0;

function alternarCronometro(evento) {
    magiaDasFaiscas(evento);
    tocarSomMagico(rodando ? 180 : 330, 'triangle');

    if (rodando) {
        clearInterval(idIntervalo);
        rodando = false;
        iconePlayPause.innerText = "▶️";
        textoPlayPause.innerText = "Iniciar";
        btnPlayPause.className = btnPlayPause.className.replace('from-amber-400 to-orange-500', 'from-pink-400 to-rose-600');
    } else {
        const tempoInicio = Date.now() - tempoDecorrido;
        idIntervalo = setInterval(() => {
            tempoDecorrido = Date.now() - tempoInicio;
            atualizarVisor();
        }, 10);
        rodando = true;
        iconePlayPause.innerText = "⏸️";
        textoPlayPause.innerText = "Pausar";
        btnPlayPause.className = btnPlayPause.className.replace('from-pink-400 to-rose-600', 'from-amber-400 to-orange-500');
    }
}

function atualizarVisor() {
    let milissegundos = Math.floor((tempoDecorrido % 1000) / 10);
    let segundos = Math.floor((tempoDecorrido / 1000) % 60);
    let minutos = Math.floor((tempoDecorrido / (1000 * 60)) % 60);
    visorTempo.innerHTML = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}<span class="text-rose-400 text-2xl sm:text-3xl">.${milissegundos.toString().padStart(2, '0')}</span>`;
}

function reiniciarCronometro(evento) {
    magiaDasFaiscas(evento);
    clearInterval(idIntervalo);
    tempoDecorrido = 0;
    rodando = false;
    visorTempo.innerHTML = `00:00<span class="text-rose-400 text-2xl sm:text-3xl">.00</span>`;
    iconePlayPause.innerText = "▶️";
    textoPlayPause.innerText = "Iniciar";
    btnPlayPause.className = btnPlayPause.className.replace('from-amber-400 to-orange-500', 'from-pink-400 to-rose-600');
}

function registrarEstrela(evento) {
    if (tempoDecorrido === 0) return;
    magiaDasFaiscas(evento, 20);
    if (msgVazia) msgVazia.remove();
    estrelasGanhas++;
    contadorEstrelas.innerText = `${estrelasGanhas} ⭐`;

    const itemConquista = document.createElement('div');
    itemConquista.className = "flex justify-between items-center bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-xl";
    itemConquista.innerHTML = `<span class="text-yellow-300">⭐ Ciclo ${estrelasGanhas}</span> <span class="text-rose-200">${visorTempo.innerText.replace(/<[^>]*>/g, '')}</span>`;
    listaConquistas.prepend(itemConquista);
}

function magiaDasFaiscas(evento, quantidade = 12) {
    if (!evento) return;
    const icones = ['⭐', '💖', '✨', '🌙'];
    for (let i = 0; i < quantidade; i++) {
        const faisca = document.createElement('span');
        faisca.className = 'faisca';
        faisca.innerText = icones[Math.floor(Math.random() * icones.length)];
        faisca.style.left = `${evento.clientX}px`;
        faisca.style.top = `${evento.clientY}px`;
        faisca.style.setProperty('--x', `${(Math.random() - 0.5) * 150}px`);
        faisca.style.setProperty('--y', `${(Math.random() - 0.5) * 150}px`);
        document.body.appendChild(faisca);
        setTimeout(() => faisca.remove(), 800);
    }
}

function tocarSomMagico(freq, tipo = 'sine', vol = 0.15) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const ganho = ctx.createGain();
        osc.type = tipo; osc.frequency.value = freq;
        ganho.gain.setValueAtTime(vol, ctx.currentTime);
        ganho.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6);
        osc.connect(ganho); ganho.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
}