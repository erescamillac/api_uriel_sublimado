// ESTABLECER LOS PARÁMETROS DE CONFIGURACIÓN de conexio a LA BASE DE DATOS

// VARIABLES de ENTORNO:
require('dotenv').config();

const Pool = require('pg').Pool
// VARIABLES DE ENTORNO (SO: Debian...)
// ** export VARIABLES DE ENTORNO para que sean duraderas entre Sesiones (Linux / Debian)
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
})


//CREAR UNA RUTA PARA RECUPERAR TODOS LOS Productos DE LA BASE DE DATOS

const getProductos = (request, response) => {
	let consulta = 'SELECT * FROM producto';
	console.log('getProductos()...');
	// console.log('Datetime [%s]', new Date().toJSON());
	// console.log(event.toLocaleString('en-GB', { timeZone: 'UTC' }));
	console.log( new Date().toLocaleString('es-MX', { timeZone: 'UTC' }));

	// Current timezone (nodejs)
	console.log( 'Current timezone IN nodejs :: ' );
	process.env.TZ = 'America/Mexico_City';
	console.log( process.env.TZ );
	
	console.log( 'Datetime CDMX...' ); 
	console.log( new Date().toLocaleString('es-MX') );
	// America/Mexico_City

	console.log( 'Test de Variable e ENTORNO [process.env.VARIABLE1EEC]' );
	console.log( process.env.VARIABLE1EEC );
	
	
	console.log('Ejecutando la CONSULTA (SQL) :: [%s]...', consulta);
    	pool.query( consulta, (error, results) => {
        	if(error){
            		throw error
        	}
        	response.status(200).json(results.rows)
    	})
}

//CREAR UNA RUTA PARA RECUPERAR UN Producto especifico DE LA BASE DE DATOS (dado su codigo de barras)

const getProductoByCodigoBarras = (request, response) => {

   // const codigobarras = parseInt(request.params.codigobarras)
	const codigobarras = request.params.codigobarras
	let consulta = 'SELECT * FROM producto WHERE codigo_barras = $1';
	console.log('getProductoByCodigoBarras()...');
	console.log('codigobarras :: [%s]', codigobarras);
	console.log( 'Datetime : [%s]', new Date().toJSON() );
	console.log( 'Ejecutando la CONSULTA (SQL) :: [%s]', consulta );

    	pool.query( consulta, [codigobarras], (error, results) => {
        	if(error){
            		throw error
        	}
        	response.status(200).json(results.rows)
    	})
}

//CREAR UNA RUTA PARA AGREGAR UN Producto A LA BASE DE DATOS

const createProducto = (request, response) => {
    const { nombre, descripcion, urlimagen, precioventa, fechacreacion, codigobarras } = request.body

	let consulta = 'INSERT INTO producto (nombre, descripcion, url_imagen, precio_venta, fecha_creacion, codigo_barras) VALUES ($1, $2, $3, $4, LOCALTIMESTAMP(0), $5)';
	console.log('createProducto()...');
	console.log('nombre del producto: [%s]', nombre);
	console.log( 'Datetime: [%s]', new Date().toJSON() );
	console.log( 'Ejecutando la consulta SQL :: [%s]...', consulta );
    
    	pool.query( consulta, [nombre, descripcion, urlimagen, precioventa, codigobarras], (error, results) => {
        	if (error){
            		throw error
        	}
        	// response.status(201).send('El Producto ha sido agregado a la base de datos')
		response.status(201).json({ mensaje: 'El producto ha sido agregado a la BD.'});
    	})
}

//CREAR UNA RUTA PARA ACTUALIZAR UN REGISTRO (Producto)  EN LA BASE DE DATOS

const updateProducto = (request, response) => {
    const id = parseInt(request.params.id)
    const {nombre, descripcion, urlimagen, precioventa, codigobarras} = request.body

	let consulta = 'UPDATE producto SET nombre = $1, descripcion = $2, url_imagen = $3, precio_venta = $4, codigo_barras = $5 WHERE id = $6';
	console.log( 'updateProducto()...' );
	console.log( 'nuevo nombre del producto: [%s]', nombre );
	console.log( 'Datetime: [%s]', new Date().toJSON() );
	console.log( 'Ejecutando la consulta SQL :: [%s]', consulta );
    
    pool.query(
        consulta,
        [nombre, descripcion, urlimagen, precioventa, codigobarras, id],
        (error, results) => {
            if (error) {
                throw error
            }
            //response.status(200).send('La tabla Pais ha sido actualizada en la base de datos')
		response.status(200).json({mensaje: 'La tabla [producto] HA SIDO ACTUALIZADA en la BD.'});
        }
    )
}

//CREAR UNA RUTA PARA ELIMINAR UN Producto de LA BASE DE DATOS

const deleteProducto = (request, response) => {
    const id = parseInt(request.params.id)
    
    pool.query('DELETE FROM producto WHERE id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
       //response.status(200).send(`Pais eliminado con ID: ${id}`)
	response.status(200).json({mensaje: `PRODUCTO eliminado con ID: ${id}`});
    })
}

module.exports = {
    getProductos,
    getProductoByCodigoBarras,
    createProducto,
    updateProducto,
    deleteProducto
}
