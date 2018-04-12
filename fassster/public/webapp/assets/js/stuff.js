
    function buildCount(data) {
        provMaxCount = 0;
        provCount = data.data.total;
        for (var keys in provCount) {
            for (var key in provCount[keys]) {
                // skip loop if the property is from prototype
                //if (!provCount[keys].hasOwnProperty(key) || (key.length < 5 && data_admin == "city")) {
                // continue;
                //}
                if (provMaxCount < provCount[keys][key]) {
                    //console.log(provCount[keys][key]);
                    provMaxCount = provCount[keys][key];
                }
            }
        }
        console.log(provMaxCount);
        //var maxLabel = Math.ceil(provMaxCount / 10) * 10;
    }
    function renderNews(){
        boundaries_url = "assets/geojson/Boundary_Municipalities.geojson";
        $.getJSON(boundaries_url, function(data) {
            var geojsonlayer = {};
            datageojsonlayer = L.geoJson(
                data, { onEachFeature: onEachNewsFeature, style: Newsstyle }
            );
            dataLayer.clearLayers();
            mymap.closePopup();
            dataLayer.addLayer(datageojsonlayer);
            dataLayer.addTo(mymap);
            $('.modal-loading').hide();
        });
        function onEachNewsFeature(feature, layer) {
            var popup = L.popup();
            var datacode = feature.properties.PHCode_Mun.substring(1, 6);
            var name = feature.properties.Mun_Name;
            //format popup text
            sliderDate = $("#myRange").prop("value");
            var j = (monthList.indexOf(sliderDate) + 1)
            var msg = "<b>Municipality: </b>" + name + "<br/>";
            msg += "<b>Count: </b>"
            msg += (provCount[j][datacode]) ? provCount[j][datacode] : (provCount[j][datacode]==0) ? provCount[j][datacode] : "No Data";
            layer.bindPopup(msg);
        }
        function Newsstyle(feature) {
            var datacode = feature.properties.PHCode_Mun.substring(1, 6);
            sliderDate = $("#myRange").prop("value");
            var j = (monthList.indexOf(sliderDate) + 1)
            var count = (provCount[j][datacode]) ? provCount[j][datacode] : -999;
            return {
                fillColor: getNewsColor(count, 0, provMaxCount),
                weight: 0.7,
                opacity: 0.7,
                color: 'gray',
                fillOpacity: 0.75
            };
        }
        // Call sliders update method with any params
        mapslider.update({
            values: monthList,
            from: 0,
            onStart: function (data) {
            //console.log(data);
            },
            onChange: function (data) {
                dataLayer.getLayers()[0].setStyle(Datastyle);
                dataLayer.getLayers()[0].eachLayer(function (layer) {
                    var datacode = layer.feature.properties.PHCode_Mun.substring(1, 6);
                    var name = layer.feature.properties.Mun_Name;
                    sliderDate = $("#myRange").prop("value");
                    var j = (monthList.indexOf(sliderDate) + 1)
                    var msg = "<b>Municipality: </b>" + name + "<br/>";
                    msg += "<b>Count: </b>"
                    msg += (provCount[j][datacode]) ? provCount[j][datacode] : (provCount[j][datacode]==0) ? provCount[j][datacode] : "No Data";
                    layer._popup.setContent(msg);
                });
            },
            onFinish: function (data) {
            //console.log(data);
            
            },
            onUpdate: function (data) {
                //console.log(data);
                if (dataLayer.getLayers()[0]){
                dataLayer.getLayers()[0].setStyle(Datastyle);
                dataLayer.getLayers()[0].eachLayer(function (layer) {
                    var datacode = layer.feature.properties.PHCode_Mun.substring(1, 6);
                    var name = layer.feature.properties.Mun_Name;
                    sliderDate = $("#myRange").prop("value");
                    var j = (monthList.indexOf(sliderDate) + 1)
                    var msg = "<b>Municipality: </b>" + name + "<br/>";
                    msg += "<b>Count: </b>"
                    msg += (provCount[j][datacode]) ? provCount[j][datacode] : (provCount[j][datacode]==0) ? provCount[j][datacode] : "No Data";
                    layer._popup.setContent(msg);
                });
                }
            }
        });
        
    }
}
function getNewsColor(d, min, max) {
    //get range for legend
    grades = [0]
    if (provMaxCount < 50) {
        var step = 4
    } else {
        var step = Math.ceil(provMaxCount / 100) * 10;
    }
    for (var i = 1; i < 8; i++) {
        grades.push(step*i)
    }
    //add legend to map
    legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info newlegend')
        var colors = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'];
        // loop through our density intervals and generate a label with a colored square for each interval
        // set first legend for No Data
        div.innerHTML += '<i style="background:#ccc"></i> No Data <br>'
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1) + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
    return d < min ? "#ccc" :
    d > max ? "#ccc" :
    d >= grades[7] ? '#084594' :
    d >= grades[6] ? '#2171b5' :
    d >= grades[5] ? '#4292c6' :
    d >= grades[4] ? '#6baed6' :
    d >= grades[3] ? '#9ecae1' :
    d >= grades[2] ? '#c6dbef' :
    d >= grades[1] ? '#deebf7' :
    d >= grades[0] ? '#f7fbff' :
    '#ccc';
}

$('#viewComparisonShow').click(function() {
    $( "#viewComparisonHide" ).show();
    $( "#viewComparisonShow" ).hide();
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
$('#viewComparisonHide').click(function() {
    $( "#viewComparisonShow" ).show();
    $( "#viewComparisonHide" ).hide();
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