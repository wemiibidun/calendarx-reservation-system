// This defines a custom object for each reservation
export function Reservation(name, date, start, end) {
  this.name = name;
  this.date = date;
  this.start = start;
  this.end = end;
}

// Prototypal Inheritance used to calculate the duration reservation in hours
Reservation.prototype.duration = function () {
  return this.end - this.start;
};

//Return a formatted time range string
Reservation.prototype.getTimeRange = function () {
  return `${this.start}:00–${this.end}:00`;
};

//String representation for debugging
Reservation.prototype.toString = function () {
  return `${this.name} reserved on ${this.date} from ${this.getTimeRange()}`;
};
