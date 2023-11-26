import './App.css';
import ProductDetails from './components/ProductDetails';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductDetails /> } />
          

        </Routes>
      </Router>
     
    </div>
  );
}

export default App;
