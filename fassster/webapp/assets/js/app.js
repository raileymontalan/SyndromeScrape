//
//    Main script of FASSSTER
//
"use strict";
var w;
/*-------------------------------------------
	Main scripts used by theme
---------------------------------------------*/

/**
 * Check if user is logged in
 */
function checkAuth() {
	var userToken = $.session.get('userToken');
	//console.log(userToken);
	return userToken;
}

//logout
function logout() {
	$.session.clear();
	location.href="../";
}

//
//  Function for load content from url and put in $('.ajax-content') block
//
function LoadAjaxContent(url){
	$('.preloader').show();
	$.ajax({
		mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
		url: url,
		type: 'GET',
		success: function(data) {
			//console.log(typeof(w));
			if(typeof(w) == "object") {
				w.terminate();
				w = undefined;
			}
			ww_login_timeout(); //start timeout for login
			$('#ajax-content').html(data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		},
		dataType: "html",
		async: false
	});
}
/**
 * Function to load sidebar & topbar
 */
function LoadPartials() {
	//load sidebar
	$.ajax({
		mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
		url: 'app/partials/sidebar.html',
		type: 'GET',
		success: function(data) {
			$('#sidebar-left').html(data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		},
		dataType: "html",
		async: false
	});
	//load topbar
	$.ajax({
		mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
		url: 'app/partials/topbar.html',
		type: 'GET',
		success: function(data) {
			$('#topbar').html(data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		},
		dataType: "html",
		async: false
	});
}

//
//  Screensaver function
//  used on locked screen, and write content to element with id - canvas
//
function ScreenSaver(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	// Size of canvas set to fullscreen of browser
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	// Create array of particles for screensaver
	var particles = [];
	for (var i = 0; i < 25; i++) {
		particles.push(new Particle());
	}
	function Particle(){
		// location on the canvas
		this.location = {x: Math.random()*W, y: Math.random()*H};
		// radius - lets make this 0
		this.radius = 0;
		// speed
		this.speed = 3;
		// random angle in degrees range = 0 to 360
		this.angle = Math.random()*360;
		// colors
		var r = Math.round(Math.random()*255);
		var g = Math.round(Math.random()*255);
		var b = Math.round(Math.random()*255);
		var a = Math.random();
		this.rgba = "rgba("+r+", "+g+", "+b+", "+a+")";
	}
	// Draw the particles
	function draw() {
		// re-paint the BG
		// Lets fill the canvas black
		// reduce opacity of bg fill.
		// blending time
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
		ctx.fillRect(0, 0, W, H);
		ctx.globalCompositeOperation = "lighter";
		for(var i = 0; i < particles.length; i++){
			var p = particles[i];
			ctx.fillStyle = "white";
			ctx.fillRect(p.location.x, p.location.y, p.radius, p.radius);
			// Lets move the particles
			// So we basically created a set of particles moving in random direction
			// at the same speed
			// Time to add ribbon effect
			for(var n = 0; n < particles.length; n++){
				var p2 = particles[n];
				// calculating distance of particle with all other particles
				var yd = p2.location.y - p.location.y;
				var xd = p2.location.x - p.location.x;
				var distance = Math.sqrt(xd*xd + yd*yd);
				// draw a line between both particles if they are in 200px range
				if(distance < 200){
					ctx.beginPath();
					ctx.lineWidth = 1;
					ctx.moveTo(p.location.x, p.location.y);
					ctx.lineTo(p2.location.x, p2.location.y);
					ctx.strokeStyle = p.rgba;
					ctx.stroke();
					//The ribbons appear now.
				}
			}
			// We are using simple vectors here
			// New x = old x + speed * cos(angle)
			p.location.x = p.location.x + p.speed*Math.cos(p.angle*Math.PI/180);
			// New y = old y + speed * sin(angle)
			p.location.y = p.location.y + p.speed*Math.sin(p.angle*Math.PI/180);
			// You can read about vectors here:
			// http://physics.about.com/od/mathematics/a/VectorMath.htm
			if(p.location.x < 0) p.location.x = W;
			if(p.location.x > W) p.location.x = 0;
			if(p.location.y < 0) p.location.y = H;
			if(p.location.y > H) p.location.y = 0;
		}
	}
	setInterval(draw, 30);
}

//
//  Function for create 2 dates in human-readable format (with leading zero)
//
function PrettyDates(){
	var currDate = new Date();
	var year = currDate.getFullYear();
	var month = currDate.getMonth() + 1;
	var startmonth = 1;
	if (month > 3){
		startmonth = month -2;
	}
	if (startmonth <=9){
		startmonth = '0'+startmonth;
	}
	if (month <= 9) {
		month = '0'+month;
	}
	var day= currDate.getDate();
	if (day <= 9) {
		day = '0'+day;
	}
	var startdate = year +'-'+ startmonth +'-01';
	var enddate = year +'-'+ month +'-'+ day;
	return [startdate, enddate];
}
//
//  Function set min-height of window (required for this theme)
//
function SetMinBlockHeight(elem){
	elem.css('min-height', window.innerHeight - 60)
}

/**
 * Helper for run TinyMCE editor with textarea's
 */
function TinyMCEStart(elem, mode){
	var plugins = [];
	if (mode == 'extreme'){
		plugins = [ "advlist anchor autolink autoresize autosave bbcode charmap code contextmenu directionality ",
			"emoticons fullpage fullscreen hr image insertdatetime layer legacyoutput",
			"link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace",
			"tabfocus table template textcolor visualblocks visualchars wordcount"]
	}
	tinymce.init({selector: elem,
		theme: "modern",
		plugins: plugins,
		//content_css: "css/style.css",
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons",
		style_formats: [
			{title: 'Header 2', block: 'h2', classes: 'page-header'},
			{title: 'Header 3', block: 'h3', classes: 'page-header'},
			{title: 'Header 4', block: 'h4', classes: 'page-header'},
			{title: 'Header 5', block: 'h5', classes: 'page-header'},
			{title: 'Header 6', block: 'h6', classes: 'page-header'},
			{title: 'Bold text', inline: 'b'},
			{title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
			{title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
			{title: 'Example 1', inline: 'span', classes: 'example1'},
			{title: 'Example 2', inline: 'span', classes: 'example2'},
			{title: 'Table styles'},
			{title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
		]
	});
}

/**
 * Function for File upload page (form_file_uploader.html)
*/
function FileUpload(){
	$('#bootstrapped-fine-uploader').fineUploader({
		template: 'qq-template-bootstrap',
		classes: {
			success: 'alert alert-success',
			fail: 'alert alert-error'
		},
		thumbnails: {
			placeholders: {
				waitingPath: "assets/waiting-generic.png",
				notAvailablePath: "assets/not_available-generic.png"
			}
		},
		request: {
			endpoint: 'server/handleUploads'
		},
		validation: {
			allowedExtensions: ['jpeg', 'jpg', 'gif', 'png']
		}
	});
}

/**
 * General Validator Functions
*/
function DemoFormValidator(){
	$('#defaultForm').bootstrapValidator({
		message: 'This value is not valid',
		fields: {
			username: {
				message: 'The username is not valid',
				validators: {
					notEmpty: {
						message: 'The username is required and can\'t be empty'
					},
					stringLength: {
						min: 6,
						max: 30,
						message: 'The username must be more than 6 and less than 30 characters long'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_\.]+$/,
						message: 'The username can only consist of alphabetical, number, dot and underscore'
					}
				}
			},
			country: {
				validators: {
					notEmpty: {
						message: 'The country is required and can\'t be empty'
					}
				}
			},
			acceptTerms: {
				validators: {
					notEmpty: {
						message: 'You have to accept the terms and policies'
					}
				}
			},
			email: {
				validators: {
					notEmpty: {
						message: 'The email address is required and can\'t be empty'
					},
					emailAddress: {
						message: 'The input is not a valid email address'
					}
				}
			},
			website: {
				validators: {
					uri: {
						message: 'The input is not a valid URL'
					}
				}
			},
			phoneNumber: {
				validators: {
					digits: {
						message: 'The value can contain only digits'
					}
				}
			},
			color: {
				validators: {
					hexColor: {
						message: 'The input is not a valid hex color'
					}
				}
			},
			zipCode: {
				validators: {
					usZipCode: {
						message: 'The input is not a valid US zip code'
					}
				}
			},
			password: {
				validators: {
					notEmpty: {
						message: 'The password is required and can\'t be empty'
					},
					identical: {
						field: 'confirmPassword',
						message: 'The password and its confirm are not the same'
					}
				}
			},
			confirmPassword: {
				validators: {
					notEmpty: {
						message: 'The confirm password is required and can\'t be empty'
					},
					identical: {
						field: 'password',
						message: 'The password and its confirm are not the same'
					}
				}
			},
			ages: {
				validators: {
					lessThan: {
						value: 100,
						inclusive: true,
						message: 'The ages has to be less than 100'
					},
					greaterThan: {
						value: 10,
						inclusive: false,
						message: 'The ages has to be greater than or equals to 10'
					}
				}
			}
		}
	});
}

/**
 * Helper for open ModalBox with requested header, content and bottom
 */
function OpenModalBox(header, inner, bottom){
	var modalbox = $('#modalbox');
	modalbox.find('.modal-header-name span').html(header);
	modalbox.find('.lock-modal-inner').html(inner);
	modalbox.find('.lock-modal-bottom').html(bottom);
	modalbox.fadeIn('fast');
	$('body').addClass("body-expanded");
	modalbox.find("a.btn").on('click', function() {
		if(modalbox.find(".pass").val() == $.session.get('userPW')) {
			location.href = "index.html";
		} else {
			CloseModalBox();
		}
	})
}

/**
 * Close modalbox
 */
function CloseModalBox(){
	var modalbox = $('#modalbox');
	modalbox.fadeOut('fast', function(){
		modalbox.find('.modal-header-name span').children().remove();
		modalbox.find('.devoops-modal-inner').children().remove();
		modalbox.find('.devoops-modal-bottom').children().remove();
		$('body').removeClass("body-expanded");
	});
}

/**
 * load functions for FASSSTER UI
 */
/**
 * minizeSidebar
 */
function minimizeSidebar() {
    if($("body").hasClass("sidebar-mini")) {
        $("body").removeClass("sidebar-mini");
    } else {
        $("body").addClass("sidebar-mini");
    }
}
/**
 * Show the page into a Grid or List
 * @param {String} type layout of projects page "grid" or "list"
 */
function showas(type) {
    if(type == 'grid') {
        $('#stemprojects').addClass('blocked');
    } else {
        $('#stemprojects').removeClass('blocked');
    }
}
/**
 * Get the Title of the Page
 * @param {String} url URL of the page being shown
 */
function getTitle(url) {
	var query = url.indexOf("?");
	if(query > 0) {
		var titlee = url.substr(0, query);
	} else {
		var titlee = url;
	}
	
	var title = $('#main-menu a[href="'+titlee+'"]').attr('data-title');
	$('#pagetitle').text( title );
	/*var query = url.indexOf("?");
	if(query > 0) {
		var titlee = url.substr(4, (url.length - (query-1)));
	} else {
		var titlee = url.substr(4, (url.length - 9));
	}
	
	if(titlee == 'ajwcc') {
		$('#pagetitle').text( "AJWCC" );
	} else if(titlee == "" || titlee == "dashboard") {
		$('#pagetitle').text( "Dashboard" );
	} else {
		$('#pagetitle').css("text-transform","capitalize");
		$('#pagetitle').text( titlee );
	}*/
}

//check if token if still active
function checkToken(token) {
	//console.log("to check", token);
	var result;
	$.ajax({
		async: false,
		url: "http://104.236.3.75/fassster-api/public/api/user/profile",
		type: 'get',
		dataType: "json",
		headers: { 
						"Authorization": "Bearer " + token
				},
		success: function(data, textStatus, jqXHR){
						//console.log('OK! Token is active');
				},
		error: function(jqXHR, textStatus, errorThrown){
						//console.log(errorThrown, textStatus);
						result = textStatus;
				}
		})
		.done(function(data) {
				//console.log(data);
				if(data && data.success == true) {
					//return old token
					result = token;
				}
		})
		.fail(function(data){
				//let us do a token refresh
				var ntoken = refreshToken(token);
				//return new token
				result = ntoken;
		});

		return result;
}

//refresh token if it is expired
function refreshToken(token) {
	//console.log("to refresh",token);
	$.ajax({
		url: "http://104.236.3.75/fassster-api/public/api/user/token-refresh",
		type: "post",
		dataType: "json",
		headers: { 
				"Authorization": "Bearer " + token
		}
	})
	.done(function(data) {
			//console.log(data);
			if(data.success == true) {
				//store token into session
				$.session.set('userToken', data.token);
				//return new token
				return data.token
			}
	});
}

function updateCits(type, prov, method) {
	$('select#'+type+'citymun').empty();
	$('select#'+type+'citymun').append("<option value='' disabled selected>Choose Municipality/City</option>");
	$.getJSON( "assets/geojson/lov_citymun.json", function( data ) {
			var cits = [];
			$.each( data.provinces, function( key, val ) {
				if(method == 'bynames'){
					if(val.province_name.replace(" ","").toLowerCase() == prov) {
							$.each( val.cities, function( ckey, cval ) {
								cits.push( "<option value='" + cval.city_name.replace(/[.()\ -]/g, '').toLowerCase() + "'>" + cval.city_name + "</option>" );
							});
					}
				} else {
					if(val.province_code == prov) {
						$.each( val.cities, function( ckey, cval ) {
							cits.push( "<option value='" + cval.city_code + "'>" + cval.city_name + "</option>" );
						});
					}
				}
			});
			$('select#'+type+'citymun').append(cits.join(""));
	});
}

function loadCits(type, select, code) {
	//console.log(type, select, code);
	$('select#'+type+select).empty();
	if(select == 'province') {
		$('select#'+type+select).append("<option value='' disabled selected>Choose Province</option>");
	} else {
		$('select#'+type+select).append("<option value='' disabled selected>Choose Municipality/City</option>");
	}
	$.getJSON( "assets/geojson/lov_citymun.json", function() {
		//console.log('lovCityMun loaded.');
	}).done(function(data){
			var cits = [];
			var selected = "";

			$.each( data.provinces, function( key, val ) {
				if(select == 'province') {
						if(val.province_code == code) selected = "selected";
						cits.push( "<option "+selected+" value='" + val.province_code + "'>" + val.province_name + "</option>" );
						selected = "";
				}
				if(select == 'citymun') {
					
							$.each( val.cities, function( ckey, cval ) {
								if(cval.city_code == code) selected = "selected";
								cits.push( "<option "+selected+" value='" + cval.city_code + "'>" + cval.city_name + "</option>" );
								selected = "";
							});
					
				}
			});
			$('select#'+type+select).append(cits.join(""));
	});
}

function findLocationName(code) {
	var deferred = new $.Deferred();

	var loc = "";
	var xcode = code;
	$.getJSON( "assets/geojson/lov_citymun.json", function() {
			//console.log('lovCityMun loaded.');
	}).done(function(data) {
			$.each( data.provinces, function( key, val ) {
					$.each( val.cities, function( ckey, cval ) {
							if(cval.city_code == xcode) {
									loc = cval.city_name + ", " + val.province_name;
									deferred.resolve(loc);
							}
					});
			});
	});

	return deferred.promise();
}
function findLocationNameBySCode(province, city) {
	var deferred = new $.Deferred();
	var loc = "";
	$.getJSON( "assets/geojson/lov_citymun.json", function() {
			//console.log('lovCityMun loaded.');
	}).done(function(data) {
			//console.log("Scode Locs", data);
			$.each( data.provinces, function( key, val ) {
				if(val.province_name.replace(" ","").toLowerCase() == province) {
					$.each( val.cities, function( ckey, cval ) {
							if(cval.city_name.replace(" ","").toLowerCase() == city) {
									loc =  cval.city_name + ", " + val.province_name;
									deferred.resolve(loc);
							}
					});
				}
			});
	});

	return deferred.promise();
}

$("#sendfile").change(function(){
	//e.preventDefault();
	//let us check token
	token = checkToken( $.session.get('userToken') );
	var file = $('form')[0]; //console.log(file);
	var formdata = new FormData(file);
	
	if($(this).prop('files').length > 0)
	{
			file = $(this).prop('files')[0];
			//formdata.append("zip", file);
	}
		
	//console.log(formdata);

	$("#uploadProject div.modal-body").html("<i class='fa fa-sync fa-spin fa-fw'></i> Please wait. Uploading your STEM Project.").css('text-align', 'center');
	$('#uploadProject div.modal-footer button').attr('disabled','disabled');
	$.ajax({
		url: "http://104.236.3.75/fassster-api/public/api/projects/upload",
		data: formdata,
		type: "post",
		dataType: "json",
		contentType: false,
		processData:false,
		headers: { 
				"Authorization": "Bearer " + token
		}
	})
	.done(function(data) {
			//console.log(data);
			if(data && data.success == true) {
					//console.log(data);
					location.reload();
			} else {
					alert(data.message[0]);
			}
	})
	.fail(function() {
		swal("Oops" , "Error uploading your STEM Project file. Please try again later. Or you can contact FASSSTER.", "error");
		location.reload();
	});
});

//webworker for login timeout
function ww_login_timeout() {
	
	//setup web worker for auto-logout
	if(typeof(Worker) !== "undefined") {
		if(typeof(w) == "undefined") {
			w = new Worker("assets/js/ww_login_timeout.js");
		}
		w.onmessage = function(event) {
			//console.log(event.data);
			if(event.data == 900){ 
				//open screen saver after 15 minutes of inactivity
				//openSS();
			}
			if(event.data == 3600){
				w.terminate();
				w = undefined;
				//logout this session after one hour of inactivity
				logout();
			}
		};
		
	} else {
			alert("Sorry! No Web Worker support.");
	}
}

//open screensaver modal
function openSS() {
	$('body').addClass('body-screensaver');
	$('#screensaver').addClass("show");
	ScreenSaver();
}

/**
 *	Get a list of projects and their statuses 
 */
function getProjectsStatus() {
	
}

/**
 * Store selected values from dropdowns on the Source Options
 * whenever a value is chosen
 * @param {String} type Name of Chart
 * @param {String} name Name of Key (region, province, city, year, disease, symptom, STEM, scenario)
 * @param {Any} sel Value of Key
 */
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

function goTable($table, $thisdata) {
	$table.bootstrapTable({
		data: $thisdata,
		height: 460,
		toolbar: ".toolbar",
		search: true,
		pagination: true,
		pageSize: 10,
		pageList: [10,25,50,100] /*,
			//showRefresh: true,
			//search: true,
			//showToggle: true,
			//showColumns: true,
			//pagination: true,
			//searchAlign: 'right',
			//pageSize: 10,
			//clickToSelect: false,
			//pageList: [8,10,25,50,100],
			//stickyHeader: true,

			formatShowingRows: function(pageFrom, pageTo, totalRows){
					//do nothing here, we don't want to show the text "showing x of y from..."
			},
			formatRecordsPerPage: function(pageNumber){
					return pageNumber + " rows visible";
			},
			icons: {
					refresh: 'fa fa-refresh',
					toggle: 'fa fa-th-list',
					columns: 'fa fa-columns',
					detailOpen: 'fa fa-plus-circle',
					detailClose: 'ti-close'
			}*/
	});
	$("#searchclear").click(function () {
		$table.bootstrapTable('resetSearch');
	});
}

/*function detectBackOrForward(onBack, onForward) {
	var hashHistory = [window.location.hash];
	var historyLength = window.history.length;

	return function(ev) {
			var hash = window.location.hash,
					length = window.history.length;
					
			if (hashHistory.length && historyLength == length) {
					if (hashHistory[hashHistory.length - 2] == hash) {
							hashHistory = hashHistory.slice(0, -1);
							console.log(hashHistory);
							onBack(hash);
							if(hash) ev.stopImmediatePropagation();
					} else {
							hashHistory.push(hash);
							console.log(hashHistory);
							onForward(hash);
							if(hash) ev.stopImmediatePropagation();
					}
			} else {
					hashHistory.push(hash);
					historyLength = length;
			}
	}
};

window.addEventListener("hashchange", detectBackOrForward(
	function(e) {
		//back
		console.log('back');
		LoadAjaxContent(e);
	},
	function(e) {
		//forward
		console.log('forward');
		LoadAjaxContent(e);
	}
));*/

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//
//      MAIN DOCUMENT READY SCRIPT
//
//      In this script main logic of theme
//
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
$(document).ready(function () {
	$('.preloader').show();
	//let us check authentication
	if(!checkAuth()) {
		//if not logged in - redirect to login page
		location.href='app/login.html';
	} else {
		//get page to load based on hash value
		var ajax_url = location.hash.replace(/^#/, '');
		//if there is no hash then load the dashboard
		if (ajax_url.length < 1) {
			ajax_url = 'app/dashboard.html';
		}
		//load partial views
		LoadPartials();
		getTitle(ajax_url);
		//load dashbaord
		LoadAjaxContent(ajax_url);
		//get all menu links
		var item = $('.main-menu li a[href$="' + ajax_url + '"]');
		//add active class to url
		item.addClass('active-parent active');
		//dropdown functions
		$('.dropdown:has(li:has(a.active)) > a').addClass('active-parent active');
		$('.dropdown:has(li:has(a.active)) > ul').css("display", "block");
		//main menu functions
		$('.main-menu').on('click', 'a', function (e) {
			var parents = $(this).parents('li');
			var li = $(this).closest('li.dropdown');
			var another_items = $('.main-menu li').not(parents);
			another_items.find('a').removeClass('active');
			another_items.find('a').removeClass('active-parent');
			if ($(this).hasClass('dropdown-toggle') || $(this).closest('li').find('ul').length == 0) {
				$(this).addClass('active-parent');
				var current = $(this).next();
				if (current.is(':visible')) {
					li.find("ul.dropdown-menu").slideUp('fast');
					li.find("ul.dropdown-menu a").removeClass('active')
				}
				else {
					another_items.find("ul.dropdown-menu").slideUp('fast');
					current.slideDown('fast');
				}
			}
			else {
				if (li.find('a.dropdown-toggle').hasClass('active-parent')) {
					var pre = $(this).closest('ul.dropdown-menu');
					pre.find("li.dropdown").not($(this).closest('li')).find('ul.dropdown-menu').slideUp('fast');
				}
			}
			if ($(this).hasClass('active') == false) {
				$(this).parents("ul.dropdown-menu").find('a').removeClass('active');
				$(this).addClass('active')
			}
			if ($(this).hasClass('ajax-link')) {
				e.preventDefault();
				if ($(this).hasClass('add-full')) {
					$('#content').addClass('full-content');
				}
				else {
					$('#content').removeClass('full-content');
				}
				var url = $(this).attr('href');
				$('#pagetitle').text($(this).attr('data-title'));
				$('.preloader').show();
				window.location.hash = url;
				LoadAjaxContent(url);
			}
			if ($(this).attr('href') == '#') {
				e.preventDefault();
			}
		});
		//get effective height of main div
		var height = window.innerHeight - 49;
		//setup all common click functions for window cards in the main area based on the class of the link
		$('#main').css('min-height', height)
			.on('click', '.expand-link', function (e) {
				var body = $('body');
				e.preventDefault();
				var box = $(this).closest('div.box');
				var button = $(this).find('i');
				button.toggleClass('fa-expand').toggleClass('fa-compress');
				box.toggleClass('expanded');
				body.toggleClass('body-expanded');
				var timeout = 0;
				if (body.hasClass('body-expanded')) {
					timeout = 100;
				}
				setTimeout(function () {
					box.toggleClass('expanded-padding');
				}, timeout);
				setTimeout(function () {
					box.resize();
					box.find('[id^=map-]').resize();
				}, timeout + 50);
			})
			.on('click', '.collapse-link', function (e) {
				e.preventDefault();
				var box = $(this).closest('div.box');
				var button = $(this).find('i');
				var content = box.find('div.box-content');
				content.slideToggle('fast');
				button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
				setTimeout(function () {
					box.resize();
					box.find('[id^=map-]').resize();
				}, 50);
			})
			.on('click', '.close-link', function (e) {
				e.preventDefault();
				var content = $(this).closest('div.box');
				content.remove();
		});
		//setup all common click function in the content area
		$('#ajax-content').on('click', 'a', function (e) {
			if ($(this).hasClass('ajax-link')) {
				e.preventDefault();
				if ($(this).hasClass('add-full')) {
					$('#content').addClass('full-content');
				}
				else {
					$('#content').removeClass('full-content');
				}
				var url = $(this).attr('href');
				$('#pagetitle').text($(this).attr('data-title'));
				$('.preloader').show();
				window.location.hash = url;
				LoadAjaxContent(url);
			}
		});
		//activates the lockscreen page
		$('#locked-screen').on('click', function (e) {
			e.preventDefault();
			$('body').addClass('body-screensaver');
			$('#screensaver').addClass("show");
			ScreenSaver();
		});
		//closes a modal window
		$('body').on('click', 'a.close-link', function(e){
			e.preventDefault();
			CloseModalBox();
		});
		//top panel link functions
		$('#topbar').on('click','a', function(e){
			if ($(this).hasClass('ajax-link')) {
				e.preventDefault();
				if ($(this).hasClass('add-full')) {
					$('#content').addClass('full-content');
				}
				else {
					$('#content').removeClass('full-content');
				}
				var url = $(this).attr('href');
				$('#pagetitle').text($(this).attr('data-title'));
				$('.preloader').show();
				window.location.hash = url;
				LoadAjaxContent(url);
			}
		});
		
		//screen unlock function
		$('#screen_unlock').on('mouseover', function(){
			var u = jQuery.parseJSON( localStorage.getItem('userData') );
			var header = 'Enter current username and password';
			var form = $('<div class="form-group"><h2>'+u.fname+' '+u.lname+'</h2></div>'+
						'<div class="form-group"><input type="hidden" name="username" value="username" /><label class="control-label">Password</label><input type="password" class="form-control pass" name="password" value="" /></div>');
			var button = $('<div class="text-center"><a href="#" class="btn btn-primary">Unlock</a></div>');
			OpenModalBox(header, form, button);
		});
		//shows the about panel
		$('.about').on('click', function(){
			$('#about').toggleClass('about-h');
		})
		//hides the about panel on mouse out
		$('#about').on('mouseleave', function(){
			$('#about').removeClass('about-h');
		})

		//let us load user Data
    var user = jQuery.parseJSON( localStorage.getItem('userData') );
    //console.log( user, $.session.get('userPW') );
    Tempo.prepare("usermenu").render(user);
	}
});


