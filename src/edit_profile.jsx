import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    gender,
    maritalStatus,
    subCaste,
    gotra, // Not used in this version but kept for consistency
    education,
    profession,
    country, // Not used in this version but kept for consistency
    radioDefault, // Assuming this is for radio options/defaults
    complexion, // Not used in this version but kept for consistency
    bg, // Not used in this version but kept for consistency
    food, // Not used in this version but kept for consistency
    age // Not used in this version but kept for consistency
} from './constants';

// Dummy fallback data (for simulation, you'd replace this with a real fetch)
const fallbackUsersData = {
    '1': { 
        uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        first_name: 'Fallback Alice', 
        last_name: 'Johnson', 
        email: 'alice.j@example.com',
        phone: '1234567890',
        sub_caste: '1', // Corresponds to subCaste[1]
        address_1: '123 Main St',
        address_2: 'Apt 2B',
        city: 'Metropolis',
        state: 'NY',
        country: 'USA',
        date_of_birth: '1997-01-15',
        gender: '0', // Corresponds to gender[0]
        marital_status: '1', // Corresponds to maritalStatus[1]
        organization_name: 'Tech Corp',
        is_verified: true,
        educationl_info: {
            education: '2', // Corresponds to education[2]
            profession: '3', // Corresponds to profession[3]
            annual_income: '500,000',
            income: '100,000',
            service: 'Software Development'
        }
    },
    // Add more fallback users if needed
};

// Helper function to convert dropdown value to a string/integer based on data type
const normalizeValue = (key, value) => {
    // Check if the key corresponds to a numeric-indexed constant
    const numericKeys = ['sub_caste', 'gender', 'marital_status'];
    if (numericKeys.includes(key) && value !== "") {
        return parseInt(value);
    }
    // Check for nested keys like educationl_info.education
    if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.');
        if (childKey === 'education' || childKey === 'profession') {
            return value !== "" ? parseInt(value) : null; // Handle null/empty for optional fields
        }
    }
    return value;
};


const EditProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useParams(); // ID from URL parameter

    // Initialize state with data passed via navigation (if available) or an empty structure
    const initialUserState = location.state?.userProfile || {
        uuid: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        sub_caste: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        country: '',
        date_of_birth: '',
        gender: '',
        marital_status: '',
        organization_name: '',
        educationl_info: {
            education: '',
            profession: '',
            annual_income: '',
            income: '',
            service: ''
        }
    };

    const [editableUser, setEditableUser] = useState(initialUserState);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Data Fetching and Initialization ---
    useEffect(() => {
        if (!location.state?.userProfile) {
            // Fallback: If no state is passed (e.g., page refresh), fetch data using the ID
            console.warn("State data missing. Simulating ID-based data retrieval.");
            const fallbackData = fallbackUsersData[userId];
            if (fallbackData) {
                setEditableUser(fallbackData);
            } else {
                setMessage(`User with ID: ${userId} not found.`);
                setIsSuccess(false);
            }
        }
    }, [userId, location.state?.userProfile]);

    if (!editableUser.uuid && !location.state?.userProfile) {
        return <div>Loading or User not found...</div>;
    }

    // --- Handler Functions ---

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            // Handle nested fields like educationl_info.education
            const [parentKey, childKey] = name.split('.');
            setEditableUser(prev => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            // Handle top-level fields
            setEditableUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsSuccess(null);

        // Prepare data for API: Convert string values (from select/input) to correct types (int/string)
        const updatedData = { ...editableUser };

        // Clean up nested fields for submission
        // if (updatedData.educationl_info) {
        //     updatedData.educationl_info.education = normalizeValue('educationl_info.education', updatedData.educationl_info.education);
        //     updatedData.educationl_info.profession = normalizeValue('educationl_info.profession', updatedData.educationl_info.profession);
        // }

        // Clean up top-level fields
        updatedData.sub_caste = normalizeValue('sub_caste', updatedData.sub_caste);
        updatedData.gender = normalizeValue('gender', updatedData.gender);
        updatedData.marital_status = normalizeValue('marital_status', updatedData.marital_status);

        console.log('Submitting Updated Profile:', updatedData);
        
        try {
            // Simulate API Call for Profile Update (Replace with your actual PUT/PATCH API call)
            // Example API URL: import.meta.env.VITE_APP_URL + 'admin/users/update'
            
            
            const url = import.meta.env.VITE_APP_URL + 'admin/users/update';
            const response = await fetch(url, {
                method: 'PATCH', // Use PATCH for partial update
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa("admin:admin@7641")}`, 
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            // On successful update:
            setMessage('Profile updated successfully! 🎉');
            setIsSuccess(true);
            setIsLoading(false);
            navigate(`/profile/${updatedData.uuid}`,  { state: { userProfile: updatedData } })
            // Optionally, update the local state with the server response if fields were transformed
            // setEditableUser(result.user);
            

            // --- Simulation Success Block ---
            // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            // setMessage('Profile updated successfully! 🎉 (Simulated)');
            // setIsSuccess(true);
            // setIsLoading(false);
            // --- End Simulation ---

        } catch (error) {
            console.error('Update failed:', error);
            setMessage(`Update failed! Error: ${error.message || 'An unknown error occurred'}`);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render Logic ---
    const getOptionList = (constantArray) =>
        constantArray.map((label, index) => (
            <option key={index} value={index}>
                {label}
            </option>
        ));

    return (
        <div className="edit-profile-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button 
                    onClick={handleGoToDashboard}
                    style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    &larr; Go to User List
                </button>
            </div>
            
            {message && (
                <div 
                    style={{ 
                        padding: '10px', 
                        marginBottom: '20px',
                        borderRadius: '5px',
                        backgroundColor: isSuccess ? 'lightgreen' : 'lightcoral',
                        color: isSuccess ? 'green' : 'red'
                    }}
                >
                    {message}
                </div>
            )}

            <h1>Edit Profile: {editableUser.first_name} {editableUser.last_name}</h1>
            
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Personal Information */}
                <div style={{ gridColumn: '1 / 3' }}>
                    <h2>Personal Information</h2>
                    <hr/>
                </div>
                
                <label>
                    First Name:
                    <input type="text" name="first_name" value={editableUser.first_name} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>
                
                <label>
                    Last Name:
                    <input type="text" name="last_name" value={editableUser.last_name} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>

                <label>
                    Email:
                    <input type="email" name="email" value={editableUser.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>

                <label>
                    Phone:
                    <input type="tel" name="phone" value={editableUser.phone} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>
                
                <label>
                    Date of Birth:
                    <input type="text" name="date_of_birth" value={editableUser.date_of_birth} /*onChange={handleChange}*/ required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>
                
                <label>
                    Gender:
                    <select name="gender" value={editableUser.gender} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
                        <option value="">Select Gender</option>
                        {getOptionList(gender)}
                    </select>
                </label>

                <label>
                    Marital Status:
                    <select name="marital_status" value={editableUser.marital_status} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
                        <option value="">Select Status</option>
                        {getOptionList(maritalStatus)}
                    </select>
                </label>
                
                <label>
                    Sub-Caste:
                    <select name="sub_caste" value={editableUser.sub_caste} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
                        <option value="">Select Sub-Caste</option>
                        {getOptionList(subCaste)}
                    </select>
                </label>

                {/* Address Information */}
                <div style={{ gridColumn: '1 / 3' }}>
                    <h2>Address</h2>
                    <hr/>
                </div>

                <label>
                    Address Line 1:
                    <input type="text" name="address_1" value={editableUser.address_1} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>
                
                <label>
                    Address Line 2:
                    <input type="text" name="address_2" value={editableUser.address_2} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>
                
                <label>
                    City:
                    <input type="text" name="city" value={editableUser.city} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>

                <label>
                    State:
                    <input type="text" name="state" value={editableUser.state} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>
                
                <label>
                    Country:
                    <input type="text" name="country" value={editableUser.country} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                </label>
                
                {/* Educational/Professional Information */}
                <div style={{ gridColumn: '1 / 3' }}>
                    <h2>Professional Details</h2>
                    <hr/>
                </div>

                <label>
                    Education:
                    <select 
                        name="educationl_info.education" 
                        value={editableUser.educationl_info?.education || ''} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                    >
                        <option value="">Select Education</option>
                        {getOptionList(education)}
                    </select>
                </label>
                
                <label>
                    Profession:
                    <select 
                        name="educationl_info.profession" 
                        value={editableUser.educationl_info?.profession || ''} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                    >
                        <option value="">Select Profession</option>
                        {getOptionList(profession)}
                    </select>
                </label>
                
                <label>
                    Organization Name:
                    <input 
                        type="text" 
                        name="organization_name" 
                        value={editableUser.organization_name || ''} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} 
                    />
                </label>

                <label>
                    Annual Income:
                    <input 
                        type="text" 
                        name="educationl_info.annual_income" 
                        value={editableUser.educationl_info?.annual_income || ''} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} 
                    />
                </label>
                
                <label>
                    Income:
                    <input 
                        type="text" 
                        name="educationl_info.income" 
                        value={editableUser.educationl_info?.income || ''} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} 
                    />
                </label>
                
                <label>
                    Service Details:
                    <input 
                        type="text" 
                        name="educationl_info.service" 
                        value={editableUser.educationl_info?.service || ''} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} 
                    />
                </label>

                {/* Submit Button */}
                <div style={{ gridColumn: '1 / 3', textAlign: 'center', marginTop: '20px' }}>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            padding: '12px 30px', 
                            cursor: 'pointer', 
                            backgroundColor: isLoading ? '#888' : '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        {isLoading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;