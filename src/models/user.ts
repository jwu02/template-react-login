import { Role } from "./role";

export interface User {
    userId: number;
    username: string;
    authorities: Role[];
}