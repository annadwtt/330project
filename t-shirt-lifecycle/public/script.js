(function() {

  // The token is loaded from config.js (generated at build time on Vercel
  // from the MAPBOX_TOKEN environment variable).
  const token = window.MAPBOX_TOKEN;
  if (!token || token === "YOUR_MAPBOX_TOKEN_HERE") {
    document.getElementById("map").innerHTML =
      '<p style="padding:20px;font-family:Arial,sans-serif;color:#a65c43;">' +
      'Map unavailable: no Mapbox token found. Set MAPBOX_TOKEN in Vercel ' +
      '(or public/config.js for local testing).</p>';
    return;
  }
  mapboxgl.accessToken = token;

  const root = document.getElementById("shirt-project");
  const mapElement = root.querySelector("#map");

  const stages = [
    {
      coordinates: [72.6,22.3],
      zoom: 5,
      icon: "🌱",
      sceneTitle: "A seed becomes a fiber",
      sceneDescription: "Our T-shirt begins in a cotton field.",
      title: "01. Growing cotton",
      text: "Cotton is grown, harvested, and prepared to become textile fiber. Its environmental footprint begins at the agricultural stage."
    },
    {
      coordinates: [77.5,11.1],
      zoom: 5,
      icon: "🧵",
      sceneTitle: "From fiber to fabric",
      sceneDescription: "Cotton is spun, dyed, cut, and sewn.",
      title: "02. Textile manufacturing",
      text: "The cotton is transformed into yarn and fabric. Dyeing, finishing, cutting, and sewing turn the material into a finished T-shirt."
    },
    {
      coordinates: [50,15],
      zoom: 3,
      icon: "🚢",
      sceneTitle: "Across the ocean",
      sceneDescription: "The finished T-shirt travels toward its market.",
      title: "03. Transportation",
      text: "Clothing moves through international shipping networks before reaching stores and consumers. The exact route depends on where the garment is produced and sold."
    },
    {
      coordinates: [-83.7430,42.2808],
      zoom: 10,
      icon: "👕",
      sceneTitle: "A place in your closet",
      sceneDescription: "The T-shirt reaches a student in Ann Arbor.",
      title: "04. Consumer use",
      text: "After purchasing, wearing, and washing the T-shirt, its owner eventually decides what to do with it next."
    }
  ];

  const map = new mapboxgl.Map({
    container: mapElement,
    style: "mapbox://styles/mapbox/light-v11",
    center: [20,25],
    zoom: 1.5
  });

  map.addControl(new mapboxgl.NavigationControl());

  let markers = [];
  let mapReady = false;

  function clearMap() {
    markers.forEach(marker => marker.remove());
    markers = [];

    if (map.getLayer("shirt-route")) map.removeLayer("shirt-route");
    if (map.getSource("shirt-route")) map.removeSource("shirt-route");
  }

  function addMarker(coords, label) {
    const marker = new mapboxgl.Marker({color:"#526b4e"})
      .setLngLat(coords)
      .setPopup(new mapboxgl.Popup().setText(label))
      .addTo(map);

    markers.push(marker);
  }

  function addRoute(coordinates, dashed=false) {
    if (map.getLayer("shirt-route")) map.removeLayer("shirt-route");
    if (map.getSource("shirt-route")) map.removeSource("shirt-route");

    map.addSource("shirt-route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordinates
        }
      }
    });

    map.addLayer({
      id: "shirt-route",
      type: "line",
      source: "shirt-route",
      paint: {
        "line-color": "#a65c43",
        "line-width": 3,
        "line-dasharray": dashed ? [2,2] : [1,0]
      }
    });
  }

  function showStage(index) {
    const stage = stages[index];

    root.querySelectorAll(".chapter-button").forEach((button,i) => {
      button.classList.toggle("active", i === index);
    });

    root.querySelector("#illustration").textContent = stage.icon;
    root.querySelector("#sceneTitle").textContent = stage.sceneTitle;
    root.querySelector("#sceneDescription").textContent = stage.sceneDescription;
    root.querySelector("#storyTitle").textContent = stage.title;
    root.querySelector("#storyText").textContent = stage.text;
    root.querySelector("#nextButton").classList.toggle("hidden", index !== 3);

    if (!mapReady) return;

    clearMap();
    addMarker(stage.coordinates, stage.title);

    map.flyTo({
      center: stage.coordinates,
      zoom: stage.zoom,
      speed: 0.8
    });
  }

  function showBranches() {
    root.querySelector("#journey-section").classList.add("hidden");
    root.querySelector("#branch-section").classList.remove("hidden");

    // Move the SAME map into the second section.
    root.querySelector("#branch-map-placeholder").appendChild(mapElement);

    map.resize();

    choosePath("donate");
  }

  function backToJourney() {
    root.querySelector("#branch-section").classList.add("hidden");
    root.querySelector("#journey-section").classList.remove("hidden");

    // Move the SAME map back beside the original illustration.
    root.querySelector(".layout").appendChild(mapElement);
    root.querySelector(".layout").insertBefore(
      mapElement,
      root.querySelector(".scene").nextSibling
    );

    map.resize();
    showStage(3);
  }

  function setBranchText(title, text, caption) {
    root.querySelector("#branchTitle").textContent = title;
    root.querySelector("#branchText").textContent = text;
    root.querySelector("#mapCaption").textContent = caption || "";
    root.querySelector("#destinationButtons").innerHTML = "";
  }

  function addDestinationButton(label, coords, zoom) {
    const button = document.createElement("button");
    button.className = "destination-button";
    button.textContent = label;

    button.onclick = function() {
      map.flyTo({
        center: coords,
        zoom: zoom,
        speed: 0.8
      });
    };

    root.querySelector("#destinationButtons").appendChild(button);
  }

  function selectBranch(path) {
    root.querySelectorAll(".branch").forEach(button => {
      button.classList.toggle("selected", button.dataset.path === path);
    });
  }

  function choosePath(path) {
    if (!mapReady) return;

    selectBranch(path);
    clearMap();

    if (path === "trash") {
      const tema = [0,5.67];
      const kantamanto = [-0.21,5.55];
      const lagoon = [-0.21972,5.53455];

      setBranchText(
        "01. Throw it away",
        "If the T-shirt is thrown away in Ann Arbor, it generally enters the local waste system. That does not mean this particular shirt travels to Ghana. Separately, used clothing from wealthier countries is exported to Ghana, where traders at Kantamanto Market sort, repair, resell, and reuse garments. Clothing that cannot be reused can contribute to textile waste in Accra.",
        "Ghana is shown as an example of the wider international secondhand clothing trade — not the verified destination of this particular T-shirt."
      );

      addMarker(tema, "Tema Port — entry point for imported goods");
      addMarker(kantamanto, "Kantamanto Market — an active secondhand clothing market");
      addMarker(lagoon, "Korle Lagoon — an area affected by textile waste");

      addRoute([tema, kantamanto]);

      map.flyTo({
        center: [-0.12,5.58],
        zoom: 10,
        speed: 0.8
      });

      addDestinationButton("Tema Port", tema, 11);
      addDestinationButton("Kantamanto Market", kantamanto, 14);
      addDestinationButton("Korle Lagoon", lagoon, 14);
    }

    else if (path === "donate") {
      const thrift = [-83.6805,42.2565];
      const house = [-83.7420,42.2405];

      setBranchText(
        "02. Donate or resell",
        "Instead of throwing the T-shirt away, its owner could donate it locally. Ann Arbor Thrift Shop resells clean, gently used clothing and uses proceeds to support emergency assistance for local residents. House by the Side of the Road provides free clothing and small household items to people in need. These are two local examples of ways clothing can stay in use.",
        "Explore two local organizations in Ann Arbor. The map locations are approximate."
      );

      addMarker(thrift, "Ann Arbor Thrift Shop");
      addMarker(house, "House by the Side of the Road");

      map.flyTo({
        center: [-83.71,42.25],
        zoom: 12,
        speed: 0.8
      });

      addDestinationButton("Ann Arbor Thrift Shop", thrift, 14);
      addDestinationButton("House by the Side of the Road", house, 14);
    }

    else if (path === "recycle") {
      const annArbor = [-83.7430,42.2808];

      setBranchText(
        "03. Recycle or repurpose",
        "If the T-shirt is too worn or damaged to be passed along, its material may still have another use. Textile recycling can involve turning fabric into fibers for new products, while repurposing can transform old clothing into cleaning cloths, bags, or other items. However, not all clothing can be recycled, and local collection options need to be checked before assuming a garment will be accepted.",
        "The map remains in Ann Arbor while we investigate specific local textile recycling destinations."
      );

      addMarker(annArbor, "Ann Arbor — local recycling options to investigate");

      map.flyTo({
        center: annArbor,
        zoom: 11,
        speed: 0.8
      });
    }

    else if (path === "pass") {
      const students = [
        [-83.7385,42.2780],
        [-83.7350,42.2740],
        [-83.7460,42.2750],
        [-83.7410,42.2850]
      ];

      setBranchText(
        "04. Pass it along",
        "The T-shirt does not have to leave the local community. Its original owner could give it to another student, who wears it for a while before passing it along again. This creates another chapter in the garment's life and delays the need to buy something new. The four locations are fictional examples around the University of Michigan campus.",
        "Follow the illustrative journey between four students in Ann Arbor. These are not actual student locations or documented exchanges."
      );

      students.forEach((coords,i) => {
        addMarker(coords, "Illustrative student " + (i+1));
        addDestinationButton("Student " + (i+1), coords, 14);
      });

      addRoute(students, true);

      map.flyTo({
        center: [-83.741,42.278],
        zoom: 13,
        speed: 0.8
      });
    }

    // Important: resize after the map has moved into its new layout.
    setTimeout(() => map.resize(), 100);
  }

  map.on("load", function() {
    mapReady = true;

    stages.forEach(stage => {
      addMarker(stage.coordinates, stage.title);
    });

    showStage(0);
  });

  window.showStage = showStage;
  window.showBranches = showBranches;
  window.backToJourney = backToJourney;
  window.choosePath = choosePath;

})();
