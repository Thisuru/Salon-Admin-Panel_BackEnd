// handle errors
const userServerError = (err, errors, modelName, res) => {
    console.log(err.message, err.code);
    // let errors = { firstname : '', lastname: '', username: '', phonenumber: '', email: '', password: '' };

    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes(modelName + ' validation failed')) {
      console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    // return errors;
    return res.status(400).send({ status: false, error: errors || "Error creating the " + modelName + "!" })
  }

  module.exports = {
    userServerError
  }