import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import { sendQueryRequestToAPI } from "../utils/dataBaseUtil";
import SystemUtil from "../utils/systemUtil";
import AnkenChild from "./ankenChild";
import { GlobalContext } from "../mainFrame";
import StylesUtil from "../utils/stylesUtil";

// 案件実績タブ
const AnkenJisseki = (props: {
    selectAnken: AnkenInfo;
    updateJisseki: Function;
    focus: Number;
}) => {
    // 現在選択している箇所
    const [focus, setFocus] = useState<number>(-1);

    const { setDialogProps } = useContext(GlobalContext);

    useEffect(() => {
        setFocus(-1);
        if (props.selectAnken.jissekiList == null) {
            findJissekiList(props.selectAnken.ankenid).then(value => {
                props.updateJisseki(value);
            });
        }
    }, [props.focus, props.selectAnken.jissekiList]);

    // 実績項目
    const detailJsx: JSX.Element[] = useMemo(() => {
        if (props.selectAnken.jissekiList != null) {
            return props.selectAnken.jissekiList.map((value, i) =>
                <_JissekiLabel key={i} onClick={() => {
                    setFocus(i);
                }}>
                    <_SelectJissekiLabel isSelect={focus === i} />
                    <_Gray>＜</_Gray>
                    <_Black>{value.sagyou_dy}</_Black>
                    <_Gray>＞ </_Gray>
                    <_Red>{value.user}</_Red>
                    <_Gray>: {value.worktype} [</_Gray>
                    <_Blue>{value.time}</_Blue>
                    <_Gray>]</_Gray>
                </_JissekiLabel>
            );
        }
        return [];
    }, [focus, props.selectAnken.jissekiList]);

    // フッター項目
    const footerJsx = <>
        <_Button isDisable={true} onClick={() => {
            setDialogProps(
                {
                    formList: [{ labelName: '作業日', value: '' }, { labelName: '作業者', value: '' }, { labelName: '作業種別', value: '' }, { labelName: '作業時間(m)', value: '' }],
                    execute: (values) => {
                        insertJisseki(props.selectAnken.ankenid, values);
                        props.selectAnken.jissekiList = null;
                    }
                }
            );
        }}>追加</_Button>
        <_Button isDisable={focus !== -1}>更新</_Button>
        <_Button isDisable={focus !== -1}>削除</_Button>
    </>;

    return (
        <AnkenChild detailJsx={detailJsx} footerJsx={footerJsx}></AnkenChild>
    );
}

// SQL(実績)取得
const findJissekiList = async (ankenid: number) => {
    const response = await sendQueryRequestToAPI('select',
        `SELECT j.sagyou_dy, j.user, j.worktype, j.time
    from jisseki j
    inner join anken a
    on j.ankenid = a.ankenid
    where a.ankenid = '${ankenid}'
    order by j.ankenid, j.sagyou_dy desc`);
    const results = await response.json();
    return results;
};

// SQL追加
const insertJisseki = async (ankenid: number, values: string[]) => {
    await sendQueryRequestToAPI('update',
        `INSERT INTO jisseki values ('${ankenid}', '999', '${values[0]}', '${values[1]}', '${values[2]}', '${values[3]}')`);
}

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
    height: ${SystemUtil.JISSEKI_LABEL_HEIGTH}px;
    margin-left: 5px;
    margin-top: 5px;
    font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
    font-weight: bold;
    position: relative;
    overflow: hidden;
    &:hover {
        opacity: 0.5;
    }
`;

// 追加・更新・削除ボタン
const _Button = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE}

    /* pointer-events: auto; */
    background-color: #eef5ff;
    display: inline-block;
    font-size: 15px;
    width: 80px;
    height: calc(100% - 10px);
    text-align: center;
    margin-top: 5px;
    margin-left: 5px;
    border: 1px solid #919191;
    border-radius: 5px;
    &:hover {
        background-color:#b1bff5;
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