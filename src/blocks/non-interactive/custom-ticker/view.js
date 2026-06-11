const waitForImages = (block) => {
	const images = Array.from(block.querySelectorAll('img'));
	if (!images.length) {
		return Promise.resolve();
	}

	return Promise.all(
		images.map((img) => {
			if (img.complete && img.naturalWidth > 0) {
				return Promise.resolve();
			}

			return new Promise((resolve) => {
				img.addEventListener('load', resolve, { once: true });
				img.addEventListener('error', resolve, { once: true });
			});
		})
	);
};

const waitForFonts = () => {
	if (document.fonts && document.fonts.ready) {
		return document.fonts.ready;
	}

	return Promise.resolve();
};

const normalizeSetWidth = (block) => {
	const viewport = block.querySelector('.ticker-track');
	const firstSet = block.querySelector('.track-set:first-child');
	const secondSet = block.querySelector('.track-set:last-child');

	if (!viewport || !firstSet || !secondSet) {
		return;
	}

	if (!firstSet.dataset.baseHtml) {
		firstSet.dataset.baseHtml = firstSet.innerHTML;
	}
	if (!secondSet.dataset.baseHtml) {
		secondSet.dataset.baseHtml = secondSet.innerHTML;
	}

	const baseHtml = firstSet.dataset.baseHtml;
	firstSet.innerHTML = baseHtml;

	const targetWidth = viewport.clientWidth + 1;
	let guard = 0;
	while (firstSet.scrollWidth < targetWidth && guard < 8) {
		firstSet.innerHTML += baseHtml;
		guard += 1;
	}

	secondSet.innerHTML = firstSet.innerHTML;

	const distance = Math.ceil(firstSet.getBoundingClientRect().width);
	block.style.setProperty('--ticker-distance', `-${distance}px`);
};

const initializeTicker = async (block) => {
	block.classList.add('is-initializing');

	await Promise.all([waitForFonts(), waitForImages(block)]);

	// Wait for layout after assets load.
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			normalizeSetWidth(block);
			block.classList.remove('is-initializing');
			block.classList.add('is-ready');
		});
	});
};

const initBlock = (block) => {
	initializeTicker(block);

	const onResize = () => {
		block.classList.add('is-initializing');
		normalizeSetWidth(block);
		block.classList.remove('is-initializing');
		block.classList.add('is-ready');
	};

	if (window.ResizeObserver) {
		const viewport = block.querySelector('.ticker-track');
		if (viewport) {
			const observer = new ResizeObserver(onResize);
			observer.observe(viewport);
		}
	} else {
		window.addEventListener('resize', onResize);
	}
};

const bootstrap = () => {
	const blocks = document.querySelectorAll('.wp-block-wwx-custom-ticker');
	blocks.forEach(initBlock);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', bootstrap);
} else {
	bootstrap();
}
