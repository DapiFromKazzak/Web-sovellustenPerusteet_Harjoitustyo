function haeKirjastoja() {
    if ($("#haku").val().length > 1) {
        //Tyhjennetään aluksi hakutulokset
        $("#main").empty();
        url = 'https://api.kirjastot.fi/v4/library?name=' + $("#haku").val();

        $.get(url, function (data, status) {
            for (let i = 0; i < data.items.length; i++) {
                let obj = data.items[i];
                //Selvitetään, onko kirjasto suosikeissa ja valitaan oikea tähti kortille
                let favKuva = "./img/star.png";
                if(localStorage.getItem(obj.id) === null){
                    favKuva = "./img/empty-star.png";
                }
                //Luodaan elementti, johon kirjaston tiedot sijoitetaan
                let elem = '<article onclick="addFavorite(\'' + obj.id + '\')"><div><img class="kirjastoKuva" src="' + obj.coverPhoto.medium.url + '"><img id="favoriteImage_'+obj.id+'" class="favoriteImage" src="'+favKuva+'"> <h3>' + obj.name + '</h3><p>' + obj.address.street + ', ' + obj.address.zipcode + ' ' + obj.address.city + '</p></div></article>';
                $("#main").append(elem);
            }

        });
    } else{
        $("#main").empty();
    }
}

function addFavorite(id) {
    url = 'https://api.kirjastot.fi/v4/library?id=' + id;
    $.get(url, function (data, status) {
        console.log(data);
        obj = data.items[0];

        if (localStorage.getItem(obj.id) === null) { //Kirjasto ei ole vielä suosikki, lisätään se suosikiksi
            $("#favoriteImage_"+obj.id).attr('src', './img/star.png');
            let kirjasto = {
                name: obj.name,
                address: obj.address.street + ', ' + obj.address.zipcode + ' ' + obj.address.city,
                image: obj.coverPhoto.medium.url,
                description: obj.description
            }
            kirjasto = JSON.stringify(kirjasto);
            console.log(kirjasto);
            localStorage.setItem(obj.id, kirjasto);
            if (localStorage.getItem("Lisatyt") === null) {
                localStorage.setItem("Lisatyt", obj.id);
            }
            else {
                let lisatyt = localStorage.getItem("Lisatyt");
                lisatyt += "," + obj.id;
                localStorage.setItem("Lisatyt", lisatyt);
            }
        }
        else{ //Poistetaan kirjasto suosikeista
            $("#favoriteImage_"+obj.id).attr('src', './img/empty-star.png');
            localStorage.removeItem(obj.id);
            let lisatyt = localStorage.getItem("Lisatyt");
            lisatyt = lisatyt.split(",");
            let tmp = "";
            for(let i = 0; i < lisatyt.length; i++){
                if(lisatyt[i] != obj.id){
                    if(tmp != ""){
                        tmp += ",";
                    }
                    tmp += lisatyt[i];
                }
            }
            localStorage.setItem("Lisatyt", tmp);
            
            if(tmp == ""){
                localStorage.clear();
            }
        }
    });
}

function naytaLocalStorate() {
    console.log(localStorage.getItem("Lisatyt"));
}

function haeSuosikit(){
    if(localStorage.getItem("Lisatyt") === null){
        console.log("Ei suosikkeja");
        $("#main").append('<div class="errorMessage"><h3>Et ole vielä lisännyt suosikkeja</h3></div>');
    }
    else {
        $("#main").empty();
        //Otetaan tallennetut suosikit talteen local storagesta
        let suosikit = localStorage.getItem("Lisatyt").split(",");
        for (let i = 0; i < suosikit.length; i++) {
            //kaivetaan tallennetut tiedot localstoragesta helpommin käytettävään muuttujaan
            let suosikki = JSON.parse(localStorage.getItem(suosikit[i]));

            let favKuva = "./img/star.png"; //Kaikki kirjastot ovat suosikkeja, voidaan suoraan näyttää suosikki-tähti
            //Luodaan elementti kirjaston tiedoista ja piirretään se main elementtiin
            let elem = '<article onclick="addFavorite(\'' + suosikit[i] + '\')"><div><img class="kirjastoKuva" src="' + suosikki.image + '"><img id="favoriteImage_'+suosikit[i]+'" class="favoriteImage" src="'+favKuva+'"> <h3 style="margin-left:5px;">' + suosikki.name + '</h3><p style="margin-left:5px;">' + suosikki.address+ '</p><br /><div class="description">' + suosikki.description+ '</div></div></article>';
            $("#main").append(elem);
        }
    }
}