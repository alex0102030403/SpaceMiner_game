

import React, { useState } from 'react';
import axios from 'axios';

import * as fs from "fs/promises"
import { time } from 'console';
import { TIMEOUT } from 'dns';

import { BrowserRouter as Router, Route, Link ,Navigate, useNavigate, Routes, useLocation } from 'react-router-dom';

import App from './App';
import { router } from './routes';


interface Account {
    name: string;
    password: string;
}




function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Check if username is unique
    // Add new account to the JSON file
    // You need to implement this logic using a backend server
    console.log(`Registering new account: ${username}`);
    
    const data = {name : username, password : password};

    //call the backend server to add the new account to the JSON file
    const response = axios.post('http://localhost:8080/api/data', data);
    console.log(response);
    
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

function Login() {

   

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    // Check if username and password match
    // You need to implement this logic using a backend server
    console.log(`Logging in with username: ${username}`);
    // call the backend server to check if the username and password match

    const data = await axios.get('http://localhost:8080/api/data');
    console.log(data.data);
    setUsername(data.data[0].name);
    setPassword(data.data[0].password);

      
    for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].name === username && data.data[i].password === password) {
            console.log("Login successful");
            //go to the main page
            router.navigate('/app');
            window.location.reload();
            
        }
    }
        
      
      
    
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function LoginComponent() {
    
    
    return (
        
        
        <div>
           
            
        <Register />
        <Login />
        </div>
    

        
        
    );
}

export default LoginComponent;
