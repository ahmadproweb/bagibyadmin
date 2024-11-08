import React, { useState } from "react";
import "../css/SideNavbar.css";
import Products from "./Products";
import UserAll from "./UserAll";
import Contact from "./Contact";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RiLogoutCircleLine } from "react-icons/ri";
import Navbar from "./navbar";
import SlideShow from "./SlideShow";
import Orders from "./Orders";

const SideNavbar = () => {
  const [activeSection, setActiveSection] = useState("UserAll");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const handleClickWidth = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleProfileClick = () => {
    setActiveSection("profile");
  };

  const handleSettingClick = () => {
    setActiveSection("setting");
  };

  return (
    <>
      <div className={`sideNavbarMain ${isCollapsed ? "collapsed" : ""}`}>
        <div className={`sideNavbar ${isCollapsed ? "collapsed" : ""}`}>
          <button
            type="button"
            onClick={() => window.open("https://bagiby.com/", "_blank")}
          >
            Website
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("UserAll")}
            className={activeSection === "UserAll" ? "active" : ""}
          >
            All Users
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("Products")}
            className={activeSection === "Products" ? "active" : ""}
          >
            Products
          </button>

          <button
            type="button"
            onClick={() => handleButtonClick("Contact")}
            className={activeSection === "Contact" ? "active" : ""}
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("SlideShow")}
            className={activeSection === "SlideShow" ? "active" : ""}
          >
            SlideShow
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("Orders")}
            className={activeSection === "Orders" ? "active" : ""}
          >
            Orders
          </button>
        </div>
        <div className={`flexData ${isCollapsed ? "collapsed" : ""}`}>
          <Navbar
            onProfileClick={handleProfileClick}
            onSettingClick={handleSettingClick}
          />
          <div className="iconSide" onClick={handleClickWidth}>
            {isCollapsed ? <RiLogoutCircleRLine /> : <RiLogoutCircleLine />}
          </div>

          {activeSection === "UserAll" && <UserAll />}
          {activeSection === "Products" && <Products />}
          {activeSection === "Contact" && <Contact />}
          {activeSection === "SlideShow" && <SlideShow />}
          {activeSection === "Orders" && <Orders />}
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
