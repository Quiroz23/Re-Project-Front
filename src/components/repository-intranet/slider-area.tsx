import { Card } from "@/components/ui/card";
import { useGetDocumentsQuery } from "@/redux/features/apiDocument";
import { useGetCareersQuery } from "@/redux/features/apiAcademic";
import { Spinner } from "@nextui-org/spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SliderArea() {
  const { data: document, isLoading } = useGetDocumentsQuery();
  const { data: careers } = useGetCareersQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner color="danger" />
      </div>
    );
  }

  if (!careers || careers.length === 0) {
    return <div className="text-center my-8">No hay áreas disponibles.</div>;
  }

  return (
    <div className="flex justify-center items-center my-8">
      <Swiper
        spaceBetween={15} // Espacio entre las diapositivas
        slidesPerView={careers.length < 3 ? careers.length : 3} // Ajusta el número de slides visibles según la cantidad de datos
        centeredSlides={careers.length === 1} // Centra la diapositiva si hay una sola carrera
        loop={careers.length > 1} // Habilita el loop solo si hay más de una carrera
        breakpoints={{
          320: { slidesPerView: 1 }, // 1 slide en pantallas pequeñas
          640: { slidesPerView: 2 }, // 2 slides en pantallas medianas
          1024: { slidesPerView: careers.length < 3 ? careers.length : 3 }, // Ajuste dinámico en pantallas grandes
        }}
      >
        {careers.map((career) => (
          <SwiperSlide key={career.id}>
            <Card className="w-full h-40 flex items-center justify-center hover:bg-zinc-200 cursor-default p-4">
              <span className="text-xl text-center font-medium break-words max-w-full">
                {career.career_name}
              </span>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
