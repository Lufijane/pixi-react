import * as PIXI from "pixi.js";
import logo from "./logo.svg";
import "./App.css";
import PixiFps from "pixi-fps";
import React from "react";

class PixiSceneViewer extends React.Component<{}, {}> {
  element: React.RefObject<HTMLDivElement>;
  constructor(props: {}) {
    super(props);
    this.element = React.createRef();
    this.data = null;
    this.alpha = 0.5;
    this.dragging = false;
    this.x = 0;
    this.y = 0;
  }

  componentDidMount() {
    console.log("mounting");

    if (this.element.current !== null) {
      const fpsCounter = new PixiFps();
      const app = new PIXI.Application({
        width: 1600,
        height: 800,
        //backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1
      });
      document.body.appendChild(app.view);

      const container1 = new PIXI.Container();
      //const container2 = new PIXI.Container();

      app.stage.addChild(container1);
      //app.stage.addChild(container2);
      app.stage.addChild(fpsCounter);
      this.parent = app.stage;
      // Create a new texture
      this.renderContainer(container1, app, 0);
      //this.renderContainer(container2, app, 1);

      // Listen for animate update
      app.ticker.add(delta => {
        // rotate the container!
        // use delta to create frame-independent transform
        //container1.rotation -= 0.01 * delta;
        //container2.rotation -= 0.01 * delta;
      });
    }
  }

  private renderContainer(
    container: PIXI.Container,
    app: PIXI.Application,
    offset: number
  ) {
    const texture = PIXI.Texture.from("./bunny.png");
    // for (let i = 0; i < 100000; i++) {
    //   const bunny = new PIXI.Sprite(texture);
    //   bunny.anchor.set(0.5);
    //   bunny.x = (i % 5) * 40;
    //   bunny.y = Math.floor(i / 5) * 40;
    //   container.addChild(bunny);
    // }
    container.x = app.screen.width / 2; //4 + (offset * (app.screen.width + 10)) / 2;
    container.y = app.screen.height / 2;

    // for (let i = 0; i < 100; i++) {
    //   const graphics = new PIXI.Graphics();
    //   const x = Math.random();
    //   const y = Math.random();

    //   graphics.beginFill(0xffff00);

    //   // set the line style to have a width of 5 and set the color to red
    //   graphics.lineStyle(2, 0xff0000);

    //   // draw a rectangle
    //   graphics.drawRect(x * 400 - 25, y * 400 - 25, 100, 100);
    //   //graphics.cacheAsBitmap = true;
    //   container.addChild(graphics);
    // }

    for (let i = 0; i < 10; i++) {
      container.addChild(
        this.createBunny(
          Math.floor(Math.random() * app.screen.width),
          Math.floor(Math.random() * app.screen.height),
          texture
        )
      );
    }

    // Move container to the center

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
  }

  createBunny(x: number, y: number, texture: PIXI.Texture) {
    // create our little bunny friend..
    const bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    bunny
      .on("pointerdown", this.onDragStart)
      .on("pointerup", this.onDragEnd)
      .on("pointerupoutside", this.onDragEnd)
      .on("pointermove", this.onDragMove);

    bunny.x = x;
    bunny.y = y;
    return bunny;
  }

  data: any;
  alpha: number;
  dragging: boolean;
  parent: any;
  x: number;
  y: number;

  onDragStart = (event: any) => {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    console.log("setting data", event);

    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  };

  onDragEnd = () => {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  };

  onDragMove = () => {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  };

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return <div style={{ height: "100%" }} ref={this.element} />;
  }
}
function App() {
  return (
    <div className="App">
      <PixiSceneViewer></PixiSceneViewer>
      {/* <div
        style={{
          background: "red",
          width: "200px",
          height: "200px",
          position: "absolute"
        }}
      ></div> */}
    </div>
  );
}

export default App;
