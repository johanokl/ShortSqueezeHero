/*jslint browser: true, devel: true, nomen: true, sloppy: true, indent: 2 */

function GraphicsElement(domElementName, classname, visible, state) {
  this._name = domElementName;
  this._image = document.getElementById(domElementName);
  this._visible = visible;
  this._state = state;
  this._classname = classname || "";
  this.updateClassName();
}

GraphicsElement.prototype.setContent = function (content) {
  if (this._image) {
    this._image.innerHTML = content;
  }
};

GraphicsElement.prototype.setVisible = function (visible) {
  this._visible = visible;
  this.updateClassName();
};

GraphicsElement.prototype.setState = function (state) {
  this._state = state;
  this.updateClassName();
};

GraphicsElement.prototype.updateClassName = function () {
  if (this._image) {
    this._image.className = "image " + (this._state || "") + " " + this._classname + " " + (this._visible ? "visible" : "hidden");
  }
};

function animateElement(graphicsElement, states) {
  if (graphicsElement && states[0]) {
    if (states[0].func !== undefined) {
      states[0].func();
    }
    if (states[0].state !== undefined) {
      graphicsElement.setState(states[0].state);
    }
    if (states[0].visible !== undefined) {
      graphicsElement.setVisible(states[0].visible);
    }
    if (states[0].time !== undefined) {
      setTimeout(
        function () {
          animateElement(graphicsElement, states.slice(1));
        },
        states[0].time
      );
    }
  }
}

var infoscreenheader,
  infoscreencontent,
  alertsplash,
  infoscreen;

function displayInfoscreen(header, content, callback) {
  if (!infoscreen || !infoscreenheader || !infoscreencontent) {
    infoscreen = new GraphicsElement("infoscreen");
    infoscreencontent = document.getElementById("infoscreencontent");
    infoscreenheader = document.getElementById("infoscreenheader");
  }
  document.getElementById("infoscreenbutton").className = (callback ? "visible" : "hidden");
  document.getElementById("infoscreenbutton").onclick = function () {
    infoscreen.setState("hide");
    setTimeout(callback, 200);
    setTimeout(function () {
      infoscreen.setState("");
    }, 1000);
  };
  infoscreenheader.innerHTML = header;
  infoscreencontent.innerHTML = content.join("<br/><br/>");
  infoscreen.setVisible(true);
  infoscreen.setState("display");
}

function alertSplash(flashes) {
  console.log("alertSplash " + flashes);
  if (!alertsplash) {
    alertsplash = new GraphicsElement("alertsplash", "", true);
  }
  animateElement(
    alertsplash,
    [{
      state: "intro",
      time: 0.2 * 1000
    }, {
      state: "outro",
      time: 0.2 * 1000
    }]
  );
  setTimeout(
    function () {
      if (flashes > 1) {
        alertSplash(flashes - 1);
      } else {
        alertsplash.setState("hidden");
      }
    },
    0.4 * 1000
  );
}

