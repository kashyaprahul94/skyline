
	let goButton, resetButton, widthInput, heightInput, colorInput, delayInput;

	let targetElementWrapper, infoElementWrapper;

	let targetElement, skylineInstance;



	function OnGoPressed () {
		
		infoElementWrapper.style.display = "none";
		targetElementWrapper.style.display = "block";

		PaintCanvas();
	}


	function OnResetPressed () {
		
		infoElementWrapper.style.display = "block";
		targetElementWrapper.style.display = "none";

		ResetCanvas();
	}

	function onWidthChanged () {
		const Width = widthInput.value;
		heightInput.value = Math.round( ( Width / 16 ) * 9 );
	}

	function onHeightChanged () {
		const Height = heightInput.value;
		widthInput.value = Math.round( ( Height * 16 ) / 9 );
	}



	const EmptyCanvas = () => {
		targetElement.innerHTML = "";
	}

	const InitCanvas = () => {
		EmptyCanvas();
		const color = colorInput.options[ colorInput.selectedIndex ].value;
		skylineInstance = new window.Skyline( targetElement, widthInput.value, heightInput.value, color, delayInput.value );
	}

	const ResetCanvas = () => {
		EmptyCanvas();
		skylineInstance.interrupt();
	}


	const PaintCanvas = () => {
		InitCanvas();
		skylineInstance.paint();
	}


	const Init = () => {

		infoElementWrapper = document.querySelector( "#info" );
		targetElementWrapper = document.querySelector( "#showtime" );

		goButton = document.querySelector( "#btn_go" );
		resetButton = document.querySelector( "#btn_reset" );

		widthInput = document.querySelector( "#input_width" );
		heightInput = document.querySelector( "#input_height" );
		colorInput = document.querySelector( "#input_color" );
		delayInput = document.querySelector( "#input_delay" );

		targetElement = document.querySelector( "#skyline_canvas" );
	}



	Init();
