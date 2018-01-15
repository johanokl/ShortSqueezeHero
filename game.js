/*jslint browser: true, devel: true, nomen: true, sloppy: true, vars: true, indent: 2 */
/*global GraphicsElement, alertSplash, displayInfoscreen, infoscreenbuttonfunction, intro */

window.onload = function () {

  var startTime,
    currentPriceTimer,
    gameStatusTimer,
    lowScore = Number.MAX_SAFE_INTEGER,
    buybutton = new GraphicsElement("buybutton"),
    gamestatus = new GraphicsElement("gamestatus"),
    stockprice = new GraphicsElement("stockprice"),
    startgamebutton,
    restartgamebutton = new GraphicsElement("restartgamebutton"),
    stocksLeft = 0,
    totalPrice = 0,
    savingsLeft = 0,
    currentEarnings = 0,
    savingsStart = 15000,
    increaseRate = 1.25,
    startPrice = 95,
    soldPrice = 325,
    waitforkeyup = false,
    lowestPrice = 75,
    stocksToBuy = 60;

  function readParameter(str) {
    return (location.search.split(str + '=')[1]||'').split('&')[0];
  }

  function getCurrentPrice() {
    var timeSpent = (new Date().getTime() - startTime) / 1000;
    return startPrice * Math.pow(increaseRate, timeSpent);
  }

  function displayCurrentPrice() {
    stockprice.setContent("BIT:TAMA:<br>&euro;" + Math.round(getCurrentPrice()));
  }

  function updateGameStatus() {
    currentEarnings = Math.round((((soldPrice * (stocksToBuy - stocksLeft)) - totalPrice) + (soldPrice - getCurrentPrice()) * stocksLeft));
    savingsLeft = Math.round((currentEarnings > 0) ? savingsStart : (savingsStart + currentEarnings));
    if (savingsLeft < 0) {
      gameFinished();
      savingsLeft = 0;
    }
    gamestatus.setContent(
      "Current result from bet: " + ((currentEarnings < 0) ? "-&euro;" : "&euro;") + Math.abs(currentEarnings) + "<br>" +
      "Savings left: &euro;" + savingsLeft + "<br>" +
      "Stocks needed: " + stocksToBuy + "<br>" +
      "Stocks bought: " + (stocksToBuy - stocksLeft) + "<br>" +
      "Total cost: &euro;" + Math.round(totalPrice)
    );
  }

  function lowScoreNotice(newScore) {
    if (lowScore == Number.MAX_SAFE_INTEGER || newScore >= lowScore) {
      return "";
    }
    return "As it's current year your new low score of " + Math.round(newScore) +
      " has been added to a blockchain.";
  }

  function gameFinished() {
    clearInterval(currentPriceTimer);
    clearInterval(gameStatusTimer);
    buybutton.setVisible(false);
    if ((savingsLeft >= 0) && (totalPrice < lowScore)) {
      document.cookie = "shortSqueezeHeroLowScore=" + Math.round(totalPrice);
    }
    alertSplash();
    if (savingsLeft < 0) {
      displayInfoscreen(
        "Oh no!",
        [ "You didn't manage to buy the " + stocksToBuy + " stocks in time. ",
          "The stock price has risen so much that your savings at hand can't pay for it. " +
          "To cover it you'll have to sell your precious Porsche.",
          "Use the money you've left to buy a nice bike while thinking about the risks involved in shorting the stock market."
        ],
        false
      );
    } else if (currentEarnings >= 0) {
      displayInfoscreen(
        "Short Squeeze Hero!",
        [ "You managed to buy back all " + stocksToBuy + " stocks for an average price of &euro;" +
          (Math.round(totalPrice * 100 / stocksToBuy) / 100) + ", lower than you originally sold them for (&euro;" + soldPrice + ").",
          "This means that not even the short squeeze could prevent you from making a profit, this time &euro;" + Math.round((stocksToBuy * soldPrice) - totalPrice) + ".",
          "Good work! You're a role model to us all.",
          lowScoreNotice(totalPrice)
        ],
        false
      );
    } else {
      displayInfoscreen(
        "Well done!",
        [ "You managed to buy all " + stocksToBuy + " stocks that you needed.",
          "Unfortunately the total cost for them all was &euro;" + Math.round(totalPrice) + ", " +
          " a bit more than you had orginally sold them for (&euro;" + (stocksToBuy * soldPrice) +
          "). While you lost &euro;" + Math.round(totalPrice - stocksToBuy * soldPrice) +
          " on this bet at least you'll still get to keep your car.",
          lowScoreNotice(totalPrice)
        ],
        false
      );
    }
    setTimeout(function () {
      restartgamebutton.setVisible(true);
      document.getElementById("restartgamebutton").onclick = function () {
        location.reload();
      };
    }, 5000);
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

  document.onkeydown = function (event) {
    if (waitforkeyup || !startgamebutton || !event || event.keyCode !== 32) {
      return true;
    }
    waitforkeyup = true;
    if (startgamebutton.getState() === "intro") {
      document.getElementById("startgamebutton").onclick();
    } else if (restartgamebutton.isVisible()) {
      document.getElementById("restartgamebutton").onclick();
    } else if (infoscreenbuttonfunction) {
      infoscreenbuttonfunction();
    } else if (buybutton.isVisible()) {
      buyStock();
    }
  };

  document.onkeyup = function (event) {
    if (!event || event.keyCode !== 32) {
      return true;
    }
    waitforkeyup = false;
  };

  function titleScreen() {
    startgamebutton = new GraphicsElement("startgamebutton", "frontpageText", true, "intro");
    var introbackground = new GraphicsElement("introbackground", undefined, true, "intro"),
      maintitle = new GraphicsElement("maintitle", "frontpageText", true, "intro"),
      creator = new GraphicsElement("creator", "frontpageText", true, "intro"),
      lowscorelabel = new GraphicsElement("lowscore", "frontpageText", true, "intro");
    if (lowScore < Number.MAX_SAFE_INTEGER) {
      lowscorelabel.setContent("Low score:<br>" + Math.round(lowScore));
    }
    document.getElementById("startgamebutton").onclick = function () {
      introbackground.setState("outro");
      maintitle.setState("outro");
      creator.setState("outro");
      lowscorelabel.setState("outro");
      startgamebutton.setState("outro");
      setTimeout(function () {
        introbackground.setVisible(false);
        maintitle.setVisible(false);
        creator.setVisible(false);
        lowscorelabel.setVisible(false);
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
    savingsStart = readParameter("savingsStart") ? parseInt(readParameter("savingsStart"), 10) : savingsStart;
    increaseRate = readParameter("increaseRate") ? (parseInt(readParameter("increaseRate"), 10) / 100) : increaseRate;
    startPrice = readParameter("startPrice") ? parseInt(readParameter("startPrice"), 10) : startPrice;
    soldPrice = readParameter("soldPrice") ? parseInt(readParameter("soldPrice"), 10) : soldPrice;
    lowestPrice = readParameter("lowestPrice") ? parseInt(readParameter("lowestPrice"), 10) : lowestPrice;
    stocksToBuy = readParameter("stocksToBuy") ? parseInt(readParameter("stocksToBuy"), 10) : stocksToBuy;
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
    if (readParameter("lowscore") === "clear") {
      document.cookie = "shortSqueezeHeroLowScore=0";
    } else {
      lowScore = document.cookie.replace(/(?:(?:^|.*;\s*)shortSqueezeHeroLowScore\s*\=\s*([^;]*).*$)|^.*$/, "$1") || lowScore;
    }
    titleScreen();
  }());
};
