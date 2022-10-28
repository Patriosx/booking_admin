import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  //fetch hotels
  const { data, loading, error } = useFetch(`/hotels`);
  //handler methods
  const handleInputChange = (e) => {
    setInfo({ ...info, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.map((room) => ({ number: room }));
    try {
      await axios.post(`/rooms/${selectedHotel}`, { ...info, roomNumbers });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelectedHotel = (e) => {
    setSelectedHotel(e.target.value);
  };
  const handleSelectedRoomNumbers = (e) => {
    setRooms(e.target.value.split(","));
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label htmlFor="selectHotel">Choose a hotel</label>
                <select id="selectHotel" onChange={handleSelectedHotel}>
                  {loading
                    ? "loading..."
                    : data &&
                      data.map((hotel) => (
                        <option value={hotel._id} key={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <div className="formInput">
                <label htmlFor="roomNumbers">Rooms</label>
                <textarea
                  name=""
                  id="roomNumbers"
                  cols="30"
                  placeholder="Enter your room between commas: 101,102"
                  onChange={handleSelectedRoomNumbers}
                ></textarea>
              </div>
              <button onClick={handleSubmit}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
