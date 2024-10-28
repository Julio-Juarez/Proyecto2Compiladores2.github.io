
import { registers as r, floatRegisters as f } from "./Risc/constantes.js";
import { BaseVisitor } from "../GeneradorDeArchivos/visitor.js";
import { Generador } from "./Risc/generador.js";
import { FrameVisitor } from "./frame.js";

export class CompilerVisitor extends BaseVisitor {
  constructor() {
    super();
    this.code = new Generador();
    this.continueLabel = null;
    this.breakLabel = null;

    //para funciones
    this.functionMetada={}

    this.insideFunction=false;
    this.frameDclIndex = 0;//que indice tiene el fren adentro de las variables locales
    this.returnLabel=null;// igual que el continuo

  }

  // int float boolean char
  /**
   * @type {BaseVisitor['visitTerminalesExp']}
   */
  visitTerminalesExp(node) {
    console.log("terminales no cadena");
    this.code.comment(`Primitivo Numericos o Booleanos: ${node.valor}`);
    this.code.pushConstant({ tipo: node.tipo, valor: node.valor });
    this.code.comment(`Fin Primitivo: ${node.valor}`);
  }

  //Cadena o String
  /**
   * @type {BaseVisitor['visitTerminalesExpCadena']}
   */
  visitTerminalesExpCadena(node) {
    console.log("Terminales cadena");
    this.code.comment(`Primitivo String: ${node.valor.join("")}`);
    this.code.pushConstant({ tipo: node.tipo, valor: node.valor.join("") });
    this.code.comment(`Fin Primitivo: ${node.valor.join("")}`);

    //throw new Error('Metodo visitTerminalesExpCadena no implementado');
  }

  /**
   * @type {BaseVisitor['visitDeclaracionVariable']}
   */
  visitDeclaracionVariable(node) {
    console.log("declaracion con valor");
    this.code.comment(`Declaracion de VAriable: ${node.id} `);
    
    node.exp.accept(this);

    if(this.insideFunction){
      const localObject = this.code.getFrameLocal(this.frameDclIndex);

      const valueObject=this.code.popObject(r.T0);

      this.code.addi(r.T1,r.FP,-localObject.offset*4);
      this.code.sw(r.T0,r.T1);


      localObject.tipo=valueObject.tipo;
      this.frameDclIndex++;

      return

    }
    
    
    this.code.tagObject(node.id);

    this.code.comment(`Fin Declaracion de Variable: ${node.id} `);

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
    this.code.comment(`Asignacion Variable: ${node.id}`);

    node.asig.accept(this);
    const valueObject = this.code.popObject(r.T0);
    const [offset, variableObject] = this.code.getObject(node.id);

    if (this.insideFunction) {
      this.code.addi(r.T1, r.FP, -variableObject.offset * 4); // ! REVISAR
      this.code.sw(r.T0, r.T1); // ! revisar
      return
    }




    this.code.addi(r.T1, r.SP, offset);
    this.code.sw(r.T0, r.T1);

    variableObject.tipo = valueObject.tipo;

    this.code.push(r.T0);
    this.code.pushObject(valueObject);

    this.code.comment(`Fin Asignacion Variable: ${node.id}`);

    //throw new Error('Metodo visitAsignacionValor no implementado');
  }

  /**
   * @type {BaseVisitor['visitPrint']}
   */
  visitPrint(node) {
    this.code.comment("Print");
    node.exp.accept(this);


    console.log(this.code.getTopObject());

    const isFloat = this.code.getTopObject().tipo == "float";
    const object = this.code.popObject(isFloat ? f.FA0 : r.A0);

    const tipoPrint = {
      int: () => this.code.printInt(),
      string: () => this.code.printString(),
      float: () => this.code.printFloat(),
      boolean:()=> this.code.printBooleano(),
      
    };
    //this.code.pop(r.A0);
    //this.code.printInt();
    tipoPrint[object.tipo]();
    this.code.comment(" Fin Print");

    //throw new Error('Metodo visitPrint no implementado');
  }

  /**
   * @type {BaseVisitor['visitExpresionSentencia']}
   */
  visitExpresionSentencia(node) {
    console.log("todo bien en exp sentencia");

    node.exp.accept(this);
    this.code.popObject(r.T0);
    console.log("fin exp sentencia");
    //throw new Error('Metodo visitExpresionSentencia no implementado');--------------------------------------------------------
  }

  /**
   * @type {BaseVisitor['visitBloque']}
   */
  visitBloque(node) {
    this.code.comment("Inicio de bloque");

    this.code.newScope();
    this.code.comment("ya incremente");

    node.dcls.forEach((d) => d.accept(this));

    this.code.comment("Reduciendo la pila");
    const bytesToRemove = this.code.endScope();
    console.log(bytesToRemove);

    if (bytesToRemove > 0) {
      this.code.addi(r.SP, r.SP, bytesToRemove);
    }

    this.code.comment("Fin de bloque");
    //throw new Error('Metodo visitBloque no implementado');
  }

  /**
   * @type {BaseVisitor['visitNumero']}
   */
  visitOperacionLogica(node) {
    console.log("Logica no hecho");
    if (node.op === "&&") {
      node.izq.accept(this); // izq
      this.code.popObject(r.T0); // izq

      const labelFalse = this.code.getLabel();
      const labelEnd = this.code.getLabel();

      this.code.beq(r.T0, r.ZERO, labelFalse); // if (!izq) goto labelFalse
      node.der.accept(this); // der
      this.code.popObject(r.T0); // der
      this.code.beq(r.T0, r.ZERO, labelFalse); // if (!der) goto labelFalse

      //Si Fuera Verdadero
      this.code.li(r.T0, 1);
      this.code.push(r.T0);
      this.code.j(labelEnd);
      this.code.addLabel(labelFalse);
      this.code.li(r.T0, 0);
      this.code.push(r.T0);

      this.code.addLabel(labelEnd);
      this.code.pushObject({ tipo: "boolean", length: 4 });
      return;
    }

    if (node.op === "||") {
      node.izq.accept(this); // izq
      this.code.popObject(r.T0); // izq

      const labelTrue = this.code.getLabel();
      const labelEnd = this.code.getLabel();

      this.code.bne(r.T0, r.ZERO, labelTrue); // if (izq) goto labelTrue
      node.der.accept(this); // der
      this.code.popObject(r.T0); // der
      this.code.bne(r.T0, r.ZERO, labelTrue); // if (der) goto labelTrue

      //si Fuera Verdadero
      this.code.li(r.T0, 0);
      this.code.push(r.T0);

      this.code.j(labelEnd);
      this.code.addLabel(labelTrue);
      this.code.li(r.T0, 1);
      this.code.push(r.T0);

      this.code.addLabel(labelEnd);
      this.code.pushObject({ tipo: "boolean", length: 4 });
      return;
    }
    // ! REparar------------------ ------------------------------------------------------
    this.code.comment(`Operacion Boolean: ${node.op}`);
    node.izq.accept(this);
    node.der.accept(this);

    const isDerFloat = this.code.getTopObject().tipo === "float";
    this.code.popObject(isDerFloat ? f.FT0 : r.T0); // der

    const isIzqFloat = this.code.getTopObject().tipo === "float";
    this.code.popObject(isIzqFloat ? f.FT1 : r.T1); // izq

    if (isIzqFloat || isDerFloat) {
      //convertir enteros a float
      if (!isIzqFloat) this.code.fcvtsw(f.FT1, r.T1);
      if (!isDerFloat) this.code.fcvtsw(f.FT0, r.T0);

      /*
      switch (node.op) {
        case "*":
          this.code.fmul(f.FT0, f.FT1, f.FT0);
          break;
        case "/":
          this.code.fdiv(f.FT0, f.FT1, f.FT0);
          break;
      }
      */
      switch (node.op) {
        case "==":
          this.code.callBuiltin('equal');
          break;
        case "!=":
          this.code.callBuiltin('notEqualInt');
          break;
        case "<":
          this.code.callBuiltin('lessThanInt');
          break;
        case "<=":
          this.code.callBuiltin('lessOrEqual');
          break;
        case ">":
          this.code.callBuiltin('greaterThanInt');
          break;
        case ">=":
          this.code.callBuiltin('greaterOrEqualInt');
          break;
      }

      this.code.pushFloat(f.FT0);
      this.code.pushObject({ tipo: "float", length: 4 });
      return;
    }

    switch (node.op) {
      case "==":
        this.code.callBuiltin('equal');
        break;
      case "!=":
        this.code.callBuiltin('notEqualInt');
        break;
      case "<":
        console.log("Esta entrando al menor");
        this.code.callBuiltin('lessThanInt');
        break;
      case "<=":
        this.code.callBuiltin('lessOrEqual');
        break;
      case ">":
        this.code.callBuiltin('greaterThanInt');
        break;
      case ">=":
        this.code.callBuiltin('greaterOrEqualInt');
        break;
    }
    this.code.pushObject({ tipo: "boolean", length: 4 });

    //throw new Error('Metodo visitOperacionLogica no implementado');
  }

  /**
   * @type {BaseVisitor['visitSumaYResta']}
   */
  visitSumaYResta(node) {
    this.code.comment(`Operacion: ${node.op}`);
    console.log("Entro a Suma y Resta");
    node.izq.accept(this); //izq
    node.der.accept(this); //se apila en de la derecha

    const isDerFloat = this.code.getTopObject().tipo === "float";
    const der = this.code.popObject(isDerFloat ? f.FT0 : r.T0); // der

    const isIzqFloat = this.code.getTopObject().tipo === "float";
    const izq = this.code.popObject(isIzqFloat ? f.FT1 : r.T1); // izq

    //const der = this.code.popObject(r.T0); // der
    //const izq = this.code.popObject(r.T1); //

    if (izq.tipo === "string" && der.tipo === "string") {
      this.code.add(r.A0, r.ZERO, r.T1);
      this.code.add(r.A1, r.ZERO, r.T0);
      this.code.callBuiltin("concatString");
      this.code.pushObject({ tipo: "string", length: 4 });
      return;
    }

    if (isIzqFloat || isDerFloat) {
      //convertir enteros a float
      if (!isIzqFloat) this.code.fcvtsw(f.FT1, r.T1);
      if (!isDerFloat) this.code.fcvtsw(f.FT0, r.T0);

      switch (node.op) {
        case "+":
          this.code.fadd(f.FT0, f.FT1, f.FT0);
          break;
        case "-":
          this.code.fsub(f.FT0, f.FT1, f.FT0);
          break;
        case "*":
          this.code.fmul(f.FT0, f.FT1, f.FT0);
          break;
        case "/":
          this.code.fdiv(f.FT0, f.FT1, f.FT0);
          break;
      }

      this.code.pushFloat(f.FT0);
      console.log("esta entrando en float");
      this.code.pushObject({ tipo: "float", length: 4 });
      return;
    }

    switch (node.op) {
      case "+":
        console.log("Entro a Suma");
        this.code.add(r.T0, r.T0, r.T1);
        this.code.push(r.T0);
        break;
      case "-":
        console.log("entro a REsta");
        this.code.sub(r.T0, r.T1, r.T0);
        this.code.push(r.T0);
        break;
    }
    this.code.pushObject({ tipo: "int", length: 4 });
    //throw new Error('Metodo visitSumaYResta no implementado');
  }

  /**
   * @type {BaseVisitor['visitMultiplicacionYDivision']}
   */
  visitMultiplicacionYDivision(node) {
    this.code.comment(`Operacion: ${node.op}`);
    node.izq.accept(this);
    node.der.accept(this);

    const isDerFloat = this.code.getTopObject().tipo === "float";
    this.code.popObject(isDerFloat ? f.FT0 : r.T0); // der

    const isIzqFloat = this.code.getTopObject().tipo === "float";
    this.code.popObject(isIzqFloat ? f.FT1 : r.T1); // izq

    if (isIzqFloat || isDerFloat) {
      //convertir enteros a float
      if (!isIzqFloat) this.code.fcvtsw(f.FT1, r.T1);
      if (!isDerFloat) this.code.fcvtsw(f.FT0, r.T0);

      switch (node.op) {
        case "*":
          this.code.fmul(f.FT0, f.FT1, f.FT0);
          break;
        case "/":
          this.code.fdiv(f.FT0, f.FT1, f.FT0);
          break;
      }

      this.code.pushFloat(f.FT0);
      this.code.pushObject({ tipo: "float", length: 4 });
      return;
    }

    switch (node.op) {
      case "*":
        this.code.mul(r.T0, r.T0, r.T1);
        this.code.push(r.T0);
        break;
      case "/":
        this.code.div(r.T0, r.T1, r.T0);
        this.code.push(r.T0);
        break;
      case "%":
        this.code.rem(r.T0, r.T1, r.T0);
        this.code.push(r.T0);
        break;
    }
    this.code.pushObject({ tipo: "int", length: 4 });
    //throw new Error('Metodo visitMultiplicacionYDivision no implementado');
  }

  /**
   * @type {BaseVisitor['visitOperacionUnaria']}
   */
  visitOperacionUnaria(node) {
    node.exp.accept(this);

    this.code.popObject(r.T0);

    switch (node.op) {
      case "-":
        this.code.li(r.T1, 0);
        this.code.sub(r.T0, r.T1, r.T0);
        this.code.push(r.T0);
        this.code.pushObject({ tipo: "int", length: 4 });
        break;
    }
    //throw new Error('Metodo visitOperacionUnaria no implementado');
  }

  /**
   * @type {BaseVisitor['visitAgrupacion']}
   */
  visitAgrupacion(node) {
    return node.exp.accept(this);
    //throw new Error('Metodo visitAgrupacion no implementado');
  }

  /**
   * @type {BaseVisitor['visitReferenciaVariable']}
   */
  visitReferenciaVariable(node) {
    this.code.comment(
      `Referencia a variable ${node.id}: ${JSON.stringify(
        this.code.objectStack
      )}`
    );

    const [offset, variableObject] = this.code.getObject(node.id);
    
    if (this.insideFunction) {
      this.code.addi(r.T1, r.FP, -variableObject.offset * 4);
      this.code.lw(r.T0, r.T1);
      this.code.push(r.T0);
      this.code.pushObject({ ...variableObject, id: undefined });
      return
  }
    
    this.code.addi(r.T0, r.SP, offset);
    this.code.lw(r.T1, r.T0);
    this.code.push(r.T1);
    this.code.pushObject({ ...variableObject, id: undefined });

    // this.code.comment(`Fin Referencia Variable: ${node.id}`);
    this.code.comment(
      `Fin referencia de variable ${node.id}: ${JSON.stringify(
        this.code.objectStack
      )}`
    );

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
    this.code.comment("Inicio IF");
    this.code.comment("Inicio Condicion");
    node.cond.accept(this);
    this.code.popObject(r.T0);
    this.code.comment("fin condicion");

    const hasElse = !!node.stmtElse;

    if (hasElse) {
      let elseLabel = this.code.getLabel();
      const endIfLabel = this.code.getLabel();

      this.code.beq(r.T0, r.ZERO, elseLabel);
      this.code.comment("If Verdadero");
      node.stmtIf.accept(this);
      this.code.j(endIfLabel); //salto al fin del if estructural

      node.stmtIfElse.forEach((dcl) => {
        //--------------------------------
        const aux = dcl.accept(this);
        this.code.addLabel(elseLabel);
        this.code.comment("Inicio Condicion Else if"); //------------
        aux.cond.accept(this);
        this.code.popObject(r.T0);
        this.code.comment("fin condicion"); //-------------------
        const elseIfFin = this.code.getLabel();

        this.code.beq(r.T0, r.ZERO, elseIfFin);
        this.code.comment("If verdadero");
        aux.stmtElseIf.accept(this);
        this.code.j(endIfLabel); //salto al fin del if estructural
        elseLabel = elseIfFin;
      }); //-------------------------------------------Fin del For
      this.code.addLabel(elseLabel); //etiqueta else
      this.code.comment("Rama FAlse");
      node.stmtElse.accept(this);
      this.code.addLabel(endIfLabel);
    } else {
      const endIfLabel = this.code.getLabel();
      this.code.beq(r.T0, r.ZERO, endIfLabel);
      this.code.comment("If verdadero");
      node.stmtIf.accept(this);
      this.code.addLabel(endIfLabel);
    }

    this.code.comment("Fin IF");
    //throw new Error('Metodo visitIf no implementado');
  }

  /**
   * @type {BaseVisitor['visitElseIfExp']}
   */
  visitElseIfExp(node) {
    console.log("Arreglo else If");
    return node;

    //throw new Error('Metodo visitElseIfExp no implementado');
  }

  /**
   * @type {BaseVisitor['visitWhile']}
   */
  visitWhile(node) {


    const startWhileLabel = this.code.getLabel(); // crea la etiqueta de inicio de while
    
    const prevContinueLabel = this.continueLabel;
    this.continueLabel = startWhileLabel;

    const endWhileLabel = this.code.getLabel();
    const prevBreakLabel = this.breakLabel;
    this.breakLabel = endWhileLabel;

    this.code.addLabel(startWhileLabel); // agrega la etiqueta de while
    this.code.comment("Condicion While");
    node.cond.accept(this);
    this.code.popObject(r.T0); //evalua la condicion del while
    this.code.comment("Fin de condicion While");
    this.code.beq(r.T0, r.ZERO, endWhileLabel);//si la condicion es falsa que se dirija a la etiqueta de fin del while
    this.code.comment("Cuerpo del while");
    node.stmt.accept(this); //traducir sentencias 
    this.code.j(startWhileLabel);// salto a la etiqueta de inicio
    this.code.addLabel(endWhileLabel);//agrega la etiqueta del fin del while

    this.continueLabel = prevContinueLabel;
    this.breakLabel = prevBreakLabel;
    //throw new Error('Metodo visitWhile no implementado');
  }

  //! for
  /**
   * @type {BaseVisitor['visitFor']}
   */
  visitFor(node) {
    
    //node.cond
    //node.inc
    //node.stmt

    this.code.comment("For");

    const startForLabel = this.code.getLabel();

    const endForLabel = this.code.getLabel();
    const prevBreakLabel = this.breakLabel;
    this.breakLabel = endForLabel;

    const incrementLabel = this.code.getLabel();
    const prevContinueLabel = this.continueLabel;
    this.continueLabel = incrementLabel;

    this.code.newScope();//nuevo entorno

    node.init.accept(this);

    this.code.addLabel(startForLabel);
    this.code.comment("Condicion");
    node.cond.accept(this);
    this.code.popObject(r.T0);
    this.code.comment("Fin de condicion");
    this.code.beq(r.T0, r.ZERO, endForLabel);

    this.code.comment("Cuerpo del for");
    node.stmt.accept(this);

    this.code.addLabel(incrementLabel);
    node.inc.accept(this);
    this.code.popObject(r.T0);
    this.code.j(startForLabel);

    this.code.addLabel(endForLabel);

    this.code.comment("Reduciendo la pila");
    const bytesToRemove = this.code.endScope();

    if (bytesToRemove > 0) {
      this.code.addi(r.SP, r.SP, bytesToRemove);
    }

    this.continueLabel = prevContinueLabel;
    this.breakLabel = prevBreakLabel;

    this.code.comment("Fin de For");


    //throw new Error('Metodo visitFor no implementado');
  }

  /**
   * @type {BaseVisitor['visitBreak']}
   */
  visitBreak(node) {
    console.log("Break");
    this.code.j(this.breakLabel);
    //throw new Error('Metodo visitBreak no implementado');
  }

  /**
   * @type {BaseVisitor['visitContinue']}
   */
  visitContinue(node) {
    console.log("Continue");
    this.code.j(this.continueLabel);

    //throw new Error('Metodo visitContinue no implementado');
  }

  /**
   * @type {BaseVisitor['visitReturn']}
   */
  visitReturn(node) {
    console.log(" Return");
    this.code.comment('Inicio Return');

        if (node.exp) {
            node.exp.accept(this);
            this.code.popObject(r.A0);

            const frameSize = this.functionMetada[this.insideFunction].frameSize
            const returnOffest = frameSize - 1;
            this.code.addi(r.T0, r.FP, -returnOffest * 4)
            this.code.sw(r.A0, r.T0)
        }

        this.code.j(this.returnLabel);
        this.code.comment('Final Return');

    

    //throw new Error('Metodo visitReturn no implementado');
  }

  /**
   * @type {BaseVisitor['visitLlamada']}
   */
  visitLlamada(node) {
    console.log("Llamada de Funcion");
    //if (!(node.callee instanceof ReferenciaVariable)) return;

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(node.callee.id);
    console.log(node.callee);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    const nombreFuncion = node.callee.id;

    this.code.comment(`Llamada a funcion ${nombreFuncion}`);

    const etiquetaRetornoLlamada = this.code.getLabel();

   
    // 1. Guardar los argumentos
    node.args.forEach((arg, index) => {
      arg.accept(this);
      this.code.popObject(r.T0);
      this.code.addi(r.T1, r.SP, -4 * (3 + index)); 
      this.code.sw(r.T0, r.T1);
    });

    // Calcular la dirección del nuevo FP en T1
    this.code.addi(r.T1, r.SP, -4);

    // Guardar direccion de retorno
    this.code.la(r.T0, etiquetaRetornoLlamada);
    this.code.push(r.T0);

    // Guardar el FP
    this.code.push(r.FP);
    this.code.addi(r.FP, r.T1, 0);

  
    this.code.addi(r.SP, r.SP, -(node.args.length * 4)); 

    // Saltar a la función
    this.code.j(nombreFuncion);
    this.code.addLabel(etiquetaRetornoLlamada);

    // Recuperar el valor de retorno
    const frameSize = this.functionMetada[nombreFuncion].frameSize;
    const returnSize = frameSize - 1;
    this.code.addi(r.T0, r.FP, -returnSize * 4);
    this.code.lw(r.A0, r.T0);

    // Regresar el FP al contexto de ejecución anterior
    this.code.addi(r.T0, r.FP, -4);
    this.code.lw(r.FP, r.T0);

    // Regresar mi SP al contexto de ejecución anterior
    this.code.addi(r.SP, r.SP, (frameSize - 1) * 4);

    this.code.push(r.A0);
    this.code.pushObject({
      tipo: this.functionMetada[nombreFuncion].returnType,
      length: 4,
    });

    this.code.comment(`Fin de llamada a funcion ${nombreFuncion}`);
    
    //throw new Error('Metodo visitLlamada no implementado');
  }

  /**
   * @type {BaseVisitor['visitDeclaracioFuncion']}
   */
  visitDeclaracioFuncion(node) {
    console.log("Declaracion de Funcion");

    const baseSize = 2;

    const paramSize = node.params.length; //saber cuantos parametros tiene la funcion
    const frameVisitor = new FrameVisitor(baseSize + paramSize);
    node.bloque.accept(frameVisitor);

    const localFrame = frameVisitor.frame;
    const localSize = localFrame.length;

    const returnSize = 1;

    const totalSize = baseSize + paramSize + localSize + returnSize;
    this.functionMetada[node.id] = {
      frameSize: totalSize,
      returnType: node.tipo,
    };
    const instruccionesDeMain = this.code.instrucciones;
    const instruccionesDeDeclaracionDeFunciones = [];
    this.code.instrucciones = instruccionesDeDeclaracionDeFunciones;

    node.params.forEach((param, index) => {
      this.code.pushObject({
        id: param.id,
        tipo: param.tipo,
        length: 4,
        offset: baseSize + index,
      });
    });

    localFrame.forEach(variableLocal => {
      this.code.pushObject({
        ...variableLocal,
        //id: variableLocal.id,
        //tipo:variableLocal.tipo,
        length: 4,
        tipo: "local",
        //offset: baseSize+paramSize+variableLocal.offset
      });
    });

    this.insideFunction = node.id;
    this.frameDclIndex = 0;
    this.returnLabel = this.code.getLabel();

    this.code.comment(`Declaracion de funcion ${node.id}`);
    this.code.addLabel(node.id);

    node.bloque.accept(this);

    this.code.addLabel(this.returnLabel);

    this.code.add(r.T0, r.ZERO, r.FP);
    this.code.lw(r.RA, r.T0);
    this.code.jalr(r.ZERO, r.RA, 0);
    this.code.comment(`Fin de declaracion de funcion ${node.id}`);

    // Limpiar metadatos
    for (let i = 0; i < paramSize + localSize; i++) {
      this.code.objectStack.pop(); 
    }

    this.code.instrucciones = instruccionesDeMain;

    instruccionesDeDeclaracionDeFunciones.forEach((instruccion) => {
      this.code.instruccionesDeFunciones.push(instruccion);
    });

    //throw new Error('Metodo visitDeclaracioFuncion no implementado');
  }
  /**
   * @type {BaseVisitor['visitEnbebida']}
   */
  visitEnbebida(node) {
    const nombre = node.id;
    console.log("+++++++++++++++++++++++++");
    //console.log(node.exp);
    console.log("+++++++++++++++++++++++++");
    //const expresionEntrada = node.exp.accept(this);

    // ---- LLamadas a funcion embebidas
    const embebidas = {
      parseInt: () => {
        node.exp.accept(this);
        this.code.popObject(r.A0);
        this.code.callBuiltin("parseInt");
        this.code.pushObject({ tipo: "int", length: 4 });
      },
      parsefloat: () => {
        console.log("hola");
        node.exp.accept(this);
        this.code.popObject(r.A0);
        this.code.callBuiltin("parseFloat");
        this.code.pushObject({ tipo: "float", length: 4 });
      },
    };

    if (embebidas[nombre]) {
      console.log("hola2");
      embebidas[nombre]();
      return;
    }

    //throw new Error('Metodo visitEnbebida no implementado');
  }


}
  