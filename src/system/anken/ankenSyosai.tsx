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
        <select id='ankenType'>
            <option>{props.selectAnken.ankentype}</option>
        </select>

        <_ItemName>カスタマID</_ItemName>
        <select id='ankenType'>
            <option>
                {props.selectAnken.customid}:{props.selectAnken.daigakunam}
            </option>
        </select>

        <_ItemName>案件番号</_ItemName>
        <input type="text" value={props.selectAnken.ankenno} onChange={(e) => {

        }} />
        <_ItemName>案件タイトル</_ItemName>
        <input type="text" value={props.selectAnken.title} onChange={(e) => {

        }} />
        <_ItemName>発生日</_ItemName>
        <input type="text" value={props.selectAnken.start_dy} onChange={(e) => {

        }} />
        <_ItemName>詳細</_ItemName>
        <textarea value={props.selectAnken.detail} onChange={(e) => {

        }} /></>;

    // フッター項目
    const footerJsx = <>
        <_Button>更新</_Button></>;

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

// 更新ボタン
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


