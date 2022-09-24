let timeContainer = document.getElementById("timeContainer");
let dateContainer = document.getElementById("dateContainer");
let contentContainer = document.getElementById("contentContainer");

function addZero(num) {
    num < 10 ? num="0"+num : num;
   return num;
}
addZero(11)
function convertToAmPm(Time) {

    let amPm= Time.substr(0, 2) < 12 ? 'ص' : 'م' ;
    hour= addZero(Time.substr(0, 2)%12);
    let minutes = Time.substr(3);
    let time = hour + ":" + minutes + " " + amPm;
    return time;
}

function createElemnt(content, time, active) {
    
    let div = document.createElement("div");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");

    div.classList.add("col-12", "px-5", "py-4", "d-flex", "justify-content-between");
    if (active) {
        div.classList.add("bg-primary", "text-white", "fw-bold", "shadow",false);
    }
    p1.classList.add("d-inline-block", "m-0", "p-0");
    p2.classList.add("d-inline-block", "m-0", "p-0");

    p1.innerText = content;
    p2.innerText = time;

    div.appendChild(p1);
    div.appendChild(p2);
    contentContainer.appendChild(div);


}
const time = new Date();
let checktime = time.getHours();

function gettime() {
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let localtime = hour + ":" + minutes;
    localtime = convertToAmPm(localtime);
    timeContainer.innerText = localtime;
}


setInterval(gettime, 1000);

async function succesCallack (postition) {
    let date =await new Date();
    let latitude  =await postition.coords.latitude;
    let longitude  =await postition.coords.longitude;
    fetch(`http://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=4&month=${date.getMonth}&year=${date.getFullYear()}`)
    .then((response) => response.json())
    .then((d) => d.data)
    .then((data) => {

        data = data[0];
        console.log(data);

        let datahijri = data.date.hijri.date;
        let Fajr = data.timings.Fajr.substr(0,5);
        let Sunrise = data.timings.Sunrise.substr(0,5);
        let Dhuhr = data.timings.Dhuhr.substr(0,5);
        let Asr = data.timings.Asr.substr(0,5);
        let Maghrib = data.timings.Maghrib.substr(0,5);
        let Isha = data.timings.Isha.substr(0,5);

        let FajrActive = SunriseActive = DhuhrActive = AsrActive = MaghribActive = IshaActive = false;

        let checkFajr = Math.floor(data.timings.Fajr.substr(0,5).substr(0,2));
        let checkSunrise = Math.floor(data.timings.Sunrise.substr(0,5).substr(0,2));
        let checkDhuhr = Math.floor(data.timings.Dhuhr.substr(0,5).substr(0,2));
        let checkAsr = Math.floor(data.timings.Asr.substr(0,5).substr(0,2));
        let checkMaghrib = Math.floor(data.timings.Maghrib.substr(0,5).substr(0,2));
        let checkIsha = Math.floor(data.timings.Isha.substr(0,5).substr(0,2));


        if ( checktime > checkFajr -1 && checktime < checkSunrise ) {
            FajrActive = true;
            console.log("FajrActive");
        } else if ( checktime > checkSunrise -1 && checktime < checkDhuhr ) {
            SunriseActive = true;
            console.log("SunriseActive");

        } else if ( checktime > checkDhuhr -1 && checktime < checkAsr ) {
            DhuhrActive = true;
            console.log("DhuhrActive");

        
        } else if ( checktime > checkAsr -1 && checktime < checkMaghrib ) {
            AsrActive = true;
            console.log("AsrActive");


        
        } else if ( checktime > checkMaghrib -1 && checktime < checkIsha ) {
            MaghribActive = true;
            console.log("MaghribActive");

        } else if ( checktime > checkIsha -1 && checktime < 24 ) {
            IshaActive = true;
            console.log("IshaActive");


        } 
        console.log(
            Math.floor(Fajr.substr(0,2)) > Math.floor(Fajr.substr(0,2))-1 && Math.floor(Fajr.substr(0,2)) < Math.floor(Sunrise.substr(0,2))
            );

        dateContainer.innerText = datahijri;
        createElemnt("الفجر", convertToAmPm(Fajr), FajrActive);
        createElemnt("شروق الشمس", convertToAmPm(Sunrise), SunriseActive);
        createElemnt("الظهر", convertToAmPm(Dhuhr), DhuhrActive);
        createElemnt("العصر", convertToAmPm(Asr), AsrActive);
        createElemnt("المغرب", convertToAmPm(Maghrib), MaghribActive);
        createElemnt("العشاء", convertToAmPm(Isha), IshaActive);




    });
}
const errorCallack = (e) => {
    contentContainer.innerText="لا يمكن الوصول لموقعك";
}

navigator.geolocation.getCurrentPosition(succesCallack, errorCallack);
