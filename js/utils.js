/**
 * Extends the Array prototype to include a 'countBy' method.
 * Groups and counts items based on the result of a callback function.
 */

Array.prototype.countBy = function (keyFn) {
  const res = {};
  this.forEach(item => {
    const key = keyFn(item);
    res[key] = (res[key] || 0) + 1;
  });
  return res;
};

// Define a set of Bootstrap color names to rotate through
const bootstrapColors = [
  'primary', 'success', 'warning', 'danger', 'info', 'secondary'
];


// Keeps track of which color is assigned to which name
const userColorMap = {};
let colorIndex = 0;

export function getBootstrapColorForName(name) {
  if (!userColorMap[name]) {
    userColorMap[name] = bootstrapColors[colorIndex % bootstrapColors.length];
    colorIndex++;
  }
  return userColorMap[name];
}

// Maps Bootstrap color names to actual HEX color values for chart usage
export const bootstrapColorHexMap = {
  primary: '#0d6efd',
  success: '#198754',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#0dcaf0',
  secondary: '#6c757d',
};
