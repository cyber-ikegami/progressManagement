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

/**
 * 確認ダイアログ
 * @param props 
 * @returns 確認ダイアログのJSK
 */
const ConfirmDialog = (props: ConfirmDialogProps) => {
    const { setConfirmDialogProps } = useContext(GlobalContext);

    return (
        <>
            <_Form isDisplay={true}>
                <_Dialog>
                    <_Message>{props.message}</_Message>
                    <_Fotter>
                        <_Button>
                            <button onClick={() => {
                                props.execute();
                                setConfirmDialogProps(null);
                            }}>{props.enterName}</button>
                        </_Button>
                        <_Button>
                            <button onClick={() => {
                                setConfirmDialogProps(null);
                            }}>{props.cancelName}</button>
                        </_Button>
                    </_Fotter>
                </_Dialog>
            </_Form>
        </>
    )
}

export default ConfirmDialog;

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

const _Dialog = styled.div`
    background-color: #dbdcfc;
    display: inline-block;
    width: 300px;
    height: 100px;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    border: 1px solid #3c3c3c;
`;

// ボタンエリア
const _Fotter = styled.div`
    background-color: #979bfb;
    display: inline-block;
    position: absolute;
    bottom: 0px;
    width: 100%;
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

// 確認メッセージ
const _Message = styled.div`
    font-size: 15px;
    margin-left: 10px;
    margin-top: 20px;
`;