import banner from '../assets/demo-it-business-banner-bg.jpg'
const Home=()=>{


    return(
        <section className='flex flex-wrap gap-4'>
            <img src={banner} alt="Banner" className="w-[50%]" />
            <div className=''>
                <h2 className='h2'>Welcome to Red30Tech</h2>
                <p className="lead">Explore our latest gadgets and accessories designed<br/> to elevate your digital lifestyle</p>
            </div>
        </section>
    )
}

export default Home