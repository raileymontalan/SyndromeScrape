function openEdit() {
    //Show editing form
    $('.content-form').removeClass('hidden');
    $('.content-view').addClass('hidden');
}
function closeEdit() {
    //Hide editing form
    $('.content-form').addClass('hidden');
    $('.content-view').removeClass('hidden');
}
function openShare() {
    $('#shareModal').modal('show');
}

function filterScenario() {    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('myScenarioFilter');
    filter = input.value.toUpperCase();
    ul = document.getElementById("stemScenarios");
    li = ul.getElementsByClassName('panel');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h4")[0];
        p = li[i].getElementsByClassName("details")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1 ||
            p.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
function filterModNames() {    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('modName');
    filter = input.value.toUpperCase();
    ul = document.getElementById("modNames");
    li = ul.getElementsByTagName('option');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
function gotoDecorators() {    // Declare variables
    var iinput, ffilter, uul, lli, a, i;
    iinput = document.getElementById('myDecoFilter');
    ffilter = iinput.value;
    uul = document.getElementById("scenarioDecorators");
    lli = uul.getElementsByClassName('scendeco');
    $('.scendeco .input-group').removeClass('shadowed');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < lli.length; i++) {
        a = lli[i].id;
        if (a == ffilter) {
            $('#' + a).get(0).scrollIntoView();
            $('#' + a +" .input-group").addClass('shadowed');
        }
    }
}