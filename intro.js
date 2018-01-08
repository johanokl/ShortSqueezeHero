/*jslint browser: true, devel: true, nomen: true, sloppy: true, vars: true, indent: 2 */
/*global GraphicsElement, animateElement, alertSplash, displayInfoscreen */

var intro = (function () {

  var graph,
    graphhider,
    boughtPrice,
    lowestPrice,
    stocksToBuy,
    startPrice,
    states,
    currentState = -1,
    exitFunction;

  function nextState() {
    currentState += 1;
    if (currentState < states.length) {
      states[currentState]();
    }
  }

  function startIntro() {
    var graphElement = document.getElementById("graph");
    graphElement.onload = nextState;
    graphElement.src = "img/trade.png";
  }

  states = [
    function () {
      graph = new GraphicsElement("graph");
      graphhider = new GraphicsElement("graphhider");
      displayInfoscreen(
        "",
        [ "The future's looking grim for Italy's Tamagucci S.p.A.",
        "Twenty years after their electronic egg toy took the world by storm they have yet to repeat the success. " +
        "The company's spent the past five years and almost all the money they made 20 years " +
        "ago on trying to develop an advanced AI driven toy that's advanced enough to impress 2018's kids. " +
        "However the new toy has been hit by numerous delays and it's release date is uncertain.",
        "Based on this pessimistic forcecast you decide to make a daring bet and short the company's stock (BIT:TAMA)."
        ],
        nextState
      );
    },

    function () {
      graph.setVisible(true);
      graph.setState("intro");
      animateElement(
        graphhider,
        [{
          visible: true,
          state: "intro",
          time: 0.5 * 1000
        }, {
          state: "moveout"
        }]
      );
      setTimeout(nextState, 4.5 * 1000);
    },

    function () {
      displayInfoscreen(
        "Congratulations!",
        [ "Tamagucci S.p.A. has finally launched their new electronic egg toy and it looks like you made a wise decision. ",
        "While the toy can talk it seems the developers used Twitter as its data source. " +
        "The tabloids are filled with articles about parents complaining that the eggs are calling their kids racial slurs. " +
        "It's unlikely that the toy will be Christmas Present of the Year.",
        "The stock has continued to plunge and is now down to &euro;" + lowestPrice +
        ", meaning that the " + stocksToBuy + " stocks you shorted at &euro;" + boughtPrice +
        " will net you a whopping &euro;" + ((boughtPrice - lowestPrice) * stocksToBuy) + "."
        ],
        nextState
      );
    },

    function () {
      graph.setState("movetorebound");
      setTimeout(
        function () {
          alertSplash(3);
        },
        3.7 * 1000
      );
      setTimeout(nextState, 4 * 1000);
    },

    function () {
      displayInfoscreen(
        "",
        ["\"Trump says he will MAGA by replacing the USD with the cryptocurrency TrumpCoin\"",
          "\"Scientists say that electronic eggs are the best way to mine TrumpCoin\"",
          "First you think it's a joke. Then you remember that it's current year. " +
          "Then you realize the consequences. The BIT:TAMA stock price is already rising quickly on the news.",
          "You decide to close your positions by buying the shorted stocks. " +
          "If you manage to get out now at &euro;" + startPrice + " you've still made &euro;" + ((boughtPrice - startPrice) * stocksToBuy) + "."
        ],
        function () {
          alertSplash(3);
          setTimeout(nextState, 1.5 * 1000);
        }
      );
    },

    function () {
      displayInfoscreen(
        "We have a Short Squeeze!",
        [ "You're not the only one who want to get away from their shorted positions, " +
          "and the lucky fellows with the stock aren't really eager to sell it.",
          "You have to close your shorted position as soon as possible, or else the " +
          "price might have risen so much that paying for the stocks you're short will " +
          "force you to sell your precious Porsche. It's no longer just about " +
          "securing your profit, now it's about your car.",
          "You can still make it, but for that you have to fight hard. Smash the " +
          "buy button the fastest it has ever been smashed."
        ],
        nextState
      );
    },

    function () {
      currentState = -1;
      graph.setVisible(false);
      graphhider.setVisible(false);
      if (exitFunction) {
        exitFunction();
      }
    }
  ];

  return {
    "start": function (callback, inStartPrice, inBoughtPrice, inLowestPrice, inStocksToBuy) {
      startIntro();
      exitFunction = callback;
      boughtPrice = inBoughtPrice;
      lowestPrice = inLowestPrice;
      stocksToBuy = inStocksToBuy;
      startPrice = inStartPrice;
    }
  };
}());
