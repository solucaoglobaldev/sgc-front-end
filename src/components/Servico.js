import React, {useState,useRef, useEffect} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import {  mensagemError } from './Mensagem'
import { mensagemSucesso } from './Mensagem';
import { mensagemAlerta } from './Mensagem';
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Dialog} from 'primereact/dialog';





const Servico = () => { 
    const inputServicoRef = useRef(null);
    const [novoServico, setNovoServico] = useState();
    const [servico, setServico] = useState(null);         
    const [servicos, setServicos] = useState([]);   
    const [deleteServicoDialog, setServicoDialog] = useState(false); 
    const [servicoDialogoEdit, setServicoDialogoEdit] = useState(false);

    useEffect(() =>{
        preencherDaddosTablea();
    },[]);

  

    const editServico = (servic) =>{      
        setServico(servic);
        setServicoDialogoEdit(true);
    }

    const editServicoFechar = () =>{
        setServicoDialogoEdit(false);
    }
  
    const preencherDaddosTablea = () => {
        axios.get('http://localhost:8080/api/servicos/listar')
          .then(response => {
           // console.log(  ` sucesso ${response.data}`)
           setServicos(response.data );
          })
          .catch(error => {
            mensagemError("Erro ao carregar");
          });
    }
   
    const atualizar = () =>{
        axios.put(`http://localhost:8080/api/servicos/atualizarServico/${servico.codigoServico}`, {
            nmServico: servico.nomeServico
        })
        .then(response =>{
            mensagemSucesso('Atualizado com sucesso');
            editServicoFechar();
            preencherDaddosTablea();
        }).catch(erro =>{
            mensagemError('Erro ao atulizar');
        })
    }
    const inativar = () => { 
        
        axios.get(`http://localhost:8080/api/servicos/remover/${servico.codigoServico}`)
        .then(response =>{
            mensagemSucesso('Inativado com sucesso');
            hideDeleteServicoDialog();
            preencherDaddosTablea();
        }).catch(erro =>{
            mensagemError('Erro ao Intivar');
        })
      
    }
    const ativar = () => {
       
        axios.get(`http://localhost:8080/api/servicos/ativar/${servico.codigoServico}`)
        .then(response =>{
            mensagemSucesso('Serviço Ativado');
            hideDeleteServicoDialog();
            preencherDaddosTablea();
        }).catch(erro =>{
            mensagemError('Erro ao Ativar');
        })
     
    }

   
   const sericoDialogFooter =(
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={editServicoFechar}/>
            <Button label="Salvar"   icon="pi pi-check" className="p-button-text" onClick={atualizar}/>  
           
        
        </div>
    );
  
     const gravar = async () =>{
        if(novoServico === ''){
            mensagemAlerta('O campo Seriço obrigatorio!');            
        } else {             

        axios
            .post('http://localhost:8080/api/servicos/adicionar', {
                nmServico:novoServico,
            
        }).then(response => {  
            
            mensagemSucesso('Gravado com sucesso');          
            limpar();
            preencherDaddosTablea();

        }).catch(alerta => {
            mensagemAlerta('Descrição do Serviço informado já consta cadastrado');
        })
    }
    
       
    }

    const confimaDeleteServico = (serv) =>{
       // console.log('serv', serv);
        setServico(serv);
        setServicoDialog(true);

    }

   const onInputChange = (e, descricao) => {
        const val =(e.target && e.target.value) || '';
        let _servico = { ...servico};
        _servico[`${descricao}`] = val;
    } 

    const hideDeleteServicoDialog = () => {
        setServicoDialog(false);
    }
    
    const hideEditServicoDialog = () =>{
        setServicoDialogoEdit(false)
    }

    const deleteServicoDialogFooter = (
        <div>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteServicoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={inativar} />
        </div>
    )

    const limpar = () => {
        setNovoServico('');      
    }

    const acaoCorpoTemplate =(rowData) => {
        if (rowData.statusDepartamento === "INATIVO") {
            return (
                <div>
                    <Button icon="pi pi-undo" className="p-button-rounded p-button-secondary mr-2" onClick={ativar} /> 
                </div>
                
            );
        } else {
            return (
                <div className="actions">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editServico(rowData)} /> 
                    <Button icon="pi pi-trash"  className="p-button-rounded p-button-warning mt-2" onClick={() => confimaDeleteServico(rowData)} />
                </div>
    
            );
        }
    }

    return (
        <div className="grid">
            <div className="col-12 md:col-12">
                <div className="card p-fluid">                  
                    <div className="field">
                        <label htmlFor="nomeServico">Descrição do Serviço</label>
                        <InputText id="nomeServico" autoFocus ref={inputServicoRef} type="text" placeholder="Informe a Descrição do Serviço" value={novoServico}
                        onChange={({target}) => setNovoServico(target.value)}/>
                    </div>  

                  
                </div>
                <div className="grid">
                     <div className="col-12 md:col-12">
                            <Button type="submit" label="Salvar" icon="pi pi-check" onClick={gravar}></Button>
                           
                    </div>                                  
                </div>
            </div>
            
            <DataTable value={servicos} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                        emptyMessage="Não contem dados.">
                        <Column field="codigoServico" header="Codigo Serviço"  style={{ minWidth: '8rem' }} />
                        <Column field="nomeServico"  header="Descrição Serviço" style={{ minWidth: '12rem' }}/>                        
                        <Column field="statusDepartamento" header="Status Serviço" style={{ minWidth: '12rem'}}/>                                              
                        <Column header="Ação" style={{ minWidth: '8rem' }} body={acaoCorpoTemplate} className="flex align-items-center justify-content-center"/>                      
                </DataTable>

                <Dialog visible={deleteServicoDialog} style={{ width: '450px'}} header="Confirma" modal footer={deleteServicoDialogFooter} onHide={hideDeleteServicoDialog}>

                <div className="flex align-items-center justify-content-center">
                         <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                         <span>Deseja inativar o Serviço ?</span>
                    </div>
                 </Dialog>   
            
             {servico ?
               <Dialog visible={servicoDialogoEdit} style={{ width: '450px'}} header="Detalhe Serviço" modal className="p-fluid" footer={sericoDialogFooter} onHide={hideEditServicoDialog}>
                    <div className="field">
                        <label htmlFor="descricao">Descrição Serviço</label>
                        <div className="field">
                        <InputText id="descricao" value={servico.nomeServico} onChange={({target}) => setServico({...servico, nomeServico: target.value})} autoFocus  />
                        </div>
                        <div className="field">
                        <InputText id="statusservico" value={servico.statusDepartamento} onChange={(e)=> onInputChange(e, 'statusservico')} />
                        </div>
                    </div>
                  </Dialog>
            : null}
                  
        </div>
       
    )
}



export default Servico
