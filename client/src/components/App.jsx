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
import ComingSoonEventsPage from '../pages/ComingSoonEventsPage';
import FunEventsPage from '../pages/FunEventsPage';
import EducationalEventsPage from '../pages/EducationalEventsPage';
import SocialEventsPage from '../pages/SocialEventsPage';
import PastEventsPage from '../pages/PastEventsPage';
import UpdateProfile from '../pages/UpdateProfile';
import TechMarketplacePage from '../pages/TechMarketplacePage';
import FoodMarketplacePage from '../pages/FoodMarketplacePage';
import AccessoriesMarketplacePage from '../pages/AccessoriesMarketplacePage';
import ClothingMarketplacePage from '../pages/ClothingMarketplacePage';
import ArtMarketplacePage from '../pages/ArtMarketplacePage';
import MyEventsPage from '../pages/MyEventsPage';
import StudentsDataScience from '../pages/StudentsDataScience';
import StudentsSoftware from '../pages/StudentsSoftware';
import StudentsCyberSec from '../pages/StudentsCyberSec';
import StudentsUiUx from '../pages/StudentsUiUx';
import UpdateProduct from '../pages/UpdateProduct';
import UpdateEvent from '../pages/UpdateEvent';
import FunnyFuntimesPage from '../pages/FunnyFuntimesPage';
import EventFuntimesPage from '../pages/EventFuntimesPage';
import MyFuntimesPage from '../pages/MyFuntimesPage';
import AddFunTime from '../pages/AddFuntimes';
import MyProductsPage from '../pages/MyProductsPage';
import UpdateFuntime from '../pages/UpdateFuntimes';
import EducationalFuntimesPage from '../pages/EducationalFuntimesPages';
import MarketplaceProvider from '../context/MarketplaceContext';
import FuntimeProvider from '../context/FuntimeContext';
import EventProvider from '../context/EventContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <BrowserRouter>
<EventProvider>
   <FuntimeProvider>
   <MarketplaceProvider>
    <UserProvider>
      <div className={darkMode ? 'dark-mode' : 'light-mode'}>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignInPage />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/*" element={<ProtectedRoutes toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </div>
    </UserProvider>
    </MarketplaceProvider>
    </FuntimeProvider>
    </EventProvider>
   
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
        <Route path="events" element={<EventsPage />} />
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="updateproduct/:id" element={<UpdateProduct />} />
        <Route path="studentpage" element={<StudentPage />} />
        <Route path="myprofile/mywishlist" element={<MyWishlist />} />
        <Route path="myprofile" element={<ViewProfile />} />
        <Route path="addevent" element={<AddEvent />} />
        <Route path="addfuntime" element={<AddFunTime />} />
        <Route path="events/comingsoon" element={<ComingSoonEventsPage />} />
        <Route path="events/fun" element={<FunEventsPage />} />
        <Route path="events/educational" element={<EducationalEventsPage />} />
        <Route path="events/social" element={<SocialEventsPage />} />
        <Route path="events/past" element={<PastEventsPage />} />
        <Route path="updateprofile" element={<UpdateProfile />} />
        <Route path="marketplace/tech" element={<TechMarketplacePage/>} />
        <Route path="marketplace/food" element={<FoodMarketplacePage/>} />
        <Route path="marketplace/accessories" element={<AccessoriesMarketplacePage/>} />
        <Route path="marketplace/clothing" element={<ClothingMarketplacePage/>} />
        <Route path="marketplace/art" element={<ArtMarketplacePage/>} />
        <Route path="myprofile/myevents" element={<MyEventsPage/>} />
        <Route path="myprofile/myproducts" element={<MyProductsPage/>} />
        <Route path="myprofile/myfuntimes" element={<MyFuntimesPage/>} />
        <Route path="updateevent/:eventId" element={<UpdateEvent/>} />
        <Route path="users/category/software_dev" element={<StudentsSoftware/>} />
        <Route path="users/category/data_science" element={<StudentsDataScience/>} />
        <Route path="users/category/cybersec" element={<StudentsCyberSec/>} />
        <Route path="users/category/ui_ux" element={<StudentsUiUx/>} />
        <Route path="funtimes/funny" element={<FunnyFuntimesPage/>} />
        <Route path="funtimes/events" element={<EventFuntimesPage/>} />
        <Route path="funtimes/educational" element={<EducationalFuntimesPage/>} />
        <Route path="updatefuntime/:funtimeId" element={<UpdateFuntime/>} />

      </Routes>
    </>
  );
}


export default App;
