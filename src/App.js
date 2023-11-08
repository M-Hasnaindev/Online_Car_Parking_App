import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Signup from './signup'
import Login from './login'
import Home from './home'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Admindashboard from './admindashboard';
import { Helmet } from 'react-helmet';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [userUid, setUserUid] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserUid(uid);
      } else {
        setUserUid('');
      }
    });
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/admin-dashboard' element={<Admindashboard/>}/>
        </Routes>
      </Router>
      <ToastContainer theme='dark'/>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Helmet>
    </>
  );
}

export default App;
