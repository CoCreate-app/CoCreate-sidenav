
function initialiseSideNav(sidenav) {
	
	var device = '';
	var handler;
	var main_contents;
	
	
	////   default values
	var sidenavSize = {
		expanded: '250px',
		collapsed: '50px',
		offcanvas: '0px',
	}
	
	var sidenavDefault = {
		desktop : "expanded",	 // offcanvas/collapsed/expanded/
		tablet : "collapsed",	 // offcanvas/collapsed/expanded
		phone : "offcanvas",	 // offcanvas/collapsed/expanded/
	}
	
	var sidenavDefaultValues = ['offcanvas', 'collapsed', 'expanded'];
	
	var sidenavOnToggle = {
		desktop : "collapsed",	 // offcanvas/collapsed/expanded/
		tablet : "expanded",	   // offcanvas/collapsed/expanded/
		phone : "expanded",	   // offcanvas/collapsed/expanded/
	}
	
	var sidenavOnToggleValues = ['offcanvas', 'collapsed', 'expanded'];
	
	var sidenavEffect = {
		desktop : "shrink",	 // shrink, overlay, none
		tablet : "shrink",	 // shrink, overlay, none
		phone : "overlay",	     // shrink, overlay, none
	}
	
	var sidenavEffectValues = ["shrink", "overlay", "none"];
	
	var status;              /////  availabe status: 'collapsed', 'expanded', 'offcanvas', 'resized', 'expandedOnHover'
	var expandOnHover = sidenav.getAttribute('expandOnHover') == 'false' ? false: true;
	
	var backdrop;
	
	
	getSidenavAttributes();
	getMainContents();
	initializeDevice();
	initializeSideNavHandler();
	initToggleTrigger();
	initializeHoverEffect();
	initMenuItems();
	//applyWidth();
	
	window.addEventListener('resize', initializeDevice, false);
	
	function getSidenavAttributes() {
		console.log('sidenav attributes');
		
		//// sidenav default
		var sidenav_default_desktop = sidenav.getAttribute('sidenav-default_desktop');
		var sidenav_default_tablet = sidenav.getAttribute('sidenav-default_tablet');
		var sidenav_default_phone = sidenav.getAttribute('sidenav-default_phone');
		var sidenav_default_expand_width = sidenav.getAttribute('sidenav-expanded_width');
		var sidenav_default_collapse_width = sidenav.getAttribute('sidenav-collapsed_width');
		
		console.log(sidenav_default_desktop);
		
		if (sidenavDefaultValues.indexOf(sidenav_default_desktop) > -1) {
			sidenavDefault['desktop'] = sidenav_default_desktop;
		}
		
		if (sidenavDefaultValues.indexOf(sidenav_default_tablet) > -1) {
			sidenavDefault['tablet'] = sidenav_default_tablet;
		}
		
		if (sidenavDefaultValues.indexOf(sidenav_default_phone) > -1) {
			sidenavDefault['phone'] = sidenav_default_phone;
		}
		
		if(sidenav_default_expand_width){
			sidenavSize['expanded'] = sidenav_default_expand_width;
		}
		
		if(sidenav_default_collapse_width){
			sidenavSize['collapsed'] = sidenav_default_collapse_width;
		}
		
		
		////  sidenav toggle
		var sidenav_ontoggle_desktop = sidenav.getAttribute('sidenav-ontoggle_desktop');
		var sidenav_ontoggle_tablet = sidenav.getAttribute('sidenav-ontoggle_tablet');
		var sidenav_ontoggle_phone = sidenav.getAttribute('sidenav-ontoggle_phone');
	
		
		if (sidenavOnToggleValues.indexOf(sidenav_ontoggle_desktop) > -1) {
			sidenavOnToggle['desktop'] = sidenav_ontoggle_desktop;
			
			console.log(sidenavOnToggle);
		}
		
		if (sidenavOnToggleValues.indexOf(sidenav_ontoggle_tablet) > -1) {
			sidenavOnToggle['tablet'] = sidenav_ontoggle_tablet;
			
			console.log(sidenavOnToggle);
		}
		
		if (sidenavOnToggleValues.indexOf(sidenav_ontoggle_phone) > -1) {
			sidenavOnToggle['phone'] = sidenav_ontoggle_phone;
			
			console.log(sidenavOnToggle);
		}
		
		
		
		
		/////  sidenav effect
		
		var sidenav_effect_desktop = sidenav.getAttribute('sidenav-effect_desktop');
		var sidenav_effect_tablet = sidenav.getAttribute('sidenav-effect_tablet');
		var sidenav_effect_phone = sidenav.getAttribute('sidenav-effect_phone');
		
		
		if (sidenavEffectValues.indexOf(sidenav_effect_desktop) > -1) {
			sidenavEffect['desktop'] = sidenav_effect_desktop
		}
		
		if (sidenavEffectValues.indexOf(sidenav_effect_tablet) > -1) {
			sidenavEffect['tablet'] = sidenav_effect_tablet
		}
		
		if (sidenavEffectValues.indexOf(sidenav_effect_phone) > -1) {
			sidenavEffect['phone'] = sidenav_effect_phone
		}
	}
	
	
	function initializeSideNavHandler() {
		handler = sidenav.querySelector('.resizeHandler');
		if (handler) {
			handler.addEventListener('mousedown', initialiseResize, false);
			handler.addEventListener('touchstart', initialiseResizeTouch, false);  
		}
		
		
		function initialiseResize(e) {
			console.log('initializeResize');
			window.addEventListener('mousemove', startResizing, false);
			window.addEventListener('mouseup', stopResizing, false);
			
			let iframes = document.getElementsByTagName('iframe');
			
			for (let i=0; i < iframes.length; i++) {
				let iframe = iframes[i];
				
				initializeIframe(iframe, false, null);
				
				let childIframes = iframe.contentDocument.getElementsByTagName('iframe'); 
				 
				for (let j=0; j < childIframes.length; j++) {
					initializeIframe(childIframes[j], true, iframe);
				}
			}
		}
		
		function initializeIframe(iframe, isChild, parentIframe) {
			if (isChild) {
				iframe.contentWindow.addEventListener('mousemove', function (e) {
					let clRect = iframe.getBoundingClientRect();
					let parentClRect = parentIframe.getBoundingClientRect();
					
					let clientX = e.clientX + clRect.left + parentClRect.left;
					let clientY = e.clientY + clRect.top + parentClRect.top;
					
					window.dispatchEvent(new MouseEvent('mousemove', {"clientX" : clientX, "clientY" : clientY}));
				});	
			} else {
				iframe.contentWindow.addEventListener('mousemove', function (e) {
					let clRect = iframe.getBoundingClientRect();
					
					let clientX = e.clientX + clRect.left;
					let clientY = e.clientY + clRect.top;
					
					window.dispatchEvent(new MouseEvent('mousemove', {"clientX" : clientX, "clientY" : clientY}));
				});	
			}
			
			iframe.contentWindow.addEventListener('mouseup', function (e) {
				window.dispatchEvent(new MouseEvent('mouseup'));
			});
		}
		
		function initialiseResizeTouch (e) {
			console.log('touchstart');
			window.addEventListener('touchmove', startResizingTouch, false);
			window.addEventListener('touchend', stopResizingTouch, false);
		}
		
		function startResizing(e) {
			console.log('startResizing');
			if (sidenav.classList.contains('sidenav-right')) {
				sidenav.style.width = sidenav.offsetWidth - (e.clientX - sidenav.offsetLeft) + 'px';		
			} else {
				sidenav.style.width = (e.clientX - sidenav.offsetLeft) + 'px';
			}
			
			status = 'resized';
			
			changeMainContent();
			 
			 //box.style.height = (e.clientY - box.offsetTop) + 'px';
		}
		
		function startResizingTouch(e) {
			if (sidenav.classList.contains('sidenav-right')) {
				sidenav.style.width = sidenav.offsetWidth - (e.touches[0].clientX - sidenav.offsetLeft) + 'px';
			} else {
				sidenav.style.width = (e.touches[0].clientX - sidenav.offsetLeft) + 'px';
			}
			
			status = 'resized';
			
			changeMainContent();
		}
		
		
		function stopResizing(e) {
			console.log('stopResizing');
			window.removeEventListener('mousemove', startResizing, false);
			window.removeEventListener('mouseup', stopResizing, false);
		}
		
		function stopResizingTouch(e) {
			window.removeEventListener('touchmove', startResizingTouch, false);
			window.removeEventListener('touchend', stopResizingTouch, false);
		}
	
	}
	
	function initializeDevice() {
		var screenSize = window.innerWidth;
		
		var orinalDevice = device;
		
		if (screenSize >= 1024) {
			device = 'desktop'
		} else if (screenSize < 1024 && screenSize > 768) {
			device = 'tablet';
		} else {
			device = 'phone';
		}
		
		if (orinalDevice != device) {
			applyWidth();  
		}
		
		
	}
	
	function collapsed () {
		sidenav.style.width = sidenavSize.collapsed;
		status = 'collapsed';
		
		changeMainContent();
	} 
	
	function offcanvas() {
		sidenav.style.width = sidenavSize.offcanvas;
		status = 'offcanvas';
		
		changeMainContent();
	}
	
	function expanded() {
		sidenav.style.width = sidenavSize.expanded;
		status = 'expanded';
		
		changeMainContent();
	}
	
	function applyWidth() {
		switch(sidenavDefault[device]) {
			case 'collapsed':
				collapsed(); break;
			case 'expanded':
				expanded(); break;
			case 'offcanvas':
				offcanvas(); break;
			default:
				break;
		}
	}
	
	function toggleSideNav() {
		if (status == sidenavDefault[device]) {      ///// if default
			switch(sidenavOnToggle[device]) {
				case 'collapsed':
					collapsed(); break;
				case 'expanded':
					expanded(); break;
				case 'offcanvas':
					offcanvas(); break;
				default:
					break;
			}
		} else {
			switch(sidenavDefault[device]) {
				case 'collapsed':
					collapsed(); break;
				case 'expanded':
					expanded(); break;
				case 'offcanvas':
					offcanvas(); break;
				default:
					break;
			}
		}
	}
	
	function initToggleTrigger() {
		var sidenavId = sidenav.id;
		var toggleTrigger = document.querySelector("[data-toggle_sidenav='" + sidenavId +"']");
		
		if (toggleTrigger) {
			toggleTrigger.addEventListener('click', toggleSideNav, false)
		}
	}
	
	function getMainContents() {
		var mainContentId = sidenav.getAttribute('data-main_content');
		
		if (mainContentId) {
			var array_mainContentId = mainContentId.split(',');
			var contentSelectors = array_mainContentId.reduce((a, b) => {return a + (a == '' ? '' : ',') + "[data-main_content_id='"+b+"']"}, '');
			main_contents = document.querySelectorAll(contentSelectors);
		}
	}
	
	function changeMainContent() {
		if (sidenavEffect[device] == 'shrink' || sidenavEffect[device] == 'none') {

			for (var i=0; i < main_contents.length; i++) {
				var main_content = main_contents[i];
				
				if (sidenav.classList.contains('sidenav-right')) {
					main_content.style.marginRight = sidenav.offsetWidth + 'px';
				} else {
					main_content.style.marginLeft = sidenav.offsetWidth + 'px';
				}
			}
		} else if (sidenavEffect[device] == 'overlay') {
			for (var i=0; i < main_contents.length; i++) {
				var main_content = main_contents[i];
				if (sidenav.classList.contains('sidenav-right')) {
						main_content.style.marginRight = '0px';
				} else {
						main_content.style.marginLeft = '0px';
				}
			}
			
			changeBackdrop();
		}
	}
	
	function initializeHoverEffect() {
		if (expandOnHover) {
			sidenav.addEventListener('mouseover', expandOnMouseOver, false)
		}
		
		function expandOnMouseOver() {
			if (status == 'collapsed') {
				expanded();
				status = 'expandedOnHover';
				sidenav.addEventListener('mouseout', collapseOnMouseOut, false);  
			}
		}
		
		function collapseOnMouseOut() {
			sidenav.removeEventListener('mouseout', collapseOnMouseOut, false);
			if (status = 'expandedOnHover') collapsed();
		}
	}
	
	function initMenuItems() {
		sidenav.addEventListener('click', function(e) {
			
			for (let i=0; i<e.path.length; i++) {
				let tag = e.path[i];
				
				if (tag.classList && tag.classList.contains('menuItem')) {
					clickedMenuItem(); continue;
				}
			}
		});
		
		function clickedMenuItem() {
			console.log('clicked menuItem');
			
			applyWidth();
		}
	}
	
	function changeBackdrop() {
		console.log(sidenav.style.width);
		
		if (sidenav.style.width != '0px') {
			createBackdrop();
		} else {
			console.log('remove backdrop');
			removeBackdrop();
		}
		
		function createBackdrop() {
			backdrop = document.createElement('div');
			backdrop.classList.add('backdrop');
			backdrop.setAttribute("style", "position: fixed; z-index: 8; background-color: rgba(0,0,0,0.5); width: 100vw; height: 100vh; bottom: 0;");
			
			document.body.appendChild(backdrop);
			
			backdrop.addEventListener('click', function() {
				removeBackdrop();
				toggleSideNav();
			});
		}
		
		function removeBackdrop() {
			if (backdrop) backdrop.remove();
		}
	}
	
}

const CoCreateSidenav = {
	init: function() {
		const self = this;
		let sidenavs = document.querySelectorAll('.cocreate-sidenav');
		sidenavs.forEach(item => {
			self.initElement(item)
		})
	},
	
	initElement: function(el) {
		initialiseSideNav(el);
	}
}

CoCreateSidenav.init();

export default CoCreateSidenav;
