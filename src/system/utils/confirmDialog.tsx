import { useContext } from "react";
import styled from "styled-components";
import { GlobalContext } from "../mainFrame";

export type ConfirmDialogProps = {
    // Cancelボタンのラベル名
    cancelName: string;
    // Enterボタンのラベル名
    enterName: string;
    // 確認メッセージ
    message: string;
    // ボタン押下時の処理
    execute: () => void;
}

// 確認ダイアログ
const ConfirmDialog = (props: ConfirmDialogProps) => {
    const { setConfirmDialogProps } = useContext(GlobalContext);

    return (
        <>
            <_Dialog isDisplay={true}>
                <dialog>
                    <_Message>{props.message}</_Message>
                    <button onClick={() => {
                        props.execute();
                        setConfirmDialogProps(null);
                    }}>{props.enterName}</button>
                    <button onClick={() => {
                        setConfirmDialogProps(null);
                    }}>{props.cancelName}</button>
                </dialog>
            </_Dialog>
        </>
    )
}

export default ConfirmDialog;

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
        height: 100px;
        top: 50%;
        left: 50%;
        padding: 2%;
        transform: translate(-50%,-50%);
        border: 1px solid #3c3c3c;
    }
    & button {
        width: 100px;
        height: 30px;
        margin-top: 5px;
        margin-right: 5px;
        bottom: 10px;
    }
`;

// 確認メッセージ
const _Message = styled.div`
    font-size: 15px;
    margin-left: 5px;
`;