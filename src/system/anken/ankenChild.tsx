import styled from "styled-components";
import SystemUtil from "../utils/systemUtil";

// 案件(汎用部)
const AnkenChild = (props: {
    detailJsx: JSX.Element | JSX.Element[];
    footerJsx: JSX.Element;
}) => {
    return (
        <_Frame>
            <_Detail>{props.detailJsx}</_Detail>
            <_footer>{props.footerJsx}</_footer>
        </_Frame>
    );
}

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
        height: ${SystemUtil.JOKEN_TEXT_HEIGHT}px;
        margin-left: 5px;
        margin-bottom: 5px;
        box-sizing: border-box;  
    }
    & textarea {
        width: calc(100% - 10px);
        height: 250px;
        resize: none;
        margin-left: 5px;
        margin-top: 5px;
        box-sizing: border-box; 
    }
`;

// フッター(下部ボタンエリア)
const _footer = styled.div`
    background-color: #a2a7ff;
    display: inline-block;
    width: 100%;
    height: ${SystemUtil.TAB_AREA_HEIGTH}px;\
`;



