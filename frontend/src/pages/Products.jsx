import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { getProducts, getWishlist } from "../services/api.js";

const DEBOUNCE_MS = 400;

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const prevSearch = useRef(search);

  // Fetch wishlist once on mount so ProductCards know their initial saved state
  useEffect(() => {
    getWishlist()
      .then((data) => setSavedIds(new Set(data.wishlist.map((p) => p._id))))
      .catch(() => {}); // Non-critical
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category) params.category = category;
        if (sort) params.sort = sort;

        const data = await getProducts(params);
        setProducts(data.products);
      } catch {
        setError("Something went wrong while loading products.");
      } finally {
        setLoading(false);
      }
    };

    const searchChanged = prevSearch.current !== search;
    prevSearch.current = search;
    const delay = searchChanged ? DEBOUNCE_MS : 0;

    const timer = setTimeout(fetchProducts, delay);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const hasActiveFilters = Boolean(search || category || sort);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
  };

  return (
    <main className="products-page">
      <Navbar wishlistCount={savedIds.size} />

      <section className="products-content">
        <div className="products-head-banner">
          <div className="banner-badge">Catalogue Explorer</div>
          <h1>Discover Our Products</h1>
          <p className="products-note">
            Browse high quality products across electronics, fashion, books, and home essentials.
          </p>
        </div>

        <SearchBar
          search={search}
          category={category}
          sort={sort}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />

        {/* Active filters bar */}
        {hasActiveFilters && (
          <div className="active-filters-bar">
            <span className="filters-label">Active filters:</span>
            {search && <span className="filter-chip">Search: "{search}"</span>}
            {category && <span className="filter-chip">Category: {category}</span>}
            {sort && <span className="filter-chip">Sort: {sort === "price_asc" ? "Price ↑" : "Price ↓"}</span>}
            <button className="reset-filters-btn" onClick={handleResetFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Skeleton Grid for Loading */}
        {loading && (
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-body">
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line medium"></div>
                  <div className="skeleton-line long"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="state-box state-error">
            <div className="state-icon-wrap">⚠️</div>
            <p className="state-title">{error}</p>
            <button className="main-button card-button" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state-box empty-products-state">
            <div className="state-icon-wrap">🔍</div>
            <p className="state-title">No products found</p>
            <p className="state-note">
              We couldn't find any products matching your current search or category filter.
            </p>
            {hasActiveFilters && (
              <button className="main-button card-button" onClick={handleResetFilters}>
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="results-header">
              <p className="result-count">
                Showing <strong>{products.length}</strong> {products.length === 1 ? "product" : "products"}
              </p>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  initialSaved={savedIds.has(product._id)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Products;
