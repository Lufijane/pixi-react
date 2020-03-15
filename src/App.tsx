import * as PIXI from "pixi.js";
import logo from "./logo.svg";
import "./App.css";
import PixiFps from "pixi-fps";
import React from "react";

const addCiapkiMethod: "adChild" | "seperate" | "none" = "none";
const rectCount = 1000;

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
        width: 600,
        height: 600,
        //backgroundColor: 0x1099bb,
        //resolution: window.devicePixelRatio || 1,
        transparent: true,
        antialias: true
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
        container2.rotation -= 0.01 * delta;
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
    const texture = PIXI.Texture.from("circle.png");

    const rects = Array(rectCount)
      .fill(null)
      .map(() => this.createRectangle(texture, container));

    container.addChild(...rects);

    if (addCiapkiMethod === "seperate") {
      const sprites = rects.map(rect => {
        return [
          this.createDragSprite(rect.x, rect.y, texture),
          this.createDragSprite(rect.x + rect.width, rect.y, texture),
          this.createDragSprite(
            rect.x + rect.width,
            rect.y + rect.height,
            texture
          ),
          this.createDragSprite(rect.x, rect.y + rect.height, texture)
        ];
      });

      sprites.forEach(x => container.addChild(...x));
    }

    console.timeEnd("Initialize scene");

    // Move container to the center

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
  }

  createDragSprite(x: number, y: number, texture: PIXI.Texture) {
    const circle = new PIXI.Sprite(texture);
    circle.anchor.set(0.5);
    circle.scale.x = 0.5;
    circle.scale.y = 0.5;
    circle.x = x;
    circle.y = y;
    return circle;
  }

  createRectangle(texture: PIXI.Texture, parent: PIXI.Container) {
    const x = Math.floor(Math.random() * 600);
    const y = Math.floor(Math.random() * 600);
    const rectangle = new PIXI.Graphics();

    rectangle.x = 0;
    rectangle.y = 0;
    const color = 0xffffff * Math.random();
    rectangle.lineStyle(10, color, 1);
    //rectangle.lineStyle(1, color, 1);
    //rectangle.beginFill(color, 0.7);
    const width = 100 * Math.random() + 20;
    const height = 100 * Math.random() + 20;
    rectangle.drawRect(0, 0, width, height);
    //rectangle.endFill();
    rectangle.interactive = true;
    rectangle.buttonMode = true;
    rectangle.rotation = Math.random();
    rectangle.scale.set(1);

    if (addCiapkiMethod === "adChild") {
      const sprites = [
        this.createDragSprite(rectangle.x, rectangle.y, texture),
        this.createDragSprite(
          rectangle.x + rectangle.width,
          rectangle.y,
          texture
        ),
        this.createDragSprite(
          rectangle.x + rectangle.width,
          rectangle.y + rectangle.height,
          texture
        ),
        this.createDragSprite(
          rectangle.x,
          rectangle.y + rectangle.height,
          texture
        )
      ];

      rectangle.addChild(...sprites);
    }

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
