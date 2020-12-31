
const hideAndShow = (hide,show) => {
    const hideThis = document.getElementById(hide)
    const showThis = document.getElementById(show)

    hideThis.classList.add("hide")
    showThis.classList.remove("hide")

}

const hideOrShow = (container,elementID,method)=>{
    const element = container.querySelector(`#${elementID}`)
    if(element){
        if(method === "show"){
            element.classList.remove("hide")
        }else{
            element.classList.add("hide")
        }
    }
   
}


const debounce = (func, wait, immediate)=> {
    let timeout;
  
    return function executedFunction() {
      const context = this;
      const args = arguments;
          
      const later =()=> {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      const callNow = immediate && !timeout;
      
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };

  const modifyDate = (date) =>{
      return  new Date(Number(date)).toISOString().split('T')[0]
  }

  const getDeffrenceInDays = (date1,date2)=>{
    const length = new Date(date1).getTime()-new Date(date2).getTime()
    const days = length / 86400000
    return days
  }

  const addDays = (date, days) =>{
    console.log(date)
    console.log(days)
    const  newDate = new Date(date);
    console.log(newDate)
    newDate.setDate(newDate.getDate() + days);
    console.log(newDate)

    return newDate;
  }

  const removeDays = (date, days) =>{
    const  newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
  }

 

export {
    hideAndShow,hideOrShow,debounce,modifyDate,getDeffrenceInDays,addDays,removeDays
}
