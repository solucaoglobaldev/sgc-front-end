import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { mensagemAlerta, mensagemSucesso, mensagemError } from "./Mensagem";
import axios from "axios";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {Dialog} from 'primereact/dialog';

const Cliente = () => {
  const inputClienteRef = useRef(null);
  const [cpfNovo, setCpfNovo] = useState("");
  const [nomeCliente, setNomecliente] = useState("");
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [emailCliente, setEmailCliente] = useState("");
  const [foneCelular, setFoneCelular] = useState("");
  const [foneComercial, setFoneComercial] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [uf, setUf] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numero, setNumero] = useState("");
  const [deleteClienteoDialog, setClienteDialog] = useState(false); 
  const [clienteDialogEdit, setClienteDialogEdit] = useState(false)
 
 

  useEffect(() =>{
    preencherDaddosTabelaCliente();
},[]);

const buscarCep = async () => {
  const cepFormatado = cep.replace(/[^0-9]/g, "");
  if (cepFormatado.length !== 8 || cepFormatado === "") {
    mensagemAlerta("CEP inválido");
    setCep("");
    
  } else {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepFormatado}/json/`
      );
      setLogradouro(response.data.logradouro);
      setBairro(response.data.bairro);
      setLocalidade(response.data.localidade);
      setUf(response.data.uf);
    } catch (error) {     
      mensagemError("Erro ao buscar o CEP informado: " + error.mensagemError);
    }
  }
};

const inativar = () => {    

  if(cliente){
  axios.get(`http://localhost:8080/api/clientes/inativar/${cliente.cpfCliente}`)
  .then(response =>{
      mensagemSucesso('Cliente inativado com sucesso');
      hideDeleteClienteDialog();
      preencherDaddosTabelaCliente();
  }).catch(erro =>{
      mensagemError('Erro ao Intivar');
  })
}
}

const fecharEditDialot = () =>{
  setClienteDialogEdit(false);
}

const clienteDialogFooter =(
  <div>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={fecharEditDialot}/>
      <Button label="Salvar"   icon="pi pi-check" className="p-button-text" />  
     
  
  </div>
);



const ativar = () => {   

  if(cliente){
  axios.get(`http://localhost:8080/api/clientes/ativar/${cliente.cpfCliente}`)
  .then(response =>{
      mensagemSucesso('Cliente ativo com sucesso');
      hideDeleteClienteDialog();
      preencherDaddosTabelaCliente();
  }).catch(erro =>{
      mensagemError('Erro ao ativar');
  })
}
}



  const preencherDaddosTabelaCliente = () => {
    axios.get('http://localhost:8080/api/clientes/listar')
      .then(response => {      
       setClientes(response.data );
      })
      .catch(error => {
        mensagemError("Erro ao carregar");
      });
}

  const gravar = async () => {
    const cpfFormatado = cpfNovo.replace(/\D/g, "");

    if (cpfFormatado === "") {
      mensagemAlerta("O campo CPF obrigatório");
    } else {
      axios
        .post("http://localhost:8080/api/clientes/adicionar", {
          cpfCliente: cpfNovo,
          nomeCliente: nomeCliente,
          emailCliente: emailCliente,
          foneCelular: foneCelular,
          foneComercial: foneComercial,
          endereco: {
            cep: cep,
            logadouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: localidade,
            uf: uf,
            complemento: complemento,
          },
        })
        .then((response) => {
          mensagemSucesso("Cliente cadastrado com sucesso");
          limpaCampos();
          preencherDaddosTabelaCliente();
        })
        .catch((alerta) => {
          mensagemAlerta("CPF informado já cadastrado");
        });
    }
  };

  const hideDeleteClienteDialog = () =>{
    setClienteDialog(false);
  }
  

  const deleteClienteDialogFooter = (
    <div>
        <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClienteDialog} />
        <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={inativar} />
    </div>
)



const confimaDeleteCliente = (cli) =>{
  // console.log('serv', serv);
  setCliente(cli);
  setClienteDialog(true);

}

  const limpaCampos = function () {
    setCpfNovo("");
    setNomecliente("");
    setEmailCliente("");
    setFoneCelular("");
    setFoneComercial("");
    setCep("");
    setLogradouro("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setLocalidade("");
    setUf("");
  };

  const onInputChange = (e, email, fonecelular, fonnecomercail,cep ) =>{
    const val = (e.target && e.target.value) || '';
    let _cliente = { ... cliente};
    _cliente[`${email, fonecelular, fonnecomercail,cep }`] = val;

  }

  const editCliente = (client) =>{
    setCliente(client);
    setClienteDialogEdit(true);
  }

  const acaoCorpoTemplate =(rowData) => {
    if (rowData.statusCliente === "INATIVO") {
        return (
            <div>
                <Button icon="pi pi-undo" className="p-button-rounded p-button-secondary mr-2" onClick={ativar} /> 
            </div>
            
        );
    } else {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() =>editCliente(rowData)}  /> 
                <Button icon="pi pi-trash"  className="p-button-rounded p-button-warning mt-2"  onClick={() => confimaDeleteCliente(rowData)}/>
            </div>

        );
    }
}



  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <div className="card p-fluid">
          <div>
            <label htmlFor="cpfliente">CPF</label>
            <br></br>
            <InputMask
              id="cpfcliente"             
              ref={inputClienteRef}
              type="CPF"
              mask="999.999.999-99"
              placeholder="999.999.999-99"
              value={cpfNovo}
              onChange={({ target }) => setCpfNovo(target.value)}
              style={{ maxWidth: "200px" }}
            />
          </div>
          <div className="field">
            <label htmlFor="nomecliente">Nome</label>
            <InputText
              id="nomecliente"
              type="text"
              placeholder="Informe o nome"
              value={nomeCliente}
              onChange={({ target }) => setNomecliente(target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="emailcliente">Email</label>
            <InputText
              id="emailcliente"
              type="email"
              placeholder="Informe o email"
              value={emailCliente}
              onChange={({ target }) => setEmailCliente(target.value)}
            />
          </div>

          <div className="grid">
            <div className="col-4">
              <div className="col-12">
                <label htmlFor="foneCelular">Celular</label>
                <InputMask
                  id="foneCelular"
                  type="tel"
                  mask="(99) 99999-9999"
                  placeholder="(99) 99999-9999"
                  value={foneCelular}
                  onChange={({ target }) => setFoneCelular(target.value)}
                />
              </div>
            </div>
            <div className="col-4">
              <div className="col-12">
                <label htmlFor="foneComercial">Comercial</label>
                <InputMask
                  id="foneComercial"
                  type="tel"
                  mask="(99) 9999-9999"
                  placeholder="(99) 9999-9999"
                  value={foneComercial}
                  onChange={({ target }) => setFoneComercial(target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 md:col-6">
        <div className="card p-fluid">
          <div className="field grid">
            <label htmlFor="cep" className="col-12 mb-2">
              CEP
            </label>
            <br></br>
            <InputMask
              id="cep"
              type="text"
              onBlur={buscarCep}
              mask="99999-999"
              placeholder="99999-999"
              value={cep}
              onChange={({ target }) => setCep(target.value)}
              style={{ maxWidth: "200px" }}
            />
          </div>

          <div className="field grid">
            <div className="col-8">
              <label htmlFor="logradouro">Logradouro</label>
              <InputText
                id="logradouro"
                type="text"
                value={logradouro}
                disabled={false}
              />
            </div>
            <div className="col-4">
              <label htmlFor="numero">Número</label>
              <InputText
                id="numero"
                type="text"
                value={numero}
                onChange={({ target }) => setNumero(target.value)}
              />
            </div>
          </div>
          <div className="field grid">
            <div className="col-8">
              <label htmlFor="complemento">Complemento</label>
              <InputText
                id="complemento"
                type="text"
                value={complemento}
                onChange={({ target }) => setComplemento(target.value)}
              />
            </div>
            <div className="col-4">
              <label htmlFor="bairro">Bairro</label>
              <InputText
                id="bairro"
                type="text"
                value={bairro}
                disabled={false}
              />
            </div>
          </div>

          <div className="grid">
            <div className="col-8">
              <div className="col-12">
                <div className="field-group">
                  <label htmlFor="localidade">Cidade</label>
                  <InputText
                    id="localidade"
                    type="text"
                    value={localidade}
                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="field-group">
                <label htmlFor="uf">UF</label>
                <InputText id="uf" type="text" value={uf} disabled={false} />
              </div>
            </div>
          </div>
          <div className="grid"></div>
        </div>
      </div>
      <div className="col-12 mod:col-12">
        <Button
          type="submit"
          label="Salvar"
          icon="pi pi-check"
          onClick={gravar}
        ></Button>
      </div>

      <div className="mt-3 card">
        <DataTable value={clientes} className="p-datatable-gridlines" responsiveLayout="scroll" dataKey="id" paginator rows={10} emptyMessage="Nenhum regisgro encontrado"
        >
          <Column filter className="white-space-nowrap" field="cpfCliente" header="CPF" />
          <Column field="nomeCliente" className="white-space-nowrap" header="Nome" />
          <Column field="statusCliente" className="white-space-nowrap" header="Status" />
          <Column field="emailCliente" className="whit-space-nowrap" header="E-mail" />
          <Column field="foneCelular"  className="whit-space-nowrap" header="Celular" />
          <Column field="foneComercial" className="whit-space-nowrap" header="Comercial" />
          <Column field="endereco.cep" className="whit-space-nowrap" header="CEP" />
          <Column field="endereco.logadouro" className="whit-space-nowrap" header="Logradouro" />
          <Column field="endereco.numero" className="whit-space-nowrap" header="N.º" />
          <Column field="endereco.complemento" className="whit-space-nowrap" header="Complemento" />
          <Column field="endereco.bairro" className="whit-space-nowrap" header="Bairro" />
          <Column field="endereco.cidade" className="whit-space-nowrap" header="Cidade" />
          <Column field="endereco.uf" className="whit-space-nowrap" header="UF" />
          <Column className="white-space-nowrap" body={acaoCorpoTemplate} header="Ações" />
        </DataTable>

        <Dialog visible={deleteClienteoDialog} style={{ width: '450px'}} header="Confirma" modal className="p-fluid" footer={deleteClienteDialogFooter} onHide={hideDeleteClienteDialog}>
                <div className="flex align-items-center justify-content-center">
                         <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                         <span>Deseja inativar o cliente ?</span>
                    </div>
                 </Dialog> 

                 {cliente ?
               <Dialog visible={clienteDialogEdit} style={{ width: '450px'}} header="Detalhe Cliente" modal className="p-fluid" footer={clienteDialogFooter} onHide={fecharEditDialot}>

                    <div className="field">
                        <label htmlFor="cpfcliente">CPF</label>
                        <InputText id="cpfcliente" value={cliente.cpfCliente} onChange={(e)=> onInputChange(e, 'cpfCliente')} />
                    </div>

                    <div className="field">
                        <label htmlFor="nomecliente">Nome Cliente</label>
                        <InputText id="nomecliente" value={cliente.nomeCliente} onChange={(e)=> onInputChange(e, 'nomeCliente')} />
                    </div>

                    <div className="field">
                        <label htmlFor="statuscliente">Status Cliente</label>
                        <InputText id="statuscliente" value={cliente.statusCliente} onChange={(e)=> onInputChange(e, 'statuscliente')} />
                    </div>

                    <div className="field">
                        <label htmlFor="emailcliente">E-mail</label>
                        <InputText id="emailcliente" value={cliente.emailCliente} onChange={({target}) => setCliente({...cliente, emailCliente: target.value})} autoFocus /> 
                    </div>

                    <div className="field"> 
                         <label htmlFor="fonecelular">Celular Cliente</label>
                        <InputMask id="fonecelular" value={cliente.foneCelular} mask="(99) 9999-9999" onChange={({target}) => setCliente({...cliente, foneCelular: target.value})}/>
                        </div>
                    <div className="field">
                        <label htmlFor="fonecomercial">Telefone Comercial</label> 
                        <InputMask id="fonecomercial" value={cliente.foneComercial} mask="(99) 9999-9999" onChange={({target}) => setCliente({...cliente, foneComercial: target.value})}/>
                    </div>

                      <div className="field">
                          <label htmlFor="cep">CEP</label>
                          <InputMask id="cep" value={cliente.cep} mask="99999-999" onChange={({target}) => setCliente({...cliente, cep: target.value})} onBlur={buscarCep}/>
                    </div>

                    <div className="field">
                          <label htmlFor="logradouro">Logadouro'</label>
                        <InputText id="logradouro" value={cliente.endereco.logadouro} onChange={({target}) => setCliente({...cliente, logadouro: target.value})}/>
                    </div>

                    <div className="field">
                          <label htmlFor="numero">Número</label>
                        <InputText id="numero" value={cliente.endereco.numero} onChange={({target}) => setCliente({...cliente, numero: target.value})}/>
                    </div>

                    <div className="field">
                          <label htmlFor="complemento">Complemento</label>
                        <InputText id="complemento" value={cliente.endereco.complemento} onChange={({target}) => setCliente({...cliente, complemento: target.value})}/>
                    </div>

                    <div className="field">
                          <label htmlFor="bairro">Bairro</label>
                        <InputText id="bairro" value={cliente.endereco.bairro} onChange={({target}) => setCliente({...cliente, bairro: target.value})}/>
                    </div>

                    <div className="field">
                          <label htmlFor="cidade">Cidade</label>
                        <InputText id="cidade" value={cliente.endereco.cidade} onChange={({target}) => setCliente({...cliente, cidade: target.value})}/>
                    </div>

                    <div className="field">
                          <label htmlFor="uf">UF</label>
                        <InputText id="uf" value={cliente.endereco.uf} onChange={({target}) => setCliente({...cliente, uf: target.value})}/>
                    </div>

                   
                  </Dialog>
            : null}
        
      </div>
    </div>
  );
};

export default Cliente;
