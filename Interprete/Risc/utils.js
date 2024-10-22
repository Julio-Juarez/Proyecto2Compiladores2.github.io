/**
 * entrada: 'abc'
 * salaida: [2332423]
*/

export const stringTo32BitsArray = (str) => {
    const resultado = []
    let elementIndex = 0
    let intRepresentation = 0;
    let shift = 0;

    while (elementIndex < str.length) {
        intRepresentation = intRepresentation | (str.charCodeAt(elementIndex) << shift)
        shift += 8
        if (shift >= 32) {
            resultado.push(intRepresentation)
            intRepresentation = 0
            shift = 0
        }
        elementIndex++
    }

    if (shift > 0) {
        resultado.push(intRepresentation);
    }

    return resultado;
}

export const stringTo1ByteArray = (str) => {
    const resultado = []
    let elementIndex = 0  // elemento a interar

    while (elementIndex < str.length) {
        resultado.push(str.charCodeAt(elementIndex))
        elementIndex++
    }
    resultado.push(0)// Representa que la cadena termina en caracter nulo
    return resultado;
}

export const numberToF32 = (number) => {

    const buffer = new ArrayBuffer(4);
    const float32arr = new Float32Array(buffer);
    const uint32arr = new Uint32Array(buffer);
    
    float32arr[0] = number;//representacion a bajo nivel

    const integer = uint32arr[0];
    const hexRepr = integer.toString(16);//convertir el integer a hexadecimal
    return '0x' + hexRepr;//0x prefijo para que el compilador lo trate como hexadecimal
}