import { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { assets } from "../../assets/assets";
const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/listOrders`);

    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      console.log(response.data.message);
    }
  };
  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusHandler = async (event, orderId) => {
    const valueSelect = event.target.value;
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: valueSelect,
    });
    if (response.data.success) {
      fetchAllOrders();
    } else {
      console.log(response.data.message);
    }
  };

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div className="order-item" key={index}>
              <img src={assets.parcel_icon} alt="" />
              <div className="order-info">
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ", "}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipCode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items:{order.items.length}</p>
              <p>${order.amount}</p>
              <select
                onChange={() => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
