import ServiceAPI from './ServiceAPI.js';
import qs from "qs";

export default class UsuarioServiceAPI extends ServiceAPI {

    async logarUsuario(login, senha) {
        login = login.replace(/\D/g,'');
        return await this.http().post('https://localhost:8080/oauth/token', qs.stringify({
            grant_type: "password",
            username: login,
            password: senha
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(`ed4af4c3-d281-4968-bdac-e334b551d06a:cfb96cc6-8efe-4012-abe3-7eb023add6ba`),
            },
        });
    }

    async buscarUsuarios(empresa_id) {
        return await this.http().get('https://adm.yeuryuwyryru/api/v1/empresa/gestao/'+empresa_id);
    }

    async buscarEmpresas() {
        return await this.http().get('https://adm.yeuryuwyryru/api/v1/empresa');
    }

    async buscarGruposUsuarios() {
        return await this.http().get('https://adm.yeuryuwyryru/api/v1/empresa/funcao/');
    }

    async cadastrarUsuario(data) {
        return await this.http().post('https://adm.yeuryuwyryru/api/v1/empresa/usuario', data);
    }

    async atualizarUsuario(data, usuario_id) {
        return await this.http().patch('https://adm.yeuryuwyryru/api/v1/empresa/usuario/'+usuario_id, data);
    }

    async verificarDocumentoPermiteRateio(documento) {
        return await this.http().get('https://store.yeuryuwyryru/v1/usuarios/'+documento.replace(/\\D/g, "") + '/valido');
    }

    async alterarSenha(senhaAntiga, senhaNova, confirmacaoSenha) {
        return await this.http().put(`https://adm.yeuryuwyryru/api/v1/empresa/usuario/${senhaAntiga}/${senhaNova}/${confirmacaoSenha}/password`);
    }

    async enviarTokenAutenticacao(token) {
        return await this.http().post(`https://adm.yeuryuwyryru/api/v1/empresa/usuario/token`, {}, {
            headers: {
                "Authorization": "Bearer " + token,
            },
        });
    }

    async validarTokenAutenticacao(token, auth) {
        return await this.http().post(`https://adm.yeuryuwyryru/api/v1/empresa/usuario/${token}/valid`, {}, {
            headers: {
                "Authorization": "Bearer " + auth,
            },
        });
    }

    async desativerUsuario(usuario_id) {
        return await this.http().patch(`https://adm.yeuryuwyryru/api/v1/empresa/usuario/${usuario_id}/desativar`);
    }

    async ativerUsuario(usuario_id) {
        return await this.http().patch(`https://adm.yeuryuwyryru/api/v1/empresa/usuario/${usuario_id}/ativar`);
    }

}
