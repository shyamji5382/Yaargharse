import { useEffect, useMemo, useState, useCallback } from "react";
import { getItems, getMyItems } from "../services/buySellService";
import { ITEM_CATEGORIES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import ItemCard from "../components/ItemCard";
import SellItemForm from "../components/SellItemForm";
import MyBuySellListings from "../components/MyBuySellListings";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState("browse");

  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("loading");

  const [myItems, setMyItems] = useState(null);
  const [myStatus, setMyStatus] = useState("idle");

  const loadItems = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getItems();
      setItems(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  const loadMyItems = useCallback(async () => {
    setMyStatus("loading");
    try {
      const data = await getMyItems();
      setMyItems(data.items || []);
      setMyStatus("success");
    } catch {
      setMyStatus("error");
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);
  useEffect(() => { if (tab === "mine") loadMyItems(); }, [tab, loadMyItems]);

  const visible = useMemo(() => {
    return items
      .filter((i) => category === "all" || i.category === category)
      .filter((i) => i.itemName?.toLowerCase().includes(query.toLowerCase()));
  }, [items, query, category]);

  return (
    <div className="page">
      <div className="sign-tag">🛒 Student Buy & Sell</div>
      <h2 className="display" style={{ marginBottom: 20 }}>Marketplace</h2>

      <div className="dash-tabs" style={{ maxWidth: 420 }}>
        <button className={`dash-tab-btn ${tab === "browse" ? "active" : ""}`} onClick={() => setTab("browse")}>Browse</button>
        {isAuthenticated && (
          <button className={`dash-tab-btn ${tab === "sell" ? "active" : ""}`} onClick={() => setTab("sell")}>Sell Item</button>
        )}
        {isAuthenticated && (
          <button className={`dash-tab-btn ${tab === "mine" ? "active" : ""}`} onClick={() => setTab("mine")}>My Listings</button>
        )}
      </div>

      {tab === "browse" && (
        <div style={{ marginTop: 20 }}>
          <div className="page-controls" style={{ marginBottom: 20 }}>
            <SearchBar value={query} onChange={setQuery} placeholder="Search items…" />
            <select className="search-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {ITEM_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          {status === "loading" && <Loader label="Loading listings…" />}
          {status === "error" && <ErrorMessage message="Couldn't load listings." onRetry={loadItems} />}
          {status === "success" && visible.length === 0 && (
            <EmptyState title="No items found" message="Try a different search or category." />
          )}
          {status === "success" && visible.length > 0 && (
            <div className="grid">
              {visible.map((item) => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      )}

      {tab === "sell" && isAuthenticated && (
        <div style={{ marginTop: 20, maxWidth: 480 }}>
          <SellItemForm onCreated={() => { loadItems(); setTab("mine"); }} />
        </div>
      )}

      {tab === "mine" && isAuthenticated && (
        <div style={{ marginTop: 20 }}>
          {myStatus === "loading" && <Loader label="Loading your listings…" />}
          {myStatus === "error" && <ErrorMessage message="Couldn't load your listings." onRetry={loadMyItems} />}
          {myStatus === "success" && <MyBuySellListings items={myItems} onChange={loadMyItems} />}
        </div>
      )}
    </div>
  );
}
