import banner from '../assets/demo-it-business-banner-bg.jpg'
const Home=()=>{


    return(
        <section className="home-section">
            <img src={banner} alt="Banner" className="img-fluid mx-auto" />
            <h2>Welcome to Red30Tech</h2>
            <p className="lead">Explore our latest gadgets and accessories designed<br/> to elevate your digital lifestyle</p>
        </section>
    )
}

export default Home