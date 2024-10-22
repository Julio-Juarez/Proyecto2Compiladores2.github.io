

export class Entorno {

    /**
     * @param {Entorno} padre
     */
    constructor(padre=undefined) {
        this.valores = {};
        this.padre=padre;
        this.nombreEntorno="Global";
    }

    /**
     * @param {string} tipo
     * @param {any} valor
     */
    setFuncion(tipo,nombre, valor) {
        //si algo ya esta declarado lanzar error
        this.valores[nombre] = {tipo,valor};
    }

    /**
     * @param {string} tipo
     * @param {string} nombre
     * @param {any} valor
     */
    setVariable(tipo,nombre, valor, fila, columna ) {
        //si algo ya esta declarado lanzar error
        this.valores[nombre] = {tipo,valor,fila,columna};
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre) {
        const valorActual=this.valores[nombre];
        if (valorActual != undefined) {
            return valorActual
            
        }
        if (!valorActual && this.padre) {
            return this.padre.getVariable(nombre);
        }
        return this.valores[nombre];
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     */
    asignacionVariable(nombre, valor) {
        /*if (!this.valores[nombre]) {
            throw new Error(`Variable ${nombre} no definida`);
        }*/
       

        const valorActual=this.valores[nombre];
        //const tipo = valorActual.tipo;
        
        console.log(this.valores[nombre]);
        console.log(valor);
        

        if(valorActual != undefined){
            console.log(this.valores[nombre]);
            this.valores[nombre].valor=valor.valor;
            console.log(this.valores[nombre]);
            
        }
        if (!valorActual && this.padre) {
            console.log("entro al padre del entrono");
            this.padre.asignacionVariable(nombre,valor);
            return;
        }
        
        //throw new Error(`Variable ${nombre} no definida`);
    }
}