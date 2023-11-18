import React, {useState,useRef, useEffect} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputMask } from "primereact/inputmask";
import axios from 'axios';
import {  mensagemAlerta, mensagemError } from './Mensagem'
import { mensagemSucesso } from './Mensagem';





const FormacaoPrecoProduto = () => { 
    const inputCodigoProdutoRef = useRef(null);
    const [codigoProduto, setCodigoProduto] = useState("");
    const [descricaoProduto, setDescricaoProduto] = useState("");
    const [valorcompara, setValorCompra] = useState("");
    const [frete, setFrete] = useState("");
    const [iss,setIss] = useState("");
    const [icms,setIcms] = useState("");
    const [cofins, setCofins] = useState("");
    const [pispasep, setPisPasep] =  useState("");
    const [cpp, setCpp] =  useState("");
    const [irpj, setIrpj] =  useState("");
    const [ipi, setIpi] =  useState("");
    const [comissao, setComissao] =  useState("");
    const [margeLucro, setMargemLucro] =  useState("");




    const buscarPorProduto = async()=>{
      const codigoEncontrado = codigoProduto.replace(/[^0-9]/g, "");
      if (codigoEncontrado === ""){
        mensagemAlerta("Codigo do produto deve ser informado");
      } else{
        try {
          const response = await axios.get(
            `http://localhost:8080/api/produtos/buscarPorCodigo/${codigoEncontrado}/json`,            
                  
          );
          setDescricaoProduto(response.data.descricaoProduto);
          
        } catch (error) {
          mensagemError("Erro ao buscar o cogido do produto")
        }
      }

    }


    return (
        
    <div className="grid">
    <div className="col-12 md:col-6">
      <div className="card p-fluid">
        <div className='field'>
        <div>
          <label htmlFor="codigoProduto">Código Produto</label>
          <br></br>
          <InputText
            id="codigoProduto"   
            type="text"        
            ref={inputCodigoProdutoRef} 
            onBlur={buscarPorProduto}  
            value={codigoProduto}
            onChange={({target}) => setCodigoProduto(target.value)}
            style={{ maxWidth: "200px" }}
          />
          </div>
        </div>

        <div className="field">
            <label htmlFor="descricaoProduto">Descrição Produto</label>
            <InputText
              id="descricaoProduto"
              type="text"              
              value={descricaoProduto}
              onChange={({ target }) => setDescricaoProduto(target.value)}
            />
          </div>

        <div className="field">
            <div className="col-6 mb-3">
               <label htmlFor="valorCompra">Valor Compra</label>
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-dollar" />
                            <InputText value={valorcompara} onChange={({target})=> setValorCompra(target.value)}
                            required type="text"  />
                            
                        </span>
            </div>
            <div className="col-6 mb-3">
                <div>
                        <label htmlFor="valorCompra">Frete</label>
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-dollar" />
                            <InputText value={frete} onChange={({target})=> setFrete(target.value)}
                            required type="text"  />
                            
                        </span>
                    </div>
                 </div>
                </div>
       
        <div className="grid">       

        <div className="col-6 mb-3">
            <div>
              <label htmlFor="impIss">Iss</label>
              <InputText
                id="impIss"
                type="text"               
                value={iss}
                onChange={({target}) => setIss(target.value)}
              />
            </div>
          </div>

          <div className="col-6 mb-3">
            <div>
              <label htmlFor="mpIcms">Icms</label>
              <InputText
                id="impIss;"
                type="text"                
                value={icms}
                onChange={({target}) => setIcms(target.value)}
              />
            </div>
          </div>

          <div className="col-6 mb-3">
            <div>
              <label htmlFor="impCofins">Cofins</label>
              <InputText
                id="impCofins"
                type="text"               
                value={cofins}
                onChange={({target}) =>setCofins(target.value)}
              />
            </div>
          </div>

          <div className="col-6 mb-3">
            <div className>
              <label htmlFor="impPisPasep">PisPasep</label>
              <InputText
                id="impPisPasep"
                type="text"               
                value={pispasep}
                onChange={({target}) => setPisPasep(target.value)}
                
              />
            </div>
          </div>

          <div className="col-6 mb-3">
          <div>
              <label htmlFor="impCpp">Cpp</label>
              <InputText
                id="impCpp"               
                type="text"
                value={cpp}
                onChange={({target}) => setCpp(target.value)}
              />
            </div>
          </div>

          <div className="col-6 mb-3">
            <div>
              <label htmlFor="impIrpj">Irpj</label>
              <InputText
                id="impIrpj"
                type="text"               
                value={irpj}
                onChange={({target}) => setIrpj(target.value)}
              />
            </div>
          </div>

          <div className="col-6 mb-3">
          <div>
              <label htmlFor="impIpi">Ipi</label>
              <InputText
                id="impIpi"
                type="text"                
                value={ipi}
                onChange={({target}) => setIpi(target.value)}
              />
            </div>
          </div>

          <div className="col-6 mb-3">
            <div>
              <label htmlFor="comissao">Comissão</label>
              <InputText
                id="comissao"
                type="text"                
                value={comissao}
                onChange={({target}) => setComissao(target.value)}
              />
            </div>
          </div>

          <div className="col-6 mb-3">
            <>
              <label htmlFor="margemLucro">Margem Lucro</label>
              <InputText
                id="margemLucro"
                type="text"                
                value={margeLucro}
                onChange={({target}) => setMargemLucro(target.value)}
              />
            </>
          </div>
          
        </div>
      </div>
    </div>

    
    <div className="col-12 mod:col-12">
      <Button
        type="submit"
        label="Calcular"
        icon="pi pi-check"     
      ></Button>
    </div>

   </div>  
    )
}



export default FormacaoPrecoProduto
