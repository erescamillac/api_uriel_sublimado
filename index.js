const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8300
const db = require('./queries')


app.use(express.json())

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});




// GET Request to root URL (/)
app.get('/', (request, response) => {
    response.json({Bienvenido: "Creando API con node.js, express y postgresql --Test API Sublimado--"})
})

app.get('/productos', db.getProductos)
app.get('/productos/:codigobarras', db.getProductoByCodigoBarras)
app.post('/productos', db.createProducto)
app.put('/productos/:id', db.updateProducto)
app.delete('/productos/:id', db.deleteProducto)

app.listen(port, () => {
    console.log(`Aplicación ejecutandose en el puerto ${port}.`)
})
