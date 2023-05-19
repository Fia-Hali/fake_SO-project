import React, { useState } from 'react';
import HomePage from './homepage';
import axios from 'axios';


export default function FakeStackOverflow() {
  const [name, setPage] = useState("welcome");

  function handleWelcome(p){
    setPage(p);
  }
  return ( <Welcome name={name} handleWelcome={handleWelcome}/>)
}

export function Welcome({name, handleWelcome}){
  const [user,setUser] = useState(null);
  function handleUser(user){
    setUser(user)
  }

  switch(name){
    case "welcome":
      return(
      <div>
        <div className="welcome-page">
          <h1>Welcome to our Fia & Auronas' fakeStackOverflow!</h1>
          <p>Please select an option to continue:</p>
          <div className="button-list">
              <button onClick={()=>{ handleWelcome("register");}}>Create Account</button>
              <button onClick={()=>{ handleWelcome("login")}}>Login</button>
              <button onClick={()=>{ handleWelcome("guest")}}>Continue as Guest</button>  
          </div>
        </div>
      </div>
      );
    case "register": return <CreateAccount handleWelcome={handleWelcome}/>;
    case "login": return <Login handleWelcome={handleWelcome} handleUser={handleUser}/>;
    case "guest": return <HomePage handleWelcome={handleWelcome} handleUser={handleUser} user={null}></HomePage> //login button => welcomw page
    case "home":  return <HomePage handleWelcome={handleWelcome} handleUser={handleUser} user={user}></HomePage>; // logout button
    default: handleWelcome("welcome"); //login in 
  }
}

// Use-Case 1: Create Account
const CreateAccount = ({handleWelcome}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerification] = useState('');
  const [error, setErrorMessage] = useState('');

  const handleSignUp = async (e) => {
    if(e){
      e.preventDefault();
    }
    // Perform validation checks
    if (!username || !email || !password || !passwordVerify) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    // Check if password contains username or email
    if (password.includes(username) || password.includes(email)) {
      setErrorMessage('Password cannot contain username or email');
      return;
    }

    if (password !== passwordVerify) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Check email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      // Send a POST request to the server to create the account
      const response = await axios.post('http://localhost:8000/signup', {
        name: username,
        email: email,
        password: password,
      });
      // Account created successfully, redirect to the login page
      console.log(response.data.message); 
      handleWelcome("login");

    }catch (error) {
      if(error.response.data.message) setErrorMessage(error.response.data.message);
      else setErrorMessage("aDtabase is not connected. Please try again")
    }
  };

  return (
    <div className='welcome-page'>
      <h1>New user? Sign up for a account here :D</h1>
      <div className="button-list">
        <div>
          {error && <label className='brightRed' >{error}</label>}
        </div>
        <div>
          <label>Username:</label>
          <br></br>
          <input type="text" value={username}  required onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        </div>
        <br />
        <div>
          <label>Email:</label>
          <br></br>
          <input type="email" value={email}  required onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <br></br> 
        <div>
          <label>Password:</label>
          <br></br>
          <input type="password" value={password}  required onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <br></br> 
        <div>
          <label>Confirm Password :</label>
          <br></br>
          <input type="password" value={passwordVerify}  required onChange={(e) => setPasswordVerification(e.target.value)} placeholder="Confirm Password" />
        </div>
        <br></br> 
        <div>
          <button onClick={()=>handleSignUp()}>Sign Up</button>
        </div>
        {backToWelcome(handleWelcome)}
      </div>
    </div>
  );
};

// Use-Case 2: Login
const Login = ({handleWelcome, handleUser}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
    const handleLogin = async (e) => {
      if (e) {
        e.preventDefault();
        setError('');
        // Rest of the code
      }
      

      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      const pattern= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      function handleError(e){setError(e);}

      try {
        // Send a POST request to the server to authenticate the user
        const response = await axios.post('http://localhost:8000/login', { email, password });
    
        if (response.status === 200) { 
        // Login successful, redirect to home page
            //handleUser("6463b1fe19f06cdd6bf50645");
            console.log(response.data.message+response.data.uid);
            getUser(handleError,response.data.uid, handleUser);
            handleWelcome("home");
            }
      } catch (error) {
        if(error.response.data.message) setError(error.response.data.message);
        else setError("aDtabase is not connected. Please try again")
      }
    };  

    const getUser = async (handleError,uid,handleUser)=>{
      axios.get(`http://localhost:8000/user/${uid}`)
      .then(res=>{console.log("find user:"+ res.data); handleUser(res.data)})
      .catch(error=> handleError(error));
  }

  handleUser(null);
    return (
      <div className='welcome-page'>
        <h1>Welcome back, please log in here XD</h1>
        <div className="button-list">
            <div>
              {error && <label className='brightRed' >{error}</label>}
            </div>
            <div>
              <label>Email:</label>
              <br></br>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <br></br>
            <div>
              <label>Password:  </label>
              <br></br>
              <input
                type="password" value={password}  onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <br></br>
            <div>
              <button type="submit" onClick={handleLogin}>Log in</button>
            </div>
            {backToWelcome(handleWelcome)}
        </div>
      </div>
    );
  };


// Use-Case 3: Logout of Account
export async function handleLogout(){
    try {
    let res= await axios.post('http://localhost:8000/logout')
    if (res.status === 200) {
      // Clear the session cookie
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
      // Logout successful, redirect to the welcome page
    } catch (error) {
     console.log("log out unsuccessfully; Disconnect with database ")
    }
  };

function backToWelcome(handleWelcome){
  return <button onClick={()=>handleWelcome("welcome")}>back to welcome</button>
}