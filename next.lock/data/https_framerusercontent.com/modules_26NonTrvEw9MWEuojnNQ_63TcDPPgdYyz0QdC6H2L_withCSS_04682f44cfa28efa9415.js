import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
const isBrowser = typeof document !== "undefined";
const cache = new Set();
let styleSheet;
/**
 * Add CSS to the document.
 *
 * @param cssRule - CSS rule to add to the document
 */ function injectCSSRule(cssRule) {
    if (!cssRule || cache.has(cssRule) || !isBrowser) return;
    cache.add(cssRule);
    if (!styleSheet) {
        const styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.setAttribute("data-framer-css", "true");
        document.head && document.head.appendChild(styleElement);
        if (styleElement.sheet) styleSheet = styleElement.sheet;
    }
    try {
        styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
    } catch (e) {
    // Assume that errors are from malformed rules, or rules that are not
    // valid in the current browser. e.g.
    // `input[type="range"]::-moz-range-thumb` will error in Chrome, but not
    // Firefox, and swallow the error.
    }
}
/**
 * Render a React component with css that will be injected into the document's
 * head when the component is first rendered. The escapedCSS argument can either
 * be a string where each line is a css rule, or an array of css rule strings.
 */ export const withCSS = (Component, cssRules)=>/*#__PURE__*/ React.forwardRef((props, ref)=>{
        // TODO: The commented out block below is an attempt to implement SSR support a la Emotion.
        //       Unfortunately, when rehydrating it throws a warning:
        //       "Did not expect server HTML to contain a <style> in ..."
        //       If we find a solution for fixing/suppressing the warning in NextJS we should uncomment it.
        // if (!isBrowser) {
        //     const concatenatedCss = Array.isArray(cssRules) ? cssRules.join("\n") : cssRules
        //     const shouldInject = !injectedCssStrings.has(concatenatedCss)
        //     return (
        //         <>
        //             {shouldInject && <style dangerouslySetInnerHTML={{ __html: concatenatedCss }} />}
        //             <Component {...props} ref={ref} />
        //         </>
        //     )
        // }
        // We used to use useLayoutEffect for injecting styles, but this caused
        // https://github.com/framer/company/issues/22678. Situation:
        //
        //     const ContainerWithCSS = withCSS(Container, css)
        //     <ContainerWithCSS>
        //         <Component />
        //     </ContainerWithCSS>
        //
        // "Component" measures something in a useLayoutEffect on first mount.
        // useLayoutEffects fire "bottom-up", which means Component will measure
        // before ContainerWithCSS injects styles, which means the measurement
        // might be wrong.
        //
        // To prevent that, we now inject styles during the first render.
        //
        // Note that in concurrent mode, the initial render might get discarded
        // and re-tried later, and if the strict mode is any evidence, this
        // might also cause the ref to be discarded. Which means we should have
        // some second level of defense against injecting styles multiple times.
        // (Currently, CSS.setDocumentStyles takes care of that.)
        const didInjectStyles = React.useRef(false);
        if (!didInjectStyles.current) {
            cssRules.forEach((rule)=>rule && injectCSSRule(rule)
            );
            didInjectStyles.current = true;
        }
        return(/*#__PURE__*/ _jsx(Component, {
            ...props,
            ref: ref
        }));
    })
;

export const __FramerMetadata__ = {"exports":{"withCSS":{"type":"variable","annotations":{"framerContractVersion":"1"}}}}
//# sourceMappingURL=./withCSS.map