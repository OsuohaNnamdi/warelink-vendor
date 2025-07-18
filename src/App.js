import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Error } from './pages/ErrorPage';
import VendorHomepage from './pages/VendorHomepage';
import { AdminNavbar } from './components/NavBar/AdminNavbar';
import { Product } from './pages/Admin/Product/Products';
import { AddProducts } from './pages/Admin/Product/AddProduct';
import { OrderList } from './pages/Admin/Orders/OrderList';
import { SingleOrder } from './pages/Admin/Orders/SingleOrder';
import { Reviews } from './pages/Admin/Reviews';
import { Login } from './pages/Authetication/Login';
import { useState, useEffect } from 'react';
import { Register } from './pages/Authetication/Register';
import Inventory from './pages/Admin/Inventory/Inventory';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProfilePage } from './pages/Admin/ProfilePage';
import { SupportPage } from './pages/Admin/SupportPage';
import { ResetPassword } from './pages/Authetication/ResetPassword';
import { ForgotPassword } from './pages/Authetication/forgot-password';
import SalesPage from './pages/Admin/SalesPage';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async authentication check
    const checkAuth = () => {
      try {
        const authStatus = sessionStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location]);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  };

  const noNavbarPaths = ["/login", "/error", "/register","/support"];
  const shouldShowNavbar = isAuthenticated && !noNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="App">
      <div className="main-wrapper">
        {shouldShowNavbar && <AdminNavbar />}

        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<VendorHomepage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Navigate to="/error" />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VendorHomepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <SalesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <ProtectedRoute>
                <SingleOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function MainApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}