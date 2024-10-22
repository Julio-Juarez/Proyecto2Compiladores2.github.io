{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'TerminalesExp': nodos.TerminalesExp,
      'DeclaracionVariable':nodos.DeclaracionVariable,
      'DeclaracionVariableSinValor': nodos.DeclaracionVariableSinValor,
      'AsignacionValor': nodos.AsignacionValor,
      'Print':nodos.Print,
      'ExpresionSentencia':nodos.ExpresionSentencia,
      'Bloque':nodos.Bloque,
      'OperacionLogica':nodos.OperacionLogica,
      'SumaYResta': nodos.SumaYResta,
      'MultiplicacionYDivision':nodos.MultiplicacionYDivision,
      'Unaria':nodos.Unaria,
      'Agrupacion':nodos.Agrupacion,
      'ReferenciaVariable':nodos.ReferenciaVariable,
      'TerminalesExpCadena':nodos.TerminalesExpCadena,
      'ModIgualacion':nodos.ModIgualacion,
      'Negacion':nodos.Negacion,
      'If':nodos.If,
      'ElseIfExp': nodos.ElseIfExp,
      'While':nodos.While,
      'For':nodos.For,
      'Break':nodos.Break,
      'Continue':nodos.Continue,
      'Return':nodos.Return,
      'Llamada':nodos.Llamada,
      'DeclaracioFuncion':nodos.DeclaracioFuncion,
      'Enbebida':nodos.Enbebida
      


    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
  }
}
Programa = _ dcl:Declaracion* _ { return dcl}

Declaracion = dcl:DeclaracionVariable _ {return dcl}
            / dcl:DeclaracionFuncion _ {return dcl}
            / stmt:Sentencia _ { return stmt}

DeclaracionVariable = tipo:Tipo _ id:Identificador _ "=" _ exp:Expresion _ ";" {return crearNodo('DeclaracionVariable',{tipo,id,exp})}//--
/ tipo:Tipo _ id:Identificador _ ";" {return crearNodo('DeclaracionVariableSinValor',{tipo,id})}//--

DeclaracionFuncion = tipo:TipoFuncion _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('DeclaracioFuncion',{tipo,id,params:params||[],bloque})}

Parametros = id:ArmadoParametro _ params:("," _ ids:ArmadoParametro {return ids})* {return [id, ...params]}

ArmadoParametro= _ tipo:Tipo _ id:Identificador { return {tipo:tipo,id:id}} 

Sentencia = "System.out.println" _ "(" _ exp:Expresion _ expansion:(_"," extra:Expresion _ {return {Expresion:extra}} )* ")" _ ";" { return crearNodo('Print',{exp,expansion})}//--
/ Bloque:Bloque  {return Bloque}
/ "if" _ "(" _ cond:Expresion _ ")" _ stmtIf:Sentencia _ stmtIfElse:ElseIf*  _ stmtElse:( _ "else" _ stmtElse:Sentencia _ {return stmtElse})? {return crearNodo('If',{cond,stmtIf,stmtIfElse,stmtElse})} 
/ "while" _ "(" _ cond:Expresion _ ")" _ stmt:Sentencia {return crearNodo('While',{cond,stmt})}
/ "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Sentencia {
      return crearNodo('For', { init, cond, inc, stmt })
    }
/ "break" _ ";" { return crearNodo('Break') }
/ "continue" _ ";" { return crearNodo('Continue') }
/ "return" _ exp:Expresion? _ ";" { return crearNodo('Return', { exp }) }
/ exp:Expresion _ ";" { return crearNodo('ExpresionSentencia',{exp})}//--

Bloque= "{" _ dcls:Declaracion* _ "}" { return crearNodo('Bloque', {dcls})}//--
Enbebida=
"parseInt" {return "parseInt"}
/"parsefloat" {return "parsefloat"}
/ "toString" {return "toString"}
/ "toLowerCase" {return "toLowerCase"}
/"toUpperCase" {return "toUpperCase"}
/"typeof" {return "typeof"}

ForInit = dcl:DeclaracionVariable { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }

ElseIf= _ "else"_"if" _"(" cond:Expresion ")" _ stmtElseIf:Sentencia { return crearNodo('ElseIfExp',{cond,stmtElseIf})}

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asig:Asignacion { return crearNodo('AsignacionValor',{id,asig})}//--
        / id:Identificador _ op:("+="/"-=") _ sum:Suma { return crearNodo('ModIgualacion',{id,op,sum})}//
        / OperadoresLogicos

OperadoresLogicos=  izq:Comparacion expansion:(
    _ op:("&&"/"||") _ der:Comparacion { return { tipo: op, der}}
)* {
    return expansion.reduce(
        (operacionAnterior,operacionActual)=>{
            const {tipo, der} = operacionActual
            return crearNodo('OperacionLogica', {op: tipo, izq:operacionAnterior,der})//--
        },
        izq
    )
}
Comparacion = izq:Relacionales expansion:(
    _ op:("=="/"!=") _ der:Relacionales { return { tipo: op, der}}
)* {
    return expansion.reduce(
        (operacionAnterior,operacionActual)=>{
            const {tipo, der} = operacionActual
            return crearNodo('OperacionLogica', {op: tipo, izq:operacionAnterior,der})//--
        },
        izq
    )
}

Relacionales = izq:Suma expansion:(
    _ op:("<="/">"/"<"/">="/"<=") _ der:Suma { return { tipo: op, der}}
)* {
    return expansion.reduce(
        (operacionAnterior,operacionActual)=>{
            const {tipo, der} = operacionActual
            return crearNodo('OperacionLogica', {op: tipo, izq:operacionAnterior,der})//--
        },
        izq
    )
}

Suma = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('SumaYResta', { op:tipo, izq: operacionAnterior, der })//--
    },
    izq
  )
}

Multiplicacion = izq:Unaria expansion:(
  _ op:("*" / "/"/ "%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('MultiplicacionYDivision', { op:tipo, izq: operacionAnterior, der })//--
      },
      izq
    )
}

Unaria = "-" _ num:Unaria { return crearNodo('Unaria', { op: '-', exp: num }) }//--
/"!" _ num:Numero { return crearNodo('Negacion', { op: '-', exp: num }) }//--
/ Llamada

Llamada = 
 id:Enbebida _ "("_ exp:Expresion _")" { return crearNodo('Enbebida',{id,exp})}
/callee:Numero _ params:("(" args:Argumentos? _")" {return args})*{
  return params.reduce(
    (callee,args)=>{
      return crearNodo('Llamada', {callee,args:args || []})
    },
    callee
  )
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion {return exp} )* { return [arg, ...args]}

Numero = 
   "(" _ exp:Expresion _ ")" { return crearNodo('Agrupacion', { exp }) }//--
  / !(Boolean) id:Identificador { return crearNodo('ReferenciaVariable', { id }) }//--
  / [0-9]+"." [0-9]* {return crearNodo('TerminalesExp', { tipo:"float",valor: parseFloat(text(), 10) })}//
  / [0-9]+ {return crearNodo('TerminalesExp', {tipo:"int" ,valor: parseFloat(text(), 10) })}//
  / String
  / Char
  / Boolean

Boolean = "true" {return crearNodo('TerminalesExp',{tipo:"boolean",valor:1})}//
        / "false" {return crearNodo('TerminalesExp',{tipo:"boolean",valor:0})}//  

String = "\"" chars:Caracteres* "\"" { return crearNodo('TerminalesExpCadena', {tipo:"string", valor:chars}) }//

Caracteres
  = "\\" es:Escape { return es}
  / !("\"") . {return text()}//Que venga de todo menos comias   

Escape
  = "n" { return "\n"; }
  / "t" { return "\t"; }
  / "r" { return "\r"; }
  / "\"" { return "\""; }
  / "\\" { return "\\"; }
Char
  = "'" char:Caracter "'" { return crearNodo('TerminalesExp',{tipo:"char",valor:char}) }//

Caracter
  = "\\" es:Escape  { return es}
  / !("'" / "\\") . {return text()}



Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Tipo=
    "int" { return "int"; }
  / "float" { return "float"; }
  / "string" { return "string"; }
  / "boolean" { return "boolean"; }
  / "char" { return "char"; }
  / "var" { return "var"}

_ = ([ \t\n\r] / Comentarios)*
Comentarios = "//" (![\n].)*  { return ""}
             / "/*" (!("*/").)* "*/" { return ""}

Reservadas=
    "int" 
  / "float" 
  / "string" 
  / "boolean" 
  / "char" 
  / "var"
  / "for"
  / "else"
  / "if"
  / "while"
  / "break"
  / "continue"
  / "return" 

TipoFuncion=
    "int" { return "int"; }
  / "float" { return "float"; }
  / "string" { return "string"; }
  / "boolean" { return "boolean"; }
  / "char" { return "char"; }
  / "void" { return "var"}

