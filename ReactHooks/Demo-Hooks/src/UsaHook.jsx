import { useState } from "react";

function UsaHook() {
    // // var nombre = "Hook";
    // const [nombre, setNombre] = useState("Juan");
    // const [flag, setFlag] = useState(false);
    // const [fragmento, setFragmento] = useState(true);
    // const [genero, setGenero] = useState("Masculino");

    // return fragmento ?
    //     <>

    //         <div>

    //             <h1>{genero.valor === "femenino" ? "María" : nombre}</h1>

    //             <button onClick={() => {
    //                 setNombre("Pedro");
    //                 setGenero({ valor: "femenino" });
    //             }}>
    //                 Cambiar a feminino
    //             </button>

    //             <p>Estado actual del flag: {flag ? "Afirmativo" : "Negativo"}</p>

    //             <button onClick={() => setFragmento(false)}>
    //                 Eliminar Fragmento
    //             </button>

    //         </div>


    //     </>
    //     :
    //     <>
    //         <h1>Fragmento eliminado</h1>
    //         <button onClick={() => setFragmento(true)}>Restaurar</button>
    //     </>

    const [contador, setContador] = useState(0);

    return (
        <>
            <h1>{contador}</h1>
            <button onClick={() => setContador(contador + 1)}>Incrementar</button>
            <button onClick={() => setContador(contador - 1)}>Decrementar</button>
            <button onClick={() => setContador(0)}>Reiniciar</button>
        </>
    );
}

export default UsaHook;