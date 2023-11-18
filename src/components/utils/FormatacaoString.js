import {validCnpj, validCpf} from "../../pages/Login/validacoes";

export const primeiraLetraMaiusulo = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formataCPF = function (cpf){
    //retira os caracteres indesejados...
    cpf = cpf?.replace(/[^\d]/g, "");

    //realizar a formatação...
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export const formataCNPJ = function (cpf){
    //retira os caracteres indesejados...
    cpf = cpf?.replace(/[^\d]/g, "");

    //realizar a formatação...
    return cpf?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
}

export const formataDocumento = function (documento) {
    if(validCpf(documento))
        return formataCPF(documento);
    if(validCnpj(documento))
        return formataCNPJ(documento);
    return documento;
}

export const formataCelular = function (value){
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
}
