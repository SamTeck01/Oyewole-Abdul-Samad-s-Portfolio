import '../assets/boxicons-2.1.4 (2)/boxicons-2.1.4/css/boxicons.min.css'

// eslint-disable-next-line react/prop-types
export default function Navbar({containerStyles} ) {
  return (
    <nav className={`${containerStyles}`} >
      <a href='#home' className={({isActive}) => isActive ? 'active_link' : '' } > <div className="flexCenter gap-x-1 gen-font-light" ><i className='bx bx-user'></i> HOME</div> </a>
      <a href='#about' className={({isActive}) => isActive ? 'active_link' : '' } > <div className="flexCenter gap-x-1 gen-font-light" ><i className='bx bx-category-alt' ></i> ABOUT</div> </a>
      <a href='#skills' className={({isActive}) => isActive ? 'active_link' : '' } > <div className="flexCenter gap-x-1 gen-font-light" ><i className='bx bx-category-alt' ></i> SKILLS</div> </a>
      <a href='#projects' className={({isActive}) => isActive ? 'active_link' : '' } > <div className="flexCenter gap-x-1 gen-font-light" ><i className="bx bx-shopping-bag"></i> Project </div> </a>
    </nav>
  )
}
