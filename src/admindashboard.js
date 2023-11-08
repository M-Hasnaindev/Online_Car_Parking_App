import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import CountdownTimer from './countdownTimer'


const firebaseConfig = {
  apiKey: "AIzaSyAxvXXJk9oEXw-I8KcpncKowPLqs9V5KpE",
   authDomain: "car-parking-app-auth0-host.firebaseapp.com",
   databaseURL: "https://car-parking-app-auth0-host-default-rtdb.firebaseio.com",
   projectId: "car-parking-app-auth0-host",
   storageBucket: "car-parking-app-auth0-host.appspot.com",
   messagingSenderId: "603857041110",
   appId: "1:603857041110:web:f29f702dcb7147ae4bbb77",
 };
const app = initializeApp(firebaseConfig);

function AdminDashboard() {
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

  const handleTimerEnd = (bookingId) => {
    const updatedBookings = bookings.filter((booking) => booking.id !== bookingId);
    setBookings(updatedBookings);
  };

  return (
    <div>
      <h2>Admin Dashboard - All Bookings</h2>
      <table style={{color: "black"}}>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Duration</th>
            <th>Cancel Booking</th>
          </tr>
        </thead>
        <tbody>
        {bookings.map((booking, index) => (
            <tr   >
              <td>{booking.slot}</td>
              <td>{booking.startDate}</td>
              <td>{booking.endDate}</td>
              <td>{booking.duration} hours</td>
              <td>
                <CountdownTimer duration={booking.duration * 60 * 60} onTimerEnd={() => handleTimerEnd(booking.id)} />
              </td>
              <td>
                <button className="admin_delete_btn">delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
