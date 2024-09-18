
	$( '.wwx-tabs-wrap' ).each( function( a ) {
		var ktStartTab = $( this ).find( '> .wwx-tabs-title-list .wwx-tab-title-active > a' ).attr( 'data-tab' );

		$( this ).find( '> .wwx-tabs-content-wrap > .wwx-tab-inner-content' ).attr( {
			role: 'tabpanel',
			'aria-hidden': 'true',
		} );
		if ( window.location.hash == '' ) {
			$( this ).find( '.wwx-tabs-content-wrap > .wwx-inner-tab-' + ktStartTab ).attr( 'aria-hidden', 'false' ).addClass('active');
			$( this ).find( '> .wwx-tabs-title-list li:not(.wwx-tab-title-active) a' ).each( function() {
				$( this ).attr( {
					role: 'tab',
					'aria-selected': 'false',
					tabindex: '-1',
				} ).parent().attr( 'role', 'presentation' );
			} );
			$( this ).find( '> .wwx-tabs-title-list li.wwx-tab-title-active a' ).attr( {
				role: 'tab',
				'aria-selected': 'true',
				tabindex: '0',
			} ).parent().attr( 'role', 'presentation' );
		}

	} );

    $( '.wwx-create-accordion' ).find( '> .wwx-tabs-title-list .wwx-title-item' ).each( function() {
		var tabId = $( this ).find( 'a' ).attr( 'data-tab' );
		var activeclass;

		if ( $( this ).hasClass( 'wwx-tab-title-active' ) ) {
			activeclass = 'wwx-tab-title-active';
		} else {
			activeclass = 'wwx-tab-title-inactive';
		}

		$( this ).closest( '.wwx-tabs-wrap' ).find( '> .wwx-tabs-content-wrap > .wwx-inner-tab-' + tabId ).before( '<div class="wwx-tabs-accordion-title wwx-tabs-accordion-title-' + tabId + ' ' + activeclass +'">' + $( this ).html() + '</div>' );
	} );

	$( document).on("click", '.wwx-tabs-title-list li a' , function( e ) {
		e.preventDefault();
		var tabId = $( this ).attr( 'data-tab' );

		$( this ).closest( '.wwx-tabs-title-list' ).find( '.wwx-tab-title-active' )
			.addClass( 'wwx-tab-title-inactive' )
			.removeClass( 'wwx-tab-title-active' )
			.find( 'a.wwx-tab-title' ).attr( {
				tabindex: '-1',
				'aria-selected': 'false',
			} );
		$( this ).closest( '.wwx-tabs-wrap' ).removeClass( function( index, className ) {
			return ( className.match( /\bwwx-active-tab-\S+/g ) || [] ).join( ' ' );
		} ).addClass( 'wwx-active-tab-' + tabId );
		$( this ).parent( 'li' ).addClass( 'wwx-tab-title-active' ).removeClass( 'wwx-tab-title-inactive' );
		$( this ).attr( {
			tabindex: '0',
			'aria-selected': 'true',
		} ).focus();
		$( this ).closest( '.wwx-tabs-wrap' ).find( '.wwx-tabs-content-wrap > .wwx-tab-inner-content:not(.wwx-inner-tab-' + tabId + ')' ).attr( 'aria-hidden', 'true' ).removeClass('active');
		$( this ).closest( '.wwx-tabs-wrap' ).find( '.wwx-tabs-content-wrap > .wwx-inner-tab-' + tabId ).attr( 'aria-hidden', 'false' ).addClass('active');
		$( this ).closest( '.wwx-tabs-wrap' ).find( '.wwx-tabs-content-wrap > .wwx-tabs-accordion-title:not(.wwx-tabs-accordion-title-' + tabId + ')' ).addClass( 'wwx-tab-title-inactive' ).removeClass( 'wwx-tab-title-active' ).attr( {
			tabindex: '-1',
			'aria-selected': 'false',
		} );
		$( this ).closest( '.wwx-tabs-wrap' ).find( '.wwx-tabs-content-wrap > .wwx-tabs-accordion-title.wwx-tabs-accordion-title-' + tabId ).addClass( 'wwx-tab-title-active' ).removeClass( 'wwx-tab-title-inactive' ).attr( {
			tabindex: '0',
			'aria-selected': 'true',
		} );
		var resizeEvent = window.document.createEvent( 'UIEvents' );
		resizeEvent.initUIEvent( 'resize', true, false, window, 0 );
		window.dispatchEvent( resizeEvent );
		var tabEvent = window.document.createEvent( 'UIEvents' );
		tabEvent.initUIEvent( 'wwx-tabs-open', true, false, window, 0 );
		window.dispatchEvent( tabEvent );
	} );



    $(document).on("click",'.wwx-tabs-accordion-title a' , function (e) {
		e.preventDefault();
		var tabId = $( this ).attr( 'data-tab' );
		if ( $( this ).parent( '.wwx-tabs-accordion-title' ).hasClass( 'wwx-tab-title-active' ) ) {
			$( this ).closest( '.wwx-tabs-wrap' ).removeClass( 'wwx-active-tab-' + tabId );
			$( this ).closest( '.wwx-tabs-wrap' ).find('.wwx-inner-tab-'+tabId).removeClass( 'active' );
			$( this ).parent( '.wwx-tabs-accordion-title' ).removeClass( 'wwx-tab-title-active' ).addClass( 'wwx-tab-title-inactive' );
		} else {
			$( this ).closest( '.wwx-tabs-wrap' ).removeClass( function( index, className ) {
				return ( className.match( /\bwwx-active-tab-\S+/g ) || [] ).join( ' ' );
			} ).addClass( 'wwx-active-tab-' + tabId );
			$( this ).closest( '.wwx-tabs-wrap' ).addClass( 'wwx-active-tab-' + tabId );
			$( this ).closest( '.wwx-tabs-wrap' ).find( 'ul .wwx-title-item-' + tabId ).addClass( 'wwx-tab-title-active' ).removeClass( 'wwx-tab-title-inactive' );
			$( this ).parent( '.wwx-tabs-accordion-title' ).addClass( 'wwx-tab-title-active' ).removeClass( 'wwx-tab-title-inactive' );
			$( this ).closest( '.wwx-tabs-wrap' ).find('.wwx-inner-tab-'+tabId).addClass( 'active' );


		}
		var resizeEvent = window.document.createEvent( 'UIEvents' );
		resizeEvent.initUIEvent( 'resize', true, false, window, 0 );
		window.dispatchEvent( resizeEvent );
		var tabEvent = window.document.createEvent( 'UIEvents' );
		tabEvent.initUIEvent( 'wwx-tabs-open', true, false, window, 0 );
		window.dispatchEvent( tabEvent );
	} );

	function wwx_anchor_tabs() {
		if ( window.location.hash != '' ) {
			if ( $( window.location.hash + '.wwx-title-item' ).length ) {
				var tabid = window.location.hash.substring(1);
				var tabnumber = $( '#' + tabid + ' a' ).attr( 'data-tab' );
				$( '#' + tabid ).closest( '.wwx-tabs-title-list' ).find( '.wwx-tab-title-active' )
					.addClass( 'wwx-tab-title-inactive' )
					.removeClass( 'wwx-tab-title-active' );
				$( '#' + tabid ).closest( '.wwx-tabs-wrap' ).removeClass( function( index, className ) {
					return ( className.match( /\bwwx-active-tab-\S+/g ) || [] ).join( ' ' );
				} ).addClass( 'wwx-active-tab-' + tabnumber );
				$( '#' + tabid ).addClass( 'wwx-tab-title-active' );
				$( '#' + tabid ).closest( '.wwx-tabs-wrap' ).find( '.wwx-tabs-accordion-title.wwx-tabs-accordion-title-' + tabnumber ).removeClass( 'wwx-tab-title-inactive' );

				$( '#' + tabid ).closest( '.wwx-tabs-wrap' ).find( '.wwx-tabs-content-wrap > .wwx-tab-inner-content.active' + tabnumber ).attr( 'aria-hidden', 'true' ).removeClass('active');
				$( '#' + tabid ).closest( '.wwx-tabs-wrap' ).find( '.wwx-tabs-content-wrap > .wwx-inner-tab-' + tabnumber ).attr( 'aria-hidden', 'false' ).addClass('active');
			}
		}
	}
	window.addEventListener( 'hashchange', wwx_anchor_tabs, false );
	wwx_anchor_tabs();