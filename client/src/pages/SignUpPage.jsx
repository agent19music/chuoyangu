import React, { useState, useContext } from 'react';
import '../App.css'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function SignUpPage() {
    const navigate = useNavigate();
    const {apiEndpoint} = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [course, setCourse] = useState('');
    const [gender, setGender] = useState('');

    

    const addUser = async (e) => {
      e.preventDefault();
      // Check if passwords match
      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          text: 'Passwords do not match!',
        });
        return;
      }
      
      try {
        const response = await fetch(`${apiEndpoint}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            category: course,
            gender
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your account has been created, login.',
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/login')
        } else if (response.status === 409) {
          Swal.fire({
            icon: 'error',
            text: 'Username or email already exists!',
          });
        } else if (response.status === 500){
          Swal.fire({
            icon: 'error',
            text: 'An error occurred: ' + data.message,
          })
        }else if (response.status === 400) {
          Swal.fire({
            icon: 'error',
            text: 'Oops ! ' + data.message,
          });}
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          text: 'A network error occurred: ' + error.message,
        });
      }
    };

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
      }}>
        <div id='form' className="container py-5">
      <h1 className="text-center mb-4">Signup</h1>
      <form onSubmit={addUser}>
        <div className="row g-4">
        <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                id="firstName"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <label htmlFor="firstName" className="text-muted">
                                First Name:
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                id="lastName"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <label htmlFor="lastName" className="text-muted">
                                Last Name:
                            </label>
                        </div>
                    </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email" className="text-muted">
                Email:
              </label>
            </div>
          </div>
          <div className="col-md-6">
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
          </div>
          <div className="col-md-6">
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
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword" className="text-muted">
                Confirm Password:
              </label>
            </div>
          </div>

                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <select
                                id="course"
                                className="form-select rounded"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                            >
                                <option value="">Select Course</option>
                                <option value="Software Engineering">
                                    Software Engineering
                                </option>
                                <option value="UI/UX">UI/UX</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Cybersec">Cyber Security</option>
                            </select>
                            <label htmlFor="course" className="text-muted">
                                Course Enrolled:
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <select
                                id="gender"
                                className="form-select rounded"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                            <label htmlFor="gender" className="text-muted">
                                Gender:
                            </label>
                        </div>
                    </div>
          <div className="col-12">
            <button className="btn btn-dark w-100 rounded" type="submit">Sign Up</button>
          </div>
          <div className="mt-3 text-center">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
      </form>
    </div>
    </div>
    );
};

export default SignUpPage;
