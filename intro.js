/*jslint browser: true, devel: true, nomen: true, sloppy: true, vars: true, indent: 2 */
/*global GraphicsElement, animateElement, alertSplash, displayInfoscreen */

var intro = (function () {

  var graphicsElements,
    exitFunction;

  function startIntro() {
    graphicsElements = {
      graph: new GraphicsElement("graph"),
      graphhider: new GraphicsElement("graphhider"),
    };
    displayInfoscreen(
      "",
      [ "The last couple of months haven't been good for Big Mountain Oil Co.",
      "Their mission, to drill on mountains no one has even thought about drilling on, seems to have backfired. Their latest project, drilling after oil on Mount Everest, continues to cost billions of dollars each month with yet to produce even a single drop of oil.",
      "Based on this you decide to make a daring bet and short the company's stock (NYSE:BMO). What could go wrong?"
      ],
      prequelScreenTwo
    );
  }

  function prequelScreenTwo() {
    graphicsElements.graph.setVisible(true);
    graphicsElements.graph.setState("intro");
    animateElement(
      graphicsElements.graphhider,
      [{
        visible: true,
        state: "intro",
        time: 0.5 * 1000
      }, {
        state: "moveout"
      }]
    );
    setTimeout(prequelScreenThree, 4.5 * 1000);
  }

  function prequelScreenThree() {
    displayInfoscreen(
      "Congratulations!",
      [ "It looks like you made a wise decision.",
      "Mount Everest seems drier than the Sahara desert, so dry its cows are giving powdered milk.",
      "The stock has continued to plunge, and you've already started planning what things to buy for the money you'll make from this bet. Maybe a new car?"
      ],
      prequelScreenFour
    );
  }

  function prequelScreenFour() {
    graphicsElements.graph.setState("movetorebound");
    setTimeout(
      function () {
        alertSplash(3);
      },
      3.7 * 1000
    );
    setTimeout(prequelScreenFive, 4 * 1000);
  }

  function prequelScreenFive() {
    displayInfoscreen(
      "What?!",
      [ "\"World's largest pocket of desktop printer ink found inside Mount Everest\"<br>" +
        "How can that even be possible? The world's most expensive fluid, inside Mount Everest?",
        "But you don't have time to think more about that, you have more urgent things to take care of. The stock is rebounding, it's almost like every stock trader on the planet wants a piece of the inky fortune.<br>"  +
        "You decide to cut your losses and buy the shorted stock to close your positions."
      ],
      function () {
        alertSplash(3);
        setTimeout(prequelScreenSix, 1.5 * 1000);
      }
    );
  }

  function prequelScreenSix() {
    displayInfoscreen(
      "We have a Short Squeeze!",
      [ "You're not the only one who want to get away from their shorted positions, and the lucky fellows with the stock aren't really eager to sell it. ",
        "You have to close your shorted position as soon as possible, or else the stock price might have risen so much that getting the money for buying the stocks you're short will force you to sell both your apartment and your precious Porsche.",
        "But for that you have to fight hard. Smash the buy button the fastest it has ever been smashed."
      ],
      exitIntro
    );
  }

  function exitIntro() {
    graphicsElements.graph.setVisible(false);
    graphicsElements.graphhider.setVisible(false);
    if (exitFunction) {
      exitFunction();
    }
  }

  return {
    "start": function (callback) {
      startIntro();
      exitFunction = callback;
    }
  };
}());