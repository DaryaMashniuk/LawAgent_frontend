import React from "react";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            className="text-white px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            Выйти
        </button>
    );
};

export default LogoutButton;