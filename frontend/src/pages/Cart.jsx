import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";
import Navbar from "../components/Navbar.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const formatPrice = (price) =>
  `₹${Number(price).toLocaleString("en-IN")}`;

const Cart = () => {
  const { cartItems, loading, error, totalQuantity, subtotal, loadCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const shippingCost = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const grandTotal = subtotal + shippingCost - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "SAVE10" || promoCode.trim().toUpperCase() === "SHOPKART") {
      setDiscountApplied(true);
      if (addToast) addToast("Promo code applied! 10% discount added.", "success");
    } else {
      if (addToast) addToast("Invalid promo code. Try 'SHOPKART'", "error");
    }
  };

  return (
    <main className="cart-page">
      <Navbar />

      <section className="cart-content">
        <div className="cart-head-banner">
          <div className="banner-badge">Shopping Bag</div>
          <h1>My Cart</h1>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="state-box">
            <div className="spinner" aria-label="Loading"></div>
            <p className="state-title">Loading your cart...</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="state-box state-error">
            <div className="state-icon-wrap">⚠️</div>
            <p className="state-title">Unable to load your cart.</p>
            <p className="state-note">{error}</p>
            <button
              id="retry-cart"
              className="main-button card-button"
              onClick={loadCart}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && cartItems.length === 0 && (
          <div className="state-box wishlist-empty">
            <div className="state-icon-wrap empty-cart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <p className="state-title">Your cart is empty</p>
            <p className="state-note">
              Looks like you haven't added any items to your shopping bag yet.
            </p>
            <Link
              id="browse-products-from-cart"
              className="main-button card-button"
              to="/products"
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* ── Cart items + order summary ── */}
        {!loading && !error && cartItems.length > 0 && (
          <div className="cart-layout">
            {/* Items list */}
            <div className="cart-items-section">
              <div className="cart-section-title">
                <p className="result-count">
                  <strong>{totalQuantity}</strong> {totalQuantity === 1 ? "item" : "items"} in your shopping bag
                </p>
              </div>
              <ul className="cart-list">
                {cartItems.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </ul>
            </div>

            {/* Order summary sidebar */}
            <aside className="order-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-rows">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="summary-row">
                    <span className="summary-item-name">
                      {item.product.name}
                      <span className="summary-qty"> × {item.quantity}</span>
                    </span>
                    <span className="summary-item-price">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />

              <div className="summary-breakdown-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="summary-breakdown-row">
                <span>Shipping</span>
                <strong className={shippingCost === 0 ? "free-shipping-text" : ""}>
                  {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                </strong>
              </div>

              {discountApplied && (
                <div className="summary-breakdown-row discount-row">
                  <span>Discount (10%)</span>
                  <strong>-{formatPrice(discountAmount)}</strong>
                </div>
              )}

              {/* Promo Code Form */}
              <form className="promo-code-form" onSubmit={handleApplyPromo}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. SHOPKART)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={discountApplied}
                />
                <button type="submit" disabled={discountApplied || !promoCode.trim()}>
                  {discountApplied ? "Applied" : "Apply"}
                </button>
              </form>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span className="summary-total-label">Total Amount</span>
                <span className="summary-total-price">{formatPrice(grandTotal)}</span>
              </div>

              <button
                id="proceed-checkout"
                className="main-button checkout-btn"
                onClick={() => navigate("/checkout")}
              >

                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Proceed to Checkout</span>
              </button>

              <div className="secure-checkout-note">
                🔒 256-Bit SSL Encrypted Checkout
              </div>

              <Link className="continue-shopping-link" to="/products">
                ← Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;
