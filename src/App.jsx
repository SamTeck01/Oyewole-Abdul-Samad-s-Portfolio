import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import Header from "./components/header"
import Home from './components/Home';
import Footer from './pages/Footer';

export default function App() {
  return (
    <main className="text-tertiary">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/> } />
          <Route path='*' element={<p>Page not found😏</p>}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
      

    </main>
  )
}