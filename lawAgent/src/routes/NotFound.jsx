import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">Страница не найдена</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                    К сожалению, страница, которую вы ищете, не существует или была перемещена.
                </p>
                <div className="mt-6">
                    <Link 
                        to="/" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Вернуться на главную
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;