import React from "react";
import { Link } from "react-router-dom";
const unSignedUser = () => {
  return (
    <div className='unsigned-user'>
      <Link to='/signin'>Sign in</Link>
      <Link to='/signup'>Sign up</Link>
    </div>
  );
};

export default unSignedUser;
