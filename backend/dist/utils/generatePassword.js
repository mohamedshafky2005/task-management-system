"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generatePassword = async () => {
    const password = "123456";
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    console.log(hashedPassword);
};
generatePassword();
//# sourceMappingURL=generatePassword.js.map