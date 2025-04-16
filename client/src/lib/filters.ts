// Import ban icon for "none" background option
import banIconPath from '../assets/ban-icon.svg';
import flowerIconPath from '../assets/flower-icon.svg';
import heartIconPath from '../assets/heart-icon.svg';

export const filterOptions = [
  {
    id: 'normal',
    name: 'Normal',
    previewClass: '',
    cssFilter: '',
  },
  {
    id: 'bw',
    name: 'N&B',
    previewClass: 'grayscale',
    cssFilter: 'grayscale(100%)',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    previewClass: 'sepia',
    cssFilter: 'sepia(90%)',
  },
];
