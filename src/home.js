// import React from 'react'

// function Home() {
//   const handleOpenForm = () =>{
//     console.log("clicked")
//   }

//   return (
//     <>
//       <div className="mian_container">
//         <div className="main_div">
//           <div className="container_div" onClick={handleOpenForm}>
//             <div className="div">
//                 <div className="full_container">

//                 </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Home

import React, { useState } from "react";
import form_banner from './Assest/formBannner.png'
import { DatePicker, Space } from 'antd';
function Home() {
  const [showSlot, setShowSlot] = useState(false)
  const { RangePicker } = DatePicker;

  const handleShowSlot = () => {
    setShowSlot(true)
  }
  return (
    <>
      <div className="from">
        <div className="main_form">
          <div className="main-form">
            <div className="top_banner_section">
              <div className="bannerImage">
                <img className="formBannerImg" src={form_banner} alt="banner here" />
              </div>
            </div>
            <div className="middle_menu_section" style={{display: showSlot ? "none" : "block"}}>
              <div className="nav">
                <ul className="menu">
                  <li className="menu_item">History</li>
                  <li className="menu_item">Book Parking</li>
                  <li className="menu_item">Slot</li>
                  <li className="menu_item">Feedback</li>
                  <li className="menu_item">Profile</li>
                </ul>
              </div>
            </div>
            <div className="bottom_heading_section" style={{display: showSlot ? "none" : "block"}}>
              <div className="heading_book_slot">
                <h2 className="book_slot">Book Slot</h2>
              </div>
            </div>
            <div className="fotter_fields_section" style={{display: showSlot ? "none" : "block"}}>
            <Space direction="vertical" size={12}>
              <RangePicker showTime />
            </Space>
            </div>
            <div className="slot_selecting_section">
              <div className="select_slot">
                <div className="select_slot_button" style={{display: showSlot ? "none" : "block"}}>
                  <button className="slot" onClick={handleShowSlot}>Select Slot</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
