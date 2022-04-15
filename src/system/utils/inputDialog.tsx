import { useContext, useState } from "react";
import styled from "styled-components";
import { GlobalContext } from "../mainFrame";

export type FormInfo = {
    // 項目名label
    labelName: string;
    // 項目の値
    value: string;
    // 入力欄のタイプ
    type?: string;
}

export type InputDialogProps = {
    // ダイアログに表示する情報
    formList: FormInfo[];
    // ボタン押下時の処理
    execute: (formValues: string[]) => void;
}

// 入力ダイアログ
const InputDialog = (props: InputDialogProps) => {
    // ダイアログに表示する値
    const [formValues, setFormValues] = useState<string[]>(props.formList.map((form, i) => form.value));

    const { setInputDialogProps } = useContext(GlobalContext);

    // ダイアログの入力欄作成
    const valueJsxList = props.formList.map((value, i) => {
        // 入力欄のタイプ管理
        let typeJsx = <></>;

        switch (value.type) {
            // typeがundefined
            case undefined:
                typeJsx = <input type="text" value={formValues[i]} onChange={(e) => {
                    formValues[i] = e.target.value;
                    setFormValues(formValues.slice());
                }}></input>;
                break;
            // テキストフィールド
            case 'textField':
                typeJsx = <input type="text" value={formValues[i]} onChange={(e) => {
                    formValues[i] = e.target.value;
                    setFormValues(formValues.slice());
                }}></input>;
                break;
            // テキストエリア
            case 'textArea':
                typeJsx = <textarea onChange={(e) => {
                    formValues[i] = e.target.value;
                    setFormValues(formValues.slice());
                }}></textarea>;
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
            <_Dialog isDisplay={true}>
                <dialog>
                    {valueJsxList}
                    <button onClick={() => {
                        props.execute(formValues);
                        setInputDialogProps(null);
                    }}>更新</button>
                    <button onClick={() => {
                        setInputDialogProps(null);
                    }}>キャンセル</button>
                </dialog>
            </_Dialog>
        </>
    )
}

export default InputDialog;

// ダイアログ
const _Dialog = styled.div<{
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
    & dialog {
        background-color: #dbdcfc;
        display: inline-block;
        width: 50%;
        height: 300px;
        top: 50%;
        left: 50%;
        padding: 2%;
        transform: translate(-50%,-50%);
        border: 1px solid #3c3c3c;
        overflow-y: auto;
    }
    & input {
        width: 100%;
        height: 20px;
    }
    & textarea {
        width: 100%;
        height: 250px;
        resize: none;
    }
    & button {
        width: 100px;
        height: 30px;
        margin-top: 5px;
        margin-right: 5px;
        bottom: 10px;
    }
`;

// 項目名ラベル
const _LabelName = styled.div`
    font-size: 15px;
    margin-left: 5px;
    font-weight: bold;
`;