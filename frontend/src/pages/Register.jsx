import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css'
import LoadingIndicator from "../components/LoadingIndicator";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: '',
        password: '',
        password2: '',
    });

    const registerUser = async (e) => {
        setLoading(true);
        e.preventDefault();
        const { username, password, password2 } = data;
        try {
            const {data} = await axios.post('/register', { username, password, password2 });
            if (data.error) {
                toast.error(data.error);
            } else {
                setData({});
                toast.success('Registration Successful');
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An error occurred');
            }
        } finally {
            setLoading(false);
          }
    }

  return (
    <div>
        <form onSubmit={registerUser} className="form-container">
            <h1>Register</h1>
            <label>Username</label>
            <input type="text" className="form-input" placeholder='enter username' value={data.username} onChange={(e) => setData({...data, username: e.target.value})}/>
            <label>Password</label>
            <input type="password" className="form-input" placeholder='enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            <label>Confirm Password</label>
            <input type="password" className="form-input" placeholder='confirm password' value={data.password2} onChange={(e) => setData({...data, password2: e.target.value})}/>
            {loading && <LoadingIndicator />}
            <button className="form-button" type='submit'>Register</button>
        </form>
    </div>
  )
};

