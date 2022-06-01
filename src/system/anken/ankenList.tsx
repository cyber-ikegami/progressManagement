import { useContext, useMemo } from "react";
import styled from "styled-components";
import MainFrame from "../mainFrame";
import DialogUtil from "../utils/dialogUtil";
import InputDialog from "../utils/inputDialog";
import SystemUtil from "../utils/systemUtil";
import ListFrame from "./ListFrame";
import AnkenTab from "./ankenTab";

// 案件一覧Jsx作成
export const AnkenList = (props: {
    ankenList: AnkenTab.AnkenInfo[];
    setAnkenList: React.Dispatch<React.SetStateAction<AnkenTab.AnkenInfo[]>>;
    focus: number;
    setFocus: React.Dispatch<React.SetStateAction<number>>;
    setAnkenMode: React.Dispatch<React.SetStateAction<AnkenTab.AnkenMode>>;
    ankenStatus: string;
    setAnkenStatus: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const { setInputDialogProps, setConfirmDialogProps, daigakuInfoList } = useContext(MainFrame.GlobalContext);

    const ankenJsxList = useMemo(() => {
        return props.ankenList.map((value, i) =>
            <_AnkenLabel key={i} ankenType={value.ankentype} onClick={() => {
                props.setFocus(i);
            }}>
                <_SelectAnkenLabel isSelect={props.focus === i} />
                <_TopAnkenLabel>
                    <_Red>{value.status}</_Red>
                    <_Gray> [</_Gray>
                    <_Green>{value.ankentype}</_Green>
                    <_Gray>](</_Gray>
                    <_Blue>{value.customid === '' ? '---' : `${value.customid}:${value.daigakunam}`}</_Blue>
                    <_Gray>): {value.start_dy}～{value.update_dy}</_Gray>
                </_TopAnkenLabel>
                <_BottomAnkenLabel>
                    <_Gray>{value.ankenno} ) </_Gray>
                    <_Black>{value.title}</_Black>
                </_BottomAnkenLabel>
            </_AnkenLabel>
        );
    }, [props.ankenList, props.focus]);

    // フッター項目
    const operationJsxList: ListFrame.ButtonProps[] = [
        {
            labelName: '追加',
            isDisable: true,
            execute: () => {
                // daigakuInfoListをOption[]の型に変更
                const daigakuOptionList: InputDialog.Option[] = daigakuInfoList.map((value) => {
                    const customId = value.customid === '' ? '' : `${value.customid}：${value.daigakunam}`;
                    return { optionValue: value.customid, showValue: customId }
                });
                // 頭に空白追加
                daigakuOptionList.unshift({ optionValue: '', showValue: '' });

                // 案件追加
                setInputDialogProps(
                    DialogUtil.createAnkenDialog(daigakuOptionList, getSystemDate(), props.setAnkenMode, props.setFocus, props.setAnkenStatus, props.setAnkenList)
                );
            }
        }, {
            labelName: '更新',
            isDisable: props.focus !== -1,
            execute: () => {
                // 頭に空白追加
                const comboBoxItemList = daigakuInfoList.slice();
                comboBoxItemList.unshift({ customid: '', daigakunam: '' });

                // daigakuInfoList(comboBoxItemList)をOption[]の型に変更
                const daigakuOptionList: InputDialog.Option[] = comboBoxItemList.map((value) => {
                    const itemValue = value.customid === '' ? '' : `${value.customid}：${value.daigakunam}`;
                    return { optionValue: value.customid, showValue: itemValue }
                });

                // 案件更新
                setInputDialogProps(
                    DialogUtil.updateAnkenDialog(props.ankenList, props.focus, daigakuOptionList, props.ankenStatus, props.setAnkenMode, props.setAnkenList)
                );
            }
        }, {
            labelName: '削除',
            isDisable: props.focus !== -1,
            execute: () => {
                // 案件削除
                setConfirmDialogProps(
                    DialogUtil.deleteAnkenDialog(props.ankenList, props.focus, props.setAnkenMode, props.setFocus, props.setAnkenList)
                )
            }
        }
    ];

    return (
        <ListFrame.Component ListJsx={ankenJsxList} operationJsx={operationJsxList} />
    );

};

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

export default AnkenList;

// 案件ラベル選択時
const _SelectAnkenLabel = styled.div<{
    isSelect: boolean;
}>`
    display: ${props => props.isSelect ? 'inline-block' : 'none'};
    background-color: #fcff4b9f;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
`;

// 案件ラベル(外枠)
const _AnkenLabel = styled.div<{
    ankenType: string;
}>`
    ${props => props.ankenType !== 'SE' ? '' : `background-color: #caccff;`}
    ${props => props.ankenType !== 'EE' ? '' : `background-color: #ffd2ca;`}
    ${props => props.ankenType !== 'PKG連絡票' ? '' : `background-color: #bbefb9;`}
    display: inline-block;
    width: calc(100% - 10px);
    height: ${SystemUtil.ANKEN_LABEL_HEIGTH}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
    font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
    font-weight: bold;
    position: relative;
    &:hover {
        opacity: 0.5;
    }
`;

// 案件ラベル(内側上部)
const _TopAnkenLabel = styled.div`
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    height: 50%;
`;

// 案件ラベル(内側下部)
const _BottomAnkenLabel = styled.div`
    background-color: #f6f8ff;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    height: calc(50% - 3px);
    margin-bottom: 3px;
`;

// 赤文字(ステータス等)
const _Red = styled.span`
    color: #d80000;
`;
// 緑文字(案件タイプ等)
const _Green = styled.span`
    color: #68c05d;
`;
// 青文字(カスタムID、大学名等)
const _Blue = styled.span`
    color: #0014af;
`;
// グレー文字(開始日～終了日等)
const _Gray = styled.span`
    color: #6e768a;
`;
// 黒文字(案件名等)
const _Black = styled.span`
    color: #000000;
`;