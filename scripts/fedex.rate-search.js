var length, width, height, dimFactor, truWeightKg; //doubles
var calcWeight, truWeightLbs, rate; //html elements
var isBlended;

function formSubmit() {
  length = document.getElementById("length").value;
  width = document.getElementById("width").value;
  height = document.getElementById("height").value;
  dimFactor = parseInt(document.getElementById("dimFac").value);
  truWeightKg = document.getElementById("truWeight").value;
  //fill variable with empty html elements
  calcWeight = document.getElementById("calcWeight");
  truWeightLbs = document.getElementById("truWeightLbs");
  rate = document.getElementById("rate");
  //check Blended or CA Only
  if (document.getElementById("ca").checked == true) {
    isBlended = false;
  } else {
    isBlended = true;
  }
  //get and display parameters to calculate ground rate
  getWeight();
  getTruWeightLbs();
  //get and display ground rate
  getRate(calcWeight.innerHTML, truWeightLbs.innerHTML);
  //handle exceptions
  if (calcWeight.innerHTML == '0.00') calcWeight.innerHTML = "Dimensions not filled or too short.";
  if (truWeightKg == 0.0) truWeightLbs.innerHTML = "Weight not filled.";
  if ((calcWeight.innerHTML == '0.00' || truWeightKg == 0) && rate.innerHTML == '$Oversized') {
    rate.innerHTML = "Fill in missing parameters.";
  } else if (rate.innerHTML == '$Oversized') {
    rate.innerHTML = rate.innerHTML.substring(1);
  }
}

function getWeight() {
  calcWeight.innerHTML = roundNum((length * 0.3937007874) * (width * 0.3937007874) * (height * 0.3937007874) / dimFactor, 2).toFixed(2);
}

function getTruWeightLbs() {
  truWeightLbs.innerHTML = roundNum(truWeightKg * 2.2046, 2).toFixed(2);
}

function rateSearch(aWeight) {
  for (var r = 1; r < RateTable.length + 1; r++) {
    if (RateTable[r - 1][0] == aWeight) {
      if (isBlended == false) {
        return (RateTable[r - 1][1] * 1.2).toFixed(2);
      }
      return RateTable[r - 1][1].toFixed(2);
    }
  }
  return "Oversized";
}

//calcWeight: weight calculated by inputing Dimensions
//truWeight: weight directly inputed by user aka. Gross Weight
function getRate(calcWeight, truWeight) {
  if (parseFloat(calcWeight) < parseFloat(truWeight)) {
    rate.innerHTML = '$' + rateSearch(Math.ceil(truWeight));
  } else {
    rate.innerHTML = '$' + rateSearch(Math.ceil(calcWeight));
  }
}

//Precise number rounding copied from Stack Overflow
function roundNum(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}
