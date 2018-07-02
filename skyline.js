const DefaultColorShade = 3;

class Skyline {

	constructor ( target, width, height, baseColor, delay ) {

		this.target = target;
		this.width = width || 1280;
		this.height = height || 720;
		this.baseColor = baseColor || DefaultColorShade;
		this.delay = delay || 500;

		this.widthParams = this.calcWidth( this.width );
		this.heightParams = this.calcHeight( this.height );
		this.colorParams = this.calcColor( this.baseColor );

		this.leftPosition = 0;

		this.isInterrupted = false;

		this.init();
	}

	getColors () {
		return [ 
			"#000000",
			"#7B7D7D", 
			"#4D5656", 
			"#424949", 
			"#808080", 
		];
	}

	getColor ( shade ) {
		shade = shade || DefaultColorShade;
		return this.getColors()[ ( shade - 1 ) ];
	}


	init () {
		this.target.style.width = this.width;
		this.target.style.height = this.height;
		this.target.style.backgroundColor = this.calcBackgroundColor();
	}

	calcBackgroundColor () {

		const Hours = new Date().getHours();

		if ( Hours >= 5 && Hours <= 8 ) {
			console.info( "Early Morning - Morning" );
			return "#6696ba";
		} else if ( Hours >= 9 && Hours <= 14 ) {
			console.info( "Morning - After Noon" );
			return "#e2e38b";
		} else if ( Hours >= 15 && Hours <= 18 ) {
			console.info( "After Noon - Night" );
			return "#e7a553";
		} else if ( Hours >= 19 && Hours <= 21 ) {
			console.info( "Evening - Night" );
			return "#7e4b68";
		} else if ( Hours >= 22 || Hours <= 4 ) {
			console.info( "Night - Early Morning" );
			return "#292965";
		}

		return "#ffffff";
	}



	buildingTemplate ( width, height, color, left ) { 
		return `
			<div class="building" style="width: ${ width }px; height: ${ height }px; background-color: ${ color }; left: ${ left }px"></div>
		`;
	}

	drawBuilding ( width, height, color, left ) {
		if ( ( this.leftPosition + width ) <= this.width ) {
			console.info( `Drawing a building of ${ width }px Width, ${ height }px Height & with ${ color } color` );
			this.target.innerHTML = this.target.innerHTML + this.buildingTemplate( width, height, color, this.leftPosition );
		}
		this.leftPosition = this.leftPosition + width;
	}


	fetchRandom ( min, max ) {

		min = ( min < 0 ) ? 0 : min;

		const URL = `https://www.random.org/integers/?num=1&min=${ min }&max=${ max }&col=1&base=10&format=plain&rnd=new`;

		return fetch( URL )
			.then( response => {
				return response.text();
			})
			.then( number => {
				return parseInt( number );
			})
		;
	}

	calcWidth ( width ) {
		return {
			min: Math.ceil( ( width * 1 ) / 100 ),
			max: Math.ceil( ( width * 1 ) / 20 ),
		}
	}

	calcHeight ( height ) {
		return {
			min: Math.ceil( ( height * 1 ) / 5 ),
			max: Math.ceil( ( height * 9 ) / 10 ),
		}
	}

	calcColor ( colorScale ) {
		colorScale = parseInt( colorScale );
		const Ratio = parseInt( Math.ceil( ( colorScale * 1 ) / 10 ) );
		return {
			min: ( colorScale - Ratio ),
			max: ( colorScale + Ratio ),
		}
	}


	getColorShade ( color, percent ) {

	    let R = parseInt( color.substring( 1, 3 ), 16 );
	    let G = parseInt( color.substring( 3, 5 ), 16 );
	    let B = parseInt( color.substring( 5, 7 ), 16 );

	    R = parseInt( R * ( 100 + percent ) / 100 );
	    G = parseInt( G * ( 100 + percent ) / 100 );
	    B = parseInt( B * ( 100 + percent ) / 100 );

	    R = ( R < 255 ) ? R : 255;  
	    G = ( G < 255 ) ? G : 255;  
	    B = ( B < 255 ) ? B : 255;  

	    const RR = ( ( R.toString( 16 ).length === 1 ) ? "0" + R.toString( 16 ) : R.toString( 16 ) );
	    const GG = ( ( G.toString( 16 ).length === 1 ) ? "0" + G.toString( 16 ) : G.toString( 16 ) );
	    const BB = ( ( B.toString( 16 ).length === 1 ) ? "0" + B.toString( 16 ) : B.toString( 16 ) );

	    return `#${ RR }${ GG }${ BB }`;
	}






	getBuilding () {
		return Promise.all([
			this.fetchRandom( this.widthParams.min, this.widthParams.max ),
			this.fetchRandom( this.heightParams.min, this.heightParams.max ),
			this.fetchRandom( this.colorParams.min, this.colorParams.max ),
		])
			.then( ( [ width, height, color ] ) => {
				return { width, height, color };
			})
		;
	}


	drawOneBuilding () {
		return this.getBuilding()
			.then( attributes => {
				this.drawBuilding( attributes.width, attributes.height, this.getColorShade( this.getColor( this.baseColor ), attributes.color ) );
				return attributes;
			}, () => {
				console.error( "Error while calling the REST API" );
			})
		;
	}



	draw () {
		if ( this.leftPosition > this.width ) {
			console.info( "Skyline printing is completed" );
			return;
		}
		this.drawOneBuilding().then( attributes => {
			if ( !( this.isInterrupted ) && this.leftPosition <= this.width ) {
				setTimeout( () => {
					this.draw();
				}, this.delay );
			} else {
				console.info( "Skyline printing is completed" );
			}
		});
	}


	paint () {
		console.info( "Skyline printing is started" );
		this.isInterrupted = false;
		this.draw();
	}

	interrupt () {
		this.isInterrupted = true;
		console.info( "Skyline printing is Interrupted" );
	}
}

window.Skyline = Skyline;
