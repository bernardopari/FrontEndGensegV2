import Link from 'next/link'
//import Navbar from '@/components/comPageMain/navbar'
//import Carrusel from '@/components/comPageMain/carrusel';
//import {Cards} from '@/components/comPageMain/Cards';
import Image from 'next/image'
import {Footer, Carrusel, Navbar} from '@/app/page'


const datos = [
    {
      src: "/resources/images/fb1.jpg",
      alt: "First slide",
      titulo: "GENSEG",
      subtitulo: "Dpsec",
    },
    {
      src: "/resources/images/fb2.jpg",
      img: "Second slide",
      heading: "Gestion Ambiental",
      description: "Evidencia de la actividad de la que nosotros nos encontramos con todos",
    },
    {
      src: "/resources/images/fb3.jpg",
      alt: "Third slide",
      heading: "Seguimiento al egresado",
      
    },
    {
      src: "/resources/images/fb4.jpg",
      alt: "Fourth slide",
      heading: "Proyección Social y Extensión Cultural",
      description: "Evidencia de las que no estamos, y sobre todo el respeto",
    },
    ];
  

export default function Gamb(){
    return(
        <div className=''>
            <Navbar/>
            <Carrusel data={datos} />
           
            {/*<Cards/>*/}
            <Footer/>
        </div>
    )
}