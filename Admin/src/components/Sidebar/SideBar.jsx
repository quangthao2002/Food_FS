import "./SideBar.css";

import { NavLink } from "react-router-dom";
import { assets } from "./../../assets/assets";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to={"/add"} className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to={"/list"} className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to={"/orders"} className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to={"/statistical"} className="sidebar-option">
          <img src={assets.statistical_icon} alt="" />
          <p>Statistical</p>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
