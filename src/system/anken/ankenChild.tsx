import styled from "styled-components";
import SystemUtil from "../utils/systemUtil";

namespace AnkenChild {
    /**
     * 案件(汎用部)
     * @param props 
     * @returns 案件(汎用部)のJSX
     */
    export const Component = (props: {
        detailJsx: JSX.Element;
        footerJsx: JSX.Element;
    }) => {
        return (
            <_Frame>
                <_Detail>{props.detailJsx}</_Detail>
                <_footer>{props.footerJsx}</_footer>
            </_Frame>
        );
    }
};

export default AnkenChild;

// フレーム
const _Frame = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: hidden;
`;

// 項目
const _Detail = styled.div`
    width: 100%;
    height: calc(100% - ${SystemUtil.TAB_AREA_HEIGTH}px);
    overflow-y: auto;
    & select, input {
        width: calc(100% - 10px);
        height: ${SystemUtil.KENSAKU_JOKEN_TEXT_HEIGHT}px;
        margin-left: ${SystemUtil.MARGIN_SIZE}px;
        margin-bottom: ${SystemUtil.MARGIN_SIZE}px;
        box-sizing: border-box;  
    }
    & textarea {
        width: calc(100% - 10px);
        height: 250px;
        resize: none;
        margin-left: ${SystemUtil.MARGIN_SIZE}px;
        margin-top: ${SystemUtil.MARGIN_SIZE}px;
        box-sizing: border-box; 
    }
`;

// フッター(下部ボタンエリア)
const _footer = styled.div`
    display: 'inline-block';
    background-color: #a2a7ff;
    width: 100%;
    height: ${SystemUtil.TAB_AREA_HEIGTH}px;
`;



