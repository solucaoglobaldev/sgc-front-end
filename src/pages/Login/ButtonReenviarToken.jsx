import {Button} from "primereact/button";
import React, {useEffect, useState} from "react";

const ButtonReenviarToken = function({ carregandoResquest, reenviarToken }) {

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    }, [timer]);

    const handleReenviarToken = function() {
        setTimer(30);
        if(reenviarToken)
            reenviarToken();
    }

    return (
        <div>
            <Button
                loading={carregandoResquest || timer > 0}
                type="button"
                label={ timer > 0 ? ("Aguarde " + timer + " segundos") : "Reenviar token" }
                icon="pi pi-envelope"
                className="w-auto p-button-success"
                onClick={handleReenviarToken}
            ></Button>
        </div>
    );
}

export default ButtonReenviarToken;