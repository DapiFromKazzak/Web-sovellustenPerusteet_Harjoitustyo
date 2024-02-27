function haeKirjastoja() {
    if ($("#haku").val().length > 1) {
        $("#main").empty();
        url = 'https://api.kirjastot.fi/v4/library?name=' + $("#haku").val();

        $.get(url, function (data, status) {
            console.log(data.items);
            $("#searchResult").empty();
            for (let i = 0; i < data.items.length; i++) {
                obj = data.items[i];
                let favKuva = "./img/star.png";
                if(localStorage.getItem(obj.id) === null){
                    favKuva = "./img/empty-star.png";
                }
                let elem = '<article onclick="addFavorite(\'' + obj.id + '\')"><div><img class="kirjastoKuva" src="' + obj.coverPhoto.medium.url + '"><img id="favoriteImage_'+obj.id+'" class="favoriteImage" src="'+favKuva+'"> <h3>' + obj.name + '</h3><p>' + obj.address.street + ', ' + obj.address.zipcode + ' ' + obj.address.city + '</p></div></article>';
                $("#main").append(elem);
            }

        });
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
                image: obj.coverPhoto.small.url,
                description: obj.description
            }

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
    //localStorage.clear();
}

function haeSuosikit(){
    if(localStorage.getItem("Lisatyt") === null){
        console.log("Ei suosikkeja");
        $("#main").append('<div class="errorMessage"><h3>Et ole vielä lisännyt suosikkeja</h3></div>');
    }
    else {
        $("#main").empty();
        let suosikit = localStorage.getItem("Lisatyt").split(",");
        for (let i = 0; i < suosikit.length; i++) {
            url = 'https://api.kirjastot.fi/v4/library?id=' + suosikit[i];
            $.get(url, function (data, status) {
                obj = data.items[0];
                let favKuva = "./img/star.png";
                if(localStorage.getItem(obj.id) === null){
                    favKuva = "./img/empty-star.png";
                }
                let elem = '<article onclick="addFavorite(\'' + obj.id + '\')"><div><img class="kirjastoKuva" src="' + obj.coverPhoto.medium.url + '"><img id="favoriteImage_'+obj.id+'" class="favoriteImage" src="'+favKuva+'"> <h3>' + obj.name + '</h3><p>' + obj.address.street + ', ' + obj.address.zipcode + ' ' + obj.address.city + '</p></div></article>';
                $("#main").append(elem);
            });
        }
    }
    
}