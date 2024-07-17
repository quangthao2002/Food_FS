import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlaceOrder() {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, foodList, cartItems, url } =
    useContext(StoreContext);
  const [dataUser, setDataUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setDataUser({ ...dataUser, [name]: value });
  };
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    foodList.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    const orderData = {
      items: orderItems,
      address: dataUser,
      amount: getTotalCartAmount() + 2,
    };
    const response = await axios.post(
      `${url}/api/order/placeOrder`,
      orderData,
      { headers: { token } }
    );
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Order failed");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={dataUser.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            value={dataUser.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          value={dataUser.email}
          onChange={onChangeHandler}
          type="text"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          value={dataUser.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            value={dataUser.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City name"
          />
          <input
            required
            name="state"
            value={dataUser.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State name"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipCode"
            value={dataUser.zipCode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            value={dataUser.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="country"
          />
        </div>
        <input
          required
          name="phone"
          value={dataUser.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery Free</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
