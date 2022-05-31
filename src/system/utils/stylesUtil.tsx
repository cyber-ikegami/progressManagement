import { css } from "styled-components";

namespace StylesUtil {
    // 非活性
    export const IS_DISABLE = css`
        opacity: 0.5;
        pointer-events: none;
    `;
};

export default StylesUtil;