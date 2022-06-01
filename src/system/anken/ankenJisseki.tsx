import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import SystemUtil from "../utils/systemUtil";
import ListFrame from "./ListFrame";
import DefineUtil from "../utils/defineUtil";
import QueryUtil from "../utils/queryUtil";
import InputDialog from "../utils/inputDialog";
import AnkenTab from "./ankenTab";
import MainFrame from "../mainFrame";
import DialogUtil from "../utils/dialogUtil";

namespace AnkenJisseki {
    export type JissekiInfo = {
        // 実績番号
        jisekiseq: number;
        // 作業日
        sagyou_dy: string;
        // 作業者
        user: string;
        // 作業種別
        worktype: string;
        // 時間(m)
        time: number;
    }

    /**
     * 案件実績タブ
     * @param props 
     * @returns 案件実績タブのJSX
     */
    export const Component = (props: {
        selectAnken: AnkenTab.AnkenInfo;
        updateJisseki: Function;
        updateAnken: () => void;
        focus: number;
    }) => {
        // 現在選択している箇所
        const [focus, setFocus] = useState<number>(-1);

        const { setInputDialogProps, setConfirmDialogProps } = useContext(MainFrame.GlobalContext);

        useEffect(() => {
            setFocus(-1);
            if (props.selectAnken.jissekiList == null) {
                QueryUtil.findJissekiList(props.selectAnken.ankenid).then(value => {
                    props.updateJisseki(value);
                });
            }
        }, [props.focus, props.selectAnken.jissekiList]);

        // 実績項目
        const detailJsxList: JSX.Element[] = useMemo(() => {
            if (props.selectAnken.jissekiList != null) {
                return props.selectAnken.jissekiList.map((value, i) => {
                    const kubun = DefineUtil.convertKubun(value.worktype);
                    return (

                        <_JissekiLabel key={i} onClick={() => {
                            setFocus(i);
                        }}>
                            <_SelectJissekiLabel isSelect={focus === i} />
                            <_Gray>＜</_Gray>
                            <_Black>{value.sagyou_dy}</_Black>
                            <_Gray>＞ </_Gray>
                            <_Red>{value.user}</_Red>
                            <_Gray>: {kubun == undefined ? 'null' : kubun.value} [</_Gray>
                            <_Blue>{value.time}</_Blue>
                            <_Gray>]</_Gray>
                        </_JissekiLabel>
                    );
                });
            }
            return [];
        }, [focus, props.selectAnken.jissekiList]);

        // フッター項目
        const operationJsxList: ListFrame.ButtonProps[] = [
            {
                labelName: '追加',
                isDisable: true,
                execute: () => {
                    const sagyouKubunOptionList: InputDialog.Option[] = DefineUtil.SAGYOU_KUBUN_LIST.map((value) => {
                        return { optionValue: value.key, showValue: value.value }
                    });
                    // 頭に空白追加
                    sagyouKubunOptionList.unshift({ optionValue: '', showValue: '' });

                    setInputDialogProps(
                        // 実績追加
                        DialogUtil.createJissekiDialog(getSystemDate(), props.selectAnken, sagyouKubunOptionList, props.updateAnken)
                    );
                }
            }, {
                labelName: '削除',
                isDisable: focus !== -1,
                execute: () => {
                    setConfirmDialogProps(
                        // 実績削除
                        DialogUtil.deleteJissekiDialog(props.selectAnken, focus)
                    )
                }
            }
        ];

        return (
            <ListFrame.Component ListJsx={detailJsxList} operationJsx={operationJsxList} />
        );
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
};
export default AnkenJisseki;

// 実績ラベル選択時
const _SelectJissekiLabel = styled.div<{
    isSelect: boolean;
}>`
    display: ${props => props.isSelect ? 'inline-block' : 'none'};
    background-color: #fcff4b9f;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
`;

// 実績ラベル
const _JissekiLabel = styled.div`
    background-color: #d6d1ac;
    display: inline-block;
    width: calc(100% - 10px);
    height: ${SystemUtil.ANKEN_JISSEKI_LABEL_HEIGTH}px;
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
// 黒文字
const _Black = styled.span`
    color: #000000;
`;