$(document).ready(function () {
    //Variables
    var currentUser = {
        user: null,
        elementOne: 0,
        elementTwo: 0,
        elementThree: 0,
        elementFour: 0,
        elementFive: 0,
        elementSix: 0
    };

    var currentPiece = {
        title: "None Selected",
        difficultyNotes: [],
        instrumentationNotes: []
    };

    var pieceList;
    var activePieceList = [];
    var listOfUsers;
    var numberOfPieces;
    var piecesLoaded = false;
    var searchFor;
    var searchTitle;
    var searchComposer;
    var searchArranger;
    var cookiesExist;


    //Startup
    Tabletop.init({ key: '1Wo1RArWUmqVJ9KBjiT2W7B4Tx3KeUsy1sPYPjulcr5I',
        callback: function (data, tabletop) {
            listOfUsers = data;
            $('#loginButton').removeAttr('disabled');
        },
        simpleSheet: true
    });

    if (getCookie("band") !== "" && getCookie("email") !== "") {
        cookiesExist = true;
        document.getElementById('userEmail').value = getCookie('email');
        document.getElementById('userBand').value = getCookie('band');
    };

    //Functions
    function addGraphCanvas() {
        $('#dataPane').empty();
        $('#dataPane').append(
                '<div id="canvasContainer">' +
                    '<canvas id="myBand" width="300" height="300"></canvas>' +
                '</div>' +
                    '<table id="instrumentationPane">' +
                        '<tr>' +
                            '<td id="oneFlute" class="instrument">F</td>' +
                            '<td id="twoClarinets" class="instrument">C</td>' +
                            '<td id="threeSaxophones" class="instrument">X</td>' +
                            '<td id="oneHorn" class="instrument">H</td>' +
                            '<td id="twoTrumpets" class="instrument">T</td>' +
                            '<td id="oneTrombone" class="instrument">R</td>' +
                            '<td id="baritone" class="instrument">B</td>' +
                            '<td id="tuba" class="instrument">U</td>' +
                            '<td id="sixPercussion" class="instrument">P</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td id="moreFlutes" class="instrument">F+</td>' +
                            '<td id="moreClarinets" class="instrument">C+</td>' +
                            '<td id="moreSaxophones" class="instrument">X+</td>' +
                            '<td id="moreHorns" class="instrument">H+</td>' +
                            '<td id="moreTrumpets" class="instrument">T+</td>' +
                            '<td id="moreTrombones" class="instrument">R+</td>' +
                            '<td id="oboe" class="instrument">O</td>' +
                            '<td id="bassoon" class="instrument">OO</td>' +
                            '<td id="numberOfPercussion" class="instrument"></td>' +
                       '</tr>' +
                    '</table>'
                );
    };

    function openTutorial() {
        $('body').append('<div id="pageCover"></div>');
        $('body').append('<div id="overlayPane"></div>');
        $('#overlayPane').html('<object type="text/html" data="training.html" width="100%" height="100%"></object>');
    };

    function openChangeLog() {
        $('body').append('<div id="pageCover"></div>');
        $('body').append('<div id="overlayPane"></div>');
        $('#overlayPane').html('<object type="text/html" data="changeLog.html" width="100%" height="100%"></object>');
    };

    function closeOverlay() {
        $('#pageCover').remove();
        $('#overlayPane').remove();
        $('#closeTutorial').remove();
    };

    function clearCommentsAndInstrumentation() {
        $('#notesPane').empty();
        $('#numberOfPercussion').empty();
        $('#databasePane').empty();
        $('.trueBasic').removeClass('trueBasic');
        $('.trueAdvanced').removeClass('trueAdvanced');
    };

    //Link Buttons
    function openWindow(url) {
        var win = window.open(url, '_blank');
        if (win) {
            win.focus();
        } else {
            alert('Please allow popups for this website');
        };
    };

    $(document).on('click', '#reportDuplicate', function () {
        openWindow('mailto:optimal.efficient@gmail.com?subject=Possible%20Duplicate%20Piece&body=I have discovered a possible duplicate piece in the optimal.efficient database. The two entries are...');
    });

    //Mobile
    function detectmob() {
        if (navigator.userAgent.match(/Android/i)
                         || navigator.userAgent.match(/webOS/i)
                         || navigator.userAgent.match(/iPhone/i)
                         || navigator.userAgent.match(/iPad/i)
                         || navigator.userAgent.match(/iPod/i)
                         || navigator.userAgent.match(/BlackBerry/i)
                         || navigator.userAgent.match(/Windows Phone/i)
                         ) {
            return true;
        }
        else {
            return false;
        };
    };

    if (detectmob()) {
        alert('This site is not optimized for mobile. For best results, use your desktop or laptop.')
    };

    //Cookies
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    //Math
    function findMean(array) {
        var mean = 0;

        for (var p = 0; p < array.length; p++) {
            mean += array[p];
        };

        mean = mean / array.length;

        return mean;
    };

    function findMode(array, ifNoMode) {
        var largestValueCount = 0;
        var largestValue;
        var noLargestValue = false;

        for (var z = 0; z < array.length; z++) {
            var currentValue = array[z];
            var currentValueCount = 1;

            for (var y = 0; y < array.length; y++) {
                if (z !== y && array[z] == array[y]) {
                    currentValueCount++;
                };
            };

            if (currentValueCount > largestValueCount) {
                largestValueCount = currentValueCount;
                largestValue = array[z];
                noLargestValue = false;
            };
            if (currentValueCount == largestValueCount && currentValue !== largestValue) {
                noLargestValue = true;
            };
        };

        if (noLargestValue) {
            return ifNoMode;
        }
        else {
            return largestValue;
        };
    };

    function changeInstrumentation(piece) {
        $('.trueBasic').removeClass('trueBasic');
        $('.trueAdvanced').removeClass('trueAdvanced');

        if (piece['Flutes'] !== '0') {
            $('#oneFlute').addClass('trueBasic');
        };

        if (piece['Clarinets'] !== '0') {
            $('#twoClarinets').addClass('trueBasic');
        };

        if (piece['Saxophones'] !== 'Less than ATB') {
            $('#threeSaxophones').addClass('trueBasic');
        };

        if (piece['Horns'] !== '0') {
            $('#oneHorn').addClass('trueBasic');
        };

        if (piece['Trumpets'] !== '0') {
            $('#twoTrumpets').addClass('trueBasic');
        };

        if (piece['Trombones'] !== '0') {
            $('#oneTrombone').addClass('trueBasic');
        };

        if (piece['Percussion'] !== '0') {
            $('#sixPercussion').addClass('trueBasic');
        };

        if (piece['Baritone'] == 'Yes') {
            $('#baritone').addClass('trueBasic');
        };

        if (piece['Tuba'] == 'Yes') {
            $('#tuba').addClass('trueBasic');
        };

        if (piece['Flutes'] == '2+') {
            $('#moreFlutes').addClass('trueAdvanced');
        };

        if (piece['Clarinets'] == '3+') {
            $('#moreClarinets').addClass('trueAdvanced');
        };

        if (piece['Saxophones'] == 'AATB') {
            $('#moreSaxophones').addClass('trueAdvanced');
        };

        if (piece['Oboe'] == 'Yes') {
            $('#oboe').addClass('trueAdvanced');
        };

        if (piece['Bassoon'] == 'Yes') {
            $('#bassoon').addClass('trueAdvanced');
        };

        if (piece['Trombones'] == '2+') {
            $('#moreTrombones').addClass('trueAdvanced');
        };

        if (piece['Trumpets'] == '3+') {
            $('#moreTrumpets').addClass('trueAdvanced');
        };

        if (piece['Horns'] == '2+') {
            $('#moreHorns').addClass('trueAdvanced');
        };

        if ((piece['Percussion']) > 5) {
            $('#sixPercussion').removeClass('trueBasic');
            $('#sixPercussion').addClass('trueAdvanced');
        };

        $('#numberOfPercussion').html(piece['Percussion']);
    };

    function addNotes(piece) {
        $('#notesPane').empty();

        if (piece['Number of Ratings'] == 1) {
            $('#notesPane').append('<div class="ratingsCount">' + piece['Number of Ratings'] + ' Rating' + '</div>');
        }
        else {
            $('#notesPane').append('<div class="ratingsCount">' + piece['Number of Ratings'] + ' Ratings' + '</div>');
        };


        if (piece['Difficulty Notes'].length == 0 && piece['Instrumentation Notes'].length == 0) {
            $('#notesPane').append('<div class="noNotes">No Notes Yet</div>');
        };

        for (var g = 0; g < piece['Difficulty Notes'].length; g++) {
            $('#notesPane').append('<div class="difficultyNote">' + piece['Difficulty Notes'][g] + '</div>');
        };

        for (var g = 0; g < piece['Instrumentation Notes'].length; g++) {
            $('#notesPane').append('<div class="instrumentationNote">' + piece['Instrumentation Notes'][g] + '</div>');
        };
    };

    function loadPieces(callback) {
        Tabletop.init({ key: "1vptbIS_PexH6J8N8KRm1EfJ6nj5rAKmImzLk3_j2eew",
            callback: function (data, tabletop) {
                pieceList = data;
                numberOfPieces = pieceList.length;
                var g = 0;
                activePieceList = [];

                for (var i = 0; i < numberOfPieces; i++) {
                    var testTwo = checkForDuplicates(i);

                    if (testTwo !== false) {
                        activePieceList.push(testTwo);
                        g++;
                    };
                };

                numberOfPieces = activePieceList.length;
                activePieceList.sort(function (a, b) { return (a['Title'] > b['Title']) ? 1 : ((b['Title'] > a['Title']) ? -1 : 0); });
                pieceListLoading = false;

                piecesLoaded = true;
                if (callback) { callback(); };
            },
            simpleSheet: true
        });
    };

    //Check for Duplicates
    function checkForDuplicates(t) {
        var alreadyDone = false;
        var pieceInQuestion = false;

        for (var a = 0; a < t; a++) {
            if (pieceList[t]['Title'].toUpperCase() == pieceList[a]['Title'].toUpperCase() && pieceList[t]['Composer'].toUpperCase() == pieceList[a]['Composer'].toUpperCase() && pieceList[t]['Arranger'].toUpperCase() == pieceList[a]['Arranger'].toUpperCase() && pieceList[t]['Publisher'].toUpperCase() == pieceList[a]['Publisher'].toUpperCase()) {
                alreadyDone = true;
            };
        };

        if (!alreadyDone) {
            pieceInQuestion = {}

            pieceInQuestion['Title'] = pieceList[t]['Title'];
            pieceInQuestion['Composer'] = pieceList[t]['Composer'];
            pieceInQuestion['Publisher'] = pieceList[t]['Publisher'];
            pieceInQuestion['Arranger'] = pieceList[t]['Arranger'];
            pieceInQuestion['Rapidity'] = [];
            pieceInQuestion['Rhythm'] = [];
            pieceInQuestion['Dynamics'] = [];
            pieceInQuestion['Texture'] = [];
            pieceInQuestion['Tonality'] = [];
            pieceInQuestion['Range'] = [];
            pieceInQuestion['Flutes'] = [];
            pieceInQuestion['Clarinets'] = [];
            pieceInQuestion['Saxophones'] = [];
            pieceInQuestion['Oboe'] = [];
            pieceInQuestion['Bassoon'] = [];
            pieceInQuestion['Trumpets'] = [];
            pieceInQuestion['Horns'] = [];
            pieceInQuestion['Trombones'] = [];
            pieceInQuestion['Baritone'] = [];
            pieceInQuestion['Tuba'] = [];
            pieceInQuestion['Percussion'] = [];
            pieceInQuestion['Difficulty Notes'] = [];
            pieceInQuestion['Instrumentation Notes'] = [];
            pieceInQuestion['Number of Ratings'] = 0;

            for (var a = t; a < numberOfPieces; a++) {
                if (pieceList[t]['Title'] == pieceList[a]['Title'] && pieceList[t]['Composer'] == pieceList[a]['Composer'] && pieceList[t]['Arranger'] == pieceList[a]['Arranger'] && pieceList[t]['Publisher'] == pieceList[a]['Publisher']) {
                    pieceInQuestion['Rapidity'].push(pieceList[a][' [Rapidity]'] / 1);
                    pieceInQuestion['Rhythm'].push(pieceList[a][' [Rhythm]'] / 1);
                    pieceInQuestion['Dynamics'].push(pieceList[a][' [Dynamics]'] / 1);
                    pieceInQuestion['Texture'].push(pieceList[a][' [Texture]'] / 1);
                    pieceInQuestion['Tonality'].push(pieceList[a][' [Tonality]'] / 1);
                    pieceInQuestion['Range'].push(pieceList[a][' [Range]'] / 1);
                    pieceInQuestion['Flutes'].push(pieceList[a]['Flutes']);
                    pieceInQuestion['Clarinets'].push(pieceList[a]['Clarinets']);
                    pieceInQuestion['Saxophones'].push(pieceList[a]['Saxophones']);
                    pieceInQuestion['Oboe'].push(pieceList[a]['Oboe']);
                    pieceInQuestion['Bassoon'].push(pieceList[a]['Bassoon']);
                    pieceInQuestion['Trumpets'].push(pieceList[a]['Trumpets']);
                    pieceInQuestion['Horns'].push(pieceList[a]['Horns']);
                    pieceInQuestion['Trombones'].push(pieceList[a]['Trombones']);
                    pieceInQuestion['Baritone'].push(pieceList[a]['Baritone']);
                    pieceInQuestion['Tuba'].push(pieceList[a]['Tuba']);
                    pieceInQuestion['Percussion'].push(pieceList[a]['Percussion'] / 1);
                    pieceInQuestion['Number of Ratings']++;

                    if (pieceList[a]['Difficulty Notes'] !== "") {
                        var diff = pieceList[a]['Difficulty Notes'];
                        var diff2 = diff.split('.');

                        for (var h = 0; h < (diff2.length - 1); h++) {
                            var thisn = diff2[h] + '.';
                            pieceInQuestion['Difficulty Notes'].push(thisn);
                        };
                    };

                    if (pieceList[a]['Instrumentation Notes'] !== "") {
                        var diff = pieceList[a]['Instrumentation Notes'];
                        var diff2 = diff.split('.');

                        for (var h = 0; h < (diff2.length - 1); h++) {
                            var thisn = diff2[h] + '.';
                            pieceInQuestion['Instrumentation Notes'].push(thisn);
                        };
                    };
                };
            };

            pieceInQuestion['Rapidity'] = Math.round(findMean(pieceInQuestion['Rapidity']));
            pieceInQuestion['Rhythm'] = Math.round(findMean(pieceInQuestion['Rhythm']));
            pieceInQuestion['Dynamics'] = Math.round(findMean(pieceInQuestion['Dynamics']));
            pieceInQuestion['Texture'] = Math.round(findMean(pieceInQuestion['Texture']));
            pieceInQuestion['Tonality'] = Math.round(findMean(pieceInQuestion['Tonality']));
            pieceInQuestion['Range'] = Math.round(findMean(pieceInQuestion['Range']));
            pieceInQuestion['Flutes'] = findMode(pieceInQuestion['Flutes'], '1');
            pieceInQuestion['Clarinets'] = findMode(pieceInQuestion['Clarinets'], '1-2');
            pieceInQuestion['Saxophones'] = findMode(pieceInQuestion['Saxophones'], 'ATB');
            pieceInQuestion['Oboe'] = findMode(pieceInQuestion['Oboe'], 'No');
            pieceInQuestion['Bassoon'] = findMode(pieceInQuestion['Bassoon'], 'No');
            pieceInQuestion['Trumpets'] = findMode(pieceInQuestion['Trumpets'], '1-2');
            pieceInQuestion['Horns'] = findMode(pieceInQuestion['Horns'], '1');
            pieceInQuestion['Trombones'] = findMode(pieceInQuestion['Trombones'], '1');
            pieceInQuestion['Baritone'] = findMode(pieceInQuestion['Baritone'], 'Yes');
            pieceInQuestion['Tuba'] = findMode(pieceInQuestion['Tuba'], "Yes");
            pieceInQuestion['Percussion'] = Math.ceil(findMean(pieceInQuestion['Percussion']));
        };

        return pieceInQuestion;
    };

    //Create Graph
    function createGraph() {
        var myChart = new Chart("myBand", {
            type: 'radar',
            data: {
                labels: ["Rapidity", "Rhythm", "Dynamics", "Texture", "Tonality", "Range"],
                datasets: [
                                                                                                         {
                                                                                                             label: "Your Band",
                                                                                                             fillColor: "rgba(220,220,440,0.4)",
                                                                                                             strokeColor: "rgba(220,220,440,1)",
                                                                                                             pointColor: "rgba(220,220,440,1)",
                                                                                                             pointStrokeColor: "#fff",
                                                                                                             pointHighlightFill: "#fff",
                                                                                                             pointHighlightStroke: "rgba(220,220,220,1)",
                                                                                                             backgroundColor: "rgba(0, 0, 255, 0.2)",
                                                                                                             borderColor: "rgba(0, 0, 255, 0.2)",
                                                                                                             data: [
                                                                                                                     currentUser.elementOne,
                                                                                                                     currentUser.elementTwo,
                                                                                                                     currentUser.elementThree,
                                                                                                                     currentUser.elementFour,
                                                                                                                     currentUser.elementFive,
                                                                                                                     currentUser.elementSix
                                                                                                                   ]
                                                                                                         },
                                                                                                         {
                                                                                                             label: "Selected Piece",
                                                                                                             fillColor: "rgba(440,220,320,0.4)",
                                                                                                             strokeColor: "rgba(440,220,220,1)",
                                                                                                             pointColor: "rgba(440,220,220,1)",
                                                                                                             pointStrokeColor: "#fff",
                                                                                                             pointHighlightFill: "#fff",
                                                                                                             pointHighlightStroke: "rgba(440,220,220,1)",
                                                                                                             backgroundColor: "rgba(255, 0, 0, 0.2)",
                                                                                                             borderColor: "red",
                                                                                                             data: [
                                                                                                                     currentPiece.elementOne,
                                                                                                                     currentPiece.elementTwo,
                                                                                                                     currentPiece.elementThree,
                                                                                                                     currentPiece.elementFour,
                                                                                                                     currentPiece.elementFive,
                                                                                                                     currentPiece.elementSix
                                                                                                                   ]
                                                                                                         }
                                                                                                     ]
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 6,
                        stepSize: 1
                    }
                }
            }
        });
    };

    function addPiece(number, challengeLevel) {
        var loadInfo = activePieceList[number];
        $('#databasePane').append('<div id="' + number + '" class="piece"></div>');
        $('#' + number).append('<h2>' + loadInfo['Title'] + '</h1>');
        $('#' + number).append('<h3>' + loadInfo['Composer'] + '</h3>');
        $('#' + number).append('<h3>Arranged by ' + loadInfo['Arranger'] + '</h3>');
        $('#' + number).append('<h4>' + loadInfo['Publisher'] + '</h4>');

        if (challengeLevel) {
            $('#' + number).append('<h4>Challenge Level: ' + challengeLevel + '</h4>');
        }
    };

    function listAllPieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();
            for (var i = 0; i < numberOfPieces; i++) { addPiece(i); };
        };
    };

    function searchForPiece() {
        if (piecesLoaded) {
            //Generate Search Screen
            $('#databasePane').empty();
            $('#databasePane').append(
                                        'Search Title<input id="searchTitle" type="checkbox" name="searchIn" value="Title">' +
                                        'Search Composer<input id="searchComposer" type="checkbox" name="searchIn" value="Composer">' +
                                        'Search Arranger<input id="searchArranger" type="checkbox" name="searchIn" value="Arranger"><br />'
                                    );
            $('#databasePane').append('<input name="searchTerm" type="text" placeholder="search for a piece" id="searchTerm"><br />');
            $('#databasePane').append('<input type="button" name="executeSearch" value="Search" id="searchButton">');

            //When "Search" is Clicked
            $(document).on('click', '#searchButton', function () {
                searchTitle = document.getElementById("searchTitle").checked;
                searchComposer = document.getElementById("searchComposer").checked;
                searchArranger = document.getElementById("searchArranger").checked;
                searchFor = document.getElementById('searchTerm').value.toString().toUpperCase();

                $('#databasePane').empty();

                for (var i = 0; i < numberOfPieces; i++) {
                    if ((searchTitle && activePieceList[i]['Title'].toUpperCase().search(searchFor) >= 0) || (searchComposer && activePieceList[i]['Composer'].toUpperCase().search(searchFor) >= 0) || (searchArranger && activePieceList[i]['Arranger'].toUpperCase().search(searchFor) >= 0)) {
                        addPiece(i);
                    };
                };
            });
        };
    };

    function listOptimalPieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();

            for (var i = 0; i < numberOfPieces; i++) {
                if (currentUser.elementOne == activePieceList[i]['Rapidity'] && currentUser.elementTwo == activePieceList[i]['Rhythm'] && currentUser.elementThree == activePieceList[i]['Dynamics'] && currentUser.elementFour == activePieceList[i]['Texture'] && currentUser.elementFive == activePieceList[i]['Tonality'] && currentUser.elementSix == activePieceList[i]['Range']) {
                    addPiece(i);
                };
            };
        };
    };

    function listPlayablePieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();

            for (var i = 0; i < numberOfPieces; i++) {
                if (currentUser.elementOne >= activePieceList[i]['Rapidity'] && currentUser.elementTwo >= activePieceList[i]['Rhythm'] && currentUser.elementThree >= activePieceList[i]['Dynamics'] && currentUser.elementFour >= activePieceList[i]['Texture'] && currentUser.elementFive >= activePieceList[i]['Tonality'] && currentUser.elementSix >= activePieceList[i]['Range']) {
                    addPiece(i);
                };
            };
        };
    };

    function listChallengePieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();
            var challengeLevel;

            //Iterate through list of pieces
            for (var i = 0; i < numberOfPieces; i++) {
                if (!(currentUser.elementOne >= activePieceList[i]['Rapidity'] && currentUser.elementTwo >= activePieceList[i]['Rhythm'] && currentUser.elementThree >= activePieceList[i]['Dynamics'] && currentUser.elementFour >= activePieceList[i]['Texture'] && currentUser.elementFive >= activePieceList[i]['Tonality'] && currentUser.elementSix >= activePieceList[i]['Range']) && (currentUser.elementOne + 1) >= activePieceList[i]['Rapidity'] && (currentUser.elementTwo + 1) >= activePieceList[i]['Rhythm'] && (currentUser.elementThree + 1) >= activePieceList[i]['Dynamics'] && (currentUser.elementFour + 1) >= activePieceList[i]['Texture'] && (currentUser.elementFive + 1) >= activePieceList[i]['Tonality'] && (currentUser.elementSix + 1) >= activePieceList[i]['Range']) {

                    //Add 1 to challengeLevel for each challenge element
                    challengeLevel = 0;

                    if (currentUser.elementOne < activePieceList[i]['Rapidity']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementTwo < activePieceList[i]['Rhythm']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementThree < activePieceList[i]['Dynamics']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementFour < activePieceList[i]['Texture']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementFive < activePieceList[i]['Tonality']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementSix < activePieceList[i]['Range']) {
                        challengeLevel++;
                    };

                    //Append Piece
                    addPiece(i, challengeLevel);
                };
            };
        };
    };

    function selectPiece(piece) {
        $('.selectedPiece').removeClass('selectedPiece');
        $(piece).addClass('selectedPiece');

        var idNo = $(piece).attr("id") / 1;

        currentPiece = {
            title: "None Selected"
        };

        currentPiece.title = activePieceList[idNo]['Title'];
        currentPiece.elementOne = activePieceList[idNo]['Rapidity'] / 1;
        currentPiece.elementTwo = activePieceList[idNo]['Rhythm'] / 1;
        currentPiece.elementThree = activePieceList[idNo]['Dynamics'] / 1;
        currentPiece.elementFour = activePieceList[idNo]['Texture'] / 1;
        currentPiece.elementFive = activePieceList[idNo]['Tonality'] / 1;
        currentPiece.elementSix = activePieceList[idNo]['Range'] / 1;

        changeInstrumentation(activePieceList[idNo]);
        addNotes(activePieceList[idNo]);
        createGraph();
    };

    //Login Button
    function login() {
        //Check login and load data
        var emailAttempt = document.getElementById('userEmail').value.toString();
        var bandAttempt = document.getElementById('userBand').value.toString();

        //Load Google Sheet "User List"
        var userList = '1Wo1RArWUmqVJ9KBjiT2W7B4Tx3KeUsy1sPYPjulcr5I';

        //Verify User, Load User Information, and Draw Graph                
        var numberOfItems = listOfUsers.length;
        var userSuccess = false;

        for (var i = 0; i < numberOfItems; i++) {

            //Check Username
            if (listOfUsers[i]['Email Address'] === emailAttempt) {

                //Flag Username as Correct
                userSuccess = true;

                //Confirm Password
                if (listOfUsers[i]['Band Name'] === bandAttempt) {

                    //Set Current User Info
                    currentUser.user = (listOfUsers[i]['Band Name']);
                    currentUser.elementOne = (listOfUsers[i]['Band Skill [Rapidity]'] / 1);
                    currentUser.elementTwo = (listOfUsers[i]['Band Skill [Rhythm]'] / 1);
                    currentUser.elementThree = (listOfUsers[i]['Band Skill [Dynamics]'] / 1);
                    currentUser.elementFour = (listOfUsers[i]['Band Skill [Texture]'] / 1);
                    currentUser.elementFive = (listOfUsers[i]['Band Skill [Tonality]'] / 1);
                    currentUser.elementSix = (listOfUsers[i]['Band Skill [Range]'] / 1);

                    //Cookies
                    if (!cookiesExist || !(emailAttempt == getCookie('email') && bandAttempt == getCookie('band'))) {
                        var allow = confirm('Remember information using cookies?');

                        if (allow) {
                            setCookie('band', bandAttempt, 14);
                            setCookie('email', emailAttempt, 14);
                        };
                    };

                    //Prepare Piece List and UI                    
                    $('#dataPane').empty();
                    $('#dataPane').append('<div class="loader"></div>');
                    $('#databasePane').empty();

                    loadPieces(function () {
                        addGraphCanvas();
                        createGraph();
                        $('#notesPane').empty();
                        listAllPieces();
                    });
                }
                else {
                    alert("Band not Found");
                }
            }
            else {
                if (i == [numberOfItems - 1] && !userSuccess) {
                    alert("Email not Found");
                };
            };
        };
    };


    //Button Assignments
    $(document).on('click', '#loginButton', function () { login(); });
    $(document).on('click', '#newAccountButton', function () {
        openWindow('https://docs.google.com/forms/d/e/1FAIpQLSf7CKt6BjXfYagKP9XWO74g6PdyYAiAoWhEcvCfUinXGbpcDA/viewform');
    });

    $(document).on('click', '#search', function () { searchForPiece(); });
    $(document).on('click', '#listOptimal', function () { listOptimalPieces(); });
    $(document).on('click', '#listAllPlayable', function () { listPlayablePieces(); });
    $(document).on('click', '#listChallenge', function () { listChallengePieces(); });
    $(document).on('click', '#listAll', function () { listAllPieces(); });
    $(document).on('click', '#submitAnalysis', function () {
        openWindow('https://docs.google.com/forms/d/e/1FAIpQLSe5q7jbSlC4H0u8NPEeAaniK09N4vqj9ZoStJSBG3R4SQsgUQ/viewform')
    });

    $(document).on('click', '#changeLog', function () { openChangeLog(); });
    $(document).on('click', '#trainingLink', function () { openTutorial(); });

    $(document).on('click', '#pageCover', function () { closeOverlay(); });

    $(document).on('click', '#emailLink', function () { openWindow('mailto:optimal.efficient@gmail.com') });

    //Clickable pieces that display the graph
    $(document).on('click', '.piece', function () { selectPiece(this); });

    //Navigation in Piece List
    $(document).keydown(function (e) {
        if ($(".selectedPiece")[0]) {
            if (e.keyCode == 37) { // left
                var newSelected = $(".selectedPiece").prev();

                if (!$(".selectedPiece").is(':first-child')) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);
                }
            }
            else if (e.keyCode == 39) { // right
                var newSelected = $(".selectedPiece").next();

                if (!$(".selectedPiece").is(':last-child')) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);                    
                }
            }
            else if (e.keyCode == 38) { // down
                var newSelected = $(".selectedPiece").prev().prev().prev().prev().prev().prev();
                if (newSelected.length) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);
                }
            }
            else if (e.keyCode == 40) { // up
                var newSelected = $(".selectedPiece").next().next().next().next().next().next();
                if (newSelected.length) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);
                }
            };
        };
    });
});
 
 