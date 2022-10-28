import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
const cloudname = process.env.REACT_APP_CLOUDNAME;

const NewHotel = () => {
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);
  //fetch rooms
  const { data, loading, error } = useFetch("/rooms");

  //Handler methods
  const handleLoadPhotos = (e) => {
    setFiles(e.target.files);
  };
  const handleInputChange = (e) => {
    setInfo({ ...info, [e.target.id]: e.target.value });
  };
  const handleRoomSelection = (e) => {
    // console.log(e.target.selectedOptions); //return HTMLCollection
    //map HTMLCollection to an array, then return only the values of the input selected (_id)
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedRooms(values);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newHotel = {};
    // console.log(Object.keys(files));
    // console.log(Object.values(files));

    if (files.length !== 0) {
      const urlImages = await Promise.all(
        //files is an objecto. we need to conver to array
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "booking_hotels");

          try {
            //upload photos
            const resCloudinary = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
              data
            );
            const { url } = resCloudinary.data;
            return url;
          } catch (error) {
            console.log(error);
          }
        })
      );
      newHotel = {
        ...info,
        rooms: selectedRooms,
        photos: urlImages,
      };
      try {
        //save to mongoDB
        await axios.post("/hotels", newHotel);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files.length !== 0
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="files">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="files"
                  multiple
                  onChange={handleLoadPhotos}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
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
                <label htmlFor="featured">Featured</label>
                <select id="featured" onChange={handleInputChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRoom">
                <label htmlFor="selectRoom">Rooms</label>
                <select id="selectRoom" multiple onChange={handleRoomSelection}>
                  {loading
                    ? "loading..."
                    : data &&
                      data.map((room) => {
                        return (
                          <option value={room._id} key={room._id}>
                            {room.title}
                          </option>
                        );
                      })}
                </select>
              </div>
              <button onClick={handleSubmit}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
