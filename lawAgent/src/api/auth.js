import api from '../service/UserService';

export const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
    } catch (error) {
        // Пробрасываем полный объект ошибки с данными от сервера
        if (error.response) {
            console.log("ERRORRRRRRRRRR")
            const serverError = {
                message: error.response.data?.error || 
                        error.response.data?.message || 
                        'Invalid credentials',
                status: error.response.status
            };
            throw serverError;
        }
        throw { message: 'Network error. Please try again later.' };
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post("/register", userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("ERRORRRRRRRRRR")
            throw error;
        }
        throw new Error("Network error. Please try again later.");
    }
};

export const logout = async () => {
    try {
        await api.post('/logout');
        return { success: true };
    } catch (error) {
        if (error.response) {
            throw error;
        }
        throw new Error("Network error. Please try again later.");
    }
};