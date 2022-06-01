import { useContext, useEffect, useMemo } from "react";
import styled from "styled-components";
import SystemUtil from "../utils/systemUtil";
import AnkenTab from "./ankenTab";
import ListFrame from "./ListFrame";
import QueryUtil from "../utils/queryUtil";
import MainFrame from "../mainFrame";
import DialogUtil from "../utils/dialogUtil";

namespace AnkenRireki {
    export type RirekiInfo = {
        // 履歴管理番号
        rirekiseq: number;
        // 状態
        state: string;
        // 備考
        detail: string;
    }

    /**
     * 案件履歴タブ
     * @param props 
     * @returns 案件履歴タブのJSX
     */
    export const Component = (props: {
        selectAnken: AnkenTab.AnkenInfo;
        updateRireki: Function;
        updateAnken: () => void;
        focus: number;
    }) => {
        const { setInputDialogProps } = useContext(MainFrame.GlobalContext);

        useEffect(() => {
            if (props.selectAnken.rirekiList == null) {
                QueryUtil.findRirekiList(props.selectAnken.ankenid).then(value => {
                    props.updateRireki(value);
                });
            }
        }, [props.focus, props.selectAnken.rirekiList]);

        // 履歴項目
        const detailJsxList: JSX.Element[] = useMemo(() => {
            if (props.selectAnken.rirekiList != null) {
                return props.selectAnken.rirekiList.map((value, i) =>
                    <_RirekiLabel key={i}>
                        <_Red>{value.rirekiseq}</_Red>
                        <_Gray>: </_Gray>
                        <_Blue>{value.state} </_Blue>
                        <_Gray>[{value.detail}]</_Gray>
                    </_RirekiLabel>
                );
            }
            return [];
        }, [props.selectAnken.rirekiList]);

        // フッター項目
        const operationJsxList: ListFrame.ButtonProps[] = [
            {
                labelName: '追加',
                isDisable: true,
                execute: () => {
                    setInputDialogProps(
                        DialogUtil.createRirekiDialog(props.selectAnken, getSystemDate(), props.updateAnken)
                    );
                }
            }
        ];

        return (
            <ListFrame.Component ListJsx={detailJsxList} operationJsx={operationJsxList} />
        );
    }
}

/**
 * システム日付の取得
 * @returns システム日付(XXXX/XX/XX)
 */
const getSystemDate = () => {
    let today = new Date();
    const year = ('0000' + today.getFullYear()).slice(-4);
    const month = ('00' + (today.getMonth() + 1)).slice(-2);
    const day = ('00' + today.getDate()).slice(-2);
    return year + '/' + month + '/' + day;
};


export default AnkenRireki;

// 履歴ラベル
const _RirekiLabel = styled.div`
    background-color: #bbefb9;
    display: inline-block;
    width: calc(100% - 10px);
    height: ${SystemUtil.ANKEN_RIREKI_LABEL_HEIGTH}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
    font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
    font-weight: bold;
    position: relative;
    overflow: hidden;
    &:hover {
        opacity: 0.5;
    }
`;

// 赤文字
const _Red = styled.span`
    color: #d80000;
`;
// 青文字
const _Blue = styled.span`
    color: #0014af;
`;
// グレー文字
const _Gray = styled.span`
    color: #6e768a;
`;