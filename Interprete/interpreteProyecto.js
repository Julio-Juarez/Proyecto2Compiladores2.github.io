import { Entorno } from "./entorno.js";
import { BaseVisitor } from "../GeneradorDeArchivos/visitor.js";
import nodos, { Expresion } from '../GeneradorDeArchivos/nodos.js';
import { BreakException,ContinueException,ReturnException } from "./Trasferencia.js";
import { Invocable } from "./invocable.js";
import { enbebidas } from "./FuncionesEnbebidas.js";
import { FuncionForanea } from "./FuncionesForaneas.js";

export class InterpreterVisitorProyecto extends BaseVisitor {
  constructor() {
    super();
    this.EntornoActual = new Entorno();
    this.SalidaInterprete = "";
    this.tabla=[];

    // funciones enbebidas

    /*Object.entries(enbebidas).forEach(([nombre,tipo,parametro,funcion])=>{//comvierte un objeto en un arreglo
      this.EntornoActual.setFuncion(tipo,nombre,funcion);
    })
      */

    /**
    * @type {Expresion | null}
    */
    this.prevContinue = null;
  }

  Interpretar(nodo) {
    return nodo.accept(this);
  }

  //---------------------------------------------------------
  ingresoTabla(id, tiposimbolo, tipoDato, ambito, linea, columna) {
   
    // Crear el objeto que representa la entrada
    const entrada = {
        id: id.trim(),
        tipo: tiposimbolo.trim(),
        tipoDato: tipoDato.trim(),
        ambito: ambito.trim(),
        linea: linea,
        columna: columna
    };

    // Agregar la entrada al arreglo tabla
    this.tabla.push(entrada);
    console.log("Entrada agregada:", entrada);
    //this.generarTablaHTML(); // Actualizar la tabla en el HTML
}



  //----------------------------------------------------------




  // int float boolean char
  /**
   * @type {BaseVisitor['visitTerminalesExp']}
   */
  visitTerminalesExp(node) {
    const terminal = {
      tipo: node.tipo,
      valor: node.valor,
    };
    //this.SalidaInterprete+=terminal
    return terminal;
    //throw new Error('Metodo visitTerminalesExp no implementado');
  }
  //Cadena o String
  /**
   * @type {BaseVisitor['visitTerminalesExpCadena']}
   */
  visitTerminalesExpCadena(node) {
    let cadena = "";
    const caracteres = node.valor;
    for (let char of caracteres) {
      console.log(char);
      cadena = cadena + char;
    }
    const terminal = {
      tipo: node.tipo,
      valor: cadena,
    };
    return terminal;
    //throw new Error('Metodo visitTerminalesExpCadena no implementado');
  }

  /**
   * @type {BaseVisitor['visitDeclaracionVariable']}
   */
  visitDeclaracionVariable(node) {
    //console.log("esta entrando a declarar");
    const tipovariable = node.tipo;
    const nombreVariable = node.id;
    const valorVariable = node.exp.accept(this);
    //console.log("-------------------------------");
    //console.log(valorVariable);
    //console.log("-------------------------------");
    const fila = node.location.start.line;
    const columna = node.location.start.column;
    this.ingresoTabla(nombreVariable, "Variable", tipovariable, this.EntornoActual.nombreEntorno, fila, columna);

    console.log(this.tabla);
      this.EntornoActual.setVariable(
        tipovariable,
        nombreVariable,
        valorVariable.valor,
        fila,
        columna
      );
    

    //throw new Error('Metodo visitDeclaracionVariable no implementado');
  }

  /**
   * @type {BaseVisitor['visitDeclaracionVariableSinValor']}
   */
  visitDeclaracionVariableSinValor(node) {
    const tipovariable = node.tipo;
    const nombreVariable = node.id;
    const fila = node.location.start.line;
    const columna = node.location.start.column;
    this.EntornoActual.setVariable(
      tipovariable,
      nombreVariable,
      null,
      fila,
      columna
    );

    //throw new Error('Metodo visitDeclaracionVariableSinValor no implementado');
  }

  /**
   * @type {BaseVisitor['visitAsignacionValor']}
   */
  visitAsignacionValor(node) {
    const nombreVariable = node.id;
    const valorVariable = node.asig.accept(this);

    //console.log(valorVariable);
    this.EntornoActual.asignacionVariable(nombreVariable, valorVariable);

    return valorVariable;

    //throw new Error('Metodo visitAsignacionValor no implementado');
  }

  /**
   * @type {BaseVisitor['visitPrint']}
   */
  visitPrint(node) {
    const Objeto = node.exp.accept(this);
    console.log("---------------------------");
    console.log(Objeto);
    console.log("hola-------------------");
    
    console.log(Objeto);
    if(Objeto.valor){

    console.log("hola 32");
      this.SalidaInterprete += Objeto.valor + "\n";
    }else{
      console.log("hola33");
      this.SalidaInterprete += Objeto + "\n";
    }

    //throw new Error('Metodo visitPrint no implementado');
  }

  /**
   * @type {BaseVisitor['visitExpresionSentencia']}
   */
  visitExpresionSentencia(node) {
    node.exp.accept(this);
    //throw new Error('Metodo visitExpresionSentencia no implementado');
  }

  /**
   * @type {BaseVisitor['visitBloque']}
   */
  visitBloque(node) {
      const entornoAnterior = this.EntornoActual;
      this.EntornoActual = new Entorno(entornoAnterior);

      console.log("-------Entro al bloque --------------------");
      node.dcls.forEach((dcl) => dcl.accept(this));
      console.log("-------Salgo al bloque --------------------");
      this.EntornoActual = entornoAnterior;
    //throw new Error('Metodo visitBloque no implementado');
  }

  /**
   * @type {BaseVisitor['visitNumero']}
   */
  visitOperacionLogica(node) {
    const izq = node.izq.accept(this);
    let termIzq;
    try {
      if (Object.keys(izq.valor).length>=2) {
        termIzq= {
         tipo: izq.tipo,
         valor: izq.valor.valor,
       };
     } else {
      termIzq = {
        tipo: izq.tipo,
        valor: izq.valor,
      };
       
     }
    } catch (error) {
      termIzq = {
        tipo: izq.tipo,
        valor: izq.valor,
      };
    }
    
    const der = node.der.accept(this);
    console.log(der);
    const termDer = {
      tipo: der.tipo,
      valor: der.valor,
    };

    switch (node.op) {
      case "==":
        let terminal = {
          tipo: "boolean",
          valor: termIzq.valor == termDer.valor,
        };
        return terminal;
      case "!=":
        let terminal2 = {
          tipo: "boolean",
          valor: termIzq.valor != termDer.valor,
        };
        return terminal2;
      case "<":
        let termina3 = {
          tipo: "boolean",
          valor: termIzq.valor < termDer.valor,
        };
        return termina3;
      case "<=":
        console.log(termIzq.valor <= termDer.valor);
        let terminal4 = {
          tipo: "boolean",
          valor: termIzq.valor <= termDer.valor,
        };
        return terminal4;
      case ">":
        let termina5 = {
          tipo: "boolean",
          valor: termIzq.valor > termDer.valor,
        };
        return termina5;
      case ">=":
        let terminal6 = {
          tipo: "boolean",
          valor: termIzq.valor >= termDer.valor,
        };
        return terminal6;
      case "&&":
        let termina7 = {
          tipo: "boolean",
          valor: termIzq.valor && termDer.valor,
        };
        return termina7;
      case "||":
        let terminal8 = {
          tipo: "boolean",
          valor: termIzq.valor || termDer.valor,
        };
        return terminal8;
      default:
        throw new Error(`Operador no soportado: ${node.op}`);
    }
    //throw new Error('Metodo visitOperacionLogica no implementado');
  }

  /**
   * @type {BaseVisitor['visitSumaYResta']}
   */
  visitSumaYResta(node) {
    console.log("################Entro  a la Suma o Resta#####################");
    const izq = node.izq.accept(this);
    const der = node.der.accept(this);
    console.log("^^^^^^^^Que Entra a la Suma y Resta^^^^^^^^^^^^^^^^^^^^");
    console.log(izq);
    console.log(der);
    console.log(typeof izq === 'object');
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    let termIzq
    if(izq.tipo=="string"){
      termIzq = {
        tipo: izq.tipo,
        valor: izq.valor
      };

    }else{
      try {
        if (Object.keys(izq.valor).length>=2) {
          console.log("entra a; if del tri catch");
          termIzq= {
           tipo: izq.tipo,
           valor: izq.valor.valor
         };
       } else {
        console.log("entra al else del try catch");
        termIzq = {
          tipo: izq.tipo,
          valor: izq.valor
        };
         
       }
      } catch (error) {
        console.log("Entra al cath");
        console.log(izq);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        termIzq = {
          tipo: "int",
          valor: izq
        };
      }

    }
        
    console.log('Hijo Izq');
    console.log(termIzq);
    ///////////////////////////////////////
    //const der = node.der.accept(this);
    let termDer;

    if (der.tipo=="string") {
      termDer = {
        tipo: der.tipo,
        valor: der.valor
      };
    } else {
      try {
        if (Object.keys(der.valor).length>=2) {
          console.log("entra a; if del tri catch");
          termDer= {
           tipo: der.tipo,
           valor: der.valor.valor
         };
       } else {
        console.log("entra al else del try catch");
        termDer = {
          tipo: der.tipo,
          valor: der.valor
        };
         
       }
      } catch (error) {
        termDer = {
          tipo: "int",
          valor: der
        };
      }
    }

     
   
    console.log("hijo derecho");
    console.log(termDer);

    switch (node.op) {
      case "+":
        /*console.log("Suma");
        console.log(termIzq);
        console.log(termDer);
        console.log("-------------");



        let terminal = {
          tipo: termIzq.tipo,
          valor: termIzq.valor + termDer.valor,
        };
        console.log(terminal.valor);*/
        let resultado;

    // Validaciones de combinaciones de tipos entre 'termIzq' y 'termDer'
    if (termIzq.tipo === 'int' && termDer.tipo === 'int') {
        // Operación de suma entre dos enteros
        resultado = termIzq.valor + termDer.valor;
        return { tipo: 'int', valor: resultado };
    } else if (termIzq.tipo === 'int' && termDer.tipo === 'float') {
        // Operación de suma entre int y float
        resultado = termIzq.valor + termDer.valor;
        return { tipo: 'float', valor: resultado };
    } else if (termIzq.tipo === 'float' && termDer.tipo === 'int') {
        // Operación de suma entre float y int
        resultado = termIzq.valor + termDer.valor;
        return { tipo: 'float', valor: resultado };
    } else if (termIzq.tipo === 'float' && termDer.tipo === 'float') {
        // Operación de suma entre dos floats
        resultado = termIzq.valor + termDer.valor;
        return { tipo: 'float', valor: resultado };
    } else if (termIzq.tipo === 'string' && termDer.tipo === 'string') {
        // Operación de concatenación entre dos strings
        console.log(termIzq);
        console.log(termDer);
        resultado = termIzq.valor+termDer.valor; 

        console.log(resultado);
        return { tipo: 'string', valor: resultado };
    } else {
        // Combinación no soportada para suma
        return { tipo: 'error', valor: 'Error Semantico Operación no soportada para estos tipos' };
    }
       
      case "-":
        console.log("resta");
        let resultado2;

        // Validaciones de combinaciones de tipos entre 'termIzq' y 'termDer'
        if (termIzq.tipo === 'int' && termDer.tipo === 'int') {
            // Operación de resta entre dos enteros
            resultado2 = termIzq.valor - termDer.valor;
            return { tipo: 'int', valor: resultado2 };
        } else if (termIzq.tipo === 'int' && termDer.tipo === 'float') {
            // Operación de  entre int y float
            resultado2 = termIzq.valor - termDer.valor;
            return { tipo: 'float', valor: resultado2 };
        } else if (termIzq.tipo === 'float' && termDer.tipo === 'int') {
            // Operación de  entre float y int
            resultado2 = termIzq.valor - termDer.valor;
            return { tipo: 'float', valor: resultado2 };
        } else if (termIzq.tipo === 'float' && termDer.tipo === 'float') {
            // Operación de  entre dos floats
            resultado2 = termIzq.valor - termDer.valor;
            return { tipo: 'float', valor: resultado2 };
        } else {
            // Combinación no soportada para resta
            return { tipo: 'error', valor: 'Error Semantico Operación no soportada para estos tipos' };
        }


        /*let terminal2 = {
          tipo: termIzq.tipo,
          valor: termIzq.valor - termDer.valor,
        };
        console.log(terminal2.valor);
        return terminal2;*/
      default:
        throw new Error(`Operador no soportado: ${node.op}`);
    }
    //throw new Error('Metodo visitSumaYResta no implementado');
  }

  /**
   * @type {BaseVisitor['visitMultiplicacionYDivision']}
   */
  visitMultiplicacionYDivision(node) {
    const izq = node.izq.accept(this);
    const termIzq = {
      tipo: izq.tipo,
      valor: izq.valor,
    };
    const der = node.der.accept(this);
    const termDer = {
      tipo: der.tipo,
      valor: der.valor,
    };

    switch (node.op) {
      case "*":
        /*let terminal = {
          tipo: termIzq.tipo,
          valor: termIzq.valor * termDer.valor,
        };*/
        let resultado2;

        // Validaciones de combinaciones de tipos entre 'termIzq' y 'termDer'
        if (termIzq.tipo === 'int' && termDer.tipo === 'int') {
            // Operación de multiplicacion entre dos enteros
            resultado2 = termIzq.valor * termDer.valor;
            return { tipo: 'int', valor: resultado2 };
        } else if (termIzq.tipo === 'int' && termDer.tipo === 'float') {
            // Operación de multiplicacion entre int y float
            resultado2 = termIzq.valor * termDer.valor;
            return { tipo: 'float', valor: resultado2 };
        } else if (termIzq.tipo === 'float' && termDer.tipo === 'int') {
            // Operación de multiplicacion entre float y int
            resultado2 = termIzq.valor * termDer.valor;
            return { tipo: 'float', valor: resultado2 };
        } else if (termIzq.tipo === 'float' && termDer.tipo === 'float') {
            // Operación de multiplicacion entre dos floats
            resultado2 = termIzq.valor * termDer.valor;
            return { tipo: 'float', valor: resultado2 };
        } else {
            // Combinación no soportada para resta
            return { tipo: 'error', valor: 'Error Semantico Operación no soportada para estos tipos' };
        }

        //return terminal;
      case "/":
        /*let terminal2 = {
          tipo: termIzq.tipo,
          valor: termIzq.valor / termDer.valor,
        };*/
        //return terminal2;
        let resultado
        // Validaciones de combinaciones de tipos entre 'termIzq' y 'termDer'
        if (termIzq.tipo === 'int' && termDer.tipo === 'int') {
          // Operación de división entre dos enteros
          if (termDer.valor === 0) {
              return { tipo: 'error', valor: 'Error Semántico: División por cero' };
          }
          resultado = Math.floor(termIzq.valor / termDer.valor); // División entera
          return { tipo: 'int', valor: resultado };
      } else if (termIzq.tipo === 'int' && termDer.tipo === 'float') {
          // Operación de división entre int y float
          if (termDer.valor === 0) {
              return { tipo: 'error', valor: 'Error Semántico: División por cero' };
          }
          resultado = termIzq.valor / termDer.valor; // División flotante
          return { tipo: 'float', valor: resultado };
      } else if (termIzq.tipo === 'float' && termDer.tipo === 'int') {
          // Operación de división entre float y int
          if (termDer.valor === 0) {
              return { tipo: 'error', valor: 'Error Semántico: División por cero' };
          }
          resultado = termIzq.valor / termDer.valor; // División flotante
          return { tipo: 'float', valor: resultado };
      } else if (termIzq.tipo === 'float' && termDer.tipo === 'float') {
          // Operación de división entre dos floats
          if (termDer.valor === 0) {
              return { tipo: 'error', valor: 'Error Semántico: División por cero' };
          }
          resultado = termIzq.valor / termDer.valor; // División flotante
          return { tipo: 'float', valor: resultado };
      } else {
          // Combinación no soportada para división
          return { tipo: 'error', valor: 'Error Semántico: Operación no soportada para estos tipos' };
      }
      case "%":
        let resultado3
        if (termIzq.tipo === 'int' && termDer.tipo === 'int') {
          // Operación de módulo entre dos enteros
          if (termDer.valor === 0) {
              return { tipo: 'error', valor: 'Error Semántico: División por cero' };
          }
          resultado3 = termIzq.valor % termDer.valor; // Módulo
          return { tipo: 'int', valor: resultado3 };
      } else {
          // Combinación no soportada para módulo
          return { tipo: 'error', valor: 'Error Semántico: Operación no soportada para estos tipos' };
      }

      default:
        throw new Error(`Operador no soportado: ${node.op}`);
    }
    //throw new Error('Metodo visitMultiplicacionYDivision no implementado');
  }

  /**
   * @type {BaseVisitor['visitOperacionUnaria']}
   */
  visitOperacionUnaria(node) {
    const exp = node.exp.accept(this);
    const tipo = exp.tipo;
    const valor = exp.valor;

    switch (node.op) {
      case "-":
        let terminal = {
          tipo: tipo,
          valor: -valor,
        };
        return terminal;
      default:
        throw new Error(`Operador no soportado: ${node.op}`);
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
    //retorna el valor de una variable por su id
    const nombreVariable = node.id;
    //console.log(node.id+ "referencia");
    //console.log(this.EntornoActual.valores);
    const objeto22= this.EntornoActual.getVariable(nombreVariable);
    //console.log(objeto22);
    return {tipo:objeto22.tipo,valor:objeto22.valor}

    //throw new Error('Metodo visitReferenciaVariable no implementado');
  }

  /**
   * @type {BaseVisitor['visitModIgualacion']}
   */
  visitModIgualacion(node) {
    //throw new Error('Metodo visitModIgualacion no implementado');
    const nombreVar =node.id;
    const exp=node.sum.accept(this);
    console.log("------------------------------");
    console.log(exp);
    console.log("-------------------------------");
    const operacion=node.op;
    const valorinicial=this.EntornoActual.getVariable(nombreVar);
    let resultado;
    if (operacion === '+=') {
      
      resultado = valorinicial.valor +exp.valor;  // Suma y asignación
    } else if (operacion === '-=') {
      resultado = valorinicial.valor -exp.valor;  // Resta y asignación
    }
    const aux={
      tipo:exp.tipo,
      valor:resultado
    }
    this.EntornoActual.asignacionVariable(nombreVar,aux)
  }

  /**
   * @type {BaseVisitor['visitNegacion']}
   */
  visitNegacion(node) {
    //throw new Error('Metodo visitNegacion no implementado');
  }

  /**
   * @type {BaseVisitor['visitIf']}
   */
  visitIf(node) {

        const cond = node.cond.accept(this);
        console.log("Entre al if");
        console.log(cond);

        if (cond.valor) {
            console.log("if-----------------------------------------%$");
            node.stmtIf.accept(this);
            console.log(node.stmtIf);
            return;
        }
        /*for(let a=0;a<node.stmtIfElse.length();a++){
          console.log("----- conjunto de else if-------");
          node.stmtIfElse.accept(this)

        }*/
       node.stmtIfElse.forEach(dcl => dcl.accept(this));

        if (node.stmtElse) {

            console.log("-----------else -------------------");
            node.stmtElse.accept(this);
        }
    //throw new Error('Metodo visitIf no implementado');
  }

  /**
   * @type {BaseVisitor['visitElseIfExp']}
   */
  visitElseIfExp(node) {
    //console.log("else if");
    const cond = node.cond.accept(this);

    if (cond.valor) {
      node.stmtElseIf.accept(this);
      return;
      }
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
