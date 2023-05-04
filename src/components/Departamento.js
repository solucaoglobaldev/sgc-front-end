import React, {useState,useRef, useEffect} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import {  mensagemError } from '../components/Mensagem'
import { mensagemSucesso } from '../components/Mensagem';
import { mensagemAlerta } from '../components/Mensagem';
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Dialog} from 'primereact/dialog';




const Departamento = () => { 

    const [departamento, setDepartamento] = useState('');   
    const inputDepartarmentRef = useRef(null);
    const [departamentos, setDepartamentos] = useState([]);   
    const [deleteDepartamentoDialog, setDeleteDepartamentoDialog] = useState(false);

    useEffect(() =>{
        preencherDaddosTablea();
    },[]);

  

  
    const preencherDaddosTablea = () => {
        axios.get('http://localhost:8080/api/departamentos/listar')
          .then(response => {
           // console.log(  ` sucesso ${response.data}`)
            setDepartamentos(response.data );
          })
          .catch(error => {
            console.log(error);
          });
      }
  
     const gravar = () =>{
        if(departamento === ''){
            mensagemAlerta('O campo departamento obrigatorio!');
        } else{             

        axios
            .post('http://localhost:8080/api/departamentos/adicionar', {
                   nmDepartamento:departamento,
            
        }).then(response => {  
             
            mensagemSucesso('Gravado com sucesso');          
            limpar();
            preencherDaddosTablea();

        }).catch(erro =>{
            mensagemError('Erro ao gravar');
        })
    }
    
       
    }

    const confimaDeleteDepartamento = (depert) =>{
        setDepartamento(depert);
        setDeleteDepartamentoDialog(true);

    }

    const deleteDepartamentoDialogFooter = (
        <div>
            <Button label="Não" icon="pi pi-times" className="p-button-text" />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" />

        </div>

    )

    const hideDeleteDepartamentoDialog = () =>{
        setDeleteDepartamentoDialog(false);
    }

    const limpar = () => {
        setDepartamento('');      
    }

    const acaoCorpoTemplate =(rowData) => {
        return(
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" /> 
                <Button icon="pi pi-trash"  className="p-button-rounded p-button-danger mt-2" onClick={() => confimaDeleteDepartamento(rowData)} />
            </div>

        );
    }

  /*   const validaCampo = () => {
       
        if(departamento === ''){
            mensagemAlerta('O campo departamento obrigatorio!');
        }
    } */
  
    return (
        <div className="grid">
            <div className="col-12 md:col-12">
                <div className="card p-fluid">                  
                    <div className="field">
                        <label htmlFor="nomeDep">Descrição do Departamento</label>
                        <InputText id="nomeDep" ref={inputDepartarmentRef} type="text" placeholder="Informe o nome do Departamento sem espaço" value={departamento}
                        onChange={({target}) => setDepartamento(target.value)}/>
                    </div>  
                </div>
                <div className="grid">
                     <div className="col-12 md:col-12">
                            <Button type="submit" label="Salvar" icon="pi pi-check" onClick={gravar}></Button>
                           
                    </div>                                  
                </div>
            </div>         
            
            <DataTable value={departamentos} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                        emptyMessage="Não contem dados.">
                        <Column field="codigoDepartamento" header="Id Departamento"  style={{ minWidth: '8rem' }} />
                        <Column field="nomeDepartamento"  header="Descrição Departamento" style={{ minWidth: '12rem' }}/>                        
                        <Column field="statusDepartamento" header="Status Departamento" style={{ minWidth: '12rem'}}/>                                              
                        <Column header="Ação"  style={{ minWidth: '8rem' }} body={acaoCorpoTemplate} className="flex align-items-center justify-content-center"/>                      
                    </DataTable>

            <Dialog visible={deleteDepartamentoDialog} style={{ width: '450px'}} header="Confirma" modal footer={deleteDepartamentoDialogFooter} onHide={hideDeleteDepartamentoDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                    <span>Deseja excluir o Departamento ?</span>
                </div>
                </Dialog>        
                   

                     
                    
                  
        </div>
                
        
        
       
    )
}



export default Departamento
