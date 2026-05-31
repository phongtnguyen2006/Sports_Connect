import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompleteProfile.css";

function CompleteProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    favoriteSport: "",
  });

  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Profile data:", profileData);
    navigate("/profile");
  }

  return (
    <div className="complete-profile-page">
      <h1>Complete Your Profile</h1>

      <form className="complete-profile-form" onSubmit={handleSubmit}>
        <section className="profile-photo-section">
          <div className="profile-photo-preview">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile preview" />
            ) : (
              <span>Photo</span>
            )}
          </div>

          <button
            className="add-photo-button"
            type="button"
            onClick={() => fileInputRef.current.click()}
          >
            Add Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </section>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="favoriteSport">Favorite Sport</label>
          <input
            id="favoriteSport"
            type="text"
            name="favoriteSport"
            value={profileData.favoriteSport}
            onChange={handleChange}
          />
        </div>

        <button className="complete-profile-button" type="submit">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;
