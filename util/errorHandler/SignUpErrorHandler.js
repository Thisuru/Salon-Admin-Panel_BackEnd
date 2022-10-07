// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { firstname : '', lastname: '', username: '', phonenumber: '', email: '', password: '' };
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('User validation failed')) {
      console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

  module.exports = {
    handleErrors
  }