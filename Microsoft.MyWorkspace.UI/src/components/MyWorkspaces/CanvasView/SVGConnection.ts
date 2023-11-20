import { Coordinates } from './SVGInteractiveElement';

const CONNECTION_NUMBER_OFFSET = 8;
export class SVGConnection {
  svg: SVGElement & HTMLElement & SVGGraphicsElement;
  container: HTMLElement;
  id: string;
  object1Id: string;
  object2Id: string;
  color: string;
  connectionNumber: number;

  constructor(
    id: string,
    containerId: string,
    object1Id: string,
    object2Id: string,
    color: string,
    connectionNumber: number
  ) {
    this.id = id;
    this.object1Id = object1Id;
    this.object2Id = object2Id;
    this.color = color;
    this.connectionNumber = connectionNumber;
    this.svg = document.getElementById(id) as SVGElement &
      HTMLElement &
      SVGGraphicsElement;
    this.svg.setAttributeNS(null, 'stroke', color);
    this.container = document.getElementById(containerId);
    this.connect = this.connect.bind(this);
    window.addEventListener(`${object1Id}-move`, this.connect, false);
    window.addEventListener(`${object2Id}-move`, this.connect, false);
    this.connect();
  }

  removeListeners() {
    window.removeEventListener(`${this.object1Id}-move`, this.connect, false);
    window.removeEventListener(`${this.object2Id}-move`, this.connect, false);
  }

  getMousePosition(event: MouseEvent) {
    const CTM = this.svg.getScreenCTM();
    return {
      x: (event.clientX - CTM.e) / CTM.a,
      y: (event.clientY - CTM.f) / CTM.d,
    };
  }

  connect() {
    const o1 = document.getElementById(this.object1Id);
    const o2 = document.getElementById(this.object2Id);
    const o1Coords: Coordinates = {
      x:
        parseFloat(o1.getAttributeNS(null, 'x')) +
        parseFloat(o1.getAttributeNS(null, 'width')) / 2,
      y:
        parseFloat(o1.getAttributeNS(null, 'y')) +
        parseFloat(o1.getAttributeNS(null, 'height')) / 2,
    };
    const o2Coords: Coordinates = {
      x:
        parseFloat(o2.getAttributeNS(null, 'x')) +
        parseFloat(o2.getAttributeNS(null, 'width')) / 2,
      y:
        parseFloat(o2.getAttributeNS(null, 'y')) +
        parseFloat(o2.getAttributeNS(null, 'height')) / 2,
    };

    const midx =
      o1Coords.x > o2Coords.x
        ? o1Coords.x - this.connectionNumber * CONNECTION_NUMBER_OFFSET
        : o1Coords.x + this.connectionNumber * CONNECTION_NUMBER_OFFSET;

    const finalx =
      o2Coords.x > o1Coords.x
        ? o2Coords.x - this.connectionNumber * CONNECTION_NUMBER_OFFSET
        : o2Coords.x + this.connectionNumber * CONNECTION_NUMBER_OFFSET;

    // Working toward curved connections
    // A ${CONNECTION_NUMBER_OFFSET} ${CONNECTION_NUMBER_OFFSET}, 0, 0, 0, ${curveToX} ${o2Coords.y}
    this.svg.setAttributeNS(
      null,
      'd',
      `M ${midx} ${o1Coords.y}
       L ${midx} ${o2Coords.y}
       L ${finalx} ${o2Coords.y}`
    );
  }
}
