import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import { sendQueryRequestToAPI } from "./utils/dataBaseUtil";
import SystemUtil from "./utils/systemUtil";

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
    const rirekiJsxList: JSX.Element[] = useMemo(() => {
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

    return <>{rirekiJsxList}</>;
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
    height: ${SystemUtil.RIREKI_LABEL_HEIGTH}px;
    margin-left: 5px;
    margin-top: 5px;
    font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
    font-weight: bold;
    position: relative;
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