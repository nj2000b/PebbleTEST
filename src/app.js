//options de configuration 
var city=localStorage.getItem('city');
var tempUnit=localStorage.getItem('temp');
var lang=localStorage.getItem('lang');

console.log("VILLE AVANT"+city);
city=city.replace(/\s/g,"");
console.log("VILLE apres"+city);





//Page de configuration :
Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  Pebble.openURL('http://nj2000.pebble.free.fr/index.html');
});

//A la fermeture de la configuration (SUBMIT) :
Pebble.addEventListener('webviewclosed', function(e) {
  // Decode and parse config data as JSON
  var config_data = JSON.parse(decodeURIComponent(e.response));
  console.log('XXXXXXConfig window returned: ', JSON.stringify(config_data));
//  console.log('XXX VALEUR STOCKEE :'+localStorage['high_contrast']+' bgn color:'+localStorage.background_color);

  // Prepare AppMessage payload
  city=config_data.city;
  lang=config_data.lang;
  tempUnit=config_data.temp;
  localStorage.setItem('temp',tempUnit);
  localStorage.setItem('city',city);
  localStorage.setItem('lang',lang);
  });
  
                        /*
  localStorage.setItem('t1', "toto1");
  localStorage.setItem('t2',"toto2");
      console.log('APP sotoarge2 '+ localStorage.getItem('t1')+localStorage.getItem('t2'));
      console.log('APP sotoarge3 '+ localStorage.getItem(3));
*/
  
  

  
  
  

  // Send settings to Pebble watchapp
  /*
  Pebble.sendAppMessage(dict, function(){
    console.log('Sent config data to Pebble');  
  }, function() {
    console.log('Failed to send config data!');
  });
  */



//METEO PREMIER PRGD et voila VERSION CP2
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
//var Light = require('ui/light');

var colorTemp="orange";
var colorRain="blue";
var colorTime="black";
var colorIcon="white";

  var maxX=144;
  var shiftY=55;//Shift global en Y pour metre un titre
  var posTempX=0;
  var posTempY=0; 

var cityName = city;


//Regarde si il y a une ville
var noCity="No city found";
if (lang=="fr") {noCity="Pas de ville";}
var addCity="Enter a valid city name";
if (lang=="fr") {addCity="Entrez une ville correcte";}
var explainCity="Go to the pebble app on your phone and press the configuration button for this app to enter the city. Then start again the app";
if (lang=="fr") {explainCity="Allez dans l'application Pebble de votre telephone et configurer l'application meteo. Relancez ensuite l'appication";}

var card_settings=new UI.Card({
  title : noCity,
  body : explainCity
});

if (city.length<2 || typeof city == 'undefined') {
  card_settings.show();
}

//Light.on();
// Create a Card with title and subtitle
var loading="loading...";
if (lang=="fr") {loading="chargement...";}
var card = new UI.Card({
  title:'METEO Alex',
  subtitle:loading
});

var win1 = new UI.Window({
  fullscreen: true, 
  scrollable: true,
  backgroundColor: 'white',
});

var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
               'Thursday', 'Friday', 'Saterday'];
if (lang=="fr") {weekday=['Dimanche', 'Lundi', 'Mardi', 'Mercedi',
               'Jeudi', 'Vendredi', 'Samedi'];}
var tailleLigne=25;
 
// Display the Card
card.show();
// Construct URL
var URL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&APPID=7efa723577fa1eea8728bfa0b3ec24a2';
//var URL = 'http://api.openweathermap.org/data/2.5/forecast?q=grenoble&APPID=7efa723577fa1eea8728bfa0b3ec24a2&mode=json';

// 144*168


//Regarde si il y a une ville
var noCity="No city found";
if (lang=="fr") {noCity="Pas de ville";}
var addCity="Enter a valid city name";
if (lang=="fr") {addCity="Entrez une ville correcte";}
var explainCity="Go to the pebble app on your phone and press the configuration button for this app to enter the city. Then start again the app";
if (lang=="fr") {explainCity="Allez dans l'application Pebble de votre telephone et configurer l'application meteo. Relancez ensuite l'appication";}

var card_settings=new UI.Card({
  title : noCity,
  body : explainCity
});

if (city.length<2 || typeof city == 'undefined') {
  card_settings.show();
}

ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
  // Success!
  console.log("Donnees recuperees");
  // Extract data
  // var location = data.list[0].main.temp;
  var nb_info = data.cnt ;
  var cityReturned=data.city.name;
  var countryReturned=data.city.country;
  var items = [];
  var time=[];
  var jour=[];
  var temp=[];
  var rain=[];
  var rainMax=0;
  var minTemp=500;
  var maxTemp=-500;
  console.log("Rentree dans la boucle");
  for (var i=0;i<nb_info;i++)
    {  
      console.log("TEMP EST EN :"+tempUnit);
      var temp_tmp=data.list[i].main.temp-273.15;
      if (tempUnit == "fah") {temp_tmp=temp_tmp*1.8+32;}
      if (tempUnit == "fah") {console.log("FAHRENEIT");}
      if (tempUnit == "cel") {console.log("CELSIUS");}
      temp.push(Math.round(temp_tmp*10)/10);
    //  temp.push(Math.round((data.list[i].main.temp-273.15)*10)/10);
      // Caclucl min et max temp
      if (temp[i]>maxTemp) {maxTemp=temp[i];}
      if (temp[i]<minTemp) {minTemp=temp[i];}
      var rainTmp="";
      if (typeof data.list[i].rain != 'undefined') 
        {
          if (typeof data.list[i].rain['3h'] != 'undefined') 
          {
          rainTmp = Math.round(data.list[i].rain['3h']*10)/10;
          }
        }      
      if (rainTmp>rainMax) {rainMax=rainTmp;}
      console.log("  rain=..."+rainTmp);
      rain.push(rainTmp); 
      console.log("  rain FINISHED");
      var dateunix = data.list[i].dt;
      dateunix = data.list[i].dt;
      var dateOK = new Date(dateunix*1000);
      time.push(dateOK.getHours()) ;
      jour.push(weekday[dateOK.getDay()]);
      card.subtitle("METEO ALEX");
      // CREATION DU MENU
      var icnTemps2=data.list[i].weather[0].icon.substring(0,2)+'d';
      var pluie="No rain";
      if (lang=="fr") {pluie="Sec";}
      if (rainTmp>0) {pluie=rainTmp+"mm";}
      items.push({
        title:jour[i].substring(0,3)+" "+time[i]+"h00",
        subtitle:temp[i]+" C | "+pluie,
        icon: "images/"+icnTemps2+".png",
          });
      }
  console.log("MaxTemp="+maxTemp);
  console.log("MinTemp="+minTemp);
// AJOUT DE L'ENTETE 

    
  var txtEntete1Rect = new UI.Rect({
        position: new Vector2(0, 0),
        size: new Vector2(maxX, 21),
        font: 'gothic-18-bold',
        textAlign: 'left',
        backgroundColor: 'red'
        });
    win1.add(txtEntete1Rect);
    
  var txtEntete1 = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(144, 10),
        font: 'gothic-18-bold',
        text: cityReturned+","+countryReturned,
        textAlign: 'center',
        color: 'black'
        });
    win1.add(txtEntete1);
   
  var txtRain="rain(mm)";
  if (lang=="fr") {txtRain="pluie(mm)";}
  var txtEntete2 = new UI.Text({
       position: new Vector2(0, 20),
        size: new Vector2(90, 10),
        font: 'gothic-18-bold',
        text: txtRain,
        textAlign: 'left',
        color:colorRain
        });
    win1.add(txtEntete2);
   
  var txtTemp="Temp(C)";
    if (tempUnit=="fah") {txtTemp="Temp(F)";}
  var txtEntete3 = new UI.Text({
        position: new Vector2(70, 20),
        size: new Vector2(144-70, 10),
        font: 'gothic-18-bold',
        text:txtTemp,
        textAlign: 'right',
        color:colorTemp,
        });
    win1.add(txtEntete3);
    
    //var jourPrev=jour[0];
  for ( i=0;i<nb_info;i++)
      {
        // CREATION DE LA FENETRE
        
        // Texte heure
        var txtTime=time[i]+"h00";
        var varBold="";
        if (i===0) //prmier element
          {txtTime=jour[i].substring(0,3)+" "+time[i]+"h";
          varBold="-bold";} 
        else 
          {if (time[i]<time[i-1]) //Si on chjangde de jour
            {
            txtTime=jour[i].substring(0,3)+" "+time[i]+"h";
            varBold="-bold";
            }
          }
        // Texte heure
        var xHeure= new UI.Text({
        position: new Vector2(2, posTempY+shiftY),
        size: new Vector2(90, 10),
        font: 'gothic-18'+varBold,
        text: txtTime,
        textAlign: 'left',
        color:colorTime,
        });
        varBold="";
        //texte Temperature
        posTempX=Math.round((temp[i]-minTemp)/(maxTemp-minTemp)*40);
        console.log("POSTEMPX="+posTempX);
        var xTemp = new UI.Text({
        position: new Vector2(maxX-30, posTempY+shiftY),
        size: new Vector2(30, 10),
        font: 'gothic-18-bold',
        text: temp[i],
        textAlign: 'right',
        color: colorTemp
        });
        
        // Barre Temperature principale
       var rectTemp=new UI.Rect({
            position: new Vector2(maxX-28,posTempY+shiftY+7),
            size: new Vector2(-posTempX,10),
            borderColor: colorTemp,
            backgroundColor: colorTemp,
            });
        //Barre Temperature secondaire
        var posTempX2=(posTempX+Math.round((temp[i+1]-minTemp)/(maxTemp-minTemp)*40))/2;
        var rectTemp2=new UI.Rect({
            position: new Vector2(maxX-28,posTempY+shiftY+7+tailleLigne/2+1),
            size: new Vector2(-posTempX2,10),
            borderColor: colorTemp,
            backgroundColor: colorTemp
            });
       
        // Icone Temps
        var icnTemps=data.list[i].weather[0].icon.substring(0,2)+'d';
        var imgRain16 = new UI.Image({
        position: new Vector2(57,posTempY+shiftY+5),
        size: new Vector2(16,16),
        borderColor: colorIcon,
        image: 'images/'+icnTemps+'.png',
        });
        console.log("image :"+icnTemps);
        
        //rectangle de la Pluie
        var valRain=0;
        if (typeof rain[i] != 'number') 
          { 
            valRain=0;} else 
          {
            valRain=rain[i];
            //Position texte + barres de RAIN
            var posRainX=(valRain/rainMax)*40+1;
            // BARRE DE LA PLUIE
            var rectPluie=new UI.Rect({
            position: new Vector2(1+15, posTempY+shiftY-5),
            size: new Vector2(posRainX, 10),
            borderColor: 'blue',
            backgroundColor: 'blue'
            });
            win1.add(rectPluie);
            console.log("VAL RAIN="+Math.ceil(valRain*10));
           
            // Texte de la Pluie
           if (valRain===0) {valRain=" <0.05";}
           var xRain = new UI.Text({
           position: new Vector2(posRainX+15+2, posTempY+shiftY-10),
           size: new Vector2(90, 10),
           font: 'gothic-14',
           text: valRain,
           textAlign: 'left',
           color: colorRain
           });
           win1.add(xRain);

            }
         // Cercle JOUR/NUIT
            var dayNight="white";
            if (time[i]>23||time[i]<9) {dayNight="black";}
            var circleDayNight=new UI.Circle({
            position: new Vector2(7,posTempY+shiftY-10+10),
            radius: 4,
            borderColor: 'black',
            backgroundColor: dayNight,
            });
            win1.add(circleDayNight);
            //win1.add(circlePluie);


      win1.add(xTemp);
      win1.add(rectTemp);
      win1.add(rectTemp2);
      win1.add(xHeure);
      win1.add(imgRain16);
        // Ligne separatrice des jours
      if (time[i]<time[i-1]) //Si on chjangde de jour
            {
            var lineDay = new UI.Rect({
              position:new Vector2(0,posTempY+shiftY+5),
              size:new Vector2(maxX,2),
              borderColor: 'black',
              backgroundColor: 'black',});
              win1.add(lineDay);
            }
      
      posTempX =0; 
      posTempY += tailleLigne;
      } // Fin du for

    card.hide();

    // Construct Menu to show to user
    var menuItems = items;
    var resultsMenu = new UI.Menu({
      textColor: 'red',
      highlightBackgroundColor: 'blue',
      highlightTextColor: 'white',
      sections: [{
        title: 'Meteo Alex',
        items: menuItems
      }]
    });
    
    resultsMenu.show();

    
    win1.on('click', 'select', function(e) {
    console.log('SELECT => go to Menu');
    resultsMenu.show();
    });
    //resultsMenu.show();

    // Add an action for SELECT
    resultsMenu.on('select', function(e) {
    console.log('SELECT => go to win1');
    win1.show(); 
    });




  },
  function(error) {
    // Failure!
    console.log('Impossible de recuperer les donnees ! ' + error);
  }
);

