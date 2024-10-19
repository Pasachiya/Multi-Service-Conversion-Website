import { API_ENDPOINTS } from '../config';

   // ... (rest of the imports)

   export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     // ... (other code)

     const fetchUser = async (token: string) => {
       try {
         const response = await fetch(`${API_ENDPOINTS.AUTH}/protected`, {
           headers: {
             'Authorization': `Bearer ${token}`
           }
         });
         // ... (rest of the function)
       } catch (error) {
         // ... (error handling)
       }
     };

     const login = async (username: string, password: string) => {
       const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ username, password }),
       });

       // ... (rest of the function)
     };

     const register = async (username: string, password: string) => {
       const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ username, password }),
       });

       // ... (rest of the function)
     };

     // ... (rest of the component)
   };