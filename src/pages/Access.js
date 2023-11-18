import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'primereact/button';

export const Access = (props) => {
	const history = useHistory();

	const goDashboard = () => {
		history.push('/');
	}

	return (
		<div className="exception-body accessdenied">
			<div className="exception-panel">
				<h1>Acesso</h1>
				<h3>Negado</h3>
				<p>Você não tem permissão para acessar essa página.</p>
				<Button type="button" label="Voltar para o inicio" onClick={goDashboard}></Button>
			</div>
			
		</div>
	)
}