import  { useContext, useState } from 'react';
import '../App.css';
import SignInPage from '../pages/SignUpPage';
import Marketplace from '../pages/Marketplace';
import Funtimes from '../pages/FuntimesPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import EventsPage from '../pages/EventsPage';
import AddProduct from '../pages/AddProduct';
import StudentPage from '../pages/StudentsPage';
import LoginPage from '../pages/LoginPage';
import MyWishlist from '../pages/MyWishlist';
import ResetPassword from '../pages/ResetPassword';
import ViewProfile from '../pages/ViewProfile'
import AddEvent from '../pages/AddEvent'
import UserProvider, { UserContext } from '../context/UserContext';
import UpdateProfile from '../pages/UpdateProfile';
import MyEventsPage from '../pages/MyEventsPage';
import UpdateProduct from '../pages/UpdateProduct';
import UpdateEvent from '../pages/UpdateEvent';
import MyFuntimesPage from '../pages/MyFuntimesPage';
import AddFunTime from '../pages/AddFuntimes';
import MyProductsPage from '../pages/MyProductsPage';
import UpdateFuntime from '../pages/UpdateFuntimes';
import MarketplaceProvider from '../context/MarketplaceContext';
import FuntimeProvider from '../context/FuntimeContext';
import EventProvider from '../context/EventContext';
import StudentProvider from '../context/StudentContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <BrowserRouter>
     <UserProvider>
   <StudentProvider>
<EventProvider>
   <FuntimeProvider>
   <MarketplaceProvider>
   
      <div className={darkMode ? 'dark-mode' : 'light-mode'}>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignInPage />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/*" element={<ProtectedRoutes toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </div>
    </MarketplaceProvider>
    </FuntimeProvider>
    </EventProvider>
    </StudentProvider>
    </UserProvider>
   
    </BrowserRouter>
  );
}

function ProtectedRoutes() {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Funtimes />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route exact path="events" element={<EventsPage/>} />
        {/* <Route path="events/:category" element={<EventsPage/>} /> */}
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="updateproduct/:id" element={<UpdateProduct />} />
        <Route path="studentpage" element={<StudentPage />} />
        <Route path="myprofile/mywishlist" element={<MyWishlist />} />
        <Route path="myprofile" element={<ViewProfile />} />
        <Route path="addevent" element={<AddEvent />} />
        <Route path="addfuntime" element={<AddFunTime />} />
        <Route path="updateprofile" element={<UpdateProfile />} />
        <Route path="myprofile/myevents" element={<MyEventsPage/>} />
        <Route path="myprofile/myproducts" element={<MyProductsPage/>} />
        <Route path="myprofile/myfuntimes" element={<MyFuntimesPage/>} />
        <Route path="updateevent/:eventId" element={<UpdateEvent/>} />
       
       
        <Route path="updatefuntime/:funtimeId" element={<UpdateFuntime/>} />

      </Routes>
    </>
  );
}


export default App;
