
/**

 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').TerminalesExp} TerminalesExp


 * @typedef {import('./nodos').DeclaracionVariable} DeclaracionVariable


 * @typedef {import('./nodos').DeclaracionVariableSinValor} DeclaracionVariableSinValor


 * @typedef {import('./nodos').AsignacionValor} AsignacionValor


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').ExpresionSentencia} ExpresionSentencia


 * @typedef {import('./nodos').Bloque} Bloque


 * @typedef {import('./nodos').OperacionLogica} OperacionLogica


 * @typedef {import('./nodos').SumaYResta} SumaYResta


 * @typedef {import('./nodos').MultiplicacionYDivision} MultiplicacionYDivision


 * @typedef {import('./nodos').OperacionUnaria} OperacionUnaria


 * @typedef {import('./nodos').Agrupacion} Agrupacion


 * @typedef {import('./nodos').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('./nodos').TerminalesExpCadena} TerminalesExpCadena


 * @typedef {import('./nodos').ModIgualacion} ModIgualacion


 * @typedef {import('./nodos').Negacion} Negacion


 * @typedef {import('./nodos').If} If


 * @typedef {import('./nodos').ElseIfExp} ElseIfExp


 * @typedef {import('./nodos').While} While


 * @typedef {import('./nodos').For} For


 * @typedef {import('./nodos').Break} Break


 * @typedef {import('./nodos').Continue} Continue


 * @typedef {import('./nodos').Return} Return


 * @typedef {import('./nodos').Llamada} Llamada


 * @typedef {import('./nodos').DeclaracioFuncion} DeclaracioFuncion


 * @typedef {import('./nodos').Enbebida} Enbebida

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {TerminalesExp} node
     * @returns {any}
     */
    visitTerminalesExp(node) {
        throw new Error('Metodo visitTerminalesExp no implementado');
    }
    

    /**
     * @param {DeclaracionVariable} node
     * @returns {any}
     */
    visitDeclaracionVariable(node) {
        throw new Error('Metodo visitDeclaracionVariable no implementado');
    }
    

    /**
     * @param {DeclaracionVariableSinValor} node
     * @returns {any}
     */
    visitDeclaracionVariableSinValor(node) {
        throw new Error('Metodo visitDeclaracionVariableSinValor no implementado');
    }
    

    /**
     * @param {AsignacionValor} node
     * @returns {any}
     */
    visitAsignacionValor(node) {
        throw new Error('Metodo visitAsignacionValor no implementado');
    }
    

    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }
    

    /**
     * @param {ExpresionSentencia} node
     * @returns {any}
     */
    visitExpresionSentencia(node) {
        throw new Error('Metodo visitExpresionSentencia no implementado');
    }
    

    /**
     * @param {Bloque} node
     * @returns {any}
     */
    visitBloque(node) {
        throw new Error('Metodo visitBloque no implementado');
    }
    

    /**
     * @param {OperacionLogica} node
     * @returns {any}
     */
    visitOperacionLogica(node) {
        throw new Error('Metodo visitOperacionLogica no implementado');
    }
    

    /**
     * @param {SumaYResta} node
     * @returns {any}
     */
    visitSumaYResta(node) {
        throw new Error('Metodo visitSumaYResta no implementado');
    }
    

    /**
     * @param {MultiplicacionYDivision} node
     * @returns {any}
     */
    visitMultiplicacionYDivision(node) {
        throw new Error('Metodo visitMultiplicacionYDivision no implementado');
    }
    

    /**
     * @param {OperacionUnaria} node
     * @returns {any}
     */
    visitOperacionUnaria(node) {
        throw new Error('Metodo visitOperacionUnaria no implementado');
    }
    

    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }
    

    /**
     * @param {ReferenciaVariable} node
     * @returns {any}
     */
    visitReferenciaVariable(node) {
        throw new Error('Metodo visitReferenciaVariable no implementado');
    }
    

    /**
     * @param {TerminalesExpCadena} node
     * @returns {any}
     */
    visitTerminalesExpCadena(node) {
        throw new Error('Metodo visitTerminalesExpCadena no implementado');
    }
    

    /**
     * @param {ModIgualacion} node
     * @returns {any}
     */
    visitModIgualacion(node) {
        throw new Error('Metodo visitModIgualacion no implementado');
    }
    

    /**
     * @param {Negacion} node
     * @returns {any}
     */
    visitNegacion(node) {
        throw new Error('Metodo visitNegacion no implementado');
    }
    

    /**
     * @param {If} node
     * @returns {any}
     */
    visitIf(node) {
        throw new Error('Metodo visitIf no implementado');
    }
    

    /**
     * @param {ElseIfExp} node
     * @returns {any}
     */
    visitElseIfExp(node) {
        throw new Error('Metodo visitElseIfExp no implementado');
    }
    

    /**
     * @param {While} node
     * @returns {any}
     */
    visitWhile(node) {
        throw new Error('Metodo visitWhile no implementado');
    }
    

    /**
     * @param {For} node
     * @returns {any}
     */
    visitFor(node) {
        throw new Error('Metodo visitFor no implementado');
    }
    

    /**
     * @param {Break} node
     * @returns {any}
     */
    visitBreak(node) {
        throw new Error('Metodo visitBreak no implementado');
    }
    

    /**
     * @param {Continue} node
     * @returns {any}
     */
    visitContinue(node) {
        throw new Error('Metodo visitContinue no implementado');
    }
    

    /**
     * @param {Return} node
     * @returns {any}
     */
    visitReturn(node) {
        throw new Error('Metodo visitReturn no implementado');
    }
    

    /**
     * @param {Llamada} node
     * @returns {any}
     */
    visitLlamada(node) {
        throw new Error('Metodo visitLlamada no implementado');
    }
    

    /**
     * @param {DeclaracioFuncion} node
     * @returns {any}
     */
    visitDeclaracioFuncion(node) {
        throw new Error('Metodo visitDeclaracioFuncion no implementado');
    }
    

    /**
     * @param {Enbebida} node
     * @returns {any}
     */
    visitEnbebida(node) {
        throw new Error('Metodo visitEnbebida no implementado');
    }
    
}
