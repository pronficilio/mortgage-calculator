"use strict";

/**
 * Given a string or number, return the value with comma separators.
 * @param {String|Number} x Value to add comma separators
 * @returns A string number with comma separators
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
/**
 * Given an input and a regex filter, listeners are set to prevent unexpected characters
 * @param {Object} textbox HTML input text element
 */
function setInputFilter(textbox) {
    /// set a listener for each one of these events
    ["input", "keydown", "keyup", "mousedown", "mouseup", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            // if it is a valid numeric string
            if (/^-?\d*$/.test(this.value)) {
                this.oldValue = this.value;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
            } else {
                this.value = "";
            }
        });
    });
    /// set commas after change, focusout and keyup events
    ["change", "focusout", "keyup"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            this.value = numberWithCommas(this.value);
        });
    });
    /// set commas after keyup to a number 
    textbox.addEventListener("keyup", function (e) {
        var keyCode = e.which ? e.which : e.keyCode;
        var ret = keyCode >= 48 && keyCode <= 57;
        /// if keycode is a number
        if (ret) {
            this.value = numberWithCommas(this.value);
        }
    });
}
/**
 * Set a listener for color in input range for Edge
 * @param {Array} sliders Array of sliders object: class, min, max
 */
function setSliderListeners(sliders) {
    sliders.forEach(function (slider) {
        var _loop = function _loop(e) {
            e.style.setProperty('--value', e.value);
            e.style.setProperty('--min', e.min == '' ? slider.min : e.min);
            e.style.setProperty('--max', e.max == '' ? slider.max : e.max);
            e.addEventListener('input', function () {
                e.style.setProperty('--value', e.value);
                document.querySelector(slider.class + "--value").value = e.value;
            });
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = document.querySelectorAll('input[type="range"].slider' + slider.class)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var e = _step.value;

                _loop(e);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    });
}
/**
 * Check if the inputs have something. Then do the calculations
 * @returns void
 */
function calculate() {
    // get input range values
    var interestRate = document.querySelector(".slider--rate--value").value;
    var yearsOfMortgage = document.querySelector(".slider--years--value").value;
    // get input text values
    var loanAmount = document.querySelector(".input__text--load").value.replace(/,/g, '');
    var annualTax = document.querySelector(".input__text--tax").value.replace(/,/g, '');
    var annualInsurance = document.querySelector(".input__text--insurance").value.replace(/,/g, '');

    // Simple validation
    var error = false;
    var elements = document.querySelectorAll(".has-error");
    console.log(elements);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var element = _step2.value;

            element.classList.remove("has-error");
            console.log(element);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    if (loanAmount === '') {
        error = true;
        document.querySelector(".input__text--load").closest(".input__text").classList.add("has-error");
    }
    if (annualTax === '') {
        error = true;
        document.querySelector(".input__text--tax").closest(".input__text").classList.add("has-error");
    }
    if (annualInsurance === '') {
        error = true;
        document.querySelector(".input__text--insurance").closest(".input__text").classList.add("has-error");
    }
    /// if it has an error return
    if (error) {
        return;
    }

    var principleAndInterests = interestRate / 100 / 12 * loanAmount / (1 - Math.pow(1 + interestRate / 100 / 12, -yearsOfMortgage * 12));
    var tax = annualTax / 12;
    var insurance = annualInsurance / 12;
    var monthlyPayment = principleAndInterests + tax + insurance;

    document.querySelector(".output--result--principal").innerHTML = "$ " + numberWithCommas(principleAndInterests.toFixed(2));
    document.querySelector(".output--result--principal").classList.add("calculated");

    document.querySelector(".output--result--tax").innerHTML = "$ " + numberWithCommas(tax.toFixed(2));
    document.querySelector(".output--result--tax").classList.add("calculated");

    document.querySelector(".output--result--insurance").innerHTML = "$ " + numberWithCommas(insurance.toFixed(2));
    document.querySelector(".output--result--insurance").classList.add("calculated");

    document.querySelector(".output--result--total").innerHTML = "$ " + numberWithCommas(monthlyPayment.toFixed(2));
    document.querySelector(".output--result--total").classList.add("calculated");
    // add class to show in mobile version
    document.querySelector(".aside").classList.add("calculated");
}

/**
 * Set an array for the input range style functionality
 * @type {Array} class, min and max, where class is the querySelector, min and max are the limits of the input range
 */
var sliders = [{
    class: '.slider--years',
    min: '1',
    max: '40'
}, {
    class: '.slider--rate',
    min: '0.1',
    max: '10'
}];

/// set the listeners in the input range
setSliderListeners(sliders);
// set the filter for numbers in input text
setInputFilter(document.querySelector(".input__text--load"));
setInputFilter(document.querySelector(".input__text--tax"));
setInputFilter(document.querySelector(".input__text--insurance"));