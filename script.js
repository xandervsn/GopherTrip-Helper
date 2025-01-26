// Initialize the map and required services
async function initMap() {
  // Create a map instance centered on a default location

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:44.9842678274844, lng: -93.25080283378745},
    zoom: 15,
    mapId: 'f8ca2dc215ac0fd6'
  });

  // Create the DirectionsService object
  const directionsService = new google.maps.DirectionsService();

  // Optional: Add click handlers for interactive point selection
  let markers = [];
  let currentPolyline = null;

  rt6 = new google.maps.Polyline({
    path: [
    ],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1,
    strokeWeight: 4
  });
  rt6.setMap(map);

  map.addListener('click', (event) => {
      if (markers.length >= 2) {
          // Reset existing markers and polyline
          markers.forEach(marker => marker.setMap(null));
          markers = [];
          if (currentPolyline) {
              currentPolyline.setMap(null);
          }
      }

      // Add new marker
      const marker = new google.maps.Marker({
          position: event.latLng,
          map: map
      });
      markers.push(marker);

      // If we have two points, calculate and display the route
      if (markers.length === 2) {
          const request = {
              origin: markers[0].getPosition(),
              destination: markers[1].getPosition(),
              travelMode: google.maps.TravelMode.TRANSIT,
              transitOptions: {
                modes: [google.maps.TransitMode.BUS]
              }
          };

          directionsService.route(request, (response, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                  const path = response.routes[0].overview_path;
                  str = ""
                  path.forEach((element) => str += `{lat: ${element.lat()}, lng: ${element.lng()}},\n`)
                  console.log(str)
    
                  currentPolyline = new google.maps.Polyline({
                      path: path,
                      geodesic: true,
                      strokeColor: '#00FFFF',
                      strokeOpacity: 1.0,
                      strokeWeight: 3
                  });

                  currentPolyline.setMap(map);
              }
          });
      }
  });
}

fetch('rt_121.txt')
  .then(response => response.text())
  .then(text => {
    let myString = "";
    myString += text; // Append text from file
    myString = myString.replace(/(\r\n|\n|\r|,|{|}|:|n|g|a|t|l)/gm, "");
    myString = myString.replace(/(  )/gm, " ");
    arr = myString.split(" ");

    let output = "";

    for (let i = 1; i < arr.length; i++) {
        output += "{\n";
        output += `"lat": ` + arr[i] + ",\n";
        i++;
        output += `"lng": ` + arr[i] + "\n";
        output += "},\n";
    }

    console.log(output);
  })
  .catch(error => console.error('Error:', error));
