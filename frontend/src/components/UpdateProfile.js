import React, { useState } from "react";
import {
  changePasswordMutation,
  getProfileInfoQuery,
  updateProfileMutation,
} from "../queries/projectQueries";
import { useMutation } from "@apollo/client";
import Status from "./Status";
import Spinner from "./Spinner";

const UpdateProfile = ({ isOpen, user, node, close }) => {
  const userData = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();

  const [fullName, setFullName] = useState();
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();

  const [changePassword, { loading }] = useMutation(changePasswordMutation);
  const [updateProfile, { loading: updateProfileLoading }] = useMutation(
    updateProfileMutation
  );

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (confirmPassword != newPassword) {
      setError("password should match");
      return;
    }
    try {
      const { data } = await changePassword({
        variables: {
          currentPassword,
          newPassword,
        },
      });
      if (data) {
        localStorage.setItem("userInfo", JSON.stringify(data.changePassword));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data } = await updateProfile({
        variables: {
          user: {
            userName,
            fullName,
            email,
          },
        },
        refetchQueries: [
          { query: getProfileInfoQuery, variables: { id: userData.id } },
        ],
      });
      if (data) {
        close();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) {
    return null;
  }
  return (
    <>
      {userData && (
        <>
          <div className='overlay'></div>
          <div ref={node} className='edit-profile'>
            <h2>Edit Profile</h2>
            <div className='update-info'>
              <span className='edit-profile-header'>Update Profile</span>
              <div>
                <label>userName</label>
                <input
                  className='gen-input'
                  onChange={(e) => setUserName(e.target.value)}
                  defaultValue={user.userName}
                  type='text'
                />
              </div>
              <div>
                <label>Full Name</label>
                <input
                  className='gen-input'
                  onChange={(e) => setFullName(e.target.value)}
                  defaultValue={user.fullName}
                  type='text'
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  className='gen-input'
                  onChange={(e) => setEmail(e.target.value)}
                  defaultValue={user.email}
                  type='email'
                />
              </div>
              <div className='update-btn'>
                <button onClick={handleUpdateProfile}>Update</button>
              </div>
              {updateProfileLoading ? <Spinner /> : null}
            </div>
            <form
              className='change-password'
              onSubmit={(e) => handleChangePassword(e)}
            >
              <span className='edit-profile-header'>change password</span>
              <div>
                <label>Current Password</label>
                <input
                  className='gen-input'
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required={true}
                  type='password'
                />
              </div>
              <div>
                <label>New Password</label>
                <input
                  className='gen-input'
                  onChange={(e) => setNewPassword(e.target.value)}
                  required={true}
                  type='password'
                />
              </div>
              <div>
                <label>Confirm Password</label>
                <input
                  className='gen-input'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={true}
                  type='password'
                />
              </div>
              <div className='update-btn'>
                <button>Update</button>
              </div>
              {loading ? <Spinner /> : null}
            </form>
            {error ? <Status isOpen={true} message={error} /> : null}
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProfile;
