import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { toast } from "react-toastify";
import { 
    validateForm, 
    validateUsername, 
    validatePassword, 
    validateEmail, 
    validateSubscription,
    validateConfirmPassword
} from "../validator/UserValidator";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { DOCUMENT_CATEGORIES } from "../utils/Constants";

const RegisterUser = () => {
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        subscription: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        subscription: "",
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const { errors: validationErrors, isValid } = validateForm(userData);
        setErrors(validationErrors);
        
        if (!isValid) {
            toast.error("Пожалуйста, исправьте ошибки в форме");
            return;
        }
        
        setLoading(true);
        try {
            const response = await register(userData);
            toast.success(response.message || "Регистрация успешна! Пожалуйста, войдите.");
            
            setTimeout(() => {
                navigate("/login", {
                    state: { 
                        registeredEmail: userData.email,
                        message: "Пожалуйста, войдите с вашими учетными данными"
                    }
                });
            }, 2000);
            
        } catch (err) {
            setErrors(err.response?.data?.error || "Ошибка регистрации");
            toast.error(err.response?.data?.error || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));

        switch(name) {
            case "username":
                setErrors(prev => ({ ...prev, username: validateUsername(value) }));
                break;
            case "password":
                setErrors(prev => ({ 
                    ...prev, 
                    password: validatePassword(value),
                    confirmPassword: validateConfirmPassword(value, userData.confirmPassword)
                }));
                break;
            case "confirmPassword":
                setErrors(prev => ({ 
                    ...prev, 
                    confirmPassword: validateConfirmPassword(userData.password, value)
                }));
                break;
            case "email":
                setErrors(prev => ({ ...prev, email: validateEmail(value) }));
                break;
            case "subscription":
                setErrors(prev => ({ ...prev, subscription: validateSubscription(value) }));
                break;
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Регистрация
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Имя пользователя
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.username ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    id="username"
                                    placeholder="Введите имя пользователя"
                                />
                                {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    id="email"
                                    placeholder="Введите ваш email"
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subscription" className="block text-sm font-medium text-gray-700">
                                Подписка
                            </label>
                            <div className="mt-1">
                    <select
                        name="subscription"
                        value={userData.subscription}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 border ${errors.subscription ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        id="subscription"
                    >
                        <option value="">Выберите тип подписки</option>
                        {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                    {errors.subscription && <p className="mt-2 text-sm text-red-600">{errors.subscription}</p>}
                </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Пароль
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={userData.password}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.password ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    id="password"
                                    placeholder="Введите пароль"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                            <p className="mt-2 text-sm text-gray-500">
                                Пароль должен содержать минимум 6 символов, включая 1 букву и 1 цифру
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Подтвердите пароль
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={userData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    id="confirmPassword"
                                    placeholder="Подтвердите пароль"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="termsCheck"
                                name="termsCheck"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                required
                            />
                            <label htmlFor="termsCheck" className="ml-2 block text-sm text-gray-900">
                                Я согласен с условиями использования
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Регистрация...
                                    </>
                                ) : "Зарегистрироваться"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterUser;