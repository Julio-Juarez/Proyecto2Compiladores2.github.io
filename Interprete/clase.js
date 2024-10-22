
import { Invocable } from "./invocable.js";
import { Expresion } from "../GeneradorDeArchivos/nodos.js";
import {Instancia} from "./Instancia.js"

export class Clase extends Invocable{
    constructor(nombre, propiedades,metodos){
        super();
        /**
         * @type {string}
         */
        this.nombre=nombre;
        /**
         * @type {Map<string, Expresion>}
         */
        this.propiedades=propiedades;
        /**
         * @type {Map<string,Invocable>}
         */
        this.metodos=metodos;



    }

    /**
     * 
     * @param {string} nombre
     * @returns{FuncionForanea | null} 
     */

    buscarMetodo(nombre){
        if (this.metodos.hasOwnProperty(nombre)) {
            return this.metodos[nombre];
        }
        return null;

    }

    aridad(){
        const constructor = this.buscarMetodo('constructor');

        if(constructor){
            return constructor.aridad();
        }
        return 0;
    }
    
    /**
   * @type {Invocable['invocar']}
   */
    invocar(Interprete,args){
        const nuevaIntancia = new Instancia(this);
        
        //valores por defecto
        Object.entries(this.propiedades).forEach(([nombre,valor])=>{
            nuevaIntancia.set(nombre,valor.accept(Interprete));
        });

        const constructor = this.buscarMetodo('constructor');
        if(constructor){
            constructor.atar(nuevaIntancia).invocar(Interprete,args);
        }


        
        return nuevaIntancia; 
    }
}