import bcrypt from "bcryptjs";

const generatePassword = async (): Promise<void> => {
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);
};

generatePassword();