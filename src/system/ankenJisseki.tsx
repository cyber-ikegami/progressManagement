import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import { sendQueryRequestToAPI } from "./utils/dataBaseUtil";
import SystemUtil from "./utils/systemUtil";

// 案件詳細タブ
const AnkenJisseki = (props: {
    selectAnken: AnkenInfo;
    updateJisseki: Function;
    focus: Number;
}) => {

    useEffect(() => {
        if (props.selectAnken.jissekiList == null) {
            findJissekiList(props.selectAnken.ankenid).then(value => {
                props.updateJisseki(value);
            });
        }
    }, [props.focus]);
    const jissekiJsxList: JSX.Element[] = useMemo(() => {
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

    return <>{jissekiJsxList}</>;
}

// SQL(実績)取得
const findJissekiList = async (ankenid: number) => {
    const response = await sendQueryRequestToAPI('select',
    `SELECT j.sagyou_dy, j.user, j.worktype, j.time
    from jisseki j
    inner join anken a
    on j.ankenid = a.ankenid
    where a.ankenid = '${ankenid}'
    order by j.ankenid`);
    const results = await response.json();
    return results;
};

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
            &:hover {
                opacity: 0.5;
            }
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