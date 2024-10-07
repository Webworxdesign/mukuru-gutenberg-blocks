import { getElement, store, getContext } from '@wordpress/interactivity';

store('image-tooltips', {
    actions: {
        toggleEnter: () => {
            const context = getContext();
            const tooltipEle = getElement(context);

            if (tooltipEle && tooltipEle.ref) {
                const tooltipRef = tooltipEle.ref;
                const pulsingTooltipWrapper = tooltipRef.closest('.pulsing-tooltip-wrapper');

                if (pulsingTooltipWrapper && pulsingTooltipWrapper.classList.contains('has-sidebar')) {
					// get tooltipRef attr data-tooltip-index 
					const tooltipIndex = tooltipRef.getAttribute('data-tooltip-index');
					console.log('tooltipIndex', tooltipIndex);
					const sidebarTooltip = pulsingTooltipWrapper.querySelector(`.sidebar-tooltip [data-sidebar-tooltip-index="${tooltipIndex}"]`);
					if (sidebarTooltip) {
						// remove active class from all sidebar tooltips
						const allSidebarTooltips = pulsingTooltipWrapper.querySelectorAll('.sidebar-tooltip .tooltip');
						allSidebarTooltips.forEach(sidebarTooltip => {
							sidebarTooltip.classList.remove('active');
						});
						// add active class to current sidebar tooltip
						sidebarTooltip.classList.add('active');
					}
					console.log('sidebar tooltip');
                } else {
                    const tooltip = tooltipRef.querySelector('.tooltip');
                    if (tooltip) {
                        tooltip.classList.add('active');
                    }
                }
            }
        },
        toggleLeave: () => {
            const context = getContext();
            const tooltipEle = getElement(context);

            if (tooltipEle && tooltipEle.ref) {
                const tooltipRef = tooltipEle.ref;
                const tooltip = tooltipRef.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.classList.remove('active');
                }
            }
        }, 
        sidebarTooltip: () => { 
            const context = getContext();
            const tooltipEle = getElement(context);
            console.log('tooltipEle', tooltipEle);

            if (tooltipEle && tooltipEle.ref) {
                const tooltipRef = tooltipEle.ref;
                const pulsingTooltipWrapper = tooltipRef.closest('.pulsing-tooltip-wrapper');

                if (pulsingTooltipWrapper && pulsingTooltipWrapper.classList.contains('has-sidebar')) {
                    // get tooltipRef attr data-sidebar-tooltip-index
                    const sidebarTooltipIndex = tooltipRef.getAttribute('data-sidebar-tooltip-index');
                    const tooltipIndex = pulsingTooltipWrapper.querySelector(`[data-tooltip-index="${sidebarTooltipIndex}"]`);
                    if (tooltipIndex) {
                        // remove active class from all sidebar tooltips and pulsing-tooltip
                        const allTooltipsIcons = pulsingTooltipWrapper.querySelectorAll('.pulsing-tooltip');
                        allTooltipsIcons.forEach(tooltip => { 
                            // remove active class from all pulsing-tooltip
                            tooltip.classList.remove('active'); 
                        });

                        // add active class to current tooltip
                        tooltipIndex.classList.add('active');

                        // remove active class from all sidebar .tooltip
                        const allSidebarTooltips = pulsingTooltipWrapper.querySelectorAll('.sidebar-tooltip .tooltip');
                        allSidebarTooltips.forEach(sidebarTooltip => {
                            sidebarTooltip.classList.remove('active');
                        });

                        // add active class to current sidebar tooltip
                        tooltipRef.classList.add('active');
                    }
                }
            }
        }
    },
});