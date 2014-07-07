<h1>My 2048 Solution</h1>

My solution to the tutorial blog post <a href="http://www.ng-newsletter.com/posts/building-2048-in-angularjs.html">Building the 2048 game in AngularJS</a> by Ari Lerner, published in in the early April edition of the <a href="http://www.ng-newsletter.com/">ng-newsletter</a>. Created by <a href="http://fullstackedu.com">Fullstack.io</a>.

The game 2048 itself was create by <a href="http://gabrielecirulli.com/">Gabriele Cirulli</a> - this implementation is an Angular interpretation of Gabriele's beautiful game. Talk about standing on the shoulders of giants.

<h2>My Immediate Work</h2>

In the tutorial Ari used angular-generator, which expects a ruby environment and the appropriate compass gem to be installed. I bypassed this entirely and hand crafted the angular configuration. Also, I wanted to make this run on nodejs.

Progression through the tutorial requires referencing the github source code frequently - don't be afraid to tab over and read and use the source. The tutorial is definitely not up to date, bugs abound. Use the source!

I've changed the keyboard configuration to W, S, A, D - instead of using the arrow keys - since I hate taking my hand off my mouse.

<h2>Version 2 Plans</h2>

<ul>
<li>Add swipe listerns for touch devices</li>
<li>Add database backend for global high score retention (yay overkill!)</li>
<li>Add "personal" high score and "community" high score by adding a simple account feature</li>
<li>Add user controlled changing of board size</li>
<li>Add board size changes based on resolution(?)</li>
</ul>