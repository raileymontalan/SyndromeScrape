function requestNewsData(d, y, viz){
    console.log(d, y, viz);
    dataLayer.clearLayers();
    mymap.closePopup();
    postdata = {
        disease:d,
        year:y
    };

    if(viz == 'incident'){
        // $.ajax({
        //     url: "https://firestore.googleapis.com/v1beta1/projects/fassster-news/databases/(default)/documents/incidents/",
        //     data: postdata,
        //     type: "get",
        //     dataType: "json"
        // })
        // .done(function(data){
        //     console.log(data);
        //     renderIncidents(data);
        //     $('.modal-loading').hide();
        // })
        // .fail(function(jqXHR, textStatus, errorThrown) {
        //     alert("ERROR: Cannot retrieve news data! News API may be down.");
        // });
        var data_url = "assets/tempdata/fake.json";
        $.getJSON(data_url, function(data) {
            console.log(data);
            renderIncidents(data);
        })
        .done(function(data){
            $('.modal-loading').hide();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("ERROR: Cannot retrieve news data! News API may be down.");
        });
    } else if(viz == 'status'){
        $.ajax({
            url: "https://firestore.googleapis.com/v1beta1/projects/fassster-news/databases/(default)/documents/statuses/",
            data: postdata,
            type: "get",
            dataType: "json"
        })
        .done(function(data){
            console.log(data);
            renderStatuses(data);
            $('.modal-loading').hide();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("ERROR: Cannot retrieve news data! News API may be down.");
        });
    } else if(viz == 'change'){
        $.ajax({
            url: "https://firestore.googleapis.com/v1beta1/projects/fassster-news/databases/(default)/documents/changes/",
            data: postdata,
            type: "get",
            dataType: "json"
        })
        .done(function(data){
            console.log(data);
            renderChanges(data);
            $('.modal-loading').hide();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("ERROR: Cannot retrieve news data! News API may be down.");
        });
    }
    $("#slider").show();
}

function renderIncidents(data){
    var circleRenderer = L.canvas({ padding: 0.5 });
    properties = {
        radius: 10,
        stroke: false,
        fill: true,
        fillColor: "#69B867",
        fillOpacity: 0.5,
        renderer: circleRenderer
    }
    for (i = 0; i < data.features.length; i++) {
        dataLayer.addLayer(L.circleMarker([
            data.features[i].geometry.coordinates[1],
            data.features[i].geometry.coordinates[0]],
            properties
        ).bindPopup("Count: " +
            data.features[i].properties.incident + "<br/>Title: " +
            data.features[i].properties.title + "<br/>URL: " +
            data.features[i].properties.url));
    }
    dataLayer.addTo(mymap);
}

function renderComparison(data){
    requestEMRData(["iclinicsys","shine"],"01-12",year,geogroup,keywords,keyword_logic,age_group,gender,bmi,bloodtype,bloodpressure);
    requestNewsData(keywords, year, viz)
}

function renderStatuses(data){
    loadBoundaries(data);
    updateSlider();
}

function renderChanges(data){
    loadBoundaries(data);
    updateSlider();
}

function loadBoundaries(data){
    var provCount = [];
    var geojsonlayer = [];
    var popup = L.popup();
    for(i = 0; i < data.length; i++){
        provCount[data[i].date] = data[i];
    }

    boundaries_url = "assets/geojson/Boundary_Provinces.geojson";
    $.getJSON(boundaries_url, function(data) {
        var geojsonlayer = {};
        datageojsonlayer = L.geoJson(
            data, {onEachFeature: onEachNewsFeature, style: Newsstyle}
        );
        dataLayer.clearLayers();
        mymap.closePopup();
        dataLayer.addLayer(datageojsonlayer);
        dataLayer.addTo(mymap);
        $('.modal-loading').hide();
    });
}

function updateSlider(){
    monthList = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    mapslider.update({
        values: monthList,
        from: 0,
        onStart: function (data) {},
        onChange: function (data) {
            dataLayer.getLayers()[0].setStyle(Newsstyle);
            dataLayer.getLayers()[0].eachLayer(function (layer) {
                var code = layer.feature.properties.PHCode_Pro;
                var name = layer.feature.properties.Pro_Name;
                var msg = name + ': ';
                selectedDate = $('#myRange').val();
                if (provCount[selectedDate][code] != null) {
                    msg += provCount[selectedDate][code];
                } else {
                    msg += "No Data";
                }
                layer._popup.setContent(msg);
            });
        },
        onFinish: function (data) {},
        onUpdate: function (data) {
            if (dataLayer.getLayers()[0]){
                dataLayer.getLayers()[0].setStyle(Newsstyle);
                dataLayer.getLayers()[0].eachLayer(function (layer) {
                    var code = layer.feature.properties.PHCode_Pro;
                    var name = layer.feature.properties.Pro_Name;
                    var msg = name + ': ';
                    selectedDate = $('#myRange').val();
                    if (provCount[selectedDate][code] != null) {
                        msg += provCount[selectedDate][code];
                    } else {
                        msg += "No Data";
                    }
                    layer._popup.setContent(msg);
                });
            }
        }
    });
}

function onEachNewsFeature(feature, layer) {
    var popup = L.popup();
    var code = feature.properties.PHCode_Pro;
    var name = feature.properties.Pro_Name;

    //format popup text
    var msg = name + ': ';
    selectedDate = $('#myRange');
    if (provCount[selectedDate][datacode] != null) {
        msg += provCount[selectedDate][datacode];
    } else {
        msg += "No Data";
    }
    layer.bindPopup(msg);
}

function Newsstyle(feature) {
    var code = feature.properties.PHCode_Pro;
    sliderDate = $("#myRange").prop("value");
    var j = (monthList.indexOf(sliderDate) + 1)
    var value = provCount[j][code];
    return {
        fillColor: getNewsColor(value),
        weight: 0.7,
        opacity: 0.7,
        color: 'gray',
        fillOpacity: 0.75
    };
}

function getNewsColor(value) {
    if(value == 'hot'){
        return "#ffcc33"
    } else if(value == 'calamity'){
        return "#ff8833"
    } else if(value == 'outbreak'){
        return "#ff3333"
    } else if(value == 'rise'){
        return "#33dd55"
    } else if(value == 'fall'){
        return "#3333ff"
    }
}

$('#viewComparisonShow').click(function() {
    $( "#viewComparisonHide" ).show();
    $( "#viewComparisonShow" ).hide();
    if (this.checked) $('#play').hide();
    if (!this.checked) $('#play').show();
    dataLayer.clearLayers();
    renderComparison();
});
$('#viewComparisonHide').click(function() {
    $( "#viewComparisonShow" ).show();
    $( "#viewComparisonHide" ).hide();
    if (this.checked) $('#play').hide();
    if (!this.checked) $('#play').show();
    dataLayer.clearLayers();
    renderIncidents();
});