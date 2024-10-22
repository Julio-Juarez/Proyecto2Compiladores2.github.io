

export class Errores{
    constructor(padre=undefined) {
        this.errores = {};
        this.padre=padre;
        contador=0;
    }

    /**
     * @param {string} tipoError
     * @param {string} descripcion
     * @param {int} fila
     * @param {int} columna
     */
    setError(tipoError, descripcion, fila, columna) {
        //
        this.valores.push({ tipoError: tipoError, descripcion: descripcion, fila:fila, columna:columna }); 
    }

    getErrores(){
        
        // Crear el contenedor de la tabla
    let tabla = '<table border="1" cellpadding="5" cellspacing="0">';
    
    // Crear la fila de encabezado
    tabla += '<thead><tr>';
    tabla += '<th>Tipo de Error</th>';
    tabla += '<th>Tipo de Error</th>';
    tabla += '<th>Descripción</th>';
    tabla += '<th>Fila</th>';
    tabla += '<th>Columna</th>';
    tabla += '</tr></thead>';
    
    let contador=0
    // Crear las filas de datos
    tabla += '<tbody>';
    this.errores.forEach(error => {
        contador++;
        tabla += '<tr>';
        tabla += `<td>${contador}</td>`;
        tabla += `<td>${error.tipoError}</td>`;
        tabla += `<td>${error.descripcion}</td>`;
        tabla += `<td>${error.fila}</td>`;
        tabla += `<td>${error.columna}</td>`;
        tabla += '</tr>';
    });
    tabla += '</tbody>';
    
    // Cerrar la tabla
    tabla += '</table>';
    
    return tabla;
    }
}