import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Home = () => {
  const { customer } = useAuth();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const categories = [
    {
      name: "Electronics",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      count: "Latest gadgets & gear"
    },
    {
      name: "Fashion",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
        </svg>
      ),
      count: "Trendy apparel & styles"
    },
    {
      name: "Books",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      count: "Best sellers & classics"
    },
    {
      name: "Home",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      count: "Decor & living space"
    }
  ];

  return (
    <main className="home-page">
      <Navbar />

      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="welcome-badge">
              <span className="pulse-dot"></span>
              <span>Logged in as <strong>{customer.fullName}</strong></span>
            </div>
            <h1 className="hero-title">
              Modern Shopping <br />
              <span className="hero-gradient-text">Designed For You.</span>
            </h1>
            <p className="home-note">
              Welcome back to ShopKart. Discover curated products, manage your saved wishlist, and enjoy seamless shopping.
            </p>

            <div className="hero-actions">
              <Link className="main-button hero-cta" to="/products">
                <span>Explore Products</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link className="secondary-button hero-secondary-cta" to="/cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Cart {totalQuantity > 0 ? `(${totalQuantity})` : ""}</span>
              </Link>
              <Link className="secondary-button hero-secondary-cta" to="/orders">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>My Orders</span>
              </Link>
            </div>


            {/* Stats Row */}
            <div className="hero-stats-row">
              <div className="stat-item">
                <span className="stat-number">4.9 ★</span>
                <span className="stat-label">Customer Rating</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">Fast</span>
                <span className="stat-label">Doorstep Delivery</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Verified Products</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="section-head">
            <h2>Shop by Category</h2>
            <p>Select a category to jump straight into the catalogue</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat.name}`)}
              >
                <div className="category-icon-wrap">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.count}</p>
                <span className="category-arrow">→</span>
              </div>
            ))}
          </div>
        </section>

        {/* Profile Dashboard Card */}
        <section className="profile-dashboard-section">
          <div className="profile-box">
            <div className="profile-box-header">
              <div className="profile-avatar-lg">{getInitials(customer.fullName)}</div>
              <div>
                <h2>Customer Profile</h2>
                <span className="member-badge">Active ShopKart Account</span>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="profile-card-item">
                <span className="profile-label">Full Name</span>
                <strong className="profile-value">{customer.fullName}</strong>
              </div>
              <div className="profile-card-item">
                <span className="profile-label">Email Address</span>
                <strong className="profile-value">{customer.email}</strong>
              </div>
              <div className="profile-card-item">
                <span className="profile-label">Phone Number</span>
                <strong className="profile-value">{customer.phone}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props Row */}
        <section className="perks-row">
          <div className="perk-card">
            <div className="perk-icon">🚚</div>
            <h4>Free Shipping</h4>
            <p>On all orders above ₹999</p>
          </div>
          <div className="perk-card">
            <div className="perk-icon">🛡️</div>
            <h4>Secure Payments</h4>
            <p>Encrypted 256-bit transactions</p>
          </div>
          <div className="perk-card">
            <div className="perk-icon">↺</div>
            <h4>Easy Returns</h4>
            <p>Hassle-free 14-day policy</p>
          </div>
          <div className="perk-card">
            <div className="perk-icon">💬</div>
            <h4>24/7 Support</h4>
            <p>Instant dedicated assistance</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
