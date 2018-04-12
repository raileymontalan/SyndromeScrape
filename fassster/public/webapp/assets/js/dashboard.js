/* Global values */
thickness = 2;

/**
 * Updates a Chart
 * @param {String} chart - name of chart to change 
 */
function updateChart(chart) {
    //console.log("Submitting this:", chart);
    if(chart == "disease") {
        $("#diseasediv").css('text-align','center').html('<i class="fa fa-sync fa-spin fa-3x fa-fw margintop100"></i>');
    }
    if(chart == "syndromic") {
        $("#syndromicdiv").css('text-align','center').html('<i class="fa fa-sync fa-spin fa-3x fa-fw margintop100"></i>');
    }
    if(chart == "forecast") {
        $("#scenarioSelect").html('<option data-template="data-template" data-from-map value="{{ sid }}">{{ stitle }}</option>');
        $("#forecastdiv").css('text-align','center').html('<i class="fa fa-sync fa-spin fa-3x fa-fw margintop100"></i>');
    }
    var thisRegion = $( "body" ).data( chart+"region" );
    var thisProv = $( "body" ).data( chart+"province" );
    var thisCity = $( "body" ).data( chart+"city" );
    var thisYear = $( "body" ).data( chart+"year" );
    var thisDisease = $( "body" ).data( chart );
    var thisScenario = $( "body" ).data( chart+"scenario" );
    var thisStem = $( "body" ).data( chart+"stem" );

    var thisProvLabel = $( "body" ).data( chart+"provinceLabel" );
    var thisCityLabel = $( "body" ).data( chart+"cityLabel" );
    var thisYearLabel = $( "body" ).data( chart+"yearLabel" );
    var thisDiseaseLabel = $( "body" ).data( chart+"Label" );
    var thisScenarioLabel = $( "body" ).data( chart+"scenarioLabel" );
    var thisStemLabel = $( "body" ).data( chart+"stemLabel" );
    if(chart == 'disease' || chart == 'syndromic') {
        thisLabel = thisCityLabel + ", " + thisProvLabel + " &bull; " + thisYearLabel + " &bull; " + thisDiseaseLabel;
    } else {
        thisLabel = thisCityLabel + ", " + thisProvLabel + " &bull; " + thisStemLabel + " &bull; " + thisScenarioLabel;
    }
    
    $("#"+chart+"Label").html(thisLabel);
    
    if(thisCity) { 
        $geogroup = 'city'; 
        $loc = thisCity;
    } else { 
        $geogroup = 'province'; 
        $loc = thisProv;
    }
    if(chart == "disease") {
      getData("disease", ["shine","iclinicsys"], [ thisDisease ], "and", "01-12", thisYearLabel, $geogroup, $loc);
    }
    if(chart == "syndromic") {
      getData("syndromic", ["shine","iclinicsys"], thisDiseaseLabel, "and", "01-12", thisYearLabel, $geogroup, $loc);
    }
    if(chart == "forecast") {
        getStemForecast(thisScenario, "6", thisProv, thisCity);
    }

    //close popup
    $('[data-toggle=popover-'+chart+']').popover('hide');
}


function getData(myfilter,mysource,mykeywords,mylogic,mymonth,myyear,mygeogroup,mygeocode) {
    //setup variables and parameters
    var body = {
        month: mymonth,
        year: myyear,
        source: JSON.stringify(mysource),
        geocode: mygeocode,
        geogroup: mygeogroup,
        keywords: JSON.stringify(mykeywords),
        keyword_logic: mylogic
    };
    var cyear = myyear;
    var clocation;

    setyear = [
        "Jan 31 "+cyear,
        "Feb 28 "+cyear,
        "Mar 31 "+cyear,
        "Apr 30 "+cyear,
        "May 31 "+cyear,
        "Jun 30 "+cyear,
        "Jul 31 "+cyear,
        "Aug 31 "+cyear,
        "Sep 30 "+cyear,
        "Oct 31 "+cyear,
        "Nov 30 "+cyear,
        "Dec 31 "+cyear
    ];

    //let us get the full name of the location
    findLocationName(mygeocode).done(function (result) {
        clocation = result;
    })
    //setup json array variable
    cData = [];
    //get data by xhr
    $.ajax({
        url: "http://ec2-52-221-6-180.ap-southeast-1.compute.amazonaws.com/dashboard",
        data: body, 
        type: "get",
        dataType: "json",
        headers: { 
            "Authorization": "HiOfVO6gInSE9ShYy01e",
            "Content-Type": "application/json"
        }
    })
    .done(function(data) {
        //console.log("Disease", data);
        if(data && data.success == true) {
            var dcounts = data.data.count;
            const dates = new Array();
            const emra = new Array();
            const emrb = new Array();
            const total = new Array();

            if(myfilter != 'forecast') {
                $.each(dcounts, function(i, item) {
                    cData.location = clocation;
                    cData.year = cyear;
                    if(myfilter == 'disease') {
                        cData.disease = mykeywords[0];
                    }
                    if(myfilter == 'syndromic') {
                        cData.symptom = mykeywords;
                    }
                    cData.push({
                        date: setyear[i-1],
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
            //console.log("RJBS", setyear, cData);
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
        }
        if(data && data.success == false) {
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
        }
    });

}
/*
// OLD VERSION
function getData(myfilter,mysymptoms,myyear,mygeocode) {
    //setup variables and parameters
    var body = JSON.stringify({
        filter: myfilter,
        symptoms: mysymptoms,
        year: myyear,
        geocode: mygeocode
    });
    var cyear = myyear;
    var clocation;

    //let us get the full name of the location
    findLocationName(mygeocode).done(function (result) {
        clocation = result;
    })
    //setup json array variable
    cData = [];
    //get data by xhr
    $.ajax({
        url: "http://fassster.ehealth.ph/web_api/emr",
        data: body, 
        type: "post",
        dataType: "json"
    })
    .done(function(data) {
        if(data && data.success == true) {
            var dcounts = data.data.count;
            const dates = new Array();
            const emra = new Array();
            const emrb = new Array();
            const total = new Array();

            if(myfilter != 'forecast') {
                $.each(dcounts, function(i, item) {
                    cData.location = clocation;
                    cData.year = cyear;
                    if(myfilter == 'disease') {
                        cData.disease = mysymptoms[0];
                    }
                    if(myfilter == 'syndromic') {
                        cData.symptom = mysymptoms;
                    }
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
            console.log(cData);
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
        }
        if(data && data.success == false) {
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
        }
    });

}
*/
function getStemForecast(scenarioID,myregion,myprovince,mycity) {
    //setup variables and parameters
    var apibody = {
        scenario_id: scenarioID, 
        region: myregion,
        province: myprovince,
        city: mycity
    }
    var clocation;

    //let us get the full name of the location
    findLocationNameBySCode(myprovince, mycity).done(function (result) {
        clocation = result;
    })

    //setup json array variable
    cData = [];
    //get data by xhr
    $.ajax({
        url: "http://104.236.3.75/fassster-api/public/api/simulation/graph",
        data: apibody, 
        type: "get",
        dataType: "json",
        headers: { 
            "Authorization": "Bearer " + token
        }
    })
    .done(function(data) {
        //console.log("STEM counts:", data);
        if(data && data.success == true) {
            var dcounts = data.data;
            
            $.each(dcounts, function(i, item) {
                $.each(item.count, function(a,b) {
                    cData.location = clocation;
                    cData.year = "2017";
                    cData.push({
                        date: "Jan "+(parseInt(a)+1)+" 2017",
                        count: b
                    });
                });
            });
            
            forecastChart(cData);
            cData = [];
        }
        if(data && data.success == false) {
            $('#forecastdiv').html('<h3 class="paddingtop100">No data found</h3>');
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
    $('#forecastLabel').text(dataResponse.location + " • " + dataResponse.year + " • Scenario");

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
          "title": "Scenario",
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

function getCounts() {
    //let us check token
    token = checkToken( $.session.get('userToken') );
    
    $.ajax({
        url: "http://104.236.3.75/fassster-api/public/api/dashboard",
        type: "get",
        dataType: "json",
        headers: { 
            "Authorization": "Bearer " + token
        }
    })
    .done(function(data) {
        //console.log(data);
        if(data && data.success == true){
        d = data.data;
            $('#allTotal').text(d.projects.all_count);
            $('#myTotal').text(d.projects.uploaded_count);
            $('#shareTotal').text(d.projects.shared_count);
            $('#dengueNum').text(d.disease.dengue);
            $('#typhoidNum').text(d.disease.sTyphi);
            $('#measlesNum').text(d.disease.measles);
            $('#othersNum').text(d.disease.others);
        }
    });
}

/**
 * update the scenario dropdown on the Source Options
 * when a STEM Project is chosen
 * @param {Number} project Project ID
 */
function updateScenarioList(project) {
    $('select#scenarioSelect').empty();
    $('select#scenarioSelect').append('<option>Please wait. Loading...</option>');
    //get scenarios
    pageno = 1;
    scenarioData = [{ sid:"", stitle:"Choose Scenario"}];
    var scenariobody = {
        project_id: project, 
        page: pageno
    }
    $.ajax({
        url: "http://104.236.3.75/fassster-api/public/api/scenarios/get",
        data: scenariobody, 
        type: "get",
        dataType: "json",
        headers: { 
            "Authorization": "Bearer " + token
        }
    })
    .done(function(data) {
        //console.log(data);
        if(data && data.success == true) {
            $('select#scenarioSelect').empty();
            $('select#scenarioSelect').append('<option data-template="data-template" data-from-map value="{{ sid }}">{{ stitle }}</option>');
            $.each(data.data, function(i, item) {
                scenarioData.push({
                    sid: i,
                    stitle: item,
                });
            });
        }
        //console.log("Scenarios loaded:", scenarioData);
        //display data using template plugin
        Tempo.prepare("scenarioSelect").render(scenarioData);
    });
}
