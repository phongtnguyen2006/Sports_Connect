import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompleteProfile.css";


const sportsOptions = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Volleyball",
  "Football",
  "Baseball",
  "Running",
  "Swimming",
  "Golf",
  "Pickleball",
  "Badminton",
  "Cycling",
];

function CompleteProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    favoriteSports: [],
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

  function handleSportClick(sport) {
    setProfileData((prevData) => {
      const alreadySelected = prevData.favoriteSports.includes(sport);

      if (alreadySelected) {
        return {
          ...prevData,
          favoriteSports: prevData.favoriteSports.filter(
            (selectedSport) => selectedSport !== sport
          ),
        };
      }

      if (prevData.favoriteSports.length === 3) {
        return prevData;
      }

      return {
        ...prevData,
        favoriteSports: [...prevData.favoriteSports, sport],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Missing login token. Please register or log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/complete-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "profile completion failed");
      }

      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="complete-profile-page">
      <h1>Complete Your Profile</h1>

      {error && <p className="complete-profile-error">{error}</p>}

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

        <section className="sports-section">
          <div className="sports-heading">
            <label>Favorite Sports</label>
            <span>{profileData.favoriteSports.length}/3 selected</span>
          </div>

          <div className="sports-options">
            {sportsOptions.map((sport) => {
              const isSelected = profileData.favoriteSports.includes(sport);

              return (
                <button
                  className={isSelected ? "sport-pill selected" : "sport-pill"}
                  key={sport}
                  type="button"
                  onClick={() => handleSportClick(sport)}
                >
                  {sport}
                </button>
              );
            })}
          </div>
        </section>

        <button
          className="complete-profile-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;
