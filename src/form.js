import React, { useState, useEffect } from "react";
import { DatePicker, Space } from "antd";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import form_banner from "./Assest/formBannner.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAxvXXJk9oEXw-I8KcpncKowPLqs9V5KpE",
  authDomain: "car-parking-app-auth0-host.firebaseapp.com",
  databaseURL: "https://car-parking-app-auth0-host-default-rtdb.firebaseio.com",
  projectId: "car-parking-app-auth0-host",
  storageBucket: "car-parking-app-auth0-host.appspot.com",
  messagingSenderId: "603857041110",
  appId: "1:603857041110:web:f29f702dcb7147ae4bbb77",
};

// const app = initializeApp(firebaseConfig); 

function Form(props) {
  const [showSlot, setShowSlot] = useState(true);
  const [showPay, setShowPay] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [duration, setDuration] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [monthOfBirth, setMonthOfBirth] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [genderMale, setGenderMale] = useState("");
  const [genderFemale, setGenderFemale] = useState("");
  const [card, setCard] = useState("");
  const [paypal, setPaypal] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showTabs, setShowTabs] = useState("bookparking");
  const [showFeedback, setShowFeedback] = useState(false);
  const [userUid, setUserUid] = useState("");

  const { RangePicker } = DatePicker;

  const navigate = useNavigate();

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log("User UID:", uid);
    } else {
      console.log("No user is currently signed in.");
    }
  });


  const handleSubmitFeedback = (event) => {
    event.preventDefault();
    const customerFeedbackDb = getDatabase(app)
    const feedback = document.getElementById("subject").value;
    if (feedback.trim() === "") {
      alert("Please enter feedback before submitting.");
      return;
    }
    const feedbackData = {
      feedback: feedback,
      timestamp: new Date().toString(),
    };

    const feedbackRef = push(ref(customerFeedbackDb, "/Costumer Feedback Data"), feedbackData);
    feedbackRef
      .then(() => {
        console.log("Feedback saved to Firebase with key:", feedbackRef.key);
        toast.success("Feedback submitted successfully.");
      })
      .catch((error) => {
        console.error("Error saving feedback to Firebase:", error);
        toast.error("Error saving feedback to Firebase");
      });
  }
    
  const handleLogout = () => {
    navigate("/login")
    toast.success(`${email} logout successfully.`)
  }

  const handleShowFeedback = () => {
    setShowHistory(false);
    setShowFeedback(true);
    setShowSlot(false);
  };

  const handleShowHistoryOnClick = () => {
    setShowHistory(true);
    setSelectedSlot(false);
    console.log("chala shahyad");
  };

  const handleHideHistory = () => {
    setShowHistory(false);
  };

  const handleShowSlot = () => {
    setShowSlot(true);
    setShowHistory(false);
  };

  const handleShowPay = (slot) => {
    setSelectedSlot(slot);
    setShowPay(true);
    setShowHistory(false);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
      const hoursDiff = (end - start) / 1000 / 60 / 60;
      setDuration(hoursDiff);
    }
  };
  const [databaseRef, setDatabaseRef] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("chalna start")
        const db = getDatabase(app);
        const bookingsRef = ref(db, 'bookings');

        onValue(bookingsRef, (snapshot) => {
          console.log('dsda ')
          const data = snapshot.val();
          
          if (data) {
            const bookingArray = Object.values(data);
            setBookings(bookingArray);
          }
        });
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchData();
    // console.log(fetchData);
  }, []);
  const [showDuration, setShowDuration] = useState(false);

  const handlePayNow = () => {
    if (startDate && endDate && selectedSlot) {
      const formData = {
        fullName,
        email,
        password,
        dateOfBirth,
        monthOfBirth,
        yearOfBirth,
        genderMale,
        genderFemale,
        card,
        paypal,
        cardNumber,
        cardCvc,
        cardDate,
        cardYear,
      };

      const data = {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        duration,
        slot: selectedSlot,
        formData: formData,
      };

      if (databaseRef) {
        const newBookingRef = push(databaseRef, data);
        newBookingRef
          .then((snapshot) => {
            console.log("Data saved to Firebase with key:", snapshot.key);
            toast.success("You Booked Slot Successfully", { autoClose: 9000 });
          })
          .catch((error) => {
            console.error("Error saving data to Firebase:", error);
            toast.error("Error saving data to Firebase");
          });
      }
      setStartDate(null);
      setEndDate(null);
      setDuration(null);
      setShowSlot(false);
      setShowPay(false);
      setFullName("");
      setEmail("");
      setPassword("");
      setDateOfBirth("");
      setMonthOfBirth("");
      setYearOfBirth("");
      setGenderMale("male");
      setGenderFemale("female");
      setCard("");
      setPaypal("");
      setCardNumber("");
      setCardCvc("");
      setCardDate("");
      setCardYear("");

      props.onPayNow();
    } else {
      alert(
        "Please select a date range, a slot, and complete the form before submitting."
      );
    }
  };

  return (
    <>
      <div className="from">
        <div className="main_form">
          <div
            className="main-form"
            style={{ height: showTabs === "history" ? "130vh" : "232vh" }}
          >
            <div className="top_banner_section">
              <div className="bannerImage">
                <img
                  className="formBannerImg"
                  src={form_banner}
                  alt="banner here"
                />
              </div>
            </div>
            <div className="middle_menu_section">
              <div className="nav">
                <ul className="menu">
                  <li
                    className="menu_item"
                    onClick={() => setShowTabs("history")}
                  >
                    History
                  </li>
                  <li
                    className="menu_item"
                    onClick={() => setShowTabs("bookparking")}
                  >
                    Book Parking
                  </li>
                  <li className="menu_item">Slot</li>
                  <li
                    className="menu_item"
                    onClick={() => setShowTabs("feedback")}
                  >
                    Feedback
                  </li>
                  <li
                    className="menu_item"
                    onClick={() => setShowTabs("profile")}
                  >
                    Profile
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="history_section"
              style={{ display: showTabs === "history" ? "block" : "none" }}
            >
              <h2>User History:</h2>
              <table>
                <thead>
                  <tr>
                    <th>Slot</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((bookings, index) => (
                    <tr key={index}>
                      <td>{bookings.slot}</td>
                      <td>{bookings.startDate}</td>
                      <td>{bookings.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="feedback_section"
              style={{ display: showTabs === "feedback" ? "block" : "none" }}
            >
              <form action="">
                <label for="subject">Give Your Feedback</label>
                <textarea
                  id="subject"
                  name="subject"
                  placeholder="Write something.."
                  style={{ height: "200px" }}
                ></textarea>

                <input type="submit" value="Submit"onClick={handleSubmitFeedback}  />
              </form>
            </div>
            <div
              className="profile_section"
              style={{ display: showTabs === "profile" ? "block" : "none" }}>
                <h1>profile</h1>
                <br />
                <div className="twos_button">
                    <div className="book_now_abhi">
                        <button className="button_class">Book Now</button>
                    </div>
                    <div className="logout_abhi" onClick={handleLogout}>
                        <button className="logout_class">Logout</button>
                    </div>
                </div>
              </div>
            <div
              className="parent"
              style={{ display: showTabs === "bookparking" ? "block" : "none" }}
            >
              <div className="bottom_heading_section">
                <div className="heading_book_slot">
                  <h2 className="book_slot">Book Slot</h2>
                </div>
              </div>
              <div className="fotter_fields_section">
                <Space
                  className="center"
                  style={{ display: "flex" }}
                  direction="vertical"
                  size={12}
                >
                  <RangePicker showTime onChange={handleDateChange} />
                </Space>
              </div>
              <div className="slot_selecting_section">
                <div className="select_slot">
                  <div className="select_slot_button">
                    <button className="slot" onClick={handleShowSlot}>
                      Select Slot
                    </button>
                  </div>
                </div>
              </div>
              <div className="showSlot">
                <div className="show_section">
                  <div className="slot_div">
                    <div className="slot_button">
                      <button
                        className={`slot_btn ${
                          selectedSlot === "Slot 1" ? "selected" : ""
                        }`}
                        onClick={() => handleShowPay("Slot 1")}
                      >
                        Slot 1
                        {duration && selectedSlot === "Slot 1" && (
                          <div className="duration">
                            Duration: {duration} hours
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="slot_button">
                      <button
                        className={`slot_btn ${
                          selectedSlot === "Slot 2" ? "selected" : ""
                        }`}
                        onClick={() => handleShowPay("Slot 2")}
                      >
                        Slot 2
                        {duration && selectedSlot === "Slot 2" && (
                          <div className="duration">
                            Duration: {duration} hours
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="slot_button">
                      <button
                        className={`slot_btn ${
                          selectedSlot === "Slot 3" ? "selected" : ""
                        }`}
                        onClick={() => handleShowPay("Slot 3")}
                      >
                        Slot 3
                        {duration && selectedSlot === "Slot 3" && (
                          <div className="duration">
                            Duration: {duration} hours
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="slot_button">
                      <button
                        className={`slot_btn ${
                          selectedSlot === "Slot 4" ? "selected" : ""
                        }`}
                        onClick={() => handleShowPay("Slot 4")}
                      >
                        Slot 4
                        {duration && selectedSlot === "Slot 4" && (
                          <div className="duration">
                            Duration: {duration} hours
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="slot_button">
                      <button
                        className={`slot_btn ${
                          selectedSlot === "Slot 5" ? "selected" : ""
                        }`}
                        onClick={() => handleShowPay("Slot 5")}
                      >
                        Slot 5
                        {duration && selectedSlot === "Slot 5" && (
                          <div className="duration">
                            Duration: {duration} hours
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="slot_button">
                      <button
                        className={`slot_btn ${
                          selectedSlot === "Slot 6" ? "selected" : ""
                        }`}
                        onClick={() => handleShowPay("Slot 6")}
                      >
                        Slot 6
                        {duration && selectedSlot === "Slot 6" && (
                          <div className="duration">
                            Duration: {duration} hours
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="payment_section">
                <div className="payment">
                  <div class="container">
                    <form>
                      <div class="row">
                        <h4>Account</h4>
                        <div class="input-group input-group-icon">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                          <div class="input-icon">
                            <i class="fa fa-user"></i>
                          </div>
                        </div>
                        <div class="input-group input-group-icon">
                          <input
                            type="email"
                            placeholder="Email Adress"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <div class="input-icon">
                            <i class="fa fa-envelope"></i>
                          </div>
                        </div>
                        <div class="input-group input-group-icon">
                          <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <div class="input-icon">
                            <i class="fa fa-key"></i>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-half">
                          <h4>Date of Birth</h4>
                          <div class="input-group">
                            <div class="col-third">
                              <input
                                type="text"
                                placeholder="DD"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                              />
                            </div>
                            <div class="col-third">
                              <input
                                type="text"
                                placeholder="MM"
                                value={monthOfBirth}
                                onChange={(e) =>
                                  setMonthOfBirth(e.target.value)
                                }
                              />
                            </div>
                            <div class="col-third">
                              <input
                                type="text"
                                placeholder="YYYY"
                                value={yearOfBirth}
                                onChange={(e) => setYearOfBirth(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-half">
                          <h4>Gender</h4>
                          <div class="input-group">
                            <input
                              id="gender-male"
                              type="radio"
                              name="gender"
                              value={genderMale}
                              onChange={(e) => setGenderMale(e.target.value)}
                            />
                            <label for="gender-male">Male</label>
                            <input
                              id="gender-female"
                              type="radio"
                              name="gender"
                              value={genderFemale}
                              onChange={(e) => setGenderFemale(e.target.value)}
                            />
                            <label for="gender-female">Female</label>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <h4>Payment Details</h4>
                        <div class="input-group">
                          <input
                            id="payment-method-card"
                            type="radio"
                            name="payment-method"
                            checked="true"
                            value={card}
                            onChange={(e) => setCard(e.target.value)}
                          />
                          <label for="payment-method-card">
                            <span>
                              <i class="fa fa-cc-visa"></i>Credit Card
                            </span>
                          </label>
                          <input
                            id="payment-method-paypal"
                            type="radio"
                            name="payment-method"
                            value={paypal}
                            onChange={(e) => setPaypal(e.target.value)}
                          />
                          <label for="payment-method-paypal">
                            {" "}
                            <span>
                              <i class="fa fa-cc-paypal"></i>Paypal
                            </span>
                          </label>
                        </div>
                        <div class="input-group input-group-icon">
                          <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                          <div class="input-icon">
                            <i class="fa fa-credit-card"></i>
                          </div>
                        </div>
                        <div class="col-half">
                          <div class="input-group input-group-icon">
                            <input
                              type="text"
                              placeholder="Card CVC"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                            />
                            <div class="input-icon">
                              <i class="fa fa-user"></i>
                            </div>
                          </div>
                        </div>
                        <div class="col-half">
                          <div class="input-group">
                            <select
                              value={cardDate}
                              onChange={(e) => setCardDate(e.target.value)}
                            >
                              <option>01 Jan</option>
                              <option>02 Jan</option>
                            </select>
                            <select
                              value={cardYear}
                              onChange={(e) => setCardYear(e.target.value)}
                            >
                              <option>2015</option>
                              <option>2016</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <h4>Terms and Conditions</h4>
                        <div class="input-group">
                          <input id="terms" type="checkbox" />
                          <label for="terms">
                            I accept the terms and conditions for signing up to
                            this service, and hereby confirm I have read the
                            privacy policy.
                          </label>
                        </div>
                      </div>
                      <div className="pay_now">
                        <button className="pay" onClick={handlePayNow}>
                          Pay Now
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form;
