//METEO PREMIER PRGD et voila VERSION CP2
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Light = require('ui/light');

var colorTemp="orange";
var colorRain="blue";
var colorTime="black";
var colorIcon="white";

  var maxX=144;
  var shiftY=55;//Shift global en Y pour metre un titre
  var posTempX=0;
  var posTempY=0; 

var cityName = 'meylan';



Light.on();
// Create a Card with title and subtitle
var card = new UI.Card({
  title:'METEO Alex',
  subtitle:'Chargement...'
});
var win1 = new UI.Window({
  fullscreen: true, 
  scrollable: true,
  backgroundColor: 'white',
});

var weekday = ['Dimanche', 'Lundi', 'Mardi', 'Mercedi',
               'Jeudi', 'Vendredi', 'Samedi'];
var tailleLigne=25;
 
// Display the Card
card.show();
// Construct URL
var URL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&APPID=7efa723577fa1eea8728bfa0b3ec24a2';
//var URL = 'http://api.openweathermap.org/data/2.5/forecast?q=grenoble&APPID=7efa723577fa1eea8728bfa0b3ec24a2&mode=json';

// 144*168

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
      temp.push(Math.round((data.list[i].main.temp-273.15)*10)/10);
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
      if (rainTmp>0) {pluie=rainTmp+"mm";}
      items.push({
        title:time[i]+"h00 "+jour[i].substring(0,3),
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
        position: new Vector2(40, 0),
        size: new Vector2(90, 10),
        font: 'gothic-18-bold',
        text: "Meteo Alex",
        textAlign: 'left',
        color: 'black'
        });
    win1.add(txtEntete1);
    
  var txtEntete2 = new UI.Text({
       position: new Vector2(0, 20),
        size: new Vector2(90, 10),
        font: 'gothic-18-bold',
        text: "Pluie(mm)",
        textAlign: 'left',
        color:colorRain
        });
    win1.add(txtEntete2);
    
  var txtEntete3 = new UI.Text({
        position: new Vector2(70, 20),
        size: new Vector2(144-70, 10),
        font: 'gothic-18-bold',
        text: "Temp(C)",
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
        if (i===0) 
          {txtTime=jour[i].substring(0,3)+" "+time[i]+"h";
          varBold="-bold";} 
        else
          {if (time[i]<time[i-1])
            {txtTime=jour[i].substring(0,3)+" "+time[i]+"h";
            varBold="-bold";}
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
            position: new Vector2(maxX-27,posTempY+shiftY+7),
            size: new Vector2(-posTempX,10),
            borderColor: colorTemp,
            backgroundColor: colorTemp,
            });
        //Barre Temperature secondaire
        var posTempX2=(posTempX+Math.round((temp[i+1]-minTemp)/(maxTemp-minTemp)*40))/2;
        var rectTemp2=new UI.Rect({
            position: new Vector2(maxX-27,posTempY+shiftY+7+tailleLigne/2+1),
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

      posTempX =0; 
      posTempY += tailleLigne;

      win1.add(xTemp);
      win1.add(rectTemp);
      win1.add(rectTemp2);
      win1.add(xHeure);
      win1.add(imgRain16);
      } // Fin du for

    card.subtitle('Finished !');

    // Construct Menu to show to user
    var menuItems = items;
    var resultsMenu = new UI.Menu({
      textColor: 'blue',
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

