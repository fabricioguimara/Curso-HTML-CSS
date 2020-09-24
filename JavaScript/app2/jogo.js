// seta variaveis globais 
var altura = 0
var largura = 0
var vidas = 1
var tempo = 15
var criaMosquitoTempo = 1500

function ajustaTamanhoPalcoJogo() {
	altura = window.innerHeight
	largura = window.innerWidth
}

ajustaTamanhoPalcoJogo()

// recupera nivel da página index.html
var nivel = window.location.search
nivel = nivel.replace('?','')

if (nivel === 'normal') {
	criaMosquitoTempo = 1500
} else if (nivel === 'dificil') {
	criaMosquitoTempo = 1000
} else if (nivel === 'promaster') {
	criaMosquitoTempo = 750
}

// inicia tempo de criação de mosquitos de acordo com o nivel escolhido
document.getElementById('cronometro').innerHTML = tempo
var criaMosquito = setInterval(posicaoRandomica, criaMosquitoTempo)

// seta o countdown de tempo de acordo com a variavel global 'tempo'
var cronometro = setInterval(function() {
	tempo--
	if (tempo < 0) { // fluxo de vitoria
		mostraResultado("imagens/vitoria.png")
		clearInterval(cronometro)
		clearInterval(criaMosquito)
		return false
	} else {
		document.getElementById('cronometro').innerHTML = tempo
	}
},1000)

function posicaoRandomica() {

	// remover o mosquito anterior (caso ele exista)
	if (document.getElementById('mosquito')) {
		document.getElementById('mosquito').remove()

		if (vidas > 3) { // fluxo de derrota
			mostraResultado("imagens/game_over.png")
			clearInterval(cronometro)
			clearInterval(criaMosquito)
			return false
		} else {
			document.getElementById('v' + vidas).src = "imagens/coracao_vazio.png"
			vidas++
		}


	}

	var posicaoX = Math.floor(Math.random() * largura) - 90
	var posicaoY = Math.floor(Math.random() * altura) - 90

	posicaoX = posicaoX < 0 ? 0 : posicaoX
	posicaoY = posicaoY < 0 ? 0 : posicaoY


	//cria o elemento mosquito no html
	var mosquito = document.createElement('img')

	mosquito.src = 'imagens/mosquito.png'
	mosquito.className = tamanhoAleatorio() + ' ' + ladoAleatorio()
	mosquito.style.left = posicaoX + 'px'
	mosquito.style.top = posicaoY + 'px'
	mosquito.style.position = 'absolute'
	mosquito.id = 'mosquito'
	mosquito.onclick = function () {
		this.remove()
	}

	document.body.appendChild(mosquito)
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

function mostraResultado(result) {
	document.getElementById('myImg').src = result
	document.getElementById("myDiv").className = 'showImage'
}