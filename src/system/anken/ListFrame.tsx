import styled from "styled-components";
import StylesUtil from "../utils/stylesUtil";
import SystemUtil from "../utils/systemUtil";

namespace ListFrame {
    export type ButtonProps = {
        // ボタン名
        labelName: string;
        // 活性・非活性
        isDisable: boolean;
        // ボタン押下時の処理
        execute: () => void;
    }

    /**
     * 案件(汎用部)
     * @param props 
     * @returns 案件(汎用部)のJSX
     */
    export const Component = (props: {
        ListJsx: JSX.Element[];
        operationJsx: ButtonProps[];
    }) => {
        const operationJsx = props.operationJsx.map((value, i) =>
            <_Button key={i} isDisable={value.isDisable} onClick={() => {
                value.execute();
            }}>{value.labelName}</_Button>
        );

        return (
            <_Frame>
                <_Detail>{props.ListJsx}</_Detail>
                <_footer>{operationJsx}</_footer>
            </_Frame>
        );
    }
};

export default ListFrame;

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

// 追加・更新・削除ボタン
const _Button = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE}
    background-color: #eef5ff;
    display: inline-block;
    font-size: ${SystemUtil.FONT_SIZE}px;
    width: 80px;
    height: calc(100% - 10px);
    text-align: center;
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    border: 1px solid #919191;
    border-radius: 5px;
    &:hover {
        background-color:#b1bff5;
    }
`;


