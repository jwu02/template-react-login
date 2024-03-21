export interface Role {
    roleId: number;
    authority: Roles;
}

export enum Roles {
    Admin = "ADMIN",
    User = "USER"
}