import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close menu/dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    }
    // Use "click" (not "mousedown") so links inside the
    // dropdown get a chance to fire their onClick first.
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Close mobile menu when resizing back to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 850) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const handleDropdownHover = (isEntering) => {
    // Only use hover behavior on desktop widths
    if (window.innerWidth > 850) {
      setDropdownOpen(isEntering);
    }
  };

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-container">
        {/* Logo */}
       <a href="/" className="navbar-logo" onClick={closeAll}>
  <FontAwesomeIcon icon={faBook} />
  Loryfiar
</a>


        {/* Navigation */}
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li className="nav-item">
           <a href="/interviews" className="nav-link" onClick={closeAll}>
  Interviews
</a>
          </li>

          <li className="nav-item">
            <a href="/blog" className="nav-link" onClick={closeAll}>
             Blog
            </a>
          </li>

          <li className="nav-item">
            <a href="/graveyard" className="nav-link" onClick={closeAll}>
           Graveyard
            </a>
          </li>

          <li className="nav-item">
            <a href="/products" className="nav-link" onClick={closeAll}>
              Products
            </a>
          </li>
<div className="navbar-actions">
          <button className="login-btn">Subscribe →</button>
        </div>
  
        </ul>
        {/* Desktop Actions */}
      

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setDropdownOpen(false);
          }}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;