// seta variaveis globais 
var altura = 0
var largura = 0
var mortes = 1
var tempo = 15
var criaMosquito = 0
var cronometro = 0
var criaMosquitoTempo = 1500
    // recupera nivel da página index.html
var urlParams = new URLSearchParams(window.location.search)
var nivel = urlParams.get('nivel')

iniciarJogo()

function iniciarJogo() {
    ajustaTamanhoPalcoJogo()
    setaNivel()
    inciaTempoMosquito()
    fluxoVitoria()
}

function ajustaTamanhoPalcoJogo() {
    altura = window.innerHeight
    largura = window.innerWidth
}


function setaNivel() {
    if (nivel === 'normal') {
        criaMosquitoTempo = 1500
    } else if (nivel === 'dificil') {
        criaMosquitoTempo = 1000
    } else if (nivel === 'promaster') {
        criaMosquitoTempo = 750
    }
}

function inciaTempoMosquito() {
    // inicia tempo de criação de mosquitos de acordo com o nivel escolhido
    document.getElementById('cronometro').innerHTML = tempo
    criaMosquito = setInterval(verificaVidas, criaMosquitoTempo)
}

function fluxoVitoria() {
    // seta o countdown de tempo de acordo com a variavel global 'tempo'
    cronometro = setInterval(function() {
        tempo--
        if (tempo < 0) { // fluxo de vitoria
            mostraResultado(true)
            clearInterval(cronometro)
            clearInterval(criaMosquito)
            return false
        } else {
            document.getElementById('cronometro').innerHTML = tempo
        }
    }, 1000)
}

function removeMosquito() {
    document.getElementById('mosquito').remove()
}

function verificaVidas() {
    if (document.getElementById('mosquito')) {
        removeMosquito()

        if (mortes > 3) { // fluxo de derrota
            fluxoDerrota()
            return
        } else {
            perdeVida()
        }
    }

    var posicao = calculaPosicao()
    criarMosquito(posicao)
}

function perdeVida() {
    document.getElementById('v' + mortes).src = "imagens/coracao_vazio.png"
    mortes++
}

function fluxoDerrota() {
    mostraResultado(false)
    clearInterval(cronometro)
    clearInterval(criaMosquito)
}

function criarMosquito(posicao) {
    //cria o elemento mosquito no html

    var mosquito = document.createElement('img')

    mosquito.src = 'imagens/mosquito.png'
    mosquito.className = tamanhoAleatorio() + ' ' + ladoAleatorio()
    mosquito.style.left = posicao.X + 'px'
    mosquito.style.top = posicao.Y + 'px'
    mosquito.style.position = 'absolute'
    mosquito.id = 'mosquito'
    mosquito.onclick = function() {
        this.remove()
    }

    document.body.appendChild(mosquito)
}

function calculaPosicao() {
    var posicaoX = Math.floor(Math.random() * largura) - 90
    var posicaoY = Math.floor(Math.random() * altura) - 90

    posicaoX = posicaoX < 0 ? 0 : posicaoX
    posicaoY = posicaoY < 0 ? 0 : posicaoY

    return { X: posicaoX, Y: posicaoY }
}

function tamanhoAleatorio() {
    // gera numero aleatorio entre 1 e 3
    var classe = 'mosquito' + (Math.floor(Math.random() * 3) + 1)
    return classe
}

function ladoAleatorio() {
    // gera numero aleatorio entre 1 e 2
    var lado = 'lado' + (Math.floor(Math.random() * 2) + 1)
    return lado
}

function mostraResultado(ganhou) {
    var imagemResultado = "imagens/game_over.png"
    if (ganhou) imagemResultado = "imagens/vitoria.png"

    document.getElementById('myImg').src = imagemResultado
    document.getElementById("myDiv").className = 'showImage'
}