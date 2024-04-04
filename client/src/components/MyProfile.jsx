import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

function MyProfile() {
    const { currentUser, logout } = useContext(UserContext);
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow">
                        <div className="card-body text-center">
                            <div className="user-info-picture mb-4">
                                {/* Added alt prop */}
                                <img
                                    className="img-fluid rounded-circle"
                                    src={currentUser.image_url || "/default-pfp.jpg"}
                                    alt={currentUser.username ? `${currentUser.username}'s Profile Picture` : "Profile Picture"}
                                />
                            </div>
                            <h4 className="mb-4">My INFO:</h4>
                            <div className="user-info-details mb-3">
                                <div className="info-item">
                                    <strong>USERNAME:</strong> <span>{currentUser.username}</span>
                                </div>
                                <div className="info-item">
                                    <strong>EMAIL:</strong> <span>{currentUser.email}</span>
                                </div>
                                <div className="info-item">
                                    <strong>FIRST NAME:</strong> <span>{currentUser.first_name}</span>
                                </div>
                                <div className="info-item">
                                    <strong>LAST NAME:</strong> <span>{currentUser.last_name}</span>
                                </div>
                                <div className="info-item">
                                    <strong>PHONE NO:</strong> <span>{currentUser.phone_no || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                    <strong>COURSE :</strong> <span>{currentUser.course || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-white border-0 text-center">
                            <Link to={'/updateprofile'} className="btn btn-dark w-100 rounded mr-2 mb-3">Update</Link>
                            <button className="btn btn-dark w-100 rounded mb-3 " onClick={() => logout()}>Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
