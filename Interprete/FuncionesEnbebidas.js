//Funciones que ya existen en el lenguaje

import { Invocable } from "./invocable.js";
import nodos, { Expresion } from '../GeneradorDeArchivos/nodos.js';


class FuncionNativa extends Invocable{
    constructor(aridad,func){
        super();
        this.aridad = aridad;
        this.invocar=func;

    }
}
/**
 * 
    const forTraducido = new nodos.Bloque({
        dcls: [
            node.init,
            new nodos.While({
                cond: node.cond,
                stmt: new nodos.Bloque({
                    dcls: [
                        node.stmt,
                        node.inc
                    ]
                })
            })
        ]
    })
 */


export const enbebidas={
    'time': new FuncionNativa(()=>0,()=> new Date().toISOString()),
    
}