"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogIn, FiLogOut, FiUser, FiSettings, FiChevronDown, FiMenu, FiX, FiGrid } from "react-icons/fi";
import { logoutUser } from "../services/authService";
import { getAuthData, clearAuthData, isAuthenticated } from "../store/authStore";
import toast from 'react-hot-toast';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isNavAction, setIsNavAction] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isCheckingPlan, setIsCheckingPlan] = useState(true);
  
  // Hide navbar on scroll state
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeoutRef = useRef(null);
  
  // Dashboard URL (external app on port 3000)
  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
  
  // Slider styles
  const [activeSliderStyle, setActiveSliderStyle] = useState({
    width: 0,
    transform: "translate3d(0px, 0, 0)",
    opacity: 1,
  });
  const [activeLineStyle, setActiveLineStyle] = useState({
    width: 0,
    transform: "translate3d(0px, 0, 0)",
    opacity: 1,
  });
  const [hoverStyle, setHoverStyle] = useState({
    width: 0,
    transform: "translate3d(0px, 0, 0)",
    opacity: 0,
  });

  const navRefs = useRef([]);
  const containerRef = useRef(null);
  const firstLoad = useRef(true);
  const hoverTimeoutRef = useRef(null);
  const isHovering = useRef(false);
  const updateTimeoutRef = useRef(null);
  const activeTabRef = useRef(0);
  const animationFrameRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  const routeMap = {
    "/": 0,
    "/trymobile": 1,
    "/carrers": 2,
    "/partner": 3,
    "/solution": 4,
    "/about": 5,
    "/pricing": 6,
    "/contact": 7,
  };

  const isNavPage = (path) => {
    return routeMap.hasOwnProperty(path?.replace(/\/$/, ""));
  };

  // Handle scroll to hide/show navbar
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const isAtTop = currentScrollY < 50;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Hide navbar when scrolling down (not at top, and scrolled past 100px)
    if (scrollingDown && !isAtTop && currentScrollY > 100) {
      setIsNavbarVisible(false);
    }
    
    // Show navbar immediately when scrolling up
    if (!scrollingDown && !isAtTop) {
      setIsNavbarVisible(true);
    }
    
    // Show navbar when at top of page
    if (isAtTop) {
      setIsNavbarVisible(true);
    }
    
    // CRITICAL FIX: When scrolling stops (after 300ms of no scroll movement), show navbar
    scrollTimeoutRef.current = setTimeout(() => {
      // Only show if navbar is hidden and not at top (to avoid unnecessary animation)
      if (!isNavbarVisible && currentScrollY > 50) {
        setIsNavbarVisible(true);
      }
    }, 300);
    
    // Update scroll position for scrolled effect
    setScrolled(currentScrollY > 20);
    setLastScrollY(currentScrollY);
  };

  // Check if user has purchased a plan
// Check if user has purchased a plan
const checkPlanPurchaseStatus = () => {
  try {
    const { user: userData } = getAuthData();
    const userId = userData?._id || userData?.id;
    
    if (!userId) {
      setHasActivePlan(false);
      setIsCheckingPlan(false);
      return;
    }
    
    const planData = localStorage.getItem(`plan_${userId}`);
    
    if (!planData) {
      setHasActivePlan(false);
      setIsCheckingPlan(false);
      return;
    }
    
    const parsed = JSON.parse(planData);
    const purchaseTime = new Date(parsed.purchaseDate).getTime();
    const currentTime = new Date().getTime();
    const daysSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);
    const isValid = daysSincePurchase <= 365;
    
    setHasActivePlan(parsed.active && isValid);
  } catch (error) {
    console.error("Error checking plan:", error);
    setHasActivePlan(false);
  } finally {
    setIsCheckingPlan(false);
  }
};

  // Check login status from localStorage
  const checkLoginStatus = () => {
    try {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const { user } = getAuthData();
        setUser(user);
        checkPlanPurchaseStatus();
      } else {
        setUser(null);
        setHasActivePlan(false);
        setIsCheckingPlan(false);
      }
      return authenticated;
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
      setHasActivePlan(false);
      setIsCheckingPlan(false);
      return false;
    }
  };

  // Handle logout with toast notification
  const handleLogout = async () => {
    const userName = user?.name || user?.email?.split('@')[0] || 'User';
    
    const toastId = toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <FiLogOut className="text-red-600" size={16} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Confirm Logout</h3>
            <p className="text-sm text-gray-600">
              Logout from <span className="font-medium">{userName}</span>?
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performLogout();
            }}
            className="flex-1 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });

    const performLogout = async () => {
      if (isLoggingOut) return;
      
      setIsLoggingOut(true);
      setShowUserMenu(false);
      toast.dismiss();
      
      const loadingToastId = toast.loading('Logging out...', {
        position: 'top-center',
      });
      
      try {
        const { user: userData } = getAuthData();
        const userId = userData?._id || userData?.id;
        
        if (userId) {
          const response = await logoutUser(userId);
          if (response?.status === true || response?.success === true) {
            // Success case - handled below
          }
        }
        
        clearAuthData();
        
        // Clear all plan data for this user
        if (userId) {
          localStorage.removeItem(`plan_${userId}`);
        }
        localStorage.removeItem('purchase_completed');
        localStorage.removeItem('plan_purchased');
        localStorage.removeItem('plan_purchase_date');
        localStorage.removeItem('has_active_subscription');
        
        setIsLoggedIn(false);
        setUser(null);
        setHasActivePlan(false);
        window.dispatchEvent(new Event("userLoggedOut"));
        
        toast.dismiss(loadingToastId);
        toast.success(`Successfully logged out. See you soon!`, {
          duration: 3000,
          position: 'top-right',
          icon: '👋',
        });
        
        router.push("/");
        router.refresh();
        
      } catch (error) {
        console.error("Logout failed:", error);
        toast.dismiss(loadingToastId);
        toast.error(error?.message || 'Failed to logout. Please try again.', {
          duration: 4000,
          position: 'top-right',
        });
        
        clearAuthData();
        
        const { user: userData } = getAuthData();
        const userId = userData?._id || userData?.id;
        if (userId) {
          localStorage.removeItem(`plan_${userId}`);
        }
        localStorage.removeItem('purchase_completed');
        localStorage.removeItem('plan_purchased');
        localStorage.removeItem('plan_purchase_date');
        localStorage.removeItem('has_active_subscription');
        
        setIsLoggedIn(false);
        setUser(null);
        setHasActivePlan(false);
        router.push("/");
      } finally {
        setIsLoggingOut(false);
      }
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Check login status on component mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY, isNavbarVisible]);

  // Listen for plan purchase completion event
  useEffect(() => {
    const handlePlanPurchase = (event) => {
      console.log("🎉 Plan purchase event received:", event.detail);

      if (event.detail?.status === 'completed' || event.detail?.planPurchased === true) {
        
        const { user } = getAuthData();
        const userId = user?._id || user?.id;

        if (!userId) return;

        // Save plan per user (IMPORTANT FIX)
        localStorage.setItem(`plan_${userId}`, JSON.stringify({
          active: true,
          purchaseDate: new Date().toISOString()
        }));

        setHasActivePlan(true);

        toast.success('Plan activated! Dashboard is now available.', {
          duration: 5000,
          position: 'top-right',
          icon: '🎉',
        });
      }
    };

    window.addEventListener("planPurchaseCompleted", handlePlanPurchase);

    return () => {
      window.removeEventListener("planPurchaseCompleted", handlePlanPurchase);
    };
  }, []);

  // Listen for storage changes (for cross-tab updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkLoginStatus();
      }
      if (e.key?.startsWith("plan_")) {
        checkPlanPurchaseStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Listen for custom login/logout events
  useEffect(() => {
    const handleLoginEvent = () => checkLoginStatus();
    const handleLogoutEvent = () => {
      checkLoginStatus();
      setHasActivePlan(false);
    };

    window.addEventListener("userLoggedIn", handleLoginEvent);
    window.addEventListener("userLoggedOut", handleLogoutEvent);
    
    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
      window.removeEventListener("userLoggedOut", handleLogoutEvent);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  // ============ SLIDER FUNCTIONS ============
  const updateActiveIndicator = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const current = navRefs.current[activeTabRef.current];
      const parent = containerRef.current;

      if (!current || !parent || activeTabRef.current === -1) return;

      const parentRect = parent.getBoundingClientRect();
      const rect = current.getBoundingClientRect();

      const left = rect.left - parentRect.left;
      const width = rect.width;

      const snapEasing = "cubic-bezier(0.2, 0.9, 0.4, 1.1)";
      const transition = firstLoad.current ? "none" : `all 0.45s ${snapEasing}`;

      const commonStyle = {
        width: `${width}px`,
        transform: `translate3d(${left}px, 0, 0)`,
        opacity: 1,
        transition,
      };

      setActiveSliderStyle(commonStyle);
      setActiveLineStyle(commonStyle);
    });
  };

  const handleMouseEnter = (index) => {
    if (!isNavAction || index === activeTabRef.current) {
      return;
    }
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    isHovering.current = true;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const element = navRefs.current[index];
      const parent = containerRef.current;

      if (!element || !parent) return;

      const parentRect = parent.getBoundingClientRect();
      const rect = element.getBoundingClientRect();

      const left = rect.left - parentRect.left;
      const width = rect.width;

      setHoverStyle({
        width: `${width}px`,
        transform: `translate3d(${left}px, 0, 0)`,
        opacity: 0.3,
        transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
      });
    });
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering.current) {
        setHoverStyle((prev) => ({
          ...prev,
          opacity: 0,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }));
      }
    }, 30);
  };
  
  const handleNavClick = (index) => {
    activeTabRef.current = index;
    setActiveTab(index);
    setIsNavAction(true);
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setHoverStyle({
      ...hoverStyle,
      opacity: 0,
    });
    
    setTimeout(() => {
      updateActiveIndicator();
    }, 0);
  };

  const handleExternalClick = () => {
    setIsNavAction(false);
    setActiveTab(-1);
    activeTabRef.current = -1;
    
    setActiveSliderStyle(prev => ({ 
      ...prev, 
      opacity: 0,
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    }));
    setActiveLineStyle(prev => ({ 
      ...prev, 
      opacity: 0,
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    }));
    
    setHoverStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  useEffect(() => {
    const cleanPath = pathname?.replace(/\/$/, "");
    const isNav = isNavPage(cleanPath);
    
    setIsNavAction(isNav);
    
    if (isNav) {
      const newActiveTab = routeMap[cleanPath] ?? 0;
      activeTabRef.current = newActiveTab;
      setActiveTab(newActiveTab);
      
      setActiveSliderStyle(prev => ({ ...prev, opacity: 1 }));
      setActiveLineStyle(prev => ({ ...prev, opacity: 1 }));
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        updateActiveIndicator();
      }, 10);
    } else {
      activeTabRef.current = -1;
      setActiveTab(-1);
      
      setActiveSliderStyle(prev => ({ ...prev, opacity: 0 }));
      setActiveLineStyle(prev => ({ ...prev, opacity: 0 }));
    }
    
    setHoverStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
    
  }, [pathname]);

  useLayoutEffect(() => {
    if (isNavAction && activeTab !== -1) {
      if (firstLoad.current) {
        const timeout = setTimeout(() => {
          updateActiveIndicator();
          firstLoad.current = false;
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        updateActiveIndicator();
      }
    }
  }, [activeTab, isNavAction]);

  useEffect(() => {
    let resizeTimeout;
    
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isNavAction && activeTab !== -1) {
          updateActiveIndicator();
        }
      }, 50);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (isNavAction && activeTab !== -1) {
        updateActiveIndicator();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);
    
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(() => {
          if (isNavAction && activeTab !== -1) {
            updateActiveIndicator();
          }
        }, 30);
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isNavAction, activeTab]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Try Mobile", href: "/trymobile" },
    { name: "Carrers", href: "/carrers" },
    { name: "Partner", href: "/partner" },
    { name: "Solution", href: "/solution" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  // Get user info
  const getUserInitial = () => {
    try {
      if (user?.name) return user.name.charAt(0).toUpperCase();
      if (user?.email) return user.email.charAt(0).toUpperCase();
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData.name) return userData.name.charAt(0).toUpperCase();
        if (userData.email) return userData.email.charAt(0).toUpperCase();
      }
    } catch (e) {
      return "U";
    }
    return "U";
  };

  const userInitial = getUserInitial();
  const userEmail = user?.email || '';
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  // Function to handle dashboard click - opens in new tab
  const handleDashboardClick = (e) => {
    e.preventDefault();
    window.open(`${DASHBOARD_URL}/dashboard`, '_blank');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full bg-white z-[1000] h-16 md:h-20 flex items-center px-3 sm:px-4 md:px-6 transition-all duration-300 ${
          scrolled ? "shadow-lg border-b border-gray-100" : "shadow-sm"
        } ${
          isNavbarVisible 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0"
        }`}
        style={{
          transition: "transform 0.3s ease-in-out, opacity 0.25s ease-in-out"
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 sm:gap-2 group shrink-0"
            onClick={() => handleNavClick(0)}
          >
            <span className="bg-blue-600 text-white px-1.5 py-1 rounded text-lg sm:text-xl md:text-2xl font-bold transition-all duration-200 group-hover:scale-105">
              B
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-all duration-200">
              Billora
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <div 
              ref={containerRef} 
              className="relative flex items-center"
              onMouseLeave={handleMouseLeave}
            >
              {/* Hover Preview */}
              <div
                className="absolute top-2 h-[36px] bg-blue-100/40 rounded-md pointer-events-none will-change-transform"
                style={{
                  ...hoverStyle,
                  opacity: hoverStyle.opacity,
                  transition: hoverStyle.transition || "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                }}
              />

              {/* Active Background */}
              <div
                className="absolute top-2 h-[36px] bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-md pointer-events-none will-change-transform"
                style={{
                  ...activeSliderStyle,
                  transition: activeSliderStyle.transition || "all 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                }}
              />

              {/* Active Bottom Line */}
              <div
                className="absolute bottom-0 h-[2.5px] bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full pointer-events-none will-change-transform"
                style={{
                  ...activeLineStyle,
                  boxShadow: "0 0 6px rgba(59,130,246,0.5)",
                  transition: activeLineStyle.transition || "all 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                  backgroundSize: "200% 100%",
                }}
              />

              <ul className="flex relative z-10">
                {navItems.map((item, index) => (
                  <li
                    key={index}
                    ref={(el) => (navRefs.current[index] = el)}
                    className="px-2 xl:px-3"
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(index)}
                      onMouseEnter={() => handleMouseEnter(index)}
                      className={`block py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isNavAction && activeTab === index
                          ? "text-blue-600"
                          : "text-slate-500 hover:text-blue-500"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Dashboard Button - Opens external dashboard on port 3000 */}
            {isLoggedIn && hasActivePlan && !isCheckingPlan && (
              <a
                href={`${DASHBOARD_URL}/dashboard`}
                onClick={handleDashboardClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md hover:scale-105 whitespace-nowrap cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGrid size={16} />
                <span>Dashboard</span>
              </a>
            )}
            
            <Link
              href="/bookdemo"
              onClick={handleExternalClick}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 hover:shadow-md hover:scale-105 whitespace-nowrap"
            >
              Book Free Demo
            </Link>

            {/* Desktop Auth Section */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {userInitial}
                    </div>
                    {hasActivePlan && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-sm"></span>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {userName}
                    </div>
                    {hasActivePlan && (
                      <div className="text-xs text-green-600 font-medium">Premium Plan</div>
                    )}
                  </div>
                  <FiChevronDown className={`text-gray-400 transition-transform duration-200 hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} size={14} />
                </button>

                {/* Desktop Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {userInitial}
                          </div>
                          {hasActivePlan && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userEmail}
                          </p>
                          {hasActivePlan && (
                            <p className="text-xs text-green-600 font-medium mt-0.5">
                              ✓ Premium Active
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {/* Dashboard link in dropdown menu - opens external dashboard */}
                      {hasActivePlan && (
                        <a
                          href={`${DASHBOARD_URL}/dashboard`}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowUserMenu(false);
                            window.open(`${DASHBOARD_URL}/dashboard`, '_blank');
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiGrid size={18} />
                          <span>Dashboard</span>
                          <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Active</span>
                        </a>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiUser size={18} />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiSettings size={18} />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {isLoggingOut ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Logging out...</span>
                          </>
                        ) : (
                          <>
                            <FiLogOut size={18} />
                            <span>Logout</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={handleExternalClick}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all duration-200 whitespace-nowrap"
                >
                  <FiLogIn size={14} />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-all duration-200 z-20"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Add spacer div to prevent content jump when navbar is fixed */}
      <div className="h-16 md:h-20"></div>

      {/* Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[999] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[320px] bg-white shadow-2xl z-[1000] lg:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link 
              href="/" 
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xl font-bold">B</span>
              <span className="text-xl font-bold text-slate-800">Billora</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Mobile User Info (if logged in) */}
          {isLoggedIn && (
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {userInitial}
                  </div>
                  {hasActivePlan && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 break-all">{userEmail}</p>
                  {hasActivePlan && (
                    <p className="text-xs text-green-600 font-medium mt-0.5">✓ Premium Plan Active</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto py-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-5 py-3 text-base font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                    : "text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            {/* Dashboard button for mobile - opens external dashboard */}
            {isLoggedIn && hasActivePlan && !isCheckingPlan && (
              <a
                href={`${DASHBOARD_URL}/dashboard`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  window.open(`${DASHBOARD_URL}/dashboard`, '_blank');
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGrid size={18} />
                <span>Go to Dashboard</span>
              </a>
            )}
            
            <Link
              href="/bookdemo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-200"
            >
              Book Free Demo
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  <FiUser size={18} />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  <FiSettings size={18} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  <FiLogIn size={18} />
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;