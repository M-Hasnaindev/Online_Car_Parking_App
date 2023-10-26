import React, { useState } from "react";
import Logo from "./Assest/logo.png";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify'

function Signup() {
  const [showFirstStep, setShowFirstStep] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userType, setUserType] = useState("");
  const setTypeUser = "user";
  const setTypeAdmin = "admin";

  const handleUserButtonClick = () => {
    setShowFirstStep(false);
    setUserType(setTypeUser);
    console.log(setTypeUser);
  };

  const handleAdminButtonClick = () => {
    // setShowFirstStep(false);
    navigate("/login")
    setUserType(setTypeAdmin);
    console.log(setTypeAdmin);
  };

  const navigate = useNavigate();

  const [userData, setuserData] = useState({
    fullname: "",
    email: "",
    password: "",
    Contact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    const { fullname, email, password, Contact } = userData;

    if (fullname && email && password && Contact && userType) {
      setIsSaving(true);
      const db = getDatabase(app);
      const auth = getAuth();

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userRef =ref(db, `user/${user.uid}`);
  
        const userDataWithUserType = { uid: user.uid, userType, ...userData };

        set(userRef, userDataWithUserType)
          .then(() => {
            navigate("/login")
            console.log("User Signup successfully!");
            toast.success(`${email} Signup Successfully.`);
          })
          .catch((error) => {
            console.error(
              "Error adding user data to Firebase Realtime Database: ",
              error
            );
          });
        setTimeout(() => {
          setIsSaving(false);
        }, 2000);
      } catch (error) {
        console.log("Error creating user:", error);
      }
    } else {
      toast.error("Please fill in all the fields");
    }
  };

  const firebaseConfig = {
    apiKey: "AIzaSyAxvXXJk9oEXw-I8KcpncKowPLqs9V5KpE",
    authDomain: "car-parking-app-auth0-host.firebaseapp.com",
    databaseURL: "https://car-parking-app-auth0-host-default-rtdb.firebaseio.com",
    projectId: "car-parking-app-auth0-host",
    storageBucket: "car-parking-app-auth0-host.appspot.com",
    messagingSenderId: "603857041110",
    appId: "1:603857041110:web:f29f702dcb7147ae4bbb77"
  };

  const app = initializeApp(firebaseConfig);

  return (
    <div className="signup_page">
      <div className="main-page">
        <h1 className="signup_heading">SignUp</h1>
        <div className="first_step"
        style={{ display: showFirstStep ? "flex" : "none" }}>
          <div className="image_right">
            <img className="main_banner_img" src={Logo} alt="image" />
          </div>
          <div className="left_buttons">
            <div className="buttons_left">
              <button className="form_btn" onClick={handleAdminButtonClick}>
                Admin
              </button>
              <button className="form_btn" onClick={handleUserButtonClick}>
                User
              </button>
            </div>
          </div>
        </div>
        <div className="second_step"
          style={{ display: showFirstStep ? "none" : "flex" }}>
          <div className="image_right">
            <img className="form_image" src={Logo} alt="image" />
          </div>
          <div className="left_form">
            <div className="sign-from">
              <div className="form-sign">
                <div className="sign">
                  <label htmlFor="forEveryone">Full Name:</label>
                  <input
                    type="text"
                    name="fullname"
                    id="foreveryone"
                    placeholder="Your Name"
                    value={userData.fullname}
                    onChange={handleChange}
                  />
                </div>
                <div className="sign">
                  <label htmlFor="forEmail">Email:</label>
                  <input
                    type="text"
                    name="email"
                    id="forEmail"
                    placeholder="example@gmail.com"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="sign">
                  <label htmlFor="forPassword">Password:</label>
                  <input
                    type="text"
                    name="password"
                    id="forPassword"
                    placeholder="**********"
                    value={userData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="sign">
                  <label htmlFor="forContact">Contact</label>
                  <input
                    type="number"
                    name="Contact"
                    id="forContact"
                    placeholder="+92 1234567890"
                    value={userData.Contact}
                    onChange={handleChange}
                  />
                </div>
                <div className="sign">
                  <button className="submit" type="submit" onClick={handleSignup}>
                    Signup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isSaving && <div className="loader">Saving...</div>}
      </div>
    </div>
  );
}

export default Signup;
