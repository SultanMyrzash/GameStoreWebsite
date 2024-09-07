import { useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

export default function Logout() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    useEffect(() => {
        localStorage.clear();
        setUser(null);// set user to null, navbardy refresh zhasap otyrmas ushin
        toast.success('Logged out successfully', {
            id: 'success1',
        })

        navigate('/login');
    }, [navigate, setUser]);

    return null;
}
