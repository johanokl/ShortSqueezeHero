/*jslint browser: true, devel: true, nomen: true, sloppy: true, vars: true, indent: 2 */
/*global GraphicsElement, alertSplash, displayInfoscreen, intro */

window.onload = function () {

  var startTime,
    currentPriceTimer,
    gameStatusTimer,
    highScore = Number.MAX_SAFE_INTEGER,
    buybutton = new GraphicsElement("buybutton"),
    gamestatus = new GraphicsElement("gamestatus"),
    stockprice = new GraphicsElement("stockprice"),
    restartgamebutton = new GraphicsElement("restartgamebutton"),
    stocksLeft = 0,
    totalPrice = 0,
    savingsLeft = 0,
    currentEarnings = 0,
    savingsStart = 15000,
    increaseRate = 1.25,
    startPrice = 95,
    soldPrice = 325,
    lowestPrice = 75,
    stocksToBuy = 50;

  function readParameter(str) {
    return (location.search.split(str + '=')[1]||'').split('&')[0];
  }

  function getCurrentPrice() {
    var timeSpent = (new Date().getTime() - startTime) / 1000;
    return startPrice * Math.pow(increaseRate, timeSpent);
  }

  function displayCurrentPrice() {
    stockprice.setContent("NYSE:BMO: <br>$" + Math.round(getCurrentPrice()));
  }

  function updateGameStatus() {
    currentEarnings = Math.round((((soldPrice * (stocksToBuy - stocksLeft)) - totalPrice) + (soldPrice - getCurrentPrice()) * stocksLeft));
    savingsLeft = Math.round((currentEarnings > 0) ? savingsStart : (savingsStart + currentEarnings));
    console.log(savingsLeft);
    if (savingsLeft < 0) {
      gameFinished();
    }
    gamestatus.setContent(
      "Current result from bet: " + ((currentEarnings < 0) ? "-$" : "$") + Math.abs(currentEarnings) + "<br>" +
      "Savings left: $" + savingsLeft + "<br>" +
      "Stocks needed: " + stocksToBuy + "<br>" +
      "Stocks bought: " + (stocksToBuy - stocksLeft) + "<br>" +
      "Total cost: $" + Math.round(totalPrice)
    );
  }

  function gameFinished() {
    clearInterval(currentPriceTimer);
    clearInterval(gameStatusTimer);
    buybutton.setVisible(false);
    if ((savingsLeft >= 0) && (highScore > totalPrice)) {
      document.cookie = "shortSqueezeHeroHighScore=" + Math.round(totalPrice);
    }
    alertSplash();
    if (savingsLeft < 0) {
      displayInfoscreen(
        "Oh no!",
        [ "You didn't manage to buy the " + stocksToBuy + " stocks in time. ",
          "The stock price has risen so much that your savings at hand can't pay for it, " +
          "meaning that you'll have to sell your precious Porche to pay for it all.",
          "Hopefully you've learned your lesson and in the future will place your hard earnings in the only asset form that can't ever depricate in value, the Swedish property market."
        ],
        false
      );
    } else if (currentEarnings > 0) {
      displayInfoscreen(
        "Short Squeeze Hero!",
        [ "You managed to buy back all " + stocksToBuy + " stocks for an average price of $" + Math.round(totalPrice / stocksToBuy) + ", lower than you had originally sold them for ($" + soldPrice + ").",
          "This means that not even the short squeeze could you prevent you from making at least a small profit, in this case $" + Math.round((stocksToBuy * soldPrice) - totalPrice) + ".",
          "Good work! You're a role model to us all."
        ],
        false
      );
    } else {
      displayInfoscreen(
        "Well done!",
        [ "You managed to buy all " + stocksToBuy + " stocks that you needed.",
          "Unfortunately the total cost for them all was $" + Math.round(totalPrice) + ", " +
          " a bit more than you had orginally sold them for ($" + (stocksToBuy * soldPrice) + "), meaning that you made a net loss for this bet. At least you still have you car.",
          "Hopefully you've learned your lesson and in the future will place your hard earnings in the only asset form that can't ever depricate in value, the Swedish property market."
        ],
        false
      );
    }
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
    updateGameStatus();
    if (stocksLeft < 1 || savingsLeft < 0) {
      gameFinished();
    }
  }

  function titleScreen() {
    var introbackground = new GraphicsElement("introbackground", undefined, true, "intro"),
      maintitle = new GraphicsElement("maintitle", "frontpageText", true, "intro"),
      creator = new GraphicsElement("creator", "frontpageText", true, "intro"),
      startgamebutton = new GraphicsElement("startgamebutton", "frontpageText", true, "intro"),
      highscorelabel = new GraphicsElement("highscore", "frontpageText", true, "intro");
    if (highScore < Number.MAX_SAFE_INTEGER) {
      highscorelabel.setContent("High score:<br>" + Math.round(highScore));
    }
    document.getElementById("startgamebutton").onclick = function () {
      introbackground.setState("outro");
      maintitle.setState("outro");
      creator.setState("outro");
      highscorelabel.setState("outro");
      startgamebutton.setState("outro");
      setTimeout(function () {
        introbackground.setVisible(false);
        maintitle.setVisible(false);
        creator.setVisible(false);
        highscorelabel.setVisible(false);
        startgamebutton.setVisible(false);
        if (readParameter("start") === "game") {
          startGame();
        } else {
          intro.start(startGame, startPrice, soldPrice, lowestPrice, stocksToBuy);
        }
      }, 1500);
    };
  }

  function startGame() {
    document.getElementById("gamescreen").style.display = "block";
    savingsStart = readParameter("savingsStart") ? parseInt(readParameter("savingsStart"), 10) : savingsStart;
    increaseRate = readParameter("increaseRate") ? (parseInt(readParameter("increaseRate"), 10) / 100) : increaseRate;
    startPrice = readParameter("startPrice") ? parseInt(readParameter("startPrice"), 10) : startPrice;
    soldPrice = readParameter("soldPrice") ? parseInt(readParameter("soldPrice"), 10) : soldPrice;
    lowestPrice = readParameter("lowestPrice") ? parseInt(readParameter("lowestPrice"), 10) : lowestPrice;
    stocksToBuy = readParameter("stocksToBuy") ? parseInt(readParameter("stocksToBuy"), 10) : stocksToBuy;
    stocksLeft = stocksToBuy;
    startTime = new Date().getTime();
    buybutton.setVisible(true);
    gamestatus.setVisible(true);
    stockprice.setVisible(true);
    displayCurrentPrice();
    updateGameStatus();
    document.getElementById("buybutton").onclick = buyStock;
    currentPriceTimer = setInterval(displayCurrentPrice, 250);
    gameStatusTimer = setInterval(updateGameStatus, 250);
  }

  (function init() {
    if (readParameter("highscore") === "clear") {
      document.cookie = "shortSqueezeHeroHighScore=0";
    } else {
      highScore = document.cookie.replace(/(?:(?:^|.*;\s*)shortSqueezeHeroHighScore\s*\=\s*([^;]*).*$)|^.*$/, "$1") || highScore;
    }
    titleScreen();
  }());

};