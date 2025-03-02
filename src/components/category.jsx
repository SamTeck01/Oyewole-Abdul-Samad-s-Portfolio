import { NavLink, Outlet, useParams } from "react-router-dom";
import {getCategory} from '../api.js';
import '../App.css'
const Category=()=>{

    const {catId} = useParams();
    const category = getCategory(catId);
    console.log(useParams())
    
    return(
        <section style={{color: 'var(--accent)'}}>
            <h3 className="mb-4">{category.name}</h3>
            <div style={{display: 'flex', gap: '20px'}}>
                {category.session.map((cat)=>{
                    return <NavLink key={cat.id} to={cat.id} className={ ({isActive})=> isActive ? 'hovered-info hover-info' : 'hover-info text-grey' } >
                        <h6>{cat.name}</h6>
                        <p>{cat.speaker.name} | {cat.speaker.org}</p>
                    </NavLink>
                })}
            </div>
            <Outlet/>
        </section>
    )
}

export default Category;