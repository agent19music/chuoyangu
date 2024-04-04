import React,{useState, useContext} from 'react'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


export default function ResetPassword() {
        const navigate = useNavigate();
        const{apiEndpoint} = useContext(UserContext);
        const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [newPassword, setNewPassword] = useState('');
        // const [message, setMessage] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        let message = '';

        function resetPassword(e) {
            e.preventDefault()         
           console.log(username + " " + email); 
           console.log(newPassword + ""+ confirmPassword);
            if (newPassword !== confirmPassword) {
                Swal.fire({
                  icon: 'error',
                  text: 'Passwords do not match!',
                  timer: 1500
                });
               return
              }  
    
            else if (email !== '' && username !== '') {
                const requestData = {
                    username: username,
                    email: email,
                    new_password: newPassword,
                };
                console.log(requestData);
                fetch(`${apiEndpoint}/reset_password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                })
                .then((res) => res.json())
                .then((response) => {
                    if (response.message) {
                       
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() => {
                        clearForm();
                        navigate("/login");
                        });
                        
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: response.error,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                })
            }
        }
        const clearForm = () => {
            setUsername('');
            setEmail('');
            setNewPassword('');
            setConfirmPassword('');
        };
  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        
      }}>
    <div id='form' className="container py-5">
        <h1 className="text-center mb-4">Reset Password</h1>
        <form onSubmit={resetPassword}>
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <label htmlFor="username" className="text-muted">
                            Username:
                        </label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label htmlFor="email" className="text-muted">
                            Email:
                        </label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            id="newPassword"
                            className="form-control"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="newPassword" className="text-muted">
                            New Password:
                        </label>
                    </div>
                </div>
                        <div className="col-md-6">
            <div className="form-floating mb-3">
                <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
                <label htmlFor="confirmPassword" className="text-muted">
                    Confirm Password:
                </label>
            </div>
        </div>

                <div className="col-md-12">
                <button className="btn btn-dark w-100 rounded" type='submit'>Reset Password</button>
                    {message && <p className="mt-3">{message}</p>}
                </div>
            <p className="mt-3 text-center">Take me to <a href="/login">Log in</a></p>

            </div>
        </form>
    </div>
    </div>
  )
}
