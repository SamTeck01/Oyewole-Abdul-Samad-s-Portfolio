import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import Header from "./components/header"
import Home from './components/Home';
import Cart from './components/Cart';
import Footer from './pages/Footer';
import Login from './pages/Login';

export default function App() {
  return (
    <main className="text-tertiary">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/> } />
          <Route path='/cart-page' element={<Cart/> } />
          <Route path='/login' element={<Login/>} />
          <Route path='*' element={<p>Page not found😏</p>}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
      

    </main>
  )
}