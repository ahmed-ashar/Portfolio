// Stores the pointer entry point on the element so the CSS circle in `.ripple`
// grows from the side the visitor actually hovered.
export function startRipple(event) {
  trackRippleHover();
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  element.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
  element.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
}

// The decorative cursor blob would otherwise sit behind the button and read as
// a second circle animating on top of the ripple, so it fades out whenever the
// pointer is over a ripple button. One hover design, one circle.
let tracking = false;

function trackRippleHover() {
  if (tracking || typeof document === "undefined") return;
  tracking = true;
  window.addEventListener(
    "pointerover",
    (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const overRipple = Boolean(event.target?.closest?.(".ripple"));
      document.body.classList.toggle("ripple-hover", overRipple);
    },
    { passive: true }
  );
  window.addEventListener(
    "pointerleave",
    () => document.body.classList.remove("ripple-hover"),
    { passive: true }
  );
}

export function startRippleTracking() {
  trackRippleHover();
}
