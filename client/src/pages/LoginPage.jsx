import { useState,useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';


export default function LoginPage() {
  const {login} = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleLogin(e){
    e.preventDefault()
    
    console.log(username);
    

        if (!username) {
          setMessage("Username is required");
          Swal.fire({
            icon: 'error',
            text: message,
          });
          console.log(message);
          return;
        } else if (!password){
          setMessage("Password is required");
          Swal.fire({
            icon: 'error',
            text: message,
          });
          return;
        }

        if (password !== '' && username !== '') {
            login(username, password)
        }
    }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div id='form' className="container py-5">
        <h1 className="text-center mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username" className="text-muted">
              Username:
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password" className="text-muted">
              Password:
            </label>
          </div>
          <button className="btn btn-dark w-100 rounded" type='submit'>Log In</button>
          <div className="mt-3 text-center">
            <p>Dont have an account? <a href="/signup">Sign in</a></p>
          </div>
          <div className="mt-3 text-center">
            <p>Forgot password? <a href="/resetpassword">Reset password</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
