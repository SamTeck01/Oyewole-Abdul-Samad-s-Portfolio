import {Outlet, useNavigate, useLocation } from "react-router-dom";
import '../App.css'

export function Confirmation(){
    const state = useLocation().state;
    return(
      <>
        <div className='container'>
          <h2>Thank You !</h2>
          <p>{state.nameEl}, you`re now registered for Red30 Tech</p>
          <p>We`ve sent more details to <strong> {state.emailEl} </strong></p>
        </div>
      </>
    )
}

export const RegisterForm=()=>{

    const navigate = useNavigate();

    const handleSubmit=(event)=>{
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        navigate('/register/confirmed', { state: {nameEl: name , emailEl: email} });
        event.preventDefault();
    }

    return(
        <>

            <h2 className="mb-4">Register For Red30 Tech</h2>
            <p className="mb-1">Make sure you grab your spot for this year`s conference!. We love technology and consistently work toward being the premier provider of technology solutions and events that connect the world.</p><br />
            <div className="d-flex justify-content-center">
                <form className="d-flex flex-column">

                    <label htmlFor="email" style={{fontWeight: '500'}}>Name:</label>
                    <input type="text" id="name" style={{width: '400px', height: '40px', border: '2px hsla(0, 0%, 50%, 0.24) solid', borderRadius: '3px'}}/><br/>

                    <label htmlFor="email" style={{fontWeight: '500'}}>Email:</label>
                    <input type="email" id="email" style={{width: '400px', height: '40px', border: '2px hsla(0, 0%, 50%, 0.24) solid', borderRadius: '3px'}}/><br/>

                    <button className="bg-bluegreen text-white fs-5" style={{width: '400px', height: '40px', border: 'hsla(0, 0%, 50%, 0) solid', fontWeight: '400', borderRadius: '3px',}} onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </>
    )
}

const Register=()=>{
    return(
        <>
            <Outlet/>
        </>
    )
}

export default Register;