

//valdiering av användre sker här.

const validateUser = ( req, res, next) => {

    console.log("Validator reached!");  // <-- Add this line
    console.log("req.body:", req.body);  // <-- And this

    if (!req.body) {
        return res.status(400).json({
        error: "Request body missing"
        });
    }

     const { name, email} = req.body;
     const errors = [];

     //vadliering av namn
        if(!name) {
            errors.push('Name is required');
        } else if(typeof name !== 'string') {
            errors.push('Name must be a string');
        }else if(name.length < 2){
            errors.push('Name must be at least 2 characters long');
        }

    //validering av email
        if(!email){
            errors.push('Email is required');
        }else if(typeof email !== 'string'){
            errors.push('Email must be a string');
        }else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                errors.push('Email is not valid');
            }
        }
    
    
        if(errors.length > 0) {
            return res.status(400).json({ errors });
        }
        next(); //viktigt!

};

//glöm ej att exportera!
module.exports = {
    validateUser
};

