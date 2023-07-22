"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatValidationErrors;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function formatValidationErrors(e) {
  var errorObj = {
    errors: []
  };

  for (var error in e.errors) {
    var _e$errors$error = e.errors[error],
        path = _e$errors$error.path,
        message = _e$errors$error.message;
    errorObj.errors.push(_defineProperty({}, path, message));
  }

  return errors;
}

module.exports = exports.default;