class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) { // recupero o valor dentro da variavel i
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d)) // converte o objeto para o formato JSON
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {
        let despesas = Array()
        let idAtual = localStorage.getItem('id') //pego o id atual do localStorage

        // recuperar todas as despesas cadastradas em localStorage
        for (let i = 1; i <= idAtual; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            //existe a possibilidade de haver indices que foram pulados/removidos
            //nesses casos nos vamos pular esses indices
            if (despesa === null) {
                continue
            }
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //descricao
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        carregaListaDespesas(despesasFiltradas)

    }
}

let bd = new Bd()

function recuperaDadosForm() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    return despesa
}

function cadastrarDespesa() {

    let despesa = recuperaDadosForm()

    if (despesa.validarDados()) {
        bd.gravar(despesa)
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação. Verifique se todos os campos foram preenchidos corretamente!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
    }
    $('#modalRegistraDespesa').modal('show') //comando de Jquery
}

function carregaListaDespesas(filtro) {
    let despesas = Array()
    // selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById("listaDespesas");
    let valor = 0

// se não houver filtro, exibo todos os registros de despesas 
    if (filtro != null) {
        despesas = filtro
        listaDespesas.innerHTML = '' //limpando todos os elementos
    } else {
        despesas = bd.recuperarTodosRegistros()
    }

    //percorrer o array despesas percorrendo cada item de forma dinamica
    despesas.forEach(function (item) {
        //ajustar o tipo
        switch (item.tipo) {
            case '1': item.tipo = 'Alimentação'
                break;
            case '2': item.tipo = 'Educação'
                break;
            case '3': item.tipo = 'Lazer'
                break;
            case '4': item.tipo = 'Saúde'
                break;
            case '5': item.tipo = 'Transporte'
        }
        
        //ajustar o valor
        valor = parseInt(item.valor) 
        valor = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        
        //criando a linha(tr)
        let linha = listaDespesas.insertRow(0);
        //criando as colunas
        linha.insertCell(0).innerHTML = `${item.dia}/${item.mes}/${item.ano}`
        linha.insertCell(1).innerHTML = item.tipo
        linha.insertCell(2).innerHTML = item.descricao
        linha.insertCell(3).innerHTML = valor
    })
}

function pesquisarDespesa() {
    let despesa = recuperaDadosForm()
    bd.pesquisar(despesa)
}


