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
    ["input", "keydown", "keyup", "mousedown", "mouseup", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
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
    ["change", "focusout", "keyup"].forEach(function(event) {
        textbox.addEventListener(event, function() {
            this.value = numberWithCommas(this.value);
        });
    });
    /// set commas after keyup to a number 
    textbox.addEventListener("keyup", function(e){
        let keyCode = e.which ? e.which : e.keyCode
        let ret = (keyCode >= 48 && keyCode <= 57);
        /// if keycode is a number
        if(ret){
            this.value = numberWithCommas(this.value);
        }
    });
}
/**
 * Set a listener for color in input range for Edge
 * @param {Array} sliders Array of sliders object: class, min, max
 */
function setSliderListeners(sliders){
    sliders.forEach(function(slider){
        for (let e of document.querySelectorAll('input[type="range"].slider' + slider.class)) {
            e.style.setProperty('--value', e.value);
            e.style.setProperty('--min', e.min == '' ? slider.min : e.min);
            e.style.setProperty('--max', e.max == '' ? slider.max : e.max);
            e.addEventListener('input', function(){
                e.style.setProperty('--value', e.value);
                document.querySelector(slider.class + "--value").value = e.value;
            });
        }
    });
}
/**
 * Check if the inputs have something. Then do the calculations
 * @returns void
 */
function calculate(){
    // get input range values
    let interestRate = document.querySelector(".slider--rate--value").value;
    let yearsOfMortgage = document.querySelector(".slider--years--value").value;
    // get input text values
    let loanAmount = document.querySelector(".input__text--load").value.replace(/,/g, '');
    let annualTax = document.querySelector(".input__text--tax").value.replace(/,/g, '');
    let annualInsurance = document.querySelector(".input__text--insurance").value.replace(/,/g, '');

    // Simple validation
    let error = false;
    let elements = document.querySelectorAll(".has-error");
    console.log(elements);
    for(let element of elements){
        element.classList.remove("has-error");
        console.log(element);
    }
    if (loanAmount === ''){
        error = true;
        document.querySelector(".input__text--load").closest(".input__text").classList.add("has-error");
    }
    if (annualTax === ''){
        error = true;
        document.querySelector(".input__text--tax").closest(".input__text").classList.add("has-error");
    }
    if (annualInsurance === ''){
        error = true;
        document.querySelector(".input__text--insurance").closest(".input__text").classList.add("has-error");
    }
    /// if it has an error return
    if (error){
        return;
    }

    let principleAndInterests = ((interestRate / 100) / 12)* loanAmount / (1-Math.pow((1 + ((interestRate / 100)/12)),
    -yearsOfMortgage*12));
    let tax = annualTax / 12;
    let insurance = annualInsurance / 12;
    let monthlyPayment = principleAndInterests + tax + insurance;

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
let sliders = [
    {
        class: '.slider--years',
        min: '1',
        max: '40'
    }, {
        class: '.slider--rate',
        min: '0.1',
        max: '10'
    }
];

/// set the listeners in the input range
setSliderListeners(sliders);
// set the filter for numbers in input text
setInputFilter(document.querySelector(".input__text--load"));
setInputFilter(document.querySelector(".input__text--tax"));
setInputFilter(document.querySelector(".input__text--insurance"));