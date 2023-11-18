import {apenasNumeros, validCnpj, validCpf} from "../../pages/Login/validacoes";
import {formataCNPJ, formataCPF} from "./FormatacaoString";

export const copiarVendaParaJSON = function(v) {
    return {
        codigo: v.codigo,
        sellerId: v.sellerId,
        unidade: v.unidade,
        dataVenda: v.dataVenda.replace(/\//g, '-'),
        DOCCliente: v.DOCCliente,
        nomeCliente: v.nomeCliente,
        emailCliente: v.emailCliente,
        numeroContrato: v.numeroContrato,
        endereco: v.endereco,
        numero: v.numero,
        enviada: null,
        complemento: v.complemento,
        bairro: v.bairro,
        cidade: v.cidade,
        estado: v.estado,
        cep: v.cep,
        numeroDeParcelas: v?.parcelas?.length ?? 0,
        valorDaVenda: v.valorDaVenda,
        valor: v.valor,
        dataCriacaoVenda: v.dataCriacaoVenda.replace(/\//g, '-'),
        parcelas: copiarParcelas(v.parcelas, v.unidade),
        status: v.status,
        BomPara: v.BomPara,
        valorBomPara: v.valorBomPara,
    }
}

export const copiarParcelas = function(parcelas, nomeUnidade=null) {
    var p = [];
    try {
        parcelas.forEach((parcela, index) => {
            p.push({
                dadosPgto: parcela.dadosPgto,
                dataLimitePagamento: parcela.dataLimitePagamento,
                dataVencimento: parcela.dataVencimento,
                desconto: parcela.desconto,
                formaPgto: parcela.formaPgto,
                id: parcela.id,
                valor: parcela.valor,
                rateio: copiarRateio(parcela.rateio),
                texto: gerarTextoInfoParcela(index+1, parcelas.length, nomeUnidade),
            });
        })
    }catch(Ex) {}
    return p;
}

export const gerarTextoInfoParcela = function(numeroParcela, numeroParcelas, nomeUnidade) {
    return `Referente a pagamento de parcela ${numeroParcela}/${numeroParcelas} de intermediação de venda do imóvel: ${nomeUnidade}`;
}

export const copiarRateio = function(rateios) {
    var r = [];

    const formatarDocumento = function(doc) {
        if(validCpf(doc)) {
            return formataCPF(doc.replace(/\D/g,''))
        }
        if(validCnpj(doc)) {
            return formataCNPJ(doc.replace(/\D/g,''))
        }
    }

    try {
        rateios.forEach(rateio => {
            r.push({
                id: rateio.id,
                valor: rateio.valor,
                beneficiado: rateio.beneficiado,
                DOC: apenasNumeros(rateio.DOC)
            });
        })
    }catch(Ex) {}
    return r.length > 0 ? r : null;
}
