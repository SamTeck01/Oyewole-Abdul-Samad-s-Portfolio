import {BrowserRouter, Route, Routes} from 'react-router-dom' ;
import Header from './pages/header';
import Home from './pages/home';
import About from './pages/about';
import Categories from './pages/categories';
import Category from './components/category';
import Session from './components/session';
import Register from './pages/register';
import {Confirmation} from './pages/register';
import {RegisterForm} from './pages/register';
export default function App() {
  return (
    <main className="text-tertiary">
      <BrowserRouter>
      
        <body className='container-diff'>
          <Header/>

          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='categories' element={<Categories/>}>
              <Route path=":catId" element={<Category/>}>
                <Route path=':sessionId' element={<Session/>} />
              </Route>
              <Route index element={ <h4 className='fs-4'>Select a category</h4> } />
            </Route>
            <Route path='about' element={<About/>}/>
            <Route path='register' element={<Register/>} >
              <Route index element={<RegisterForm/>} />
              <Route path="confirmed" element={<Confirmation/>} />
            </Route>
            <Route path='*' element={<div className='text-center h2'> <span>Page Not Found</span></div> }/>
          </Routes>
          <footer className='w-100'>
            <p>&copy; Copyright </p>
            <p>{new Date().getFullYear()}</p>
          </footer>
        </body>
      </BrowserRouter>
      

    </main>
  )
}