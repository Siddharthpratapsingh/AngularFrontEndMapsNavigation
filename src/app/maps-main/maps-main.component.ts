import { Component, OnInit , ViewChild} from '@angular/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-maps-main',
  templateUrl: './maps-main.component.html',
  styleUrls: ['./maps-main.component.css']
})
export class MapsMainComponent implements OnInit {

title = 'maps';

  @ViewChild('gmap') gmapElement: any;
    @ViewChild('routeGo') Go: any;
    @ViewChild('routeTo') to:any;
    @ViewChild('routeFrom') from:any;
    @ViewChild('directions') direction:any;
    @ViewChild('waypointAdditional') wayPoints:any;
  

  ngOnInit() {
  

var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
var directionsService = new google.maps.DirectionsService();
var map;
var line;
var int;
var buttonRoute = this.Go.nativeElement;
var buttonWaypoint = this.wayPoints.nativeElement;
var routeFrom= this.from.nativeElement;

var routeTo=this.to.nativeElement;
directionsDisplay.addListener('directions_changed', function() {
    createPolyline(directionsDisplay.getDirections());
  });
buttonRoute.addEventListener('click',calcRoute);
buttonWaypoint.addEventListener('click',addWaypoint);


    var myOptions = {
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(25, 82),
    }
  map = new google.maps.Map(this.gmapElement.nativeElement, myOptions);
  
  directionsDisplay.setMap(map);
  function addWaypoint(){
  routeTo.insertAdjacentHTML('beforebegin',
    `
    <div style="margin-bottom:7px"><input type="text"  name="waypoint" value="" />
    <label>Waypoint</label><button style="margin-left:10px;" class="remove btn btn-danger btn-sm">Remove</button><div>`) 
  let arr = document.querySelectorAll('.remove')
   arr[arr.length-1].addEventListener('click', function() {
     this.parentNode.remove()
    });
  }

function calcRoute() {
  
  const locations = [];
  //  const waypoints = document.querySelectorAll('input[name="waypoint"]')
  // waypoints.forEach(function(item){
  //   if(item !==''){
  //     locations.push({
  //     location:item,
  //     stopover:true
  //   })
  //   }
  // });
 
    var request = {
        origin: routeFrom.value,
        destination: routeTo.value,
         
      
       // optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING  

    };
    directionsService.route(request, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
      
            //document.getElementById('Gresponse').innerHTML = JSON.stringify(response);
            createPolyline(response);
        }
    });
}

 
function createPolyline(directionResult) {
  if( line!==undefined){
  line.setMap(null)
  clearInterval(int)
  };
  line = new google.maps.Polyline({
      path: [],
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 4,
      icons: [{
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            strokeColor: '#393'
                },
          offset: '0%'
        }]
  });
  var legs = directionResult.routes[0].legs;
      for (var i = 0; i < legs.length; i++) {
        var steps = legs[i].steps;
        for (var j = 0; j < steps.length; j++) {
          var nextSegment = steps[j].path;
          for (var k = 0; k < nextSegment.length; k++) {
            line.getPath().push(nextSegment[k]);
          }
        }
      }
  line.setMap(map);
  animate();
};

function animate() {
    var count = 0;
    int = setInterval(function() {
      count = (count+1) ;
      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
  }, 24)
}
} 
}
