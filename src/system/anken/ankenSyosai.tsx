import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import AnkenChild from "./ankenChild";

// 案件詳細タブ
const AnkenSyosai = (props: {
    selectAnken: AnkenInfo;
}) => {
    // 詳細項目
    const detailJsx = <>
        <_ItemName>案件種別</_ItemName>
        <_ItemLabel>{props.selectAnken.ankentype === '' ? '-' : props.selectAnken.ankentype}</_ItemLabel>

        <_ItemName>カスタマID</_ItemName>
        <_ItemLabel>{props.selectAnken.customid === '' ? '-' : `${props.selectAnken.customid}:${props.selectAnken.daigakunam}`}</_ItemLabel>

        <_ItemName>案件番号</_ItemName>
        <_ItemLabel>{props.selectAnken.ankenno === '' ? '-' : props.selectAnken.ankenno}</_ItemLabel>

        <_ItemName>案件タイトル</_ItemName>
        <_ItemLabel>{props.selectAnken.title === '' ? '-' : props.selectAnken.title}</_ItemLabel>

        <_ItemName>発生日</_ItemName>
        <_ItemLabel>{props.selectAnken.start_dy === '' ? '-' : props.selectAnken.start_dy}</_ItemLabel>

        <_ItemName>詳細</_ItemName>
        <_ItemLabel>
            <textarea value={props.selectAnken.detail === '' || props.selectAnken.detail == null ? '' : props.selectAnken.detail} readOnly />
        </_ItemLabel>
    </>

    // フッター項目
    const footerJsx = <>
        {/* <_Button>更新</_Button> */}
    </>;

    return (
        <AnkenChild detailJsx={detailJsx} footerJsx={footerJsx}></AnkenChild>
    );
}

export default AnkenSyosai;

// 項目名
const _ItemName = styled.div`
    font-size: 15px;
    margin-left: 5px;
    font-weight: bold;
`;

const _ItemLabel = styled.div`
    font-size: 15px;
    margin-left: 20px;
    & textarea {
        width: calc(100% - 10px);
        height: 200px;
        resize: none;
        margin-left: 5px;
        margin-bottom: 5px;
        box-sizing: border-box;
    }
`;


