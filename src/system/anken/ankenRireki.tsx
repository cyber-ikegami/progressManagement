import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import { sendQueryRequestToAPI } from "../utils/dataBaseUtil";
import SystemUtil from "../utils/systemUtil";
import AnkenChild from "./ankenChild";
import StylesUtil from "../utils/stylesUtil";
import { GlobalContext } from "../mainFrame";

// 案件履歴タブ
const AnkenRireki = (props: {
    selectAnken: AnkenInfo;
    updateRireki: Function;
    focus: Number;
}) => {
    // 現在選択している箇所
    const [focus, setFocus] = useState<number>(-1);

    const { setInputDialogProps } = useContext(GlobalContext);

    useEffect(() => {
        setFocus(-1);
        if (props.selectAnken.rirekiList == null) {
            findRirekiList(props.selectAnken.ankenid).then(value => {
                props.updateRireki(value);
            });
        }
    }, [props.focus, props.selectAnken.rirekiList]);

    // 履歴項目
    const detailJsx: JSX.Element[] = useMemo(() => {
        if (props.selectAnken.rirekiList != null) {
            return props.selectAnken.rirekiList.map((value, i) =>
                <_RirekiLabel key={i} onClick={() => {
                    setFocus(i);
                }}>
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
        <_Button isDisable={true} onClick={() => {
            setInputDialogProps(
                {
                    formList: [{ labelName: '状態', value: '' }, { labelName: '備考', value: '' }, { labelName: '緊急度', value: '' }],
                    heightSize: SystemUtil.ANKEN_RIREKI_TUIKA_DIALOG_HEIGTH,
                    execute: (values) => {
                        console.log(values);
                        findMaxRirekiseq(props.selectAnken.ankenid).then(value => {
                            const nextRirekiseq = value[0].maxSeq == null ? '0' : value[0].maxSeq + 1;
                            insertRireki(props.selectAnken.ankenid, values, nextRirekiseq);
                            
                            updateAnkenStatus(props.selectAnken.ankenid, values, nextRirekiseq);
                            props.selectAnken.rirekiList = null;
                        });
                    }
                }
            );
        }}>追加</_Button>
    </>;

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

// 履歴連番の最大値を取得
const findMaxRirekiseq = async (ankenid: number) => {
    const response = await sendQueryRequestToAPI('select',
        `SELECT max(rirekiseq) as maxSeq from rireki where ankenid = '${ankenid}'`);
    const results = await response.json();
    return results;
};

// 追加
const insertRireki = async (ankenid: number, values: string[], rirekiseq: number) => {
    await sendQueryRequestToAPI('update',
        `INSERT INTO jisseki values ('${ankenid}', '${rirekiseq}', '${values[0]}', '${values[1]}')`);
};

const updateAnkenStatus = async (ankenid: number, values: string[], rirekiseq: number) => {
    const sql = `UPDATE anken SET status = '${values[2]}', update_dy = '${getSystemDate()}' where ankenid = ${ankenid}`;
    console.log(sql);
    await sendQueryRequestToAPI('update',
    sql
    );
};

// システム日付の取得
const getSystemDate = () => {
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return year + '/' + month + '/' + day;
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

// 追加・更新・削除ボタン
const _Button = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE};

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