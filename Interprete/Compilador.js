
import { registers as r } from "./Risc/constantes.js";
import { BaseVisitor } from "../GeneradorDeArchivos/visitor.js";
import { Generador } from "./Risc/generador.js";

export class CompilerVisitor extends BaseVisitor{
    constructor() {
      super();
      this.code =new Generador();
  
      
  
     
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
        this.code.comment(`Primitivo String: ${node.valor.join('')}`);
        this.code.pushConstant({ tipo:node.tipo, valor: node.valor.join('')});
        this.code.comment(`Fin Primitivo: ${node.valor.join('')}`);

      //throw new Error('Metodo visitTerminalesExpCadena no implementado');
    }
  
    /**
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        console.log("declaracion con valor");
        this.code.comment(`Declaracion de VAriable: ${node.id} `);
        node.exp.accept(this);
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
        this.code.comment('Print');
        node.exp.accept(this);
    
        const object = this.code.popObject(r.A0);
    
        const tipoPrint={
            'int':() => this.code.printInt(),
            'string': () =>this.code.printString()
        }
        //this.code.pop(r.A0);
        //this.code.printInt();
        tipoPrint[object.tipo]();
        this.code.comment(' Fin Print');
  
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
        this.code.comment('Inicio de bloque');

        this.code.newScope();
        this.code.comment('ya incremente');

        node.dcls.forEach(d => d.accept(this));

        this.code.comment('Reduciendo la pila');
        const bytesToRemove = this.code.endScope();
        console.log(bytesToRemove);

        if (bytesToRemove > 0) {
            this.code.addi(r.SP, r.SP, bytesToRemove);
        }

        this.code.comment('Fin de bloque');
      //throw new Error('Metodo visitBloque no implementado');
    }
  
    /**
     * @type {BaseVisitor['visitNumero']}
     */
    visitOperacionLogica(node) {
      console.log("Logica no hecho");
      if (node.op === '&&') {
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
        this.code.pushObject({ tipo: 'boolean', length: 4 });
        return
    }

    if (node.op === '||') {
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
        this.code.pushObject({ tipo: 'boolean', length: 4 });
        return
    }


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
    
        const der = this.code.popObject(r.T0); // der
        const izq = this.code.popObject(r.T1); // 
        

        if (izq.tipo === 'string' && der.tipo === 'string') {
          this.code.add(r.A0, r.ZERO, r.T1);
          this.code.add(r.A1, r.ZERO, r.T0);
          this.code.callBuiltin('concatString');
          this.code.pushObject({ tipo: 'string', length: 4 });
          return;
      }
    
        switch(node.op){
            case '+':
                console.log("Entro a Suma");
                this.code.add(r.T0,r.T0,r.T1);
                this.code.push(r.T0);
                break;
            case '-':
                console.log("entro a REsta");
                this.code.sub(r.T0,r.T1,r.T0);
                this.code.push(r.T0);
                break;
        }
        this.code.pushObject({tipo:'int', length:4});
      //throw new Error('Metodo visitSumaYResta no implementado');
    }
  
    /**
     * @type {BaseVisitor['visitMultiplicacionYDivision']}
     */
    visitMultiplicacionYDivision(node) {
        this.code.comment(`Operacion: ${node.op}`);
        node.izq.accept(this);
        node.der.accept(this);
    
        this.code.popObject(r.T0);
        this.code.popObject(r.T1);
        switch(node.op){
            case '*':
                this.code.mul(r.T0, r.T0, r.T1);
                this.code.push(r.T0);
                break;
            case '/':
                this.code.div(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;
            case '%':
                this.code.rem(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;
        }
        this.code.pushObject({tipo:'int', length:4});
      //throw new Error('Metodo visitMultiplicacionYDivision no implementado');
    }
  
    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        node.exp.accept(this);

        this.code.popObject(r.T0);

        switch (node.op) {
            case '-':
                this.code.li(r.T1, 0);
                this.code.sub(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                this.code.pushObject({ tipo: 'int', length: 4 });
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
        this.code.comment(`Referencia a variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);


        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T0, r.SP, offset);
        this.code.lw(r.T1, r.T0);
        this.code.push(r.T1);
        this.code.pushObject({ ...variableObject, id: undefined });

        // this.code.comment(`Fin Referencia Variable: ${node.id}`);
        this.code.comment(`Fin referencia de variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
  
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

      const hasElse = !!node.stmtElse

      if(hasElse){
        let elseLabel = this.code.getLabel();
        const endIfLabel = this.code.getLabel();

        this.code.beq(r.T0,r.ZERO,elseLabel);
        this.code.comment("If Verdadero");
        node.stmtIf.accept(this);
        this.code.j(endIfLabel);//salto al fin del if estructural

        node.stmtIfElse.forEach(dcl => {//--------------------------------
          const aux= dcl.accept(this);
          this.code.addLabel(elseLabel);
          this.code.comment("Inicio Condicion Else if");//------------
          aux.cond.accept(this);
          this.code.popObject(r.T0);
          this.code.comment("fin condicion");//-------------------
          const elseIfFin = this.code.getLabel();
          
          this.code.beq(r.T0,r.ZERO,elseIfFin);
          this.code.comment("If verdadero");
          aux.stmtElseIf.accept(this);
          this.code.j(endIfLabel);//salto al fin del if estructural
          elseLabel=elseIfFin;
        });//-------------------------------------------Fin del For
        this.code.addLabel(elseLabel); //etiqueta else 
        this.code.comment("Rama FAlse");
        node.stmtElse.accept(this);
        this.code.addLabel(endIfLabel);
      }else{
        const endIfLabel=this.code.getLabel();
        this.code.beq(r.T0,r.ZERO,endIfLabel);
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
      const entornoConElQueEmpezo = this.EntornoActual;
      /*console.log("------------------aqui empieza el while-----------");
     
      console.log(node.cond.accept(this).valor +"-------------------condicion");
  
      console.log(node.stmt.accept(this));
      console.log(node.stmt.accept(this));
      console.log(node.stmt.accept(this));
      console.log(node.stmt.accept(this));
  
      console.log(node.cond.accept(this).valor+"-------------------condicion");
      console.log("------------------aqui termina el while-----------");
  
  */
          try {
              while (node.cond.accept(this).valor) {
                  node.stmt.accept(this);
              }
              this.EntornoActual=entornoConElQueEmpezo;
          } catch (error) {
              this.EntornoActual = entornoConElQueEmpezo;
  
              if (error instanceof BreakException) {
                  console.log('break');
                  return
              }
  
              if (error instanceof ContinueException) {
                  return this.visitWhile(node);
              }
  
              throw error;
              
  
          }
      //throw new Error('Metodo visitWhile no implementado');
    }
  
    /**
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node) {
  
      // this.prevContinue = node.inc;
      const incrementoAnterior = this.prevContinue;
      this.prevContinue = node.inc;
  
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
  
      forTraducido.accept(this);
  
      this.prevContinue = incrementoAnterior;
  
      
  
      //throw new Error('Metodo visitFor no implementado');
    }
  
    /**
     * @type {BaseVisitor['visitBreak']}
     */
    visitBreak(node) {
      console.log("hola break********************************************");
      throw new BreakException();
       //throw new Error('Metodo visitBreak no implementado');
    }
  
  
    /**
     * @type {BaseVisitor['visitContinue']}
     */
  visitContinue(node) {
      if (this.prevContinue) {
          this.prevContinue.accept(this);
      }
  
      throw new ContinueException();
      //throw new Error('Metodo visitContinue no implementado');
  }
  
  
  /**
     * @type {BaseVisitor['visitReturn']}
     */
  visitReturn(node) {
    console.log("Hola Que hace Return");
      let valor = null;
      console.log(node.exp);
          if (node.exp) {
            console.log("Entro al if");
              valor = node.exp.accept(this);
          }
          throw new ReturnException(valor);
  
      //throw new Error('Metodo visitReturn no implementado');
  }
  
  /**
     * @type {BaseVisitor['visitLlamada']}
     */
  visitLlamada(node) {
    console.log("Entre a la llamada de funcion");
    const funcion = node.callee.accept(this);//nombre
    console.log(funcion);
  
    const argumentos = node.args.map(arg =>arg.accept(this));
    
    console.log("---------------------------------");
    console.log(argumentos);
    console.log("---------------------------------");
  
    if(!(funcion.valor instanceof Invocable)){//si es una instancia de algo invocable
      throw new Error('No es invocable');
  
    }
  
    if(funcion.valor.aridad() != argumentos.length){// si no es igual la cantidad de argumentos a la cantidad que se esta proveellendo
      throw new Error('Aridad incorrecta');
    }
  
    //console.log(funcion.valor.invocar(this,argumentos));
    return funcion.valor.invocar(this,argumentos);
  
  
  
    //throw new Error('Metodo visitLlamada no implementado');
  }
  
  
   /**
     * @type {BaseVisitor['visitDeclaracioFuncion']}
     */
   visitDeclaracioFuncion(node) {
    console.log(node);
    this.ingresoTabla(node.id, "Funcion", node.tipo, this.EntornoActual.nombreEntorno, node.location.start.line, node.location.start.column);
  
    const funcion = new FuncionForanea(node, this.EntornoActual);
    this.EntornoActual.setFuncion(node.tipo,node.id,funcion)
    //console.log("22222222222222222222222222");
    //console.log(funcion);
    
  
    //throw new Error('Metodo visitDeclaracioFuncion no implementado');
  }
  /**
     * @type {BaseVisitor['visitEnbebida']}
     */
  visitEnbebida(node) {
    const nombre=node.id;
    const expresionEntrada=node.exp.accept(this);
  
    console.log(nombre);
  
    let valorConvertido;
    console.log(expresionEntrada);
    if (nombre === "parseInt") {
      console.log("Es parseInt");
      
  
      if (expresionEntrada.tipo === "string") {
          console.log("El tipo es una cadena.");
          valorConvertido = parseInt(expresionEntrada.valor, 10);
      } else if (expresionEntrada.tipo === "int") {
          console.log("El tipo es un entero.");
          valorConvertido = expresionEntrada.valor; // No es necesario convertir, ya es un entero
      } else if (expresionEntrada.tipo === "char") {
          console.log("El tipo es un carácter.");
          valorConvertido = expresionEntrada.valor.charCodeAt(0); // Convertir el carácter a su código ASCII
      } else if (expresionEntrada.tipo === "boolean") {
          console.log("El tipo es un booleano.");
          valorConvertido = expresionEntrada.valor ? 1 : 0; // Convertir true/false a 1/0
      } else if (expresionEntrada.tipo === "float") {
          console.log("El tipo es un número flotante.");
          valorConvertido = Math.floor(expresionEntrada.valor); // Convertir el float a int (redondeo hacia abajo)
      } else {
          console.log("Tipo no reconocido.");
          return;
      }
  
      console.log({ tipo: "int", valor: valorConvertido });
      return { tipo: "int", valor: valorConvertido };
  
  } else if (nombre === "parsefloat") {
      console.log("Es parseFloat");
      if (expresionEntrada.tipo === "string") {
        console.log("El tipo es una cadena.");
        valorConvertido = parseFloat(expresionEntrada.valor); // Convertir cadena a float
    } else if (expresionEntrada.tipo === "int") {
        console.log("El tipo es un entero.");
        valorConvertido = parseFloat(expresionEntrada.valor); // Convertir entero a float
    } else if (expresionEntrada.tipo === "char") {
        console.log("El tipo es un carácter.");
        valorConvertido = expresionEntrada.valor.charCodeAt(0); // Obtener código ASCII del carácter
        valorConvertido = parseFloat(valorConvertido); // Convertir código ASCII a float
    } else if (expresionEntrada.tipo === "boolean") {
        console.log("El tipo es un booleano.");
        valorConvertido = expresionEntrada.valor ? 1.0 : 0.0; // Convertir booleano a float (1.0 o 0.0)
    } else if (expresionEntrada.tipo === "float") {
        console.log("El tipo es un número flotante.");
        valorConvertido = expresionEntrada.valor; // Ya es un float
    } else {
        console.log("Tipo no reconocido.");
        return;
    }
  
    return { tipo: "float", valor: valorConvertido };
      
  
  } else if (nombre === "toString") {
      console.log("Es toString");
      if (expresionEntrada.tipo === "string") {
        console.log("El tipo es una cadena.");
        valorConvertido = expresionEntrada.valor; // Ya es una cadena
    } else if (expresionEntrada.tipo === "int") {
        console.log("El tipo es un entero.");
        valorConvertido = expresionEntrada.valor.toString(); // Convertir entero a cadena
    } else if (expresionEntrada.tipo === "char") {
        console.log("El tipo es un carácter.");
        valorConvertido = expresionEntrada.valor.toString(); // Convertir carácter a cadena (ya es una cadena)
    } else if (expresionEntrada.tipo === "boolean") {
        console.log("El tipo es un booleano.");
        valorConvertido = expresionEntrada.valor.toString(); // Convertir booleano a cadena ("true" o "false")
    } else if (expresionEntrada.tipo === "float") {
        console.log("El tipo es un número flotante.");
        valorConvertido = expresionEntrada.valor.toString(); // Convertir flotante a cadena
    } else {
        console.log("Tipo no reconocido.");
        return;
    }
  
    return { tipo: "string", valor: valorConvertido };
      
  
  } else if (nombre === "toLowerCase") {
      console.log("Es toLowerCase");
      if (expresionEntrada.tipo === "string") {
        console.log("El tipo es una cadena.");
        return { tipo: "string", valor: expresionEntrada.valor.toLowerCase() };
    } else {
        console.log("El tipo no es una cadena, no se puede convertir a minúsculas.");
        return;
    }
  
  } else if (nombre === "toUpperCase") {
      console.log("Es toUpperCase");
      if (expresionEntrada.tipo === "string") {
        console.log("El tipo es una cadena.");
        console.log(expresionEntrada.valor);
        return { tipo: "string", valor: expresionEntrada.valor.toUpperCase() };
    } else {
        console.log("El tipo no es una cadena, no se puede convertir a mayúsculas.");
        return;
    }
  
  } else if (nombre === "typeof") {
      console.log("Es typeof");
      if (expresionEntrada.tipo === "string") {
        console.log("El tipo es una cadena.");
        valorConvertido = expresionEntrada.tipo;
    } else if (expresionEntrada.tipo === "int") {
        console.log("El tipo es un entero.");
        valorConvertido = expresionEntrada.tipo;
    } else if (expresionEntrada.tipo === "char") {
        console.log("El tipo es un carácter.");
        valorConvertido = expresionEntrada.tipo;
    } else if (expresionEntrada.tipo === "boolean") {
        console.log("El tipo es un booleano.");
        valorConvertido = expresionEntrada.tipo;
    } else if (expresionEntrada.tipo === "float") {
        console.log("El tipo es un número flotante.");
        valorConvertido = expresionEntrada.tipo;
    } else {
        console.log("Tipo no reconocido.");
        return;
    }
  
    return { tipo: "string", valor: valorConvertido };
  
  } else {
      console.log("No coincide con ninguna cadena");
  }
  
    //throw new Error('Metodo visitEnbebida no implementado');
  }
  
  
  }
  