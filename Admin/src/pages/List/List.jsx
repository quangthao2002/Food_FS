import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
const List = ({ url }) => {
  const [listFood, setListFood] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const fetchListFood = async () => {
    await axios
      .get(`${url}/api/food/list/pagination?page=${page}&limit=10`)
      .then((response) => {
        setListFood(response.data.data.data);
        setTotalPages(response.data.data.totalPages);
      })
      .catch(() => {
        toast.error("Error");
      });
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
  }, [page]);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleClickUpdate = (id) => {
    navigate(`/update/${id}`);
  };
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
              <img src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <div className="actions">
                <img
                  src={assets.delete_icon}
                  alt="remove"
                  onClick={() => removeFood(item._id, item.name)}
                  className="cursor"
                />
                <img
                  src={assets.update_icon}
                  alt="update"
                  onClick={() => {
                    handleClickUpdate(item._id);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`page-button ${page === i + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default List;
