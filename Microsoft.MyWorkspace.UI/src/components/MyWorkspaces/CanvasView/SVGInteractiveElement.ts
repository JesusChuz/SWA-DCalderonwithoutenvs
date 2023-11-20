export interface Coordinates {
  x: number;
  y: number;
}

export class SVGInteractiveElement {
  selected: boolean;
  svg: SVGElement & HTMLElement & SVGGraphicsElement;
  container: SVGElement & HTMLElement & SVGGraphicsElement;
  offset: Coordinates;
  id: string;
  width: number;
  height: number;
  moveEvent: Event;

  constructor(id: string, containerId: string, width: number, height: number) {
    this.selected = false;
    this.id = id;
    this.width = width;
    this.height = height;
    this.svg = document.getElementById(id) as SVGElement &
      HTMLElement &
      SVGGraphicsElement;
    this.container = document.getElementById(containerId) as SVGElement &
      HTMLElement &
      SVGGraphicsElement;
    this.startDrag = this.startDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.drag = this.drag.bind(this);
    this.svg.addEventListener('mousedown', this.startDrag, false);
    this.svg.classList.add('moveable');
    this.container.addEventListener('mouseup', this.endDrag, false);
    this.container.addEventListener('mousemove', this.drag, false);
    this.container.addEventListener('mouseleave', this.endDrag, false);
    this.moveEvent = new CustomEvent(`${id}-move`);
  }

  removeListeners() {
    this.svg.removeEventListener('mousedown', this.startDrag, false);
    this.svg.classList.remove('moveable');
    this.container.removeEventListener('mouseup', this.endDrag, false);
    this.container.removeEventListener('mousemove', this.drag, false);
    this.container.removeEventListener('mouseleave', this.endDrag, false);
  }

  startDrag(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selected = true;
    this.container.appendChild(this.svg);
    this.offset = this.getMousePosition(event);
    this.offset.x -= parseFloat(this.svg.getAttributeNS(null, 'x'));
    this.offset.y -= parseFloat(this.svg.getAttributeNS(null, 'y'));
  }

  getMousePosition(event: MouseEvent) {
    const CTM = this.container.getScreenCTM();
    return {
      x: (event.clientX - CTM.e) / CTM.a,
      y: (event.clientY - CTM.f) / CTM.d,
    };
  }

  drag(event: MouseEvent) {
    if (this.selected) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const coord = this.getMousePosition(event);
      dispatchEvent(this.moveEvent);
      this.svg.setAttributeNS(null, 'x', (coord.x - this.offset.x).toString());
      this.svg.setAttributeNS(null, 'y', (coord.y - this.offset.y).toString());
    }
  }

  endDrag(event: MouseEvent) {
    this.selected = false;
    dispatchEvent(this.moveEvent);
  }
}
