$(document).ready(function() {

    // Experinces
    $('#exp-mc').append(readTextFile('jobs/mc.htm'));
    $('#exp-sure').append(readTextFile('jobs/sure.global.htm'));
    $('#exp-fleet').append(readTextFile('jobs/fleet.system.htm'));
    $('#exp-itec').append(readTextFile('jobs/itec.htm'));
    $('#exp-reemas').append(readTextFile('jobs/reemas.htm'));
    $('#exp-sky').append(readTextFile('jobs/skyCenter.htm'));



    // Lesson
    $('#les-ai-agent').append(readTextFile('lessons/ai.agent.htm'));
    $('#les-cs50').append(readTextFile('lessons/cs50.htm'));
    $('#les-api').append(readTextFile('lessons/api.htm'));


    // Projects
    $('#pro-win').append(readTextFile('projects/win.htm'));
    $('#pro-web').append(readTextFile('projects/web.htm'));
    $('#pro-some').append(readTextFile('projects/some.htm'));

    //window.scrollTo(0,0);

    //Check if the visitor come from PDF file 
    try {
        const urlParms = new URLSearchParams(window.location.search);
        if (urlParms.get('frompdf') == 'true') {
            alert("Thank you for coming from PDF file to My Digital CV!");
            window.history.pushState("", "", "/");
        }
    } catch {}

})

function readTextFile(file) {
    var allText = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;

            }
        }
    }
    rawFile.send(null);
    return allText;
}