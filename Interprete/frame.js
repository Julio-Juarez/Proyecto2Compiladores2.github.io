

import { BaseVisitor } from "../GeneradorDeArchivos/visitor.js";


export class FrameVisitor extends BaseVisitor {
  constructor(baseOffset) {
    super();
    this.frame= [];
    this.localSize=0;
    this.baseOffset=baseOffset;
    

  }

  // int float boolean char
  /**
   * @type {BaseVisitor['visitTerminalesExp']}
   */
  visitTerminalesExp(node) {
    console.log("terminales no cadena");
    
  }

  //Cadena o String
  /**
   * @type {BaseVisitor['visitTerminalesExpCadena']}
   */
  visitTerminalesExpCadena(node) {
    console.log("Terminales cadena");
    
    //throw new Error('Metodo visitTerminalesExpCadena no implementado');
  }

  /**
   * @type {BaseVisitor['visitDeclaracionVariable']}
   */
  visitDeclaracionVariable(node) {
    console.log("declaracion con valor");
    this.frame.push({
      id:node.id,
      offset:this.baseOffset + this.localSize,
    });
    this.localSize += 1;

    //throw new Error('Metodo visitDeclaracionVariable no implementado');
  }

  /**
   * @type {BaseVisitor['visitDeclaracionVariableSinValor']}
   */
  visitDeclaracionVariableSinValor(node) {
    console.log("declaracion sin valor");

    //throw new Error('Metodo visitDeclaracionVariableSinValor no implementado');
  }

  /**
   * @type {BaseVisitor['visitAsignacionValor']}
   */
  visitAsignacionValor(node) {
    console.log("asignacion Valor");
    
    //throw new Error('Metodo visitAsignacionValor no implementado');
  }

  /**
   * @type {BaseVisitor['visitPrint']}
   */
  visitPrint(node) {


    //throw new Error('Metodo visitPrint no implementado');
  }

  /**
   * @type {BaseVisitor['visitExpresionSentencia']}
   */
  visitExpresionSentencia(node) {
    console.log("todo bien en exp sentencia");

   
    //throw new Error('Metodo visitExpresionSentencia no implementado');--------------------------------------------------------
  }

  /**
   * @type {BaseVisitor['visitBloque']}
   */
  visitBloque(node) {
    node.dcls.forEach(dcl => dcl.accept(this));
    //throw new Error('Metodo visitBloque no implementado');
  }

  /**
   * @type {BaseVisitor['visitNumero']}
   */
  visitOperacionLogica(node) {
    console.log("Logica no hecho");
    
    //throw new Error('Metodo visitOperacionLogica no implementado');
  }

  /**
   * @type {BaseVisitor['visitSumaYResta']}
   */
  visitSumaYResta(node) {
    
    //throw new Error('Metodo visitSumaYResta no implementado');
  }

  /**
   * @type {BaseVisitor['visitMultiplicacionYDivision']}
   */
  visitMultiplicacionYDivision(node) {
    
    //throw new Error('Metodo visitMultiplicacionYDivision no implementado');
  }

  /**
   * @type {BaseVisitor['visitOperacionUnaria']}
   */
  visitOperacionUnaria(node) {
    
    //throw new Error('Metodo visitOperacionUnaria no implementado');
  }

  /**
   * @type {BaseVisitor['visitAgrupacion']}
   */
  visitAgrupacion(node) {
    
    //throw new Error('Metodo visitAgrupacion no implementado');
  }

  /**
   * @type {BaseVisitor['visitReferenciaVariable']}
   */
  visitReferenciaVariable(node) {
    

    //throw new Error('Metodo visitReferenciaVariable no implementado');
  }

  /**
   * @type {BaseVisitor['visitModIgualacion']}
   */
  visitModIgualacion(node) {
    console.log("No implementado ModIgualacion");
    //throw new Error('Metodo visitModIgualacion no implementado');
  }

  /**
   * @type {BaseVisitor['visitNegacion']}
   */
  visitNegacion(node) {
    console.log("no implementado Negacion");
    //throw new Error('Metodo visitNegacion no implementado');
  }

  /**
   * @type {BaseVisitor['visitIf']}
   */
  visitIf(node) {
    console.log("Visit IF");
    node.stmtIf.accept(this);
    node.stmtIfElse.forEach(dcl => dcl.accept(this));

    if(node.stmtElse){node.stmtElse.accept(this)}
    
    //throw new Error('Metodo visitIf no implementado');
  }

  /**
   * @type {BaseVisitor['visitElseIfExp']}
   */
  visitElseIfExp(node) {
    console.log("Arreglo else If");
    node.stmtElseIf.accept(this);
 
    //throw new Error('Metodo visitElseIfExp no implementado');
  }

  /**
   * @type {BaseVisitor['visitWhile']}
   */
  visitWhile(node) {

    node.stmt.accept(this);

    //throw new Error('Metodo visitWhile no implementado');
  }

  //! for
  /**
   * @type {BaseVisitor['visitFor']}
   */
  visitFor(node) {
    

    node.stmt.accept(this);

    //throw new Error('Metodo visitFor no implementado');
  }

  /**
   * @type {BaseVisitor['visitBreak']}
   */
  visitBreak(node) {
    console.log("Break");
    //throw new Error('Metodo visitBreak no implementado');
  }

  /**
   * @type {BaseVisitor['visitContinue']}
   */
  visitContinue(node) {
    console.log("Continue");
    

    //throw new Error('Metodo visitContinue no implementado');
  }

  /**
   * @type {BaseVisitor['visitReturn']}
   */
  visitReturn(node) {
    console.log(" Return");
    

    //throw new Error('Metodo visitReturn no implementado');
  }

  /**
   * @type {BaseVisitor['visitLlamada']}
   */
  visitLlamada(node) {
    console.log("Llamada de Funcion");
    
    //throw new Error('Metodo visitLlamada no implementado');
  }

  /**
   * @type {BaseVisitor['visitDeclaracioFuncion']}
   */
  visitDeclaracioFuncion(node) {
   
    //throw new Error('Metodo visitDeclaracioFuncion no implementado');
  }
  /**
   * @type {BaseVisitor['visitEnbebida']}
   */
  visitEnbebida(node) {
    

    //throw new Error('Metodo visitEnbebida no implementado');
  }


}
  