import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { registerUserMutation } from "../queries/userQueries";
import Status from "../components/Status";
import Spinner from "../components/Spinner";

const RegisterScreen = () => {
  const [userName, setUserName] = useState();
  const [firsName, setFirsName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();

  const [register, { loading }] = useMutation(registerUserMutation);

  const history = useHistory();

  const handleRegister = async (e) => {
    console.log(userName, email, password, firsName, lastName, confirmPassword);
    if (
      userName &&
      email &&
      password &&
      firsName &&
      lastName &&
      confirmPassword
    ) {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError("password should match");
      } else {
        try {
          const { data } = await register({
            variables: {
              user: {
                userName,
                fullName: `${firsName} ${lastName}`,
                password,
                email,
              },
            },
          });

          if (data) {
            history.push("/signin");
          }
        } catch (error) {
          console.log(error.message);
          setError(error.message);
        }
      }
    }
  };

  return (
    <>
      <form className='register-form'>
        <h2 class='form-title'>Create account</h2>
        <div class='form-group names'>
          <input
            type='text'
            className='form-input'
            name='name'
            id='firstName'
            placeholder='First Name'
            onChange={(e) => setFirsName(e.target.value)}
            required={true}
          />
          <input
            type='text'
            className='form-input'
            name='name'
            id='secondName'
            placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}
            required={true}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            className='form-input'
            name='username'
            id='username'
            placeholder='Username'
            onChange={(e) => setUserName(e.target.value)}
            required={true}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            className='form-input'
            name='email'
            id='email'
            placeholder='Your Email'
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-input'
            name='password'
            id='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-input'
            name='re_password'
            id='re_password'
            placeholder='Repeat your password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={true}
          />
        </div>
        <section>
          <input
            type='submit'
            className='form-btn'
            onClick={(e) => handleRegister(e)}
            value='Sign Up'
          />
          <Link to='/signin'>Already have Account? sign in </Link>
        </section>
        {error ? <Status message={error} close={() => setError(null)} /> : null}
        {loading ? (
          <div style={{ width: 70 + "%" }}>
            <Spinner />
          </div>
        ) : null}
      </form>
    </>
  );
};

export default RegisterScreen;
