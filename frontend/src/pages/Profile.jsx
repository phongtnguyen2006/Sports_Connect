import "./Profile.css";

const posts = [
  {
    title: "Looking for pickup basketball tonight",
    meta: "May 12 - Westwood Rec Center",
    text: "Need two more players for a friendly 5v5 run at 7 PM. All skill levels welcome.",
  },
  {
    title: "Morning tennis rally",
    meta: "May 8 - UCLA Tennis Courts",
    text: "Had a great hitting session and found a new doubles partner through Sports Connect.",
  },
  {
    title: "Weekend soccer group",
    meta: "May 3 - Drake Stadium",
    text: "Starting a casual Sunday soccer group. Comment if you want to join next week.",
  },
];

function Profile() {
  return (
    <div className="profile-page">
      <section className="profile-content" aria-label="User profile">
        <div className="profile-top">
          <div className="profile-photo-wrap">
            <img
              className="profile-image"
              src="/images/images-2.jpeg"
              alt="John Doe profile"
            />
          </div>

          <div className="profile-info">
            <p className="profile-label">Sports Connect Profile</p>
            <h1 className="profile-name">John Doe</h1>
            <p className="profile-username">@johndoe</p>
            <p className="profile-bio">
              Basketball and tennis player looking for pickup games, training
              partners, and weekend tournaments around campus.
            </p>

            <div className="profile-details" aria-label="Profile details">
              <span>Basketball</span>
              <span>Los Angeles, CA</span>
              <span>Usually free evenings</span>
            </div>

            <button className="edit-profile-button" type="button">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-stats" aria-label="Profile stats">
          <div>
            <strong>18</strong>
            <span>Posts</span>
          </div>
          <div>
            <strong>42</strong>
            <span>Connections</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Events Joined</span>
          </div>
        </div>

        <section className="posts-section" aria-labelledby="previous-posts">
          <div className="posts-header">
            <h2 id="previous-posts">Previous Posts</h2>
            <button className="view-all-button" type="button">
              View All
            </button>
          </div>

          <div className="posts-grid">
            {posts.map((post) => (
              <article className="post" key={post.title}>
                <p className="post-meta">{post.meta}</p>
                <h3>{post.title}</h3>
                <p>{post.text}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default Profile;
