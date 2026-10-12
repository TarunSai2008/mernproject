import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getProductById, toggleWishlist } from "../services/api.js";

const formatPrice = (price) =>
  `₹${Number(price).toLocaleString("en-IN")}`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addItem, isActionLoading, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Wishlist state
  const [saved, setSaved] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (requestError) {
        const status = requestError.response?.status;
        const message =
          requestError.response?.data?.message ||
          (status === 404
            ? "Product not found."
            : "Something went wrong while loading the product.");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const inStock = product && product.stock > 0;
  const cartBusy = product ? isActionLoading(product._id) : false;
  const inCart = product ? isInCart(product._id) : false;

  const handleAddToCart = async () => {
    if (!product || cartBusy || !inStock) return;
    const result = await addItem(product._id);
    if (result.success && addToast) {
      addToast(`Added "${product.name}" to cart!`, "success", { label: "View Cart" });
    }
  };

  const handleWishlistToggle = async () => {
    if (!product || wishlistBusy) return;
    setWishlistBusy(true);
    try {
      const data = await toggleWishlist(product._id);
      setSaved(data.saved);
      if (addToast) {
        addToast(
          data.saved ? "Saved to wishlist!" : "Removed from wishlist",
          data.saved ? "success" : "info"
        );
      }
    } catch {
      if (addToast) addToast("Failed to update wishlist.", "error");
    } finally {
      setWishlistBusy(false);
    }
  };

  return (
    <main className="products-page">
      <Navbar />

      <section className="details-content">
        <div className="breadcrumbs">
          <button className="back-link" onClick={() => navigate("/products")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Products</span>
          </button>
        </div>

        {loading && (
          <div className="state-box">
            <div className="spinner" aria-label="Loading"></div>
            <p className="state-title">Loading product details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box state-error">
            <p className="state-title">{error}</p>
            <Link className="main-button card-button" to="/products">
              Browse Products
            </Link>
          </div>
        )}

        {!loading && !error && product && (
          <div className="details-card">
            <div className="details-image-container">
              <div className="details-image-wrap">
                <img
                  className="details-image"
                  src={product.image}
                  alt={product.name}
                />
              </div>
            </div>

            <div className="details-info">
              <div className="details-head-meta">
                <span className="product-category-tag">{product.category}</span>
                <span className="product-rating">★ 4.8 (124 reviews)</span>
              </div>

              <h1 className="details-name">{product.name}</h1>

              <div className="details-price-row">
                <span className="details-price">{formatPrice(product.price)}</span>
                <span className={`stock-badge-inline ${inStock ? "in-stock" : "out-of-stock"}`}>
                  {inStock ? `${product.stock} units available` : "Out of stock"}
                </span>
              </div>

              <div className="details-divider"></div>

              <h2 className="details-subhead">Product Description</h2>
              <p className="details-description">{product.description}</p>

              {/* Specs & Highlights */}
              <div className="product-highlights">
                <div className="highlight-item">
                  <span className="highlight-icon">🚚</span>
                  <span>Free doorstep shipping on this item</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">🛡️</span>
                  <span>1 Year Manufacturer Warranty</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">↺</span>
                  <span>14 Days Replacement Guarantee</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="details-actions">
                <button
                  className="main-button details-add-cart-btn"
                  onClick={handleAddToCart}
                  disabled={cartBusy || !inStock}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>{cartBusy ? "Adding to Cart..." : inCart ? "Add Another to Cart" : "Add to Cart"}</span>
                </button>

                <button
                  className={`outline-button details-wishlist-btn ${saved ? "saved-outline" : ""}`}
                  onClick={handleWishlistToggle}
                  disabled={wishlistBusy}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{saved ? "Saved in Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductDetails;
