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
            despesa.id = i //recupero o id para uso na exclusao de registros
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

        return despesasFiltradas

    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function recuperaDadosForm() {
    const ano = document.getElementById('ano')
    const mes = document.getElementById('mes')
    const dia = document.getElementById('dia')
    const tipo = document.getElementById('tipo')
    const descricao = document.getElementById('descricao')
    const valor = document.getElementById('valor')

    const despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    return despesa
}

function cadastrarDespesa() {

    let despesa = recuperaDadosForm() //

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

function carregaListaDespesas(despesas = Array(), filtro = false) {
// se não houver filtros, exibo todos os registros
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    // selecionando o elemento tbody da tabela e limpa
    let listaDespesas = document.getElementById("listaDespesas");
    listaDespesas.innerHTML = '' 
    let valor = 0

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

        //criar o botao de exclusao
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.onclick = function() {
            bd.remover(item.id)
            window.location.reload()
        } 
        
        //criando a linha(tr)
        let linha = listaDespesas.insertRow(0);
        //criando as colunas
        linha.insertCell(0).innerHTML = `${item.dia}/${item.mes}/${item.ano}`
        linha.insertCell(1).innerHTML = item.tipo
        linha.insertCell(2).innerHTML = item.descricao
        linha.insertCell(3).innerHTML = valor
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa() {
    let despesa = recuperaDadosForm()
    let despesas = bd.pesquisar(despesa)
    carregaListaDespesas(despesas, true)
}



