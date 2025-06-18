import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import avatar from '../images/user-avatar-reloaded.png';
import Loading from './Loading';
import ButtonSpinner from './ButtonSpinner';
import { Helmet } from 'react-helmet-async';

const API_URL = process.env.REACT_APP_API_URI || "http://localhost:8080";

function Profile() {
    const { user, logoutUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onClick = async () => {
        try {
            setIsLoggingOut(true);
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
        } finally {
            setIsLoggingOut(false);
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
                setIsDeleting(true);
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
            } finally {
                setIsDeleting(false);
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
                        </div>
                        <div className="info-row">
                            <p>
                                <strong>Phone Number: </strong>
                                {user.phoneNumber}
                            </p>
                        </div>
                        <div className="info-row">
                            <p>
                                <strong>Address: </strong>
                                {user.address}
                            </p>
                        </div>

                        <div className="profile-actions">
                            <button className="btn-profile logout" onClick={onClick} disabled={isLoggingOut} style={{position: 'relative'}}>
                                {isLoggingOut ? (
                                    <>
                                        <span>Logging out</span>
                                        <ButtonSpinner variant="clip" position="inline" size={12} />
                                    </>
                                ) : 'Logout'}
                            </button>
                            <button className="btn-profile blogs" onClick={blogsFetch}>
                                Your Blogs
                            </button>
                            <button className="btn-profile comments" onClick={commentsfetch}>
                                Your Comments
                            </button>
                            <button className="btn-profile delete" onClick={handleDelete} disabled={isDeleting} style={{position: 'relative'}}>
                                {isDeleting ? (
                                    <>
                                        <span>Deleting Account</span>
                                        <ButtonSpinner variant="clip" position="inline" size={12} />
                                    </>
                                ) : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Profile;
