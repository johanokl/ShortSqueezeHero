/*jslint browser: true, devel: true, nomen: true, sloppy: true, vars: true, indent: 2 */
/*global GraphicsElement, alertSplash, displayInfoscreen, intro */

window.onload = function () {

  var startTime,
    currentPriceTimer,
    buybutton = new GraphicsElement("buybutton"),
    gamestatus = new GraphicsElement("gamestatus"),
    stockprice = new GraphicsElement("stockprice"),
    restartgamebutton = new GraphicsElement("restartgamebutton"),
    stocksLeft = 0,
    totalPrice = 0,
    //
    increaseRate = 1.25,
    startPrice = 100,
    stocksToBuy = 50;

  function getCurrentPrice() {
    var timeSpent = (new Date().getTime() - startTime) / 500;
    if (timeSpent > 20) {
      increaseRate = 1.1;
    }
    return startPrice * Math.pow(increaseRate, timeSpent);
  }

  function displayCurrentPrice() {
    stockprice.setContent("NYSE:BMO: <br>$" + Math.round(getCurrentPrice()));
  }

  function displayGameStatus() {
    gamestatus.setContent(
      "Stocks Needed: " + stocksToBuy + "<br/>" +
      "Stocks bought: " + (stocksToBuy - stocksLeft) + "<br/>" +
      "Total Cost: $" + Math.round(totalPrice)
    );
  }

  function gameFinished() {
    clearInterval(currentPriceTimer);
    buybutton.setVisible(false);
    alertSplash();
    displayInfoscreen(
      "Well done!",
      [ "You managed to buy all " + stocksToBuy + " stocks that you needed.",
        "Unfortunately the total cost for them all was $" + Math.round(totalPrice) + ", " +
        "which means that you'll have to sell your Porsche to pay for it all.",
        "Hopefully you've learned your lesson and in the future will place your hard earnings in the only asset form that can't ever depricate in value, the Swedish property market."
      ],
      false
    );
    setTimeout(function () {
      restartgamebutton.setVisible(true);
      document.getElementById("restartgamebutton").onclick = function () {
    	  location.reload();
      };
    }, 2000);
  }

  function buyStock() {
    if (stocksLeft < 1) {
      return;
    }
    totalPrice += getCurrentPrice();
    stocksLeft -= 1;
    displayGameStatus();
    if (stocksLeft < 1) {
      gameFinished();
    }
  }


  function titleScreen() {
    var introbackground = new GraphicsElement("introbackground", undefined, true, "intro"),
      maintitle = new GraphicsElement("maintitle", "frontpageText", true, "intro"),
      creator = new GraphicsElement("creator", "frontpageText", true, "intro"),
      startgamebutton = new GraphicsElement("startgamebutton", "frontpageText", true, "intro");
    document.getElementById("startgamebutton").onclick = function () {
      introbackground.setState("outro");
      maintitle.setState("outro");
      creator.setState("outro");
      startgamebutton.setState("outro");
      setTimeout(function () {
        introbackground.setVisible(false);
        maintitle.setVisible(false);
        creator.setVisible(false);
        startgamebutton.setVisible(false);
        intro.start(startGame);
      }, 1500);
    };
  }

  function startGame() {
    stocksLeft = stocksToBuy;
    startTime = new Date().getTime();
    buybutton.setVisible(true);
    gamestatus.setVisible(true);
    stockprice.setVisible(true);
    displayCurrentPrice();
    displayGameStatus();
    document.getElementById("buybutton").onclick = buyStock;
    currentPriceTimer = setInterval(displayCurrentPrice, 500);
  }

  (function init() {
    document.getElementById("container").style.display = "block"
    titleScreen();
  }());

};