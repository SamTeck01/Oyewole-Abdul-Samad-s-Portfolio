import bg02 from '../assets/bg-02-free-img.png';
import mypics from '../assets/samteck picture.jpg'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-primary">
        {/* Background Image */}
        <div className="max_padd_container sm:-mt-20 xl:pt-28 w-full flex flex-col justify-center items-center md:flex-row gap-10 md:gap-0">
            <img 
                src={bg02} 
                alt="opacity background" 
                className="absolute right-0 max-w-[770px] -z-[0] opacity-40 hidden md:block" 
            />

            {/* Text Section */}
            <div className="md:h-[450px] h-full md:pe-0 md:mb-0 mb-5 relative md:top-16 top-28 md:w-[45%] flex items-center justify-center md:justify-start sm:justify-start ">
                <div className='flex gap-6 md:justify-between sm:gap-10 flex-col text-center md:text-left h-full'>
                    <p className="text-gray-30 regular-18 mb-6">
                        <span className="regular-18 active_link">HELLO, </span>MY NAME IS
                    </p>
                    <div>
                        <h1 className="m-0 playfair-display text-4xl md:text-7xl">Abdul Samad</h1>
                        <p className="text-gray-30 playfair-display-md font-extrabold text-2xl mt-2">Web Developer</p>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-x-1 md:gap-x-5">
                            <i className="bx bxs-envelope bx-sm md:bx-md"></i>
                            <p className="text-lg md:text-[27px]">samadoye28@gmail.com</p>
                        </div>
                        <div className="flex items-center mt-2 gap-x-1 md:gap-x-5">
                            <i className="bx bxl-whatsapp-square bx-sm md:bx-md"></i>
                            <p className="text-lg md:text-[27px]">+2349023036748</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div className="!p-0 !pt-16 relative flex justify-center md:w-[55%]">
                <img src={mypics} alt="my picture" className='myPics md:w-[620px] md:h-[620px] w-[620px] h-[400px] ' />
                
            </div>
        </div>
    </section>

  )
}
