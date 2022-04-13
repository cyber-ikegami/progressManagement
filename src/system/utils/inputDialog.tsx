import { useContext, useState } from "react";
import styled from "styled-components";
import { GlobalContext } from "../mainFrame";

export type FormInfo = {
    // 項目名label
    labelName: string;
    // 項目の値
    value: string;
}

export type DialogProps = {
    // ダイアログに表示する情報
    formList: FormInfo[];
    // ボタン押下時の処理
    execute: (formValues: string[]) => void;
}

const InputDialog = (props: DialogProps) => {
    // ダイアログに表示する値
    const [formValues, setFormValues] = useState<string[]>(props.formList.map((form, i) => form.value));

    const { setDialogProps } = useContext(GlobalContext);

    // ダイアログの入力欄作成
    const valueJsxList = props.formList.map((value, i) =>
        <div key={i}>
            <_LabelName>{value.labelName}</_LabelName>
            <input type="text" value={formValues[i]} onChange={(e) => {
                formValues[i] = e.target.value;
                setFormValues(formValues.slice());
            }}></input>
        </div>
    );

    return (
        <>
            <_Dialog isDisplay={true}>
                <dialog>
                    {valueJsxList}
                    <button onClick={() => {
                        props.execute(formValues);
                        setDialogProps(null);
                    }}>更新</button>
                    <button onClick={() => {
                        setDialogProps(null);
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
    z-index: 10;
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
    }
    & input {
        width: 100%;
        height: 20px;
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