
import {useEffect,useState,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile, getCurrentUserProfile } from "../../api/users";
import "./EditProfile.css";



function EditProfile(){
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [imageUrl,setImageUrl] = useState("/images/images-2.jpeg");
    const [profileImage, setProfileImage] = useState(null);

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        biography: "",
        favoriteSports: [],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadProfile() {
          try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setError("You are not logged in.");
                return;
            }
            const Profiledata = await getCurrentUserProfile(token);
            setProfileData({
                firstName: Profiledata.firstName || "",
                lastName: Profiledata.lastName || "",
                username: Profiledata.username || "",
                biography: Profiledata.biography || "",
                favoriteSports: Profiledata.favorite_sports || [],
            });
            
            if (Profiledata.profile_image) {
                setImageUrl(Profiledata.profile_image);
            }
            } catch (err) {
                setError(err.message);
            }
        }
        loadProfile();
    }, []);


  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
      setProfileImage(file);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Missing login token.");
      return;
    }

    setLoading(true);

    try {
      await completeProfile(
        {
          ...profileData,
          profileImage,
        },
        token
      );

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
    return(
        <div className="edit-profile-page">
            {error && <div className="edit-profile-error">{error}</div>}
            <form className="edit-profile-form" onSubmit={handleSubmit}>
            <section className="profile-picture"> 
                
                <img
                    className="profile-image"
                    src={imageUrl}
                    alt="Profile"
                    onClick={()=> fileInputRef.current.click()}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                />
                <button 
                    className="temp-make-button-edit-profile-photo"
                    type="button"
                    onClick={()=> fileInputRef.current.click()}
                >
                    Edit Picture
                </button>

            </section>
            <section className="profile-name">
                <div>
                    First Name
                    <input 
                    type="text" 
                    name="firstName" 
                    placeholder="First name" 
                    value={profileData.firstName} 
                    onChange={handleChange}
                    />
                </div>

            </section>

             <section className="profile-name">
            <div>
                Last Name
                <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                />
            </div>
        </section>

            <section className="username">
                <div>
                    User name
                    <input 
                    type="text" 
                    name="username" 
                    value={profileData.username}
                    onChange={handleChange}
                    placeholder="@username"/>
                </div>
            </section>
            
            <section className="Bio">
                <div>
                    Bio
                    <input 
                        type="text" 
                        name="biography" 
                        value={profileData.biography}
                        onChange={handleChange}
                        placeholder="Enter Bio"
                    />
                    
                </div>

            </section>
        <button
            className="save-profile-button"
            type="submit"
            disabled={loading}
        >
            {loading ? "Saving..." : "Save Profile"}
        </button>
        </form>
        </div>

    );


}
export default EditProfile;