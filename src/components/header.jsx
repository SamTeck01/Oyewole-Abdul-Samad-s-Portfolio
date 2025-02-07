import {Link} from 'react-router-dom'
//import logout from '../assets/logout.svg';
import Navbar from './Navbar.jsx'
import { useState } from 'react'

export default function Header() {

  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);

  return (
    <header className='fixed top-0 left-0 m-auto max_padd_container w-full bg-white ring-1 ring-slate-900/5 z-10' >
      <div className='px-4 flexBetween py-3 max-xs:px-2' >
        {/*Logo */}
        <div>
            <Link to={'/'}> <h3 className='font-medium text-4xl '>ABDUL SAMAD OYEWOLE </h3> </Link>
        </div>
        {/*navbar desktop*/}
        <Navbar containerStyles={'hidden md:flex gap-x-5 xl:gap-x-10 medium-15 '} />

        {/*Navbar mobile */}
        <Navbar containerStyles={`${menuOpened ? `flex item-start flex-col gap-y-12
           fixed top-20 right-8 p-12 bg-white rounded-3xl shadow-md w-64 medium-16 
           ring-1 ring-slate-900/5 transition-all duration-300` : `flex item-start flex-col gap-y-12
           fixed top-20 right-8 p-12 bg-white rounded-3xl shadow-md w-64 medium-16 
           ring-1 ring-slate-900/5 transition-all duration-300 hidden ` }`}/>
        {/*Buttons */}
        <div className='flexBetween sm:gap-x-2 bold-16'>
          {!menuOpened ? 
            <i className="bx bx-menu bx-sm flex justify-center items-center md:hidden cursor-pointer hover:text-secondary mr-2 p-1 ring-2 ring-slate-900/30 h-8 w-8 rounded-full " onClick={toggleMenu} ></i> : 
            <i className="bx bx-x bx-sm flex justify-center items-center md:hidden cursor-pointer hover:text-secondary mr-2 p-1 ring-2 ring-slate-900/30 h-8 w-8 rounded-full " onClick={toggleMenu} ></i>
          }
          <div className="flexBetween sm:gap-x-6 cursor-pointer ">
            <a href='#contact' className='btn_secondary_rounded gen-font-light'>Contacts</a>
            {/*hello */}
          </div>
        </div>

      </div>
    </header>
  )
}
