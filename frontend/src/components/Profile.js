import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import avatar from '../images/user-avatar-reloaded.png';
import Loading from './Loading';
import { Helmet } from 'react-helmet-async';

const API_URL = process.env.REACT_APP_API_URI || "http://localhost:8080";

function Profile() {
    const { user, logoutUser } = useContext(UserContext);
    const navigate = useNavigate();

    const onClick = async () => {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }
            
            // Only logout on the frontend after successful server logout
            logoutUser();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
        }
    };

    const editProfile = () => {
        navigate('/edit-profile');
    };
    const commentsfetch = () =>{
        navigate(`/usercomments/${user._id}`);
    }
    const blogsFetch = () =>{
        navigate(`/blogs/${user._id}`);
    }


    const handleDelete = async () => {
        const confirmation = window.prompt("Enter 'CONFIRM' to delete your profile:");

        if (confirmation === 'CONFIRM') {
            try {
                const response = await fetch(`${API_URL}/profile/${user?._id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || 'Profile deleted successfully.');
                    logoutUser();
                    navigate('/signup');
                } else {
                    console.error(data.message);
                    alert(data.message || 'Failed to delete profile.');
                }
            } catch (e) {
                console.error('Error deleting profile:', e);
                alert('An error occurred while deleting the profile.');
            }
        } else {
            alert("Profile deletion canceled. You must enter 'CONFIRM' to delete.");
        }
    };

    if (!user) {
        return <Loading/>
    }

    return (
        <div className='profile-body'>
            <Helmet>
                <title>Prayatak - Profile </title>
            </Helmet>
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-side">
                        <img src={avatar} alt="Profile Avatar" className="profile-picture" />
                        <h2 className="username">{user.name}</h2>
                        <button className="btn-profile edit-profile" onClick={editProfile}>
                            Edit Profile
                        </button>
                    </div>

                    <div className="profile-info">
                        <h3 className='profile-h3'>Information</h3>
                        <div className="info-row">
                            <p>
                                <strong>Email: </strong>
                                {user.email}
                            </p>
                            <p>
                                <strong>Phone: </strong>
                                {user.phoneNumber || 'Not provided'}
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {user.address || 'Not provided'}
                            </p>
                        </div>

                        <h3 className='profile-h3'>Actions</h3>
                        <nav className="content-navigation">
                            <button className="nav-btn" aria-label="View Blog Entries" onClick={blogsFetch}>
                                Blog Entries
                            </button>
                            <button className="nav-btn" aria-label="View Comments" onClick={commentsfetch}>
                                Comments
                            </button>
                            {/* <button className="nav-btn" aria-label="View Items Reported">
                                Items Reported
                            </button>
                            <button className="nav-btn" aria-label="View Lost Items Claimed">
                                Lost Items Claimed
                            </button> */}
                        </nav>

                        <div className="profile-actions">
                            <button className="btn-profile delete-profile" onClick={handleDelete}>
                                Delete Profile
                            </button>
                            <button className="btn-profile logout" onClick={onClick}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
