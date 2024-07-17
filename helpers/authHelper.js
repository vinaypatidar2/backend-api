import bcrypt from 'bcrypt';

export const hashPassword = async(password) => {
    try {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};

export const comparePassword = async(password, hashedPassword) =>{
    return bcrypt.compare(password, hashedPassword);
};