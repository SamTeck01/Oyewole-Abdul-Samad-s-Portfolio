import { NavLink } from "react-router-dom"
import '../assets/boxicons-2.1.4 (2)/boxicons-2.1.4/css/boxicons.min.css'

// eslint-disable-next-line react/prop-types
export default function Navbar({containerStyles} ) {
  return (
    <nav className={`${containerStyles} `} >
      <NavLink to={'/'} className={({isActive}) => isActive ? 'active_link' : '' } > <div className="flexCenter gap-x-1 gen-font-light" ><i className='bx bx-user'></i> HOME</div> </NavLink>
      <NavLink to={'/mens'} className={({isActive}) => isActive ? 'active_link' : '' } > <div className="flexCenter gap-x-1 gen-font-light" ><i className='bx bx-category-alt' ></i> ABOUT</div> </NavLink>
      <NavLink to={'/womens'} className={({isActive}) => isActive ? 'active_link' : '' } > <div className="flexCenter gap-x-1 gen-font-light" ><i className="bx bx-shopping-bag"></i> PORTFOLIO </div> </NavLink>
    </nav>
  )
}
