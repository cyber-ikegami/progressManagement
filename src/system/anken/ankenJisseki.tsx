import { useContext, useEffect, useMemo } from "react";
import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import { sendQueryRequestToAPI } from "../utils/dataBaseUtil";
import SystemUtil from "../utils/systemUtil";
import AnkenChild from "./ankenChild";
import { GlobalContext } from "../mainFrame";

// 案件実績タブ
const AnkenJisseki = (props: {
    selectAnken: AnkenInfo;
    updateJisseki: Function;
    focus: Number;
}) => {
    const { setDialogProps } = useContext(GlobalContext);

    useEffect(() => {
        if (props.selectAnken.jissekiList == null) {
            findJissekiList(props.selectAnken.ankenid).then(value => {
                props.updateJisseki(value);
            });
        }
    }, [props.focus]);

    // 実績項目
    const detailJsx: JSX.Element[] = useMemo(() => {
        if (props.selectAnken.jissekiList != null) {
            return props.selectAnken.jissekiList.map((value, i) =>
                <_JissekiLabel key={i}>
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
    }, [props.selectAnken.jissekiList]);

    // フッター項目
    const footerJsx = <>
        <_Button onClick={() => {
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
        <_Button>更新</_Button>
        <_Button>削除</_Button>
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
    await sendQueryRequestToAPI('insert',
    `INSERT INTO jisseki values (${ankenid}, '999', ${values[0]}, ${values[1]}, ${values[2]}, ${values[3]})`);
}

// const findNextJisekseq = async (ankenid: number) => {
//     const maxJisekseqSql = await sendQueryRequestToAPI('select',
//     `SELECT max(jisekiseq) as maxseq from jisseki where ankenid = ${ankenid}`);
//     const maxJisekseq = await maxJisekseqSql.json();
//     const nextJisekseq = maxJisekseq[0].maxseq == null ? 0 : ((maxJisekseq[0].maxseq) + 1);
//     return nextJisekseq;
// }

export default AnkenJisseki;

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

// 更新・削除ボタン
const _Button = styled.div`
    pointer-events: auto;
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