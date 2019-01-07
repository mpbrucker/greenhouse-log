/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.DragControls = function ( object, domElement, FOV ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.mouseX = 0;
	
	this.FOVAngle = 0;
	this.prevFOVAngle = 0;
	this.deltaAngle = 0;
    
	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
    this.viewHalfY = 0;
    
    this.moveAngle = FOV / window.innerWidth;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
        event.stopPropagation();
        this.domElement.setAttribute('style', 'cursor: move;' );

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
        event.stopPropagation();
        this.domElement.setAttribute('style', 'cursor: default;' );

        this.mouseDragOn = false;
	};

	this.onMouseMove = function ( event ) {
        if ( this.domElement === document ) {
            this.mouseX = event.pageX;
        } else {
            this.mouseX = event.pageX - this.domElement.offsetLeft;
        }    
	
    };

	this.update = function ( delta ) {

		// Computes horizontal width of FOV in units
		const magicScale = 1.6; // TODO figure out why it's off by this much
		const FOVWidth = 2*(Math.sin((FOV/2)*(Math.PI/180)));
		
		// Computes cursor X pos in units from center
		const adjXPos = ((this.mouseX/window.innerWidth) * FOVWidth) - (FOVWidth/2);
		this.FOVAngle = Math.asin(adjXPos)*magicScale;
		
		if (this.mouseDragOn) {
			this.deltaAngle = (this.FOVAngle-this.prevFOVAngle)*(180/Math.PI);
		} else {
			this.deltaAngle *= 0.8;
		}

		// Update the camera direction
		this.lon -= this.deltaAngle;
		this.prevFOVAngle = this.FOVAngle;
		
		if (Math.abs(this.deltaAngle) < 0.01) {
            this.deltaAngle = 0;
        }

		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

        this.object.lookAt( targetPosition );
        

	};

	// function contextmenu( event ) {

	// 	event.preventDefault();

	// }

	this.dispose = function () {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );


	};

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );

	// this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );


	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	this.handleResize();

};