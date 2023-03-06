import { AuthTypeEnum } from "src/auth/auth.enum/auth.enum";

export class GenerateToken {
    private username: string;
    private password: string;
    private type: AuthTypeEnum;

    constructor(username: string, password: string, type: AuthTypeEnum) {
        this.username = username;
        this.password = password;
        this.type = type;
    }
}