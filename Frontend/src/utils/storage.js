const TOKEN_KEY = 'timetable_token';
const USER_KEY = 'timetable_user';

export default {
    getToken: () => sessionStorage.getItem(TOKEN_KEY),
    setToken: (token) => sessionStorage.setItem(TOKEN_KEY, token),
    removeToken: () => sessionStorage.removeItem(TOKEN_KEY),

    getUser: () => {
        const user = sessionStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => sessionStorage.setItem(USER_KEY, JSON.stringify(user)),
    removeUser: () => sessionStorage.removeItem(USER_KEY),

    clear: () => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
    }
};