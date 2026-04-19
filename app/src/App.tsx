import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SocietyGlance from './pages/SocietyGlance';
import Objectives from './pages/Objectives';
import RegistrationDetails from './pages/RegistrationDetails';
import Management from './pages/Management';
import Mission from './pages/Mission';
import OnlineJournal from './pages/OnlineJournal';
import PrintJournal from './pages/PrintJournal';
import PhotoGallery from './pages/PhotoGallery';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminPublicationsList from './pages/AdminPublicationsList';
import AdminPaperUpload from './pages/AdminPaperUpload';
import AdminGallery from './pages/AdminGallery';
import AdminHeroSlider from './pages/AdminHeroSlider';
import IssueDetail from './pages/IssueDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="society-at-glance" element={<SocietyGlance />} />
        <Route path="objectives" element={<Objectives />} />
        <Route path="registration-details" element={<RegistrationDetails />} />
        <Route path="management-council" element={<Management />} />
        <Route path="mission-vision" element={<Mission />} />
        <Route path="jhers" element={<OnlineJournal />} />
        <Route path="jhers/:id" element={<IssueDetail />} />
        <Route path="print-journal" element={<PrintJournal />} />
        <Route path="photo-gallery" element={<PhotoGallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>
      
      <Route path="admin/login" element={<AdminLogin />} />
      
      <Route path="admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="publications" element={<AdminPublicationsList />} />
        <Route path="publications/:id/papers" element={<AdminPaperUpload />} />
        <Route path="announcements" element={<AdminOverview />} /> {/* To be implemented later */}
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="hero" element={<AdminHeroSlider />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
