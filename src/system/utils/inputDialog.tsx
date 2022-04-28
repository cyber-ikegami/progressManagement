import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalContext } from "../mainFrame";
import StylesUtil from "./stylesUtil";

export type FormInfo = {
    // 項目名label
    labelName: string;
    // 項目の値
    value: string;
    // 入力欄のタイプ
    type?: string;
    // 必須フラグ
    isRequired?: boolean;
}

export type InputDialogProps = {
    // ダイアログに関する情報
    formList: FormInfo[];
    // ダイアログのheight
    heightSize?: number;
    // ボタン押下時の処理
    execute: (formValues: string[]) => void;
}

// 入力ダイアログ
const InputDialog = (props: InputDialogProps) => {
    // ダイアログに表示する値
    const [formValues, setFormValues] = useState<string[]>(props.formList.map((form, i) => (form.value)));
    // 必須項目をすべて入力しているか？
    const [isClickOk, setIsClickOk] = useState<boolean>(false);

    const { setInputDialogProps } = useContext(GlobalContext);

    // 追加確定ボタンの活性・非活性
    useEffect(() => {
        const empty = formValues.find((value, i) => {
            return props.formList[i].isRequired == true && value === '';
        });
        setIsClickOk(empty == undefined);
    }, [formValues]);

    // ダイアログの入力欄作成
    const valueJsxList = props.formList.map((value, i) => {
        // 入力欄のタイプ管理
        let typeJsx = <></>;

        // タイプがundefinedであれば、初期値にテキストフィールドを設定
        value.type == undefined ? value.type = 'textField' : value.type = value.type;

        switch (value.type) {
            // テキストフィールド
            case 'textField':
                typeJsx = <_Text isEmpty={value.isRequired == true && formValues[i] === ''}>
                    <input type="text" value={formValues[i]} onChange={(e) => {
                        formValues[i] = e.target.value;
                        setFormValues(formValues.slice());
                    }}></input>
                </_Text>;
                break;
            // テキストエリア
            case 'textArea':
                typeJsx = <_Text isEmpty={value.isRequired == true && formValues[i] === ''}>
                    <textarea onChange={(e) => {
                        formValues[i] = e.target.value;
                        setFormValues(formValues.slice());
                    }}></textarea>
                </_Text>;
                break;
        }

        return (
            <div key={i}>
                <_LabelName>{value.labelName}</_LabelName>
                {typeJsx}
            </div>
        );
    });

    return (
        <>
            <_Form isDisplay={true}>
                <_Dialog dialogHeight={props.heightSize}>
                    {/* <_Dialog> */}
                    {valueJsxList}
                    <_Fotter>
                        <_Button isDisable={isClickOk}>
                            <button onClick={() => {
                                props.execute(formValues);
                                setInputDialogProps(null);
                            }}>確定</button>
                        </_Button>
                        <_Button isDisable={true}>
                            <button onClick={() => {
                                setInputDialogProps(null);
                            }}>キャンセル</button>
                        </_Button>
                    </_Fotter>
                </_Dialog>
            </_Form>
        </>
    )
}

export default InputDialog;

// ダイアログ
const _Form = styled.div<{
    isDisplay: boolean;
}>`
    display: ${props => props.isDisplay ? 'block' : 'none'};
    background-color: #0000007f;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
`;

const _Dialog = styled.div<{
    dialogHeight: number | undefined;
}>`
    height: ${props => props.dialogHeight === undefined ? '300' : props.dialogHeight}px;
    background-color: #dbdcfc;
    display: inline-block;
    width: 300px;
    height: ${props => props.dialogHeight}px;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    border: 1px solid #3c3c3c;
    overflow-y: auto;
`;

// テキストフィールド
const _Text = styled.div<{
    isEmpty: boolean;
}>`
    margin-right: 5px;
    width: 100%;
    & input {
        background-color: ${props => props.isEmpty ? '#fffb7d' : ''};
        width: calc(100% - 20px);
        height: 20px;
        margin-left: 5px;
        margin-bottom: 5px;
    }
    & textarea {
        background-color: ${props => props.isEmpty ? '#fffb7d' : ''};
        width: calc(100% - 20px);
        height: 150px;
        resize: none;
        margin-left: 5px;
        margin-bottom: 5px;
    }
`;

// ボタンエリア
const _Fotter = styled.div`
    background-color: #979bfb;
    display: inline-block;
    width: 100%;
    height: 40px;
`;

// ボタン
const _Button = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE}
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