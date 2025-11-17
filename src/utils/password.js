import bcrypt from 'bcrypt';

 const hashPassword = (password) => bcrypt.hashSync(password, 10);
 const comparePassword = (password, hashed) => bcrypt.compareSync(password, hashed);

export default {
    hashPassword,
    comparePassword
};