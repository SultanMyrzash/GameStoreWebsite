import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css'
import LoadingIndicator from "../components/LoadingIndicator";

export default function Login() {
    const [loading, setLoading] = useState(false);//loading oshiruli
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: '',
        password: '',
    });

    const loginUser = async (e) => {
        setLoading(true);//onSubmit loginUser bolganda loadingty korsetedi
        e.preventDefault()
        const { username, password } = data;
        try {
            const {data} = await axios.post('/login', { username, password });
            if (data.error) {
                toast.error(data.error);
            } else {
                const token = data.token;
                localStorage.setItem('token', token);
                setData({});
                navigate('/');
                navigate(0);
                // toast.success('Login successful');
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An error occurred');
                toast.error(error);
            }
        } finally {
            setLoading(false);//bitkennen song loadingty oshiredi
          }
    }

  return (
    <div>
        <form onSubmit={loginUser} className="form-container">
            <h1>Login</h1>
            <label>Username</label>
            <input className="form-input" type="text" placeholder='enter username' value={data.username} onChange={(e) => setData({...data, username: e.target.value})}/>
            <label>Password</label>
            <input className="form-input" type="password" placeholder='enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            {loading && <LoadingIndicator />}
            <button className="form-button" type='submit'>Login</button>
        </form>
    </div>
  )
};
