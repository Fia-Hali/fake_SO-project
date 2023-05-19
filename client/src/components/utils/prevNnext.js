
export default function prevNnext(PreorNex, num,leng,setStartIndex,startIndex){
    
  const prevDisabled = startIndex === 0;
  const nextDisabled = startIndex + num >= leng;

  if(PreorNex==="prev"){
    setStartIndex(startIndex - num);
  }
  if(PreorNex==="next"){
    setStartIndex(startIndex + num);
  }
}