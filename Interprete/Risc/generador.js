import { registers as r } from "./constantes.js";
import { stringTo1ByteArray, numberToF32 } from "./utils.js";
import { builtins } from "./builtins.js";

class Instruction {

    constructor(instruccion, rd, rs1, rs2) {
        this.instruccion = instruccion;
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }

    toString() {
        const operandos = []
        if (this.rd !== undefined) operandos.push(this.rd)
        if (this.rs1 !== undefined) operandos.push(this.rs1)
        if (this.rs2 !== undefined) operandos.push(this.rs2)
        return `${this.instruccion} ${operandos.join(', ')}`
    }

}

export class Generador {

    constructor() {
        this.instrucciones = []
        this.profundidad=0; // manejar entornos
        this.instruccionesDeFunciones = []
        this.objectStack = []
        this._usedBuiltins = new Set()
        this._labelCounter = 0;// _ representa una llave privada en jacascript
    }

    getLabel() {
        return `L${this._labelCounter++}`
    }

    addLabel(label) {
        label = label || this.getLabel() //usa la etiqueta enviada o crea una nueva
        this.instrucciones.push(new Instruction(`${label}:`))
        return label
    }

    add(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('add', rd, rs1, rs2))
    }

    sub(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('sub', rd, rs1, rs2))
    }

    mul(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('mul', rd, rs1, rs2))
    }

    div(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('div', rd, rs1, rs2))
    }

    rem(rd, rs1, rs2){
        this.instrucciones.push(new Instruction('rem',rd,rs1,rs2))
    }

    addi(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('addi', rd, rs1, inmediato))
    }

    sw(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruction('sw', rs1, `${inmediato}(${rs2})`))
    }

    sb(rs1,rs2,inmediato=0){
        this.instrucciones.push(new Instruction('sb', rs1, `${inmediato}(${rs2})`)) // no carga los 32bits sino solo carga 8
    }

    lw(rd, rs1, inmediato = 0) { //cargar una palabra de 32 bits
        this.instrucciones.push(new Instruction('lw', rd, `${inmediato}(${rs1})`))
    }
    lb(rd, rs1, inmediato = 0) { // cargar un valor de un bit
        this.instrucciones.push(new Instruction('lb', rd, `${inmediato}(${rs1})`))
    }

    //! Saltos Condicionales
    /**
     * ==
     */
    beq(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('beq', rs1, rs2, label))
    }

    /**
     * !=
     */
    bne(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bne', rs1, rs2, label))
    }

    /**
     * <
     */
    blt(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('blt', rs1, rs2, label))
    }

    /**
     * >=
     */
    bge(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bge', rs1, rs2, label))
    }
    //!fin de saltos condicionales

    li(rd, inmediato) {
        this.instrucciones.push(new Instruction('li', rd, inmediato))
    }
    la(rd, label) {
        this.instrucciones.push(new Instruction('la', rd, label))
    }


    push(rd = r.T0) {
        this.addi(r.SP, r.SP, -4) // 4 bytes = 32 bits
        this.sw(rd, r.SP)
    }

    pushFloat(rd = r.T0) {
        this.addi(r.SP, r.SP, -4) // 4 bytes = 32 bits
        this.fsw(rd, r.SP)
    }



    pop(rd = r.T0) {
        this.lw(rd, r.SP)
        this.addi(r.SP, r.SP, 4)
    }
    jal(label) {//salto incondicional: salta la etiqueta y cuando salte se puede llamar al pueto donde la llame 
        this.instrucciones.push(new Instruction('jal', label))
    }
    jalr(rd, rs1, imm) {
        this.instrucciones.push(new Instruction('jalr', rd, rs1, imm))
    }
    j(label) {  // salto sin preguntar nada
        this.instrucciones.push(new Instruction('j', label))
    }

    ret() {
        this.instrucciones.push(new Instruction('ret'))
    }

    ecall() {
        this.instrucciones.push(new Instruction('ecall'))
    }

    // !Cosas para concatenar
    callBuiltin(builtinName) {
        if (!builtins[builtinName]) {
            throw new Error(`Builtin ${builtinName} not found`)
        }
        this._usedBuiltins.add(builtinName)
        this.jal(builtinName) //salto incondicional: 
    }

    printInt(rd = r.A0) {

        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO)
        }

        this.li(r.A7, 1)
        this.ecall()

        if (rd !== r.A0) {
            this.pop(r.A0)
        }

    }

    printString(rd = r.A0) {

        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO)
        }

        this.li(r.A7, 4)
        this.ecall()

        if (rd !== r.A0) {
            this.pop(r.A0)
        }
    }
    printBooleano(rd = r.A0) {
      // Si rd es diferente de r.A0, guardamos el valor original de r.A0 y copiamos rd en r.A0
      if (rd !== r.A0) {
        this.push(r.A0);
        this.add(r.A0, rd, r.ZERO);
      }

      const printFalse = this.getLabel();
      const endPrintBool = this.getLabel();
      // Comparamos el valor en r.A0 para ver si es 0 (false) o 1 (true)
      this.li(r.T0, 0); // Carga 0 en el registro temporal r.T0
      this.beq(r.A0, r.T0, printFalse); // Si r.A0 es 0, salta a la etiqueta printFalse

      // Imprime "true" si el valor en r.A0 es diferente de 0
      this.li(r.A0, 1); // Carga la cadena "true" en r.A0
      this.li(r.A7, 1); // Código de impresión de cadenas
      this.ecall(); // Llama al sistema para imprimir "true"
      this.j(endPrintBool); // Salta al final de la función

      // Etiqueta para imprimir "false" si el valor en r.A0 es 0
      this.addLabel(printFalse);
      this.li(r.A0, 0); // Carga la cadena "false" en r.A0
      this.li(r.A7, 1); // Código de impresión de cadenas
      this.ecall(); // Llama al sistema para imprimir "false"

      // Etiqueta final para el salto de salida
      this.addLabel(endPrintBool);
      if (rd !== r.A0) {
        this.pop(r.A0); // Restaura el valor original de r.A0 desde la pila
      }
    }

    endProgram() {
        this.li(r.A7, 10)
        this.ecall()
    }

    comment(text) {
        this.instrucciones.push(new Instruction(`# ${text}`))
    }

    pushConstant(object) {
        let length = 0;

        switch (object.tipo) {
            case 'int':
                this.li(r.T0, object.valor);
                this.push()
                length = 4;
                break;

            case 'string':
                const stringArray = stringTo1ByteArray(object.valor);

                this.comment(`pushing string ${object.valor}`);
                //this.addi(r.T0, r.HP, 4);
                //this.push(r.T0)
                this.push(r.HP);

                stringArray.forEach((codigoCaracter) => {
                    this.li(r.T0, codigoCaracter); //cargamos el codigo del caracter en T0
                    //this.push(r.T0);

                    //antes de usar el metodo nuevo stringTo1ByteArray
                    //this.addi(r.HP, r.HP, 4);
                    //this.sw(r.T0, r.HP);
                    //------------------------------
                    this.sb(r.T0,r.HP);//guardar un bit de To al HP
                    this.addi(r.HP,r.HP,1);//Incrementamos el HP en 1 en 1

                });

                length = 4;
                break;
            case 'boolean':
                this.li(r.T0,object.valor ? 1:0);
                this.push(r.T0);
                length = 4;
                break;
            case 'float':
                const ieee754= numberToF32(object.valor)
                this.li(r.T0,ieee754);
                this.push(r.T0);
                length=4;
                break;
            default:
                break;
        }

        //console.log(this.profundidad +" esto se va meter");
        console.log(object.tipo);

        this.pushObject({ tipo: object.tipo, length, profundidad:this.profundidad });
    }

    pushObject(object) {
        this.objectStack.push({
            ...object,
            profundidad: this.profundidad,
        });
    }

    popFloat(rd = r.FT0) {
        this.flw(rd, r.SP)
        this.addi(r.SP, r.SP, 4)
    }

    popObject(rd = r.T0) {
        const object = this.objectStack.pop();


        switch (object.tipo) {
            case 'int':
                this.pop(rd);
                break;

            case 'string':
                this.pop(rd);
                //this.addi(rd, r.SP, 0);
                //this.addi(r.SP, r.SP, object.length);
                break;
            case 'boolean':
                this.pop(rd);
                break;
            case 'float':
                this.popFloat(rd);
                break;
            default:
                break;
        }
        

        return object;
    }

    getTopObject() {
        return this.objectStack[this.objectStack.length - 1];
    }

    // !Manejo de Entornos

    newScope() {
        this.profundidad++;
        //console.log("profundidad actual: "+ this.profundidad);
    }

    endScope(){
        let byteOffset = 0;
        //console.log(this.objectStack.length+"tamano stack");

        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            //console.log(this.objectStack[i]);
            //console.log(this.objectStack[i].profundidad+"profundidad objeto stack");
            //console.log(this.profundidad+"profundidad general");
            if (this.objectStack[i].profundidad === this.profundidad) {
                byteOffset += this.objectStack[i].length;
                this.objectStack.pop();
                console.log("entro al if");
            } else {
                break;
            }
        }
        this.profundidad--

        return byteOffset;
    }

    tagObject(id){
        this.objectStack[this.objectStack.length - 1].id=id;
    }

    getObject(id){
        let byteOffset = 0 ;
        for (let i = this.objectStack.length-1; i >= 0 ; i--) {
            if (this.objectStack[i].id==id) {
                return [byteOffset,this.objectStack[i]];
            }
            byteOffset+=this.objectStack[i].length;
        }
        throw new Error(`Variable ${id} not found`);
    }

    toString() {
        this.comment('Fin de mi progrma')
        this.endProgram()
        this.comment('bulting')


        this.comment("Funciones Foraneas");
        this.instruccionesDeFunciones.forEach(instruccion => this.instrucciones.push(instruccion))



        Array.from(this._usedBuiltins).forEach(builtinName => {
            this.addLabel(builtinName)
            builtins[builtinName](this)
            this.ret()
        })
        return `
.data
        heap:
.text 

#inicializando el heap pointer
        la ${r.HP}, heap

main:
    ${this.instrucciones.map(instruccion => `${instruccion}`).join('\n')}
`
    }


    //Float  ----------------------------
    fadd(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fadd.s', rd, rs1, rs2))
    }

    fsub(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fsub.s', rd, rs1, rs2))
    }

    fmul(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fmul.s', rd, rs1, rs2))
    }

    fdiv(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fdiv.s', rd, rs1, rs2))
    }

    fli(rd, inmediato) { //cargar un valor inmediato
        this.instrucciones.push(new Instruction('fli.s', rd, inmediato))
    }

    fmv(rd, rs1) {
        this.instrucciones.push(new Instruction('fmv.s', rd, rs1))
    }

    flw(rd, rs1, inmediato = 0) { //Leer
        this.instrucciones.push(new Instruction('flw', rd, `${inmediato}(${rs1})`))
    }

    fsw(rs1, rs2, inmediato = 0) {//escribir
        this.instrucciones.push(new Instruction('fsw', rs1, `${inmediato}(${rs2})`))
    }

    fcvtsw(rd, rs1) { //valor entero a un valor flotante
        this.instrucciones.push(new Instruction('fcvt.s.w', rd, rs1))
    }

    printFloat() {
        this.li(r.A7, 2)
        this.ecall()
    }

    getFrameLocal(index) {
        const frameRelativeLocal = this.objectStack.filter(obj => obj.tipo === 'local');
        return frameRelativeLocal[index];
    }

}