import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import toast from "react-hot-toast";
const List = ({ url }) => {
  const [listFood, setListFood] = useState([]);
  const fetchListFood = async () => {
    const response = await axios.get(`${url}/api/food/list-food`);
    if (response.status === 200) {
      setListFood(response.data.data);
    } else {
      toast.error("Error");
    }
  };
  const removeFood = async (foodId, name) => {
    await axios
      .delete(`${url}/api/food/remove/${foodId}`)
      .then(() => {
        fetchListFood();
        toast.success(`Deleted food name ${name}`);
      })
      .catch(() => {
        toast.error("Error");
      });
  };
  useEffect(() => {
    fetchListFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="list add flex-col">
      <p>All food list</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>price</b>
          <b>Action</b>
        </div>
        {listFood.map((item, index) => {
          return (
            <div className="list-table-format" key={index}>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p
                onClick={() => removeFood(item._id, item.name)}
                className="cursor"
              >
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
