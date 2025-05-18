import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";

function Layout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-800 shadow">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <NavLink 
                                to="/" 
                                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                            >
                                Главная
                            </NavLink>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <NavLink 
                                        to="/profile" 
                                        className={({ isActive }) => 
                                            `text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${isActive ? "bg-gray-900" : ""}`
                                        }
                                    >
                                        Профиль
                                    </NavLink>
                                    <LogoutButton />
                                </>
                            ) : (
                                <NavLink 
                                    to="/login" 
                                    className={({ isActive }) => 
                                        `text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${isActive ? "bg-gray-900" : ""}`
                                    }
                                >
                                    Вход
                                </NavLink>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-grow bg-gray-50">
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <p className="text-sm">Создано: Машнюк Дарья</p>
                    <p className="text-sm">БГУ: 2025</p>
                </div>
            </footer>
        </div>
    );
}

export default Layout;