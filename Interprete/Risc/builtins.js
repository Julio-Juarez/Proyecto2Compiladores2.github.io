import { registers as r } from "./constantes.js"
import { Generador } from "./generador.js"

/**
 * @param {Generador} code
 */
export const concatString = (code) => {
    // A0 -> dirección en heap de la primera cadena
    // A1 -> dirección en heap de la segunda cadena
    // result -> push en el stack la dirección en heap de la cadena concatenada

    code.comment('Guardando en el stack la dirección en heap de la cadena concatenada')
    code.push(r.HP);

    code.comment('Copiando la 1er cadena en el heap')
    const end1 = code.getLabel()
    const loop1 = code.addLabel()

    code.lb(r.T1, r.A0)
    code.beq(r.T1, r.ZERO, end1)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A0, r.A0, 1)
    code.j(loop1)
    code.addLabel(end1)

    code.comment('Copiando la 2da cadena en el heap')
    const end2 = code.getLabel()
    const loop2 = code.addLabel()

    code.lb(r.T1, r.A1)
    code.beq(r.T1, r.ZERO, end2)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A1, r.A1, 1)
    code.j(loop2)
    code.addLabel(end2)

    code.comment('Agregando el caracter nulo al final')
    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)
}

//MENOr o Igual
/**
 * 
 * @param {Generador} code 
 */
export const lessOrEqual = (code) => {
    
    //T0 izq
    //T1 der
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.bge(r.T0, r.T1, trueLabel) // der >= izq
    code.li(r.T0, 0)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 1)
    code.push(r.T0)
    code.addLabel(endLabel)
}
//MEnor
/**
 * 
 * @param {Generador} code 
 */
export const lessThanInt = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.bge(r.T1, r.T0, trueLabel) 
    code.li(r.T0, 1)                
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                
    code.push(r.T0)
    code.addLabel(endLabel)
}

//Igual
/**
 * 
 * @param {Generador} code 
 */
export const equal = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.bne(r.T0, r.T1, trueLabel) // der != izq
    code.li(r.T0, 1)                // if true: t0 = 1
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                // else: t0 = 0
    code.push(r.T0)
    code.addLabel(endLabel)
}

//No igual
/**
 * 
 * @param {Generador} code 
 */
export const notEqualInt = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.beq(r.T0, r.T1, trueLabel) // if (der == izq), salto a trueLabel
    code.li(r.T0, 1)                // t0 = 1 (si es true, son diferentes)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                // t0 = 0 (si es false, son iguales)
    code.push(r.T0)
    code.addLabel(endLabel)
}

//mayor o igual
/**
 * 
 * @param {Generador} code 
 */
export const greaterOrEqualInt = (code) => {
   
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.blt(r.T0, r.T1, trueLabel) // if (der < izq), salto a trueLabel
    code.li(r.T0, 1)                // t0 = 1 (si es true)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                // t0 = 0 (si es false)
    code.push(r.T0)
    code.addLabel(endLabel)
}
//Mayor 
/**
 * 
 * @param {Generador} code 
 */
export const greaterThanInt = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.ble(r.T0, r.T1, trueLabel) // if (der <= izq), salto a trueLabel
    code.li(r.T0, 1)                // t0 = 1 (si es true)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                // t0 = 0 (si es false)
    code.push(r.T0)
    code.addLabel(endLabel)
}


//float ------------------------------------------------------------------
//MENOR o IGUAL para punto flotante
/**
 * 
 * @param {Generador} code 
 */
export const lessOrEqualFloat = (code) => {

    // F0 izq (float)
    // F1 der (float)
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.fge(r.F0, r.F1, trueLabel) // der >= izq (float comparison)
    code.li(r.T0, 0)                // t0 = 0 (si es false, izq > der)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 1)                // t0 = 1 (si es true, izq <= der)
    code.push(r.T0)
    code.addLabel(endLabel)
}
//Menor
/**
 * 
 * @param {Generador} code 
 */
export const lessThanFloat = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.fge(r.F0, r.F1, trueLabel) 
    code.li(r.T0, 1)                
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                
    code.push(r.T0)
    code.addLabel(endLabel)
}

//Igual
/**
 * 
 * @param {Generador} code 
 */
export const equalFloat = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.fneq(r.F0, r.F1, trueLabel) // der != izq (float comparison)
    code.li(r.T0, 1)                 // if true: t0 = 1
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                 // else: t0 = 0
    code.push(r.T0)
    code.addLabel(endLabel)
}
//No Igual
/**
 * 
 * @param {Generador} code 
 */
export const notEqualFloat = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.feq(r.F0, r.F1, trueLabel) // if (der == izq en floats)
    code.li(r.T0, 1)                // t0 = 1 (si es true, son diferentes)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                // t0 = 0 (si es false, son iguales)
    code.push(r.T0)
    code.addLabel(endLabel)
}
//mayor o igual
/**
 * 
 * @param {Generador} code 
 */
export const greaterOrEqualFloat = (code) => {

    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.flt(r.F0, r.F1, trueLabel) // if (der < izq en floats)
    code.li(r.T0, 1)                // t0 = 1 (si es true)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                // t0 = 0 (si es false)
    code.push(r.T0)
    code.addLabel(endLabel)
}
//mayor
/**
 * 
 * @param {Generador} code 
 */
export const greaterThanFloat = (code) => {
    
    const trueLabel = code.getLabel()
    const endLabel = code.getLabel()

    code.fle(r.F0, r.F1, trueLabel) // if (der <= izq en floats)
    code.li(r.T0, 1)                // t0 = 1 (si es true)
    code.push(r.T0)
    code.j(endLabel)
    code.addLabel(trueLabel)
    code.li(r.T0, 0)                // t0 = 0 (si es false)
    code.push(r.T0)
    code.addLabel(endLabel)
}


export const builtins = {
    concatString,
    lessOrEqual,//menor o igual
    lessOrEqualFloat,
    equal, //igual
    equalFloat,//igual fl
    notEqualInt, //no igual int 
    notEqualFloat, // no igual f
    greaterThanInt, //mayor que int,
    greaterThanFloat, //mayor que flotante, 
    lessThanInt, //menor que int, 
    lessThanFloat, //menor que flotante,
    greaterOrEqualFloat,//mayor o igual f
    greaterOrEqualInt,//mayor o igual int
   
}

     
   