import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import { sendQueryRequestToAPI } from "../utils/dataBaseUtil";
import SystemUtil from "../utils/systemUtil";
import AnkenChild from "./ankenChild";

// 案件履歴タブ
const AnkenRireki = (props: {
    selectAnken: AnkenInfo;
    updateRireki: Function;
    focus: Number;
}) => {
    useEffect(() => {
        if (props.selectAnken.rirekiList == null) {
            findRirekiList(props.selectAnken.ankenid).then(value => {
                props.updateRireki(value);
            });
        }
    }, [props.focus]);

    // 履歴項目
    const detailJsx: JSX.Element[] = useMemo(() => {
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
    const footerJsx = <>
        <_Button>更新</_Button>
        <_Button>削除
        </_Button></>;

    return (
        <AnkenChild detailJsx={detailJsx} footerJsx={footerJsx}></AnkenChild>
    );
}

// SQL(履歴)取得
const findRirekiList = async (ankenid: number) => {
    const response = await sendQueryRequestToAPI('select',
        `SELECT r.rirekiseq, r.state, r.detail
    from rireki r
    inner join anken a
    on r.ankenid = a.ankenid
    where a.ankenid = '${ankenid}'
    order by r.ankenid, r.rirekiseq desc`);
    const results = await response.json();
    return results;
};

export default AnkenRireki;

// 履歴ラベル
const _RirekiLabel = styled.div`
    background-color: #bbefb9;
    display: inline-block;
    width: calc(100% - 10px);
    height: ${SystemUtil.ANKEN_RIREKI_LABEL_HEIGTH}px;
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