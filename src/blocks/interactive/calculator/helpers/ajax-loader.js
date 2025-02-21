export default function ajaxLoader(targetEle, loaderClass, setRelative, hideChildren) {
    let targetEleFetch = document.querySelector(targetEle);
    let loader = `<div class="lds-ring ${loaderClass}"><div></div><div></div><div></div><div></div></div>`;
    
    // Disable calculate button
    targetEleFetch.closest('.mukuru-calculator').querySelector('.wp-block-button__link').style.pointerEvents = "none";
    targetEleFetch.closest('.mukuru-calculator').querySelector('.wp-block-button__link').style.opacity = "0.3";
    targetEleFetch.closest('.mukuru-calculator').querySelectorAll('.selected_currency').forEach(ele => {
        ele.style.pointerEvents = "none";
        ele.style.opacity = "0.3";
    });
    
    if (setRelative === true) {
        targetEleFetch.classList.add('relative');
    }
    if (hideChildren === true) {
        Array.from(targetEleFetch.children).forEach(child => {
            child.style.transition = "opacity 0.3s";
            child.style.opacity = "0";
        });
    }
    
    setTimeout(() => {
        targetEleFetch.insertAdjacentHTML('beforeend', loader);
    }, 300);
}