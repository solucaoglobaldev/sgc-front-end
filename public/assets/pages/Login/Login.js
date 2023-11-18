import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import InputMask from "react-input-mask";
import UsuarioServiceAPI from "../../service/UsuarioServiceAPI";
import { formatCNPJ, validCnpj, validCpf } from "./validacoes";
import { Toast } from "primereact/toast";
import jwt_decode from "jwt-decode";
import ButtonReenviarToken from "./ButtonReenviarToken";

const Login = (props) => {
    const [carregandoResquest, setCarregandoRequest] = useState(false);
    const [errorLogin, setErrorLogin] = useState("");
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [ctrl, setCtrl] = useState(1);
    const [lastCharIs, setLastCharIs] = useState("");
    const [inserindoToken, setInserindoToken] = useState(false);
    const [carregandoToken, setCarregandoToken] = useState(false);
    const [tokenAutenticacao, setTokenAutenticacao] = useState("");

    const [storage_token, setStorage_token] = useState();
    const [storage_permissoes, setStorage_permissoes] = useState();
    const [storage_usuario, setStorage_usuario] = useState();

    var buff;
    const toast = useRef();

    const saveBuff = function (event) {
        buff = event.key;
    };

    function handleMaskChange(event) {
        setErrorLogin("");
        const valor = event.target.value.replace(/\D/g, "");
        if (lastCharIs && valor.length == 11) {
            setCtrl(2);
            setLogin(valor + buff);
            setTimeout(() => {
                document.querySelector("#inputCNPJRef").value = formatCNPJ(
                    valor + buff
                );
            }, 50);
        } else {
            setLogin(valor);
            setLastCharIs(valor.length > 10);
        }

        if (valor.length == 11 && ctrl == 2) setCtrl(1);
    }

    const handleOnSubmit = async function (e) {
        e.preventDefault();

        if (!validCpf(login) && !validCnpj(login)) {
            setErrorLogin("p-invalid");
            return;
        }

        const usuarioServiceAPI = new UsuarioServiceAPI();

        try {
            setCarregandoRequest(true);
            const res = await usuarioServiceAPI.logarUsuario(login, senha);
            const data = jwt_decode(res.data.access_token);

            if (!data?.login_dois_fatores) {
                setStorage_token(res.data.access_token);
                setStorage_permissoes(data.authorities);
                setStorage_usuario({
                    nome_completo: data.nome_completo,
                    usuario_id: data.usuario_id,
                    empresa_id: res.data.empresa_id,
                    seller_id: data.user_name,
                    empresa: res.data.empresa,
                });
                try {
                    const res_ = await usuarioServiceAPI.enviarTokenAutenticacao(res.data.access_token);
                    setCarregandoRequest(false);
                } catch(ex) {
                    toast.current.show({ severity: "error", summary: "Erro", detail: "Houve um erro inesperado, tente novamente", life: 3000});
                    setCarregandoRequest(false);
                    return;
                }

                toast.current.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Um token de verificação foi enviado para o celular cadastrado",
                    life: 3000,
                });
                setInserindoToken(true);
            } else {
                toast.current.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Login realizado com sucesso, você será redirecionado em breve",
                    life: 3000,
                });
                localStorage.setItem("@token", res.data.access_token);
                localStorage.setItem(
                    "@authorities",
                    JSON.stringify(data.authorities)
                );
                localStorage.setItem(
                    "@usuario",
                    JSON.stringify({
                        nome_completo: data.nome_completo,
                        usuario_id: data.usuario_id,
                        empresa_id: res.data.empresa_id,
                        empresa: res.data.empresa,
                        seller_id: data.user_name,
                    })
                );
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (ex) {
            switch (ex?.response?.status) {
                case 400:
                case 401:
                    toast.current.show({
                        severity: "error",
                        summary: "Tente novamente",
                        detail: "Credenciais inválidas, tente novamente",
                        life: 3000,
                    });
                    break;
                default:
                    toast.current.show({
                        severity: "error",
                        summary: "Tente novamente",
                        detail: "Houve um erro inesperado, tente novamente",
                        life: 3000,
                    });
                    break;
            }
            setCarregandoRequest(false);
            localStorage.clear();
        }
    };

    const handleValidarToken = async function(e) {
        e.preventDefault();
        setCarregandoRequest(true);
        try {
            const usuarioServiceAPI = new UsuarioServiceAPI();
            const result = await usuarioServiceAPI.validarTokenAutenticacao(tokenAutenticacao, storage_token);
            toast.current.show({ severity: "success", summary: "Sucesso", detail: "Token validado com sucesso, você será redirecionado em breve", life: 3000});
            localStorage.setItem("@token", storage_token);
            localStorage.setItem( "@authorities", JSON.stringify(storage_permissoes) );
            localStorage.setItem( "@usuario", JSON.stringify(storage_usuario) );
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (ex) {
            if(ex?.response?.status == 400) {
                setTokenAutenticacao('');
                toast.current.show({ severity: "error", summary: "Erro", detail: "Token de verificação inválido", life: 3000});
            } else
                toast.current.show({ severity: "error", summary: "Erro", detail: "Houve um erro inesperado, tente novamente", life: 3000});
            setCarregandoRequest(false);
        }
    }

    const reenviarToken = async function() {
        const usuarioServiceAPI = new UsuarioServiceAPI();
        setCarregandoToken(true);
        try {
            const res_ = await usuarioServiceAPI.enviarTokenAutenticacao(storage_token);
            setCarregandoToken(false);
        } catch(ex) {
            toast.current.show({ severity: "error", summary: "Erro", detail: "Houve um erro inesperado, tente novamente", life: 3000});
            setCarregandoToken(false);
            return;
        }
        toast.current.show({
            severity: "success",
            summary: "Sucesso",
            detail: "Um token de verificação foi enviado para o celular cadastrado",
            life: 3000,
        });
    }

    return (
        <div className="login-body" style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="hidden lg:inline">
                <img
                    src={`assets/layout/images/pages/login-${
                        props.colorScheme === "light" ? "ondark" : "onlight"
                    }.png`}
                    alt="atlantis"
                />
            </div>
            <div className="login-panel p-fluid">
                <div className="flex flex-column">
                    {inserindoToken ? (
                        <form onSubmit={handleValidarToken}>
                            <Toast ref={toast} />
                            <div className="flex align-items-center mb-6 logo-container just">
                                <img
                                    src={`assets/images/logo.png`}
                                    className="login-logo"
                                    alt="login-logo"
                                />
                                <img
                                    src={`assets/images/logo-maxtool.svg`}
                                    className="login-appname"
                                    alt="login-appname"
                                />
                            </div>
                            <div className="form-container">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-key"></i>
                                    <InputText
                                        value={tokenAutenticacao}
                                        onChange={(e) =>
                                            setTokenAutenticacao(e.target.value)
                                        }
                                        required
                                        type="text"
                                        className="mb-1"
                                        placeholder="Token de autenticação"
                                    />
                                </span>
                                <div className="text-left mb-3">
                                    <small className="text-left">Insira o token enviado por SMS</small>
                                </div>
                            </div>
                            <div className="button-container">
                                <Button
                                    loading={carregandoResquest}
                                    type="submit"
                                    className="mb-2"
                                    label="Entrar"
                                ></Button>
                                <ButtonReenviarToken reenviarToken={reenviarToken} carregandoResquest={carregandoResquest} />
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleOnSubmit}>
                            <Toast ref={toast} />
                            <div className="flex align-items-center mb-6 logo-container just">
                                <img
                                    src={`assets/images/logo.png`}
                                    className="login-logo"
                                    alt="login-logo"
                                />
                                <img
                                    src={`assets/images/logo-maxtool.svg`}
                                    className="login-appname"
                                    alt="login-appname"
                                />
                            </div>
                            <div className="form-container">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-user"></i>
                                    {ctrl == 1 ? (
                                        <InputMask
                                            mask="999.999.999-99"
                                            onChange={handleMaskChange}
                                            value={login}
                                            maskChar=""
                                            noSpaceBetweenChars={true}
                                        >
                                            {(inputProps) => (
                                                <InputText
                                                    className={
                                                        errorLogin
                                                            ? errorLogin +
                                                            " mb-0"
                                                            : ""
                                                    }
                                                    onKeyDown={saveBuff}
                                                    type="text"
                                                    placeholder="CPF ou CNPJ"
                                                />
                                            )}
                                        </InputMask>
                                    ) : (
                                        <InputMask
                                            mask="99.999.999/9999-99"
                                            onChange={handleMaskChange}
                                            value={login}
                                            maskChar=""
                                            noSpaceBetweenChars={true}
                                        >
                                            {(inputProps) => (
                                                <InputText
                                                    id="inputCNPJRef"
                                                    onKeyDown={saveBuff}
                                                    type="text"
                                                    placeholder="CPF ou CNPJ"
                                                />
                                            )}
                                        </InputMask>
                                    )}
                                </span>
                                {errorLogin && (
                                    <div
                                        className="p-error mb-2"
                                        style={{ textAlign: "left" }}
                                    >
                                        <small>CPF ou CNPJ Inválido</small>
                                    </div>
                                )}
                                <span className="p-input-icon-left">
                                    <i className="pi pi-key"></i>
                                    <InputText
                                        value={senha}
                                        onChange={(e) =>
                                            setSenha(e.target.value)
                                        }
                                        required
                                        type="password"
                                        placeholder="Senha de acesso"
                                    />
                                </span>
                            </div>
                            <div className="button-container">
                                <Button
                                    loading={carregandoResquest}
                                    type="submit"
                                    label="Login"
                                ></Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
