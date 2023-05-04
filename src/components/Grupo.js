import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const Grupo = () => {

  return ( <div className="grid">
  <div className="col-12 md:col-12">
      <div className="card p-fluid">                  
          <div className="field">
              <label htmlFor="nomeGrupo">Descrição do Grupo</label>
              <InputText id="nomeGrupo" type="text" />
          </div>  
      </div>
  </div>  
  <div className="grid">
  <div className="col-12 md:col-4">
              <Button type="button" label="Salvar" icon="pi pi-check"></Button>                                                
          </div>
      <div className="col-12 md:col-5">
              <Button type="button" label="Atualizar" icon="pi pi-check-circle" className="p-button-info"></Button>                                                
        </div>
        <div className="col-12 md:col-1">
              <Button type="button" label="Deletar" icon="pi pi-trash" className="p-button-danger"></Button>                                                
          </div>
      </div>
</div>);
}

export default Grupo
