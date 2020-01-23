var mineAmount;
var totalMines;
var minesAround=0;
var openedTiles=0;
var fieldXY;
var field=[];
var score = 0;
var curResults;
var match_id = -1;
var usrname = null;

function drawEmptyField(size) {
    size = fieldXY;
    for(var j = 0; j < size; j++) {
        field[j] = [];
        for(var k = 0; k < size; k++) {
            field[j][k]=0;
        }
    }
    return field;
}

function setMines() {
    mineAmount = document.getElementById("mineAmount").value;
    totalMines = mineAmount;
    fieldXY = document.querySelector('input[name = "fieldSize"]:checked').value;
    if($.trim( $('#usrname').val() ) == '') {
        alert("Not a valid username!");
        return null;
    }
    else {
        if(mineAmount > 0 && mineAmount <= (Math.pow(fieldXY, 2))) {
            drawEmptyField(fieldXY);
            while(mineAmount>0) {
                x=Math.floor(Math.random() * fieldXY);
                y=Math.floor(Math.random() * fieldXY);
                if (field[x][y]!=1) {
                    field[x][y]=1;
                    mineAmount--;
                }
            }
            for(var kl = 0; kl < fieldXY; kl++) {
                console.log(field[kl]);
            }
            return field;
        }
        else if (mineAmount <= 0) {
            alert("You forgot to add mines.");
            return null;
        }
    }
}

function drawCanvas() {
    openedTiles=0;
    score = 0;
    usrname = document.getElementById("usrname");
    if(document.getElementById("mineAmount").value>0 && 
       document.getElementById("mineAmount").value <= Math.pow(document.querySelector('input[name = "fieldSize"]:checked').value, 2) && 
       ($.trim( $('#usrname').val() ) != '')) {
        var data = document.getElementById("Data");
        var scoreField = document.createElement("Score");
        scoreField.setAttribute("width", "auto");
        scoreField.setAttribute("id", "Score");
        data.appendChild(scoreField);
        document.getElementById("Score").innerHTML = "Your score: " + score;
        
        setMines();
        
        var div = document.getElementById("GameMap");
        div.innerHTML = '';
        for(var ab = 0; ab < fieldXY; ab++) {
            for(var cd =0; cd < fieldXY; cd++) {
                var fieldElement = document.createElement("IMG");
                //gives attributes to the minefield
                fieldElement.setAttribute("width", "30px");
                fieldElement.setAttribute("id", "mine"+ab+"+"+cd);
                fieldElement.setAttribute("height", "30px");
                fieldElement.setAttribute("src", "field.JPG");
                fieldElement.setAttribute("onclick", "makeMove("+ab + ", " + cd +")");
                
                div.appendChild(fieldElement);
            }
            div.appendChild(document.createElement('br'));
        }
    }
    
    else if( $.trim( $('#usrname').val() ) == '') {
        alert("You have not entered a name");
        return null;
    }
    
    else if(document.getElementById("mineAmount").value==0) {
        alert("0 mines... Seriously?");
        return null;
    }
    
    else if(document.getElementById("mineAmount").value<0) {
        alert("How... Wha... What were you thinking?");
        return null;
    }
    
    else {
        alert("Too much mines for such tiny field");
        return null;
    }
}

function makeMove(one, two) {
    var pressedField = document.getElementById("mine"+one+"+"+two);
    openedTiles++;
    console.log(totalMines);
    pressedField.removeAttribute("onclick");
    if((Math.pow(fieldXY,2) - openedTiles) == document.getElementById("mineAmount").value && field[one][two]!=1) {
        document.getElementById("Score").innerHTML = "Your score: " + score;
        pressedField.setAttribute("src", ""+ neighbours(fieldXY,one,two) + "mine.png");
        alert("Yay, you won! You get nothing tho.");
        for(var esim = 0; esim < fieldXY; esim++) {
            for(var teine =0; teine < fieldXY; teine++) {
                document.getElementById("mine"+esim+"+"+teine).removeAttribute("onclick");
            }
        }
		$.get("http://dijkstra.cs.ttu.ee/~runest/cgi-bin/test.py?action=writeData&username=" + 
              $('#usrname').val() + "&mines=" + totalMines + 
              "&fieldSize=" + Math.pow(fieldXY,2) + "&steps=" + 
              openedTiles + "&winLoss=" + "win", function( data ) {
            console.log("Data written successfully!");
        })
        .fail( function (error) {
            console.log("Couldn't write data");
	    console.log(error);
            console.log($('#usrname').val() + " " + totalMines+ " " + Math.pow(fieldXY,2) + " " + openedTiles);
        });

    }
    if(field[one][two]==0) {
        pressedField.setAttribute("src", ""+ neighbours(fieldXY,one,two) + "mine.png");
        score++;
        document.getElementById("Score").innerHTML = "Your score: " + score;
    }
    else if(field[one][two]==1) {
        pressedField.setAttribute("src", "mine.JPG");
        for(var fir = 0; fir < fieldXY; fir++) {
            for(var sec =0; sec < fieldXY; sec++) {
                document.getElementById("mine"+fir+"+"+sec).removeAttribute("onclick");
            }
        }
        alert("Sadly, you lost. You can try again or just forget about this trashy game.");
        if(openedTiles<1) {
            openedTiles=2;
        }
        
        $.get("http://dijkstra.cs.ttu.ee/~runest/cgi-bin/test.py?action=writeData&username=" + 
              $('#usrname').val() + "&mines=" + totalMines + 
              "&fieldSize=" + Math.pow(fieldXY,2) + "&steps=" + 
              openedTiles + "&winLoss=" + "loss", function( data ) {
            console.log("Data written successfully!");
        })
        .fail( function (error) {
            console.log("Couldn't write data");
	    console.log(error);
            console.log($('#usrname').val() + " " + totalMines+ " " + Math.pow(fieldXY,2) + " " + openedTiles);
        });
    }
        
}

function neighbours(size,x,y) {
    minesAround=0;
    for (var i=-1; i<=1; i++) {    
        for (var j=-1; j<=1; j++) {
            if(i==0 && j==0) continue;
            if((x+i)>=0 && (x+i)<size && (y+j)>=0 && (y+j)<size) {
                if(field[x+i][y+j]==1) {
                    minesAround++;
                }
            }
        }
    }
    return minesAround;
}

function browseByName() {
    nameToBrowse = document.getElementById("nameToBrowse").value;
    if (nameToBrowse.length < 1) {
        alert("You forgot to enter a name!");
    }
	else {
    	console.log(nameToBrowse);
    	open("http://dijkstra.cs.ttu.ee/~runest/cgi-bin/test.py?action=BrowseByName&nameToBrowse=" + nameToBrowse);
	}
}

function showLog() {
    open("http://dijkstra.cs.ttu.ee/~runest/cgi-bin/test.py?action=drawAllResultsPage");
}