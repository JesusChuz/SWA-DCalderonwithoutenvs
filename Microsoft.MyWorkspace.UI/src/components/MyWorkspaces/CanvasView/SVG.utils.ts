import { AzureVirtualMachineDto } from 'src/types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureVirtualMachineForCreationDto } from 'src/types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { ViewBox } from 'src/types/UI/ViewBox';

export const VMWidth = 320;
export const VMHeight = 94;
export const VMPadding = 25;
export const NetworkViewNumberVMsPerRow = 4;

export const VNWidth = 200;
export const VNHeight = 45;
export const VNPadding = 25;
export const NetworkViewNumberVNsPerRow = 5;

export const DomainViewVMMarginLeft = 35;
export const DomainViewVMMarginTop = VMPadding + 25;
export const DomainViewDomainMemberMarginLeft = 75;
export const DomainViewNumberVMsPerRow = 5;
export const DomainViewDomainMemberX = 420;
export const DomainViewWorkgroupMemberBoxWidth = 1800;

const DATA_HAS_MOVED = 'data-has-moved';
const DATA_INITIAL_VIEWBOX = 'data-initial-viewbox';
export const DATA_NETWORK_VIEW_VIEWBOX = 'data-network-view-viewbox';
export const DATA_DOMAIN_VIEW_VIEWBOX = 'data-domain-view-viewbox';
const DATA_SCALE = 'data-scale';
const DATA_MOUSE_DOWN = 'data-mouse-down';
const DATA_MACHINES_ON_HOVER = 'data-machines-on-hover';
const DATA_NETWORKS_ON_HOVER = 'data-networks-on-hover';
const DATA_CONNECTIONS_ON_HOVER = 'data-connections-on-hover';

export const initializeSVGForZoom = (
  svgId: string,
  initialViewBox: ViewBox,
  viewBoxOverridenTag: string
) => {
  const svg = document.getElementById(svgId);
  const hasMoved = svg.getAttribute(DATA_HAS_MOVED);
  if (hasMoved !== 'true') {
    let viewBoxOverriden: ViewBox = JSON.parse(
      svg.getAttribute(viewBoxOverridenTag)
    );
    viewBoxOverriden = viewBoxOverriden
      ? viewBoxOverriden
      : { x: 0, y: 0, width: 0, height: 0 };
    initialViewBox.height =
      initialViewBox.height > viewBoxOverriden.height
        ? initialViewBox.height
        : viewBoxOverriden.height;
    initialViewBox.width =
      initialViewBox.width > viewBoxOverriden.width
        ? initialViewBox.width
        : viewBoxOverriden.width;
    svg.setAttribute(DATA_INITIAL_VIEWBOX, JSON.stringify(initialViewBox));
    svg.setAttribute(
      'viewBox',
      `${initialViewBox.x} ${initialViewBox.y} ${initialViewBox.width} ${initialViewBox.height}`
    );
    svg.setAttribute(DATA_SCALE, '1');
  }
};

export const zoom = (event: WheelEvent, svgId: string) => {
  event.preventDefault();
  const viewBox = getViewBox(svgId);
  const svg = document.getElementById(svgId);
  svg.setAttribute(DATA_HAS_MOVED, 'true');
  const initialViewBox = JSON.parse(
    svg.getAttribute(DATA_INITIAL_VIEWBOX)
  ) as ViewBox;
  const mx = event.offsetX;
  const my = event.offsetY;
  const dw = viewBox.width * Math.sign(event.deltaY * -1) * 0.05;
  const dh = viewBox.height * Math.sign(event.deltaY * -1) * 0.05;
  const dx = (dw * mx) / initialViewBox.width;
  const dy = (dh * my) / initialViewBox.height;
  const newViewBox = {
    x: viewBox.x + dx,
    y: viewBox.y + dy,
    width: viewBox.width - dw,
    height: viewBox.height - dh,
  };
  const scale = initialViewBox.width / viewBox.width;
  svg.setAttribute(DATA_SCALE, `${scale}`);
  setViewBox(newViewBox, svgId);
};

export const onMouseDown = (svgId: string) => {
  document.getElementById(svgId).setAttribute(DATA_MOUSE_DOWN, 'true');
};

export const onMouseUp = (svgId: string) => {
  document.getElementById(svgId).setAttribute(DATA_MOUSE_DOWN, 'false');
};

export const pan = (event: MouseEvent, svgId: string) => {
  const svg = document.getElementById(svgId);
  if (svg.getAttribute(DATA_MOUSE_DOWN) === 'true') {
    event.preventDefault();
    event.stopPropagation();
    svg.setAttribute(DATA_HAS_MOVED, 'true');
    const viewBox = getViewBox(svgId);
    const newViewBox = {
      x: viewBox.x - event.movementX,
      y: viewBox.y - event.movementY,
      width: viewBox.width,
      height: viewBox.height,
    };
    setViewBox(newViewBox, svgId);
  }
};

export const initializePan = (element: SVGSVGElement, containerId: string) => {
  element?.addEventListener('mousemove', (e) => pan(e, containerId));
  element?.addEventListener('mousedown', () => onMouseDown(containerId));
  element?.addEventListener('mouseup', () => onMouseUp(containerId));
  element?.addEventListener('mouseleave', () => onMouseUp(containerId));
};

export const removePan = (element: SVGSVGElement, containerId: string) => {
  element?.removeEventListener('mousemove', (e) => pan(e, containerId));
  element?.removeEventListener('mousedown', () => onMouseDown(containerId));
  element?.removeEventListener('mouseup', () => onMouseUp(containerId));
  element?.removeEventListener('mouseleave', () => onMouseUp(containerId));
};

export const initializeZoom = (element: SVGSVGElement, containerId: string) => {
  element?.addEventListener('wheel', (e) => zoom(e, containerId));
};

export const removeZoom = (element: SVGSVGElement, containerId: string) => {
  element?.removeEventListener('wheel', (e) => zoom(e, containerId));
};

export const getViewBox = (svgId: string) => {
  const viewBox = document
    .getElementById(svgId)
    .getAttribute('viewBox')
    ?.split(' ');
  return {
    x: parseFloat(viewBox?.length > 0 ? viewBox[0] : '0'),
    y: parseFloat(viewBox?.length > 0 ? viewBox[1] : '0'),
    width: parseFloat(viewBox?.length > 0 ? viewBox[2] : '0'),
    height: parseFloat(viewBox?.length > 0 ? viewBox[3] : '0'),
  };
};

export const setViewBox = (viewBox: ViewBox, svgId: string) => {
  document
    .getElementById(svgId)
    .setAttribute(
      'viewBox',
      `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
    );
};

export const getVMId = (name: string) => `SVG-VM-${name}`;
export const getVNId = (name: string) => `SVG-VN-${name}`;
export const getConnectionId = (
  vmId: string,
  vnId: string,
  connectionNumber: number
) => `${vmId}-connected-to-${vnId}-${connectionNumber}`;

export const initialConfigurationNetworkView = (
  vms: AzureVirtualMachineDto[] | AzureVirtualMachineForCreationDto[],
  subnets: string[],
  canvasId: string
) => {
  // display machines in order of least to most NICs
  const sortedByNicCount = [...vms].sort(
    (a, b) =>
      a.Nics.length -
      b.Nics.length -
      (a.Nics[0].SubnetName === b.Nics[0].SubnetName ? 0 : 1)
  );
  const canvasContainer = document.getElementById(canvasId);
  let vmy = 0;
  let greatestX = 0;
  for (let i = 0; i < sortedByNicCount.length; i++) {
    const vm = document.getElementById(
      getVMId(sortedByNicCount[i].ComputerName)
    );
    const vmx =
      (i % NetworkViewNumberVMsPerRow) * (VMPadding + VMWidth) + VMPadding;
    greatestX = vmx > greatestX ? vmx : greatestX;
    vmy =
      Math.trunc(i / NetworkViewNumberVMsPerRow) * (VMHeight + VMPadding) +
      VMPadding;
    vm.setAttribute('x', `${vmx}`);
    vm.setAttribute('y', `${vmy}`);
  }

  greatestX = greatestX + (VMPadding + VMWidth);
  let vny = vmy;
  for (let i = 0; i < subnets.length; i++) {
    const subnet = document.getElementById(getVNId(subnets[i]));
    const vnx =
      (i % NetworkViewNumberVNsPerRow) * (VNPadding + VNWidth) + VNPadding;
    vny =
      Math.trunc(i / NetworkViewNumberVNsPerRow) * (VNHeight + VNPadding) +
      VNPadding +
      vmy +
      VMHeight +
      (i % NetworkViewNumberVNsPerRow) * VNHeight;
    greatestX = vnx > greatestX ? vnx : greatestX;
    subnet.setAttribute('x', `${vnx}`);
    subnet.setAttribute('y', `${vny}`);
    window.dispatchEvent(new Event(`${getVNId(subnets[i])}-move`));
  }

  const maxY = vny + 2 * VNHeight + VNPadding;
  const newViewBox: ViewBox = {
    x: 0,
    y: 0,
    width:
      canvasContainer.clientWidth < greatestX
        ? greatestX
        : canvasContainer.clientWidth,
    height:
      canvasContainer.clientHeight < maxY ? maxY : canvasContainer.clientHeight,
  };
  setViewBox(newViewBox, canvasId);
  canvasContainer.setAttribute(
    DATA_NETWORK_VIEW_VIEWBOX,
    JSON.stringify(newViewBox)
  );
  return;
};

export const initialConfigurationDomainView = (
  canvasId: string,
  x: number,
  y: number
) => {
  const canvasContainer = document.getElementById(canvasId);
  const newViewBox: ViewBox = {
    x: 0,
    y: 0,
    width: canvasContainer.clientWidth < x ? x : canvasContainer.clientWidth,
    height: canvasContainer.clientHeight < y ? y : canvasContainer.clientHeight,
  };
  setViewBox(newViewBox, canvasId);
  canvasContainer.setAttribute(
    DATA_DOMAIN_VIEW_VIEWBOX,
    JSON.stringify(newViewBox)
  );
};

const onHoverHighlightNetwork = (event: MouseEvent) => {
  const networkELement = event.currentTarget as HTMLElement;
  let networkMachines = JSON.parse(
    networkELement.getAttribute(DATA_MACHINES_ON_HOVER)
  ) as string[];
  networkMachines = networkMachines ? networkMachines : [];
  let subnets = JSON.parse(
    networkELement.getAttribute(DATA_NETWORKS_ON_HOVER)
  ) as string[];
  subnets = subnets ? subnets : [];
  for (let i = 0; i < subnets.length; i++) {
    const element = document.getElementById(subnets[i]);
    let machines = JSON.parse(
      element.getAttribute(DATA_MACHINES_ON_HOVER)
    ) as string[];
    let connections = JSON.parse(
      element.getAttribute(DATA_CONNECTIONS_ON_HOVER)
    ) as string[];
    machines = machines ? machines : [];
    connections = connections ? connections : [];

    // dim each machine
    machines.forEach((m) => {
      document.getElementById(m).classList.add('dim');
    });

    // dim each connection line
    connections.forEach((c) => {
      document.getElementById(c).classList.add('hide-line');
    });

    // dim subnet
    element.classList.add('dim');
  }

  // if any machines on the current subnet are connected to other subnets, they may have been dimmed so remove
  for (let i = 0; i < networkMachines.length; i++) {
    document.getElementById(networkMachines[i]).classList.remove('dim');
  }
};

const onMouseOutRemoveHighlights = () => {
  const elements = document.querySelectorAll('.dim');
  const connections = document.querySelectorAll('.hide-line');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove('dim');
  }
  for (let i = 0; i < connections.length; i++) {
    connections[i].classList.remove('hide-line');
  }
};

export const setOnHoverHighlightNetwork = (
  vms: AzureVirtualMachineDto[] | AzureVirtualMachineForCreationDto[],
  subnets: string[]
) => {
  for (let i = 0; i < subnets.length; i++) {
    const vmIds: string[] = [];
    const connectionIds: string[] = [];
    for (let v = 0; v < vms.length; v++) {
      if (vms[v].Nics.some((n) => n.SubnetName === subnets[i])) {
        vmIds.push(getVMId(vms[v].ComputerName));
        for (let g = 0; g < vms[v].Nics.length; g++) {
          if (vms[v].Nics[g].SubnetName === subnets[i]) {
            connectionIds.push(
              getConnectionId(
                getVMId(vms[v].ComputerName),
                getVNId(subnets[i]),
                g
              )
            );
          }
        }
      }
    }

    const network = document.getElementById(getVNId(subnets[i]));
    network.setAttribute(DATA_MACHINES_ON_HOVER, JSON.stringify(vmIds));
    network.setAttribute(
      DATA_CONNECTIONS_ON_HOVER,
      JSON.stringify(connectionIds)
    );
    network.setAttribute(
      DATA_NETWORKS_ON_HOVER,
      JSON.stringify(
        subnets
          .map((s) => getVNId(s))
          .filter((sn) => sn !== getVNId(subnets[i]))
      )
    );
    network.addEventListener('mouseenter', onHoverHighlightNetwork);
    network.addEventListener('mouseleave', onMouseOutRemoveHighlights);
  }
};

export const removeOnHoverHighlightNetwork = (subnets: string[]) => {
  for (let i = 0; i < subnets.length; i++) {
    const network = document.getElementById(getVNId(subnets[i]));
    network?.removeEventListener('mouseenter', onHoverHighlightNetwork);
    network?.removeEventListener('mouseleave', onHoverHighlightNetwork);
  }
};
