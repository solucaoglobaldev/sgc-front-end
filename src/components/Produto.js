import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { mensagemAlerta, mensagemError } from "./Mensagem";
import { mensagemSucesso } from './Mensagem';
import { Dialog } from "primereact/dialog";





const Produto = () => {

    const inputProdutoRef = useRef(null);
    const [produto, setProduto] = useState('');
    const [produtos, setProdutos] = useState([]);   
    const [deleteProdutoDialog, setProdutoDialog] = useState(false);
    const [novoProduto, setNovoProduto] = useState('');
    const [produtoDialogEdit, setPrdutoDialogEdit] = useState ('');

    useEffect(() =>{
        preencherDaddosTablela();
    },[]);


const preencherDaddosTablela = () => {
    axios.get('http://localhost:8080/api/produtos/listar')
      .then(response => {
       // console.log(  ` sucesso ${response.data}`)
       setProdutos(response.data );
      })
      .catch(error => {
        mensagemError("Erro ao carregar");
      });
}

const hideDeleteProdutoDialog = () =>{
    setProdutoDialog(false);
}

const hideEditProdutoDialog = () =>{
    setPrdutoDialogEdit(false)
}

const gravar = async () =>{
    if(novoProduto === ''){
        mensagemAlerta('O campo Produto obrigatorio!');            
    } else {             

    axios
        .post('http://localhost:8080/api/produtos/adicionar', {
            descricaoProduto:novoProduto,
        
    }).then(response => {  
        
        mensagemSucesso('Gravado com sucesso');          
        limpar();
        preencherDaddosTablela();

    }).catch(alerta => {
        mensagemAlerta('Descrição do Produto informado já consta cadastrado');
    })
  }
}


const limpar = () => {
    setNovoProduto('');      
}

const inativar = () =>{
    if(produto){
        axios.get(`http://localhost:8080/api/produtos/inativar/${produto.codigoProduto}`)
        .then(response =>{
            mensagemSucesso('Produto Inativado');
            preencherDaddosTablela();
            hideDeleteProdutoDialog();
        }).catch(error => {
            mensagemError('Erro ao Inativar');
        })        
    }
}

const ativar = () =>{
    if(produto){
        axios.get(`http://localhost:8080/api/produtos/ativar/${produto.codigoProduto}`)
        .then(response =>{
            mensagemSucesso('Produto Ativado');
            preencherDaddosTablela();
            hideDeleteProdutoDialog();
        }).catch(erro =>{
            mensagemError('Erro ao Inativar');
        })
    }
}

const produtoDialogFooter =(
    <div>
        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideEditProdutoDialog} />
        <Button label="Salvar"   icon="pi pi-check" className="p-button-text" />  
       
    
    </div>
);

const deleteProdutoDialogFooter = (
    <div>
        <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProdutoDialog} />
        <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={inativar} />
    </div>
)


const confimaDeleteProduto = (prod) =>{
    // console.log('serv', serv);
     setProduto(prod);
     setProdutoDialog(true);

 }

 const editProduto = (produt) =>{      
    setProduto(produt);
    setPrdutoDialogEdit(true);
}



 const onInputChange = (e, descricao) => {
    const val =(e.target && e.target.value) || '';
    let _produto = { ...produto};
    _produto[`${descricao}`] = val;
}

/*const produtoDialogFooter =(
    <div>
        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" />
        <Button label="Salvar"   icon="pi pi-check" className="p-button-text" />  
       
    
    </div>
); */

    const acaoCorpoTemplate = (rowData) =>{

        if(rowData.status === 'INATIVO'){
            return (               
                    <div>
                        <Button icon="pi pi-undo" className="p-button-rounded p-button-secondary mr-2" onClick={ativar}/> 
                    </div>
            );
        } else{
            return (
                <div className="actions">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduto(rowData)}/> 
                    <Button icon="pi pi-trash"  className="p-button-rounded p-button-warning mt-2" onClick={() => confimaDeleteProduto(rowData)}  />

                  
                </div>
    
            );
    
        }
    
    }

      
  return ( <div className="grid">
  <div className="col-12 md:col-12">
      <div className="card p-fluid">                  
          <div className="field">
              <label htmlFor="nomeProduto">Descrição do Produto</label>
              <InputText id="nomeProduto" ref={inputProdutoRef} type="text" placeholder="Informe a descrição do Produto" value={novoProduto}
              onChange={({target}) =>setNovoProduto(target.value)}/>
          </div>  
      
      </div>  
           <div className="grid">
                <div className="col-12 md:col-4">
                <Button type="button" label="Salvar" icon="pi pi-check" onClick={gravar}></Button>                                                
            </div>        
        </div>
      </div>

      <DataTable  value={produtos} paginator className="p-datatable-gridlines" showGridlines rows={10} dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                        emptyMessage="Não contem dados.">
                        <Column field="codigoProduto"  header="Codigo Produto"  style={{ minWidth: '8rem', textAlign: 'center' }}  />
                        <Column field="descricaoProduto" header="Descrição Produto" style={{ minWidth: '12rem' }}/>                        
                        <Column field="status"  header="Status Produto" style={{ minWidth: '12rem'}}/>                                              
                        <Column  header="Ação"  style={{ minWidth: '8rem', textAlign:'center' }} body={acaoCorpoTemplate} className="flex align-items-center justify-content-center"/>                      
        </DataTable>

        <Dialog visible={deleteProdutoDialog} style={{ width: '450px'}} header="Confirma" modal footer={deleteProdutoDialogFooter} onHide={hideDeleteProdutoDialog}>

        <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                <span>Deseja inativar o Produto ?</span>
            </div>
        </Dialog>

        {produto ?
               <Dialog visible={produtoDialogEdit } style={{ width: '450px'}} header="Detalhe Serviço" modal className="p-fluid" footer={produtoDialogFooter} onHide={hideEditProdutoDialog}>
                    <div className="field">
                        <label htmlFor="descricao"> Descrição Produto </label>
                        <div className="field">
                        <InputText id="descricao" value={produto.descricaoProduto} onChange={({target}) => setProduto({...produto, descricaoProduto: target.value})} autoFocus  />
                        </div>

                        <div className="field">
                        <InputText id="statusproduto" value={produto.status} onChange={(e)=> onInputChange(e, 'statusproduto')} />
                        </div>
                    </div>
                  </Dialog>
            : null}
        
    

       
</div>
);
}

export default Produto
