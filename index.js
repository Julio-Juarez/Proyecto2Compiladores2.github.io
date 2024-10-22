import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm'


import { parse } from './GeneradorDeArchivos/analizadorProyecto.js'

//import { InterpreterVisistorProyecto } from './Interprete/interprete.js'
import {InterpreterVisitorProyecto} from './Interprete/interpreteProyecto.js'
import {CompilerVisitor} from './Interprete/Compilador.js'

const editor = document.getElementById('editor')
const btn = document.getElementById('aje')
const ast = document.getElementById('ast')
const salida = document.getElementById('salida')


const EditorMonaco = monaco.editor.create(
    document.getElementById('editor1'), {
    value: '',
    language: 'java',
    theme: 'vs-dark'
},
);

btn.addEventListener('click', () => {

    
    const codigoFuente = EditorMonaco.getValue();

    try{
    const sentencias = parse(codigoFuente)
    const CompSentencias = parse(codigoFuente)
    //ast.innerHTML = JSON.stringify(sentencias, null, 2)


    const interprete = new InterpreterVisitorProyecto();
    const compilador = new CompilerVisitor();

    for (const sentencia of sentencias) {
         sentencia.accept(interprete)
     }
     console.log("--------------------------------------------");
    console.log(CompSentencias);
    console.log("----------------------------------------------");

    for(const CompSentencia of CompSentencias){
        CompSentencia.accept(compilador);
    }
    
    //sentencias.forEach(sentencia => sentencia.accept(interprete))

    let texto = compilador.code.toString();
    salida.innerHTML = texto; //interprete.SalidaInterprete
    let tabla=interprete.tabla;
    let tablaHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>TipoSímbolo</th>
                        <th>TipoDato</th>
                        <th>Ámbito</th>
                        <th>Línea</th>
                        <th>Columna</th>
                    </tr>
                </thead>
                <tbody>`;

        // Iteramos sobre cada entrada en la tabla para generar las filas
        tabla.forEach((entrada) => {
            tablaHTML += `
                <tr>
                    <td>${entrada.id}</td>
                    <td>${entrada.tipo}</td>
                    <td>${entrada.tipoDato}</td>
                    <td>${entrada.ambito}</td>
                    <td>${entrada.linea}</td>
                    <td>${entrada.columna}</td>
                </tr>`;
        });

        // Cerramos la tabla
        tablaHTML += `
                </tbody>
            </table>`;
    document.getElementById("tabSim").innerHTML = tablaHTML;
      
    //ast.innerHTML = JSON.stringify(sentencias, null, 2)
    
    } catch (error) {

        console.log(error);
        const linea=error.location.start.line
        const column=error.location.start.column
      
        const tablaErroresHTML = `
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Error</th>
                    <th>Fila</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>01</td>
                    <td>${error.message}</td>
                    <td>${linea}</td>
                    <td>${column}</td>
                </tr>
               
            </tbody>
        </table>
    `;
    document.getElementById("tabla-errores").innerHTML = tablaErroresHTML;

        
    }
    
    
})

const AbrirArchivos = document.getElementById('abrirCosas')

AbrirArchivos.addEventListener('click', () => {
    
    document.getElementById('archivo').click();
});


// Escucha el cambio en el input file cuando se selecciona un archivo
document.getElementById('archivo').addEventListener('change', function() {
    const archivo = this.files[0];

    if (archivo) {
        const lector = new FileReader();

        lector.onload = function(e) {
            const contenido = e.target.result;
            
            //document.getElementById('contenido').textContent = contenido;
            EditorMonaco.setValue(contenido);
        };

        lector.readAsText(archivo);
    } else {
        alert("Por favor, selecciona un archivo .oak");
    }
});


const GuardarArchivos = document.getElementById('btnGuardar')

GuardarArchivos.addEventListener('click', () => {
    const contenido = EditorMonaco.getValue();
            const blob = new Blob([contenido], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "archivo.oak";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
});

