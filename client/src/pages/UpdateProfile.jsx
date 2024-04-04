import React, { useState, useContext, useEffect } from 'react';
import '../App.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

function UpdateProfile() {
  const navigate = useNavigate();
  const { currentUser, authToken, updateUserContext, apiEndpoint } = useContext(UserContext);

  // Initialize state with current user data
  const [email, setEmail] = useState(currentUser.email || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [imageUrl, setImageUrl] = useState(currentUser.image_url || ''); 
  const [phoneNo, setPhoneNo] = useState(currentUser.phone_no || ''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(currentUser.first_name || '');
  const [lastName, setLastName] = useState(currentUser.last_name || '');
  const [course, setCourse] = useState(currentUser.course || '');
  const [gender, setGender] = useState(currentUser.gender || '');
 


  useEffect(() => {
    
    // Update state when currentUser changes
    setEmail(currentUser.email || '');
    setUsername(currentUser.username || '');
    setFirstName(currentUser.first_name || '');
    setLastName(currentUser.last_name || '');
    setCourse(currentUser.course || '');
    setGender(currentUser.gender || '');
    setImageUrl(currentUser.image_url || ''); 
    setPhoneNo(currentUser.phone_no || '');
  }, [currentUser]);

  const updateUser = async (e) => {
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
      const response = await fetch(`${apiEndpoint}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email,
          username,
          password,
          first_name: firstName,
          last_name: lastName,
          category: course,
          gender,
          image_url: imageUrl, 
          phone_no: phoneNo
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update user context with the updated user information
        updateUserContext();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your profile has been updated.',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/myprofile');
      } else if (response.status === 500) {
        Swal.fire({
          icon: 'error',
          text: 'An error occurred: ' + data.message,
        });
      } else if (response.status === 400) {
        Swal.fire({
          icon: 'error',
          text: 'Oops! ' + data.message,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        text: 'A network error occurred: ' + error.message,
      });
    }
  };


  return (
    <div id='form' className="container py-5">
      <h1 className="text-center mb-4">Update Profile</h1>
      <form onSubmit={updateUser}>
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
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password" className="text-muted">
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
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword" className="text-muted">
                Confirm New Password:
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="imageUrl"
                className="form-control"
                placeholder="Enter your image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <label htmlFor="imageUrl" className="text-muted">
                Image URL:
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="phoneNo"
                className="form-control"
                placeholder="Enter your phone number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <label htmlFor="phoneNo" className="text-muted">
                Phone Number:
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
                <option value="Product Design">Product Design</option>
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
            <button className="btn btn-dark w-100 rounded" type="submit">
              Update Profile
            </button>
          </div>
          <div className="mt-3 text-center">
            <p>Want to cancel? <Link to="/myprofile">Go back to profile</Link></p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
