import React, { useState, useEffect, use } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  gender,
  maritalStatus,
  subCaste,
  gotra,
  education,
  profession,
  country,
  radioDefault,
  complexion,
  bg,
  food,
  age
} from './constants';
// Dummy fallback data (optional, but recommended if direct state data is missing)
const fallbackUsersData = {
  1: { name: 'Alice Johnson (Fallback)', age: 28, bio: 'Fallback data: loves hiking.' },
  // ...
};

const Profile = () => {
  // 1. Get the data passed in the state (if available)
  const location = useLocation();
  const stateUser = location.state?.userProfile;
  const navigate = useNavigate();

  // 2. Get the ID from the URL (always available)
  const { userId } = useParams();

  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const handleGoToDashboard = () => {
    // The path '/' is defined as your Dashboard route in App.jsx
    navigate('/dashboard'); 
  };

  const handleProfileVerification = async (uuid, is_verified) => {
    // Simulate profile verification process
    var url = is_verified ? import.meta.env.VITE_APP_URL+'admin/users/unverify' : import.meta.env.VITE_APP_URL+'admin/users/verify';
    const response = await fetch(url,{
            method: 'POST',
            headers: {
                // Set the Content-Type header
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa("admin:admin@7641")}`, 
                // Set the Accept-Language header
                'Accept-Language': 'en-US,en;q=0.9',
            },
            body: JSON.stringify({ 'uuid': uuid })
        });
        if (!response.ok) {
           setMessage(`Verification failed! Error: ${errorMessage}`);
            setIsSuccess(false); 
          throw new Error(`HTTP error! status: ${response.status}`);
        }else{
            is_verified ? setMessage('User has been successfully unverified! 🎉') :
            setMessage('User has been successfully verified! 🎉');
            setIsSuccess(true);
        }

    
    // console.log(`Verifying profile for user with UUID: ${uuid}`);   
  }

  const handleDelete = async (uuid) => {
    const isConfirmed = window.confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
    );

    if (isConfirmed) {
        
        var url = import.meta.env.VITE_APP_URL+'/admin/users/delete';
        const response = await fetch(url,{
                method: 'DELETE',
                headers: {
                    // Set the Content-Type header
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa("admin:admin@7641")}`, 
                    // Set the Accept-Language header
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                body: JSON.stringify({ 'uuid': uuid })
            });
            if (!response.ok) {
            setMessage(`Deletion failed! Error: ${errorMessage}`);
                setIsSuccess(false); 
            throw new Error(`HTTP error! status: ${response.status}`);
            }else{
                setMessage('User has been successfully Deleted! 🎉')
                navigate('/dashboard');
            }
        }
  }
    // In a real app, this would perform the verification logic
    // and update the verificationStatus accordingly.

  useEffect(() => {
    if (stateUser) {
      // ✅ Use the data passed directly via navigation state
      setUserProfile(stateUser);
    } else {
      // ❌ Fallback: If the state data is missing (e.g., user refreshed the page 
      // or manually entered the URL), use the ID to fetch the data.
      
      console.warn("State data missing. Falling back to ID-based data retrieval.");
      // In a real app:
      // fetch(`/api/users/${userId}`)
      
      // Simulation of a fallback fetch:
      setUserProfile(fallbackUsersData[userId] || null);
    }
  }, [userId, stateUser]);

  if (!userProfile) {
    return <div>User with ID: {userId} not found (or data failed to load).</div>;
  }

  return (
    
    <div className="profile-container">
        <button 
        onClick={handleGoToDashboard}
        style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
      >
        Go to User List
      </button>

      {/* The Delete Button positioned absolutely */}
            <button 
                className="delete-button" 
                onClick={() => handleDelete(userProfile.uuid)}
                aria-label="Delete Profile"
                style={{
                    margin: '0 15px',
                    padding: '10px',
                    cursor: 'pointer',
                    color: 'white',
                    backgroundColor: 'red',
                    border: 'none'
                }}
            >
                🗑️ Delete Profile
            </button>

      <div style={{ margin: '15px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
        <h2>Verification Status</h2>
        
        {userProfile.is_verified ? (
          <>
            {/* <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Profile is Verified!</p> */}
            <button 
              onClick={() => handleProfileVerification(userProfile.uuid, userProfile.is_verified)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: 'red',
                color: 'white',
                border: 'none'
              }}
            >
              Unverify Profile
            </button>
          </>
          
          
        ) : (
          <>
            {/* <p style={{ color: 'red' }}>❌ Profile is Not Yet Verified.</p> */}
            {/* 🚀 The Verify Button */}
            <button 
              onClick={() => handleProfileVerification(userProfile.uuid, userProfile.is_verified)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none'
              }}
            >
              Verify Profile
            </button>
          </>
        )}
      </div>
      {message && (
        <div style={{ padding: '10px', backgroundColor: isSuccess ? 'lightgreen' : 'lightcoral' }}>
            {message}
        </div>
     )}
      <h1>User Profile: {userProfile.first_name}  {userProfile.last_name}</h1>
      <table className="profile-table">
        <tr> 
            <td>
                <strong>Name:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.first_name} {userProfile.last_name}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Email:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.email}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Phone:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.phone}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Sub-caste:</strong>
            </td>
            <td></td><td></td>
            <td>
                {subCaste[parseInt(userProfile.sub_caste)]}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Address:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.address_1} {userProfile.address_2}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>City:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.city}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>State:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.state}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Country:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.country}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Date of Birth:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.date_of_birth}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Gender:</strong>
            </td>
            <td></td><td></td>
            <td>
                {gender[parseInt(userProfile.gender)]}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Education:</strong>
            </td>
            <td></td><td></td>
            <td>
               {education[parseInt(userProfile.education)]}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Job:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.job_title}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Orgnization:</strong>
            </td>
            <td></td><td></td>
            <td>
                {userProfile.organization_name}
            </td>
        </tr>
        <tr> 
            <td>
                <strong>Marital Status:</strong>
            </td>
            <td></td><td></td>
            <td>
                {maritalStatus[parseInt(userProfile.marital_status)]}
            </td>
        </tr>
      </table>
    </div>
  );
};

export default Profile;