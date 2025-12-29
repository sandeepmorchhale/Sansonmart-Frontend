import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';
import '../../CSS/usercss/Homepage.css';

// Images
import logo from '../../images/userimage/logo.png'; // Logo Import
import heroImage from '../../images/userimage/homepageghee.png';

const Homepage = () => {
  const nav = useNavigate();
  const { scrollYProgress } = useScroll();
  
  // Parallax Background Effect
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // --- Navigation Functions ---
  const gotoproductpage = () => {
    nav("/user/product");
  };
  const gotoRegister = () => {
    nav("/user/register");
  };

  // --- Animation Variants ---
  const containerStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Idle Floating Animation
  const float = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="homepage-container" style={{ overflowX: 'hidden', position: 'relative' }}>
      
      {/* --- TOP NAVBAR --- */}
      <nav className="top-navbar">
         <div className="nav-brand">
           {/* --- LOGO ADDED HERE --- */}
           <img src={logo} alt="Sanson Mart Logo" className="nav-logo" />
           
           {/* <span className="brand-text">Sanson<span style={{color:'#D4AF37'}}>Mart</span></span> */}
         </div>
         
         <div className="nav-auth-buttons">
           <motion.button 
             onClick={gotoproductpage}
             className="nav-btn login-btn"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
           >
             Login
           </motion.button>
           
           <motion.button 
             onClick={gotoRegister}
             className="nav-btn register-btn"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
           >
             Register
           </motion.button>
         </div>
      </nav>

      {/* Animated Golden Blobs */}
      <motion.div 
        className="golden-blob blob-1"
        animate={{ x: [0, 50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="golden-blob blob-2"
        animate={{ x: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* --- HERO SECTION --- */}
      <header className="hero-section">
        <div className="hero-content-wrapper">
          
          {/* Left Side: Text Content */}
          <motion.div 
            className="hero-text-block"
            variants={containerStagger}
            initial="hidden"
            animate="show"
          >
            <motion.span variants={fadeInUp} className="hero-subtitle">
              ✨ Nature's Golden Gift
            </motion.span>
            
            <motion.h1 variants={fadeInUp}>
              🧈 A Touch of Purity: <br />
              <span className="highlight-text">The Finest Butter Oil</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp}>
              Sourced from nature, crafted specifically for your kitchen. 
              A premium experience that adds richness, aroma, and flavor to every dish.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="btn-wrapper">
               <motion.button 
                 onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth'})}
                 className="cta-button primary-btn"
                 whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(212, 175, 55, 0.4)" }}
                 whileTap={{ scale: 0.95 }}
               >
                 Explore Our Products
               </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side: Hero Product Image */}
          <motion.div 
            className="hero-image-block"
            variants={float}    
            animate="animate"
            whileHover={{ 
              scale: 1.2,          
              y: -40,              
              rotateY: 20,         
              rotateX: 5,
              zIndex: 10,
              filter: "drop-shadow(0px 50px 60px rgba(212, 175, 55, 0.9))",
              transition: { type: "spring", stiffness: 200, damping: 20 } 
            }}
            style={{ 
              filter: "drop-shadow(0px 20px 30px rgba(212, 175, 55, 0.4))",
              perspective: "1000px", 
              cursor: "pointer"
            }}
          >
            <img 
              src={heroImage} 
              alt="Premium Pure Ghee Jar" 
              className="main-hero-product-img"
            />
          </motion.div>

        </div>
      </header>

      {/* --- TRUST METRICS --- */}
      <motion.div 
        className="trust-bar"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="trust-item">
          <h3>5000+</h3>
          <p>Happy Families</p>
        </div>
        <div className="divider"></div>
        <div className="trust-item">
          <h3>100%</h3>
          <p>Natural & Pure</p>
        </div>
        <div className="divider"></div>
        <div className="trust-item">
          <h3>0%</h3>
          <p>Preservatives</p>
        </div>
      </motion.div>

      {/* --- FEATURES SECTION --- */}
      <section className="about-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Why Choose Our Ghee?</h2>
          <div className="underline"></div>
        </motion.div>
        
        <div className="features-grid">
          {[
            { icon: "✅", title: "100% Pure", desc: "No adulteration. We assure you of the highest quality healthy fats." },
            { icon: "🌿", title: "Naturally Sourced", desc: "Sourced from the best dairies and processed using traditional methods." },
            { icon: "✨", title: "Premium Aroma", desc: "A sweet, nutty aroma that adds depth, flavor, and richness to your meals." }
          ].map((item, index) => (
            <motion.div 
              className="feature-item"
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, boxShadow: "0 15px 35px rgba(212, 175, 55, 0.3)" }}
            >
              <div className="icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PROCESS TIMELINE --- */}
      <section className="process-section">
        <motion.div 
           className="section-header"
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
        >
          <h2>From Farm to Jar</h2>
          <div className="underline"></div>
        </motion.div>

        <div className="process-timeline">
           {[
             { step: "1", title: "Grass-Fed Cows", text: "Healthy cows grazing freely." },
             { step: "2", title: "Curd Churning", text: "Traditional Bilona method." },
             { step: "3", title: "Slow Heating", text: "Cooked on low flame." },
             { step: "4", title: "Golden Ghee", text: "Filtered & packed with love." }
           ].map((process, i) => (
             <motion.div 
               key={i} 
               className="process-step"
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.2 }}
               viewport={{ once: true }}
               whileHover={{ scale: 1.05 }}
             >
                <div className="step-circle">{process.step}</div>
                <h4>{process.title}</h4>
                <p>{process.text}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* --- PRODUCT PREVIEW SECTION --- */}
      <section id="products" className="product-preview-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Our Premium Products</h2>
          <div className="underline"></div>
        </motion.div>

        <div className="product-gallery">
          <motion.div 
            className="product-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 10, 
              boxShadow: "0px 20px 40px rgba(0,0,0,0.2)"
            }}
            style={{ perspective: '1000px' }}
          >
            <div className="image-wrapper">
              <img className="product-image" src={heroImage} alt="Desi Ghee" />
            </div>
            <div className="product-info">
              <h3>Pure Desi Ghee</h3>
              <span className="weight-tag">1kg Pack</span>
            </div>
          </motion.div>
        </div>

        <div className="action-buttons">
          <motion.button 
            onClick={gotoproductpage} 
            className="cta-button shop-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
           User Login
          </motion.button>
          
          <motion.button 
            onClick={() => nav("/admin/login")} 
            className="cta-button admin-btn"
            whileHover={{ scale: 1.1, backgroundColor: "#8B5E3C", color: "white" }}
            whileTap={{ scale: 0.95 }}
          >
            Admin Login
          </motion.button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="website-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Your Butter Oil Company. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;