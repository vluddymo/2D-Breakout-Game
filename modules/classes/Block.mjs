import {BLOCK_HEIGHT, BLOCK_WIDTH} from "../constants/constants.mjs"


class Block {
    constructor(xAxis, yAxis) {
      this.bottomLeft = [xAxis, yAxis];
      this.bottomRight = [xAxis + BLOCK_WIDTH, yAxis];
      this.topLeft = [xAxis, yAxis + BLOCK_HEIGHT];
      this.topRight = [xAxis + BLOCK_WIDTH, yAxis + BLOCK_HEIGHT];
    }
  }


export {Block}