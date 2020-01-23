#!/usr/bin/python
import cgi
import os
import json

print "Content-type: text/html"
print 
    
def readFromFile(filename):
    if not os.path.exists(filename):
        open(filename, 'w').close()

    lines = []
    with open(filename, 'r') as file:
        for line in file:
            lines.append(json.loads(line.strip()))

    return lines         

def writeData(name, size, bombs, winLoss, steps):
    data = {"username": name,
            "mapSize": size,
            "bombs": bombs,
            "winLoss": winLoss,
            "steps": steps}
    with open ('results.txt', 'a') as write_file:
        json.dump(data, write_file)
        write_file.write('\n')
    return data


def drawAllResultsPage():
    print("<!DOCTYPE html>")
    print("<html>")
    print("<head>")
    print('<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=0.5">')
    print('<link rel="stylesheet" href="http://dijkstra.cs.ttu.ee/~runest/prax3/style.css">')
    print('<title>Recent results</title>')
    print("</head>")
    
    print('<body id="background" align="center">')

    with open("results.txt", 'r') as file:
        for line in file:
            parsedLine = json.loads(line)
            print ("<p>" + "Name: " + parsedLine['username']+ ". Result: " + parsedLine["winLoss"] + " with a map size of " + parsedLine['mapSize'] + " tiles and " + parsedLine['bombs'] + " mines." +"</p>")
    print('<a href="http://dijkstra.cs.ttu.ee/~runest/prax3/index.html">Back to main</a>')
    print('</body>')
    print('</html>')

def drawResultsByName(name):
    print("<!DOCTYPE html>")
    print("<html>")
    
    print("<head>")
    print('<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=0.5">')
    print('<link rel="stylesheet" href="http://dijkstra.cs.ttu.ee/~runest/prax3/style.css">')
    print('<title>Personal results</title>')
    print("</head>")

    print('<body id="background" align="center">')

    with open("results.txt", 'r') as file:
        print('<p>Results for ' + name + ":"'</p>')
        for line in file:
            parsedLine = json.loads(line)
            if parsedLine["username"] == name:
                print ("<p>" + "Result: " + parsedLine["winLoss"] + " with a map size of " + parsedLine['mapSize'] + " tiles and " + parsedLine['bombs'] + " mines." +"</p>")
    print('<a href="http://dijkstra.cs.ttu.ee/~runest/prax3/index.html">Back to main</a>')
    print('</body>')
    print("</html>")

form = cgi.FieldStorage()
action = form.getvalue("action")
name = form.getvalue("username")
fieldSize = form.getvalue("fieldSize")
mines = form.getvalue("mines")
winLoss = form.getvalue("winLoss")
steps = form.getvalue("steps")
nameToBrowse = form.getvalue("nameToBrowse")

if action == "writeData":
    writeData(name, fieldSize, mines, winLoss, steps)

elif action == "drawAllResultsPage":
    drawAllResultsPage()

elif action == "BrowseByName":
    drawResultsByName(nameToBrowse)
