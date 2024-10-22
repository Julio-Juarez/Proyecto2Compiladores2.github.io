import { InterpreterVisitorProyecto } from "./interpreteProyecto.js";
//import { Entorno } from "./entorno.js"; 

export class Invocable{
    
    aridad(){//cantidad de parametros o argumentos necesarios para que la funcion se ejecute
        throw new Error('No implementado');

    }

    /**
     * 
     * @param {InterpreterVisitorProyecto} Interprete 
     * @param {any[]} args 
     */
    invocar(Interprete,args){
        throw new Error('No implementado');

    }
}