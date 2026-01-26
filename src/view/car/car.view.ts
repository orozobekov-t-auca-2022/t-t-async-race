import { createElement } from '../../utils/dom';
import { createButton } from '../../components/button.component';
import styles from './styles.module.css';
import type { Car } from '../../models/car.model';

export function createCarView(car: Car): HTMLDivElement {
  const carContainer = createElement('div');
  carContainer.className = styles['car-item'];
  carContainer.dataset.carId = String(car.id);

  const carControls = createElement('div');
  carControls.className = styles['car-controls'];

  const selectButton = createButton({ text: 'Select' });
  selectButton.className = `${styles['car-btn']} ${styles['car-btn--select']}`;
  selectButton.dataset.action = 'select';

  const deleteButton = createButton({ text: 'Delete' });
  deleteButton.className = `${styles['car-btn']} ${styles['car-btn--delete']}`;
  deleteButton.dataset.action = 'delete';

  const carName = createElement('span');
  carName.className = styles['car-name'];
  carName.textContent = car.name;

  carControls.append(selectButton, deleteButton, carName);

  const raceSection = createElement('div');
  raceSection.className = styles['race-section'];

  const startButton = createButton({ text: 'A' });
  startButton.className = `${styles['car-btn']} ${styles['car-btn--start']}`;
  startButton.dataset.action = 'start';
  startButton.id = `start-button`;

  const stopButton = createButton({ text: 'B' });
  stopButton.className = `${styles['car-btn']} ${styles['car-btn--stop']}`;
  stopButton.dataset.action = 'stop';
  stopButton.disabled = true;
  stopButton.id = `stop-button`;
  raceSection.append(startButton, stopButton);

  const roadSection = createElement('div');
  const carRoad = createElement('div');
  carRoad.className = styles['car-road'];

  const carPreview = createElement('div');
  carPreview.className = styles['car-preview'];
  carPreview.dataset.carElement = 'true';

  const carSvg = createCarSVG(car.color);
  carPreview.append(carSvg);

  const flagPreview = createElement('div');
  flagPreview.className = styles['flag-preview'];
  const flagSvg = createFlagSVG(car.color);
  flagPreview.append(flagSvg);

  carRoad.append(carPreview, flagPreview);

  const dottedRoad = createElement('div');
  dottedRoad.className = styles['dotted-road'];

  roadSection.append(carRoad, dottedRoad);

  carContainer.append(carControls, raceSection, roadSection);

  return carContainer;
}

export function createCarSVG(color: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('fill', color);
  svg.setAttribute('viewBox', '0 0 324.018 324.017');

  svg.innerHTML = `
    <g>
      <g>
        <path d="M317.833,197.111c3.346-11.148,2.455-20.541-2.65-27.945c-9.715-14.064-31.308-15.864-35.43-16.076l-8.077-4.352
          l-0.528-0.217c-8.969-2.561-42.745-3.591-47.805-3.733c-7.979-3.936-14.607-7.62-20.475-10.879
          c-20.536-11.413-34.107-18.958-72.959-18.958c-47.049,0-85.447,20.395-90.597,23.25c-2.812,0.212-5.297,0.404-7.646,0.59
          l-6.455-8.733l7.34,0.774c2.91,0.306,4.267-1.243,3.031-3.459c-1.24-2.216-4.603-4.262-7.519-4.57l-23.951-2.524
          c-2.91-0.305-4.267,1.243-3.026,3.459c1.24,2.216,4.603,4.262,7.519,4.57l3.679,0.386l8.166,11.05
          c-13.823,1.315-13.823,2.139-13.823,4.371c0,18.331-2.343,22.556-2.832,23.369L0,164.443v19.019l2.248,2.89
          c-0.088,2.775,0.823,5.323,2.674,7.431c5.981,6.804,19.713,7.001,21.256,7.001c4.634,0,14.211-2.366,20.78-4.153
          c-0.456-0.781-0.927-1.553-1.3-2.392c-0.36-0.809-0.603-1.668-0.885-2.517c-0.811-2.485-1.362-5.096-1.362-7.845
          c0-14.074,11.449-25.516,25.515-25.516s25.52,11.446,25.52,25.521c0,6.068-2.221,11.578-5.773,15.964
          c-0.753,0.927-1.527,1.828-2.397,2.641c-1.022,0.958-2.089,1.859-3.254,2.641c29.332,0.109,112.164,0.514,168.708,1.771
          c-0.828-0.823-1.533-1.771-2.237-2.703c-0.652-0.854-1.222-1.75-1.761-2.688c-2.164-3.744-3.5-8.025-3.5-12.655
          c0-14.069,11.454-25.513,25.518-25.513c14.064,0,25.518,11.449,25.518,25.513c0,5.126-1.553,9.875-4.152,13.878
          c-0.605,0.922-1.326,1.755-2.04,2.594c-0.782,0.922-1.616,1.781-2.527,2.584c5.209,0.155,9.699,0.232,13.546,0.232
          c19.563,0,23.385-1.688,23.861-5.018C324.114,202.108,324.472,199.602,317.833,197.111z"/>
        <path d="M52.17,195.175c3.638,5.379,9.794,8.922,16.756,8.922c0.228,0,0.44-0.062,0.663-0.073c2.576-0.083,5.043-0.61,7.291-1.574
          c1.574-0.678,2.996-1.6,4.332-2.636c4.782-3.702,7.927-9.429,7.927-15.933c0-11.144-9.066-20.216-20.212-20.216
          s-20.213,9.072-20.213,20.216c0,2.263,0.461,4.411,1.149,6.446c0.288,0.85,0.616,1.673,1.015,2.471
          C51.279,193.606,51.667,194.434,52.17,195.175z"/>
        <path d="M269.755,209.068c2.656,0,5.173-0.549,7.503-1.481c1.589-0.642,3.06-1.491,4.422-2.495
          c1.035-0.767,1.988-1.616,2.863-2.559c3.34-3.604,5.432-8.389,5.432-13.681c0-11.144-9.071-20.21-20.215-20.21
          s-20.216,9.066-20.216,20.21c0,4.878,1.812,9.3,4.702,12.801c0.818,0.989,1.719,1.89,2.708,2.713
          c1.311,1.088,2.729,2.024,4.293,2.755C263.836,208.333,266.704,209.068,269.755,209.068z"/>
      </g>
    </g>
  `;
  return svg;
}

function createFlagSVG(color: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 300.344 300.344');
  svg.setAttribute('fill', color);
  svg.innerHTML = `
    <g>
      <path d="M289.286,28.36c-6.773-3.386-14.885-2.655-20.945,1.892c-23.387,17.547-46.014,10.395-80.992-2.728
        c-34.281-12.859-76.942-28.861-119.047,2.728c-5.034,3.777-7.997,9.704-7.997,15.998v119.112c0,7.576,4.281,14.502,11.058,17.89
        s14.887,2.654,20.945-1.892c23.387-17.547,46.014-10.395,80.992,2.728c19.513,7.319,41.739,15.657,65.034,15.657
        c17.631,0,35.874-4.776,54.013-18.385c5.034-3.777,7.997-9.704,7.997-15.998V46.25C300.344,38.674,296.063,31.748,289.286,28.36z"/>
      <path d="M20,7.819c-11.046,0-20,8.954-20,20v244.705c0,11.046,8.954,20,20,20s20-8.954,20-20V27.819
        C40,16.773,31.046,7.819,20,7.819z"/>
    </g>
  `;
  return svg;
}
