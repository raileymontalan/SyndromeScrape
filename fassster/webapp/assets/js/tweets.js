
provCount = [];
provMaxCount = 0;
tweetmap = 0;

function updateTweetMap() {
    if (tweetmap = 0) dataLayer.getLayers()[0].setStyle(Tweetstyle);
    else showTweetsMap();
}

function clearMap() {
    dataLayer.clearLayers();
}

function showTweetsMap() {
    $('.modal-loading').show();
    var circleRenderer = L.canvas({ padding: 0.5 });
    dataLayer.clearLayers();
    mymap.closePopup();

    /* reset variables */
    dataLayer = L.featureGroup();
    //provCount = {};
    provMaxCount = 0;

    var data_url = "assets/tempdata/2017-06-01.json";
/* let us fix this data to what is available for now
    data_url += ($('#myRange').val() == "") ? "2017-06-01" : $('#myRange').val(); //"2016-08-10";
    data_url += ".json";
*/
    console.log(data_url);

    $.getJSON(data_url, function(data) {
        plotPoints(data);
        //console.log(data);
    })
    .done(function() {
        $('.modal-loading').hide();
    })
    .fail(
        function(jqXHR, textStatus, errorThrown) {
            alert("ERROR: Cannot retrieve data! Backend API may be down.");
        }
    );

    function plotPoints(data) {;
        for (i = 0; i < data.features.length; i++) {
            dataLayer.addLayer(L.circleMarker([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
                radius: 6,
                stroke: false,
                fill: true,
                fillColor: "#00aced",
                fillOpacity: 0.5,
                renderer: circleRenderer
            }).bindPopup(data.features[i].properties.tweets_to_));
        }

        dataLayer.addTo(mymap);
    }
    
}

function requestTweetData(s,l,f){
    $('.modal-loading').show();
    //remove overlayed layers and popups
    dataLayer.clearLayers();
    mymap.closePopup();
    dataType = "Tweets";
    var data_url = "assets/tempdata/final.json";
    $.getJSON(data_url, function(data) {
        console.log(data);
        renderTweets(data);
    }).fail(
        function(jqXHR, textStatus, errorThrown) {
            alert("ERROR: Cannot retrieve data! Web Service may be down. Please try again later.");
        }
    );

    monthList = ['2017-06-01','2017-06-02','2017-06-03','2017-06-04','2017-06-05','2017-06-06','2017-06-07','2017-06-08','2017-06-09','2017-06-10','2017-06-11','2017-06-12','2017-06-13','2017-06-14','2017-06-15','2017-06-16','2017-06-17','2017-06-18','2017-06-19','2017-06-20','2017-06-21','2017-06-22','2017-06-23','2017-06-24','2017-06-25','2017-06-26','2017-06-27','2017-06-28','2017-06-29','2017-06-30'];
    $( "#slider" ).show();
    $( "#viewTweetsDiv" ).show();

    function renderTweets(data) {
        var geojsonlayer = [];
        var popup = L.popup();
        let i = 0;

        for (i = 0; i < data.length; i++) {
            provCount[data[i].date] = data[i];
            for (var key in data[i]) {
                if (key != "date") {
                    if (data[i][key] > provMaxCount) {
                        provMaxCount = data[i][key];
                    }
                }
            }
        }

        console.log("Max: " + provMaxCount, provCount);

        boundaries_url = "assets/geojson/Boundary_Municipalities.geojson";
        $.getJSON(boundaries_url, function(data) {
            var geojsonlayer = {};

            datageojsonlayer = L.geoJson(
                data, { onEachFeature: onEachTweetFeature, style: Tweetstyle }
            );
            dataLayer.clearLayers();
            mymap.closePopup();
            dataLayer.addLayer(datageojsonlayer);
            dataLayer.addTo(mymap);
        })
        .done(function() {
            $('.modal-loading').hide();
        });

        mapslider.update({
            values: monthList,
            from: 0,
            onStart: function (data) {
                //console.log(data);
            },
            onChange: function (data) {
                //viewTweetsToggle = $('#viewTweets').is(':checked'); 
                if (viewTweetsToggle) updateTweetMap();
                else{
                    dataLayer.getLayers()[0].setStyle(Tweetstyle);
                    dataLayer.getLayers()[0].eachLayer(function (layer) {
                        var datacode = layer.feature.properties.PHCode_Mun;
                        var name = layer.feature.properties.Mun_Name;
                        var msg = name + ': ';
                        selectedDate = $('#myRange').val().substring(5);
                        if (provCount[selectedDate][datacode] != null) {
                            msg += provCount[selectedDate][datacode];
                        } else {
                            msg += "No Data";
                        }
                        layer._popup.setContent(msg);
                    });    
                }
            },
            onFinish: function (data) {
                //console.log(data);
                
            },
            onUpdate: function (data) {
                //console.log(data);
                if (dataLayer.getLayers()[0]){
                    dataLayer.getLayers()[0].setStyle(Tweetstyle);
                    dataLayer.getLayers()[0].eachLayer(function (layer) {
                        var datacode = layer.feature.properties.PHCode_Mun;
                        var name = layer.feature.properties.Mun_Name;
                        var msg = name + ': ';
                        selectedDate = $('#myRange').val().substring(5);
                        if (provCount[selectedDate][datacode] != null) {
                            msg += provCount[selectedDate][datacode];
                        } else {
                            msg += "No Data";
                        }
                        layer._popup.setContent(msg);
                    });
                    
                }
            }
        });
        
    }
    //$('.preloader').hide();
}

//onEachTweetFeature
function onEachTweetFeature(feature, layer) {
    var popup = L.popup();
    var datacode = feature.properties.PHCode_Mun;
    var name = feature.properties.Mun_Name;

    //format popup text
    var msg = name + ': ';
    selectedDate = $('#myRange').val().substring(5);
    if (provCount[selectedDate][datacode] != null) {
        msg += provCount[selectedDate][datacode];
    } else {
        msg += "No Data";
    }
    layer.bindPopup(msg);

}

//Tweetstyle
function Tweetstyle(feature) {
    var datacode = feature.properties.PHCode_Mun;
    var selectedDate = $('#myRange').val().substring(5);
    var count = (provCount[selectedDate][datacode]) ? provCount[selectedDate][datacode] : -999;
    return {
        fillColor: TweetColor(count, 0, provMaxCount),
        weight: 0.7,
        opacity: 0.7,
        color: 'gray',
        fillOpacity: 0.75
    };
}

//TweetColor
function TweetColor(d, min, max) {
    var step = provMaxCount / 18;
    // 18 classes skewed to the left
    return d == -999 ? "#ccc" :
        d > provMaxCount ? '#000034' :
        d > provMaxCount - step * 1 ? '#000034' :
        d > provMaxCount - step * 2 ? '#00004c' :
        d > provMaxCount - step * 3 ? '#00004c' :
        d > provMaxCount - step * 4 ? '#00004c' :
        d > provMaxCount - step * 5 ? '#000066' :
        d > provMaxCount - step * 6 ? '#000066' :
        d > provMaxCount - step * 7 ? '#000066' :
        d > provMaxCount - step * 8 ? '#00007f' :
        d > provMaxCount - step * 9 ? '#00007f' :
        d > provMaxCount - step * 10 ? '#000099' :
        d > provMaxCount - step * 11 ? '#0000e5' :
        d > provMaxCount - step * 12 ? '#0000b3' :
        d > provMaxCount - step * 13 ? '#0000e5' :
        d > provMaxCount - step * 14 ? '#1a1aff' :
        d > provMaxCount - step * 15 ? '#4d4dff' :
        d > provMaxCount - step * 16 ? '#8080ff' :
        d > provMaxCount - step * 17 ? '#b3b3ff' :
        d > provMaxCount - step * 18 ? '#e5e5ff' :
        '#e5e5ff';
}

$('#viewTweetsShow').click(function() {
    $( "#viewTweetsHide" ).show();
    $( "#viewTweetsShow" ).hide();
    tweetmap = 1;
    //pause();
    if (this.checked) $('#play').hide();
    if (!this.checked) $('#play').show();
    clearMap();
    showTweetsMap();
    //show tweets
    /*if (this.checked) {
        clearMap();
        showTweetsMap();
    }*/
    //if (!this.checked) requestTweetData();
});
$('#viewTweetsHide').click(function() {
    $( "#viewTweetsShow" ).show();
    $( "#viewTweetsHide" ).hide();
    tweetmap = 0;
    //pause();
    if (this.checked) $('#play').hide();
    if (!this.checked) $('#play').show();
    clearMap();
    requestTweetData();
    //show tweets
    /*if (this.checked) {
        clearMap();
        showTweetsMap();
    }*/
    //if (!this.checked) requestTweetData();
});