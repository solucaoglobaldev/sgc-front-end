import React from 'react';
import {DataTable} from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';


const Table = () =>{

    return (

        <div className="col-12">
                <div className="card">
                    <h5>Dados Departamento</h5>

                    <DataTable  paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                        emptyMessage="No customers found.">
                        <Column header="Id Departamento"  style={{ minWidth: '8rem' }} />
                        <Column header="Descrição Departamento" style={{ minWidth: '12rem' }}/>
                        <Column header="Status Departamento" style={{ minWidth: '12rem' }}/>
                        <Column header="Ação" style={{ minWidth: '12rem' }}>
                        <Button type='button' icon="pi-trash"/>
                        <Button type='button' icon="pi-check-square"/>
                        </Column>
                        
                    </DataTable>
                    </div>
                    </div>
    )

    /*state = {
        dados: [],
      }
      
      // Chame a API ou o banco de dados para buscar os dados e atualize o estado
      preencherDaddosTablea() {
        axios.get('localhost:8080/api/departamentos/listar')
          .then(response => {
            this.setState({ dados: response.data });
          })
          .catch(error => {
            console.log(error);
          });
      }
      
      render() {
        return (
          <DataTable paginator className="p-datatable-gridlines" showGridlines rows={10}

                        dataKey="id"  filterDisplay="menu"  responsiveLayout="scroll"
                        emptyMessage="No customers found.">
                        <Column header="Id Departamento"  style={{ minWidth: '8rem' }} />
                        <Column header="Descrição Departamento" style={{ minWidth: '12rem' }}/>
                        <Column header="Status Departamento" style={{ minWidth: '12rem' }}/>
                        <Column header="Ação" style={{ minWidth: '12rem' }}/>   
         
                        data={this.state.dados}
            </DataTable>
           
        )
      }*/



}

export default Table