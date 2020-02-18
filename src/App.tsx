import * as PIXI from "pixi.js";
import logo from "./logo.svg";
import "./App.css";
import PixiFps from "pixi-fps";
import React from "react";

export const useForceUpdate = () => {
  const [, setDummyState] = React.useState<{}>(Object.create(null));
  const forceUpdate = React.useCallback(
    () => setDummyState(Object.create(null)),
    []
  );
  return forceUpdate;
};

class PixiSceneViewer extends React.Component<{}, {}> {
  element: React.RefObject<HTMLDivElement>;
  constructor(props: {}) {
    super(props);
    this.element = React.createRef();
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

      //const container1 = new PIXI.Container();
      const container2 = new PIXI.Container();

      //app.stage.addChild(container1);
      app.stage.addChild(container2);
      app.stage.addChild(fpsCounter);
      // Create a new texture
      //this.renderContainer(container1, app, 0);

      this.renderContainer(container2, app, 0);

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
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.width = app.screen.width / 2;
    container.height = app.screen.height / 2;
    console.time("Initialize scene");

    for (let i = 0; i < 100000; i++) {
      const rectangle = new PIXI.Graphics();
      rectangle.x = 0;
      rectangle.y = 0;
      this.createRectangle(
        Math.floor(Math.random() * 1600),
        Math.floor(Math.random() * 800),
        rectangle,
        container
      );
      container.addChild(rectangle);
    }

    console.timeEnd("Initialize scene");

    // Move container to the center

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
  }

  createRectangle(
    x: number,
    y: number,
    rectangle: PIXI.Graphics,
    parent: PIXI.Container
  ) {
    const color = 0xffffff * Math.random();
    //rectangle.lineStyle(1, color, 1);
    rectangle.beginFill(color, 0.7);
    rectangle.drawRect(0, 0, 40 * Math.random(), 40 * Math.random());
    //rectangle.drawRect(0, 0, 40, 40);
    rectangle.endFill();

    rectangle.interactive = true;
    rectangle.buttonMode = true;
    //bunny.anchor.set(0.5);
    rectangle.scale.set(3);
    let data: any = null;
    let alpha: number = 0.5;
    let dragging: boolean = false;

    const onDragStart = (event: any) => {
      data = event.data;
      alpha = 0.5;
      dragging = true;
    };

    const onDragEnd = () => {
      rectangle.alpha = 1;
      dragging = false;
      data = null;
    };

    const onDragMove = () => {
      if (dragging) {
        const newPosition = data.getLocalPosition(parent);
        rectangle.x = newPosition.x;
        rectangle.y = newPosition.y;
      }
    };
    // setup events for mouse + touch using
    // the pointer events
    rectangle
      .on("pointerdown", onDragStart)
      .on("pointerup", onDragEnd)
      .on("pointerupoutside", onDragEnd)
      .on("pointermove", onDragMove);

    rectangle.x = x;
    rectangle.y = y;
    return rectangle;
  }

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
