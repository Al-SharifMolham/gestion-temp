import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import storage from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(storage.getUser());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = storage.getToken();

            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const userData = await authService.getMe();
                setUser(userData);
                storage.setUser(userData);
            } catch (err) {
                console.error('Auth check failed', err);
                storage.clear();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const { token, user } = await authService.login(email, password);
            storage.setToken(token);
            storage.setUser(user);
            setUser(user);
            return user;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        storage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);