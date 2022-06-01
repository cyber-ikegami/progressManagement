import styled from "styled-components";
import SystemUtil from "../utils/systemUtil";
import AnkenTab from "./ankenTab";

namespace AnkenSyosai {
    /**
     * 案件詳細タブ
     * @param props 
     * @returns 案件詳細タブのJSX
     */
    export const Component = (props: {
        selectAnken: AnkenTab.AnkenInfo;
    }) => {
        // 詳細項目
        return (
            <>
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
        );
    }
};

export default AnkenSyosai;

// 項目名
const _ItemName = styled.div`
    font-size: ${SystemUtil.FONT_SIZE}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    font-weight: bold;
`;

const _ItemLabel = styled.div`
    font-size: ${SystemUtil.FONT_SIZE}px;
    margin-left: 20px;
    & textarea {
        width: calc(100% - 10px);
        height: ${SystemUtil.ANKEN_SYOSAI_TEXT_HEIGTH}px;
        resize: none;
        margin-left: ${SystemUtil.MARGIN_SIZE}px;
        margin-bottom: ${SystemUtil.MARGIN_SIZE}px;
        box-sizing: border-box;
    }
`;


