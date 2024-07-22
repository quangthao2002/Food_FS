import { useState } from "react";

import "./Update.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const Update = ({ url }) => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const getFood = async () => {
    try {
      const response = await axios.get(`${url}/api/food/getfood/${id}`);
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
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
      .put(`${url}/api/food/update/${id}`, formData)
      .then((rs) => {
        if (rs.status === 200) {
          setData({
            name: "",
            description: "",
            category: "",
            price: "",
            image: "",
          });
          setImage(null);
          toast.success("Update success");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Fail update food");
      });
  };
  useEffect(() => {
    getFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler} action="">
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : `${url}/images/${data.image}` || assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            name="image"
            id="image"
            hidden
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Update;
