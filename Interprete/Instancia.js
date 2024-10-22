import { Invocable } from "./invocable";

export class Instancia{
    constructor(clase){
        this.clase=clase;
        this.propiedades = {};
    }



    /**
     * @type {Invocable['invocar']} 
     */
    set(nombre,valor){
        this.propiedades[nombre]=valor;

        Object.entries(this.propiedades).forEach(([nombre,valor])=>{
            nuevaInstancia.set(nombre, valor.accept(interprete));
        })
    }
}