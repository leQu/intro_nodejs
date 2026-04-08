
const { ObjectId } = require('mongodb');


// för att hantera användardata

class User {
    // Skapa en ny användare
    static create(name, email) {
        return {
            name: name,
            email: email,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    // Uppdatera befintlig användare
    static update(name, email) {
        return {
            name: name,
            email: email,
            updatedAt: new Date()
        };
    }

    // Formatera användare för svar (ta bort känslig data om det finns)
    static format(user) {
        if (!user) return null;
        
        const { _id, name, email, createdAt, updatedAt } = user;
        return {
            id: _id,
            name,
            email,
            createdAt,
            updatedAt
        };
    }
}

module.exports = User;