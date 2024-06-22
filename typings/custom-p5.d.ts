import * as p5 from "p5";

declare module "p5" {
  interface p5 {
    isMovingPoints(): boolean;
  }
}
