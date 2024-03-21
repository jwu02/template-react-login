import { USER_STORAGE_KEY } from "./constants";
import { User } from "./models/user";

const getUserFromLocalStorage = (): User | null => {
    const userObject = localStorage.getItem(USER_STORAGE_KEY);

    try {
        return JSON.parse(userObject || '');
    } catch (error) {
        return null;
    }
}

export {
    getUserFromLocalStorage
}