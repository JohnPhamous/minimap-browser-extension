import html2canvas from "html2canvas";

const minimapContainer = document.createElement("div");
minimapContainer.id = "__minimapContainer__";
minimapContainer.setAttribute("data-html2canvas-ignore", "");
minimapContainer.style.position = "fixed";
minimapContainer.style.width = "200px";
minimapContainer.style.border = "8px solid hsl(60 7.7% 97.5%)";
minimapContainer.style.borderRadius = "16px";
minimapContainer.style.zIndex = "9999";
minimapContainer.style.top = "32px";
minimapContainer.style.right = "32px";
minimapContainer.style.maxHeight = "90vh";
minimapContainer.style.boxShadow = "0 30px 60px rgba(0,0,0,0.12)";
minimapContainer.style.overflow = "hidden";

const scrollPositionIndicator = document.createElement("div");
scrollPositionIndicator.style.position = "absolute";
scrollPositionIndicator.style.width = "90%";
scrollPositionIndicator.style.backgroundColor = "rgba(94, 176, 239, 0.125)";
scrollPositionIndicator.style.marginLeft = "8px";
scrollPositionIndicator.style.height = "24px";
scrollPositionIndicator.style.borderRadius = "8px";
scrollPositionIndicator.style.border = "2px solid hsl(206 81.9% 65.3%)";

document.addEventListener("scroll", function (e) {
  const documentHeight = window.innerHeight;
  const currentScrollPosition = window.scrollY;
  const scrollPercentage = currentScrollPosition / documentHeight;
  const minimapHeight = minimapContainer.offsetHeight;

  const newIndicatorPosition = minimapHeight * scrollPercentage;
  scrollPositionIndicator.style.transform = `translateY(${newIndicatorPosition}px)`;
});

minimapContainer.addEventListener("click", function (e) {
  const minimapHeight = minimapContainer.offsetHeight;
  const clickRelativeY = e.layerY;
  const percentage = clickRelativeY / minimapHeight;
  const documentHeight = window.innerHeight;
  const scrollToPosition = documentHeight * percentage;

  window.scroll({
    behavior: "smooth",
    top: `${scrollToPosition}`,
  });
});

html2canvas(document.body, {
  useCORS: true,
  allowTaint: true,
  foreignObjectRendering: true,
}).then(function (canvas) {
  canvas.style.width = "100%";
  canvas.style.height = "fit-content";
  canvas.style.borderRadius = "8px";

  minimapContainer.appendChild(scrollPositionIndicator);
  minimapContainer.appendChild(canvas);
  document.body.appendChild(minimapContainer);
});

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, { subtree: true, childList: true });

function onUrlChange() {
  html2canvas(document.body, {
    useCORS: true,
    allowTaint: true,
    foreignObjectRendering: true,
  }).then(function (canvas) {
    canvas.style.width = "100%";
    canvas.style.height = "fit-content";
    canvas.style.borderRadius = "8px";

    while (minimapContainer.firstChild) {
      minimapContainer.removeChild(minimapContainer.firstChild);
    }

    minimapContainer.appendChild(scrollPositionIndicator);
    minimapContainer.appendChild(canvas);
    document.body.appendChild(minimapContainer);
  });
}
