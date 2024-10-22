import { DeclaracioFuncion } from "../GeneradorDeArchivos/nodos.js";
import { Entorno } from "./entorno.js";
import { Invocable } from "./invocable.js";
import { ReturnException } from "./Trasferencia.js";


export class FuncionForanea extends Invocable{
    constructor(nodo,clousure){
        super();
        
        /**
         * @type {DeclaracioFuncion}
         */
        this.nodo=nodo;

        /**
         * @type {Entorno}
         */
        this.clousure=clousure;
    }

    aridad(){
        return this.nodo.params.length;

    
    }

    /**
     * @type {Invocable['invocar']}
     */
    invocar(interprete, args){
        console.log("--------------Argumentos ---------------");
        console.log(args);
        console.log("----------------------------------------");
       
        const entornoNuevo=new Entorno(this.clousure)
        console.log("33333333333333333333333-------------------");
        this.nodo.params.forEach((param,i)=>{
            console.log(param);
            console.log(i);
            //(tipo,nombre, valor, fila, columna )
            entornoNuevo.setVariable("int",param.id,args[i],1,2);


        });

        const entornoAntesDeLaLlamada = interprete.EntornoActual;
        interprete.EntornoActual=entornoNuevo;
        const nombreAnterior=interprete.EntornoActual.nombreEntorno
        interprete.EntornoActual.nombreEntorno= this.nodo.id;

        try {
            this.nodo.bloque.accept(interprete);

        } catch (error) {
            interprete.EntornoActual =  entornoAntesDeLaLlamada;
            console.log("&&&&&&&&&&&&&&&&&&&7777777");
            console.log(error.value);
            if(error instanceof ReturnException){
                console.log("error instancia");
                //console.log(error.value.valor.valor);
                console.log("!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(error.value.valor);
                console.log(error.value);
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

               
                    return error.value
                
                

            }

            //Manejar el restp de sentencias de tresferencia o de control
            throw error;
        }
        interprete.EntornoActual = entornoAntesDeLaLlamada;
        return null
    }
    atar(instancia){
        const entornoOculto = new Entorno(this.clousure);
        entornoOculto.set('this',instancia);
        return new FuncionForanea(this.nodo,entornoOculto);
    }

}