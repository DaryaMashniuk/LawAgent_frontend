
import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import { AUTH_TOKEN } from "../utils/Constants";
import { useCallback } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [authToken, setAuthToken]= useState('')

    useEffect(() => {
        const token = localStorage.getItem(AUTH_TOKEN);
        if (token) {
            setUser({ token });
            setAuthToken({token})
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setAuthError(null);
        try {
            const { token } = await apiLogin(credentials);
            localStorage.setItem(AUTH_TOKEN, token);
            setUser({ token });
            setAuthToken({token})
            return { success: true };
        } catch (error) {
            console.log("AuthContext error")
            console.log(error.message)
            setAuthError(error.message || 'Login failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setAuthError(null);
    }, []);

    const register = async (userData) => {
        try {
            const { token } = await apiRegister(userData);
            localStorage.setItem(AUTH_TOKEN, token);
            setUser({ token });
            setAuthToken({token})
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            localStorage.removeItem(AUTH_TOKEN);
            setUser(null);
            setAuthToken(null)
            return { success: true };
        } catch (error) {
            console.error("Logout failed:", error);
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user,authToken, login, register, logout, loading, authError, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);