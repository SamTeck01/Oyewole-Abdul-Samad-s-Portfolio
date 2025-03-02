import { NavLink, Outlet } from "react-router-dom";
import '../App.css'
import {getCategories} from '../api.js'
const Categories=()=>{

    const categories = getCategories();

    return(
        <>
            <h2>Session Categories</h2>
            <div className="flex flex-wrap g-2 mb-4 text-center">
                {categories.map((cat)=>{
                    return <NavLink to={cat.id} className={({isActive}) => isActive ? 'hoveredCatList hoverCatList ' : 'hoverCatList me-1' } key={cat.id}>{cat.name}</NavLink>
                })}
            </div>
            <Outlet/>
        </>
    )
}

export default Categories;