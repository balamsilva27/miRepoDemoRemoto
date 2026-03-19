const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Usuario = require('./models/usuario.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB 
mongoose.connect('mongodb://Admin:Kikin2612@ac-x95mtji-shard-00-00.jmfqzbi.mongodb.net:27017,ac-x95mtji-shard-00-01.jmfqzbi.mongodb.net:27017,ac-x95mtji-shard-00-02.jmfqzbi.mongodb.net:27017/?ssl=true&replicaSet=atlas-g4rykl-shard-0&authSource=admin&appName=Cluster0')
.then(()=>{console.log('Conexión exitosa a MongoDB')})
.catch(err=>console.log(err));

app.post('/api/usuarios', async (req, res) => {
    const nuevo = new Usuario(
        {
            nombre: req.body.nombre,
            email: req.body.email,
            genero: req.body.genero,
            plataformas: req.body.plataformas
        }
    );
    const guardado = await nuevo.save();
    res.json(guardado);
});

app.get('/api/usuarios', async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(
        usuarios.map((usuario) => ({
            id: usuario.id,
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            genero: usuario.genero,
            plataformas: usuario.plataformas 
        }))
    );
});

app.put('/api/usuarios/:id', async (req, res) => {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id,
        { nombre: req.body.nombre,
          email: req.body.email, 
          genero: req.body.genero, 
          plataformas: req.body.plataformas
        }, { new: true });

    res.json(usuarioActualizado);
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
