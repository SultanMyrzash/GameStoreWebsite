import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            axios.post("/profile", { token }).then(({data}) => {
                setUser(data);
                if (data !== null){
                    toast.success('Login successful', {
                        id: 'success1',//duplicate bolmas ushin
                    })
                } else console.log(data);
            }).catch(err => {
                console.error(err);
                localStorage.removeItem('token'); // Remove token if the request fails
            });
        }
    }, []);

    return ( 
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}