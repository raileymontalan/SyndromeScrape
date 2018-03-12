/* Global values */
thickness = 2;

function updateChart(chart) {
    if(chart == "disease") {
        $("#diseasediv").css('text-align','center').html('<i class="fa fa-refresh fa-spin fa-3x fa-fw margintop100"></i>');
    }
    if(chart == "syndromic") {
        $("#syndromicdiv").css('text-align','center').html('<i class="fa fa-refresh fa-spin fa-3x fa-fw margintop100"></i>');
    }
    if(chart == "forecast") {
        $("#forecastdiv").css('text-align','center').html('<i class="fa fa-refresh fa-spin fa-3x fa-fw margintop100"></i>');
    }
    if(chart == "newsTrends") {
        $("#newsTrendsdiv").css('text-align','center').html('<i class="fa fa-refresh fa-spin fa-3x fa-fw margintop100"></i>');
    }
    var thisprov = $( "body" ).data( chart+"province" );
    var thiscity = $( "body" ).data( chart+"city" );
    var thisyear = $( "body" ).data( chart+"year" );
    var thisdisease = $( "body" ).data( chart );
    var thisprovLabel = $( "body" ).data( chart+"provinceLabel" );
    var thiscityLabel = $( "body" ).data( chart+"cityLabel" );
    var thisyearLabel = $( "body" ).data( chart+"yearLabel" );
    var thisdiseaseLabel = $( "body" ).data( chart+"Label" );
    var thisStemLabel = $( "body" ).data( chart+"stemLabel" );
    thislabel = thiscityLabel + ", " + thisprovLabel + " &bull; " + thisyearLabel + " &bull; " + thisdiseaseLabel;
    $("#"+chart+"Label").html(thislabel);

    if(chart == "disease") {
      getData("disease", [ thisdiseaseLabel ], thisyearLabel, thiscity);
    }
    if(chart == "syndromic") {
      getData("syndromic", thisdiseaseLabel, thisyearLabel, thiscity);
    }
    if(chart == "forecast") {
        getData("forecast", [ thisdiseaseLabel ], thisyearLabel, thiscity);
    }
    if(chart == "newsTrends") {
        getData("newsTrends", [ thisdiseaseLabel ], thisyearLabel, thiscity);
    }

    //close popup
    $('[data-toggle=popover-'+chart+']').popover('hide');
}

function getData(myfilter,mysymptoms,myyear,mygeocode) {
  var body = {
      filter: myfilter,
      symptoms: mysymptoms,
      year: myyear,
      geocode: mygeocode
  };
  cData = [];
  //var promise = $.post("http://fassster.ehealth.ph/web_api/emr",
  //var promise = $.post("http://www.romeljohnsantos.com/api/getjson.php?type="+myfilter,
  var promise = $.post("http://www.romeljohnsantos.com/api/diseases.php",
   body, function(data) {
        if(data){
            var dcounts = data.count;
            const dates = new Array();
            const emra = new Array();
            const emrb = new Array();
            const total = new Array();
            
            if(myfilter != 'newsTrends' && myfilter != 'forecast') {
                $.each(dcounts, function(i, item) {
                    cData.success = "success";
                    cData.location = data.municity_verbose;
                    cData.year = data.year;
                    cData.disease = data.disease;
                    cData.symptom = data.symptoms;
                    cData.push({
                        date: item.datetime,
                        emra: item.iclinicsys,
                        emrb: item.shine,
                        total: item.total
                    });
                });
            } else {
                $.each(dcounts, function(i, item) {
                    cData.success = "success";
                    cData.location = data.municity_verbose;
                    cData.year = data.year;
                    cData.push({
                        date: item.datetime,
                        count: item.total
                    });
                });
            }
        } else {
            cData.success = "none";
        }
    }, "json");

    promise.fail(function() {
        if(myfilter == 'disease') {
            $('#diseasediv').html('<h3 class="paddingtop100">No data found</h3>');
            cData = [];
        }
        if(myfilter == 'syndromic') {
            $('#syndromicdiv').html('<h3 class="paddingtop100">No data found</h3>');
            cData = [];
        }
        if(myfilter == 'forecast') {
            $('#forecastdiv').html('<h3 class="paddingtop100">No data found</h3>');
            cData = [];
        }
        if (myfilter == 'newsTrends') {
            $('#newsTrendsdiv').html('<h3 class="paddingtop100">No data found</h3>');
            cData = [];
        }
    });

    promise.done(function() {
        if(myfilter == 'disease') {
            diseaseChart(cData);
            cData = [];
        }
        if(myfilter == 'syndromic') {
            syndromicChart(cData);
            cData = [];
        }
        if(myfilter == 'forecast') {
            forecastChart(cData);
            cData = [];
        }
        if(myfilter == 'newsTrends') {
            newsTrendsChart(cData);
            cData = [];
        }
    });
}

function diseaseChart(dataResponse) {
  $('#diseaseLabel').text(dataResponse.location + " • " + dataResponse.year + " • " + dataResponse.disease.toString());
  var dchart = AmCharts.makeChart("diseasediv", {
      "type": "serial",
      "theme": "none",
      "marginRight": 65,
      "autoMarginOffset": 20,
      "marginTop": 7,
      "dataProvider": dataResponse,
      "mouseWheelZoomEnabled": false,
      "dataDateFormat": "YYYY-MM-DD",
      "legend": {
          "useGraphSettings": true
      },
      "valueAxes": [{
        "id":"v1",
        "axisColor": "#888888",
        "axisThickness": 2,
        "axisAlpha": 1,
        "position": "left"
      }],
      "graphs": [{
          "valueAxis": "v1",
          "lineColor": "#FF6600",
          "bullet": "round",
          "bulletBorderThickness": 1,
          "hideBulletsCount": 30,
          "title": "iClinicSys",
          "valueField": "emra",
          "fillAlphas": 0,
          "lineThickness": 2,
      }, {
          "valueAxis": "v2",
          "lineColor": "#FCD202",
          "bullet": "square",
          "bulletBorderThickness": 1,
          "hideBulletsCount": 30,
          "title": "ShineOS+",
          "valueField": "emrb",
          "fillAlphas": 0,
          "lineThickness": 2,
      }, {
          "valueAxis": "v3",
          "lineColor": "#B0DE09",
          "bullet": "triangleUp",
          "bulletBorderThickness": 1,
          "hideBulletsCount": 30,
          "title": "Totals",
          "valueField": "total",
          "fillAlphas": 0,
          "lineThickness": 2,
      }],
      "chartScrollbar": {
          "autoGridCount": true,
          "graph": "g1",
          "color": "#000000",
          "backgroundAlpha": 1,
          "backgroundColor": "#999999",
          "gridColor": "#FFFFFF",
          "selectedBackgroundColor": "#CCCCCC",
          "scrollbarHeight": 30
      },
      "chartCursor": {
        "limitToGraph":"g1"
      },
      "categoryField": "date",
      "categoryAxis": {
          "parseDates": true,
          "axisColor": "#DADADA",
          "dashLength": 1,
          "minorGridEnabled": true
      },
      "export": {
          "enabled": true
      }
  });
}

function syndromicChart(dataResponse) {
  $('#syndromicLabel').text(dataResponse.location + " • " + dataResponse.year + " • " + dataResponse.symptom.toString());
  var schart = AmCharts.makeChart("syndromicdiv", {
    "type": "serial",
    "theme": "none",
    "marginRight": 65,
    "autoMarginOffset": 20,
    "marginTop": 7,
    "dataProvider": dataResponse,
    "mouseWheelZoomEnabled": false,
    "legend": {
        "useGraphSettings": true
    },
    "valueAxes": [{
      "id":"v1",
      "axisColor": "#888888",
      "axisThickness": 2,
      "axisAlpha": 1,
      "position": "left"
    }],
    "graphs": [{
        "valueAxis": "v1",
        "lineColor": "#FF6600",
        "bullet": "round",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "iClinicSys",
        "valueField": "emra",
        "fillAlphas": 0,
        "lineThickness": 2,
        //"type": "smoothedLine",
    }, {
        "valueAxis": "v2",
        "lineColor": "#FCD202",
        "bullet": "square",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "ShineOS+",
        "valueField": "emrb",
        "fillAlphas": 0,
        "lineThickness": 2,
        //"type": "smoothedLine",
    }, {
        "valueAxis": "v3",
        "lineColor": "#B0DE09",
        "bullet": "triangleUp",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Totals",
        "valueField": "total",
        "fillAlphas": 0,
        "lineThickness": 2,
        //"type": "smoothedLine",
    }],
    "chartScrollbar": {
        "autoGridCount": true,
        "graph": "g1",
        "color": "#000000",
        "backgroundAlpha": 1,
        "backgroundColor": "#999999",
        "gridColor": "#FFFFFF",
        "selectedBackgroundColor": "#CCCCCC",
        "scrollbarHeight": 30
    },
    "chartCursor": {
      "limitToGraph":"g1"
    },
    "categoryField": "date",
    "categoryAxis": {
        "parseDates": true,
        "axisColor": "#DADADA",
        "dashLength": 1,
        "minorGridEnabled": true
    },
    "export": {
        "enabled": true
    }
  });
}

function forecastChart(dataResponse) {
    $('#forecastLabel').text(dataResponse.location + " • " + dataResponse.year + " • Sample Scenario");
    var schart = AmCharts.makeChart("forecastdiv", {
      "type": "serial",
      "theme": "none",
      "marginRight": 65,
      "autoMarginOffset": 20,
      "marginTop": 7,
      "dataProvider": dataResponse,
      "mouseWheelZoomEnabled": false,
      "legend": {
          "useGraphSettings": true,
          "color": "#FFFFFF"
      },
      "valueAxes": [{
        "id":"v1",
        "axisColor": "#888888",
        "color": "#BBBBBB",
        "axisThickness": 2,
        "axisAlpha": 1,
        "position": "left",
        "gridColor": "#BBBBBB",
      }],
      "graphs": [{
          "valueAxis": "v1",
          "lineColor": "#FF6600",
          "bullet": "round",
          "bulletBorderThickness": 1,
          "hideBulletsCount": 30,
          "title": "Count",
          "valueField": "count",
          "fillAlphas": 0,
          "lineThickness": 2,
          //"type": "smoothedLine",
      }],
      "chartScrollbar": {
          "autoGridCount": true,
          "graph": "g1",
          "color": "#000000",
          "backgroundAlpha": 1,
          "backgroundColor": "#999999",
          "gridColor": "#999999",
          "selectedBackgroundColor": "#CCCCCC",
          "scrollbarHeight": 30
      },
      "chartCursor": {
        "limitToGraph":"g1"
      },
      "categoryField": "date",
      "categoryAxis": {
          "parseDates": true,
          "axisColor": "#888888",
          "color": "#BBBBBB",
          "dashLength": 1,
          "minorGridEnabled": true,
          "gridColor": "#BBBBBB",
      },
      "export": {
          "enabled": true
      }
    });
}

function newsTrendsChart(dataResponse) {
    $('#newsTrendsLabel').text(dataResponse.location + " • " + dataResponse.year + " • Sample Scenario");
    var schart = AmCharts.makeChart("newsTrendsdiv", {
      "type": "serial",
      "theme": "none",
      "marginRight": 65,
      "autoMarginOffset": 20,
      "marginTop": 7,
      "dataProvider": dataResponse,
      "mouseWheelZoomEnabled": false,
      "legend": {
          "useGraphSettings": true,
          "color": "#FFFFFF"
      },
      "valueAxes": [{
        "id":"v1",
        "axisColor": "#888888",
        "color": "#BBBBBB",
        "axisThickness": 2,
        "axisAlpha": 1,
        "position": "left",
        "gridColor": "#BBBBBB",
      }],
      "graphs": [{
          "valueAxis": "v1",
          "lineColor": "#FF6600",
          "bullet": "round",
          "bulletBorderThickness": 1,
          "hideBulletsCount": 30,
          "title": "Count",
          "valueField": "count",
          "fillAlphas": 0,
          "lineThickness": 2,
          //"type": "smoothedLine",
      }],
      "chartScrollbar": {
          "autoGridCount": true,
          "graph": "g1",
          "color": "#000000",
          "backgroundAlpha": 1,
          "backgroundColor": "#999999",
          "gridColor": "#999999",
          "selectedBackgroundColor": "#CCCCCC",
          "scrollbarHeight": 30
      },
      "chartCursor": {
        "limitToGraph":"g1"
      },
      "categoryField": "date",
      "categoryAxis": {
          "parseDates": true,
          "axisColor": "#888888",
          "color": "#BBBBBB",
          "dashLength": 1,
          "minorGridEnabled": true,
          "gridColor": "#BBBBBB",
      },
      "export": {
          "enabled": true
      }
    });
}

function updateSPD(c, d) {
    label = [];
    dat = [];
    tl = 0;
    $.each(d, function(i, item) {
        if(i!='Total') {
            label[i] = item
            tl = tl + item;
        }
        if(i=='count'){
            dat = item;
        }
    });
    
    if(c=='chartDiseases') {
        $('#allTotal').text(tl+50);
        $('#dengueNum').text(label['Dengue']);
        $('#typhoidNum').text(label['Typhoid']);
        $('#measlesNum').text(label['Measles']);
        $('#othersNum').text(50);
    }
    
    if(c=='newsChart') {
        $('#newsChart').text(dat);
        $('#newsChart').attr('data-percent', ((dat/(dat+1000))*100) );
    }
    if(c=='tweetsChart') {
        $('#tweetsChart').text(dat);
        $('#tweetsChart').attr('data-percent', ((dat/(dat+1000))*100) );
    }
    if(c=='newsChart' || c=='tweetsChart') {
        var charts = $('#'+c);
        charts.easyPieChart({
            lineWidth: 16,
            size: 160,
            scaleColor: false,
            trackColor: 'rgba(255,255,255,.15)',
            barColor: '#FFFFFF',
            animate: 2000,
            onStep: function(value) {
                this.$el.find('span').text(~~value);
            }
        });
    }
}

function getSummary(type, chart) {
    body = [];
    dc = [];
    var promise = $.post("http://www.romeljohnsantos.com/api/getjson.php?type="+type,   body, function(data) {
        result = data;
      }, "json");
  
    promise.done(function() {
        updateSPD(chart, result);
    });
}

function updateCits(type, prov) {
    $('select#'+type+'citymun').empty();
    $('select#'+type+'citymun').append("<option value='' disabled selected>Choose Municipality/City</option>");
    $.getJSON( "assets/geojson/lov_citymun.json", function( data ) {
        var cits = [];
        $.each( data.provinces, function( key, val ) {
            if(val.province_code == prov) {
                $.each( val.cities, function( ckey, cval ) {
                    cits.push( "<option value='" + cval.city_code + "'>" + cval.city_name + "</option>" );
                });
            }
        });
        $('select#'+type+'citymun').append(cits.join(""));
    });
}

function updateScenario(scenario) {
    $('select#scenarioSelect').empty();
    $('select#scenarioSelect').append("<option value='' disabled selected>Choose Scenario</option>");
    $.getJSON( "http://fassster.ehealth.ph/web_api/scenariolist/"+scenario, function( sdata ) {
        var scenario = [];
        $.each( sdata.data, function( key, val ) {
            scenario.push( "<option value='" + val.scenario_id + "'>" + val.scenario_name + "</option>" );
        });
        $('select#scenarioSelect').append(scenario.join(""));
    });
}

function storeValue(type, name, sel) {
    
    $( 'body' ).data( type+name, sel.value );

    //console.log(type+name);
    if(type == 'syndromic' && name == '') {
        var result = [];
        var options = sel && sel.options;
        var opt;
      
        for (var i=0, iLen=options.length; i<iLen; i++) {
          opt = options[i];
      
          if (opt.selected) {
            result.push(opt.value || opt.text);
          }
        }
        //console.log(result);
        $( 'body' ).data( type+name+"Label", result );  
    } else {
        //console.log( sel.options[sel.selectedIndex].text );
        $( 'body' ).data( type+name+"Label", sel.options[sel.selectedIndex].text );
    }
}
