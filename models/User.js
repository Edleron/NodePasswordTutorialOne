const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

// mongoose.model('User',   ==> Mongo Db'de Şema Adı
// UserSchema İse           ==> Şemanın Özellikleri Olucak
// module.exports = User    ==> Dışarıda Farklı bir Scriptte Kullanmak İçin Export Ettik