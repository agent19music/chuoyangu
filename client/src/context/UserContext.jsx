import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const UserContext = createContext()


export default function UserProvider({ children }) {

  const navigate = useNavigate()
    
  const [onchange, setOnchange] = useState(false)
  const [authToken, setAuthToken] = useState(() =>
    sessionStorage.getItem('authToken')
      ? sessionStorage.getItem('authToken')
      : null
  )
  const [currentUser, setCurrentUser] = useState(null)

  const apiEndpoint = ' http://127.0.0.1:5000'
  // const apiEndpoint = 'https://chuo-yangu.onrender.com'

  function login(username, password) {
    fetch(`${apiEndpoint}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.access_token) {
          sessionStorage.setItem('authToken', response.access_token);
          setAuthToken(response.access_token);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Login successful.',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setOnchange(!onchange);
            navigate('/');
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Incorrect username or password',
          });
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  }

   // Logout user
   function logout() {
    sessionStorage.removeItem('authToken')
    setCurrentUser(null)
    setAuthToken(null)
    setOnchange(!onchange)
    navigate('/login')
  }

   // Get Authenticated user
   useEffect(() => {
    if (authToken) {
      fetch(`${apiEndpoint}/authenticated_user`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.email || response.username) {
            setCurrentUser(response)
          } else {
            setCurrentUser(null)
          }
        })
    }
  }, [authToken, onchange])

  const updateUserContext = () => {
    fetch(`${apiEndpoint}/authenticated_user`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.email || response.username) {
          setCurrentUser(response)
        } else {
          setCurrentUser(null)
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

   // context data
   const contextData = {
    login,
    logout,
    currentUser,
    authToken,
    onchange,
    setOnchange, 
    apiEndpoint,
    updateUserContext
  }

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  )
}