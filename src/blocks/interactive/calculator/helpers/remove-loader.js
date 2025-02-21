export default function removeLoader(targetEle) {
    let targetEleFetch = document.querySelector(targetEle);

    document.querySelector('.mukuru-calculator .wp-block-button__link').style.pointerEvents = "all";
    document.querySelector('.mukuru-calculator .wp-block-button__link').style.opacity = "1";
    targetEleFetch.closest('.mukuru-calculator').querySelectorAll('.selected_currency').forEach(ele => {
        ele.style.pointerEvents = "all";
        ele.style.opacity = "1";
    });

    Array.from(targetEleFetch.children).forEach(child => {
        child.style.transition = "opacity 1.2s";
        child.style.opacity = "1";
    });
    setTimeout(() => {
        targetEleFetch.querySelector('.lds-ring').style.display = "none";
    }, 600);
}