### ANLEITUNG ###

Anleitung zum Starten der App:

__server.js__ im ordner server starten
__main.html__ local hosten und im browser öffnen
ip und port des servers eingeben
_________________________________________________
 
### Projektbeschreibung ###

Dungeon Hop ist ein interaktives Multiplayer Game, dass dem Apple Design Award
gewinner “Crossy Roads” von Hipster Whale Pty ltd. nachempfunden werden soll.
Die Spieler müssen sich mit ihrer Figur einen Weg durch den Kerker bahnen und versuchen, dabei weder in die Lava zu fallen noch mit einem der "Feinde" zu kollidieren. 
Da sich die Feinde außerdem ebenfalls bewegen und zusätzliche Hindernisse wie Fässer und Fackeln den Weg durch den Kerker teilweise versperren, wird der Spannungsfaktor für den Spieler erhöht. 
Im Multiplayer Mode gilt es nicht nur, die Hürden ohne Kollision zu passieren, sondern das auch schneller als der oder die Gegner zu tun, um nicht aus der Map zu verschwinden.

### Anforderungen ###
Das Spiel soll für die Nutzer einen klaren Mehrwert gegenüber anderen Arcade Hopper
Games bringen. Diesen Mehrwert stellt der Multiplayer Mode dar.
Die Grafik soll - basierend auf three.js und Qubicle Modellen - den Nutzer durch ein
überzeugendes, performantes und ansprechendes User Interface begeistern.
Die Physik sowie die Kollisionserkennung soll mit Physijs realisiert werden. Physijs
ermöglicht es, ein einfach bedienbares Interface mit three.js zu vereinen.
Durch einen mit node.js gehostetenServer verbinden sich die Spieler dann über die IP
Adresse.


# Spielverlauf #

**Das Spiel ist für 1 - 4 Spieler spielbar.**

1. Nutzer landen in der Lobby

2. Der Spieler gibt seinen Namen ein und verbindet sich auf den Server

3. Der Spieler drückt auf den "Start" - Button und wartet auf eventuelle Mitspieler

4. Ein Countdown wird heruntergezählt und das Spiel startet

# Spielende #

**Gewinner**

--> Wer ohne Kollision am längsten durchhält

**Verlierer**
 
*  Wer in die Lava fällt und stirbt
*  Wer mit einem Feind kollidiert
*  Wer zu langsam vorwärts kommt und dadurch aus der Map verschwindet

**Erweiterungen**

Nachdem ein Spieler verloren hat, erscheint der Button "Erneut spielen", damit ohne Rückkehr in die Lobby gleich ein neues Spiel gestartet werden kann.

# License

### by Laurin Muth, Hannah Kummel

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
