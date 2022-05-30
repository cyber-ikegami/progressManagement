import { useContext, useEffect, useMemo } from "react";
import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import SystemUtil from "../utils/systemUtil";
import AnkenChild from "./ankenChild";
import StylesUtil from "../utils/stylesUtil";
import { GlobalContext } from "../mainFrame";
import QueryUtil from "../utils/queryUtil";

// 案件履歴タブ
const AnkenRireki = (props: {
    selectAnken: AnkenInfo;
    updateRireki: Function;
    updateAnken: () => void;
    focus: number;
}) => {
    const { setInputDialogProps } = useContext(GlobalContext);

    useEffect(() => {
        if (props.selectAnken.rirekiList == null) {
            QueryUtil.findRirekiList(props.selectAnken.ankenid).then(value => {
                props.updateRireki(value);
            });
        }
    }, [props.focus, props.selectAnken.rirekiList]);

    // console.log(props.selectAnken);
    // console.log(props.focus);
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
        <_Button isDisable={true} onClick={() => {
            setInputDialogProps(
                {
                    formList: [{ labelName: '状態', value: '' }, { labelName: '備考', value: '' }, { labelName: '緊急度', value: '0', type: 'number' }],
                    heightSize: SystemUtil.ANKEN_RIREKI_TUIKA_DIALOG_HEIGTH,
                    execute: (values) => {
                        QueryUtil.findMaxRirekiseq(props.selectAnken.ankenid).then(value => {
                            const nextRirekiseq = value[0].maxSeq == null ? '0' : value[0].maxSeq + 1;

                            QueryUtil.insertRireki(props.selectAnken.ankenid, values[0], values[1], nextRirekiseq).then(() => {
                                QueryUtil.updateAnkenStatus(props.selectAnken.ankenid, values[2], getSystemDate());
                                props.selectAnken.rirekiList = null;
                                props.selectAnken.status = Number(values[2]);
                                props.selectAnken.update_dy = getSystemDate();
                                props.updateAnken();
                            })
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

// システム日付の取得
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