import React, { useEffect, useState } from 'react';
import { listOfUsers } from '../service/UserService';
import {useAuth} from '../context/AuthContext';

const ListOfUsersComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user,authToken } = useAuth();
    
    console.log("list of users");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await listOfUsers(authToken);
                setUsers(response.data);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setError("Failed to load users");
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user]);
    console.log(user);
    if (!user) return <div className="container">Please login to view users</div>;
    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container alert alert-danger">{error}</div>;

    return (
        <div className='container'> 
            <h2 className='text-center'>List of users</h2>
            <table className='table table-striped table-hover'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Subscription</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.subscription}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a href='/comparison'>Сравнение</a>
        </div>
    );
};

export default ListOfUsersComponent;