// import fs from 'fs';
const fs = require('fs')

const types = [
    `
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    `
]

const configuracionNodos = [
    // Configuracion del nodo inicial
    {
        name: 'Expresion',
        base: true,
        props: [
            {
                name: 'location',
                type: 'Location|null',
                description: 'Ubicacion del nodo en el codigo fuente',
                default: 'null'
            }
        ]
    },
    {
        name: 'TerminalesExp',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'Valor del numero'
            },
            {
                name: 'valor',
                type: 'number',
                description: 'Valor del numero'
            }
        ]
    },
      //DeclaracionVariable, tipo,id,exp
    {
        name: 'DeclaracionVariable',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'Tipo de variable'
            },
            {
                name: 'id',
                type: 'String',
                description: 'Nombre de identificador '
            },
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Valor de la variable'
            }
        ]
    },
      //DeclaracionVariableSinValor, tipo,id
    {
        name: 'DeclaracionVariableSinValor',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'String',
                description: 'tipo de la variable'
            },
            {
                name: 'id',
                type: 'string',
                description: 'identificador de variable'
            }
        ]
    },
      //AsignacionValor  {id,asig}
    {
        name: 'AsignacionValor',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'String',
                description: 'Nombre de identificador'
            },
            {
                name: 'asig',
                type: 'Expresion',
                description: 'Valor nuevo a la variable'
            }
        ]
    },
    //'Print':nodos.Print, {exp,expansion}
    {
        name: 'Print',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion principal a imprimir'
            },
            {
                name: 'expansion',
                type: 'Expresion[]',
                description: 'Arreglo de expresiones a imprimir'
            }
        ]
    },

    //  'ExpresionSentencia':nodos.ExpresionSentencia, {exp}

    {
        name: 'ExpresionSentencia',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion a evaluar'
            }
        ]
    },
    //  'Bloque':nodos.Bloque, {dcls}
    {
        name: 'Bloque',
        extends: 'Expresion',
        props: [
            {
                name: 'dcls',
                type: 'Expresion[]',
                description: 'Expresion a evaluar'
            }
        ]
    },

    //  'OperacionLogica':nodos.OperacionLogica, {op: tipo, izq:operacionAnterior,der}
    {
        name: 'OperacionLogica',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    //  'SumaYResta': nodos.SumaYResta,
    {
        name: 'SumaYResta',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },

    //  'MultiplicacionYDivision':nodos.MultiplicacionYDivision,
    {
        name: 'MultiplicacionYDivision',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion multiplicacion o division'
            }
        ]
    },
    //  'Unaria':nodos.Unaria,
    {
        name: 'OperacionUnaria',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion Unaria'
            }
        ]
    },
    //'Agrupacion':nodos.Agrupacion, { exp }
    {
        name: 'Agrupacion',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion agrupada dentro parentisis'
            }
        ]
    },
    //'ReferenciaVariable':nodos.ReferenciaVariable { id }
    {
        name: 'ReferenciaVariable',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la variable'
            }
        ]
    }
    //TerminalesExpCadena  tipo, valor[null,letra]
    ,
    {
        name: 'TerminalesExpCadena',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'tipo de cadena'
            },
            {
                name: 'valor',
                type: 'char[]',
                description: 'Arreglo de cadena'
            }
        ]
    },
    //ModIgualacion {id,op,sum}
    {
        name: 'ModIgualacion',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'nombre de la variable'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion Modificacion Incre y Decre'
            },
            {
                name: 'sum',
                type: 'Expresion',
                description: 'Expresion de nuevo valor'
            }
        ]
    },
    //Negacion ! expresion
    {
        name: 'Negacion',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion de la operacion Logica'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de Negacion'
            }
        ]
    },
    // If {cond,stmtIf,stmtIfElse,stmtElse}
    {
        name: 'If',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del if'
            },
            {
                name: 'stmtIf',
                type: 'Expresion',
                description: 'Cuerpo del if'
            },
            {
                name: 'stmtIfElse',
                type: 'Expresion[]|undefined',
                description: 'Cuerpo del else if'
            },
            {
                name: 'stmtElse',
                type: 'Expresion|undefined',
                description: 'Cuerpo del else'
            }
        ]
    },
    //ElseIfExp {cond,stmtElseIf}
    {
        name: 'ElseIfExp',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del Else if'
            },
            {
                name: 'stmtElseIf',
                type: 'Expresion|undefined',
                description: 'Cuerpo de Else If'
            }
        ]
    },
    //'While',{cond,stmt}
    {
        name: 'While',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del while'
            },
            {
                name: 'stmt',
                type: 'Expresion',
                description: 'Cuerpo del while'
            }
        ]
    },
    //   For, { init, cond, inc, stmt })
    {
        name: 'For',
        extends: 'Expresion',
        props: [
            {
                name: 'init',
                type: 'Expresion',
                description: 'Inicializacion del for'
            },
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del for'
            },
            {
                name: 'inc',
                type: 'Expresion',
                description: 'Incremento del for'
            },
            {
                name: 'stmt',
                type: 'Expresion',
                description: 'Cuerpo del for'
            }
        ]
    },
    // Break
    {
        name: 'Break',
        extends: 'Expresion',
        props: []
    },
    //Continue
    {
        name: 'Continue',
        extends: 'Expresion',
        props: []
    },
    // Return { exp }
       {
        name: 'Return',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion|undefined',
                description: 'Expresion a retornar'
            }
        ]
    },  
    //Llamada  {callee , args}
    {
        name: 'Llamada',
        extends: 'Expresion',
        props: [
            {
                name: 'callee',
                type: 'Expresion',
                description: 'Expresion a llamar'
            },
            {
                name: 'args',
                type: 'Expresion[]',
                description: 'Argumentos de la llamada'
            }
        ]
    },
    //'DeclaracioFuncion',{tipo,id,params,bloque}
    {
        name: 'DeclaracioFuncion',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'identificador tipo de retorno de la funcion'
            },
            {
                name: 'id',
                type: 'string',
                description: 'identificador de la funcion'
            },
            {
                name: 'params',
                type: 'string[]',
                description: 'Parametros de la Funcion'
            },
            {
                name: 'bloque',
                type: 'Bloque',
                description: 'Cuerpo de la funcion'
            }
        ]
    },
    //'Enbebida',{id,exp}
    {
        name: 'Enbebida',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Argumentos de la llamada'
            },
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion a Transformar'
            }
        ]
    }
]

let code = ''

// Tipos base
types.forEach(type => {
    code += type + '\n'
})


// // Tipos de nodos
// configuracionNodos.forEach(nodo => {
//     code += `
// /**
//  * @typedef {Object} ${nodo.name}
//  * ${nodo.props.map(prop => `@property {${prop.type}} ${prop.name} ${prop.description}`).join('\n * ')}
// */
//     `
// })

// Tipos del visitor
code += `
/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */
`

const baseClass = configuracionNodos.find(nodo => nodo.base)

configuracionNodos.forEach(nodo => {


    code += `
export class ${nodo.name} ${baseClass && nodo.extends ? `extends ${nodo.extends}` : ''} {

    /**
    * @param {Object} options
    * ${nodo.props.map(prop => `@param {${prop.type}} options.${prop.name} ${prop.description}`).join('\n * ')}
    */
    constructor(${!nodo.base && nodo.props.length>0 && `{ ${nodo.props.map(prop => `${prop.name}`).join(', ')} }` || ''}) {
        ${baseClass && nodo.extends ? `super();` : ''}
        ${nodo.props.map(prop => `
        /**
         * ${prop.description}
         * @type {${prop.type}}
        */
        this.${prop.name} = ${prop.default || `${prop.name}`};
`).join('\n')}
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visit${nodo.name}(this);
    }
}
    `
})

code += `
export default { ${configuracionNodos.map(nodo => nodo.name).join(', ')} }
`


fs.writeFileSync('./GeneradorDeArchivos/nodos.js', code)
console.log('Archivo de clases de nodo generado correctamente')


// Visitor
// @typedef {import('./nodos').Expresion} Expresion
code = `
/**
${configuracionNodos.map(nodo => `
 * @typedef {import('./nodos').${nodo.name}} ${nodo.name}
`).join('\n')}
 */
`

code += `

/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    ${configuracionNodos.map(nodo => `
    /**
     * @param {${nodo.name}} node
     * @returns {any}
     */
    visit${nodo.name}(node) {
        throw new Error('Metodo visit${nodo.name} no implementado');
    }
    `).join('\n')
    }
}
`

fs.writeFileSync('./GeneradorDeArchivos/visitor.js', code)
console.log('Archivo de visitor generado correctamente')