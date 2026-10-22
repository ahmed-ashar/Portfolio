import ScrollVelocity from "../utilis/ScrollVelocity";
import { useContent } from "../context/ContentContext";
export default function ScrollVelocitySlide() {
 const { marquee }=useContent().home;
 return <div className="bg-off-white"><ScrollVelocity texts={marquee.texts} velocity={marquee.speed} /></div>;
}
