import { NavLink } from 'react-router-dom';
import {getCategories} from '../api.js';

function Header() {

  const categories = getCategories();

  return (
    <header className='mb-4 p-4 ' >
      <div className='flex flex-row justify-between'>
        <div className="logo-container">
          <div className='flex flex-row'>
            <span className="logo-main">RED30</span>
            <span className="logo-sub">TECH</span>
          </div>
            
          <div className="logo-motto">YOUR<br/> GUIDE<br/> TO A<br/> BETTER<br/> FUTURE</div>
        </div>
          
        <div className='flex gap-3'>
          <button className="btn-secondary">S</button>
          <button className='btn-secondary-none flexCenter'>Login/Join</button>
        </div>
      </div>

      <nav className='flex gap-3 all-nav'> 

        <NavLink className='nav-item' to='/categories'>Categories</NavLink>
        <NavLink className='nav-item' to='/about'>About</NavLink>
        <NavLink className='nav-item' to='/register'>Register</NavLink>
        {categories.map((cat)=>{
          return <NavLink to={cat.id} className='nav-item' key={cat.id}>{cat.name}</NavLink>
        })}
        <NavLink className='nav-item' to='/categories'>Categories</NavLink>
        <NavLink className='nav-item' to='/about'>About</NavLink>
        <NavLink className='nav-item' to='/register'>Register</NavLink>
        <NavLink className='nav-item' to='/categories'>Categories</NavLink>
        <NavLink className='nav-item' to='/about'>About</NavLink>
        <NavLink className='nav-item' to='/register'>Register</NavLink>
        <NavLink className='nav-item' to='/categories'>Categories</NavLink>
        <NavLink className='nav-item' to='/about'>About</NavLink>
        <NavLink className='nav-item' to='/register'>Register</NavLink>

      </nav>

    </header>
  )
}

export default Header;
