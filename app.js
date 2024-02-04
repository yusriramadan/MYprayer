function index() {
  const app = document.getElementById("app");
  const card = document.createElement("div");
  const h1 = document.createElement("h1");
    
    card.setAttribute("id", "card");
    card.appendChild(h1);
    app.appendChild(card);
    h1.innerText = "JADWAL SHOLAT";  

  userLocation();

}

function userLocation() {
  if(!navigator.geolocation) {
    alert("Browser Anda tidak mendukung pelacakan lokasi Anda");

  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

}

function success(kordinat) {
  const longitude = kordinat.coords.longitude;
  const latitude = kordinat.coords.latitude;

  setPrayerTimes(latitude, longitude);

}

function error() {
  setPrayerTimes(-6.200000, 106.816666);

}

function setPrayerTimes(latitude, longitude) {
  fetch(`http://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=4`).then(response => response.json()).then(response => {
    const card = document.getElementById("card");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const h2 = document.createElement("h2");


      table.appendChild(tbody)
      card.appendChild(h2)
      card.appendChild(table)

    const date = new Date();
    const today = date.getDate() - 1;
    const data = response.data[today].timings;
    delete data.Firstthird;

    const dataPray = Object.entries(data);


      dataPray.sort((a, b) => {

        if(a[0] === "Imsak") return -1;

        if(b[0] === "Imsak") return 1;

        if(a[0] === "Midnight" && b[0] !== "Lastthird") return 1;

        if(b[0] === "Midnight" && a[0] !== "Lastthird") return -1;
      })

      const dataPrayIndo = dataPray.map(entry => {
        switch (entry[0]) {
          case "Fajr":
            entry[0] = "Subuh";
            break;
          
          case "Sunrise":
            entry[0] = "Matahari Terbit";
            break;

          case "Dhuhr":
            entry[0] = "Zuhur";
            break;

          case "Asr":
            entry[0] = "Ashar";
            break;

          case "Sunset":
            entry[0] = "Matahari Terbenam";
            break;

          case "Isha":
            entry[0] = "Isya";
            break;

          case "Midnight":
            entry[0] = "Tengah Malam";
            break

          case "Lastthird":
            entry[0] = "Waktu Tahajud"

        }

        return entry

      })

        for (let i of dataPrayIndo) {
          const row = tbody.insertRow();
          const name = row.insertCell();
          const time = row.insertCell();

          name.innerText = i[0]
          time.innerText = i[1]
        }

      h2.innerText = `${response.data[today].date.readable} | ${response.data[today].date.hijri.day} ${response.data[today].date.hijri.month.en} ${response.data[today].date.hijri.year}`;

  })

  fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65befbce3f009380882317gvodc343b`).then(response => response.json()).then(response => {
    console.log(response)

    const card = document.getElementById("card");
    const div = document.createElement("div");
      
      const namaKota = response.address.city;
      const hanyaNamaKota = namaKota.replace("City of", "");
      div.innerText = `${hanyaNamaKota} - ${response.address.country}`

    card.appendChild(div);






    

  })

}



index();