const moongose = require('mongoose');
const UsuarioSchema = new moongose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    genero: {
        type: String,
        required: true
    },
    plataformas: {
        type: [String]
    }
});



module.exports = moongose.model('Usuario', UsuarioSchema);
