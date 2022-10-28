import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
const cloudname = process.env.REACT_APP_CLOUDNAME;

const NewUser = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  //Handler methods
  const handleInputChange = (e) => {
    setInfo({ ...info, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newUser = {};
    //upload img to cloudinary
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "booking_users");
      try {
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
          data
        );
        const { url } = uploadResponse.data;
        newUser = {
          ...info,
          img: url,
        };
        console.log("hay file", newUser);
      } catch (error) {
        console.log(error);
      }
    } else {
      newUser = info;
      console.log("no hay file", newUser);
    }
    try {
      //save to DB
      const res = await axios.post(`/auth/register`, newUser);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLoadPhoto = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleLoadPhoto}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <button onClick={handleSubmit}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
