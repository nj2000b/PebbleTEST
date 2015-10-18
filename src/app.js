//METEO
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Light = require('ui/light');

Light.on();
// Create a Card with title and subtitle
var card = new UI.Card({
  title:'METEO Alex',
  subtitle:'Chargement...'
});
var win1 = new UI.Window({
  fullscreen: true, 
  scrollable: true
});


var weekday = ['Dimanche', 'Lundi', 'Mardi', 'Mercedi',
               'Jeudi', 'Vendredi', 'Samedi'];
 
// Display the Card
card.show();
// Construct URL
var cityName = 'paris';
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
      items.push({
        title:time[i]+"h00 "+jour[i],
        subtitle:temp[i]+" oC / "+rain[i]+" mm",
        icon: "images/"+icnTemps2+".png",
          });
      }
  console.log("MaxTemp="+maxTemp);
  console.log("MinTemp="+minTemp);
  var maxX=144;
  var shiftY=40;//Shift global en Y pour metre un titre
  var posTempX=0;
  var posTempY=0; 
// AJOUT DE L'ENTETE 

    
  var txtEntete1Rect = new UI.Rect({
        position: new Vector2(0, 0),
        size: new Vector2(maxX, 21),
        font: 'gothic-18-bold',
        //text: "Meteo Alex",
        textAlign: 'left',
        backgroundColor: 'white'
        });
    win1.add(txtEntete1Rect);
    
  var txtEntete1 = new UI.Text({
        position: new Vector2(40, 0),
        size: new Vector2(90, 10),
        font: 'gothic-18-bold',
        text: "Meteo Alex",
        textAlign: 'left',
        color: 'blue'
        });
    win1.add(txtEntete1);
    
  var txtEntete2 = new UI.Text({
       position: new Vector2(0, 20),
        size: new Vector2(90, 10),
        font: 'gothic-14',
        text: "Pluie (mm)",
        textAlign: 'left',
        color:'blue'
        });
    win1.add(txtEntete2);
    
  var txtEntete3 = new UI.Text({
        position: new Vector2(70, 20),
        size: new Vector2(144-70, 10),
        font: 'gothic-14',
        text: "Temp (oC)",
        textAlign: 'right',
        color:'yellow',
        });
    win1.add(txtEntete3);
    
    //var jourPrev=jour[0];
  for ( i=0;i<nb_info;i++)
      {
        // CREATION DE LA FENETRE
        
        // Texte heure
        var txtTime=time[i]+"h00";
        if (i===0) 
          {txtTime=jour[i].substring(0,3)+" "+time[i]+"h00";} 
        else
          {if (time[i]<time[i-1])
            {txtTime=jour[i].substring(0,3)+" "+time[i]+"h00";}
          }
        // Texte heure
        var xHeure= new UI.Text({
        position: new Vector2(2, posTempY+shiftY),
        size: new Vector2(90, 10),
        font: 'gothic-14',
        text: txtTime,
        textAlign: 'left',
        });
        
        //texte Temperature
        posTempX=maxX-Math.round((temp[i]-minTemp)/(maxTemp-minTemp)*50);
        var xTemp = new UI.Text({
        position: new Vector2(posTempX-30, posTempY+shiftY+15),
        size: new Vector2(30, 10),
        font: 'gothic-14',
        text: temp[i],
        textAlign: 'right',
          color: 'yellow'
        });
        
        // Barre Temperature principale
       var rectTemp=new UI.Rect({
            position: new Vector2(posTempX,posTempY+shiftY+15+10),
            size: new Vector2(144,1),
            borderColor: 'yellow',
            backgroundColor: 'white'
            });
        //Barre Temperature secondaire
        var posTempX2=(posTempX+(maxX-Math.round((temp[i+1]-minTemp)/(maxTemp-minTemp)*50)))/2;
        var rectTemp2=new UI.Rect({
            position: new Vector2(posTempX2,posTempY+shiftY+15+10+15),
            size: new Vector2(144,1),
            borderColor: 'yellow',
            backgroundColor: 'white'
            });
       
       // Texte de la Pluie
        var xRain = new UI.Text({
        position: new Vector2(35, posTempY+shiftY+15),
        size: new Vector2(40, 10),
        font: 'gothic-14',
        text: rain[i],
        textAlign: 'left',
        color: 'blue'
        });
        // Icone Temps
        var icnTemps=data.list[i].weather[0].icon.substring(0,2)+'d';
          var imgRain16 = new UI.Image({
          position: new Vector2(65,posTempY+shiftY+16),
          size: new Vector2(16,16),
          borderColor: 'grey',
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
            if (valRain*2>20) {valRain=10;}
            var rectPluie=new UI.Rect({
            position: new Vector2(1,posTempY+shiftY+10+5+20-Math.ceil(valRain)*3),
            size: new Vector2(15, Math.ceil(valRain)*3),
            borderColor: 'blue',
            backgroundColor: 'blue'
            });
            //win1.add(rectPluie);
            var circlePluie=new UI.Rect({
            position: new Vector2(10,posTempY+shiftY+10+5+10-Math.ceil(valRain)*3),
            radius: Math.ceil(valRain)*2,
            borderColor: 'blue',
            backgroundColor: 'blue'
            });
            win1.add(circlePluie);

          }

      posTempX =0; 
      posTempY += 30;

      win1.add(xTemp);
      win1.add(rectTemp);
      win1.add(rectTemp2);
      win1.add(xHeure);
      win1.add(xRain);
      win1.add(imgRain16);
      } // Fin du for

    card.subtitle('Finished !');

    // Construct Menu to show to user
    var menuItems = items;
    var resultsMenu = new UI.Menu({
      textColor: 'blue',
      highlightBackgroundColor: 'blue',
      highlightTextColor: 'red',
      sections: [{
        title: 'Meteo Alex',
        items: menuItems
      }]
    });
    
      win1.on('select', function(e) {
      console.log('SELECT => go to Menu');
      resultsMenu.show();
    });
    //resultsMenu.show();
    resultsMenu.show();
    card.hide();
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
