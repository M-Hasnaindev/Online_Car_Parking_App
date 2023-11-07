import React, { useState } from "react";
import Form from './form'

function Home() {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true);
    console.log("chala");
  };

  const handleHideForm = () => {
    setShowForm(false);
    console.log("nhi chala");
  };

  return (
    <>
      <div className="mian_container">
        <div className="main_div">
          <div
            className="container_div"
            onClick={showForm ? handleHideForm : handleOpenForm}
            style={{ display: showForm ? "none" : "block" }}
          >
            <div className="div">
              <div className="full_container"></div>
            </div>
          </div>
          {showForm && <Form onPayNow={handleHideForm} />}
        </div>
      </div>
    </>
  );
}

export default Home;
