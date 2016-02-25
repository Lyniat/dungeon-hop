## ANLEITUNG ## 
Server starten und main.html im Browser oeffnen

_________________________________________________
 
### Projektbeschreibung ###

Dungeon Hop ist ein interaktives Multiplayer Game, dass dem Apple Design Award
gewinner “Crossy Roads” von Hipster Whale Pty ltd. nachempfunden werden soll. Das
Spiel soll als Endloses Arcade Spiel einen oder mehrere Nutzer durch spannende Welten
wie Verliese und Kerker geleiten. Die Figuren der Spieler müssen Tunnel und Wege der
Gemäuer durchqueren, und dürfen dabei nicht mit den Hindernissen die sich horizontal
über den Bildschirmverlauf bewegen kollidieren. Im Multiplayer Mode gilt es nicht nur,
die Hürden ohne Kollision zu passieren, sondern das auch schneller und effektiver als der
Gegner zu tun. Die Gamification wird außerdem erweitert durch das einsammeln von
Gems die den Spielstand vorantreiben oder aber auch Fallen, die den Spieler
zurückwerfen.

### Anforderungen ###
Das Spiel soll für die Nutzer einen klaren Mehrwert gegenüber anderen Arcade Hopper
Games bringen. Diesen Mehrwert stellt der Multiplayer Mode dar.
Die Grafik soll - basierend auf three.js und Qubicle Modellen - den Nutzer durch ein
überzeugendes, performantes und ansprechendes User Interface begeistern.
Die Physik sowie die Kollisionserkennung soll mit Physijs realisiert werden. Physijs
ermöglicht es, ein einfach bedienbares Interface mit three.js zu vereinen.
Durch einen mit node.js gehostetenServer verbinden sich die Spieler dann über die IP
Adresse.


### Spielmodus ### 

**Das Spiel ist für 1 bis 4 Spieler spielbar.**

1. Nutzer landen in der lobby

2. funktion 1: spielernamen angeben (Anzahl der spielernamen die angegeben werden können ergeben sich automatisch mit den Rückmeldungen, wie viele clients geloggt sind)

3. funktion 2: spiel beginnen

**Im Spiel**

haben alle Spieler den "start" button geklickt zählt der counter von 3 nach unten
anschließend beginnt das spiel

**Gewinner**
1. wer ohne Kollision am längsten durchhält

**Verlierer**

1. wer mit feind kollidiert oder in lava springt.

2. wer zu langsam ist und nicht mehr im canvas ist

**Erweiterungen**

1. nachdem ein spieler verloren hat erscheint den Spielern der button "erneut spielen", damit ohne Rückkehr in die lobby gleich ein neues spiel gestartet werden kann

2. es wäre vielleicht gut, jedem spieler 3 leben zu geben, da das spiel sonst sehr schnell vorbei ist.