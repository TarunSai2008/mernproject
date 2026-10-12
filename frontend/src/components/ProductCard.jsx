import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { toggleWishlist } from "../services/api.js";

const formatPrice = (price) =>
  `₹${Number(price).toLocaleString("en-IN")}`;

const ProductCard = ({ product, initialSaved = false }) => {
  const inStock = product.stock > 0;
  const { addToast } = useToast();

  // ── Wishlist state (local — uses toggle API directly) ────
  const [saved, setSaved] = useState(initialSaved);
  const [wishlistStatus, setWishlistStatus] = useState("idle");
  const [wishlistError, setWishlistError] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!hasInteracted) {
      setSaved(initialSaved);
    }
  }, [initialSaved, hasInteracted]);

  const handleWishlistToggle = async () => {
    if (wishlistStatus === "saving") return;
    setHasInteracted(true);
    setWishlistStatus("saving");
    setWishlistError("");
    try {
      const data = await toggleWishlist(product._id);
      setSaved(data.saved);
      setWishlistStatus("idle");
      if (addToast) {
        addToast(
          data.saved ? `${product.name} saved to wishlist!` : `Removed from wishlist.`,
          data.saved ? "success" : "info"
        );
      }
    } catch {
      setWishlistStatus("error");
      setWishlistError("Unable to save. Try again.");
    }
  };

  // ── Cart state (from global CartContext) ─────────────────
  const { addItem, isInCart, isActionLoading } = useCart();
  const inCart = isInCart(product._id);
  const cartBusy = isActionLoading(product._id);
  const [cartError, setCartError] = useState("");

  const handleAddToCart = async () => {
    if (cartBusy || !inStock) return;
    setCartError("");
    const result = await addItem(product._id);
    if (!result.success) {
      setCartError(result.message || "Unable to add to cart.");
    } else if (addToast) {
      addToast(`Added "${product.name}" to cart!`, "success", {
        label: "View Cart"
      });
    }
  };

  const cartLabel = () => {
    if (cartBusy) return "Adding...";
    if (inCart) return "Add Another";
    return "Add to Cart";
  };

  const wishlistLabel = () => {
    if (wishlistStatus === "saving") return "Saving...";
    if (saved) return "Remove Wishlist";
    return "Add to Wishlist";
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        <div className="product-badges">
          <span className={`stock-badge ${inStock ? "in-stock" : "out-of-stock"}`}>
            {inStock ? `${product.stock} left` : "Out of stock"}
          </span>
        </div>

        <button
          className={`wishlist-heart-btn ${saved ? "saved" : ""}`}
          onClick={handleWishlistToggle}
          disabled={wishlistStatus === "saving"}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          title={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="product-body">
        <div className="product-category-row">
          <span className="product-category-tag">{product.category}</span>
          <span className="product-rating">★ 4.8</span>
        </div>

        <h3 className="product-name">{product.name}</h3>

        <div className="product-price-row">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-shipping-tag">Free Shipping</span>
        </div>

        {wishlistStatus === "error" && (
          <p className="wishlist-error-inline">{wishlistError}</p>
        )}
        {cartError && (
          <p className="wishlist-error-inline">{cartError}</p>
        )}

        <div className="card-actions">
          <Link className="main-button card-button view-details-btn" to={`/products/${product._id}`}>
            <span>View Details</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          <button
            id={`cart-btn-${product._id}`}
            className={`outline-button card-button ${inCart ? "in-cart-outline" : ""}`}
            onClick={handleAddToCart}
            disabled={cartBusy || !inStock}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>{cartLabel()}</span>
          </button>

          <button
            id={`wishlist-btn-${product._id}`}
            className={`outline-button card-button ${saved ? "saved-outline" : ""}`}
            onClick={handleWishlistToggle}
            disabled={wishlistStatus === "saving"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{wishlistLabel()}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
