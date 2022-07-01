import { useEffect, useState } from "react";
import styled from "styled-components";
import AbstractFunctionBuilder from "../function/abstractFunctionBuilder";
import StylesUtil from "../utils/stylesUtil";
import SystemUtil from "../utils/systemUtil";

namespace KinouRight {
    /**
     * 機能タブ(画面右側)
     * @param props 
     * @returns 機能タブ(画面右側)のJSX
     */
    export const Component = (props: {
        selectKinouList: AbstractFunctionBuilder.Component;
        focus: number;
    }) => {
        // 検索条件に入力された値
        const [inputValues, setInputValues] = useState<string[]>([]);
        // 検索結果に表示する値
        const [resultValue, setResultValue] = useState<string>('');

        //検索条件テキストボックスの初期値設定
        useEffect(() => {
            if (props.focus !== -1) {
                setInputValues(props.selectKinouList.getFormProps().formList.map(kinou => kinou.value));
            }
        }, [props.focus])

        let kinouInputJsxList: JSX.Element[] = [];

        if (props.focus !== -1 && inputValues.length === props.selectKinouList.getFormProps().formList.length) {
            kinouInputJsxList = inputValues.map((value, i) => {
                const kinou = props.selectKinouList.getFormProps().formList[i];

                // 入力欄のタイプ管理
                let typeJsx = <></>;

                // タイプがundefinedであれば、初期値にテキストフィールドを設定
                kinou.type == undefined ? kinou.type = 'textField' : kinou.type = kinou.type;

                switch (kinou.type) {
                    // テキストフィールド
                    case 'textField':
                        typeJsx = <input type="text" value={value} onChange={(e) => {
                            inputValues[i] = e.target.value;
                            setInputValues(inputValues.slice());
                        }}></input>;
                        break;

                    // コンボボックス
                    case 'comboBox':
                        if (kinou.optionList !== undefined) {
                            const optionJsxList = kinou.optionList.map((value, i) => {
                                return (
                                    <option value={value.optionValue} key={i}>{value.showValue}</option>
                                );
                            })

                            typeJsx = <select value={value} onChange={(e) => {
                                inputValues[i] = e.target.value;
                                setInputValues(inputValues.slice());
                            }}>
                                {optionJsxList}
                            </select>;
                        }
                        break;
                }

                return (
                    <_InputArea key={i}>
                        <_LabelName>{kinou.labelName}</_LabelName>
                        {typeJsx}
                    </_InputArea>
                );
            });
        }

        return <>
            <_RightTop>
                <_Frame>
                    {kinouInputJsxList}
                    <_Fotter>
                        <_Button isDisable={props.focus !== -1}>
                            <button onClick={() => {
                                props.selectKinouList.getFormProps().execute(inputValues, setResultValue);
                            }}>確定</button>
                        </_Button>
                        <_Button isDisable={props.focus !== -1}>
                            <button onClick={() => {
                                setInputValues(props.selectKinouList.getFormProps().formList.map(kinou => kinou.value));
                                setResultValue('');
                                return '';
                            }}>クリア</button>
                        </_Button>
                    </_Fotter>
                </_Frame>
            </_RightTop>
            <_RightBottom>
                <_TextArea isDisable={resultValue !== ''}>
                    <textarea value={resultValue} readOnly></textarea>
                </_TextArea>
            </_RightBottom>
        </>;
    }
};

export default KinouRight;

// 入力エリア
const _InputArea = styled.div`
    margin-right: ${SystemUtil.MARGIN_SIZE}px;
    width: 100%;
    & input, select {
        width: calc(100% - 10px);
        height: 20px;
        margin-left: ${SystemUtil.MARGIN_SIZE}px;
        margin-bottom: ${SystemUtil.MARGIN_SIZE}px;
        box-sizing: border-box;
    }
`;

// フレーム
const _Frame = styled.div`
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    margin-bottom: ${SystemUtil.MARGIN_SIZE}px;
    border: 1px solid;
    border-color: #b1bff5;
    overflow: auto;
    overflow-x: hidden;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
`;

// 画面右上
const _RightTop = styled.div`
    background-color: #e2e6e8;
    display: inline-block;
    margin-left: auto;
    text-align: left;
    width: 100%;
    height: 50%;
    overflow: auto;
    overflow-x: hidden;
    position: relative;
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
const _Button = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE};
    display: inline-block;
    & button {
        width: 100px;
        height: 30px;
        margin-top: ${SystemUtil.MARGIN_SIZE}px;
        margin-left: ${SystemUtil.MARGIN_SIZE}px;
        bottom: 10px;
    }
`;

// 項目名ラベル
const _LabelName = styled.div`
    font-size: ${SystemUtil.FONT_SIZE}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    font-weight: bold;
`;

// 画面右下
const _RightBottom = styled.div`
    background-color: #c0ceef;
    display: inline-block;
    margin-left: auto;
    text-align: left;
    width: 100%;
    height: 50%;
    overflow: auto;
    overflow-x: hidden;
  `;

// テキストエリア
const _TextArea = styled.div<{
    isDisable: boolean;
}>`
// 非活性処理
${props => props.isDisable ? '' : StylesUtil.IS_DISABLE}
    width: 100%;
    height: 100%;
      & textarea {
        width: calc(100% - 10px);
        height: calc(100% - 10px);
        resize: none;
        margin-left: ${SystemUtil.MARGIN_SIZE}px;
        margin-top: ${SystemUtil.MARGIN_SIZE}px;
        box-sizing: border-box;
      }
  `;