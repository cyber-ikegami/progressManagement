import styled from "styled-components";
import AbstractFunctionBuilder from "../function/abstractFunctionBuilder";

const KinouInput = (props: {
    kinouList: AbstractFunctionBuilder[];
    focus: number;
}) => {
    let kinouInputJsxList: JSX.Element[] = [];
    if (props.focus !== -1) {
        kinouInputJsxList = props.kinouList[props.focus].getFunctionList().formList.map((kinou, i) => {
            return (
                <_InputArea key={i}>
                    <_LabelName>{kinou.labelName}</_LabelName>
                    <input type="text" value={kinou.value} onChange={(e) => {
                        
                    }}></input>
                </_InputArea>
            );
        });
    }

    return <>
        {kinouInputJsxList}
        <_Fotter>
            <_Button>
                <button onClick={() => {
                }}>確定</button>
            </_Button>
            <_Button>
                <button onClick={() => {
                }}>クリア</button>
            </_Button>
        </_Fotter>
    </>;
}

export default KinouInput;

// 入力エリア
const _InputArea = styled.div`
    margin-right: 5px;
    width: 100%;
    & input {
        width: calc(100% - 10px);
        height: 20px;
        margin-left: 5px;
        margin-bottom: 5px;
        box-sizing: border-box;
    }
`;

// フッター
const _Fotter = styled.div`
    background-color: #979bfb;
    display: inline-block;
    position: absolute;
    bottom: 5px;
    width: calc(100% - 10px);
    height: 40px;
`;

// ボタン
const _Button = styled.div`
    display: inline-block;
    & button {
        width: 100px;
        height: 30px;
        margin-top: 5px;
        margin-left: 5px;
        bottom: 10px;
    }
`;

// 項目名ラベル
const _LabelName = styled.div`
    font-size: 15px;
    margin-left: 5px;
    font-weight: bold;
`;
