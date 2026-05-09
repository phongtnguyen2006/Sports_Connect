import "./Profile.css";

/* Sidebar component (local to this file) */
function Sidebar() {
  return (
    <div className="sidebar">
      <img
            className="sidebar-icon"
            src="/images/home_pic.png"
            alt="home page"
          />
     
    </div>
  );
}

function Profile() {
  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <img
            className="profile-image"
            src="/images/images-2.jpeg"
            alt="profile"
          />
          <div className="profile-info">
            <h2 className="profile-name">John Doe</h2>
            <p className="profile-username">@johndoe</p>
          </div>
        </div>
        {/* Posts section */}
        <div className="posts-section">
          <h2>Previous Posts</h2>
          <div className="post">Post 1</div>
          <div className="post">Post 2</div>
        </div>
      </div>
    </div>
  
  );
}

export default Profile;