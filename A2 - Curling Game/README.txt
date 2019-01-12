Justin Tam
justintam@cmail.carleton.ca

Tested On:
Node v8.12.0
Windows 10 Pro

Install:
In the command prompt : npm install socket.io

Launch in command prompt:
node server.js

Testing:
Visit http://localhost:3000/assignment3.html

Type in a screen name and click "Assign Player" to gain control of 3 stones. Click "Un-assign Player" to give up control (no need to type in anything, it unassigns the current browser).

The stones are controlled catapult-style, mouse down on a stone when you have control over it and mouse up when you are ready to shoot. The further the stone is from the original position, the more power there is.

Issues:
Timer is updating to frequently, variable number can be changed to make for a smoother experience.
