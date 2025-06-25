import '@/components/navigation/navbar.css';
import MapComponent from '../MapComponent';
export default function Navbar({children}: {children: React.ReactNode}) {
  return (
    <div className="navbar">
      <div className="navbar-content">
        {children}
      </div>
      <div className="navbar-map">
        <MapComponent/>
      </div>
    </div>
  );
}
