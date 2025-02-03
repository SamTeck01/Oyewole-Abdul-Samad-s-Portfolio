import bg02 from '../assets/bg-02-free-img.png';
import mypics from '../assets/samteck picture.jpg'

export default function Hero() {
  return (
    <section className="relative h-screen mt-16 w-full pb-12 flex justify-between bg-primary gap-0">
        <img src={bg02} alt="opacity background" className='absolute -top-16 right-0 max-w-[770px] -z-[0]' style={{opacity: '40%' }} />
        <div className="max_padd_container max-h-[470px] !pe-0 relative top-16 xs:top-32 w-[45%] flex items-start justify-between flex-col ">
            <p className="text-gray-30 regular-18 "><span className="regular-18 active_link ">HELLO, </span>MY NAME IS</p>
            <div>
                <h1 className="m-0 playfair-display">Abdul Samad</h1>
                <p className="text-gray-30 playfair-display-md font-extrabold">Web Developer </p>
            </div>
            
            <div className="flex-col " >
                <div className="flex items-center gap-x-5" >
                    <i className='bx bxs-envelope bx-md'></i>
                    <p className=' text-[27px]'>samadoye28@gmail.com</p>
                </div>
                <div className="flex items-center mt-2 gap-x-5" >
                    <i className='bx bxl-whatsapp-square bx-md'></i>
                    <p className=' text-[27px]'>+2349023036748</p>
                </div>
            </div>
        </div>      
        <div className="!p-0 relative w-[55%] !pt-16 flex justify-center">
            <img src={mypics} alt="my picture" className='myPics' />
            
        </div>
    </section>
  )
}
