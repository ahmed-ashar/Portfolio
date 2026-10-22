import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';
export default function Time() {
 const { timeZone,location }=useContent().identity;
 const [time,setTime]=useState('');
 useEffect(()=>{const formatter=new Intl.DateTimeFormat('en-US',{timeZone,hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true});const tick=()=>setTime(formatter.format(new Date()));tick();const id=setInterval(tick,1000);return ()=>clearInterval(id);},[timeZone]);
 return <div className="text-off-white text-xs redHatMono"><span className="sr-only">Local time in {location}: </span>{time}</div>;
}
