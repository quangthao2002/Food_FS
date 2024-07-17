import { useState } from "react";

import "./Add.css";
import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    axios
      .post(`${url}/api/food/add`, formData)
      .then((rs) => {
        if (rs.status === 200) {
          setData({
            name: "",
            description: "",
            category: "",
            price: "",
          });
          setImage(false);
          toast.success("Created a new Food");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Fail add food");
      });
  };
  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler} action="">
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            name="image"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            required
            value={data.name}
            onChange={onChangeHandler}
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            id=""
            rows="6"
            placeholder="Write content here"
            required
            value={data.description}
            onChange={onChangeHandler}
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select
              name="category"
              id=""
              required
              value={data.category}
              onChange={onChangeHandler}
            >
              <option value="">Select Category</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="cake">Cake</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Price</p>
            <input
              type="number"
              name="price"
              placeholder="$20"
              required
              value={data.price}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <button type="submit">ADD</button>
      </form>
    </div>
  );
};

export default Add;
