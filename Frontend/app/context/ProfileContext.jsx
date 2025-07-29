// context/ProfileContext.js
import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  return (
    <ProfileContext.Provider value={{ isNewUser, setIsNewUser, profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext };

export const useProfile = () => useContext(ProfileContext);
