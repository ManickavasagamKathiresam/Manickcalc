const buttonWrap = document.getElementById("buttonWrap");
const displayScreen = document.getElementById("displayScreen");
const btnOnOff = document.getElementById("btnOnOff");
const allBtns = document.querySelectorAll(".calculator-btn");

let isCalculatorOn = true;

let numbers = "0123456789";

let mathOperators = "-+*/";

//stores all the symbols that user sees on the calculator display
let currentMathExpression = "";

//will be using this to check if there's already a . in our number sequence
let currentSequence = "";

let previousSymbol = "";

btnOnOff.addEventListener("click", () => {
	//on click toggle calculator on/off animation
	if (allBtns[0].classList.contains("calculator-btn")) {
		allBtns.forEach((btn) => {
			btn.classList.remove("calculator-btn");
			btn.classList.add("box-shadow-none");
		});
		displayScreen.classList.remove("display-screen");
		displayScreen.classList.add("box-shadow-none-display-screen");
	} else {
		allBtns.forEach((btn) => {
			btn.classList.add("calculator-btn");
			btn.classList.remove("box-shadow-none");
			displayScreen.classList.add("display-screen");
			displayScreen.classList.remove("box-shadow-none-display-screen");
		});
	}
	//on click toggle calculator state
	if (isCalculatorOn) {
		displayScreen.innerText = "";

		currentSequence = "";
		currentMathExpression = "";
		previousSymbol = "";
		isCalculatorOn = false;
	} else {
		isCalculatorOn = true;
	}
});

///////////////////Pretty much all logic for what happens when a user clicks buttons on the calculator///////////////////
buttonWrap.addEventListener("click", (e) => {
	if (isCalculatorOn) {
		let pressedSymbol = e.target.innerText;

		//display update function
		function updateDisplay() {
			currentSequence += pressedSymbol;
			currentMathExpression += pressedSymbol;
			displayScreen.innerText = currentMathExpression;
		}

		//if the pressed symbol is a number or a math operator
		if (pressedSymbol.length === 1) {
			// we can only add - to the number at the beginning of the number
			if (pressedSymbol === "-" && currentMathExpression === "") {
				updateDisplay();
			}

			//we can only add . once per number and if it's not the first symbol
			else if (
				pressedSymbol === "." &&
				currentMathExpression.length >= 1 &&
				!currentSequence.includes(".")
			) {
				if (numbers.includes(previousSymbol)) {
					updateDisplay();
				}
			}

			//if the pressed button is a number
			else if (numbers.includes(pressedSymbol)) {
				updateDisplay();
			}

			//if the pressed button is a math operator and number's length is over 1.
			else if (
				mathOperators.includes(pressedSymbol) &&
				currentMathExpression.length >= 1
			) {
				//we can't add math operators to the number if the beginning of the number is - and the end of the sequence is .
				if (
					currentMathExpression !== "-" &&
					currentMathExpression[currentMathExpression.length - 1] !== "."
				) {
					if (previousSymbol !== ".") {
						//if the user presses a math operator button twice, the math operator starts changing
						if (previousSymbol !== "" && mathOperators.includes(previousSymbol)) {
							currentSequence = "";
							currentMathExpression = currentMathExpression.slice(0, -1);
							currentMathExpression += pressedSymbol;
							displayScreen.innerText = currentMathExpression;
						} else {
							currentSequence = "";
							currentMathExpression += pressedSymbol;
							displayScreen.innerText = currentMathExpression;
						}
					}
				}
			}
			//if the pressed button is =
			else if (pressedSymbol === "=") {
				if (
					numbers.includes(currentMathExpression[currentMathExpression.length - 1])
				) {
					let tempArr = turnNumStringIntoNumArr(currentMathExpression);
					currentMathExpression = calculateExpression(tempArr).toString();
					displayScreen.innerText = currentMathExpression;
					currentSequence = currentMathExpression;
				}
			}

			//if the pressed button is C
			else if (pressedSymbol === "C") {
				displayScreen.innerText = "";
				currentSequence = "";
				currentMathExpression = "";
				previousSymbol = "";
			}
		}

		//if the pressed button is Del
		else if (pressedSymbol === "Del") {
			currentMathExpression = currentMathExpression.slice(0, -1);
			displayScreen.innerText = currentMathExpression;
			currentSequence = currentSequence.slice(0, -1);
			previousSymbol = "";
		}

		//Save previous symbol value if the user pressed on the number or +-*/ operator buttons
		if (
			pressedSymbol.length === 1 &&
			pressedSymbol !== "=" &&
			pressedSymbol !== "C"
		) {
			previousSymbol = pressedSymbol;
		}
	}

	//if the calculator is turned off, exit the function
	else if (isCalculatorOn === false) {
		return;
	}
});

///////Calculator functions/////////////////

//function to turn current display value into a mathematical expression array
function turnNumStringIntoNumArr(str) {
	let tempArr = str.match(/^-\d+[\.]\d+|\d+[\.]\d+|\d+|[\+\-\*\/]/g);
	if (tempArr[0] === "-") {
		tempArr.splice(0, 2, tempArr[0] + tempArr[1]);
	}
	return tempArr;
}

//function to calculate the final value of our mathematical expression array
function calculateExpression(arr) {
	let array = arr;
	//if we have more than one value to work with
	if (array.length > 1 && array[array.length - 1] !== "") {
		//loop through the array to find and complete higher level calculations (* or /)
		for (let i = 0; i < array.length; i++) {
			if (array[i] === "/") {
				let newValue = parseFloat(array[i - 1]) / parseFloat(array[i + 1]);
				array.splice(i - 1, 3, newValue.toString());
				i = 0;
			} else if (array[i] === "*") {
				let newValue = parseFloat(array[i - 1]) * parseFloat(array[i + 1]);
				array.splice(i - 1, 3, newValue.toString());
				i = 0;
			}
		}

		//loop through the array again to add and subtract numbers
		for (let i = 0; i < array.length; i++) {
			if (array[i] === "-") {
				let newValue = parseFloat(array[i - 1]) - parseFloat(array[i + 1]);
				array.splice(i - 1, 3, newValue.toString());
				i = 0;
			} else if (array[i] === "+") {
				let newValue = parseFloat(array[i - 1]) + parseFloat(array[i + 1]);
				array.splice(i - 1, 3, newValue.toString());
				i = 0;
			}
		}
	}

	return array;
}
