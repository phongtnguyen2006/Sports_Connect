
import {useState,useRef} from "react";
import "./EditProfile.css";
function ProfilePage(){
    const [imageUrl,setImageUrl] = useState("/image/images-2.jpeg");
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if(file) {
            const previewUrl = URL.createObjectURL(file);
            setImageUrl(previewUrl);
        }
    }
};
function EditProfile(){



    return(
        <div className="edit-profile-page">
            <section className="profile-picture"> 
                
                <img
                    className="profile-image"
                    src="/images/images-2.jpeg"
                    alt="John Doe profile"
                    onClick={()=> fileInputRef.current.click()}
                />
                <div className="temp-make-button-edit-profile-photo">
                    Edit Picture
                </div>

            </section>
            <section className="profile-name">
                <div>
                    Name
                    <input type="text" id="Name" placeholder="John Doe"/>
                   
                </div>

            </section>
            <section className="username">
                <div>
                    User name
                    <input type="text" id="username" placeholder="@John Doe"/>
                </div>

            </section>
            <section className="Bio">
                <div>
                    Bio
                    <input type="text" id="username" placeholder="Enter Bio"/>
                    
                </div>

            </section>

        </div>

    );


}
export default EditProfile;